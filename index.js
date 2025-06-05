/**
 * 🛡️ ContentGuard v0.1.0 - Advanced Content Analysis System (Beta)
 * 
 * Advanced content analysis with sophisticated harassment detection,
 * context awareness, and ML-powered toxicity analysis.
 * 
 * ⚠️ PRE-1.0 DEVELOPMENT VERSION - API may change
 * 
 * @author trevor050
 * @license MIT
 * @version 0.1.0
 */

const PluginManager = require('./lib/core/plugin-manager')
const { LRUCache, deepMerge, fastHash, safeRegexTest } = require('./lib/utils')
const { TextPreprocessor } = require('./lib/utils/preprocessing')
const { ContextDetector } = require('./lib/core/context-detector')
const presets = require('./lib/presets')

// Lazy-loaded plugins
let ObscenityPlugin = null
let SentimentPlugin = null
let HarassmentPlugin = null
let SocialEngineeringPlugin = null

// v4.0 ML Plugins
const { EmojiSentimentPlugin } = require('./lib/plugins/emoji-sentiment-plugin')
const { ConfusablesAdvancedPlugin } = require('./lib/plugins/confusables-advanced-plugin')
const { MLToxicityPlugin } = require('./lib/plugins/ml-toxicity-plugin')
const { CrossCulturalPlugin } = require('./lib/plugins/cross-cultural-plugin')

/**
 * ContentGuard v3.0 - The most advanced content analysis system
 */
class ContentGuard {
  constructor(preset = 'moderate', options = {}) {
    this.preset = preset
    
    // Merge preset configuration with user options
    const presetConfig = presets[preset] || presets.moderate
    this.options = this.mergeDefaultOptions({
      ...presetConfig,
      ...options,
      enableContextDetection: true,
      enableHarassmentDetection: true,
      enableSocialEngineering: true,
      enableMLFeatures: true, // NEW: Enable v4.0 ML features
      enableEmojiAnalysis: true, // NEW: Emoji sentiment
      enableCrossCultural: true, // NEW: Cross-cultural analysis
      maxProcessingTime: 10000, // 10 second timeout
    })
    
    this.plugins = {}
    this.mlPlugins = {} // NEW: Separate ML plugin registry
    this.stats = {
      totalAnalyses: 0,
      totalTime: 0,
      averageTime: 0,
      mlAnalyses: 0,
      mlSuccessRate: 0
    }
    
    this.initializePlugins()
    this.initializeMLPlugins() // NEW: Initialize ML plugins
  }

  initializePlugins() {
    // Initialize plugin manager first
    this.pluginManager = new PluginManager()
    
    // Setup default plugins with lazy loading
    this.setupDefaultPlugins()
    
    // Context detection
    this.contextDetector = new ContextDetector()
    this.preprocessor = new TextPreprocessor()
  }

  async initializeMLPlugins() {
    try {
      // v4.0 ML Plugins
      if (this.options.enableMLFeatures) {
        console.log('🤖 Initializing v4.0 ML plugins...')
        
        // Emoji sentiment analysis
        if (this.options.enableEmojiAnalysis) {
          this.mlPlugins.emojiSentiment = new EmojiSentimentPlugin()
          console.log('✅ Emoji sentiment plugin ready')
        }
        
        // Advanced confusables (always enabled for preprocessing)
        this.mlPlugins.confusablesAdvanced = new ConfusablesAdvancedPlugin()
        console.log('✅ Advanced confusables plugin ready')
        
        // Cross-cultural analysis
        if (this.options.enableCrossCultural) {
          this.mlPlugins.crossCultural = new CrossCulturalPlugin()
          console.log('✅ Cross-cultural analysis plugin ready')
        }
        
        // ML toxicity detection (async initialization)
        this.mlPlugins.mlToxicity = new MLToxicityPlugin()
        await this.mlPlugins.mlToxicity.initialize()
        console.log('✅ ML toxicity plugin ready')
        
        console.log('🚀 All v4.0 ML plugins initialized successfully')
      }
    } catch (error) {
      console.warn('⚠️ Some ML plugins failed to initialize:', error.message)
      console.log('📝 Falling back to rule-based analysis only')
    }
  }

