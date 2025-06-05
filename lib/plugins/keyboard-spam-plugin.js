/**
 * 🎹 Modular Keyboard & Pattern Spam Detection Plugin
 * 
 * Configurable detection categories:
 * - keyboardSequences: qwerasdf, asdfgh, etc.
 * - randomKeyMashing: fjdsfkdsjlkj, fdjferlkv, etc.
 * - characterRepetition: aaaaaaa, hiiiiii, etc.
 * - keyboardRolling: smooth finger patterns
 * - alternatingHands: left-right hand patterns
 * - lowEffortSpam: basic low-quality content
 * 
 * Each category can be independently enabled/disabled for fine-grained control.
 */

class KeyboardSpamPlugin {
  constructor() {
    this.name = 'keyboardSpam'
    this.version = '2.0.0'
    this.initialized = false
    this.options = {}
    
    // Default detection categories - all can be individually configured
    this.defaultCategories = {
      keyboardSequences: {
        enabled: true,
        weight: 1.0,
        description: 'Sequential keyboard patterns (qwerty, asdf, etc.)'
      },
      randomKeyMashing: {
        enabled: true,
        weight: 1.2,
        description: 'Random character sequences that look like keyboard mashing'
      },
      characterRepetition: {
        enabled: false,
        weight: 0.8,
        description: 'Excessive character repetition (aaaa, hiiii, etc.)'
      },
      keyboardRolling: {
        enabled: true,
        weight: 0.9,
        description: 'Smooth finger rolling patterns'
      },
      alternatingHands: {
        enabled: true,
        weight: 0.7,
        description: 'Left-right hand alternating patterns'
      },
      lowEffortSpam: {
        enabled: true,
        weight: 1.1,
        description: 'Low-effort spam patterns'
      }
    }
    
    // QWERTY keyboard layout mapping
    this.keyboardLayout = {
      topRow: 'qwertyuiop[]',
      middleRow: 'asdfghjkl;\'',
      bottomRow: 'zxcvbnm,./',
      numberRow: '1234567890-=',
      leftHand: 'qwertasdfgzxcvb',
      rightHand: 'yuiophjklnm',
      middleKeys: 'asdfghjkl',
      homeRow: 'asdfghjkl'
    }
    
    // Legitimate content patterns - improved and more specific
    this.legitimatePatterns = {
      // Technical content
      hexCodes: /^(0x|#)?[0-9a-f]{6,}$/i,
      base64: /^[A-Za-z0-9+/]{16,}={0,2}$/,
      urls: /https?:\/\/|www\.|ftp:\/\/|\.com|\.org|\.net|\.edu|\.gov/i,
      emails: /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      
      // Structured data
      uuids: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      licenseKeys: /^[A-Z0-9]{4,5}-[A-Z0-9]{4,5}-[A-Z0-9]{4,5}/i,
      serialNumbers: /^[A-Z0-9]{8,}$/,
      
      // File paths and extensions
      filePaths: /\.[a-z]{2,4}$|[\/\\]|^[a-z]:\\/i,
      
      // Gaming and usernames
      gamingUsernames: /^\w*\d+\w*$|^[a-z]+_[a-z]+$/i,
      
      // Abbreviations (more specific)
      abbreviations: /^[A-Z]{2,6}$|^[a-z]{2,6}$/,
      
      // Foreign languages with accents
      foreignChars: /[àáäâèéëêìíïîòóöôùúüûñçßščćžđ]/i,
      
      // Common expressions and emotions
      emotionalExpressions: /^(ha){3,}$|^(he){3,}$|^(hi){3,}$|^(ho){3,}$/i,
      laughter: /^(lol){2,}$|^(lmao){2,}$|^ahaha+$/i
    }
  }

  /**
   * Initialize the plugin with configuration
   */
  async init(config) {
    this.config = config || {}
    
    // Merge detection categories with user config
    this.categories = { ...this.defaultCategories }
    if (config?.categories) {
      for (const [category, settings] of Object.entries(config.categories)) {
        if (this.categories[category]) {
          this.categories[category] = { ...this.categories[category], ...settings }
        }
      }
    }
    
    this.options = {
      // Basic settings
      minLength: config?.minLength || 5, // Increased from 4 to reduce false positives
      maxLegitLength: config?.maxLegitLength || 25,
      sensitivityLevel: config?.sensitivityLevel || 'medium',
      
      // Scoring thresholds
      minScoreThreshold: config?.minScoreThreshold || 4, // Minimum score to flag
      maxSingleWordScore: config?.maxSingleWordScore || 8, // Cap per word
      
      // Context and behavior
      contextAware: config?.contextAware !== false,
      weight: config?.weight || 1.0,
      debug: config?.debug || false,
      
      // Detection categories
      categories: this.categories,
      
      ...config
    }
    
    this.initialized = true
    
    if (this.options.debug) {
      console.log('🎹 Modular keyboard spam detection initialized')
      console.log('📊 Enabled categories:', Object.entries(this.categories)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name))
    }
  }

