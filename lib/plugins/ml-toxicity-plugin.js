/**
 * 🤖 ML Toxicity Detection Plugin v4.7
 * 
 * Lightweight transformer-based toxicity detection using Transformers.js.
 * Provides semantic understanding to catch subtle harassment patterns
 * that rule-based systems miss. Edge-compatible and fast.
 */

class MLToxicityPlugin {
  constructor() {
    this.name = 'ml-toxicity'
    this.description = 'Transformer-based semantic toxicity detection'
    this.version = '4.7.0'
    this.initialized = false
    this.transformer = null
    
    // Fallback patterns for when ML is unavailable
    this.semanticPatterns = [
      // Subtle condescension
      { 
        pattern: /(?:not surprised|clearly|obviously|simple(?:ly)?)\s+(?:you|your)/i,
        score: 3, 
        type: 'condescension',
        description: 'Condescending language patterns'
      },
      
      // Capability questioning
      {
        pattern: /(?:are you (?:sure|capable)|can you (?:handle|manage)|(?:maybe|perhaps) you should)/i,
        score: 2,
        type: 'capability_questioning',
        description: 'Questioning competence patterns'
      },
      
      // Exclusionary language
      {
        pattern: /(?:people like you|not (?:really )?(?:cut out|designed|meant) for|doesn't fit|not (?:the )?right (?:fit|type))/i,
        score: 4,
        type: 'exclusionary',
        description: 'Exclusionary language patterns'
      },
      
      // Gaslighting patterns
      {
        pattern: /(?:you'?re (?:being|over)reacting|you'?re (?:too )?sensitive|that'?s not what|you'?re (?:imagining|projecting))/i,
        score: 3,
        type: 'gaslighting',
        description: 'Gaslighting patterns'
      },
      
      // Power dynamics abuse
      {
        pattern: /(?:remember who|know your place|work for me|signs? your paycheck|easily replaceable)/i,
        score: 5,
        type: 'power_abuse',
        description: 'Power dynamics abuse'
      },
      
      // Coded threats
      {
        pattern: /(?:would be (?:unfortunate|interesting)|accidents happen|careful about|watch (?:your|yourself))/i,
        score: 4,
        type: 'coded_threat',
        description: 'Veiled threat patterns'
      }
    ]
    
    // Positive context indicators that reduce scores
    this.positivePatterns = [
      /(?:thank you|please|appreciate|grateful|respect|understand|help)/i,
      /(?:feedback|suggestion|recommendation|advice|guidance)/i,
      /(?:learn|improve|develop|grow|support|assist)/i
    ]
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Try to initialize Transformers.js for sentiment analysis
      const { pipeline } = await import('@xenova/transformers')
      
      // Use a lightweight sentiment model
      this.transformer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { quantized: true, progress_callback: null }
      )
      
      this.initialized = true
      console.log('✅ ML Toxicity Plugin: Transformer model loaded successfully')
      
    } catch (error) {
      console.warn('⚠️ ML Toxicity Plugin: Transformer failed to load, using fallback patterns:', error.message)
      this.initialized = false // Will use fallback patterns
    }
  }

  async analyze(text, metadata = {}) {
    if (!text || typeof text !== 'string') {
      return { score: 0, flags: [], details: {} }
    }

    const result = {
      score: 0,
      flags: [],
      details: {
        mlEnabled: this.initialized,
        sentimentScore: null,
        semanticPatterns: [],
        confidence: 0,
        positiveSignals: 0
      }
    }

    try {
      // 1. Try ML analysis if available
      if (this.initialized && this.transformer) {
        await this.performMLAnalysis(text, result)
      }
      
      // 2. Always run semantic pattern analysis (backup + supplement)
      this.performSemanticAnalysis(text, result)
      
      // 3. Apply positive context adjustments
      this.applyPositiveAdjustments(text, result)
      
      // 4. Calculate confidence and final adjustments
      this.calculateConfidence(result)
      
    } catch (error) {
      console.error('ML Toxicity analysis error:', error)
      result.flags.push('[ML] Analysis error, using pattern fallback')
      // Continue with semantic patterns only
      this.performSemanticAnalysis(text, result)
    }

    return result
  }

  async performMLAnalysis(text, result) {
    try {
      // Split long text into chunks for better analysis
      const chunks = this.splitIntoChunks(text, 512)
      let totalSentiment = 0
      let negativeCount = 0
      
      for (const chunk of chunks) {
        const sentimentResult = await this.transformer(chunk)
        
        if (sentimentResult && sentimentResult[0]) {
          const { label, score } = sentimentResult[0]
          
          if (label === 'NEGATIVE') {
            totalSentiment += score
            negativeCount++
            
            // High-confidence negative sentiment indicates toxicity
            if (score > 0.8) {
              result.score += 3
              result.flags.push(`[ML] High-confidence negative sentiment (${(score * 100).toFixed(1)}%)`)
            } else if (score > 0.6) {
              result.score += 2
              result.flags.push(`[ML] Moderate negative sentiment (${(score * 100).toFixed(1)}%)`)
            } else if (score > 0.5) {
              result.score += 1
              result.flags.push(`[ML] Mild negative sentiment (${(score * 100).toFixed(1)}%)`)
            }
          }
          
          result.details.sentimentScore = totalSentiment / chunks.length
          result.details.confidence = score
        }
      }
      
      // Multiple negative chunks indicate persistent toxicity
      if (negativeCount > 1) {
        result.score += 1
        result.flags.push('[ML] Persistent negative sentiment across text')
      }
      
    } catch (error) {
      console.warn('ML sentiment analysis failed:', error.message)
      result.details.mlEnabled = false
    }
  }

  performSemanticAnalysis(text, result) {
    this.semanticPatterns.forEach(pattern => {
      const matches = text.match(pattern.pattern)
      if (matches) {
        result.score += pattern.score
        result.details.semanticPatterns.push({
          type: pattern.type,
          description: pattern.description,
          matches: matches.length,
          score: pattern.score
        })
        result.flags.push(`[ML] ${pattern.description}`)
      }
    })
  }

  applyPositiveAdjustments(text, result) {
    let positiveCount = 0
    
    this.positivePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        positiveCount += matches.length
      }
    })
    
    if (positiveCount > 0) {
      const reduction = Math.min(positiveCount * 0.5, 3) // Max 3 point reduction
      result.score = Math.max(0, result.score - reduction)
      result.details.positiveSignals = positiveCount
      result.flags.push(`[ML] Positive context detected (-${reduction.toFixed(1)} points)`)
    }
  }

  calculateConfidence(result) {
    // Higher confidence when both ML and patterns agree
    if (result.details.mlEnabled && result.details.semanticPatterns.length > 0) {
      result.details.confidence = Math.min(result.details.confidence + 0.2, 1.0)
      result.flags.push('[ML] High confidence: ML + pattern agreement')
    }
    
    // Adjust score based on confidence
    if (result.details.confidence > 0.8) {
      result.score = Math.round(result.score * 1.1) // Boost high-confidence scores
    } else if (result.details.confidence < 0.3) {
      result.score = Math.round(result.score * 0.8) // Reduce low-confidence scores
    }
  }

  splitIntoChunks(text, maxLength) {
    if (text.length <= maxLength) {
      return [text]
    }
    
    const chunks = []
    const sentences = text.split(/[.!?]+/)
    let currentChunk = ''
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence + '. '
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = sentence + '. '
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks.length > 0 ? chunks : [text.substring(0, maxLength)]
  }

  // Helper method for debugging
  async testSentiment(text) {
    if (!this.initialized) {
      await this.initialize()
    }
    
    if (this.transformer) {
      return await this.transformer(text)
    } else {
      return { error: 'Transformer not available' }
    }
  }
}

module.exports = { MLToxicityPlugin } 