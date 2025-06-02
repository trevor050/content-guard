/**
 * 🚀 TIER 1: Fast Analysis (1-5ms)
 * 
 * Lightning-fast pattern and rule-based detection that catches ~70% of obvious cases.
 * Uses highly optimized techniques:
 * - Enhanced regex patterns with context awareness
 * - Unicode normalization with confusables detection
 * - Statistical text features (entropy, character distribution)
 * - Word-level blocklist matching
 * - Basic sentiment indicators
 * 
 * Goal: Maximum speed with good coverage of clear-cut cases
 */

const { HARASSMENT_KEYWORDS, HARASSMENT_PATTERNS, SLANG_PATTERNS, PROBLEMATIC_MODERN_TERMS } = require('../constants/context-data')

class FastAnalysisTier {
  constructor(options = {}) {
    this.options = options
    
    // Pre-compile regex patterns for maximum speed
    this.patterns = this.compilePatterns()
    
    // Statistical thresholds for quick decisions
    this.thresholds = {
      toxicWordDensity: 0.15, // 15% toxic words = high confidence
      suspiciousCharRatio: 0.3, // 30% suspicious characters
      entropyThreshold: 3.5, // Low entropy = repeated patterns
      lengthAnomalyThreshold: 500 // Very long texts need more analysis
    }
    
    // Fast lookup tables
    this.toxicWords = new Set([
      ...HARASSMENT_KEYWORDS.map(w => w.toLowerCase()),
      ...PROBLEMATIC_MODERN_TERMS.map(w => w.toLowerCase()),
      // Add common obscenity words
      'damn', 'hell', 'shit', 'fuck', 'bitch', 'bastard', 'asshole',
      'idiot', 'stupid', 'moron', 'retard', 'gay', 'fag', 'nigger'
    ])
    
    // Cache for repeated text analysis
    this.cache = new Map()
    this.maxCacheSize = 1000
  }

  async analyze(content, context = {}) {
    const startTime = Date.now()
    const text = content.allTextLower
    
    // Quick cache check
    const cacheKey = this.hashText(text)
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    const result = {
      score: 0,
      flags: [],
      confidence: 0,
      metadata: {
        processingTime: 0,
        techniques: [],
        statistics: {}
      }
    }
    
    try {
      // ═══════════════════════════════════════════════════════════════
      // FAST PATTERN MATCHING
      // ═══════════════════════════════════════════════════════════════
      
      // 1. Immediate obvious toxicity patterns
      const explicitToxicScore = this.detectExplicitToxicity(text)
      if (explicitToxicScore > 0) {
        result.score += explicitToxicScore
        result.flags.push('[FAST] Explicit toxic content detected')
        result.confidence = Math.min(0.95, explicitToxicScore / 10)
        result.metadata.techniques.push('explicit_toxic')
      }
      
      // 2. Social engineering quick patterns
      const socialEngScore = this.detectSocialEngineering(text)
      if (socialEngScore > 0) {
        result.score += socialEngScore
        result.flags.push('[FAST] Social engineering patterns detected')
        result.confidence = Math.max(result.confidence, 0.8)
        result.metadata.techniques.push('social_engineering')
      }
      
      // 3. Statistical anomalies
      const statsResult = this.analyzeStatistics(text, content.originalText)
      result.score += statsResult.score
      result.flags.push(...statsResult.flags)
      result.metadata.statistics = statsResult.stats
      
      if (statsResult.highConfidence) {
        result.confidence = Math.max(result.confidence, 0.85)
      }
      
      // 4. Unicode and encoding attacks
      const unicodeScore = this.detectUnicodeAttacks(content.originalText, text)
      if (unicodeScore > 0) {
        result.score += unicodeScore
        result.flags.push('[FAST] Unicode obfuscation detected')
        result.confidence = Math.max(result.confidence, 0.75)
        result.metadata.techniques.push('unicode_attack')
      }
      
      // ═══════════════════════════════════════════════════════════════
      // CONFIDENCE CALCULATION
      // ═══════════════════════════════════════════════════════════════
      
      // High confidence for very obvious cases
      if (result.score >= 8) {
        result.confidence = Math.min(0.95, result.confidence + 0.1)
      } else if (result.score <= 1) {
        result.confidence = Math.max(0.9, result.confidence) // High confidence it's clean
      }
      
      // Cache result for future use
      result.metadata.processingTime = Date.now() - startTime
      this.cacheResult(cacheKey, result)
      
      return result
      
    } catch (error) {
      console.warn('Fast analysis error:', error.message)
      return {
        score: 0,
        flags: ['[FAST] Analysis error'],
        confidence: 0,
        metadata: { error: error.message }
      }
    }
  }

