/**
 * ContentGuard v4.5 Balanced - Production-Grade Content Analysis
 * 
 * Based on the proven v4.0 architecture with all plugins enabled.
 * Target: 70%+ accuracy (matching v4.0-base) with 0.5ms processing
 * 
 * Architecture:
 * - Full v4.0 plugin system with all 8 plugins
 * - Context detection with professional protection
 * - ML analysis with emoji sentiment and cross-cultural awareness
 * - Advanced preprocessing with confusables
 * - Sophisticated harassment detection
 * - Social engineering detection
 * - Production-ready performance monitoring
 */

const PluginManager = require('../core/plugin-manager')
const { LRUCache, deepMerge, fastHash, safeRegexTest } = require('../utils')
const { TextPreprocessor } = require('../utils/preprocessing')
const { ContextDetector } = require('../core/context-detector')
const presets = require('../presets')

// Lazy-loaded plugins (same as v4.0-base)
let ObscenityPlugin = null
let SentimentPlugin = null
let HarassmentPlugin = null
let SocialEngineeringPlugin = null

// v4.0 ML Plugins (all of them)
const { EmojiSentimentPlugin } = require('../plugins/emoji-sentiment-plugin')
const { ConfusablesAdvancedPlugin } = require('../plugins/confusables-advanced-plugin')
const { MLToxicityPlugin } = require('../plugins/ml-toxicity-plugin')
const { CrossCulturalPlugin } = require('../plugins/cross-cultural-plugin')

class ContentGuardV4Balanced {
  constructor(options = {}) {
    this.preset = 'moderate' // Use proven moderate preset
    
    // Merge preset configuration with user options (exactly like v4.0-base)
    const presetConfig = presets[this.preset] || presets.moderate
    this.options = this.mergeDefaultOptions({
      ...presetConfig,
      ...options,
      enableContextDetection: true,
      enableHarassmentDetection: true,
      enableSocialEngineering: true,
      enableMLFeatures: true, // Enable all v4.0 ML features
      enableEmojiAnalysis: true,
      enableCrossCultural: true,
      maxProcessingTime: 10000,
    })
    
    this.plugins = {}
    this.mlPlugins = {} // ML plugin registry
    this.stats = {
      totalAnalyses: 0,
      totalTime: 0,
      averageTime: 0,
      mlAnalyses: 0,
      mlSuccessRate: 0
    }
    
    this.initializePlugins()
    this.initializeMLPlugins()
  }

  initializePlugins() {
    // Initialize plugin manager (same as v4.0-base)
    this.pluginManager = new PluginManager()
    
    // Setup default plugins with lazy loading
    this.setupDefaultPlugins()
    
    // Context detection
    this.contextDetector = new ContextDetector()
    this.preprocessor = new TextPreprocessor()
  }

  async initializeMLPlugins() {
    try {
      // v4.0 ML Plugins (exactly the same)
      if (this.options.enableMLFeatures) {
        console.log('🤖 Initializing v4.5-balanced ML plugins...')
        
        // Emoji sentiment analysis
        if (this.options.enableEmojiAnalysis) {
          this.mlPlugins.emojiSentiment = new EmojiSentimentPlugin()
          console.log('✅ Emoji sentiment plugin ready')
        }
        
        // Advanced confusables
        this.mlPlugins.confusablesAdvanced = new ConfusablesAdvancedPlugin()
        console.log('✅ Advanced confusables plugin ready')
        
        // Cross-cultural analysis
        if (this.options.enableCrossCultural) {
          this.mlPlugins.crossCultural = new CrossCulturalPlugin()
          console.log('✅ Cross-cultural analysis plugin ready')
        }
        
        // ML toxicity detection
        this.mlPlugins.mlToxicity = new MLToxicityPlugin()
        await this.mlPlugins.mlToxicity.initialize()
        console.log('✅ ML toxicity plugin ready')
        
        console.log('🚀 All v4.5-balanced ML plugins initialized successfully')
      }
    } catch (error) {
      console.warn('⚠️ Some ML plugins failed to initialize:', error.message)
      console.log('📝 Falling back to rule-based analysis only')
    }
  }

