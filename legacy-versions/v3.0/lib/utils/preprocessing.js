/**
 * 🔧 ContentGuard v3.0 - Advanced Text Preprocessing
 * 
 * Handles text normalization, adversarial attack mitigation,
 * and context-aware preprocessing for improved accuracy.
 */

/**
 * Unicode confusables mapping (subset of common confusables)
 * Full implementation would use @ensdomains/unicode-confusables but this avoids the dependency
 */
const CONFUSABLES_MAP = {
  // Cyrillic that look like Latin
  'а': 'a', 'о': 'o', 'р': 'p', 'е': 'e', 'х': 'x', 'с': 'c', 'у': 'y', 'к': 'k', 'н': 'h', 'в': 'b', 'м': 'm', 'т': 't', 'і': 'i',
  'А': 'A', 'О': 'O', 'Р': 'P', 'Е': 'E', 'Х': 'X', 'С': 'C', 'У': 'Y', 'К': 'K', 'Н': 'H', 'В': 'B', 'М': 'M', 'Т': 'T',
  
  // Greek that look like Latin
  'α': 'a', 'ο': 'o', 'ρ': 'p', 'ε': 'e', 'χ': 'x', 'υ': 'y', 'κ': 'k', 'η': 'h', 'β': 'b', 'μ': 'm', 'τ': 't', 'ι': 'i',
  'Α': 'A', 'Ο': 'O', 'Ρ': 'P', 'Ε': 'E', 'Χ': 'X', 'Υ': 'Y', 'Κ': 'K', 'Η': 'H', 'Β': 'B', 'Μ': 'M', 'Τ': 'T',
  
  // Mathematical symbols
  '𝗮': 'a', '𝗯': 'b', '𝗰': 'c', '𝗱': 'd', '𝗲': 'e', '𝗳': 'f', '𝗴': 'g', '𝗵': 'h', '𝗶': 'i', '𝗷': 'j', '𝗸': 'k', '𝗹': 'l', '𝗺': 'm',
  '𝗻': 'n', '𝗼': 'o', '𝗽': 'p', '𝗾': 'q', '𝗿': 'r', '𝘀': 's', '𝘁': 't', '𝘂': 'u', '𝘃': 'v', '𝘄': 'w', '𝘅': 'x', '𝘆': 'y', '𝘇': 'z'
}

/**
 * Leet speak mapping for adversarial normalization
 */
const LEET_MAP = {
  '4': 'a', '@': 'a',
  '8': 'b', '6': 'b',
  '<': 'c', '(': 'c',
  '3': 'e',
  '9': 'g',
  '#': 'h',
  '1': 'i', '!': 'i', '|': 'i',
  '7': 't', '+': 't',
  '0': 'o',
  '5': 's', '$': 's',
  '2': 'z'
}

/**
 * Modern slang/abbreviation expansions
 */
const SLANG_EXPANSIONS = {
  // Positive slang
  'fr': 'for real',
  'ngl': 'not gonna lie',
  'tbh': 'to be honest',
  'imo': 'in my opinion',
  'imho': 'in my humble opinion',
  'btw': 'by the way',
  'fyi': 'for your information',
  'gg': 'good game',
  'wp': 'well played',
  'gj': 'good job',
  'ty': 'thank you',
  'tysm': 'thank you so much',
  'np': 'no problem',
  'yw': 'you are welcome',
  
  // Neutral slang
  'rn': 'right now',
  'atm': 'at the moment',
  'asap': 'as soon as possible',
  'eta': 'estimated time of arrival',
  'fomo': 'fear of missing out',
  'yolo': 'you only live once',
  'tl;dr': 'too long didnt read',
  'tldr': 'too long didnt read',
  
  // Potentially problematic (context-dependent)
  'kys': 'kill yourself',
  'kms': 'kill myself',
  'smh': 'shaking my head',
  'lmao': 'laughing my ass off',
  'lmfao': 'laughing my fucking ass off',
  'wtf': 'what the fuck',
  'stfu': 'shut the fuck up',
  'gtfo': 'get the fuck out',
  'jfc': 'jesus fucking christ'
}

/**
 * Comprehensive preprocessing pipeline
 */
class TextPreprocessor {
  constructor(options = {}) {
    this.options = {
      normalizeUnicode: true,
      normalizeLeetSpeak: true,
      expandSlang: true,
      removeExcessiveSpacing: true,
      preserveOriginal: true,
      contextAware: true,
      ...options
    }
  }

  /**
   * Main preprocessing function
   */
  preprocess(text, context = {}) {
    const original = text
    let processed = text

    const steps = []

    // 1. Unicode normalization and confusables
    if (this.options.normalizeUnicode) {
      const normalized = this.normalizeUnicode(processed)
      if (normalized !== processed) {
        steps.push({ step: 'unicode_normalization', before: processed, after: normalized })
        processed = normalized
      }
    }

    // 2. Leet speak normalization (but be careful in professional contexts)
    if (this.options.normalizeLeetSpeak && !this.isProfessionalContext(context)) {
      const deLeeted = this.normalizeLeetSpeak(processed)
      if (deLeeted !== processed) {
        steps.push({ step: 'leet_normalization', before: processed, after: deLeeted })
        processed = deLeeted
      }
    }

    // 3. Slang expansion (context-aware)
    if (this.options.expandSlang) {
      const expanded = this.expandSlang(processed, context)
      if (expanded !== processed) {
        steps.push({ step: 'slang_expansion', before: processed, after: expanded })
        processed = expanded
      }
    }

    // 4. Spacing normalization (remove obfuscation attempts)
    if (this.options.removeExcessiveSpacing) {
      const spaceNormalized = this.normalizeSpacing(processed)
      if (spaceNormalized !== processed) {
        steps.push({ step: 'spacing_normalization', before: processed, after: spaceNormalized })
        processed = spaceNormalized
      }
    }

    return {
      original,
      processed,
      steps,
      hasModifications: steps.length > 0
    }
  }

