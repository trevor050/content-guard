/**
 * 🔄 Advanced Confusables Normalization Plugin v4.7
 * 
 * Professional Unicode confusables detection and normalization using
 * the standardized confusables library. Handles complex homograph attacks,
 * mixed-script obfuscation, and sophisticated Unicode evasion techniques.
 */

const confusables = require('confusables')

class ConfusablesAdvancedPlugin {
  constructor() {
    this.name = 'confusables-advanced'
    this.description = 'Professional Unicode confusables normalization'
    this.version = '4.7.0'
    
    // Test confusables library on initialization
    try {
      // Test the confusables library methods
      if (typeof confusables.remove === 'function') {
        this.confusablesMethod = confusables.remove
      } else if (typeof confusables === 'function') {
        this.confusablesMethod = confusables
      } else {
        console.warn('Confusables library not found, using fallback')
        this.confusablesMethod = null
      }
    } catch (error) {
      console.warn('Confusables library initialization failed:', error.message)
      this.confusablesMethod = null
    }
    
    // Extended confusables mapping for edge cases
    this.customMappings = {
      // CRITICAL: Cyrillic confusables (common in attacks)
      'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
      'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O', 
      'Р': 'P', 'С': 'C', 'Т': 'T', 'У': 'Y', 'Х': 'X',
      
      // CRITICAL: Mathematical/styled I and l characters
      'І': 'I', 'і': 'i', 'Ӏ': 'I', 'ӏ': 'l', 'ǀ': 'l', 'ǁ': 'll', 'ǂ': 'l',
      'ℐ': 'I', 'ℑ': 'I', 'ℓ': 'l', '𝐈': 'I', '𝐥': 'l', '𝑰': 'I', '𝒍': 'l',
      '𝓘': 'I', '𝓵': 'l', '𝔦': 'i', '𝔩': 'l', '𝕀': 'I', '𝕝': 'l',
      
      // Mathematical and styled characters
      '𝓪': 'a', '𝓫': 'b', '𝓬': 'c', '𝓭': 'd', '𝓮': 'e', '𝓯': 'f', '𝓰': 'g',
      '𝓱': 'h', '𝓲': 'i', '𝓳': 'j', '𝓴': 'k', '𝓵': 'l', '𝓶': 'm', '𝓷': 'n',
      '𝓸': 'o', '𝓹': 'p', '𝓺': 'q', '𝓻': 'r', '𝓼': 's', '𝓽': 't', '𝓾': 'u',
      '𝓿': 'v', '𝔀': 'w', '𝔁': 'x', '𝔂': 'y', '𝔃': 'z',
      
      // Double-struck (blackboard bold)
      '𝕒': 'a', '𝕓': 'b', '𝕔': 'c', '𝕕': 'd', '𝕖': 'e', '𝕗': 'f', '𝕘': 'g',
      '𝕙': 'h', '𝕚': 'i', '𝕛': 'j', '𝕜': 'k', '𝕝': 'l', '𝕞': 'm', '𝕟': 'n',
      '𝕠': 'o', '𝕡': 'p', '𝕢': 'q', '𝕣': 'r', '𝕤': 's', '𝕥': 't', '𝕦': 'u',
      '𝕧': 'v', '𝕨': 'w', '𝕩': 'x', '𝕪': 'y', '𝕫': 'z',
      
      // Fraktur
      '𝔞': 'a', '𝔟': 'b', '𝔠': 'c', '𝔡': 'd', '𝔢': 'e', '𝔣': 'f', '𝔤': 'g',
      '𝔥': 'h', '𝔦': 'i', '𝔧': 'j', '𝔨': 'k', '𝔩': 'l', '𝔪': 'm', '𝔫': 'n',
      '𝔬': 'o', '𝔭': 'p', '𝔮': 'q', '𝔯': 'r', '𝔰': 's', '𝔱': 't', '𝔲': 'u',
      '𝔳': 'v', '𝔴': 'w', '𝔵': 'x', '𝔶': 'y', '𝔷': 'z',
      
      // Small caps
      'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ғ': 'f', 'ɢ': 'g',
      'ʜ': 'h', 'ɪ': 'i', 'ᴊ': 'j', 'ᴋ': 'k', 'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n',
      'ᴏ': 'o', 'ᴘ': 'p', 'ǫ': 'q', 'ʀ': 'r', 's': 's', 'ᴛ': 't', 'ᴜ': 'u',
      'ᴠ': 'v', 'ᴡ': 'w', 'x': 'x', 'ʏ': 'y', 'ᴢ': 'z',
      
      // Regional indicators (used in some attacks)
      '🅰': 'a', '🅱': 'b', '🅾': 'o'
    }
    
    // Common Unicode attack patterns
    this.suspiciousPatterns = [
      { pattern: /[\u0400-\u04FF]/, name: 'cyrillic_mixing', severity: 'medium' },
      { pattern: /[\u0370-\u03FF]/, name: 'greek_mixing', severity: 'medium' },
      { pattern: /[\uFF00-\uFFEF]/, name: 'fullwidth_chars', severity: 'medium' },
      { pattern: /[\u1D400-\u1D7FF]/, name: 'mathematical_chars', severity: 'high' },
      { pattern: /[\u200B-\u200F\u2028-\u202F\u205F-\u206F]/, name: 'invisible_chars', severity: 'high' },
      { pattern: /[\u1F100-\u1F1FF]/, name: 'regional_indicators', severity: 'medium' }
    ]
  }

