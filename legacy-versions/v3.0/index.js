/**
 * 🛡️ ContentGuard v3.0 - Next-Generation Content Analysis System
 * 
 * Revolutionary content analysis with sophisticated harassment detection,
 * advanced context awareness, and adversarial attack resistance.
 * 
 * @author ContentGuard Contributors
 * @license MIT
 * @version 3.0.0
 */

const PluginManager = require('./lib/core/plugin-manager')
const { LRUCache, deepMerge, fastHash, safeRegexTest } = require('./lib/utils')
const { TextPreprocessor } = require('./lib/utils/preprocessing')
const { ContextDetector } = require('./lib/core/context-detector')

// Lazy-loaded plugins
let ObscenityPlugin = null
let SentimentPlugin = null
let HarassmentPlugin = null

/**
 * ContentGuard v3.0 - The most advanced content analysis system
 */
class ContentGuard {
  constructor(options = {}) {
    this.options = this.mergeDefaultOptions(options)
    this.pluginManager = new PluginManager(this.options)
    this.cache = this.options.enableCaching ? new LRUCache(this.options.cacheSize) : null
    this.metrics = this.initializeMetrics()
    
    // v3.0 New components
    this.preprocessor = new TextPreprocessor(this.options.preprocessing || {})
    this.contextDetector = new ContextDetector(this.options.contextDetection || {})
    
    // Auto-register and enable default plugins
    this.setupDefaultPlugins()
    
    if (this.options.debug) {
      console.log('🛡️ ContentGuard v3.0 initialized with plugins:', this.pluginManager.getEnabled())
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
      
      // v3.0 Enhanced plugin configuration
      plugins: {
        obscenity: { weight: 1.0, contextAware: true },
        sentiment: { weight: 1.0, contextAware: true },
        patterns: { weight: 1.0, contextAware: true },
        validation: { weight: 0.5 },
        harassment: { weight: 1.2, contextAware: true } // New in v3.0
      },
      
      // v3.0 Preprocessing options
      preprocessing: {
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        removeExcessiveSpacing: true,
        contextAware: true
      },
      
      // v3.0 Context detection options
      contextDetection: {
        enableDomainDetection: true,
        enablePatternMatching: true,
        enableVocabularyAnalysis: true,
        confidenceThreshold: 0.3
      },
      
      // Feature toggles
      enableLazyLoading: true,
      debug: false,
      enableMetrics: true,
      
      // Context awareness
      contextAware: true,
      
      // v3.0 Advanced features
      enableAdversarialDetection: true,
      enableSophisticatedHarassment: true,
      enableContextualAdjustments: true,
      
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
    // Obscenity plugin (enhanced in v3.0)
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

    // Sentiment plugin (enhanced in v3.0)
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

    // NEW v3.0: Advanced harassment detection plugin
    this.pluginManager.register('harassment', {
      init: async (config) => {
        if (!HarassmentPlugin) {
          HarassmentPlugin = require('./lib/plugins/harassment-plugin')
        }
        this._harassmentInstance = new HarassmentPlugin()
        await this._harassmentInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._harassmentInstance.analyze(content, input, options)
      }
    })

    // Enhanced inline plugins
    this.registerInlinePlugins()
  }

  /**
   * Register lightweight inline plugins (enhanced for v3.0)
   */
  registerInlinePlugins() {
    const { 
      HARASSMENT_PATTERNS, SCAM_PATTERNS, EVASION_PATTERNS, 
      GAMING_TROLL_KEYWORDS, TROLL_NAMES, HARASSMENT_KEYWORDS 
    } = require('./lib/constants/context-data')

    // Enhanced patterns plugin with context awareness
    this.pluginManager.register('patterns', {
      init: (config) => { this._patternsConfig = config },
      analyze: (content, input, options) => {
        let score = 0
        const flags = []

        // Get context from the content
        const context = content.context || {}

        // Enhanced game development context detection
        const isGameDev = context.isTechnical || (
          content.allTextLower.includes('game') && 
          (content.allTextLower.includes('development') || 
           content.allTextLower.includes('developer') ||
           content.allTextLower.includes('balance') ||
           content.allTextLower.includes('character') ||
           content.emailDomain.includes('game'))
        )

        // v3.0: Context-aware harassment patterns
        HARASSMENT_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.processed || content.allText)) {
            let patternScore = 6
            
            // Reduce score in professional contexts where it might be legitimate
            if (context.isProfessional && this.isLegitimateInContext(pattern, content)) {
              patternScore = Math.floor(patternScore * 0.3)
              flags.push(`Professional context harassment pattern (reduced): "${pattern}"`)
            } else {
              flags.push('Harassment pattern detected')
            }
            
            score += patternScore
          }
        })

        // Enhanced scam patterns with adversarial resistance
        SCAM_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.processed || content.allText)) {
            score += 8
            flags.push('Scam pattern detected')
          }
        })

        // v3.0: Sophisticated doxxing/threat patterns
        const doxxingPatterns = [
          /would be unfortunate/i,
          /personal information.*public/i,
          /find.*information.*online/i,
          /interesting.*about you/i,
          /know where you/i,
          /found.*information.*about/i,
          /accidents happen.*to people who/i,
          /hope nothing bad happens/i
        ]
        
        doxxingPatterns.forEach(pattern => {
          if (safeRegexTest(pattern, content.processed || content.allText)) {
            score += 12 // Higher score for sophisticated threats
            flags.push('Sophisticated threat pattern detected')
          }
        })

        // Enhanced evasion patterns with context awareness
        EVASION_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.processed || content.allText)) {
            // Skip in specific contexts where these might be legitimate
            if (isGameDev && content.allTextLower.includes('nerf')) {
              return // Skip this evasion detection in game dev context
            }
            
            // NEW: Skip for technical contexts where "kill" might be legitimate
            const context = content.context || {}
            if (context.isTechnical || context.domains?.includes('DEVOPS')) {
              const techPhrases = ['kill process', 'kill task', 'kill command', 'process', 'server', 'system', 'container', 'docker']
              const hasTechPhrase = techPhrases.some(phrase => content.allTextLower.includes(phrase))
              if (hasTechPhrase) {
                return // Skip evasion detection for legitimate technical content
              }
            }
            
            // NEW: Skip for business contexts where "killing" might refer to competitive performance
            if (context.isBusiness || context.domains?.includes('FINANCE') || context.domains?.includes('MANAGEMENT')) {
              const businessPhrases = ['killing us', 'killing it', 'market share', 'competition', 'competitor', 'performance', 'sales', 'revenue']
              const hasBusinessPhrase = businessPhrases.some(phrase => content.allTextLower.includes(phrase))
              if (hasBusinessPhrase) {
                return // Skip evasion detection for legitimate business language
              }
            }
            
            // Check if this is adversarial preprocessing result
            if (content.hasModifications) {
              score += 10 // Higher score for detected adversarial attempts
              flags.push('Adversarial evasion attempt detected')
            } else {
              score += 6
              flags.push('Evasion attempt detected')
            }
          }
        })

        // Enhanced gaming troll detection with context
        const trollCount = GAMING_TROLL_KEYWORDS.filter(keyword => 
          content.allTextLower.includes(keyword)
        ).length

        if (trollCount >= 5) {
          score += 8
          flags.push(`Heavy gaming troll language (${trollCount} terms)`)
        } else if (trollCount >= 3) {
          score += 5
          flags.push(`Multiple gaming troll terms (${trollCount})`)
        }

        // Enhanced toxic gaming phrases
        const toxicGamingPhrases = [
          'uninstall', 'go touch grass', 'basement dweller', 'ratio + l', 'cope harder',
          'you are trash at', 'git gud scrub', 'skill issue', 'get rekt', 'mad cuz bad'
        ]
        
        const toxicCount = toxicGamingPhrases.filter(phrase =>
          content.allTextLower.includes(phrase)
        ).length
        
        if (toxicCount >= 2) {
          score += 10
          flags.push(`Toxic gaming harassment (${toxicCount} phrases)`)
        }

        // Troll names detection
        if (TROLL_NAMES.some(name => content.name.toLowerCase().includes(name))) {
          score += 6
          flags.push('Troll name detected')
        }

        // Direct harassment with severity scaling
        HARASSMENT_KEYWORDS.forEach(keyword => {
          if (content.allTextLower.includes(keyword)) {
            // NEW: Skip harassment detection for technical contexts
            const context = content.context || {}
            if ((keyword.includes('kill') || keyword.includes('die')) && 
                (context.isTechnical || context.domains?.includes('DEVOPS'))) {
              const techPhrases = ['kill process', 'kill task', 'kill command', 'process', 'server', 'system']
              const hasTechPhrase = techPhrases.some(phrase => content.allTextLower.includes(phrase))
              if (hasTechPhrase) {
                return // Skip harassment detection for legitimate technical content
              }
            }
            
            let harassmentScore = 10
            
            // Scale based on severity
            if (keyword.includes('kill') || keyword.includes('die')) {
              harassmentScore = 15
            }
            
            score += harassmentScore
            flags.push(`Direct harassment: "${keyword}"`)
          }
        })

        return { 
          score: Math.round(score * (this._patternsConfig?.weight || 1)), 
          flags,
          contextAdjustments: content.contextAdjustments || []
        }
      }
    })

    // Enhanced validation plugin
    this.pluginManager.register('validation', {
      init: (config) => { this._validationConfig = config },
      analyze: (content, input, options) => {
        const { isValidEmail } = require('./lib/utils')
        let score = 0
        const flags = []

        // Email validation with enhanced detection
        if (input.email && !isValidEmail(input.email)) {
          score += 3
          flags.push('Invalid email format')
        }

        // Enhanced suspicious email patterns
        if (input.email) {
          const suspiciousPatterns = [
            /\d{6,}@/, // Long numeric sequences
            /temp.*mail/i, 
            /disposable/i,
            /10.*minute/i, // 10 minute mail
            /guerrilla.*mail/i,
            /mailinator/i,
            /trash.*mail/i
          ]
          
          suspiciousPatterns.forEach(pattern => {
            if (pattern.test(input.email)) {
              score += 3
              flags.push('Suspicious email pattern')
            }
          })
        }

        return { score: Math.round(score * (this._validationConfig?.weight || 1)), flags }
      }
    })
  }

  /**
   * Check if a potentially harmful pattern is legitimate in professional context
   */
  isLegitimateInContext(pattern, content) {
    const context = content.context || {}
    
    // Technical contexts
    if (context.isTechnical || context.domains?.includes('DEVOPS')) {
      const techPhrases = ['kill process', 'kill task', 'kill command', 'critical system', 'urgent fix']
      return techPhrases.some(phrase => content.allTextLower.includes(phrase))
    }
    
    // Medical contexts
    if (context.isMedical || context.domains?.includes('CLINICAL')) {
      const medicalPhrases = ['critical care', 'urgent surgery', 'critical condition']
      return medicalPhrases.some(phrase => content.allTextLower.includes(phrase))
    }
    
    // Business contexts
    if (context.isBusiness || context.domains?.includes('FINANCE')) {
      const businessPhrases = ['critical analysis', 'urgent matter', 'assess performance']
      return businessPhrases.some(phrase => content.allTextLower.includes(phrase))
    }
    
    return false
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
      pluginConfigs.obscenity = { weight: 1.0, contextAware: true }
      pluginConfigs.sentiment = { weight: 1.0, contextAware: true }
      pluginConfigs.patterns = { weight: 1.0, contextAware: true }
      pluginConfigs.validation = { weight: 0.5 }
      pluginConfigs.harassment = { weight: 1.2, contextAware: true } // v3.0 default
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
      pluginPerformance: {},
      
      // v3.0 new metrics
      adversarialDetected: 0,
      contextAdjustments: 0,
      preprocessingModifications: 0,
      harassmentDetected: 0
    }
  }

  /**
   * v3.0 ENHANCED Main analysis function with preprocessing and context detection
   */
  async analyze(input, options = {}) {
    const startTime = Date.now()
    const analysisOptions = { ...this.options, ...options }

    // Generate cache key (include preprocessing options for cache validity)
    const cacheKey = this.generateCacheKey(input, analysisOptions)
    
    // Check cache
    if (this.cache?.has(cacheKey)) {
      if (this.metrics) this.metrics.cacheHits++
      const cached = this.cache.get(cacheKey)
      return { ...cached, fromCache: true }
    }

    if (this.metrics) this.metrics.cacheMisses++

    try {
      // v3.0 Step 1: Prepare basic content
      const basicContent = this.prepareContent(input)
      
      // v3.0 Step 2: Context detection
      const context = this.contextDetector.analyzeContext(basicContent, input)
      
      // v3.0 Step 3: Advanced preprocessing with context
      const preprocessingResult = this.preprocessor.preprocess(basicContent.allText, context)
      
      // v3.0 Step 4: Get contextual adjustments
      const contextualAdjustments = this.contextDetector.getContextualAdjustments(basicContent, context)
      
      // v3.0 Step 5: Create enhanced content object
      const content = {
        ...basicContent,
        context,
        processed: preprocessingResult.processed,
        hasModifications: preprocessingResult.hasModifications,
        preprocessingSteps: preprocessingResult.steps,
        contextAdjustments: contextualAdjustments,
        adversarialPatterns: this.preprocessor.detectAdversarialPatterns(
          preprocessingResult.original, 
          preprocessingResult.processed
        )
      }
      
      // v3.0 Step 6: Run plugin analysis with enhanced content
      const pluginResults = await this.pluginManager.analyze(content, input)
      
      // v3.0 Step 7: Calculate final analysis with context awareness
      const analysis = this.calculateFinalAnalysis(pluginResults, content, input, analysisOptions)
      
      // v3.0 Step 8: Add enhanced metadata
      analysis.metadata = {
        processingTime: Date.now() - startTime,
        version: '3.0.0',
        enabledPlugins: this.pluginManager.getEnabled(),
        timestamp: new Date().toISOString(),
        earlyExit: pluginResults._earlyExit || false,
        
        // v3.0 Enhanced metadata
        contextAnalysis: {
          domains: context.domains,
          isProfessional: context.isProfessional,
          confidence: context.confidence
        },
        preprocessing: {
          hasModifications: preprocessingResult.hasModifications,
          steps: preprocessingResult.steps.map(step => step.step),
          adversarialPatterns: content.adversarialPatterns
        },
        contextualAdjustments: contextualAdjustments.length
      }

      // Update metrics
      this.updateMetrics(analysis, Date.now() - startTime, content)
      
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
   * Prepare content for analysis (basic content extraction)
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
   * v3.0 Enhanced final analysis calculation with context awareness
   */
  calculateFinalAnalysis(pluginResults, content, input, options) {
    // Sum plugin scores with contextual adjustments
    let totalScore = 0
    const allFlags = []

    Object.entries(pluginResults).forEach(([pluginName, result]) => {
      if (pluginName.startsWith('_')) return // Skip meta fields
      
      let pluginScore = result.score || 0
      
      // v3.0: Apply contextual adjustments
      if (content.contextAdjustments && content.contextAdjustments.length > 0) {
        content.contextAdjustments.forEach(adjustment => {
          if (result.flags?.some(flag => flag.toLowerCase().includes(adjustment.word))) {
            const reduction = Math.floor(pluginScore * adjustment.weightReduction)
            pluginScore -= reduction
            allFlags.push(`[CONTEXT] Reduced "${adjustment.word}" impact by ${reduction} points (${adjustment.reason})`)
          }
        })
      }
      
      totalScore += Math.max(0, pluginScore)
      
      if (result.flags) {
        allFlags.push(...result.flags.map(flag => `[${pluginName.toUpperCase()}] ${flag}`))
      }
    })

    // v3.0: Apply positive indicators (enhanced context bonuses)
    const { contextBonus, contextFlags } = this.calculateEnhancedContextBonus(content)
    totalScore += contextBonus
    allFlags.push(...contextFlags)

    // v3.0: Adversarial pattern penalties
    if (content.adversarialPatterns?.length > 0) {
      const adversarialPenalty = content.adversarialPatterns.length * 2
      totalScore += adversarialPenalty
      allFlags.push(`[ADVERSARIAL] Detected ${content.adversarialPatterns.length} adversarial patterns +${adversarialPenalty} points`)
    }

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
      confidence: this.calculateConfidence(pluginResults),
      
      // v3.0: Enhanced analysis data
      contextAnalysis: content.context,
      preprocessingApplied: content.hasModifications,
      adversarialPatterns: content.adversarialPatterns,
      contextualAdjustments: content.contextAdjustments?.length || 0
    }
  }

  /**
   * v3.0 Enhanced context-based bonuses with sophisticated detection
   */
  calculateEnhancedContextBonus(content) {
    const { TECHNICAL_TERMS, ACADEMIC_TERMS, BUSINESS_TERMS, MEDICAL_TERMS } = require('./lib/constants/context-data')
    
    let bonus = 0
    const flags = []
    const context = content.context || {}

    // Professional context bonuses (more sophisticated than v2.1)
    if (context.isProfessional) {
      const professionalBonus = -4
      bonus += professionalBonus
      flags.push(`[POSITIVE] Professional context detected: ${professionalBonus} points`)
    }

    // Domain-specific bonuses
    if (context.domains?.length > 0) {
      const domainBonus = -2 * Math.min(3, context.domains.length)
      bonus += domainBonus
      flags.push(`[POSITIVE] Domain expertise (${context.domains.join(', ')}): ${domainBonus} points`)
    }

    // Communication style bonuses
    if (context.communicationStyle?.includes('FORMAL') || context.communicationStyle?.includes('PROFESSIONAL')) {
      bonus -= 3
      flags.push(`[POSITIVE] Professional communication style: -3 points`)
    }

    // Enhanced email domain bonuses
    if (context.emailContext?.isProfessional) {
      const emailBonus = context.emailContext.type === 'educational' ? -5 : -2
      bonus += emailBonus
      flags.push(`[POSITIVE] Professional email domain (${context.emailContext.type}): ${emailBonus} points`)
    }

    // Vocabulary sophistication bonus
    if (context.vocabularyAnalysis?.averageWordLength > 6) {
      bonus -= 2
      flags.push(`[POSITIVE] Sophisticated vocabulary: -2 points`)
    }

    return { contextBonus: bonus, contextFlags: flags }
  }

  /**
   * Calculate risk level (enhanced for v3.0)
   */
  calculateRiskLevel(score) {
    if (score >= 25) return 'CRITICAL'
    if (score >= 15) return 'HIGH'
    if (score >= this.options.spamThreshold) return 'MEDIUM'
    if (score >= 2) return 'LOW'
    return 'CLEAN'
  }

  /**
   * Generate recommendation (enhanced for v3.0)
   */
  getRecommendation(score, isSpam) {
    if (score >= 25) return `Immediate ban - Critical harassment/threats detected (Score: ${score})`
    if (score >= 15) return `Block and review - Serious harassment detected (Score: ${score})`
    if (score >= 10) return `Block content - Definite spam/harassment (Score: ${score})`
    if (isSpam) return `Flag for moderation - Likely spam/harassment (Score: ${score})`
    if (score >= 2) return `Review recommended - Suspicious indicators (Score: ${score})`
    return `Allow - Clean content (Score: ${score})`
  }

  /**
   * Calculate confidence based on plugin consensus (enhanced for v3.0)
   */
  calculateConfidence(pluginResults) {
    const pluginScores = Object.values(pluginResults)
      .filter(result => typeof result === 'object' && result.score !== undefined)
      .map(result => result.score)
    
    if (pluginScores.length === 0) return 'No data'
    
    const activePlugins = pluginScores.filter(score => score > 0).length
    const totalPlugins = pluginScores.length
    const consensus = activePlugins / totalPlugins

    // v3.0: Enhanced confidence calculation
    const maxScore = Math.max(...pluginScores)
    const scoreConfidence = Math.min(maxScore / 20, 1) // Normalize by expected max score
    
    const combinedConfidence = (consensus * 0.7) + (scoreConfidence * 0.3)

    if (combinedConfidence >= 0.8) return 'Very high confidence'
    if (combinedConfidence >= 0.6) return 'High confidence'
    if (combinedConfidence >= 0.4) return 'Moderate confidence'
    if (combinedConfidence >= 0.2) return 'Low confidence'
    return 'Very low confidence'
  }

  /**
   * v3.0 Enhanced metrics update
   */
  updateMetrics(analysis, processingTime, content) {
    if (!this.metrics) return

    this.metrics.totalAnalyses++
    
    if (analysis.isSpam) {
      this.metrics.spamDetected++
    } else {
      this.metrics.cleanContent++
    }

    // v3.0: New metrics
    if (content.adversarialPatterns?.length > 0) {
      this.metrics.adversarialDetected++
    }
    
    if (content.contextAdjustments?.length > 0) {
      this.metrics.contextAdjustments++
    }
    
    if (content.hasModifications) {
      this.metrics.preprocessingModifications++
    }
    
    if (analysis.pluginResults.harassment?.score > 0) {
      this.metrics.harassmentDetected++
    }

    // Update rolling average
    const total = this.metrics.totalAnalyses
    this.metrics.averageProcessingTime = (
      (this.metrics.averageProcessingTime * (total - 1)) + processingTime
    ) / total
  }

  /**
   * Generate cache key (enhanced for v3.0)
   */
  generateCacheKey(input, options) {
    const content = `${input.name || ''}|${input.email || ''}|${input.subject || ''}|${input.message || ''}`
    const configHash = fastHash(JSON.stringify({
      preprocessing: options.preprocessing,
      contextDetection: options.contextDetection,
      plugins: options.plugins
    }))
    return fastHash(content + configHash)
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
      error: error.message,
      
      // v3.0: Enhanced fallback data
      contextAnalysis: null,
      preprocessingApplied: false,
      adversarialPatterns: [],
      contextualAdjustments: 0
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
   * v3.0 Enhanced metrics
   */
  getMetrics() {
    if (!this.metrics) return { error: 'Metrics disabled' }
    
    return {
      ...this.metrics,
      spamRate: this.metrics.totalAnalyses > 0 ? 
        `${(this.metrics.spamDetected / this.metrics.totalAnalyses * 100).toFixed(1)}%` : '0%',
      cacheEfficiency: (this.metrics.cacheHits + this.metrics.cacheMisses) > 0 ?
        `${(this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100).toFixed(1)}%` : '0%',
      
      // v3.0: Enhanced metrics
      adversarialRate: this.metrics.totalAnalyses > 0 ?
        `${(this.metrics.adversarialDetected / this.metrics.totalAnalyses * 100).toFixed(1)}%` : '0%',
      contextAdjustmentRate: this.metrics.totalAnalyses > 0 ?
        `${(this.metrics.contextAdjustments / this.metrics.totalAnalyses * 100).toFixed(1)}%` : '0%',
      preprocessingRate: this.metrics.totalAnalyses > 0 ?
        `${(this.metrics.preprocessingModifications / this.metrics.totalAnalyses * 100).toFixed(1)}%` : '0%',
      harassmentDetectionRate: this.metrics.totalAnalyses > 0 ?
        `${(this.metrics.harassmentDetected / this.metrics.totalAnalyses * 100).toFixed(1)}%` : '0%'
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
  
  // v3.0: New system exports
  TextPreprocessor: require('./lib/utils/preprocessing').TextPreprocessor,
  ContextDetector: require('./lib/core/context-detector').ContextDetector,
  HarassmentPlugin: require('./lib/plugins/harassment-plugin'),
  
  // Utility exports
  utils: require('./lib/utils'),
  
  // Constants
  constants: require('./lib/constants/context-data'),
  
  // Enhanced presets from separate module
  presets: require('./lib/presets')
} 