  /**
   * Analyze content for spam patterns
   */
  async analyze(content, input, globalOptions = {}) {
    if (!this.initialized) {
      await this.init()
    }

    let score = 0
    const flags = []
    const debug = globalOptions.debug || this.options.debug

    if (debug) {
      console.log('🔍 KEYBOARD-SPAM: Running modular analysis...')
    }

    // Analyze different content fields with adjusted weights
    const checks = [
      { field: 'name', text: content.name, weight: 1.3 },
      { field: 'subject', text: content.subject, weight: 1.1 },
      { field: 'message', text: content.message, weight: 0.9 },
      { field: 'combined', text: content.allText, weight: 0.8 }
    ]

    for (const { field, text, weight } of checks) {
      if (!text || text.trim().length < this.options.minLength) continue

      const analysis = this.analyzeTextForSpamPatterns(text, field, debug)
      if (analysis.score > 0) {
        const fieldScore = Math.round(analysis.score * weight)
        score += fieldScore
        flags.push(...analysis.flags.map(flag => `${field}: ${flag}`))
        
        if (debug) {
          console.log(`🚨 KEYBOARD-SPAM: ${field} detected patterns (+${fieldScore} points)`)
        }
      }
    }

    // Apply sensitivity and final adjustments
    score = this.applyFinalAdjustments(score, content, debug)

    if (debug) {
      console.log(`📊 KEYBOARD-SPAM Plugin Final Score: ${score}`)
    }

    return { score, flags }
  }

  /**
   * Analyze text for spam patterns using enabled categories
   */
  analyzeTextForSpamPatterns(text, field, debug = false) {
    let score = 0
    const flags = []
    
    // Split into words for analysis
    const words = text.split(/\s+/).filter(word => word.length >= this.options.minLength)
    
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      if (cleanWord.length < this.options.minLength) continue

      // Skip legitimate content first
      if (this.isLegitimateContent(cleanWord, word)) {
        if (debug) {
          console.log(`✅ KEYBOARD-SPAM: Skipping legitimate: "${word}"`)
        }
        continue
      }

      // Run enabled detection categories
      const detectionResults = this.runEnabledDetections(cleanWord, word)
      
      if (detectionResults.totalScore > 0) {
        // Cap score per word to prevent single word from dominating
        const cappedScore = Math.min(detectionResults.totalScore, this.options.maxSingleWordScore)
        score += cappedScore
        flags.push(...detectionResults.flags.map(flag => `"${word}" - ${flag}`))
        
        if (debug) {
          console.log(`🚨 KEYBOARD-SPAM: Detected in "${word}": ${detectionResults.flags.join(', ')} (score: ${cappedScore})`)
        }
      }
    }

