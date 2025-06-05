/**
 * 🛡️ ContentGuard v0.3.1 - Advanced Content Analysis System (Beta)
 * 
 * Modern content moderation and spam detection with context-aware analysis,
 * harassment detection, and ML-powered toxicity classification.
 * 
 * Pre-1.0 development version - API may change between releases.
 * Use in production at your own risk.
 * 
 * @author trevor050
 * @version 0.3.1
 * @license MIT
 * @see https://github.com/trevor050/content-guard
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
      // v4.0 ML Plugins - Silent by default
      if (this.options.enableMLFeatures) {
        // Emoji sentiment analysis
        if (this.options.enableEmojiAnalysis) {
          this.mlPlugins.emojiSentiment = new EmojiSentimentPlugin()
          if (this.options.debug) console.log('✅ Emoji sentiment plugin ready')
        }
        
        // Advanced confusables (always enabled for preprocessing)
        this.mlPlugins.confusablesAdvanced = new ConfusablesAdvancedPlugin()
        if (this.options.debug) console.log('✅ Advanced confusables plugin ready')
        
        // Cross-cultural analysis
        if (this.options.enableCrossCultural) {
          this.mlPlugins.crossCultural = new CrossCulturalPlugin()
          if (this.options.debug) console.log('✅ Cross-cultural analysis plugin ready')
        }
        
        // ML toxicity detection (async initialization) - silent unless debug enabled
        this.mlPlugins.mlToxicity = new MLToxicityPlugin({ silent: !this.options.debug })
        await this.mlPlugins.mlToxicity.initialize(this.options.debug)
        if (this.options.debug) console.log('✅ ML toxicity plugin ready')
        
        if (this.options.debug) console.log('🚀 All v4.0 ML plugins initialized successfully')
      }
    } catch (error) {
      if (this.options.debug) {
        console.warn('⚠️ Some ML plugins failed to initialize:', error.message)
        console.log('📝 Falling back to rule-based analysis only')
      }
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
  async analyze(input) {
    const startTime = performance.now()
    
    try {
      // Add input validation to prevent null/undefined errors
      if (input === null || input === undefined) {
        return this.createResult(0, 'CLEAN', performance.now() - startTime, {
          flags: ['[ERROR] Input cannot be null or undefined'],
          recommendation: 'Invalid input provided'
        }, { error: 'Invalid input: null or undefined' });
      }

      // Handle both string input and object input
      let analysisInput
      if (typeof input === 'string') {
        analysisInput = {
          name: '',
          email: '',
          subject: '',
          message: input
        }
      } else if (typeof input === 'object' && input !== null) {
        analysisInput = {
          name: input.name || '',
          email: input.email || '',
          subject: input.subject || '',
          message: input.message || ''
        }
      } else {
        // Convert other types to string
        analysisInput = {
          name: '',
          email: '',
          subject: '',
          message: String(input)
        }
      }

      // Create combined text for analysis
      const allText = [analysisInput.name, analysisInput.email, analysisInput.subject, analysisInput.message]
        .filter(Boolean)
        .join(' ')

      if (!allText || allText.trim().length === 0) {
        return this.createResult(0, 'CLEAN', performance.now() - startTime, {}, { error: 'Invalid input text' })
      }

      // Enhanced preprocessing with l33tspeak detection
      const preprocessingResult = this.preprocessor.preprocess(allText, this.options.preprocessing)
      const processedText = preprocessingResult.text || allText
      const preprocessingMetadata = preprocessingResult.metadata || {}

      // Create enhanced content object
      const content = {
        allText: processedText,
        allTextLower: processedText.toLowerCase(),
        originalText: allText,
        name: analysisInput.name || '',
        email: analysisInput.email || '',
        subject: analysisInput.subject || '',
        message: analysisInput.message || '',
        originalInput: analysisInput,
        preprocessing: preprocessingMetadata
      }

      let totalScore = 0
      let allFlags = []
      let highestIndividualScore = 0

      // NEW: Enhanced L33tspeak Analysis - Test all variations
      if (preprocessingMetadata.hasLeetSpeak && preprocessingMetadata.leetSpeakVariations) {
        const leetAnalysisResult = await this.analyzeAllLeetSpeakVariations(
          preprocessingMetadata.leetSpeakVariations, 
          content
        )
        
        if (leetAnalysisResult.maxScore > highestIndividualScore) {
          highestIndividualScore = leetAnalysisResult.maxScore
        }
        
        totalScore += leetAnalysisResult.bonusScore
        allFlags.push(...leetAnalysisResult.flags)
      }

      // Context detection
      const context = { isProfessional: false, isPersonal: false, isNeutral: true }
      if (this.options.enableContextDetection && this.contextDetector) {
        try {
          const contextResult = await this.contextDetector.analyzeContext(content)
          Object.assign(context, contextResult)
        } catch (error) {
          console.error('Context detection error:', error)
        }
      }

      // Run plugin analysis
      const pluginResults = await this.pluginManager.analyze(content, context)
      
      Object.entries(pluginResults).forEach(([pluginName, pluginResult]) => {
        if (pluginName.startsWith('_')) return
        
        const weight = this.options.plugins[pluginName]?.weight || 1
        const pluginScore = (pluginResult.score || 0) * weight
        totalScore += pluginScore
        allFlags.push(...(pluginResult.flags || []))
        
        if (pluginScore > highestIndividualScore) {
          highestIndividualScore = pluginScore
        }
      })

      // Use the higher of total accumulated score or highest individual score
      const finalScore = Math.max(totalScore, highestIndividualScore)

      const processingTime = performance.now() - startTime
      
      return this.createResult(
        finalScore,
        this.getRiskLevel(finalScore),
        processingTime,
        { 
          flags: allFlags,
          recommendation: this.getRecommendation(finalScore, this.getRiskLevel(finalScore)),
          confidence: this.calculateConfidence(finalScore, this.options.spamThreshold, { pluginResults })
        },
        {
          version: this.version,
          pluginsUsed: Object.keys(pluginResults).filter(name => !name.startsWith('_')),
          processedText: processedText,
          preprocessing: preprocessingMetadata,
          leetSpeakAnalysis: preprocessingMetadata.hasLeetSpeak ? {
            detected: true,
            variationsCount: preprocessingMetadata.leetSpeakVariations?.length || 0,
            highestVariationScore: highestIndividualScore
          } : { detected: false }
        }
      )

    } catch (error) {
      console.error('❌ Analysis error:', error)
      const processingTime = performance.now() - startTime
      return this.createResult(0, 'CLEAN', processingTime, {}, {
        error: true,
        message: error.message
      })
    }
  }

  /**
   * Analyze all l33tspeak variations to find the most toxic interpretation
   */
  async analyzeAllLeetSpeakVariations(variations, originalContent) {
    let maxScore = 0
    let totalBonus = 0
    const flags = []
    const variationResults = []

    if (this.options.debug) {
      console.log(`🔍 Analyzing ${variations.length} l33tspeak variations...`)
    }

    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i]
      if (variation === originalContent.originalText) continue // Skip original

      // Create content object for this variation
      const variationContent = {
        ...originalContent,
        allText: variation,
        allTextLower: variation.toLowerCase(),
        isLeetSpeakVariation: true,
        variationIndex: i
      }

      try {
        // Analyze this specific variation
        const variationScore = await this.analyzeSingleLeetSpeakVariation(variationContent)
        variationResults.push({
          text: variation,
          score: variationScore.score,
          flags: variationScore.flags,
          index: i
        })

        if (variationScore.score > maxScore) {
          maxScore = variationScore.score
        }

        if (this.options.debug && variationScore.score > 0) {
          console.log(`📝 Variation ${i}: "${variation}" -> Score: ${variationScore.score}`)
        }

      } catch (error) {
        console.error(`Error analyzing l33tspeak variation ${i}:`, error)
      }
    }

    // Calculate bonus based on l33tspeak detection
    if (maxScore > 5) {
      // Significant l33tspeak evasion detected
      totalBonus = Math.min(maxScore * 0.3, 10) // Up to 10 bonus points
      flags.push(`[LEETSPEAK-EVASION] Detected toxic content via l33tspeak decoding (+${totalBonus.toFixed(1)})`)
      
      if (this.options.debug) {
        console.log(`🚨 L33tspeak evasion detected! Max variation score: ${maxScore}, Bonus: ${totalBonus}`)
      }
    } else if (maxScore > 0) {
      // Minor l33tspeak usage
      totalBonus = 1
      flags.push(`[LEETSPEAK-MINOR] Minor l33tspeak usage detected (+1.0)`)
    }

    // Add the best matching variation to flags
    const bestVariation = variationResults.reduce((best, current) => 
      current.score > best.score ? current : best, 
      { score: 0, text: '', flags: [] }
    )

    if (bestVariation.score > 0) {
      flags.push(`[LEETSPEAK-DECODED] Best match: "${bestVariation.text}" (Score: ${bestVariation.score})`)
    }

    return {
      maxScore,
      bonusScore: totalBonus,
      flags,
      variationResults,
      bestVariation
    }
  }

  /**
   * Analyze a single l33tspeak variation using core detection patterns
   */
  async analyzeSingleLeetSpeakVariation(variationContent) {
    let score = 0
    const flags = []

    // Use the patterns from constants for direct harassment detection
    const { HARASSMENT_KEYWORDS } = require('./lib/constants/context-data')
    
    HARASSMENT_KEYWORDS.forEach(keyword => {
      if (variationContent.allTextLower.includes(keyword)) {
        let harassmentScore = 8 // Base score for l33tspeak harassment
        
        // Scale based on severity
        if (keyword.includes('kill') || keyword.includes('die')) {
          harassmentScore = 12
        }
        
        score += harassmentScore
        flags.push(`L33T-HARASSMENT: "${keyword}" found in decoded variation`)
      }
    })

    // Check for other toxic patterns that might be revealed
    const toxicPatterns = [
      { pattern: /fuck\s+you/gi, score: 10, name: 'Direct profanity' },
      { pattern: /you\s+suck/gi, score: 6, name: 'Mild harassment' },
      { pattern: /go\s+to\s+hell/gi, score: 8, name: 'Death wish' },
      { pattern: /piece\s+of\s+shit/gi, score: 12, name: 'Severe insult' },
      { pattern: /worthless\s+trash/gi, score: 10, name: 'Dehumanizing language' },
      { pattern: /stupid\s+bitch/gi, score: 12, name: 'Gendered harassment' }
    ]

    toxicPatterns.forEach(({ pattern, score: patternScore, name }) => {
      if (pattern.test(variationContent.allText)) {
        score += patternScore
        flags.push(`L33T-PATTERN: ${name} detected`)
      }
    })

    return { score, flags }
  }

  // Analytics and insights
  getAnalyticsReport() {
    return {
      version: '0.3.1',
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

  // ===== Result helper methods =====
  getRiskLevel(score) {
    if (score >= 15) return 'CRITICAL'
    if (score >= 10) return 'HIGH'
    if (score >= 5) return 'MEDIUM'
    if (score >= 2) return 'LOW'
    return 'CLEAN'
  }

  getRecommendation(score, riskLevel) {
    switch (riskLevel) {
      case 'CRITICAL':
        return 'Block immediately - High confidence spam/harassment detected'
      case 'HIGH':
        return 'Block - Likely spam or inappropriate content'
      case 'MEDIUM':
        return 'Review - Potentially problematic content detected'
      case 'LOW':
        return 'Monitor - Slightly concerning patterns detected'
      default:
        return 'Allow - Clean content detected'
    }
  }

  calculateConfidence(score, threshold, metadata = {}) {
    let confidence = 0.5

    if (score >= threshold) {
      const overage = score - threshold
      confidence = Math.min(0.95, 0.6 + overage * 0.1)
    } else {
      const underage = threshold - score
      confidence = Math.min(0.95, 0.6 + underage * 0.05)
    }

    if (metadata.mlAnalysis && metadata.mlAnalysis.confidence) {
      confidence = Math.min(0.98, confidence + metadata.mlAnalysis.confidence * 0.1)
    }

    if (metadata.performance && metadata.performance.pluginsUsed?.length > 4) {
      confidence = Math.min(0.99, confidence + 0.05)
    }

    return Math.round(confidence * 100) / 100
  }

  createResult(score, riskLevel, processingTime, additionalData = {}, metadata = {}) {
    const isSpam = Object.prototype.hasOwnProperty.call(additionalData, 'isSpam')
      ? additionalData.isSpam
      : score >= this.options.spamThreshold

    return {
      score,
      isSpam,
      riskLevel,
      processingTime: Math.round(processingTime * 1000) / 1000,
      recommendation: additionalData.recommendation || this.getRecommendation(score, riskLevel),
      confidence: additionalData.confidence || this.calculateConfidence(score, this.options.spamThreshold, metadata),
      flags: additionalData.flags || [],
      variant: 'core',
      details: additionalData.details || {},
      metadata: {
        ...metadata,
        ...(additionalData.metadata || {}),
        timestamp: new Date().toISOString(),
      },
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