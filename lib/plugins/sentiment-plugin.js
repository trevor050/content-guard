/**
 * Modern Sentiment Analysis Plugin
 * 
 * Uses wink-sentiment for more accurate and modern sentiment analysis
 */

// Lazy-loaded dependencies
let winkSentiment = null

class SentimentPlugin {
  constructor() {
    this.name = 'sentiment'
    this.version = '2.0.0'
    this.initialized = false
    this.options = {}
  }

  /**
   * Initialize the plugin
   */
  async init(config) {
    this.config = config || {}
    
    try {
      // Try to use wink-sentiment if available
      const winkSentiment = require('wink-sentiment')
      this.sentimentAnalyzer = winkSentiment
      this.initialized = true
      
      if (config?.debug) {
        console.log('✅ Advanced sentiment analysis initialized')
      }
    } catch (error) {
      // Fallback to simple sentiment analysis
      if (config?.debug) {
        console.log('wink-sentiment not available, falling back to simple sentiment')
      }
      this.initialized = true
    }
  }

  /**
   * Analyze content for sentiment
   */
  async analyze(content, input, globalOptions = {}) {
    if (!this.initialized) {
      await this.init()
    }

    let score = 0
    const flags = []

    try {
      // Use wink-sentiment for analysis
      const result = this.sentimentAnalyzer(content.allText)
      
      if (globalOptions.debug) {
        console.log('🔍 SENTIMENT: Raw analysis:', result)
      }

      // Detect professional contexts for threshold adjustment
      const contexts = this.detectContext(content)
      const hasProtectedContext = contexts.length > 0

      // Adjust thresholds based on context
      let negativeThreshold = this.options.negativeThreshold
      let moderateThreshold = this.options.moderateThreshold

      if (hasProtectedContext && this.options.contextAware) {
        negativeThreshold = -0.8  // Much more tolerant in professional contexts
        moderateThreshold = -0.6
      }

      // Professional language often uses words like "critical", "urgent", "prevent"
      const professionalNegativeWords = [
        'critical', 'urgent', 'prevent', 'avoid', 'risk', 'failure', 'problem',
        'issue', 'concern', 'emergency', 'stuck', 'error', 'bug', 'kill'
      ]

      // Filter out negative words that appear in professional contexts
      let filteredNegativeWords = []
      if (result.words && Array.isArray(result.words)) {
        filteredNegativeWords = result.words
          .filter(wordObj => wordObj.score < 0)
          .filter(wordObj => {
            const word = wordObj.word.toLowerCase()
            
            // Check if this is a professional word used in appropriate context
            if (professionalNegativeWords.includes(word) && hasProtectedContext) {
              if (globalOptions.debug) {
                console.log(`🧠 SENTIMENT: Filtering professional word "${word}" in context`)
              }
              return false
            }
            
            return true
          })
      }

      // Hostile/negative sentiment scoring with enhanced context awareness
      if (result.normalizedScore <= negativeThreshold) {
        // Only flag if we have actual hostile words after filtering
        if (filteredNegativeWords.length > 0) {
          score += 6
          flags.push(`Highly negative sentiment (${result.normalizedScore.toFixed(3)})`)
          if (globalOptions.debug) {
            console.log(`🚨 SENTIMENT: Highly negative: ${result.normalizedScore.toFixed(3)} (+6 points)`)
          }
        }
      } else if (result.normalizedScore <= moderateThreshold) {
        if (filteredNegativeWords.length > 0) {
          score += 3
          flags.push(`Negative sentiment (${result.normalizedScore.toFixed(3)})`)
          if (globalOptions.debug) {
            console.log(`🚨 SENTIMENT: Negative: ${result.normalizedScore.toFixed(3)} (+3 points)`)
          }
        }
      }

      // Enhanced hostile words detection with context filtering
      const hostileCount = filteredNegativeWords.length

      if (hostileCount >= 3) {
        score += 4
        flags.push(`Multiple hostile words (${hostileCount})`)
        if (globalOptions.debug) {
          console.log(`🚨 SENTIMENT: Multiple hostile words (+4 points)`)
        }
      } else if (hostileCount >= 1) {
        // Only add score for truly hostile words, not professional language
        const actuallyHostile = filteredNegativeWords.filter(wordObj => {
          const word = wordObj.word.toLowerCase()
          const hostileWords = ['hate', 'stupid', 'idiot', 'moron', 'loser', 'pathetic', 'worthless', 'trash', 'garbage']
          return hostileWords.some(hostile => word.includes(hostile))
        })

        if (actuallyHostile.length > 0) {
          score += 2
          flags.push(`Hostile words (${actuallyHostile.length})`)
          if (globalOptions.debug) {
            console.log(`🚨 SENTIMENT: Hostile words (+2 points)`)
          }
        }
      }

    } catch (error) {
      flags.push(`Sentiment analysis error: ${error.message}`)
    }

    // Apply weight
    score = Math.round(score * this.options.weight)

    if (globalOptions.debug) {
      console.log(`📊 SENTIMENT Plugin Score: ${score}`)
    }

    return { score, flags }
  }

  /**
   * Detect context for sentiment analysis
   */
  detectContext(content) {
    const contexts = []
    const lowerText = content.allTextLower

    // Check for professional/academic contexts
    const professionalTerms = [
      'research', 'analysis', 'study', 'university', 'college', 'business',
      'medical', 'hospital', 'engineering', 'technical', 'professional'
    ]

    const foundTerms = professionalTerms.filter(term => lowerText.includes(term))
    
    if (foundTerms.length >= 1) {
      contexts.push({ type: 'professional', terms: foundTerms })
    }

    return contexts
  }

  /**
   * Fallback sentiment analysis if wink-sentiment is not available
   */
  createFallbackSentiment() {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome']
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'stupid', 'worst', 'sucks']

    return function(text) {
      const words = text.toLowerCase().split(/\s+/)
      let positiveCount = 0
      let negativeCount = 0

      words.forEach(word => {
        if (positiveWords.some(pos => word.includes(pos))) positiveCount++
        if (negativeWords.some(neg => word.includes(neg))) negativeCount++
      })

      const normalizedScore = (positiveCount - negativeCount) / Math.max(1, words.length)
      
      return {
        normalizedScore,
        words: words.map(word => ({
          word,
          score: positiveWords.some(pos => word.includes(pos)) ? 1 : 
                 negativeWords.some(neg => word.includes(neg)) ? -1 : 0
        }))
      }
    }
  }
}

module.exports = SentimentPlugin 