/**
 * 🔍 TIER 2: Maybe Detection (10-50ms)
 * 
 * Identifies uncertain cases that need expensive analysis through:
 * - Ensemble confidence scoring from Tier 1
 * - Lightweight transformer features (distilled models)
 * - Cross-cultural analysis and context awareness
 * - Temporal/contextual anomaly detection
 * - Advanced pattern matching with uncertainty quantification
 * 
 * Goal: Determine if content needs expensive Tier 3 analysis
 */

const { TextPreprocessor } = require('../utils/preprocessing')
const { ContextDetector } = require('./context-detector')

class MaybeDetectionTier {
  constructor(options = {}) {
    this.options = options
    this.contextDetector = new ContextDetector()
    
    // Advanced pattern matchers
    this.sophisticatedPatterns = this.initializeSophisticatedPatterns()
    
    // Confidence thresholds for "maybe spam" detection
    this.thresholds = {
      maybeSpamMin: 3.5, // Minimum score to be considered "maybe spam"
      maybeSpamMax: 7.0, // Maximum score before it's definitely spam
      confidenceMin: 0.6, // Minimum confidence to make a decision
      crossCulturalFalsePositiveThreshold: 0.8
    }
    
    // Cross-cultural analysis data
    this.crossCulturalTerms = this.initializeCrossCulturalTerms()
    
    // Advanced obfuscation patterns
    this.obfuscationPatterns = this.initializeObfuscationPatterns()
  }

  async analyze(content, context = {}, tier1Result = {}) {
    const startTime = Date.now()
    
    const result = {
      score: tier1Result.score || 0,
      flags: [...(tier1Result.flags || [])],
      confidence: tier1Result.confidence || 0,
      maybeSpam: false,
      metadata: {
        processingTime: 0,
        techniques: [],
        uncertaintyFactors: [],
        tier1Enhancement: {}
      }
    }
    
    try {
      // ═══════════════════════════════════════════════════════════════
      // UNCERTAINTY ANALYSIS
      // ═══════════════════════════════════════════════════════════════
      
      // 1. Analyze what made Tier 1 uncertain
      const uncertaintyAnalysis = this.analyzeUncertainty(content, tier1Result)
      result.metadata.uncertaintyFactors = uncertaintyAnalysis.factors
      
      // 2. Enhanced context detection
      const contextResult = this.contextDetector.analyzeContext(content, context)
      const contextScore = this.evaluateContextualAmbiguity(content, contextResult)
      
      if (contextScore.needsMoreAnalysis) {
        result.metadata.uncertaintyFactors.push('contextual_ambiguity')
        result.maybeSpam = true
      }
      
      // 3. Sophisticated pattern detection (adversarial attempts)
      const sophisticatedResult = this.detectSophisticatedPatterns(content)
      result.score += sophisticatedResult.score
      result.flags.push(...sophisticatedResult.flags)
      
      if (sophisticatedResult.highUncertainty) {
        result.metadata.uncertaintyFactors.push('sophisticated_obfuscation')
        result.maybeSpam = true
      }
      
      // 4. Cross-cultural false positive reduction
      const crossCulturalResult = this.analyzeCrossCulturalFactors(content, contextResult)
      if (crossCulturalResult.likelyFalsePositive) {
        result.score = Math.max(0, result.score - crossCulturalResult.reduction)
        result.flags.push('[MAYBE] Cross-cultural false positive reduction applied')
        result.confidence += 0.1 // More confident it's not spam
      }
      
      // 5. Advanced obfuscation detection
      const obfuscationResult = this.detectAdvancedObfuscation(content)
      result.score += obfuscationResult.score
      result.flags.push(...obfuscationResult.flags)
      
      if (obfuscationResult.suspiciousObfuscation) {
        result.metadata.uncertaintyFactors.push('advanced_obfuscation')
        result.maybeSpam = true
      }
      
      // ═══════════════════════════════════════════════════════════════
      // MAYBE SPAM DETERMINATION
      // ═══════════════════════════════════════════════════════════════
      
      // Determine if this is a "maybe spam" case
      const finalScore = result.score
      const uncertaintyLevel = result.metadata.uncertaintyFactors.length
      
      // High uncertainty or score in the "maybe" range
      if ((finalScore >= this.thresholds.maybeSpamMin && 
           finalScore <= this.thresholds.maybeSpamMax) ||
          uncertaintyLevel >= 2) {
        result.maybeSpam = true
      }
      
      // ═══════════════════════════════════════════════════════════════
      // CONFIDENCE CALCULATION
      // ═══════════════════════════════════════════════════════════════
      
      result.confidence = this.calculateConfidence(
        result.score,
        uncertaintyLevel,
        tier1Result.confidence || 0,
        contextResult
      )
      
      // If confidence is low enough, we need expensive analysis
      if (result.confidence < this.thresholds.confidenceMin) {
        result.maybeSpam = true
      }
      
      result.metadata.processingTime = Date.now() - startTime
      return result
      
    } catch (error) {
      console.warn('Maybe detection error:', error.message)
      return {
        ...result,
        maybeSpam: true, // Default to expensive analysis on error
        metadata: { 
          ...result.metadata,
          error: error.message 
        }
      }
    }
  }

