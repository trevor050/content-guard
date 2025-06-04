/**
 * Optimized Obscenity Detection Plugin
 * 
 * Uses global dataset caching to avoid per-instance memory allocation
 */

const { TECHNICAL_TERMS, ACADEMIC_TERMS, BUSINESS_TERMS, MEDICAL_TERMS } = require('../constants/context-data')

// Global dataset cache to avoid per-instance allocation
let globalMatcher = null
let englishDataset = null
let englishRecommendedTransformers = null

class ObscenityPlugin {
  constructor() {
    this.name = 'obscenity'
    this.version = '2.0.0'
    this.initialized = false
    this.options = {}
  }

  /**
   * Initialize the plugin with global caching
   */
  async init(options = {}) {
    this.options = {
      contextAware: options.contextAware !== false,
      weight: options.weight || 1.0,
      customWords: options.customWords || [],
      whitelist: options.whitelist || [],
      ...options
    }

    // Initialize global matcher only once
    if (!globalMatcher) {
      try {
        const obscenity = require('obscenity')
        englishDataset = obscenity.englishDataset
        englishRecommendedTransformers = obscenity.englishRecommendedTransformers
        
        globalMatcher = new obscenity.RegExpMatcher({
          ...englishDataset.build(),
          ...englishRecommendedTransformers,
        })

        console.error('🛡️ Obscenity: Global dataset cache initialized')
      } catch (error) {
        console.warn('Obscenity library not available:', error.message)
        globalMatcher = this.createFallbackMatcher()
      }
    }

    this.initialized = true
  }

  /**
   * Analyze content for profanity with context awareness
   */
  async analyze(content, input, globalOptions = {}) {
    if (!this.initialized) {
      await this.init()
    }

    if (!globalMatcher) {
      return { score: 0, flags: ['Obscenity matcher not available'] }
    }

    let score = 0
    const flags = []

    if (globalOptions.debug) {
      console.log('🔍 OBSCENITY: Running analysis...')
    }

    const checks = [
      { field: 'name', text: content.name },
      { field: 'subject', text: content.subject },
      { field: 'message', text: content.message },
      { field: 'combined', text: content.allText }
    ]

    checks.forEach(({ field, text }) => {
      if (!text || text.trim().length === 0) return

      const matches = globalMatcher.getAllMatches(text)
      
      if (matches.length > 0) {
        matches.forEach(match => {
          let word = 'unknown'
          
          try {
            if (englishDataset) {
              const { phraseMetadata } = englishDataset.getPayloadWithPhraseMetadata(match)
              word = phraseMetadata.originalWord
            } else {
              word = text.substring(match.startIndex, match.endIndex)
            }
          } catch (error) {
            word = text.substring(match.startIndex, match.endIndex)
          }

          // Check if this is whitelisted
          if (this.options.whitelist.some(w => word.toLowerCase().includes(w.toLowerCase()))) {
            if (globalOptions.debug) {
              console.log(`🧠 OBSCENITY: Whitelisted word: "${word}"`)
            }
            return
          }

          // Check context awareness
          if (this.options.contextAware && this.isContextuallyAppropriate(content, word)) {
            if (globalOptions.debug) {
              console.log(`🧠 OBSCENITY: Contextually appropriate: "${word}" in ${field}`)
            }
            return // Skip this match
          }

          const fieldScore = 4
          score += fieldScore
          flags.push(`Profanity in ${field}: "${word}"`)
          
          if (globalOptions.debug) {
            console.log(`🚨 OBSCENITY: Profanity in ${field}: "${word}" (+4 points)`)
          }
        })
      }
    })

    // Apply weight
    score = Math.round(score * this.options.weight)

    if (globalOptions.debug) {
      console.log(`📊 OBSCENITY Plugin Score: ${score}`)
    }

    return { score, flags }
  }

  /**
   * Enhanced context awareness checking
   */
  isContextuallyAppropriate(content, flaggedWord) {
    const lowerText = content.allTextLower
    const flaggedLower = flaggedWord.toLowerCase()

    // Check for legitimate word context (e.g., "ass" in "assessment", "class", etc.)
    const legitimateWords = {
      'ass': ['assessment', 'class', 'classic', 'assist', 'associate', 'asset', 'passage', 'embassy', 'mass', 'brass', 'glass'],
      'hell': ['hello', 'shell', 'shelter', 'helpful'],
      'damn': ['damage', 'damnation'],
      'crap': ['scrap', 'scrape'],
      'shit': ['shift', 'shirt', 'ship']
    }

    if (legitimateWords[flaggedLower]) {
      for (const legitWord of legitimateWords[flaggedLower]) {
        if (lowerText.includes(legitWord)) {
          return true
        }
      }
    }

    // Check for technical context
    for (const term of TECHNICAL_TERMS) {
      if (lowerText.includes(term.toLowerCase()) && term.toLowerCase().includes(flaggedLower)) {
        return true
      }
    }

    // Check for academic context
    const hasAcademicContext = ACADEMIC_TERMS.some(term => 
      lowerText.includes(term.toLowerCase())
    )

    if (hasAcademicContext) {
      const academicUsage = ['ratio', 'analysis', 'research', 'study', 'critical', 'urgent']
      if (academicUsage.includes(flaggedLower)) {
        return true
      }
    }

    // Check for business/medical contexts
    const hasBusinessContext = BUSINESS_TERMS.some(term => lowerText.includes(term.toLowerCase()))
    const hasMedicalContext = MEDICAL_TERMS.some(term => lowerText.includes(term.toLowerCase()))

    if ((hasBusinessContext || hasMedicalContext) && ['urgent', 'critical', 'kill'].includes(flaggedLower)) {
      return true
    }

    return false
  }

  /**
   * Fallback matcher if obscenity library is not available
   */
  createFallbackMatcher() {
    const basicProfanity = [
      'fuck', 'shit', 'damn', 'hell', 'ass', 'bitch', 'bastard', 'crap'
    ]

    return {
      getAllMatches: (text) => {
        const matches = []
        const lowerText = text.toLowerCase()
        
        basicProfanity.forEach((word, index) => {
          const startIndex = lowerText.indexOf(word)
          if (startIndex !== -1) {
            matches.push({
              startIndex,
              endIndex: startIndex + word.length,
              termId: index
            })
          }
        })
        
        return matches
      }
    }
  }
}

module.exports = ObscenityPlugin 