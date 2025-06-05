/**
 * 🔧 Advanced Text Preprocessing v4.0
 * 
 * Professional text normalization and preparation for content analysis.
 * Now includes advanced Unicode confusables handling and multi-language support.
 */

const { ConfusablesAdvancedPlugin } = require('../plugins/confusables-advanced-plugin')

class TextPreprocessor {
  constructor() {
    this.confusablesPlugin = new ConfusablesAdvancedPlugin()
  }

  preprocess(text, options = {}) {
    if (!text || typeof text !== 'string') return text

    let processed = text
    const metadata = {
      originalLength: text.length,
      transformations: [],
      leetSpeakVariations: null,
      hasLeetSpeak: false
    }

    // Normalize Unicode first
    if (options.normalizeUnicode !== false) {
      const normalized = processed.normalize('NFKC')
      if (normalized !== processed) {
        metadata.transformations.push('unicode_normalization')
        processed = normalized
      }
    }

    // Enhanced l33tspeak processing - generate all variations if detected
    if (options.normalizeLeetSpeak !== false) {
      const leetVariations = this.normalizeLeetSpeak(processed)
      if (leetVariations.length > 1) {
        metadata.hasLeetSpeak = true
        metadata.leetSpeakVariations = leetVariations
        metadata.transformations.push('leetspeak_detection')
        // Use the most likely decoded variation as the primary processed text
        processed = leetVariations[1] || leetVariations[0] // First variation is original, second is most likely decode
      }
    }

    // Remove excessive spacing
    if (options.removeExcessiveSpacing !== false) {
      const deSpaced = processed.replace(/\s{3,}/g, ' ').trim()
      if (deSpaced !== processed) {
        metadata.transformations.push('spacing_normalization')
        processed = deSpaced
      }
    }

    // Expand common slang if enabled
    if (options.expandSlang) {
      const expanded = this.expandSlang(processed)
      if (expanded !== processed) {
        metadata.transformations.push('slang_expansion')
        processed = expanded
      }
    }

    // Enhanced normalization for adversarial attacks
    if (options.enhancedNormalization) {
      const enhanced = this.enhancedNormalization(processed)
      if (enhanced !== processed) {
        metadata.transformations.push('enhanced_normalization')
        processed = enhanced
      }
    }

    metadata.finalLength = processed.length
    metadata.processingComplete = true

    // Return enhanced result with l33tspeak variations
    return {
      text: processed,
      metadata
    }
  }

  detectEvasionAttempts(text, result) {
    const evasionPatterns = [
      {
        pattern: /(.)\1{3,}/g, // Character repetition (aaaa)
        name: 'character_repetition',
        severity: 'medium'
      },
      {
        pattern: /[a-z]+[-_\.]+[a-z]+/gi, // Word separation (w-o-r-d)
        name: 'word_separation',
        severity: 'high'
      },
      {
        pattern: /\b\w*[\d@#$%&*]+\w*\b/g, // Number/symbol injection
        name: 'symbol_injection',
        severity: 'medium'
      },
      {
        pattern: /(\w)\s+(\w)/g, // Spaced letters (w o r d)
        name: 'letter_spacing',
        severity: 'high'
      }
    ]

    evasionPatterns.forEach(({ pattern, name, severity }) => {
      const matches = text.match(pattern)
      if (matches && matches.length > 0) {
        result.metadata.suspiciousPatterns.push({
          type: name,
          severity: severity,
          matches: matches.length,
          examples: matches.slice(0, 3) // Keep first 3 examples
        })
        result.metadata.transformations.push(`evasion_${name}`)
      }
    })
  }

  // Enhanced method for emoji extraction and normalization
  extractEmojis(text) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    return text.match(emojiRegex) || []
  }