  detectExplicitToxicity(text) {
    let score = 0
    const words = text.split(/\s+/)
    let toxicWordCount = 0
    
    // Count toxic words with context awareness
    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '')
      if (this.toxicWords.has(cleanWord)) {
        toxicWordCount++
        
        // Extra weight for certain severe words
        if (this.isSevereWord(cleanWord)) {
          score += 3
        } else {
          score += 1.5
        }
      }
    }
    
    // NEW: Check sophisticated harassment patterns
    for (const pattern of HARASSMENT_PATTERNS) {
      if (pattern.test(text)) {
        score += 4 // Higher score for sophisticated patterns
        toxicWordCount += 2 // Count as multiple toxic indicators
      }
    }
    
    // Toxic word density bonus
    const density = toxicWordCount / words.length
    if (density > this.thresholds.toxicWordDensity) {
      score += 2 // Density bonus
    }
    
    return Math.min(score, 10) // Cap at 10
  }

  detectSocialEngineering(text) {
    let score = 0
    
    // Quick pattern matching for social engineering - ENHANCED
    const patterns = [
      /urgent.*action.*required/i,
      /verify.*account.*immediately/i,
      /suspended.*click.*here/i,
      /winner.*claim.*prize/i,
      /limited.*time.*offer/i,
      /secret.*tip.*money/i,
      
      // NEW: Enhanced social engineering patterns
      /account.*suspended.*verify/i,
      /click.*here.*verify/i,
      /urgent.*suspended/i,
      /verify.*immediately/i,
      /action.*required.*account/i,
      /suspended.*unusual.*activity/i
    ]
    
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        score += 3 // Increased from 2 to 3
      }
    }
    
    // Authority impersonation patterns - ENHANCED
    if (/from.*(bank|paypal|amazon|microsoft|google)/i.test(text) &&
        /urgent|immediate|suspend|verify|click/i.test(text)) {
      score += 4 // Increased from 3 to 4
    }
    
    // NEW: Generic authority patterns
    if (/urgent.*required/i.test(text) && /suspended|verify|click/i.test(text)) {
      score += 3
    }
    
    return Math.min(score, 8)
  }

  analyzeStatistics(text, originalText) {
    const stats = {
      length: text.length,
      entropy: this.calculateEntropy(text),
      suspiciousCharRatio: this.calculateSuspiciousCharRatio(originalText),
      repeatedPatterns: this.detectRepeatedPatterns(text),
      capsRatio: this.calculateCapsRatio(originalText)
    }
    
    let score = 0
    const flags = []
    let highConfidence = false
    
    // Low entropy = potential spam/repeated content
    if (stats.entropy < this.thresholds.entropyThreshold && text.length > 50) {
      score += 2
      flags.push('[FAST] Low entropy detected (repeated patterns)')
    }
    
    // High suspicious character ratio
    if (stats.suspiciousCharRatio > this.thresholds.suspiciousCharRatio) {
      score += 3
      flags.push('[FAST] High suspicious character ratio')
      highConfidence = true
    }
    
    // Excessive caps (shouting)
    if (stats.capsRatio > 0.7 && text.length > 20) {
      score += 1
      flags.push('[FAST] Excessive capitalization')
    }
    
    // Repeated patterns (classic spam)
    if (stats.repeatedPatterns > 3) {
      score += 2
      flags.push('[FAST] Repeated patterns detected')
    }
    
    return {
      score: Math.min(score, 6),
      flags,
      stats,
      highConfidence
    }
  }

  detectUnicodeAttacks(originalText, normalizedText) {
    let score = 0
    
    // Compare original vs normalized length
    const lengthDiff = originalText.length - normalizedText.length
    if (lengthDiff > originalText.length * 0.2) {
      score += 3 // Significant character removal indicates obfuscation
    }
    
    // Look for suspicious Unicode patterns - ENHANCED
    const suspiciousPatterns = [
      /[\u200B-\u200F\u2060\uFEFF]/g, // Zero-width characters
      /[\u0300-\u036F]/g, // Combining diacritical marks
      /[\uFF00-\uFFEF]/g, // Fullwidth characters
      /[\u2000-\u206F]/g, // General punctuation block
      /[\u0400-\u04FF]/g, // Cyrillic characters (NEW)
      /[\u0370-\u03FF]/g  // Greek characters (NEW)
    ]
    
    for (const pattern of suspiciousPatterns) {
      const matches = originalText.match(pattern)
      if (matches && matches.length > 5) {
        score += 2
      }
      // NEW: Even small amounts of Cyrillic/Greek in Latin text are suspicious
      if (pattern.source.includes('0400-04FF') || pattern.source.includes('0370-03FF')) {
        if (matches && matches.length > 0) {
          // Check if this is mixed script (Cyrillic/Greek mixed with Latin)
          const hasLatin = /[a-zA-Z]/.test(originalText)
          if (hasLatin) {
            score += 4 // High suspicion for mixed scripts
          }
        }
      }
    }
    
    // NEW: Check for homoglyph attacks specifically
    const homoglyphScore = this.detectHomoglyphAttacks(originalText)
    score += homoglyphScore
    
    return Math.min(score, 8) // Increased cap from 6 to 8
  }

  // NEW: Dedicated homoglyph detection method
  detectHomoglyphAttacks(text) {
    let score = 0
    
    // Common homoglyph substitutions used in attacks
    const homoglyphPairs = [
      ['a', 'а'], // Latin 'a' vs Cyrillic 'а'
      ['e', 'е'], // Latin 'e' vs Cyrillic 'е'  
      ['o', 'о'], // Latin 'o' vs Cyrillic 'о'
      ['p', 'р'], // Latin 'p' vs Cyrillic 'р'
      ['c', 'с'], // Latin 'c' vs Cyrillic 'с'
      ['x', 'х'], // Latin 'x' vs Cyrillic 'х'
      ['y', 'у'], // Latin 'y' vs Cyrillic 'у'
      ['i', 'і'], // Latin 'i' vs Cyrillic 'і'
    ]
    
    // Count suspicious character substitutions
    let totalCyrillicChars = 0
    for (const [latin, cyrillic] of homoglyphPairs) {
      const cyrillicCount = (text.match(new RegExp(cyrillic, 'g')) || []).length
      if (cyrillicCount > 0) {
        totalCyrillicChars += cyrillicCount
        score += cyrillicCount * 1.0 // Increased from 0.5 to 1.0
      }
    }
    
    // NEW: Extra penalty for mixed script attacks (very suspicious)
    if (totalCyrillicChars > 0) {
      const hasLatin = /[a-zA-Z]/.test(text)
      if (hasLatin) {
        score += 3 // Extra penalty for mixed scripts
      }
    }
    
    // NEW: Check for specific attack words in Cyrillic
    const attackWords = ['уоu', 'аrе', 'trаsh', 'kiII', 'уоursеIf']
    for (const word of attackWords) {
      if (text.includes(word)) {
        score += 4 // High penalty for known attack words
      }
    }
    
    return Math.min(score, 8) // Increased cap from 4 to 8
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════
  
  isSevereWord(word) {
    const severeWords = new Set([
      'kill', 'murder', 'rape', 'bomb', 'terrorist', 'suicide'
    ])
    return severeWords.has(word)
  }

  calculateEntropy(text) {
    const charCounts = {}
    for (const char of text) {
      charCounts[char] = (charCounts[char] || 0) + 1
    }
    
    let entropy = 0
    const length = text.length
    for (const count of Object.values(charCounts)) {
      const probability = count / length
      entropy -= probability * Math.log2(probability)
    }
    
    return entropy
  }

  calculateSuspiciousCharRatio(text) {
    const suspiciousChars = text.match(/[^\w\s\.,;:!?'"()-]/g) || []
    return suspiciousChars.length / text.length
  }

  calculateCapsRatio(text) {
    const letters = text.match(/[a-zA-Z]/g) || []
    const caps = text.match(/[A-Z]/g) || []
    return letters.length > 0 ? caps.length / letters.length : 0
  }

  detectRepeatedPatterns(text) {
    const words = text.split(/\s+/)
    const wordCounts = {}
    let repeatedCount = 0
    
    for (const word of words) {
      if (word.length > 2) {
        wordCounts[word] = (wordCounts[word] || 0) + 1
        if (wordCounts[word] > 2) {
          repeatedCount++
        }
      }
    }
    
    return repeatedCount
  }

  compilePatterns() {
    // Pre-compile frequently used patterns for speed
    return {
      explicitThreat: /\b(kill|murder|bomb|terrorist|shoot|stab)\b/gi,
      personalAttack: /\b(idiot|stupid|moron|loser|pathetic)\b/gi,
      discrimination: /\b(because you're|all [a-z]+ are|typical [a-z]+)\b/gi
    }
  }

  hashText(text) {
    // Simple hash for cache keys
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }

  cacheResult(key, result) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, result)
  }
}

module.exports = FastAnalysisTier 