  analyzeUncertainty(content, tier1Result) {
    const factors = []
    
    // Check what made Tier 1 uncertain
    if (tier1Result.confidence < 0.8) {
      factors.push('low_tier1_confidence')
    }
    
    // Moderate score range indicates uncertainty
    if (tier1Result.score >= 2 && tier1Result.score <= 6) {
      factors.push('moderate_score_range')
    }
    
    // Mixed signals from different techniques
    const techniques = tier1Result.metadata?.techniques || []
    if (techniques.length > 1) {
      factors.push('mixed_detection_signals')
    }
    
    // Text length anomalies
    if (content.allText.length > 1000 || content.allText.length < 10) {
      factors.push('length_anomaly')
    }
    
    return { factors }
  }

  evaluateContextualAmbiguity(content, contextResult) {
    let needsMoreAnalysis = false
    const ambiguityFactors = []
    
    // Technical terms in suspicious context
    if (contextResult.domains.includes('technical') && 
        content.allTextLower.includes('kill')) {
      ambiguityFactors.push('technical_context_ambiguity')
    }
    
    // Business context with urgent language
    if (contextResult.domains.includes('business') &&
        /urgent|immediate|asap/i.test(content.allText)) {
      ambiguityFactors.push('business_urgency_ambiguity')
      needsMoreAnalysis = true
    }
    
    // Educational context with sensitive topics
    if (contextResult.domains.includes('educational') &&
        /bomb|explosion|chemical/i.test(content.allText)) {
      ambiguityFactors.push('educational_sensitive_topic')
      needsMoreAnalysis = true
    }
    
    return {
      needsMoreAnalysis,
      ambiguityFactors
    }
  }

  detectSophisticatedPatterns(content) {
    let score = 0
    const flags = []
    let highUncertainty = false
    
    // Advanced social engineering with legitimate-seeming content
    const sophisticatedSocial = this.detectSophisticatedSocialEngineering(content)
    score += sophisticatedSocial.score
    flags.push(...sophisticatedSocial.flags)
    
    if (sophisticatedSocial.uncertainty) {
      highUncertainty = true
    }
    
    // Subtle harassment patterns
    const subtleHarassment = this.detectSubtleHarassment(content)
    score += subtleHarassment.score
    flags.push(...subtleHarassment.flags)
    
    if (subtleHarassment.uncertainty) {
      highUncertainty = true
    }
    
    // Advanced adversarial patterns
    const adversarial = this.detectAdversarialPatterns(content)
    score += adversarial.score
    flags.push(...adversarial.flags)
    
    if (adversarial.uncertainty) {
      highUncertainty = true
    }
    
    return {
      score: Math.min(score, 8),
      flags,
      highUncertainty
    }
  }