  // Method to get detailed preprocessing analysis
  getPreprocessingAnalysis(text) {
    const analysis = {
      originalLength: text.length,
      estimatedLanguage: this.detectLanguage(text),
      unicodeComplexity: this.analyzeUnicodeComplexity(text),
      evasionRisk: 'low',
      recommendedProcessing: []
    }

    // Analyze Unicode complexity
    const unicodeBlocks = this.confusablesPlugin.getUnicodeAnalysis(text)
    analysis.unicodeComplexity = {
      blocks: unicodeBlocks.codePoints.length,
      scripts: [...new Set(unicodeBlocks.codePoints.map(cp => cp.unicodeBlock))],
      suspicious: unicodeBlocks.suspiciousPatterns.length > 0
    }

    // Assess evasion risk
    const result = { metadata: { suspiciousPatterns: [] } }
    this.detectEvasionAttempts(text, result)
    
    if (result.metadata.suspiciousPatterns.length > 2) {
      analysis.evasionRisk = 'high'
    } else if (result.metadata.suspiciousPatterns.length > 0) {
      analysis.evasionRisk = 'medium'
    }

    // Provide recommendations
    if (analysis.unicodeComplexity.suspicious) {
      analysis.recommendedProcessing.push('advanced_unicode_normalization')
    }
    if (analysis.evasionRisk === 'high') {
      analysis.recommendedProcessing.push('aggressive_evasion_detection')
    }
    if (text.length > 1000) {
      analysis.recommendedProcessing.push('chunked_analysis')
    }

    return analysis
  }

  detectLanguage(text) {
    // Simple language detection based on character patterns
    const patterns = {
      english: /^[a-zA-Z0-9\s\.,!?;:'"()\-]+$/,
      spanish: /[ñáéíóúü]/,
      french: /[àâäéèêëïîôöùûüÿç]/,
      german: /[äöüß]/,
      portuguese: /[ãõç]/,
      mixed: /[\u0400-\u04FF\u0370-\u03FF\u0590-\u05FF\u0600-\u06FF]/
    }

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang
      }
    }