  mergeDefaultOptions(userOptions) {
    const defaults = {
      // Core settings (same as v4.0-base)
      spamThreshold: userOptions.spamThreshold ?? 5,
      enableEarlyExit: userOptions.enableEarlyExit ?? true,
      criticalThreshold: userOptions.criticalThreshold ?? 20,
      
      // Performance optimization
      enableCaching: userOptions.enableCaching ?? true,
      cacheSize: userOptions.cacheSize ?? 1000,
      
      // v4.0 plugin configuration (exactly the same)
      plugins: deepMerge({
        obscenity: { weight: 1.0, contextAware: true },
        sentiment: { weight: 1.0, contextAware: true },
        patterns: { weight: 1.0, contextAware: true },
        validation: { weight: 0.5 },
        harassment: { weight: 1.2, contextAware: true },
        socialEngineering: { weight: 1.5, contextAware: true }
      }, userOptions.plugins || {}),
      
      // v4.0 preprocessing options (exactly the same)
      preprocessing: deepMerge({
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        removeExcessiveSpacing: true,
        contextAware: true
      }, userOptions.preprocessing || {}),
      
      // v4.0 context detection options (exactly the same)
      contextDetection: deepMerge({
        enableDomainDetection: true,
        enablePatternMatching: true,
        enableVocabularyAnalysis: true,
        confidenceThreshold: 0.3
      }, userOptions.contextDetection || {}),
      
      // Feature toggles (same as v4.0-base)
      enableLazyLoading: userOptions.enableLazyLoading ?? true,
      debug: userOptions.debug ?? false,
      enableMetrics: userOptions.enableMetrics ?? true,
      contextAware: userOptions.contextAware ?? true,
      
      // v4.0 advanced features (exactly the same)
      enableAdversarialDetection: userOptions.enableAdversarialDetection ?? true,
      enableSophisticatedHarassment: userOptions.enableSophisticatedHarassment ?? true,
      enableContextualAdjustments: userOptions.enableContextualAdjustments ?? true,
      
      // Backwards compatibility
      enableLayers: userOptions.enableLayers || {},
      layerWeights: userOptions.layerWeights || {}
    }

    return { ...defaults, ...userOptions }
  }

  setupDefaultPlugins() {
    // Register built-in plugins (same as v4.0-base)
    this.registerBuiltinPlugins()
    
    // Enable plugins based on configuration
    this.enableConfiguredPlugins()
  }

  registerBuiltinPlugins() {
    // Obscenity plugin (same as v4.0-base)
    this.pluginManager.register('obscenity', {
      init: async (config) => {
        if (!ObscenityPlugin) {
          ObscenityPlugin = require('../plugins/obscenity-plugin')
        }
        this._obscenityInstance = new ObscenityPlugin()
        await this._obscenityInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._obscenityInstance.analyze(content, input, options)
      }
    })

    // Sentiment plugin (same as v4.0-base)
    this.pluginManager.register('sentiment', {
      init: async (config) => {
        if (!SentimentPlugin) {
          SentimentPlugin = require('../plugins/sentiment-plugin')
        }
        this._sentimentInstance = new SentimentPlugin()
        await this._sentimentInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._sentimentInstance.analyze(content, input, options)
      }
    })

    // Harassment plugin (same as v4.0-base)
    this.pluginManager.register('harassment', {
      init: async (config) => {
        if (!HarassmentPlugin) {
          HarassmentPlugin = require('../plugins/harassment-plugin')
        }
        this._harassmentInstance = new HarassmentPlugin()
        await this._harassmentInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._harassmentInstance.analyze(content, input, options)
      }
    })

    // Social engineering plugin (same as v4.0-base)
    this.pluginManager.register('socialEngineering', {
      init: async (config) => {
        if (!SocialEngineeringPlugin) {
          SocialEngineeringPlugin = require('../plugins/social-engineering-plugin')
        }
        this._socialEngineeringInstance = new SocialEngineeringPlugin()
        await this._socialEngineeringInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._socialEngineeringInstance.analyze(content, input, options)
      }
    })
  }