  /**
   * Merge user options with intelligent defaults
   */
  mergeDefaultOptions(userOptions) {
    const defaults = {
      // Core settings - ONLY set if not already provided by user
      spamThreshold: userOptions.spamThreshold ?? 5,
      enableEarlyExit: userOptions.enableEarlyExit ?? true,
      criticalThreshold: userOptions.criticalThreshold ?? 20,
      
      // Performance optimization
      enableCaching: userOptions.enableCaching ?? true,
      cacheSize: userOptions.cacheSize ?? 1000,
      
      // v3.0 Enhanced plugin configuration
      plugins: deepMerge({
        obscenity: { weight: 1.0, contextAware: true },
        sentiment: { weight: 1.0, contextAware: true },
        patterns: { weight: 1.0, contextAware: true },
        validation: { weight: 0.5 },
        harassment: { weight: 1.2, contextAware: true }, // New in v3.0
        socialEngineering: { weight: 1.5, contextAware: true } // New in v3.1
      }, userOptions.plugins || {}),
      
      // v3.0 Preprocessing options
      preprocessing: deepMerge({
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        removeExcessiveSpacing: true,
        contextAware: true
      }, userOptions.preprocessing || {}),
      
      // v3.0 Context detection options
      contextDetection: deepMerge({
        enableDomainDetection: true,
        enablePatternMatching: true,
        enableVocabularyAnalysis: true,
        confidenceThreshold: 0.3
      }, userOptions.contextDetection || {}),
      
      // Feature toggles
      enableLazyLoading: userOptions.enableLazyLoading ?? true,
      debug: userOptions.debug ?? false,
      enableMetrics: userOptions.enableMetrics ?? true,
      
      // Context awareness
      contextAware: userOptions.contextAware ?? true,
      
      // v3.0 Advanced features
      enableAdversarialDetection: userOptions.enableAdversarialDetection ?? true,
      enableSophisticatedHarassment: userOptions.enableSophisticatedHarassment ?? true,
      enableContextualAdjustments: userOptions.enableContextualAdjustments ?? true,
      
      // Backwards compatibility
      enableLayers: userOptions.enableLayers || {},
      layerWeights: userOptions.layerWeights || {}
    }

    // Merge with all user options taking precedence
    return { ...defaults, ...userOptions }
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

    // NEW v3.1: Social engineering detection plugin
    this.pluginManager.register('socialEngineering', {
      init: async (config) => {
        if (!SocialEngineeringPlugin) {
          SocialEngineeringPlugin = require('./lib/plugins/social-engineering-plugin')
        }
        this._socialEngineeringInstance = new SocialEngineeringPlugin()
        await this._socialEngineeringInstance.init(config)
      },
      analyze: async (content, input, options) => {
        return await this._socialEngineeringInstance.analyze(content, input, options)
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
      GAMING_TROLL_KEYWORDS, TROLL_NAMES, HARASSMENT_KEYWORDS,
      PROBLEMATIC_MODERN_TERMS
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

        // Enhanced evasion patterns with context
        EVASION_PATTERNS.forEach(pattern => {
          if (safeRegexTest(pattern, content.processed || content.allText)) {
            const currentPatternSource = pattern.source; // Get the regex source string
            // Ensure localContext is defined correctly once before these checks
            const localContext = content.context || {}; 

            // Skip in specific contexts where these might be legitimate
            if (isGameDev && content.allTextLower.includes('nerf')) {
              if (currentPatternSource.includes('nerf')) { 
                return;
              }
            }
            
            const killPatternSource = "[k][i1!][l1!][l1!]"; // Source of the /k[i1!][l1!][l1!]/i pattern
            // Check for technical contexts where "kill" (but not "kys") might be legitimate
            if (localContext.isTechnical || localContext.domains?.includes('DEVOPS')) {
              if (currentPatternSource === killPatternSource || pattern.source.includes('kill')) { 
                const techPhrases = ['kill process', 'kill task', 'kill command', 'kill server', 'kill container', 'process', 'server', 'system', 'container', 'docker', 'instance', 'job', 'session', 'service', 'node', 'pod', 'cluster'];
                if (techPhrases.some(phrase => content.allTextLower.includes(phrase))) {
                  flags.push(`[INFO] Evasion pattern for 'kill' skipped in technical context: "${pattern}"`);
                  return; 
                }
              }
            }
            
            // Check for business/financial context for "kill"
            if (localContext.isBusiness || localContext.domains?.includes('FINANCE')) {
                 if (currentPatternSource === killPatternSource || pattern.source.includes('kill')) {
                    const businessPhrases = ['killed the deal', 'deal killer', 'killing the market', 'kill the competition', 'killed our profits'];
                     if (businessPhrases.some(phrase => content.allTextLower.includes(phrase))) {
                        flags.push(`[INFO] Evasion pattern for 'kill' skipped in business context: "${pattern}"`);
                        return;
                    }
                 }
            }
            
            // Check for hyperbolic/figurative uses of "kill"
            if (currentPatternSource === killPatternSource) { // Specifically for the main /k[i1!][l1!][l1!]/i pattern
              const hyperbolicKillPhrases = ['killed my soul', 'killed my vibe', 'killing me softly', 'killing me rn', 'literally killing me', 'killed it', 'killing it'];
              const hasHyperbolicKill = hyperbolicKillPhrases.some(phrase => content.allTextLower.includes(phrase));
              const hasLmaoLol = content.allTextLower.includes('lmao') || content.allTextLower.includes('lol');

              if (hasHyperbolicKill || (content.allTextLower.includes('killing me') && hasLmaoLol)) {
                if (!content.allTextLower.match(/killing you\\b|kill you\\b/i)) { 
                  flags.push(`[INFO] Evasion pattern for 'kill' skipped due to hyperbolic use: "${pattern}"`);
                  return; 
                }
              }
            }
            
            // If no context-specific skip occurred, apply standard penalty
            score += 7; // Original Evasion patterns penalty
            flags.push('[PATTERNS] Adversarial evasion attempt detected');
            return; // Stop after first evasion match
          }
        });

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

        // Modern toxic communication patterns
        const modernToxicCount = PROBLEMATIC_MODERN_TERMS.filter(term => 
          content.allTextLower.includes(term.toLowerCase())
        ).length

        if (modernToxicCount >= 3) {
          score += 12
          flags.push(`Heavy modern toxic language (${modernToxicCount} terms)`)
        } else if (modernToxicCount >= 2) {
          score += 8
          flags.push(`Multiple modern toxic terms (${modernToxicCount})`)
        } else if (modernToxicCount === 1) {
          score += 4
          flags.push('Modern toxic language detected')
        }

        // Direct harassment with severity scaling
        HARASSMENT_KEYWORDS.forEach(keyword => {
          if (content.allTextLower.includes(keyword)) {
            const localContext = content.context || {}; // Renamed to avoid conflict with outer scope
            
            // Check for technical contexts where "kill" or "die" might be legitimate
            if ((keyword.includes('kill') || keyword.includes('die')) && 
                (localContext.isTechnical || localContext.domains?.includes('DEVOPS'))) {
              const techPhrases = ['kill process', 'kill task', 'kill command', 'process', 'server', 'system'];
              const hasTechPhrase = techPhrases.some(phrase => content.allTextLower.includes(phrase));
              if (hasTechPhrase) {
                flags.push(`[INFO] Harassment keyword '${keyword}' skipped in technical context.`);
                return; // Skip harassment detection for legitimate technical content
              }
            }
            
            let harassmentScore = 10;
            let isHyperbolicKys = false;

            // Enhanced contextual handling for "kys" and "kill yourself"
            if (keyword === 'kys' || keyword === 'kill yourself') {
              // Get the original text before preprocessing to check for hyperbolic context
              const originalText = content.originalText || content.allText;
              const lowerOriginalText = originalText.toLowerCase();
              
              // Check if this is a technical/gaming context with hyperbolic indicators
              const isTechnicalBug = (localContext.isTechnical || localContext.domains?.includes('DEVOPS') || lowerOriginalText.includes('bug'));
              const isGamingContext = localContext.domains?.includes('GAMING');
              const hasHyperboleIndicators = ['lmao', 'lol', 'rofl', 'literally', 'fr', 'deadass', 'bruh', 'smh'].some(ind => lowerOriginalText.includes(ind));
              const hasKillingMePhrase = ['killing me', 'killed me'].some(phrase => lowerOriginalText.includes(phrase));

              // If it's the original "kys" in a hyperbolic technical/gaming context
              if ((isTechnicalBug || isGamingContext) && hasHyperboleIndicators && hasKillingMePhrase) {
                // Check if original contained "kys" (not just expanded "kill yourself")
                if (lowerOriginalText.includes('kys')) {
                  harassmentScore = 1; // Drastically reduce score for hyperbolic "kys"
                  isHyperbolicKys = true;
                  flags.push(`[INFO] Reduced score for hyperbolic 'kys' in technical/gaming context.`);
                }
              }
            }
            
            // Scale based on severity (unless it's a reduced hyperbolic "kys")
            if (!isHyperbolicKys && (keyword.includes('kill') || keyword.includes('die'))) {
              harassmentScore = 15;
            }
            
            score += harassmentScore;
            flags.push(`Direct harassment: "${keyword}"`);
          }
        });

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
  async analyze(text, context = {}) {
    const startTime = Date.now()
    
    try {
      // Handle both string input and object input
      let input
      if (typeof text === 'string') {
        input = {
          name: '',
          email: '',
          subject: '',
          message: text
        }
      } else {
        input = text
      }

      // Create combined text for analysis
      const allText = [input.name, input.email, input.subject, input.message]
        .filter(Boolean)
        .join(' ')

      if (!allText || allText.trim().length === 0) {
        return this.createResult(0, [], { error: 'Invalid input text' })
      }

      // Enhanced preprocessing with v4.0 confusables
      const preprocessingResult = this.preprocessor.preprocess(allText, {
        ...this.options.preprocessing,  // Pass user's preprocessing options
        useAdvancedConfusables: true
      })
      const processedText = preprocessingResult.processedText

      // Create content object for plugins with PREPROCESSED text
      const content = {
        name: input.name || '',
        email: input.email || '',
        subject: input.subject || '',
        message: input.message || '',
        allText: processedText,  // FIXED: Use preprocessed text instead of original
        allTextLower: processedText.toLowerCase(),  // FIXED: Use preprocessed text
        originalText: allText  // Keep original for reference
      }

      // Initialize result structure
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
          mlAnalysis: {}, // NEW: ML analysis results
          emojiAnalysis: {}, // NEW: Emoji analysis
          crossCultural: {}, // NEW: Cross-cultural analysis
          performance: {
            processingTime: 0,
            mlProcessingTime: 0,
            pluginsUsed: []
          }
        }
      }

      // Core analysis pipeline
      await this.runCoreAnalysis(content, context, result)
      
      // v4.0 ML analysis pipeline
      if (this.options.enableMLFeatures) {
        await this.runMLAnalysis(processedText, context, result)
      }

      // Apply preset thresholds and final adjustments
      this.applyPresetLogic(result)
      
      // Update performance metrics
      const processingTime = Date.now() - startTime
      this.updateStats(processingTime, result)
      result.metadata.performance.processingTime = processingTime

      return this.createResult(result.score, result.flags, result.metadata)

    } catch (error) {
      console.error('ContentGuard analysis error:', error)
      const processingTime = Date.now() - startTime
      return this.createResult(0, [`[ERROR] Analysis failed: ${error.message}`], {
        error: true,
        processingTime: processingTime
      })
    }
  }

  async runCoreAnalysis(content, context, result) {
    // Context detection FIRST
    if (this.options.enableContextDetection) {
      const contextResult = this.contextDetector.analyzeContext(content, context)
      result.metadata.context = contextResult
      result.metadata.performance.pluginsUsed.push('context')
      
      // ADD CONTEXT TO CONTENT OBJECT for plugins to use
      content.context = contextResult
    }

    // Core content analysis through plugin manager (now with context)
    const pluginResults = await this.pluginManager.analyze(content, context)

    // Process plugin results
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
      // Emoji sentiment analysis
      if (this.mlPlugins.emojiSentiment) {
        const emojiResult = this.mlPlugins.emojiSentiment.analyze(text, context)
        result.metadata.emojiAnalysis = emojiResult
        result.score += emojiResult.score
        result.flags.push(...emojiResult.flags)
        result.metadata.performance.pluginsUsed.push('emojiSentiment')
      }

      // Cross-cultural analysis (can reduce false positives)
      if (this.mlPlugins.crossCultural) {
        const culturalResult = this.mlPlugins.crossCultural.analyze(text, context)
        result.metadata.crossCultural = culturalResult
        result.score += culturalResult.score // Can be negative (reduces score)
        result.flags.push(...culturalResult.flags)
        result.metadata.performance.pluginsUsed.push('crossCultural')
      }

      // ML toxicity detection (advanced semantic analysis)
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
    
    // Apply preset-specific score adjustments
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

  createResult(score, flags, metadata) {
    const threshold = presets[this.preset]?.spamThreshold || 5

    return {
      isSpam: score >= threshold,
      score: score,
      confidence: this.calculateConfidence(score, threshold, metadata),
      flags: flags,
      preset: this.preset,
      metadata: metadata || {},
      preprocessingApplied: metadata?.preprocessing?.applied,  // NEW: Show if preprocessing worked
      normalizedText: metadata?.processedText?.substring(0, 100),  // NEW: Show normalized text sample
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      performance: {
        averageAnalysisTime: this.stats.averageTime,
        totalAnalyses: this.stats.totalAnalyses,
        mlSuccessRate: this.stats.mlSuccessRate
      }
    }
  }

  calculateConfidence(score, threshold, metadata) {
    // Base confidence on how far from threshold we are
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
    
    // Boost confidence with ML analysis
    if (metadata.mlAnalysis && metadata.mlAnalysis.confidence) {
      confidence = Math.min(0.98, confidence + (metadata.mlAnalysis.confidence * 0.1))
    }
    
    // Boost confidence with multiple plugin agreement
    if (metadata.performance && metadata.performance.pluginsUsed.length > 4) {
      confidence = Math.min(0.99, confidence + 0.05)
    }
    
    return Math.round(confidence * 100) / 100
  }

  // Analytics and insights
  getAnalyticsReport() {
    return {
      version: '0.1.0',
      totalAnalyses: this.stats.totalAnalyses,
      performance: {
        averageTime: `${this.stats.averageTime.toFixed(2)}ms`,
        totalTime: `${this.stats.totalTime}ms`,
        throughput: `${(this.stats.totalAnalyses / (this.stats.totalTime / 1000)).toFixed(2)} analyses/sec`
      },
      mlMetrics: {
        mlAnalyses: this.stats.mlAnalyses,
        mlSuccessRate: `${(this.stats.mlSuccessRate * 100).toFixed(1)}%`,
        mlCoverage: `${((this.stats.mlAnalyses / this.stats.totalAnalyses) * 100).toFixed(1)}%`
      },
      features: {
        enabledPlugins: Object.keys(this.plugins).length,
        enabledMLPlugins: Object.keys(this.mlPlugins).length,
        preset: this.preset,
        mlFeatures: this.options.enableMLFeatures,
        emojiAnalysis: this.options.enableEmojiAnalysis,
        crossCultural: this.options.enableCrossCultural
      }
    }
  }

  // Test ML features
  async testMLFeatures(text) {
    const results = {}
    
    if (this.mlPlugins.emojiSentiment) {
      results.emoji = this.mlPlugins.emojiSentiment.getEmojiInsights(text)
    }
    
    if (this.mlPlugins.crossCultural) {
      results.cultural = this.mlPlugins.crossCultural.getCulturalInsights(text)
    }
    
    if (this.mlPlugins.mlToxicity) {
      results.sentiment = await this.mlPlugins.mlToxicity.testSentiment(text)
    }
    
    if (this.mlPlugins.confusablesAdvanced) {
      results.unicode = this.mlPlugins.confusablesAdvanced.getUnicodeAnalysis(text)
    }
    
    return results
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
  
  // v4.5 Variants - New high-performance models
  ContentGuardV4Fast: require('./lib/variants/v4-fast').ContentGuardV4Fast,
  ContentGuardV4Balanced: require('./lib/variants/v4-balanced').ContentGuardV4Balanced,
  ContentGuardV4Large: require('./lib/variants/v4-large'),
  ContentGuardV4Turbo: require('./lib/variants/v4-turbo').ContentGuardV4Turbo,
  
  // Backwards compatibility
  UltimateAntiTroll: ContentGuard,
  
  // Convenience factory
  createFilter: (options = {}) => new ContentGuard(options),
  
  // v4.5 Variant factory
  createGuard: (variant = 'balanced', options = {}) => {
    switch(variant.toLowerCase()) {
      case 'fast': return new (require('./lib/variants/v4-fast').ContentGuardV4Fast)(options)
      case 'balanced': return new (require('./lib/variants/v4-balanced').ContentGuardV4Balanced)(options)
      case 'large': return new (require('./lib/variants/v4-large'))(options)
      case 'turbo': return new (require('./lib/variants/v4-turbo').ContentGuardV4Turbo)(options)
      default: return new (require('./lib/variants/v4-balanced').ContentGuardV4Balanced)(options)
    }
  },
  
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