  /**
   * Normalize unicode confusables and diacritics
   */
  normalizeUnicode(text) {
    // Normalize to NFD first (canonical decomposition)
    let normalized = text.normalize('NFD')

    // Remove diacritics
    normalized = normalized.replace(/[\u0300-\u036f]/g, '')

    // Replace confusables
    for (const [confusable, replacement] of Object.entries(CONFUSABLES_MAP)) {
      normalized = normalized.replace(new RegExp(confusable, 'g'), replacement)
    }

    // Back to NFC (canonical composition)
    return normalized.normalize('NFC')
  }

  /**
   * Normalize leet speak - safely escape regex special characters
   */
  normalizeLeetSpeak(text) {
    let normalized = text

    for (const [leet, replacement] of Object.entries(LEET_MAP)) {
      // Properly escape special regex characters
      const escapedLeet = leet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      normalized = normalized.replace(new RegExp(escapedLeet, 'g'), replacement)
    }

    return normalized
  }

  /**
   * Expand slang abbreviations
   */
  expandSlang(text, context = {}) {
    let expanded = text.toLowerCase()

    // Word boundary matching for slang
    for (const [slang, expansion] of Object.entries(SLANG_EXPANSIONS)) {
      const regex = new RegExp(`\\b${slang}\\b`, 'gi')
      if (regex.test(expanded)) {
        // Context-aware expansion
        if (this.shouldExpandSlang(slang, expansion, context)) {
          expanded = expanded.replace(regex, expansion)
        }
      }
    }

    return expanded
  }

  /**
   * Normalize excessive spacing that might be used for obfuscation
   */
  normalizeSpacing(text) {
    // Normalize multiple spaces to single space
    let normalized = text.replace(/\s+/g, ' ')

    // Remove spaces between single characters (common obfuscation)
    // But be careful not to break legitimate spaced text
    normalized = normalized.replace(/\b([a-z])\s+([a-z])\s+([a-z])\s+([a-z])\s+([a-z])\b/gi, '$1$2$3$4$5')
    normalized = normalized.replace(/\b([a-z])\s+([a-z])\s+([a-z])\s+([a-z])\b/gi, '$1$2$3$4')
    normalized = normalized.replace(/\b([a-z])\s+([a-z])\s+([a-z])\b/gi, '$1$2$3')

    // Handle dotted obfuscation (k.i.l.l -> kill)
    normalized = normalized.replace(/\b([a-z])\.([a-z])\.([a-z])\.([a-z])\b/gi, '$1$2$3$4')
    normalized = normalized.replace(/\b([a-z])\.([a-z])\.([a-z])\b/gi, '$1$2$3')

    return normalized.trim()
  }

  /**
   * Check if we're in a professional context where we should be more conservative
   */
  isProfessionalContext(context) {
    if (!context || !this.options.contextAware) return false

    const indicators = [
      context.hasBusinessTerms,
      context.hasTechnicalTerms,
      context.hasAcademicTerms,
      context.hasMedicalTerms,
      context.hasLegalTerms,
      context.isProfessionalEmail
    ]

    return indicators.some(Boolean)
  }

  /**
   * Determine if slang should be expanded based on context
   */
  shouldExpandSlang(slang, expansion, context) {
    // Don't expand potentially offensive slang in professional contexts
    const offensiveExpansions = ['kill yourself', 'kill myself', 'what the fuck', 'shut the fuck up', 'get the fuck out']
    
    if (offensiveExpansions.includes(expansion) && this.isProfessionalContext(context)) {
      return false
    }

    // Always expand abbreviations that help with detection
    return true
  }

  /**
   * Detect potential adversarial patterns
   */
  detectAdversarialPatterns(original, processed) {
    const patterns = []

    // Character substitution (only if significant changes occurred)
    if (original !== processed) {
      const originalChars = new Set(original.toLowerCase())
      const processedChars = new Set(processed.toLowerCase())
      
      // More conservative threshold to avoid technical text false positives
      if (originalChars.size > processedChars.size * 1.5) {
        patterns.push('character_substitution')
      }
    }

    // Excessive spacing (only obvious obfuscation patterns)
    if (/\s{5,}/.test(original) || /([a-z])\s+([a-z])\s+([a-z])\s+([a-z])/.test(original)) {
      patterns.push('spacing_obfuscation')
    }

    // Unicode mixing (same as before)
    if (/[\u0400-\u04FF]/.test(original) || /[\u0370-\u03FF]/.test(original)) {
      patterns.push('unicode_mixing')
    }

    // Enhanced: More precise leet speak detection - must be actual malicious leet speak
    const leetSpeakPatterns = [
      /[4@][s5\$][s5\$]/i, // ass variants
      /[f4][u][c<][k]/i, // fuck variants  
      /[s5\$][h][i1!][t7]/i, // shit variants
      /k[i1!][l1!][l1!]/i, // kill variants
      /[b6][i1!][t7][c<][h]/i, // bitch variants
      /d[i1!][e3]/i, // die variants
      /[f4][a4@][g9][g9][o0][t7]/i, // faggot variants
    ]
    
    const hasActualLeetSpeak = leetSpeakPatterns.some(pattern => pattern.test(original))
    
    // Only flag if it's obvious leetspeak obfuscation, not technical identifiers
    if (hasActualLeetSpeak && !/server|prod|dev|test|db|api|v\d|id\d/i.test(original)) {
      patterns.push('leet_speak')
    }

    return patterns
  }
}

module.exports = { TextPreprocessor, CONFUSABLES_MAP, LEET_MAP, SLANG_EXPANSIONS } 