  enableConfiguredPlugins() {
    // Enable all plugins with their configurations (same as v4.0-base)
    Object.entries(this.options.plugins).forEach(([pluginName, config]) => {
      if (config && typeof config === 'object') {
        this.pluginManager.enable(pluginName, config)
      }
    })
  }

  async analyze(input) {
    const startTime = performance.now()
    
    try {
      // Handle both string input and object input (same as v4.0-base)
      let analysisInput
      if (typeof input === 'string') {
        analysisInput = {
          name: '',
          email: '',
          subject: '',
          message: input
        }
      } else {
        analysisInput = input
      }

      // Create combined text for analysis
      const allText = [analysisInput.name, analysisInput.email, analysisInput.subject, analysisInput.message]
        .filter(Boolean)
        .join(' ')

      if (!allText || allText.trim().length === 0) {
        return this.createResult(0, 'CLEAN', performance.now() - startTime, {}, { error: 'Invalid input text' })
      }

      // Enhanced preprocessing with v4.0 confusables (same as v4.0-base)
      const preprocessingResult = this.preprocessor.preprocess(allText, {
        ...this.options.preprocessing,
        useAdvancedConfusables: true
      })
      const processedText = preprocessingResult.processedText

      // Create content object for plugins with PREPROCESSED text (same as v4.0-base)
      const content = {
        name: analysisInput.name || '',
        email: analysisInput.email || '',
        subject: analysisInput.subject || '',
        message: analysisInput.message || '',
        allText: processedText,
        allTextLower: processedText.toLowerCase(),
        originalText: allText
      }

      // Initialize result structure (same as v4.0-base)
      const result = {
        score: 0,
        flags: [],
        preset: this.preset,
        metadata: {
          originalText: allText,
          processedText: processedText,
          preprocessing: preprocessingResult.metadata,
          context: {},
          harassment: {},
          socialEngineering: {},
          obscenity: {},
          mlAnalysis: {},
          emojiAnalysis: {},
          crossCultural: {},
          performance: {
            processingTime: 0,
            mlProcessingTime: 0,
            pluginsUsed: []
          }
        }
      }

      // Core analysis pipeline (same as v4.0-base)
      await this.runCoreAnalysis(content, {}, result)
      
      // v4.0 ML analysis pipeline (same as v4.0-base)
      if (this.options.enableMLFeatures) {
        await this.runMLAnalysis(processedText, {}, result)
      }

      // Apply preset thresholds and final adjustments (same as v4.0-base)
      this.applyPresetLogic(result)
      
      // Update performance metrics
      const processingTime = performance.now() - startTime
      this.updateStats(processingTime, result)
      result.metadata.performance.processingTime = processingTime

      return this.createResult(result.score, this.getRiskLevel(result.score), processingTime, {
        isSpam: result.score >= this.options.spamThreshold,
        flags: result.flags,
        confidence: this.calculateConfidence(result.score, this.options.spamThreshold, result.metadata),
        variant: 'v4.5-balanced',
        tier: 1, // v4.5-balanced uses single-tier like v4.0-base
        details: result.metadata,
        recommendation: this.getRecommendation(result.score, this.getRiskLevel(result.score)),
        metadata: {
          pluginsUsed: result.metadata.performance.pluginsUsed,
          mlAnalysisUsed: this.options.enableMLFeatures,
          preprocessingApplied: result.metadata.preprocessing?.applied,
          normalizedText: result.metadata.processedText?.substring(0, 100)
        }
      })

    } catch (error) {
      console.error('ContentGuard v4.5-balanced analysis error:', error)
      const processingTime = performance.now() - startTime
      return this.createResult(0, 'CLEAN', processingTime, {}, {
        error: true,
        message: error.message
      })
    }
  }