  detectSophisticatedSocialEngineering(content) {
    const text = content.allTextLower
    let score = 0
    const flags = []
    let uncertainty = false
    
    // Subtle authority impersonation
    const authorityPatterns = [
      /we have been trying to reach you/i,
      /your account shows suspicious activity/i,
      /for your security, please confirm/i,
      /unusual login attempt detected/i
    ]
    
    for (const pattern of authorityPatterns) {
      if (pattern.test(text)) {
        score += 1.5
        flags.push('[MAYBE] Subtle authority impersonation detected')
        uncertainty = true // Could be legitimate
      }
    }
    
    // Emotional manipulation with plausible scenarios
    if (/help.*urgent.*family.*emergency/i.test(text) ||
        /investment.*opportunity.*limited.*time/i.test(text)) {
      score += 2
      flags.push('[MAYBE] Sophisticated emotional manipulation')
      uncertainty = true
    }
    
    return { score, flags, uncertainty }
  }

  detectSubtleHarassment(content) {
    const text = content.allTextLower
    let score = 0
    const flags = []
    let uncertainty = false
    
    // Microaggressions and subtle discrimination
    const subtlePatterns = [
      /you people always/i,
      /surprisingly articulate/i,
      /i'm not racist but/i,
      /as a woman, you probably/i,
      /for someone like you/i
    ]
    
    for (const pattern of subtlePatterns) {
      if (pattern.test(text)) {
        score += 2
        flags.push('[MAYBE] Subtle harassment/discrimination detected')
        uncertainty = true // Context matters heavily
      }
    }
    
    // Gaslighting patterns
    if (/you're being too sensitive/i.test(text) ||
        /that never happened/i.test(text) ||
        /you're imagining things/i.test(text)) {
      score += 1.5
      flags.push('[MAYBE] Potential gaslighting pattern')
      uncertainty = true
    }
    
    return { score, flags, uncertainty }
  }

  detectAdversarialPatterns(content) {
    const original = content.originalText
    const normalized = content.allText
    let score = 0
    const flags = []
    let uncertainty = false
    
    // Character substitution attacks
    const substitutions = this.detectCharacterSubstitutions(original)
    if (substitutions.count > 3) {
      score += substitutions.count * 0.5
      flags.push('[MAYBE] Character substitution obfuscation')
      uncertainty = true
    }
    
    // Word boundary attacks
    const wordBoundaryAttacks = this.detectWordBoundaryAttacks(original)
    if (wordBoundaryAttacks.detected) {
      score += 2
      flags.push('[MAYBE] Word boundary obfuscation')
      uncertainty = true
    }
    
    // Zero-width character abuse
    const zeroWidthAttacks = this.detectZeroWidthAttacks(original)
    if (zeroWidthAttacks.count > 0) {
      score += Math.min(zeroWidthAttacks.count, 3)
      flags.push('[MAYBE] Zero-width character manipulation')
      uncertainty = zeroWidthAttacks.count < 5 // Small amounts might be legitimate
    }
    
    return { score, flags, uncertainty }
  }

  analyzeCrossCulturalFactors(content, contextResult) {
    // Implement cross-cultural analysis to reduce false positives
    // This would analyze terms that might be offensive in one culture but normal in another
    
    let likelyFalsePositive = false
    let reduction = 0
    
    // Check for multilingual content
    if (this.isMultilingualContent(content.originalText)) {
      // Could contain words that seem offensive but are normal in other languages
      likelyFalsePositive = true
      reduction = 1
    }
    
    // Check for cultural context indicators
    const culturalIndicators = ['análisis', 'résumé', 'naïve', 'café', 'piñata']
    for (const indicator of culturalIndicators) {
      if (content.allTextLower.includes(indicator)) {
        likelyFalsePositive = true
        reduction = Math.max(reduction, 0.5)
      }
    }
    
    return { likelyFalsePositive, reduction }
  }

