/**
 * 🛡️ ContentGuard v4.7 - Next-Generation Content Analysis System
 * 
 * Super Simple API - Just analyze text and get a spam score from 0-10
 * 
 * @author ContentGuard Contributors
 * @license MIT
 * @version 4.7.0
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

// v4.7 ML Plugins
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
      enableMLFeatures: true, // NEW: Enable v4.7 ML features
      enableEmojiAnalysis: true, // NEW: Emoji sentiment
      enableCrossCultural: true, // NEW: Cross-cultural analysis
      maxProcessingTime: 10000, // 10 second timeout
    })
    
    // Simple but effective spam patterns
    this.spamPatterns = [
      // Direct threats and harassment
      { pattern: /kill\s+your?self/gi, score: 10, reason: 'suicide encouragement' },
      { pattern: /go\s+die/gi, score: 9, reason: 'death wish' },
      { pattern: /you\s+should\s+die/gi, score: 10, reason: 'death threat' },
      { pattern: /kys/gi, score: 10, reason: 'suicide abbreviation' },
      
      // Strong profanity
      { pattern: /\bf[u\*]+ck\s+you?\b/gi, score: 6, reason: 'strong profanity' },
      { pattern: /\bsh[i\*]+t\b/gi, score: 3, reason: 'profanity' },
      { pattern: /\bb[i\*]+tch\b/gi, score: 4, reason: 'profanity' },
      { pattern: /\ba[s\*]+hole\b/gi, score: 4, reason: 'profanity' },
      
      // Harassment terms
      { pattern: /you\s+are\s+trash/gi, score: 7, reason: 'personal attack' },
      { pattern: /worthless\s+piece/gi, score: 8, reason: 'severe insult' },
      { pattern: /stupid\s+idiot/gi, score: 5, reason: 'insult' },
      { pattern: /pathetic\s+loser/gi, score: 6, reason: 'personal attack' },
      
      // Spam indicators
      { pattern: /click\s+here\s+now/gi, score: 4, reason: 'spam language' },
      { pattern: /urgent.{0,20}action\s+required/gi, score: 5, reason: 'urgency scam' },
      { pattern: /congratulations.{0,30}won/gi, score: 6, reason: 'prize scam' },
      { pattern: /limited\s+time\s+offer/gi, score: 3, reason: 'sales spam' },
      
      // Common evasion patterns
      { pattern: /[a-z]\s*\.\s*[a-z]\s*\.\s*[a-z]/gi, score: 3, reason: 'character spacing evasion' },
      { pattern: /[0-9@$!*]{4,}/g, score: 2, reason: 'leetspeak evasion' },
      { pattern: /[а-я].*?(kill|die|trash)/gi, score: 8, reason: 'cyrillic evasion' }
    ]
    
    // Professional protection terms
    this.professionalTerms = [
      'server', 'database', 'system', 'application', 'deployment', 'infrastructure',
      'process', 'thread', 'service', 'api', 'endpoint', 'pipeline', 'cluster',
      'script', 'code', 'bug', 'error', 'exception', 'debug', 'log', 'crash',
      'business', 'project', 'meeting', 'analysis', 'report', 'professional',
      'technical', 'development', 'production', 'environment', 'security'
    ]

    // Initialize components used in analyze method
    this.preprocessor = new TextPreprocessor();
    // this.preprocessor.initialize(); // TextPreprocessor does not have an initialize method
    this.mlPlugins = {}; // For storing ML plugin instances
    this.stats = { // Basic stats initialization
      totalAnalyses: 0,
      totalTime: 0,
      averageTime: 0,
      mlAnalyses: 0,
      mlSuccessRate: 0
    };
    // It might also need PluginManager and ContextDetector if those were intended for the base class
    // this.pluginManager = new PluginManager();
    // this.contextDetector = new ContextDetector();

    // Ensure this.threshold is set, as createResult uses it.
    // this.options.spamThreshold is correctly set by mergeDefaultOptions.
    this.threshold = this.options.spamThreshold;
  }

  mergeDefaultOptions(userOptions) {
    const defaults = {
      // Core settings
      spamThreshold: userOptions.spamThreshold ?? 5, // Default to 5 if not provided
      enableEarlyExit: userOptions.enableEarlyExit ?? true,
      criticalThreshold: userOptions.criticalThreshold ?? 20, // Higher threshold for critical actions

      // Performance optimization
      enableCaching: userOptions.enableCaching ?? true,
      cacheSize: userOptions.cacheSize ?? 1000,

      // Plugin configurations - assuming ContentGuard might have its own plugin set or uses a subset
      plugins: deepMerge({
        // Define default plugin settings if ContentGuard uses them directly
        // For example:
        // obscenity: { weight: 1.0, contextAware: true },
        // sentiment: { weight: 1.0, contextAware: true },
      }, userOptions.plugins || {}),

      // Preprocessing options
      preprocessing: deepMerge({
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        removeExcessiveSpacing: true,
        contextAware: true // Assuming context awareness is a general feature
      }, userOptions.preprocessing || {}),

      // Context detection options
      contextDetection: deepMerge({
        enableDomainDetection: true,
        enablePatternMatching: true,
        enableVocabularyAnalysis: true,
        confidenceThreshold: 0.3
      }, userOptions.contextDetection || {}),

      // Feature toggles relevant to the main ContentGuard class
      enableLazyLoading: userOptions.enableLazyLoading ?? true, // If applicable
      debug: userOptions.debug ?? false,
      enableMetrics: userOptions.enableMetrics ?? true, // If applicable
      contextAware: userOptions.contextAware ?? true,

      // ML features - these were in the constructor, ensure they are part of defaults
      enableMLFeatures: userOptions.enableMLFeatures ?? true,
      enableEmojiAnalysis: userOptions.enableEmojiAnalysis ?? true,
      enableCrossCultural: userOptions.enableCrossCultural ?? true,
      maxProcessingTime: userOptions.maxProcessingTime ?? 10000,


      // Add any other specific default options for ContentGuard here
      // These would be analogous to v4.0 advanced features or backwards compatibility options
      // For example:
      // enableAdversarialDetection: userOptions.enableAdversarialDetection ?? true,
    };

    // Merge defaults with user-provided options, userOptions take precedence
    return { ...defaults, ...userOptions };
  }
  
  async analyze(input) {
    const startTime = Date.now()
    
    try {
      // Temporarily disable ML features to isolate pattern matching
      /*
      if (this.options.enableMLFeatures) {
        console.log('🤖 Initializing v4.7 ML plugins...')
        
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
        
        console.log('🚀 All v4.7 ML plugins initialized successfully')
      }
      */
      
      // Create combined text for analysis first
      const allText = [input.name, input.email, input.subject, input.message]
        .filter(Boolean)
        .join(' ')

      if (!allText || allText.trim().length === 0) {
        // This is the correct place for an early exit if all combined text is empty.
        return this.createResult(0, 'CLEAN', Date.now() - startTime, 'No content to analyze')
      }

      // Enhanced preprocessing with v4.7 confusables
      // Assuming this.preprocessor is initialized in constructor or elsewhere.
      const preprocessingResult = this.preprocessor.preprocess(allText, {
        ...this.options.preprocessing,  // Pass user's preprocessing options
        useAdvancedConfusables: true
      })
      const processedText = preprocessingResult.processedText
      const allTextLower = processedText.toLowerCase(); // Define allTextLower based on processedText

      // Professional context protection using allTextLower (derived from processedText)
      const professionalMatches = this.professionalTerms.filter(term => 
        allTextLower.includes(term)
      ).length
      
      // Apply professional context protection
      const professionalReduction = professionalMatches >= 3 ? 0.8 : 
                                   professionalMatches >= 2 ? 0.6 : 
                                   professionalMatches >= 1 ? 0.4 : 0
      
      let totalScore = 0
      const flags = []
      const matches = []
      // totalScore is initialized as `let totalScore = 0` further above.

      // console.log(`[DEBUG] Analyzing processedText (length ${processedText?.length}): "${processedText?.substring(0, 100)}..."`);

      for (const { pattern, score, reason } of this.spamPatterns) {
        const currentPattern = pattern;
        const currentScore = parseFloat(score) || 0;

        // console.log(`[DEBUG] Testing pattern: ${currentPattern.toString()} with score: ${currentScore} against: "${processedText?.substring(0,50)}..."`);
        // Ensure processedText is a string before exec
        const match = (typeof processedText === 'string') ? currentPattern.exec(processedText) : null;

        if (match) {
          // console.log(`[DEBUG] MATCH FOUND for pattern: ${currentPattern.toString()}, Match: "${match[0]}"`);
          const reduction = parseFloat(professionalReduction) || 0;
          const adjustedScore = Math.round(currentScore * (1.0 - reduction));

          // console.log(`[DEBUG] Original Score: ${currentScore}, Reduction: ${reduction}, Adjusted Score: ${adjustedScore}`);
          
          if (adjustedScore > 0) {
            totalScore += adjustedScore; // totalScore is the one declared earlier in the function
            flags.push(`${reason}: "${match[0]}"`);
            matches.push({ text: match[0], score: adjustedScore, reason });
            // console.log(`[DEBUG] totalScore now: ${totalScore}`);
          }
        }
        if (currentPattern && typeof currentPattern.lastIndex === 'number') { // Ensure pattern is a valid regex
            currentPattern.lastIndex = 0; // Reset regex
        }
      }
      
      // Additional scoring factors using processedText
      const emailCount = (processedText && typeof processedText === 'string' ? processedText.match(/@\w+\.\w+/g) : null || []).length;
      if (emailCount > 2) {
        // console.log(`[DEBUG] Emails found: ${emailCount}, adding 3 to score.`);
        totalScore += 3; // totalScore is the one declared earlier in the function
        flags.push(`Multiple emails detected (${emailCount})`);
        // console.log(`[DEBUG] totalScore after email check: ${totalScore}`);
      }
      // console.log(`[DEBUG] Final totalScore before createResult: ${totalScore}`);

      // Create content object for plugins with PREPROCESSED text
      const content = {
        name: input.name || '',
        email: input.email || '',
        subject: input.subject || '',
        message: input.message || '',
        allText: processedText,
        allTextLower: allTextLower,
        originalText: allText
      }

      // Initialize result structure
      const result = { // This 'result' object is passed to runMLAnalysis
        score: 0, // ML plugins might add to this score
        flags: [], // ML plugins might add to this
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
      
      // v4.7 ML analysis pipeline
      /*
      if (this.options.enableMLFeatures) {
        const context = {}; // Define context, as it's expected by runMLAnalysis
        await this.runMLAnalysis(processedText, context, result);
        totalScore += result.score; // Add score from ML analysis to totalScore
      }
      */
      
      const processingTime = Date.now() - startTime
      return this.createResult(totalScore, this.getRiskLevel(totalScore), processingTime, null, {
        flags,
        matches,
        professionalContext: professionalMatches
        // fields // 'fields' was not defined, causing a ReferenceError
      })

    } catch (error) {
      const processingTime = Date.now() - startTime
      if (this.debug) {
        console.error('Analysis error:', error)
      }
      return this.createResult(0, 'CLEAN', processingTime, `Analysis error: ${error.message}`)
    }
  }
  
  createResult(score, riskLevel, processingTime, error = null, details = {}) {
    const result = {
      // Main results (1-10 scale as requested)
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      isSpam: score >= this.options.spamThreshold, // Use this.options.spamThreshold for consistency
      confidence: this.calculateConfidence(score),
      
      // Additional info
      riskLevel,
      processingTime: Math.round(processingTime * 10) / 10,
      recommendation: this.getRecommendation(score, riskLevel),
      
      // Metadata
      variant: 'simple-fallback',
      flags: details.flags || [],
      timestamp: new Date().toISOString(),
      
      // Error handling
      ...(error && { error, success: false })
    }
    
    if (details.matches) result.matches = details.matches
    if (details.professionalContext) result.professionalContext = details.professionalContext
    if (details.fields) result.fields = details.fields
    
    return result
  }
  
  calculateConfidence(score) {
    // Simple confidence calculation
    if (score >= 8) return 0.95      // Very confident it's spam
    if (score >= 6) return 0.85      // Confident it's spam  
    if (score >= 4) return 0.75      // Moderately confident
    if (score >= 2) return 0.65      // Somewhat confident
    if (score >= 1) return 0.55      // Low confidence
    return 0.9                       // Very confident it's clean
  }
  
  getRiskLevel(score) {
    if (score >= 8) return 'CRITICAL'
    if (score >= 6) return 'HIGH'
    if (score >= 4) return 'MEDIUM'
    if (score >= 2) return 'LOW'
    return 'CLEAN'
  }
  
  getRecommendation(score, riskLevel) {
    switch (riskLevel) {
      case 'CRITICAL': return 'Block immediately - High confidence spam/harassment detected'
      case 'HIGH': return 'Block - Likely spam or inappropriate content'
      case 'MEDIUM': return 'Review - Potentially problematic content detected'
      case 'LOW': return 'Monitor - Slightly concerning patterns detected'
      default: return 'Allow - Clean content detected'
    }
  }
  
  async isSpam(input) {
    const result = await this.analyze(input)
    return result.isSpam
  }
  
  async getScore(input) {
    const result = await this.analyze(input)
    return result.score
  }

  // v4.7 Analytics and insights
  getAnalyticsReport() {
    // Ensure this.stats and this.plugins are initialized, e.g., in constructor
    this.stats = this.stats || { averageTime: 0, totalAnalyses: 0, mlSuccessRate: 0, totalTime: 0, mlAnalyses: 0 };
    this.plugins = this.plugins || {};
    this.mlPlugins = this.mlPlugins || {};

    return {
      version: '4.7.0',
      totalAnalyses: this.stats.totalAnalyses,
      performance: {
        averageTime: `${(this.stats.averageTime || 0).toFixed(2)}ms`,
        totalTime: `${this.stats.totalTime || 0}ms`,
        throughput: `${this.stats.totalTime ? (this.stats.totalAnalyses / (this.stats.totalTime / 1000)).toFixed(2) : 0} analyses/sec`
      },
      mlMetrics: {
        mlAnalyses: this.stats.mlAnalyses || 0,
        mlSuccessRate: `${((this.stats.mlSuccessRate || 0) * 100).toFixed(1)}%`,
        mlCoverage: `${this.stats.totalAnalyses ? ((this.stats.mlAnalyses / this.stats.totalAnalyses) * 100).toFixed(1) : 0}%`
      },
      features: {
        enabledPlugins: Object.keys(this.plugins).length,
        enabledMLPlugins: Object.keys(this.mlPlugins).length,
        preset: this.preset,
        mlFeatures: this.options.enableMLFeatures,
        emojiAnalysis: this.options.enableEmojiAnalysis,
        crossCultural: this.options.enableCrossCultural
      }
    };
    // guard = null; // This was moved out and commented, seems unrelated to this method's logic.
  }

  async runMLAnalysis(processedText, context, result) {
    // Basic implementation for the main ContentGuard class
    // This should iterate through plugins in this.mlPlugins and call their analyze methods
    // For now, this stub prevents "is not a function" error.
    // It will call analyze on each initialized plugin and allow them to modify result.score and result.flags.
    if (!this.mlPlugins) {
      if (this.options.debug) console.log("mlPlugins not initialized");
      return;
    }

    for (const pluginName in this.mlPlugins) {
      if (this.mlPlugins.hasOwnProperty(pluginName) && this.mlPlugins[pluginName] && typeof this.mlPlugins[pluginName].analyze === 'function') {
        try {
          if (this.options.debug) console.log(`Running ML plugin: ${pluginName}`);
          // Some plugins might be async, some not. Awaiting all for safety.
          const pluginResponse = await this.mlPlugins[pluginName].analyze(processedText, context);
          if (pluginResponse) {
            if (pluginResponse.score) {
              result.score += pluginResponse.score;
            }
            if (pluginResponse.flags && Array.isArray(pluginResponse.flags)) {
              result.flags.push(...pluginResponse.flags);
            }
            // Store detailed results in metadata if needed
            result.metadata = result.metadata || {};
            result.metadata.mlAnalysis = result.metadata.mlAnalysis || {};
            result.metadata.mlAnalysis[pluginName] = pluginResponse;
          }
        } catch (pluginError) {
          if (this.options.debug) {
            console.error(`Error running ML plugin ${pluginName}:`, pluginError);
          }
        }
      }
    }
  }
} // End of ContentGuard Class