  async runCoreAnalysis(content, context, result) {
    // Context detection FIRST (same as v4.0-base)
    if (this.options.enableContextDetection) {
      const contextResult = this.contextDetector.analyzeContext(content, context)
      result.metadata.context = contextResult
      result.metadata.performance.pluginsUsed.push('context')
      
      // ADD CONTEXT TO CONTENT OBJECT for plugins to use
      content.context = contextResult
    }

    // Core content analysis through plugin manager (same as v4.0-base)
    const pluginResults = await this.pluginManager.analyze(content, context)

    // Process plugin results (same as v4.0-base)
    Object.entries(pluginResults).forEach(([pluginName, pluginResult]) => {
      if (pluginName.startsWith('_')) return // Skip metadata fields
      
      result.score += pluginResult.score || 0
      result.flags.push(...(pluginResult.flags || []))
      result.metadata[pluginName] = pluginResult
      result.metadata.performance.pluginsUsed.push(pluginName)
    })
  }

  async runMLAnalysis(text, context, result) {
    const mlStartTime = Date.now()
    
    try {
      // Emoji sentiment analysis (same as v4.0-base)
      if (this.mlPlugins.emojiSentiment) {
        const emojiResult = this.mlPlugins.emojiSentiment.analyze(text, context)
        result.metadata.emojiAnalysis = emojiResult
        result.score += emojiResult.score
        result.flags.push(...emojiResult.flags)
        result.metadata.performance.pluginsUsed.push('emojiSentiment')
      }

      // Cross-cultural analysis (same as v4.0-base)
      if (this.mlPlugins.crossCultural) {
        const culturalResult = this.mlPlugins.crossCultural.analyze(text, context)
        result.metadata.crossCultural = culturalResult
        result.score += culturalResult.score // Can be negative (reduces score)
        result.flags.push(...culturalResult.flags)
        result.metadata.performance.pluginsUsed.push('crossCultural')
      }

      // ML toxicity detection (same as v4.0-base)
      if (this.mlPlugins.mlToxicity) {
        const mlResult = await this.mlPlugins.mlToxicity.analyze(text, context)
        result.metadata.mlAnalysis = mlResult
        result.score += mlResult.score
        result.flags.push(...mlResult.flags)
        result.metadata.performance.pluginsUsed.push('mlToxicity')
        this.stats.mlAnalyses++
      }

      result.metadata.performance.mlProcessingTime = Date.now() - mlStartTime
      
    } catch (error) {
      console.warn('ML analysis error:', error.message)
      result.flags.push('[ML] ML analysis failed, using fallback')
      result.metadata.mlAnalysis.error = error.message
    }
  }

  applyPresetLogic(result) {
    const thresholds = presets[this.preset] || presets.moderate
    
    // Apply preset-specific score adjustments (same as v4.0-base)
    if (thresholds.adjustments) {
      Object.entries(thresholds.adjustments).forEach(([type, adjustment]) => {
        if (result.metadata[type] && result.metadata[type].score > 0) {
          const oldScore = result.score
          result.score += adjustment
          result.flags.push(`[PRESET] ${type} adjustment: ${adjustment} points`)
        }
      })
    }
    
    // Ensure score doesn't go below 0
    result.score = Math.max(0, result.score)
  }

  updateStats(processingTime, result) {
    this.stats.totalAnalyses++
    this.stats.totalTime += processingTime
    this.stats.averageTime = this.stats.totalTime / this.stats.totalAnalyses
    
    // Track ML success rate
    if (result.metadata.mlAnalysis && !result.metadata.mlAnalysis.error) {
      this.stats.mlSuccessRate = this.stats.mlAnalyses / this.stats.totalAnalyses
    }
  }

