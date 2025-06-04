/**
 * 🛡️ ContentGuard v2.1 - Modern Content Analysis System
 * 
 * A lightweight, modular, and high-performance content analysis system
 * with context-aware detection and plugin architecture.
 * 
 * @author ContentGuard Contributors
 * @license MIT
 */

const PluginManager = require('./lib/core/plugin-manager')
const { LRUCache, deepMerge, fastHash, safeRegexTest } = require('./lib/utils')

// Lazy-loaded plugins
let ObscenityPlugin = null
let SentimentPlugin = null

/**
 * Main ContentGuard class - now lightweight and modular
 */
class ContentGuard {
  constructor(options = {}) {
    this.options = this.mergeDefaultOptions(options)
    this.pluginManager = new PluginManager(this.options)
    this.cache = this.options.enableCaching ? new LRUCache(this.options.cacheSize) : null
    this.metrics = this.initializeMetrics()
    
    // Auto-register and enable default plugins
    this.setupDefaultPlugins()
    
    if (this.options.debug) {
      console.log('🛡️ ContentGuard v2.0 initialized with plugins:', this.pluginManager.getEnabled())
    }
  }

  /**
   * Merge user options with intelligent defaults
   */
  mergeDefaultOptions(userOptions) {
    const defaults = {
      // Core settings
      spamThreshold: 5,
      enableEarlyExit: true,
      criticalThreshold: 20,
      
      // Performance optimization
      enableCaching: true,
      cacheSize: 1000,
      
      // Plugin configuration
      plugins: {
        obscenity: { weight: 1.0, contextAware: true },
        sentiment: { weight: 1.0, contextAware: true },
        patterns: { weight: 1.0 },
        validation: { weight: 0.5 }
      },
      
      // Feature toggles
      enableLazyLoading: true,
      debug: false,
      enableMetrics: true,
      
      // Context awareness
      contextAware: true,
      
      // Backwards compatibility
      enableLayers: userOptions.enableLayers || {},
      layerWeights: userOptions.layerWeights || {}
    }

    return deepMerge(defaults, userOptions)
  }

  /**
   * Setup default plugins with lazy loading
   */
  setupDefaultPlugins() {
    // Register built-in plugins
    this.registerBuiltinPlugins()
    
    // Enable plugins based on configuration
    this.enableConfiguredPlugins()
  }

  /**
   * Register built-in plugins
   */
  registerBuiltinPlugins() {
    // Obscenity plugin
    this.pluginManager.register('obscenity', {
      init: async (config) => {
        if (!ObscenityPlugin) {
          ObscenityPlugin = require('./lib/plugins/obscenity-plugin')
        }
        this._obscenityInstance = new ObscenityPlugin()
        await this._obscenityInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._obscenityInstance.analyze(content, input, options)
      }
    })

    // Sentiment plugin
    this.pluginManager.register('sentiment', {
      init: async (config) => {
        if (!SentimentPlugin) {
          SentimentPlugin = require('./lib/plugins/sentiment-plugin')
        }
        this._sentimentInstance = new SentimentPlugin()
        await this._sentimentInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._sentimentInstance.analyze(content, input, options)
      }
    })

    // Inline lightweight plugins
    this.registerInlinePlugins()
  }

  /**
   * Register lightweight inline plugins
   */
  registerInlinePlugins() {
    const { 
      HARASSMENT_PATTERNS, SCAM_PATTERNS, EVASION_PATTERNS, 
      GAMING_TROLL_KEYWORDS, TROLL_NAMES, HARASSMENT_KEYWORDS 
    } = require('./lib/constants/context-data')

    // Patterns plugin
    this.pluginManager.register('patterns', {
      init: (config) => { this._patternsConfig = config },
      analyze: (content, input, options) => {
        let score = 0
        const flags = []

        // Check for game development context first
        const isGameDev = content.allTextLower.includes('game') && 
                         (content.allTextLower.includes('development') || 
                          content.allTextLower.includes('developer') ||
                          content.allTextLower.includes('balance') ||
                          content.allTextLower.includes('character') ||
                          content.emailDomain.includes('game'))

        // Harassment patterns with safe regex
        HARASSMENT_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.allText)) {
            score += 6
            flags.push('Harassment pattern detected')
          }
        })