    return 'unknown'
  }

  analyzeUnicodeComplexity(text) {
    const codePoints = [...text].map(char => char.codePointAt(0))
    const basicLatin = codePoints.filter(cp => cp <= 0x007F).length
    const extendedLatin = codePoints.filter(cp => cp > 0x007F && cp <= 0x024F).length
    const otherScripts = codePoints.filter(cp => cp > 0x024F).length

    return {
      total: codePoints.length,
      basicLatin: basicLatin,
      extendedLatin: extendedLatin,
      otherScripts: otherScripts,
      complexity: otherScripts > 0 ? 'high' : extendedLatin > 0 ? 'medium' : 'low'
    }
  }

  /**
   * Enhanced l33tspeak normalization with comprehensive decoding
   * Detects clear l33tspeak and generates all possible interpretations
   */
  normalizeLeetSpeak(text) {
    // Comprehensive l33tspeak mapping including letter substitutions
    const leetMap = {
      // Numbers to letters
      '0': ['o', 'O'],
      '1': ['i', 'I', 'l', 'L'],
      '3': ['e', 'E'],
      '4': ['a', 'A'],
      '5': ['s', 'S'],
      '7': ['t', 'T'],
      '8': ['b', 'B'],
      '9': ['g', 'G'],
      
      // Symbols to letters
      '@': ['a', 'A'],
      '!': ['i', 'I'],
      '$': ['s', 'S'],
      '|': ['l', 'L', 'i', 'I'],
      '+': ['t', 'T'],
      '€': ['e', 'E'],
      '£': ['l', 'L'],
      '%': ['x', 'X'],
      '&': ['and'],
      '#': ['h', 'H'],
      '*': ['a', 'A'],
      
      // Letter substitutions (common evasions)
      'v': ['u'], // fvck -> fuck
      'u': ['v'], // uuck -> vuck (reverse)
      'x': ['ck'], // fuxx -> fuck  
      'kk': ['ck'], // fukk -> fuck
      'cc': ['ck'], // fucc -> fuck
      'ph': ['f'], // phuck -> fuck
      'z': ['s'], // azz -> ass
      'gg': ['g'], // faggot variations
      'ii': ['i'], // shiit -> shit
      'oo': ['o'], // stoopid -> stupid
      'ee': ['e'], // freee -> free
      'w': ['u'], // wuck -> luck patterns (reversed w and u confusion)
      'y': ['i'], // shyt -> shit
      'ay': ['ai'], // mayn -> main
      'ur': ['your', 'you are'],
      'u': ['you'], // when used as standalone
      'r': ['are'], // when used as standalone
      'n': ['and'], // when used as standalone
      '2': ['to', 'too'],
      '4': ['for'], // already covered above but adding context
      'b4': ['before'],
      '8': ['ate'], // already covered above but adding context
      
      // Advanced evasions
      'ckk': ['ck'], // fuckk -> fuck
      'xxx': ['x'], // fuxxxer -> fuxxer -> fucker
      'zz': ['z'], // pizzza -> pizza
      'ff': ['f'], // stuffff -> stuff
      'ss': ['s'], // asss -> ass
      'tt': ['t'], // buttt -> butt
      'bb': ['b'], // stubb -> stub
      'pp': ['p'], // nippp -> nip
      'dd': ['d'], // studd -> stud
      'll': ['l'], // killl -> kill
      'mm': ['m'], // dummm -> dum
      'nn': ['n'], // thinn -> thin
      'rr': ['r'], // starrr -> star
      
      // Invisible/zero-width characters (often used in evasion)
      '\u200B': [''], // zero-width space
      '\u200C': [''], // zero-width non-joiner
      '\u200D': [''], // zero-width joiner
      '\uFEFF': [''], // zero-width no-break space
      '\u2060': [''], // word joiner
      
      // Diacritics removal patterns
      'á': ['a'], 'à': ['a'], 'â': ['a'], 'ã': ['a'], 'ä': ['a'], 'å': ['a'],
      'é': ['e'], 'è': ['e'], 'ê': ['e'], 'ë': ['e'],
      'í': ['i'], 'ì': ['i'], 'î': ['i'], 'ï': ['i'],
      'ó': ['o'], 'ò': ['o'], 'ô': ['o'], 'õ': ['o'], 'ö': ['o'],
      'ú': ['u'], 'ù': ['u'], 'û': ['u'], 'ü': ['u'],
      'ý': ['y'], 'ÿ': ['y'],
      'ñ': ['n'], 'ç': ['c']
    }

    // Detect if this text contains clear l33tspeak patterns
    const leetIndicators = /[0-9@!$|+€£%&#*]{2,}|[4@]ss|[3e][4@]t|k[1i!|]ll|d[1i!|][3e]|f[uvw]ck|sh[1i!|]t|b[1i!|]tch|[4a]ssh[0o]le|st[uvw]p[1i!|]d|n[1i!|]gg?[3e]r|n[1i!|]gg?[4a@]|f[4a@]gg?[0o]t|r[3e]t[4a@]rd|ch[1i!|]nk|sp[1i!|]c|k[1i!|]k[3e]/gi
    const hasLeetSpeak = leetIndicators.test(text)
    
    if (!hasLeetSpeak) {
      return [text] // No l33tspeak detected, return original
    }

    // Generate all possible interpretations
    const variations = this.generateLeetSpeakVariations(text, leetMap)
    
    // Return up to 10 most likely variations to prevent explosion
    return variations.slice(0, 10)
  }

  /**
   * Generate all reasonable l33tspeak variations
   */
  generateLeetSpeakVariations(text, leetMap) {
    const variations = new Set()
    variations.add(text) // Always include original
    
    // Start with basic single-character substitutions
    let currentVariations = [text]
    
    // Apply transformations in order of likelihood
    Object.entries(leetMap).forEach(([leetChar, replacements]) => {
      const newVariations = []
      
      for (const variation of currentVariations) {
        // Skip if this variation is getting too long (prevent explosion)
        if (newVariations.length > 50) break
        
        const regex = new RegExp(leetChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        
        if (regex.test(variation)) {
          for (const replacement of replacements) {
            const newVariation = variation.replace(regex, replacement)
            if (newVariation !== variation && newVariation.length <= text.length + 10) {
              newVariations.push(newVariation)
              variations.add(newVariation)
            }
          }
        }
      }
      
      // Add new variations to current set for next iteration
      currentVariations.push(...newVariations)
      
      // Limit total variations to prevent memory issues
      if (currentVariations.length > 100) {
        currentVariations = currentVariations.slice(0, 100)
      }
    })

    // Add specialized decoding patterns
    const specialPatterns = this.applySpecialLeetPatterns(text)
    specialPatterns.forEach(pattern => variations.add(pattern))
    
    // Filter and rank variations by likelihood
    return this.rankLeetSpeakVariations(Array.from(variations), text)
  }

  /**
   * Apply specialized l33tspeak patterns for known evasions
   */
  applySpecialLeetPatterns(text) {
    const variations = []
    const textLower = text.toLowerCase()
    
    // Common harassment word patterns
    const patterns = [
      // fuck variations
      { pattern: /f[uvw@*]c?k+/gi, replacements: ['fuck'] },
      { pattern: /ph[uvw]c?k+/gi, replacements: ['fuck'] },
      { pattern: /f[0o]{2,}k/gi, replacements: ['fuck'] },
      { pattern: /f[\*@#$%]ck/gi, replacements: ['fuck'] },
      
      // shit variations  
      { pattern: /sh[1i!|]t+/gi, replacements: ['shit'] },
      { pattern: /sh[1i!|][7t]+/gi, replacements: ['shit'] },
      { pattern: /5h[1i!|]t/gi, replacements: ['shit'] },
      
      // bitch variations
      { pattern: /b[1i!|]tch/gi, replacements: ['bitch'] },
      { pattern: /b[1i!|][7t]ch/gi, replacements: ['bitch'] },
      { pattern: /b[1i!|][7t][cç]h/gi, replacements: ['bitch'] },
      
      // ass variations
      { pattern: /[4a@]ss+/gi, replacements: ['ass'] },
      { pattern: /[4a@]zz+/gi, replacements: ['ass'] },
      { pattern: /[4a@]55/gi, replacements: ['ass'] },
      
      // asshole variations
      { pattern: /[4a@]ssh[0o]le/gi, replacements: ['asshole'] },
      { pattern: /[4a@]55h[0o]le/gi, replacements: ['asshole'] },
      { pattern: /[4a@]zzh[0o]le/gi, replacements: ['asshole'] },
      
      // kill variations
      { pattern: /k[1i!|]ll/gi, replacements: ['kill'] },
      { pattern: /k[1i!|][l|]+/gi, replacements: ['kill'] },
      
      // die variations
      { pattern: /d[1i!|][3e]/gi, replacements: ['die'] },
      { pattern: /dy[3e]/gi, replacements: ['die'] },
      
      // stupid variations
      { pattern: /st[uvw]p[1i!|]d/gi, replacements: ['stupid'] },
      { pattern: /5t[uvw]p[1i!|]d/gi, replacements: ['stupid'] },
      { pattern: /stu?p[1i!|]d/gi, replacements: ['stupid'] },
      
      // hate variations
      { pattern: /h[4a@][7t][3e]/gi, replacements: ['hate'] },
      { pattern: /h8/gi, replacements: ['hate'] },
      
      // yourself variations
      { pattern: /y[0o]ur?s[3e]lf/gi, replacements: ['yourself'] },
      { pattern: /ur?s[3e]lf/gi, replacements: ['yourself'] },
      
      // CRITICAL: Racial slur variations - ADDED
      { pattern: /n[1i!|]gg?[3e]r/gi, replacements: ['nigger'] },
      { pattern: /n[1i!|]gg?[4a@]/gi, replacements: ['nigga'] },
      { pattern: /n[3e]gr[0o]/gi, replacements: ['negro'] },
      { pattern: /c[0o]{2,}n/gi, replacements: ['coon'] },
      
      // Homophobic slur variations
      { pattern: /f[4a@]gg?[0o]t/gi, replacements: ['faggot'] },
      { pattern: /f[4a@]g/gi, replacements: ['fag'] },
      
      // Other identity-based slur variations
      { pattern: /ch[1i!|]nk/gi, replacements: ['chink'] },
      { pattern: /g[0o]{2,}k/gi, replacements: ['gook'] },
      { pattern: /sp[1i!|]c/gi, replacements: ['spic'] },
      { pattern: /k[1i!|]k[3e]/gi, replacements: ['kike'] },
      { pattern: /r[4a@]gh[3e][4a@]d/gi, replacements: ['raghead'] },
      
      // Ableist slur variations
      { pattern: /r[3e]t[4a@]rd/gi, replacements: ['retard'] },
      { pattern: /r[3e]t[4a@]rd[3e]d/gi, replacements: ['retarded'] },
      
      // Spaced-out evasions
      { pattern: /k-[1i!|]-l-l/gi, replacements: ['kill'] },
      { pattern: /d-[1i!|]-[3e]/gi, replacements: ['die'] },
      { pattern: /f-u-c-k/gi, replacements: ['fuck'] },
      { pattern: /s-h-[1i!|]-t/gi, replacements: ['shit'] },
      { pattern: /n-[1i!|]-g-g-[3e]-r/gi, replacements: ['nigger'] },
      { pattern: /f-[4a@]-g-g-[0o]-t/gi, replacements: ['faggot'] },
      
      // Advanced Unicode evasions
      { pattern: /к[1i!|]ѕѕ/gi, replacements: ['kiss'] }, // Cyrillic lookalikes
      { pattern: /f[ψυν]ck/gi, replacements: ['fuck'] }, // Greek lookalikes
    ]
    
    let modifiedText = text
    patterns.forEach(({ pattern, replacements }) => {
      if (pattern.test(modifiedText)) {
        replacements.forEach(replacement => {
          const newText = modifiedText.replace(pattern, replacement)
          if (newText !== modifiedText) {
            variations.push(newText)
          }
        })
      }
    })
    
    return variations
  }

  /**
   * Rank l33tspeak variations by likelihood of being the intended message
   */
  rankLeetSpeakVariations(variations, originalText) {
    return variations
      .map(variation => ({
        text: variation,
        score: this.calculateLeetSpeakScore(variation, originalText)
      }))
      .sort((a, b) => b.score - a.score) // Higher score = more likely
      .map(item => item.text)
  }

  /**
   * Calculate likelihood score for l33tspeak variation
   */
  calculateLeetSpeakScore(variation, original) {
    let score = 0
    
    // Prefer variations that form real words
    const realWords = ['fuck', 'shit', 'bitch', 'ass', 'asshole', 'kill', 'die', 'hate', 'stupid', 'idiot', 'damn', 'hell']
    const variationLower = variation.toLowerCase()
    
    realWords.forEach(word => {
      if (variationLower.includes(word)) {
        score += 10 // High score for real toxic words
      }
    })
    
    // Prefer variations that are similar length to original
    const lengthDiff = Math.abs(variation.length - original.length)
    score -= lengthDiff * 0.5
    
    // Prefer variations with fewer numbers/symbols (more "decoded")
    const numberSymbolCount = (variation.match(/[0-9@!$|+€£%&#*]/g) || []).length
    score -= numberSymbolCount * 2
    
    // Prefer variations that look like English
    const vowelRatio = (variation.match(/[aeiou]/gi) || []).length / variation.length
    if (vowelRatio > 0.1 && vowelRatio < 0.6) {
      score += 5 // Good vowel ratio
    }
    
    // Prefer variations without excessive repeated characters
    const repeatedChars = (variation.match(/(.)\1{2,}/g) || []).length
    score -= repeatedChars * 3
    
    return score
  }

  /**
   * Expand common slang and abbreviations
   */
  expandSlang(text) {
    const slangMap = {
      // Common toxic slang
      'ur': 'your',
      'u': 'you',
      'r': 'are',
      'n': 'and',
      'ur mom': 'your mother',
      'ur dad': 'your father',
      'gtfo': 'get the fuck out',
      'stfu': 'shut the fuck up',
      'fml': 'fuck my life',
      'wtf': 'what the fuck',
      'omfg': 'oh my fucking god',
      'lmfao': 'laughing my fucking ass off',
      'rotfl': 'rolling on the floor laughing',
      'smh': 'shaking my head',
      'imo': 'in my opinion',
      'imho': 'in my honest opinion',
      'tbh': 'to be honest',
      'ngl': 'not gonna lie',
      'fr': 'for real',
      'deadass': 'seriously',
      'periodt': 'period',
      'no cap': 'no lie',
      'cap': 'lie',
      
      // Internet speak
      'ppl': 'people',
      'plz': 'please',
      'thx': 'thanks',
      'ty': 'thank you',
      'np': 'no problem',
      'yw': 'you welcome',
      'irl': 'in real life',
      'afk': 'away from keyboard',
      'brb': 'be right back',
      'ttyl': 'talk to you later',
      'jk': 'just kidding',
      'lol': 'laughing out loud',
      'rofl': 'rolling on floor laughing',
      'omg': 'oh my god',
      'fyi': 'for your information',
      'tmi': 'too much information',
      
      // Gaming/online harassment
      'noob': 'newbie',
      'pwned': 'owned',
      'rekt': 'wrecked',
      'gg': 'good game',
      'ez': 'easy',
      'git gud': 'get good',
      'trash': 'garbage',
      'scrub': 'bad player',
      
      // Social media
      'dm': 'direct message',
      'rt': 'retweet',
      'avi': 'avatar',
      'bio': 'biography',
      'fam': 'family',
      'squad': 'group',
      'stan': 'obsessive fan',
      'salty': 'bitter',
      'shade': 'disrespect',
      'tea': 'gossip',
      'spill': 'reveal',
      'flex': 'show off',
      'vibe': 'feeling',
      'mood': 'feeling',
      'based': 'good',
      'cringe': 'embarrassing',
      'sus': 'suspicious',
      'bet': 'yes',
      'facts': 'true',
      'slaps': 'excellent',
      'bussin': 'excellent',
      'fire': 'excellent',
      'lit': 'excellent',
      'mid': 'mediocre',
      'ratio': 'get more likes',
      'L': 'loss',
      'W': 'win'
    }

    let expanded = text
    
    // Replace whole words only to avoid false replacements
    Object.entries(slangMap).forEach(([slang, expansion]) => {
      const regex = new RegExp(`\\b${slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      expanded = expanded.replace(regex, expansion)
    })
    
    return expanded
  }

  /**
   * Enhanced normalization for adversarial attacks
   */
  enhancedNormalization(text) {
    let normalized = text
    
    // Remove excessive punctuation
    normalized = normalized.replace(/[!]{3,}/g, '!')
    normalized = normalized.replace(/[?]{3,}/g, '?')
    normalized = normalized.replace(/[.]{3,}/g, '...')
    
    // Normalize excessive spacing
    normalized = normalized.replace(/\s{2,}/g, ' ')
    
    // Remove zero-width characters used for evasion
    normalized = normalized.replace(/[\u200B-\u200D\uFEFF\u2060-\u2064]/g, '')
    
    // Normalize case variations (like sMaRt)
    const words = normalized.split(/\s+/)
    normalized = words.map(word => {
      // If word has mixed case pattern (likely evasion), normalize it
      const hasUpperLower = /[a-z]/.test(word) && /[A-Z]/.test(word)
      const isAlternating = /^([a-z][A-Z]|[A-Z][a-z])+/.test(word)
      
      if (hasUpperLower && (isAlternating || word.length > 6)) {
        return word.toLowerCase()
      }
      
      return word
    }).join(' ')
    
    // Remove excessive character repetition (but preserve intent)
    normalized = normalized.replace(/(.)\1{3,}/g, '$1$1$1') // Max 3 repeated chars
    
    return normalized.trim()
  }
}

// Legacy compatibility functions
function normalizeText(text) {
  const preprocessor = new TextPreprocessor()
  const result = preprocessor.preprocess(text)
  return result.processedText
}

function confusablesNormalize(text) {
  const preprocessor = new TextPreprocessor()
  const confusablesResult = preprocessor.confusablesPlugin.analyze(text, {})
  return confusablesResult.normalizedText
}

module.exports = {
  TextPreprocessor,
  normalizeText,
  confusablesNormalize
} 