  calculateConfidence(score, threshold, metadata) {
    // Base confidence on how far from threshold we are (same as v4.0-base)
    let confidence = 0.5
    
    if (score >= threshold) {
      // Spam detection confidence
      const overage = score - threshold
      confidence = Math.min(0.95, 0.6 + (overage * 0.1))
    } else {
      // Clean content confidence  
      const underage = threshold - score
      confidence = Math.min(0.95, 0.6 + (underage * 0.05))
    }
    
    // Boost confidence with ML analysis (same as v4.0-base)
    if (metadata.mlAnalysis && metadata.mlAnalysis.confidence) {
      confidence = Math.min(0.98, confidence + (metadata.mlAnalysis.confidence * 0.1))
    }
    
    // Boost confidence with multiple plugin agreement (same as v4.0-base)
    if (metadata.performance && metadata.performance.pluginsUsed.length > 4) {
      confidence = Math.min(0.99, confidence + 0.05)
    }
    
    return Math.round(confidence * 100) / 100
  }

  createResult(score, riskLevel, processingTime, additionalData = {}, metadata = {}) {
    return {
      score,
      isSpam: additionalData.isSpam || score >= this.options.spamThreshold,
      riskLevel,
      processingTime: Math.round(processingTime * 1000) / 1000,
      recommendation: additionalData.recommendation || this.getRecommendation(score, riskLevel),
      confidence: additionalData.confidence || 0.5,
      flags: additionalData.flags || [],
      variant: 'v4.5-balanced',
      tier: additionalData.tier || 1,
      details: additionalData.details || {},
      preset: this.preset,
      metadata: {
        ...metadata,
        ...(additionalData.metadata || {}),
        version: '4.5.0-balanced',
        timestamp: new Date().toISOString(),
        performance: {
          averageAnalysisTime: this.stats.averageTime,
          totalAnalyses: this.stats.totalAnalyses,
          mlSuccessRate: this.stats.mlSuccessRate
        }
      }
    }
  }

  getRiskLevel(score) {
    if (score >= 15) return 'CRITICAL';
    if (score >= 10) return 'HIGH';
    if (score >= 5) return 'MEDIUM';
    if (score >= 2) return 'LOW';
    return 'CLEAN';
  }

  getRecommendation(score, riskLevel) {
    switch (riskLevel) {
      case 'CRITICAL': return 'Block immediately - High confidence spam/harassment detected';
      case 'HIGH': return 'Block - Likely spam or inappropriate content';
      case 'MEDIUM': return 'Review - Potentially problematic content detected';
      case 'LOW': return 'Monitor - Slightly concerning patterns detected';
      default: return 'Allow - Clean content detected';
    }
  }

  getPerformanceMetrics() {
    return {
      variant: 'v4.5-balanced',
      totalAnalyses: this.stats.totalAnalyses,
      averageTime: `${Math.round(this.stats.averageTime * 1000) / 1000}ms`,
      accuracy: '70%+ target (matching v4.0-base)',
      features: [
        'Complete v4.0 plugin system (8 plugins)',
        'Context detection with professional protection',
        'ML analysis (emoji, cross-cultural, toxicity)',
        'Advanced preprocessing with confusables',
        'Sophisticated harassment detection',
        'Social engineering detection',
        'Production monitoring'
      ],
      pluginsEnabled: {
        core: ['obscenity', 'sentiment', 'harassment', 'socialEngineering'],
        ml: ['emojiSentiment', 'crossCultural', 'mlToxicity', 'confusablesAdvanced'],
        contextDetection: true,
        preprocessing: true
      }
    }
  }

  // Convenience methods (same as v4.0-base)
  async isSpam(text) {
    const result = await this.analyze(text)
    return result.isSpam
  }

  async getScore(text) {
    const result = await this.analyze(text)
    return result.score
  }

  updateConfig(newOptions) {
    this.options = { ...this.options, ...newOptions }
  }

  reset() {
    this.stats = {
      totalAnalyses: 0,
      totalTime: 0,
      averageTime: 0,
      mlAnalyses: 0,
      mlSuccessRate: 0
    }
  }
}

module.exports = { ContentGuardV4Balanced };