        // Scam patterns with safe regex
        SCAM_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.allText)) {
            score += 8
            flags.push('Scam pattern detected')
          }
        })

        // Enhanced doxxing/threat patterns with safe execution
        const doxxingPatterns = [
          /would be unfortunate/i,
          /personal information.*public/i,
          /find.*information.*online/i,
          /interesting.*about you/i,
          /know where you/i,
          /found.*information.*about/i
        ]
        
        doxxingPatterns.forEach(pattern => {
          if (safeRegexTest(pattern, content.allText)) {
            score += 10
            flags.push('Doxxing/threat pattern detected')
          }
        })

        // Evasion patterns - but skip "nerf" in game dev context
        EVASION_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.allText)) {
            // Special handling for game development context
            if (isGameDev && content.allTextLower.includes('nerf')) {
              // Skip this evasion detection in game dev context
              return
            }
            score += 8
            flags.push('Evasion attempt detected')
          }
        })

        // Gaming troll keywords - enhanced detection
        const trollCount = GAMING_TROLL_KEYWORDS.filter(keyword => 
          content.allTextLower.includes(keyword)
        ).length

        if (trollCount >= 5) {
          score += 6
          flags.push(`Heavy gaming troll language (${trollCount} terms)`)
        } else if (trollCount >= 3) {
          score += 4
          flags.push(`Multiple gaming troll terms (${trollCount})`)
        }

        // Enhanced toxic gaming phrases
        const toxicGamingPhrases = [
          'uninstall', 'go touch grass', 'basement dweller', 'ratio + l', 'cope harder',
          'you are trash at', 'git gud scrub', 'skill issue'
        ]
        
        const toxicCount = toxicGamingPhrases.filter(phrase =>
          content.allTextLower.includes(phrase)
        ).length
        
        if (toxicCount >= 2) {
          score += 8
          flags.push(`Toxic gaming harassment (${toxicCount} phrases)`)
        }

        // Troll names
        if (TROLL_NAMES.some(name => content.name.toLowerCase().includes(name))) {
          score += 6
          flags.push('Troll name detected')
        }

        // Direct harassment
        HARASSMENT_KEYWORDS.forEach(keyword => {
          if (content.allTextLower.includes(keyword)) {
            score += 8
            flags.push(`Direct harassment: "${keyword}"`)
          }
        })

        return { score: Math.round(score * (this._patternsConfig?.weight || 1)), flags }
      }
    })

    // Validation plugin
    this.pluginManager.register('validation', {
      init: (config) => { this._validationConfig = config },
      analyze: (content, input, options) => {
        const { isValidEmail } = require('./lib/utils')
        let score = 0
        const flags = []

        // Email validation
        if (input.email && !isValidEmail(input.email)) {
          score += 3
          flags.push('Invalid email format')
        }

        // Suspicious email patterns
        if (input.email) {
          const suspiciousPatterns = [/\d{6,}@/, /temp.*mail/i, /disposable/i]
          suspiciousPatterns.forEach(pattern => {
            if (pattern.test(input.email)) {
              score += 2
              flags.push('Suspicious email pattern')
            }
          })
        }

        return { score: Math.round(score * (this._validationConfig?.weight || 1)), flags }
      }
    })
  }

  /**
   * Enable plugins based on configuration
   */
  enableConfiguredPlugins() {
    const { plugins, enableLayers, layerWeights } = this.options

    // Handle backwards compatibility
    const pluginConfigs = {}
    
    // New plugin configuration
    if (plugins) {
      Object.assign(pluginConfigs, plugins)
    }
    
    // Backwards compatibility with old layer system
    if (enableLayers) {
      Object.entries(enableLayers).forEach(([layer, enabled]) => {
        if (enabled && !pluginConfigs[layer]) {
          pluginConfigs[layer] = { weight: layerWeights?.[layer] || 1.0 }
        }
      })
    }

    // Enable default plugins if no specific configuration
    if (Object.keys(pluginConfigs).length === 0) {
      pluginConfigs.obscenity = { weight: 1.0 }
      pluginConfigs.sentiment = { weight: 1.0 }
      pluginConfigs.patterns = { weight: 1.0 }
      pluginConfigs.validation = { weight: 0.5 }
    }

    // Enable configured plugins
    Object.entries(pluginConfigs).forEach(([name, config]) => {
      try {
        this.pluginManager.enable(name, config)
      } catch (error) {
        console.warn(`Failed to enable plugin ${name}:`, error.message)
      }
    })
  }

  /**
   * Initialize metrics collection
   */
  initializeMetrics() {
    if (!this.options.enableMetrics) return null
    
    return {
      totalAnalyses: 0,
      spamDetected: 0,
      cleanContent: 0,
      averageProcessingTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      pluginPerformance: {}
    }
  }

  /**
   * Main analysis function - now optimized and modular
   */
  async analyze(input, options = {}) {
    const startTime = Date.now()
    const analysisOptions = { ...this.options, ...options }

    // Generate cache key
    const cacheKey = this.generateCacheKey(input)
    
    // Check cache
    if (this.cache?.has(cacheKey)) {
      if (this.metrics) this.metrics.cacheHits++
      const cached = this.cache.get(cacheKey)
      return { ...cached, fromCache: true }
    }

    if (this.metrics) this.metrics.cacheMisses++

    try {
      // Prepare content
      const content = this.prepareContent(input)
      
      // Run plugin analysis with early exit optimization
      const pluginResults = await this.pluginManager.analyze(content, input)
      
      // Calculate final score and classification
      const analysis = this.calculateFinalAnalysis(pluginResults, content, input, analysisOptions)
      
      // Add metadata
      analysis.metadata = {
        processingTime: Date.now() - startTime,
        version: '2.1.0',
        enabledPlugins: this.pluginManager.getEnabled(),
        timestamp: new Date().toISOString(),
        earlyExit: pluginResults._earlyExit || false
      }

      // Update metrics
      this.updateMetrics(analysis, Date.now() - startTime)
      
      // Cache result
      if (this.cache) {
        this.cache.set(cacheKey, analysis)
      }

      return analysis

    } catch (error) {
      console.error('Analysis failed:', error)
      return this.createFallbackResult(input, error)
    }
  }

  /**
   * Prepare content for analysis
   */
  prepareContent(input) {
    const name = input.name || ''
    const email = input.email || ''
    const subject = input.subject || ''
    const message = input.message || ''

    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      allText: `${name} ${subject} ${message}`,
      allTextLower: `${name} ${subject} ${message}`.toLowerCase(),
      emailDomain: email.split('@')[1]?.toLowerCase() || ''
    }
  }

  /**
   * Calculate final analysis from plugin results
   */
  calculateFinalAnalysis(pluginResults, content, input, options) {
    // Sum plugin scores
    let totalScore = 0
    const allFlags = []

    Object.entries(pluginResults).forEach(([pluginName, result]) => {
      if (pluginName.startsWith('_')) return // Skip meta fields
      
      totalScore += result.score || 0
      if (result.flags) {
        allFlags.push(...result.flags.map(flag => `[${pluginName.toUpperCase()}] ${flag}`))
      }
    })

    // Apply positive indicators (context bonuses)
    const { contextBonus, contextFlags } = this.calculateContextBonus(content)
    totalScore += contextBonus
    allFlags.push(...contextFlags)

    // Ensure minimum score
    totalScore = Math.max(0, totalScore)

    // Determine classification
    const isSpam = totalScore >= this.options.spamThreshold
    const riskLevel = this.calculateRiskLevel(totalScore)

    return {
      score: totalScore,
      isSpam,
      riskLevel,
      threshold: this.options.spamThreshold,
      flags: allFlags,
      pluginResults,
      recommendation: this.getRecommendation(totalScore, isSpam),
      confidence: this.calculateConfidence(pluginResults)
    }
  }

  /**
   * Calculate context-based bonuses
   */
  calculateContextBonus(content) {
    const { TECHNICAL_TERMS, ACADEMIC_TERMS, BUSINESS_TERMS, MEDICAL_TERMS } = require('./lib/constants/context-data')
    
    let bonus = 0
    const flags = []

    // Technical context
    const techCount = TECHNICAL_TERMS.filter(term => 
      content.allTextLower.includes(term.toLowerCase())
    ).length
    if (techCount > 0) {
      const techBonus = -3 * Math.min(3, techCount)
      bonus += techBonus
      flags.push(`[POSITIVE] Technical context (${techCount} terms): ${techBonus} points`)
    }

    // Academic context
    const academicCount = ACADEMIC_TERMS.filter(term => 
      content.allTextLower.includes(term.toLowerCase())
    ).length
    if (academicCount > 0) {
      const academicBonus = -2 * Math.min(3, academicCount)
      bonus += academicBonus
      flags.push(`[POSITIVE] Academic context (${academicCount} terms): ${academicBonus} points`)
    }

    // Business context
    const businessCount = BUSINESS_TERMS.filter(term => 
      content.allTextLower.includes(term.toLowerCase())
    ).length
    if (businessCount > 0) {
      const businessBonus = -2 * Math.min(3, businessCount)
      bonus += businessBonus
      flags.push(`[POSITIVE] Business context (${businessCount} terms): ${businessBonus} points`)
    }

    // Medical context
    const medicalCount = MEDICAL_TERMS.filter(term => 
      content.allTextLower.includes(term.toLowerCase())
    ).length
    if (medicalCount > 0) {
      const medicalBonus = -4 * Math.min(3, medicalCount)
      bonus += medicalBonus
      flags.push(`[POSITIVE] Medical context (${medicalCount} terms): ${medicalBonus} points`)
    }

    // Professional email domains
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com']
    if (trustedDomains.includes(content.emailDomain)) {
      bonus -= 1
      flags.push(`[POSITIVE] Trusted email domain: ${content.emailDomain}`)
    }

    // Educational domains
    const eduDomains = ['.edu', '.gov', '.ac.uk', '.org']
    if (eduDomains.some(domain => content.emailDomain.includes(domain))) {
      bonus -= 4
      flags.push(`[POSITIVE] Educational/government domain: ${content.emailDomain}`)
    }

    return { contextBonus: bonus, contextFlags: flags }
  }

  /**
   * Calculate risk level
   */
  calculateRiskLevel(score) {
    if (score >= 20) return 'CRITICAL'
    if (score >= 10) return 'HIGH'
    if (score >= this.options.spamThreshold) return 'MEDIUM'
    if (score >= 2) return 'LOW'
    return 'CLEAN'
  }

  /**
   * Generate recommendation
   */
  getRecommendation(score, isSpam) {
    if (score >= 20) return `Ban user - Critical spam/harassment (Score: ${score})`
    if (score >= 10) return `Block content - Definite spam (Score: ${score})`
    if (isSpam) return `Flag for moderation - Likely spam (Score: ${score})`
    if (score >= 2) return `Review recommended - Suspicious indicators (Score: ${score})`
    return `Allow - Clean content (Score: ${score})`
  }

  /**
   * Calculate confidence based on plugin consensus
   */
  calculateConfidence(pluginResults) {
    const pluginScores = Object.values(pluginResults)
      .filter(result => typeof result === 'object' && result.score !== undefined)
      .map(result => result.score)
    
    if (pluginScores.length === 0) return 'No data'
    
    const activePlugins = pluginScores.filter(score => score > 0).length
    const totalPlugins = pluginScores.length
    const consensus = activePlugins / totalPlugins

    if (consensus >= 0.8) return 'Very high confidence'
    if (consensus >= 0.6) return 'High confidence'
    if (consensus >= 0.4) return 'Moderate confidence'
    if (consensus >= 0.2) return 'Low confidence'
    return 'Very low confidence'
  }

  /**
   * Update performance metrics
   */
  updateMetrics(analysis, processingTime) {
    if (!this.metrics) return

    this.metrics.totalAnalyses++
    
    if (analysis.isSpam) {
      this.metrics.spamDetected++
    } else {
      this.metrics.cleanContent++
    }

    // Update rolling average
    const total = this.metrics.totalAnalyses
    this.metrics.averageProcessingTime = (
      (this.metrics.averageProcessingTime * (total - 1)) + processingTime
    ) / total
  }

  /**
   * Generate cache key
   */
  generateCacheKey(input) {
    const content = `${input.name || ''}|${input.email || ''}|${input.subject || ''}|${input.message || ''}`
    return fastHash(content)
  }

  /**
   * Create fallback result when analysis fails
   */
  createFallbackResult(input, error) {
    return {
      score: 10,
      isSpam: true,
      riskLevel: 'HIGH',
      threshold: this.options.spamThreshold,
      flags: [`Analysis failed: ${error.message}`],
      recommendation: 'Manual review required - analysis failed',
      confidence: 'Error state',
      error: error.message
    }
  }

  // === Convenience Methods (Backwards Compatibility) ===

  /**
   * Quick spam check
   */
  async isSpam(text, options = {}) {
    const result = await this.analyze({ message: text }, options)
    return result.isSpam
  }

  /**
   * Get spam score only
   */
  async getScore(text, options = {}) {
    const result = await this.analyze({ message: text }, options)
    return result.score
  }

  /**
   * Add custom plugin
   */
  addPlugin(name, plugin) {
    this.pluginManager.register(name, plugin)
    return this
  }

  /**
   * Enable plugin
   */
  enablePlugin(name, config = {}) {
    this.pluginManager.enable(name, config)
    return this
  }

  /**
   * Disable plugin
   */
  disablePlugin(name) {
    this.pluginManager.disable(name)
    return this
  }

  /**
   * Get metrics
   */
  getMetrics() {
    if (!this.metrics) return { error: 'Metrics disabled' }
    
    return {
      ...this.metrics,
      spamRate: this.metrics.totalAnalyses > 0 ? 
        `${(this.metrics.spamDetected / this.metrics.totalAnalyses * 100).toFixed(1)}%` : '0%',
      cacheEfficiency: (this.metrics.cacheHits + this.metrics.cacheMisses) > 0 ?
        `${(this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100).toFixed(1)}%` : '0%'
    }
  }

  /**
   * Clear cache and metrics
   */
  reset() {
    if (this.cache) this.cache.clear()
    if (this.metrics) {
      Object.keys(this.metrics).forEach(key => {
        this.metrics[key] = typeof this.metrics[key] === 'number' ? 0 : {}
      })
    }
  }
}

// Export the class and utilities
module.exports = {
  ContentGuard,
  
  // Backwards compatibility
  UltimateAntiTroll: ContentGuard,
  
  // Convenience factory
  createFilter: (options = {}) => new ContentGuard(options),
  
  // Plugin system exports
  PluginManager: require('./lib/core/plugin-manager'),
  
  // Utility exports
  utils: require('./lib/utils'),
  
  // Constants
  constants: require('./lib/constants/context-data'),
  
  // Enhanced presets from separate module
  presets: require('./lib/presets')
} 