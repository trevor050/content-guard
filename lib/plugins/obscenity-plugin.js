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
  async init(config) {
    try {
      if (!this.initialized) {
        // Initialize the obscenity dataset
        this.obscenity = new RegExpMatcher({
          ...dataset.build(),
          ...englishDataset.build(),
        })
        
        // Only log if debug mode is enabled
        if (config?.debug) {
          console.log('🛡️ Obscenity: Global dataset cache initialized')
        }
        
        this.initialized = true
      }
    } catch (error) {
      if (config?.debug) {
        console.warn('⚠️ Obscenity plugin failed to initialize:', error.message)
      }
    }
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

    // NEW: Cross-cultural word protection
    if (this.isCrossCulturalFalsePositive(content, flaggedWord)) {
      return true
    }

    // NEW: Contextual check for "ass" from "lmao"/"lmfao" in hyperbolic contexts
    if (flaggedLower === 'ass') {
      const originalTextForSlangCheck = content.originalText || lowerText; // Prefer original if available for slang check
      const isLmaoPresent = originalTextForSlangCheck.includes('lmao') || originalTextForSlangCheck.includes('lmfao');
      
      if (isLmaoPresent) {
        const hyperbolicContextIndicators = [
          'literally killing me',
          'kill myself', // from kms
          'kill yourself', // from kys (even if not expanded, the idea is there)
          'kys this bug',
          'deadass',
          'cant breathe' // common with lmao
        ];
        const hasHyperbolicContext = hyperbolicContextIndicators.some(ind => lowerText.includes(ind));
        
        if (hasHyperbolicContext) {
          // if (globalOptions && globalOptions.debug) { // globalOptions is not passed here
          //   console.log(`🧠 OBSCENITY: Skipping "ass" from lmao/lmfao in hyperbolic context: "${flaggedWord}"`);
          // }
          return true; // Skip "ass" if it came from lmao/lmfao in a hyperbolic phrase
        }
      }
    }

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
   * Detect cross-cultural false positives
   */
  isCrossCulturalFalsePositive(content, flaggedWord) {
    const text = content.allText
    const flaggedLower = flaggedWord.toLowerCase()
    
    // Cross-cultural legitimate words that contain English profanity
    const crossCulturalWords = {
      'anal': [
        // Spanish
        'análisis', 'analizar', 'análoga', 'análogo',
        // Portuguese  
        'análise', 'analisar',
        // French
        'analyse', 'analyser',
        // Italian
        'analisi', 'analizzare',
        // German (less common but possible)
        'analyse', 'analysieren',
        // Academic/technical English
        'analysis', 'analytical', 'analyze', 'analyst'
      ],
      'ass': [
        // Assessment-related
        'assessment', 'assess', 'assessed', 'assessing',
        // Class-related
        'class', 'classical', 'classify', 'classification',
        // Assistant/Associate
        'assistant', 'assist', 'assistance', 'associate',
        // Asset/Assembly
        'asset', 'assembly', 'assemble', 'assembling',
        // Passage/Mass
        'passage', 'mass', 'massive', 'embassy',
        // Glass/Brass  
        'glass', 'brass', 'grassland',
        // Other legitimate words
        'assignment', 'assumption', 'assassin'
      ],
      'sex': [
        // Legitimate words containing 'sex'
        'sexto', 'sextuple', 'sextet', 'bisexual', 'asexual', 'intersex'
      ],
      'hell': [
        'hello', 'shell', 'shelter', 'helpful', 'michelle', 'seychelles'
      ],
      'damn': [
        'damage', 'damnation', 'fundamental'
      ]
    }

    if (crossCulturalWords[flaggedLower]) {
      for (const legitWord of crossCulturalWords[flaggedLower]) {
        // Check if the flagged word appears as part of a legitimate word
        if (text.toLowerCase().includes(legitWord.toLowerCase())) {
          return true
        }
      }
    }

    // Special handling for unicode text with mixed scripts
    if (/[\u0080-\uFFFF]/.test(text)) {
      // Contains non-ASCII characters, likely multilingual
      const multilingualPatterns = [
        // Spanish: análisis, analizar
        /an[áa]lisis/i,
        /analizar/i,
        // Portuguese: análise
        /an[áa]lise/i,
        // French: analyse
        /analyse/i,
        // Academic patterns
        /data\s+analys[ie]s/i,
        /statistical\s+analys[ie]s/i,
        /market\s+analys[ie]s/i,
        // CJK + analysis patterns (Chinese, Japanese, Korean with English)
        /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]\s*analys/i,
        /analys[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/i
      ]
      
      if (multilingualPatterns.some(pattern => pattern.test(text))) {
        return true
      }
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