  analyze(text, metadata = {}) {
    if (!text || typeof text !== 'string') {
      return { 
        normalizedText: text, 
        score: 0, 
        flags: [], 
        details: { transformations: 0, suspiciousPatterns: [] } 
      }
    }

    const result = {
      normalizedText: text,
      score: 0,
      flags: [],
      details: {
        originalLength: text.length,
        transformations: 0,
        suspiciousPatterns: [],
        unicodeBlocks: new Set(),
        confusablesDetected: []
      }
    }

    try {
      // 1. Detect suspicious Unicode patterns before normalization
      this.detectSuspiciousPatterns(text, result)
      
      // 2. Apply professional confusables normalization
      let normalized = text
      
      // First try the standard confusables library
      try {
        if (this.confusablesMethod) {
          normalized = this.confusablesMethod(text)
          if (normalized !== text) {
            result.details.transformations++
            result.flags.push('[CONFUSABLES] Standard Unicode normalization applied')
          }
        } else {
          // Fallback to custom mappings only
          normalized = this.applyCustomMappings(text, result)
        }
      } catch (error) {
        console.warn('Confusables normalization failed, using fallback:', error.message)
        // Fallback to custom mappings
        normalized = this.applyCustomMappings(text, result)
      }
      
      // 3. Apply additional custom mappings for edge cases
      const finalNormalized = this.applyCustomMappings(normalized, result)
      
      // 4. Post-process common attack patterns
      const postProcessed = this.postProcessAttackPatterns(finalNormalized, result)
      
      // 5. Detect mixed script attacks
      this.detectMixedScriptAttacks(postProcessed, result)
      
      // 6. Detect invisible character attacks
      this.detectInvisibleChars(text, result)
      
      result.normalizedText = postProcessed
      
      // Calculate final score based on detected patterns
      this.calculateFinalScore(result)
      
    } catch (error) {
      console.error('Confusables analysis error:', error)
      result.flags.push('[CONFUSABLES] Analysis error, using original text')
    }

    return result
  }

  applyCustomMappings(text, result) {
    let normalized = text
    let transformationCount = 0
    
    for (const [confusable, replacement] of Object.entries(this.customMappings)) {
      if (normalized.includes(confusable)) {
        normalized = normalized.replace(new RegExp(confusable, 'g'), replacement)
        transformationCount++
        result.details.confusablesDetected.push({
          character: confusable,
          replacement: replacement
        })
      }
    }
    
    if (transformationCount > 0) {
      result.details.transformations += transformationCount
      result.flags.push(`[CONFUSABLES] Custom mappings applied (${transformationCount} chars)`)
    }
    
    return normalized
  }

  postProcessAttackPatterns(text, result) {
    let processed = text
    
    // Common attack pattern fixes
    const attackPatterns = [
      // Fix mixed case I/l patterns (kiII -> kill, yourseIf -> yourself)
      { pattern: /k[iI][lI][lI]/gi, replacement: 'kill', name: 'kill_obfuscation' },
      { pattern: /[yY]ourse[lI]f/gi, replacement: 'yourself', name: 'yourself_obfuscation' },
      { pattern: /d[iI]e/gi, replacement: 'die', name: 'die_obfuscation' },
      { pattern: /k[yY]s/gi, replacement: 'kys', name: 'kys_obfuscation' },
      
      // Fix common letter substitutions
      { pattern: /[iI]{2,}/g, replacement: 'll', name: 'double_i_to_ll' },
      { pattern: /[oO]0/g, replacement: 'oo', name: 'zero_to_o' },
      { pattern: /3[eE]/g, replacement: 'ee', name: 'three_to_e' },
      { pattern: /5[sS]/g, replacement: 'ss', name: 'five_to_s' }
    ]
    
    attackPatterns.forEach(({ pattern, replacement, name }) => {
      const matches = processed.match(pattern)
      if (matches) {
        processed = processed.replace(pattern, replacement)
        result.details.transformations++
        result.flags.push(`[CONFUSABLES] Fixed attack pattern: ${name}`)
      }
    })
    
    return processed
  }

