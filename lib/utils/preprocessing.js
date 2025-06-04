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
    if (!text || typeof text !== 'string') {
      return {
        processedText: text,
        metadata: {
          preprocessing: false,
          transformations: []
        }
      }
    }

    const result = {
      processedText: text,
      metadata: {
        preprocessing: true,
        transformations: [],
        unicodeNormalization: false,
        lengthReduction: 0,
        suspiciousPatterns: []
      }
    }

    let processed = text

    try {
      // 1. Advanced Unicode confusables normalization
      const originalTextBeforeConfusables = processed; // Save original before confusables
      const confusablesResult = this.confusablesPlugin.analyze(processed, {})

      if (confusablesResult.normalizedText !== originalTextBeforeConfusables) {
        // If confusables returned empty string, and original was not empty, fallback to original.
        if (confusablesResult.normalizedText === "" && originalTextBeforeConfusables !== "") {
          console.warn('[DEBUG] TextPreprocessor: Confusables plugin returned empty string. Using text before confusables step.');
          // processed remains originalTextBeforeConfusables
        } else {
          processed = confusablesResult.normalizedText;
        }
        result.metadata.unicodeNormalization = true // Still true if it attempted normalization
        result.metadata.transformations.push('unicode_normalization')
        result.metadata.suspiciousPatterns = confusablesResult.details.suspiciousPatterns || []
    }

      // 2. Standard text normalization
      const originalLength = processed.length
      
      // Normalize whitespace and line breaks
      processed = processed.replace(/\s+/g, ' ').trim()
      
      // Remove excessive punctuation repetition (keep intent but normalize)
      processed = processed.replace(/([!?.]{2,})/g, (match) => {
        const char = match[0]
        return char.repeat(Math.min(match.length, 3)) // Max 3 repeated chars
      })
      
      // Normalize case for analysis (but preserve original case in output)
      const normalizedForAnalysis = processed.toLowerCase()

      // Track length changes
      const lengthReduction = originalLength - processed.length
      if (lengthReduction > 0) {
        result.metadata.lengthReduction = lengthReduction
        result.metadata.transformations.push('whitespace_normalization')
      }

      // 3. Detect and handle obvious evasion attempts
      this.detectEvasionAttempts(processed, result)

      result.processedText = processed

    } catch (error) {
      console.error('Preprocessing error:', error)
      result.metadata.transformations.push('error_fallback')
      // Return original text on error
      result.processedText = text
    }

    return result
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