    return { score, flags }
  }

  /**
   * Run all enabled detection categories on a word
   */
  runEnabledDetections(cleanWord, originalWord) {
    let totalScore = 0
    const flags = []
    
    // Category 1: Keyboard Sequences
    if (this.categories.keyboardSequences.enabled) {
      const result = this.detectKeyboardSequences(cleanWord)
      if (result.score > 0) {
        totalScore += Math.round(result.score * this.categories.keyboardSequences.weight)
        flags.push(`Keyboard sequence: ${result.pattern}`)
      }
    }
    
    // Category 2: Random Key Mashing
    if (this.categories.randomKeyMashing.enabled) {
      const result = this.detectRandomKeyMashing(cleanWord)
      if (result.score > 0) {
        totalScore += Math.round(result.score * this.categories.randomKeyMashing.weight)
        flags.push('Random key mashing')
      }
    }
    
    // Category 3: Character Repetition (often disabled)
    if (this.categories.characterRepetition.enabled) {
      const result = this.detectCharacterRepetition(cleanWord)
      if (result.score > 0) {
        totalScore += Math.round(result.score * this.categories.characterRepetition.weight)
        flags.push('Character repetition')
      }
    }
    
    // Category 4: Keyboard Rolling
    if (this.categories.keyboardRolling.enabled) {
      const result = this.detectKeyboardRolling(cleanWord)
      if (result.score > 0) {
        totalScore += Math.round(result.score * this.categories.keyboardRolling.weight)
        flags.push('Keyboard rolling')
      }
    }
    
    // Category 5: Alternating Hands
    if (this.categories.alternatingHands.enabled) {
      const result = this.detectAlternatingHands(cleanWord)
      if (result.score > 0) {
        totalScore += Math.round(result.score * this.categories.alternatingHands.weight)
        flags.push('Alternating hands')
      }
    }
    
    // Category 6: Low Effort Spam
    if (this.categories.lowEffortSpam.enabled) {
      const result = this.detectLowEffortSpam(cleanWord)
      if (result.score > 0) {
        totalScore += Math.round(result.score * this.categories.lowEffortSpam.weight)
        flags.push('Low effort spam')
      }
    }
    
    return { totalScore, flags }
  }

  /**
   * Detect sequential keyboard patterns (qwerty, asdf, etc.)
   */
  detectKeyboardSequences(word) {
    const rows = [
      this.keyboardLayout.topRow,
      this.keyboardLayout.middleRow,
      this.keyboardLayout.bottomRow,
      this.keyboardLayout.numberRow
    ]

    for (const row of rows) {
      // Check for sequences of 4+ characters (more strict)
      for (let i = 0; i <= row.length - 4; i++) {
        const sequence = row.substring(i, i + 4)
        if (word.includes(sequence)) {
          const sequenceLength = this.getLongestSequence(word, row, i)
          return {
            score: Math.min(sequenceLength, 6), // 4-6 points based on length
            pattern: sequence
          }
        }
      }
    }
    
    return { score: 0 }
  }

  /**
   * Get the longest keyboard sequence starting from position
   */
  getLongestSequence(word, row, startPos) {
    let length = 4
    while (length <= 8 && startPos + length <= row.length) {
      const sequence = row.substring(startPos, startPos + length)
      if (!word.includes(sequence)) break
      length++
    }
    return length - 1
  }

  /**
   * Detect random key mashing patterns
   */
  detectRandomKeyMashing(word) {
    let score = 0
    
    // Check for high unique character ratio (randomness indicator)
    const unique = [...new Set(word.split(''))].length
    const uniqueRatio = unique / word.length
    
    if (word.length >= 8 && uniqueRatio > 0.75) {
      score += 3
    }
    
    // Check for lack of vowel structure
    const vowels = 'aeiou'
    const vowelCount = word.split('').filter(char => vowels.includes(char)).length
    const vowelRatio = vowelCount / word.length
    
    if (word.length >= 6 && vowelRatio < 0.1) {
      score += 2
    }
    
    // Check for middle-row concentration (common in random mashing)
    const middleRowChars = word.split('').filter(char => 
      this.keyboardLayout.middleKeys.includes(char)
    ).length
    const middleRatio = middleRowChars / word.length
    
    if (middleRatio > 0.6 && word.length >= 6) {
      score += 2
    }
    
    return { score: Math.min(score, 5) }
  }

  /**
   * Detect excessive character repetition
   */
  detectCharacterRepetition(word) {
    let score = 0
    
    // Only flag extreme repetition (5+ consecutive chars)
    const repetitions = word.match(/(.)\1{4,}/g) || []
    
    for (const rep of repetitions) {
      if (rep.length >= 5) {
        score += Math.min(rep.length - 4, 4) // 1-4 points based on length
      }
    }
    
    return { score: Math.min(score, 6) }
  }

  /**
   * Detect keyboard rolling patterns
   */
  detectKeyboardRolling(word) {
    const rollingPatterns = [
      'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl',
      'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop',
      'zxcv', 'xcvb', 'cvbn', 'vbnm'
    ]
    
    let score = 0
    for (const pattern of rollingPatterns) {
      if (word.includes(pattern)) {
        score += 2
      }
    }
    
    return { score: Math.min(score, 4) }
  }

  /**
   * Detect alternating hand patterns
   */
  detectAlternatingHands(word) {
    if (word.length < 6) return { score: 0 }
    
    let alternatingCount = 0
    
    for (let i = 0; i < word.length - 1; i++) {
      const current = word[i]
      const next = word[i + 1]
      
      const currentLeft = this.keyboardLayout.leftHand.includes(current)
      const nextLeft = this.keyboardLayout.leftHand.includes(next)
      
      if (currentLeft !== nextLeft) {
        alternatingCount++
      }
    }
    
    const alternatingRatio = alternatingCount / (word.length - 1)
    
    if (alternatingRatio > 0.7) {
      return { score: 3 }
    } else if (alternatingRatio > 0.5) {
      return { score: 2 }
    }
    
    return { score: 0 }
  }

  /**
   * Detect low-effort spam patterns
   */
  detectLowEffortSpam(word) {
    let score = 0
    
    // Check for very low vowel content combined with randomness
    const vowels = 'aeiou'
    const vowelCount = word.split('').filter(char => vowels.includes(char)).length
    const vowelRatio = vowelCount / word.length
    
    if (word.length >= 8 && vowelRatio < 0.05) {
      score += 2
    }
    
    // Check for character frequency anomalies
    const charCounts = {}
    word.split('').forEach(char => {
      charCounts[char] = (charCounts[char] || 0) + 1
    })
    
    const counts = Object.values(charCounts)
    const maxCount = Math.max(...counts)
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length
    
    // If character distribution is too uniform (indicates randomness)
    if (word.length >= 6 && maxCount / avgCount < 1.5) {
      score += 1
    }
    
    return { score: Math.min(score, 3) }
  }

  /**
   * Enhanced legitimate content detection
   */
  isLegitimateContent(cleanWord, originalWord) {
    // Check all legitimate patterns
    for (const [name, pattern] of Object.entries(this.legitimatePatterns)) {
      if (pattern.test(originalWord) || pattern.test(cleanWord)) {
        return true
      }
    }
    
    // Enhanced real word detection
    if (this.looksLikeRealWord(cleanWord)) {
      return true
    }
    
    // Technical content detection
    if (this.isTechnicalContent(originalWord, cleanWord)) {
      return true
    }
    
    return false
  }

  /**
   * Improved real word detection
   */
  looksLikeRealWord(word) {
    if (word.length < 3) return true
    
    // Common word patterns
    const commonEndings = ['ing', 'tion', 'sion', 'ed', 'er', 'est', 'ly', 'ness', 'ment', 'able', 'ible', 'ous', 'ful', 'less', 'ize', 'ise']
    const commonPrefixes = ['un', 'pre', 're', 'in', 'im', 'dis', 'mis', 'over', 'under', 'out', 'sub', 'inter', 'anti', 'pro', 'de']
    
    // Check for common word patterns
    for (const ending of commonEndings) {
      if (word.endsWith(ending) && word.length > ending.length + 2) {
        return true
      }
    }
    
    for (const prefix of commonPrefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        return true
      }
    }
    
    // Vowel-consonant analysis
    const vowels = 'aeiou'
    const vowelCount = word.split('').filter(char => vowels.includes(char)).length
    const vowelRatio = vowelCount / word.length
    
    // Must have reasonable vowel ratio (10-60% for English)
    if (vowelCount === 0 || vowelRatio > 0.6 || vowelRatio < 0.1) {
      return false
    }
    
    // Check for reasonable character distribution
    const charCounts = {}
    word.split('').forEach(char => {
      charCounts[char] = (charCounts[char] || 0) + 1
    })
    
    const maxCharFreq = Math.max(...Object.values(charCounts)) / word.length
    
    // If a single character dominates too much, it's probably not a real word
    if (maxCharFreq > 0.5) {
      return false
    }
    
    return true
  }

  /**
   * Technical content detection
   */
  isTechnicalContent(originalWord, cleanWord) {
    // Hash-like patterns
    if (/^[a-f0-9]{8,}$/i.test(cleanWord) && cleanWord.length >= 8) return true
    
    // Version numbers
    if (/\d+\.\d+/.test(originalWord)) return true
    
    // Mixed alphanumeric IDs
    if (/^[a-z0-9]{8,}$/i.test(cleanWord) && /\d/.test(cleanWord) && /[a-z]/i.test(cleanWord)) {
      return true
    }
    
    // API keys, tokens, etc.
    if (cleanWord.length >= 20 && /^[a-z0-9]+$/i.test(cleanWord)) {
      return true
    }
    
    return false
  }

  /**
   * Apply final scoring adjustments based on sensitivity and context
   */
  applyFinalAdjustments(score, content, debug = false) {
    // Apply minimum threshold first
    if (score < this.options.minScoreThreshold) {
      return 0
    }
    
    // Apply sensitivity adjustments
    const sensitivity = this.options.sensitivityLevel
    
    switch (sensitivity) {
      case 'low':
        // More conservative - require higher confidence
        score = score > 6 ? Math.round(score * 0.7) : 0
        break
        
      case 'high':
        // More aggressive detection
        score = Math.round(score * 1.2)
        break
        
      case 'medium':
      default:
        // Standard sensitivity with slight reduction
        score = Math.round(score * 0.9)
        break
    }
    
    // Apply final weight
    score = Math.round(score * this.options.weight)
    
    if (debug) {
      console.log(`🎯 KEYBOARD-SPAM: Applied ${sensitivity} sensitivity, final score: ${score}`)
    }
    
    return Math.max(score, 0)
  }
}

module.exports = KeyboardSpamPlugin 