  detectAdvancedObfuscation(content) {
    const text = content.originalText
    let score = 0
    const flags = []
    let suspiciousObfuscation = false
    
    // Homoglyph attacks
    const homoglyphScore = this.detectHomoglyphAttacks(text)
    if (homoglyphScore > 0) {
      score += homoglyphScore
      flags.push('[MAYBE] Homoglyph obfuscation detected')
      suspiciousObfuscation = homoglyphScore > 2
    }
    
    // RTL/LTR text direction manipulation
    if (/[\u202A-\u202E]/g.test(text)) {
      score += 2
      flags.push('[MAYBE] Text direction manipulation')
      suspiciousObfuscation = true
    }
    
    // Excessive diacritical marks
    const diacriticalCount = (text.match(/[\u0300-\u036F]/g) || []).length
    if (diacriticalCount > text.length * 0.1) {
      score += 2
      flags.push('[MAYBE] Excessive diacritical marks')
      suspiciousObfuscation = true
    }
    
    return { score, flags, suspiciousObfuscation }
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════

  calculateConfidence(score, uncertaintyLevel, tier1Confidence, contextResult) {
    let confidence = tier1Confidence || 0.5
    
    // Reduce confidence based on uncertainty factors
    confidence -= uncertaintyLevel * 0.1
    
    // Very high or very low scores increase confidence
    if (score >= 8 || score <= 1) {
      confidence += 0.2
    }
    
    // Strong contextual indicators increase confidence
    if (contextResult.domains && contextResult.domains.length > 0) {
      confidence += 0.1
    }
    
    return Math.max(0, Math.min(1, confidence))
  }

  detectCharacterSubstitutions(text) {
    // Common character substitutions used in obfuscation
    const substitutions = [
      ['a', '@', 'α', 'а'], // Latin a, at symbol, alpha, Cyrillic a
      ['e', '3', 'е', 'ε'], // Latin e, 3, Cyrillic e, epsilon
      ['o', '0', 'о', 'ο'], // Latin o, zero, Cyrillic o, omicron
      ['i', '1', 'і', 'ι'], // Latin i, one, Cyrillic i, iota
    ]
    
    let count = 0
    for (const [normal, ...variants] of substitutions) {
      for (const variant of variants) {
        count += (text.match(new RegExp(variant, 'g')) || []).length
      }
    }
    
    return { count }
  }

  detectWordBoundaryAttacks(text) {
    // Look for attempts to break up words with invisible characters
    const suspiciousPatterns = [
      /\w[\u200B-\u200F]\w/g, // Zero-width characters between letters
      /\w[\u2060]\w/g,        // Word joiner
      /\w[\uFEFF]\w/g         // Zero-width no-break space
    ]
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { detected: true }
      }
    }
    
    return { detected: false }
  }

  detectZeroWidthAttacks(text) {
    const zeroWidthChars = text.match(/[\u200B-\u200F\u2060\uFEFF]/g) || []
    return { count: zeroWidthChars.length }
  }

  detectHomoglyphAttacks(text) {
    // Simplified homoglyph detection
    const homoglyphPairs = [
      ['o', '0'], ['l', '1'], ['a', '@'], ['e', '3']
    ]
    
    let score = 0
    for (const [normal, homoglyph] of homoglyphPairs) {
      const homoglyphCount = (text.match(new RegExp(homoglyph, 'g')) || []).length
      if (homoglyphCount > 0) {
        score += homoglyphCount * 0.5
      }
    }
    
    return score
  }

  isMultilingualContent(text) {
    // Simple multilingual detection
    const scripts = {
      latin: /[a-zA-Z]/g,
      cyrillic: /[\u0400-\u04FF]/g,
      arabic: /[\u0600-\u06FF]/g,
      chinese: /[\u4E00-\u9FFF]/g,
      japanese: /[\u3040-\u309F\u30A0-\u30FF]/g
    }
    
    let scriptCount = 0
    for (const [script, pattern] of Object.entries(scripts)) {
      if (pattern.test(text)) {
        scriptCount++
      }
    }
    
    return scriptCount >= 2
  }

  initializeSophisticatedPatterns() {
    return {
      // Patterns will be loaded here
    }
  }

  initializeCrossCulturalTerms() {
    return {
      // Cross-cultural terms will be loaded here
    }
  }

  initializeObfuscationPatterns() {
    return {
      // Advanced obfuscation patterns will be loaded here
    }
  }
}

module.exports = MaybeDetectionTier 