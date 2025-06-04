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
  }
  
  async analyze(input) {
    const startTime = Date.now()
    
    try {
      // v4.7 ML Plugins
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
      
      if (!text || text.trim().length === 0) {
        return this.createResult(0, 'CLEAN', Date.now() - startTime, 'No content to analyze')
      }
      
      // Professional context protection
      const lowerText = text.toLowerCase()
      const professionalMatches = this.professionalTerms.filter(term => 
        lowerText.includes(term)
      ).length
      
      // Apply professional context protection
      const professionalReduction = professionalMatches >= 3 ? 0.8 : 
                                   professionalMatches >= 2 ? 0.6 : 
                                   professionalMatches >= 1 ? 0.4 : 0
      
      let totalScore = 0
      const flags = []
      const matches = []
      
      // Check against spam patterns
      for (const { pattern, score, reason } of this.spamPatterns) {
        const match = pattern.exec(text)
        if (match) {
          // Apply professional context reduction
          const adjustedScore = Math.round(score * (1 - professionalReduction))
          if (adjustedScore > 0) {
            totalScore += adjustedScore
            flags.push(`${reason}: "${match[0]}"`)
            matches.push({ text: match[0], score: adjustedScore, reason })
          }
          
          if (this.debug) {
            console.log(`🔍 Pattern matched: ${reason} - "${match[0]}" (+${adjustedScore})`)
          }
        }
        pattern.lastIndex = 0 // Reset regex
      }
      
      // Additional scoring factors
      const emailCount = (text.match(/@\w+\.\w+/g) || []).length
      if (emailCount > 2) {
        totalScore += 3
        flags.push(`Multiple emails detected (${emailCount})`)
      }

      // Create combined text for analysis
      const allText = [input.name, input.email, input.subject, input.message]
        .filter(Boolean)
        .join(' ')

      if (!allText || allText.trim().length === 0) {
        return this.createResult(0, [], { error: 'Invalid input text' })
      }

      // Enhanced preprocessing with v4.7 confusables
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
      
      // v4.7 ML analysis pipeline
      if (this.options.enableMLFeatures) {
        await this.runMLAnalysis(processedText, context, result)
      }
      
      const processingTime = Date.now() - startTime
      return this.createResult(totalScore, this.getRiskLevel(totalScore), processingTime, null, {
        flags,
        matches,
        professionalContext: professionalMatches,
        fields
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
      isSpam: score >= this.threshold,
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
}

// Try to load the advanced v4.7 system, fallback to simple system
let guardCache = new Map()

    return {
      isSpam: score >= threshold,
      score: score,
      confidence: this.calculateConfidence(score, threshold, metadata),
      flags: flags,
      preset: this.preset,
      metadata: metadata || {},
      preprocessingApplied: metadata?.preprocessing?.applied,  // NEW: Show if preprocessing worked
      normalizedText: metadata?.processedText?.substring(0, 100),  // NEW: Show normalized text sample
      version: '4.7.0',
      timestamp: new Date().toISOString(),
      performance: {
        averageAnalysisTime: this.stats.averageTime,
        totalAnalyses: this.stats.totalAnalyses,
        mlSuccessRate: this.stats.mlSuccessRate
      }
    }
  }
  
  // Try to load advanced system first
  let GuardClass = null
  try {
    const variantMap = {
      fast: require('./lib/variants/v4-fast.js').ContentGuardV4Fast,
      balanced: require('./lib/variants/v4-balanced.js').ContentGuardV4Balanced,
      large: require('./lib/variants/v4-large.js'),
      turbo: require('./lib/variants/v4-turbo.js').ContentGuardV4Turbo
    }
    GuardClass = variantMap[variant] || variantMap.balanced
  } catch (error) {
    if (options.debug) {
      console.log('Advanced system not available, using simple fallback:', error.message)
    }
  }

  // v4.7 Analytics and insights
  getAnalyticsReport() {
    return {
      version: '4.7.0',
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
      guard = null
    }
  }
  
  // Fallback to simple system
  if (!guard) {
    guard = new SimpleFallbackGuard({
      threshold: variant === 'large' ? 4 : variant === 'turbo' ? 6 : 5,
      debug: options.debug,
      ...options
    })
    
    if (options.debug) {
      console.log(`✅ Simple fallback guard initialized (${variant} profile)`)
    }
  }
  
  guardCache.set(cacheKey, guard)
  return guard
}

// Create default instance
let defaultGuard = null

async function getDefaultGuard() {
  if (!defaultGuard) {
    defaultGuard = await createGuard('balanced')
  }
  return defaultGuard
}

// Simple API functions
async function analyze(input) {
  const guard = await getDefaultGuard()
  return guard.analyze(input)
}

async function isSpam(input) {
  const guard = await getDefaultGuard()
  return guard.isSpam(input)
}

async function getScore(input) {
  const guard = await getDefaultGuard()
  return guard.getScore(input)
}

// Export everything
module.exports = {
  // Simple API (recommended)
  analyze,
  isSpam,
  getScore,
  createGuard,
  
  // Legacy exports for backward compatibility
  ContentGuard: SimpleFallbackGuard,
  
  // Advanced exports (if available)
  get ContentGuardV4Balanced() {
    try {
      return require('./lib/variants/v4-balanced').ContentGuardV4Balanced
    } catch {
      return SimpleFallbackGuard
    }
  }
}
