/**
 * 🚀 Enhanced ML Toxicity Detection Plugin v5.x
 *
 * Uses optimized small-scale Transformer model for NPM projects:
 * - jpcorb20/toxic-detector-distilroberta (Distilled RoBERTa for toxicity detection, ~80MB)
 *   Credit: jpcorb20 (https://huggingface.co/jpcorb20/toxic-detector-distilroberta)
 *
 * Bloat minimized: single-model approach ensures reasonable size and fast load
 */

class EnhancedMLToxicityPlugin {
  constructor() {
    this.name = 'enhanced-ml-toxicity'
    this.description = 'State-of-the-art transformer ensemble for toxicity detection'
    this.version = '5.0.0'
    this.initialized = false
    
    // ML model instance
    this.toxicityModel = null
    
    // Enhanced semantic patterns for fallback and supplementation
    this.advancedPatterns = [
      // Sophisticated harassment patterns
      { 
        pattern: /(?:not surprised|clearly|obviously)\s+(?:you|your)\s+(?:kind|type|people)/i,
        score: 6, 
        type: 'identity_attack',
        description: 'Identity-based condescension'
      },
      
      // Microaggressions
      {
        pattern: /(?:you'?re (?:articulate|well-spoken)|where are you (?:really )?from|you don'?t look)/i,
        score: 4,
        type: 'microaggression',
        description: 'Microaggressive language'
      },
      
      // Advanced gaslighting
      {
        pattern: /(?:you'?re (?:being|over)dramatic|that never happened|you'?re (?:misremembering|confused))/i,
        score: 5,
        type: 'gaslighting',
        description: 'Advanced gaslighting patterns'
      },
      
      // Workplace harassment
      {
        pattern: /(?:not a good (?:fit|match)|maybe (?:consider|think about)|this isn'?t working out)/i,
        score: 3,
        type: 'workplace_harassment',
        description: 'Workplace exclusion patterns'
      },
      
      // Coded threats and intimidation
      {
        pattern: /(?:be (?:careful|smart)|wouldn'?t want|things could get|accidents happen)/i,
        score: 7,
        type: 'coded_threat',
        description: 'Veiled threats or intimidation'
      },
      
      // Cross-cultural harassment
      {
        pattern: /(?:go back to|not from here|your (?:kind|people)|cultural differences)/i,
        score: 8,
        type: 'cultural_harassment',
        description: 'Cross-cultural harassment'
      },
      
      // AI-generated harassment patterns
      {
        pattern: /(?:as an ai|i understand your|based on (?:your|the))\s+.*(?:concern|feedback|perspective)/i,
        score: 2,
        type: 'ai_generated',
        description: 'AI-generated dismissive patterns'
      }
    ]
    
    // Context modifiers
    this.positiveContexts = [
      /(?:thank you|please|appreciate|grateful|respect|constructive)/i,
      /(?:feedback|suggestion|recommendation|advice|guidance|help)/i,
      /(?:learn|improve|develop|grow|support|collaborate)/i,
      /(?:professional|business|meeting|project|team)/i
    ]
    
    this.negativeAmplifiers = [
      /(?:always|never|constantly|typical|classic|obviously)/i,
      /(?:everyone knows|it'?s clear|face it|admit it)/i,
      /(?:get over it|deal with it|grow up|move on)/i
    ]
  }

  async initialize() {
    if (this.initialized) return

    try {
      console.log('🚀 Enhanced ML Toxicity Plugin: Initializing state-of-the-art models...')
      
      // Initialize transformers pipeline with compatible models
      const { pipeline } = await import('@xenova/transformers')
      
      console.log('📥 Loading jpcorb20/toxic-detector-distilroberta...')
      try {
        this.toxicityModel = await pipeline('text-classification', 'jpcorb20/toxic-detector-distilroberta', {
          quantized: true,
          progress_callback: null,
          device: 'cpu'
        })
        console.log('✅ jpcorb20/toxic-detector-distilroberta loaded successfully!')
      } catch (error) {
        console.warn('⚠️ Failed to load toxicity model:', error.message)
      }
      
      // Set initialized based on model load
      if (this.toxicityModel) {
        this.initialized = true
        console.log('✅ Enhanced ML Toxicity Plugin: Model loaded successfully!')
      } else {
        this.initialized = false
        console.log('⚠️ Enhanced ML Toxicity Plugin: No ML model loaded, using semantic patterns only')
      }
      
    } catch (error) {
      console.warn('⚠️ Enhanced ML Toxicity Plugin: Failed to load models, using fallback patterns:', error.message)
      this.initialized = false
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
        modelsEnabled: this.initialized,
        toxicityModel: null,
        semanticPatterns: [],
        confidence: 0,
        contextAdjustments: []
      }
    }

    try {
      // 1. Run ensemble ML analysis if models are available
      if (this.initialized) {
        await this.performEnsembleAnalysis(text, result)
      }
      
      // 2. Always run enhanced semantic pattern analysis
      this.performAdvancedSemanticAnalysis(text, result)
      
      // 3. Apply context-aware adjustments
      this.applyContextualAdjustments(text, result)
      
      // 4. Calculate final confidence and ensemble score
      this.calculateEnsembleScore(result)
      
    } catch (error) {
      console.error('Enhanced ML Toxicity analysis error:', error)
      result.flags.push('[ENHANCED-ML] Analysis error, using pattern fallback')
      this.performAdvancedSemanticAnalysis(text, result)
    }

    return result
  }

  async performEnsembleAnalysis(text, result) {
    try {
      // Split long text for better analysis
      const chunks = this.splitIntoChunks(text, 500)
      let totalScore = 0
      let chunkCount = 0
      
      for (const chunk of chunks) {
        chunkCount++
        if (this.toxicityModel) {
          const mlResult = await this.toxicityModel(chunk)
          if (mlResult && mlResult.length) {
            const toxicEntry = mlResult.find(r => /toxic/i.test(r.label)) || mlResult[0]
            const toxicScore = /toxic/i.test(toxicEntry.label) ? toxicEntry.score : (1 - toxicEntry.score)

            totalScore += toxicScore
            result.details.toxicityModel = toxicScore
            if (toxicScore > 0.7) {
              result.score += 5
              result.flags.push(`[ML] High toxic (${(toxicScore * 100).toFixed(1)}%)`)
            } else if (toxicScore > 0.4) {
              result.score += 2
              result.flags.push(`[ML] Potential toxic (${(toxicScore * 100).toFixed(1)}%)`)
            }
          }
        }
      }
      
      // Average model score
      result.details.toxicityModel = totalScore / chunkCount
    } catch (error) {
      console.warn('Ensemble ML analysis failed:', error.message)
      result.details.modelsEnabled = false
    }
  }

  performAdvancedSemanticAnalysis(text, result) {
    this.advancedPatterns.forEach(pattern => {
      const matches = text.match(pattern.pattern)
      if (matches) {
        result.score += pattern.score
        result.details.semanticPatterns.push({
          type: pattern.type,
          description: pattern.description,
          matches: matches.length,
          score: pattern.score
        })
        result.flags.push(`[ENHANCED-SEMANTIC] ${pattern.description}`)
      }
    })
  }

  applyContextualAdjustments(text, result) {
    const textLower = text.toLowerCase()
    let positiveAdjustment = 0
    let negativeAmplification = 0
    
    // Check for positive context indicators
    this.positiveContexts.forEach(pattern => {
      if (pattern.test(textLower)) {
        positiveAdjustment += 0.5
        result.details.contextAdjustments.push('Positive context detected')
      }
    })
    
    // Check for negative amplifiers
    this.negativeAmplifiers.forEach(pattern => {
      if (pattern.test(textLower)) {
        negativeAmplification += 0.3
        result.details.contextAdjustments.push('Negative amplifier detected')
      }
    })
    
    // Apply adjustments
    if (positiveAdjustment > 0 && result.score > 0) {
      const reduction = Math.min(result.score * 0.3, positiveAdjustment * 2)
      result.score = Math.max(0, result.score - reduction)
      result.flags.push(`[CONTEXT] Positive context reduction (-${reduction.toFixed(1)})`)
    }
    
    if (negativeAmplification > 0 && result.score > 2) {
      const amplification = negativeAmplification * 1.5
      result.score += amplification
      result.flags.push(`[CONTEXT] Negative amplification (+${amplification.toFixed(1)})`)
    }
  }

  calculateEnsembleScore(result) {
    // Calculate confidence based on ML model and semantic patterns
    let confidence = 0
    if (result.details.toxicityModel !== null) {
      confidence += result.details.toxicityModel * 0.6
    }
    if (result.details.semanticPatterns.length > 0) {
      confidence += Math.min(0.4, result.details.semanticPatterns.length * 0.05)
    }
    result.details.confidence = Math.min(1.0, confidence)
    result.details.ensembleScore = result.score
  }

  splitIntoChunks(text, maxLength) {
    if (text.length <= maxLength) {
      return [text]
    }
    
    const chunks = []
    const sentences = text.split(/[.!?]+/)
    let currentChunk = ''
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          // Sentence too long, split by words
          const words = sentence.split(/\s+/)
          for (const word of words) {
            if (currentChunk.length + word.length > maxLength) {
              if (currentChunk) {
                chunks.push(currentChunk.trim())
                currentChunk = word
              } else {
                chunks.push(word)
              }
            } else {
              currentChunk += (currentChunk ? ' ' : '') + word
            }
          }
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks.filter(chunk => chunk.length > 0)
  }

  // Test methods for development
  async testModels(text) {
    if (!this.initialized) {
      await this.initialize()
    }
    
    console.log('🧪 Testing enhanced ML models with text:', text.substring(0, 100) + '...')
    const result = await this.analyze(text)
    console.log('📊 Test results:', {
      score: result.score,
      confidence: result.details.confidence,
      flags: result.flags,
      models: {
        toxicityModel: result.details.toxicityModel
      }
    })
    return result
  }
}

module.exports = { EnhancedMLToxicityPlugin } 