  detectSuspiciousPatterns(text, result) {
    this.suspiciousPatterns.forEach(({ pattern, name, severity }) => {
      const matches = text.match(pattern)
      if (matches) {
        result.details.suspiciousPatterns.push({
          type: name,
          severity: severity,
          matches: matches.length
        })
        
        const severityScore = {
          'high': 3,
          'medium': 2,
          'low': 1
        }[severity] || 1
        
        result.score += severityScore
        result.flags.push(`[CONFUSABLES] Suspicious pattern: ${name}`)
      }
    })
  }

  detectMixedScriptAttacks(text, result) {
    const scriptBlocks = {
      latin: /[\u0020-\u007F\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/,
      cyrillic: /[\u0400-\u04FF]/,
      greek: /[\u0370-\u03FF]/,
      arabic: /[\u0600-\u06FF]/,
      hebrew: /[\u0590-\u05FF]/,
      cjk: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
      mathematical: /[\u1D400-\u1D7FF]/
    }
    
    const detectedScripts = []
    for (const [script, pattern] of Object.entries(scriptBlocks)) {
      if (pattern.test(text)) {
        detectedScripts.push(script)
        result.details.unicodeBlocks.add(script)
      }
    }
    
    // Mixed script in short text is suspicious
    if (detectedScripts.length > 2 && text.length < 200) {
      result.score += 2
      result.flags.push(`[CONFUSABLES] Mixed script attack detected: ${detectedScripts.join(', ')}`)
    } else if (detectedScripts.length > 1) {
      result.score += 1
      result.flags.push(`[CONFUSABLES] Mixed scripts detected: ${detectedScripts.join(', ')}`)
    }
  }

  detectInvisibleChars(text, result) {
    const invisibleChars = [
      '\u200B', // Zero Width Space
      '\u200C', // Zero Width Non-Joiner
      '\u200D', // Zero Width Joiner
      '\u2060', // Word Joiner
      '\uFEFF', // Zero Width No-Break Space
      '\u00AD'  // Soft Hyphen
    ]
    
    let invisibleCount = 0
    invisibleChars.forEach(char => {
      const matches = (text.match(new RegExp(char, 'g')) || []).length
      invisibleCount += matches
    })
    
    if (invisibleCount > 0) {
      result.score += Math.min(invisibleCount, 5) // Cap at 5 points
      result.flags.push(`[CONFUSABLES] Invisible characters detected (${invisibleCount})`)
    }
  }

  calculateFinalScore(result) {
    // Bonus points for multiple confusables techniques
    if (result.details.suspiciousPatterns.length > 2) {
      result.score += 2
      result.flags.push('[CONFUSABLES] Multiple obfuscation techniques detected')
    }
    
    // High transformation count indicates sophisticated attack
    if (result.details.transformations > 5) {
      result.score += 2
      result.flags.push('[CONFUSABLES] High character transformation count')
    }
  }

  // Utility method to get detailed Unicode analysis
  getUnicodeAnalysis(text) {
    const analysis = {
      length: text.length,
      codePoints: [...text].map(char => ({
        char,
        codePoint: char.codePointAt(0),
        unicodeBlock: this.getUnicodeBlock(char.codePointAt(0))
      })),
      scripts: [],
      suspiciousPatterns: []
    }
    
    // Add script detection
    this.suspiciousPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(text)) {
        analysis.suspiciousPatterns.push(name)
      }
    })
    
    return analysis
  }

  getUnicodeBlock(codePoint) {
    if (codePoint <= 0x007F) return 'Basic Latin'
    if (codePoint <= 0x00FF) return 'Latin-1 Supplement'
    if (codePoint >= 0x0400 && codePoint <= 0x04FF) return 'Cyrillic'
    if (codePoint >= 0x0370 && codePoint <= 0x03FF) return 'Greek'
    if (codePoint >= 0x1D400 && codePoint <= 0x1D7FF) return 'Mathematical'
    if (codePoint >= 0x1F600 && codePoint <= 0x1F64F) return 'Emoticons'
    return 'Other'
  }
}

module.exports = { ConfusablesAdvancedPlugin } 