// Cache for guard instances
let guardCache = new Map();

// Renamed and properly defined factory function
async function createGuardInstance(variant = 'moderate', options = {}) {
  const cacheKey = `${variant}-${JSON.stringify(options)}`;
  if (guardCache.has(cacheKey)) {
    return guardCache.get(cacheKey);
  }

  let guardInstance = null; // Changed variable name from 'guard' to 'guardInstance'
  let GuardSystemClass = null;

  try {
    const variantMap = {
      fast: require('./lib/variants/v4-fast.js').ContentGuardV4Fast,
      balanced: require('./lib/variants/v4-balanced.js').ContentGuardV4Balanced,
      large: require('./lib/variants/v4-large.js'), // Assuming this is a class
      turbo: require('./lib/variants/v4-turbo.js').ContentGuardV4Turbo
    };
    GuardSystemClass = variantMap[variant] || variantMap.balanced;

    if (GuardSystemClass) {
      // Check if it's the full module or the class itself (for 'large' variant)
      if (typeof GuardSystemClass === 'function') {
        guardInstance = new GuardSystemClass({ ...options, preset: variant });
      } else if (GuardSystemClass.ContentGuardV4Large) { // Handle cases like 'large' if it exports an object
        guardInstance = new GuardSystemClass.ContentGuardV4Large({ ...options, preset: variant });
      } else {
        throw new Error(`GuardSystemClass for variant '${variant}' is not a constructor.`);
      }
    }
  } catch (error) {
    if (options.debug) {
      console.log(`Advanced system for variant '${variant}' not available, using simple fallback: ${error.message}`);
    }
  }

  // Fallback to simple system (ContentGuard itself)
  if (!guardInstance) {
    // SimpleFallbackGuard was an alias for ContentGuard in the original exports
    guardInstance = new ContentGuard(variant, {
      ...options, // User options
      // Default threshold logic from original code, ensure 'variant' is used correctly
      threshold: options.threshold || (variant === 'large' ? 4 : variant === 'turbo' ? 6 : 5),
      debug: options.debug
    });
    
    if (options.debug) {
      console.log(`✅ Simple fallback guard (ContentGuard) initialized (${variant} profile)`);
    }
  }
  
  guardCache.set(cacheKey, guardInstance);
  return guardInstance;
}

// Create default instance
let defaultGuard = null;

async function getDefaultGuard() {
  if (!defaultGuard) {
    // Use the new factory function name, force debug true for testing
    // console.log('[DEBUG] getDefaultGuard: Forcing options.debug = true for createGuardInstance');
    defaultGuard = await createGuardInstance('balanced', { debug: true });
  }
  return defaultGuard;
}

// Simple API functions that use getDefaultGuard
async function analyze(input) {
  const guard = await getDefaultGuard();
  return guard.analyze(input);
}

async function isSpam(input) {
  const guard = await getDefaultGuard();
  return guard.isSpam(input);
}

async function getScore(input) {
  const guard = await getDefaultGuard();
  return guard.getScore(input);
}

// Export everything
module.exports = {
  // Simple API (recommended)
  analyze,
  isSpam,
  getScore,
  createGuard: createGuardInstance, // Export the new factory function
  
  // Export ContentGuard class (which serves as the fallback)
  ContentGuard: ContentGuard,
  
  // Advanced exports (if available)
  get ContentGuardV4Balanced() {
    try {
      return require('./lib/variants/v4-balanced').ContentGuardV4Balanced
    } catch {
      return SimpleFallbackGuard
    }
  }
}
