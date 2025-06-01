/**
 * 🌍 Cross-Cultural Tone Detection Plugin v4.0
 * 
 * Advanced cross-cultural communication analysis that understands
 * different English variants, communication styles, and cultural context
 * to reduce false positives from legitimate international communication.
 */

class CrossCulturalPlugin {
  constructor() {
    this.name = 'cross-cultural'
    this.description = 'Cross-cultural communication pattern analysis'
    this.version = '4.0.0'
    
    // Language-specific communication patterns
    this.communicationStyles = {
      // Indian English patterns
      indianEnglish: {
        patterns: [
          /\b(?:kindly|revert back|do the needful|prepone|intimate|good name)\b/i,
          /\b(?:out of station|go through|passed out from|discuss about)\b/i,
          /\b(?:itself|only|what to do|no issues|nothing to worry)\b/i
        ],
        indicators: [
          /\b(?:itself|only)\b.*\b(?:is|was|will)\b/i,
          /\bkindly\s+(?:do|revert|confirm|provide)/i,
          /\b(?:good good|nice nice|proper proper)\b/i
        ],
        positiveAdjustment: -2,
        description: 'Indian English communication patterns'
      },
      
      // British English patterns
      britishEnglish: {
        patterns: [
          /\b(?:brilliant|lovely|proper|quite|rather|jolly|blimey|mental|mad)\b/i,
          /\b(?:colour|honour|favourite|centre|realise|organised)\b/i,
          /\b(?:queue|lift|loo|bin|rubber|jumper|trainers)\b/i
        ],
        indicators: [
          /\b(?:queue|lift|bin)\s+(?:for|to|at)\b/i,
          /\bquite\s+(?:good|nice|brilliant|mental)/i,
          /\b(?:shall|shan't|won't|can't)\b/i
        ],
        positiveAdjustment: -1,
        description: 'British English communication patterns'
      },
      
      // Australian English patterns
      australianEnglish: {
        patterns: [
          /\b(?:mate|bloke|sheila|fair dinkum|no worries|bloody|ripper)\b/i,
          /\b(?:arvo|servo|bottle-o|smoko|trackies|sunnies)\b/i,
          /\b(?:bonkers|mental|mad|cooked|stuffed)\b/i
        ],
        indicators: [
          /\bfair dinkum\b/i,
          /\bno worries,?\s*(?:mate|bloke)?\b/i,
          /\bmad\s+(?:as|keen|good)\b/i
        ],
        positiveAdjustment: -1,
        description: 'Australian English communication patterns'
      },
      
      // Canadian English patterns
      canadianEnglish: {
        patterns: [
          /\b(?:eh|sorry|about|house|out|toque|loonie|toonie)\b/i,
          /\bsorry,?\s*but\b/i,
          /\b(?:aboot|oot|hoose)\b/i
        ],
        indicators: [
          /\bsorry,?\s*(?:but|eh|about)\b/i,
          /\beh\??\s*$/i,
          /\babout\s+(?:that|this|it)\b/i
        ],
        positiveAdjustment: -2,
        description: 'Canadian English politeness patterns'
      },
      
      // Germanic English (ESL patterns)
      germanicESL: {
        patterns: [
          /\b(?:make sense|how you say|is not possible|must be|should be)\b/i,
          /\bthe\s+(?:internet|email|computer|phone|car)\b/i,
          /\b(?:by|with|from|until)\s+(?:tomorrow|yesterday|next week)\b/i
        ],
        indicators: [
          /\bmake\s+sense\?\s*$/i,
          /\bhow\s+(?:you\s+)?say\b/i,
          /\bis\s+not\s+possible\b/i
        ],
        positiveAdjustment: -1,
        description: 'Germanic ESL communication patterns'
      },
      
      // Asian English (ESL patterns)  
      asianESL: {
        patterns: [
          /\b(?:lah|lor|meh|hor|can|cannot|must|should)\s*$/i,
          /\b(?:already|still|yet)\s+(?:done|finish|complete)/i,
          /\bvery\s+(?:like|want|need|good|bad)\b/i
        ],
        indicators: [
          /\b(?:can|cannot)\s*$/i,
          /\b(?:already|still)\s+(?:finish|done)\b/i,
          /\bvery\s+very\s+\w+/i
        ],
        positiveAdjustment: -1,
        description: 'Asian ESL communication patterns'
      }
    }
    
    // Academic/formal language patterns that are sometimes misinterpreted
    this.academicPatterns = [
      /\b(?:furthermore|moreover|nevertheless|however|therefore|consequently)\b/i,
      /\b(?:it is worth noting|it should be emphasized|it must be acknowledged)\b/i,
      /\b(?:the data (?:suggests?|indicates?|demonstrates?)|research shows?)\b/i,
      /\b(?:in conclusion|to summarize|in summary|broadly speaking)\b/i
    ]
    
    // Professional formality patterns (different cultures have different levels)
    this.formalityLevels = {
      high: [
        /\b(?:respectfully|humbly|graciously|cordially|sincerely)\b/i,
        /\b(?:would be grateful|deeply appreciate|kindly request)\b/i,
        /\b(?:esteemed|distinguished|honored|privileged)\b/i
      ],
      medium: [
        /\b(?:please|thank you|appreciate|consider|suggest)\b/i,
        /\b(?:would like|could you|may I|might I)\b/i,
        /\b(?:best regards|kind regards|sincerely yours)\b/i
      ],
      low: [
        /\b(?:hey|hi|thanks|sure|ok|fine|whatever)\b/i,
        /\b(?:gonna|wanna|gotta|kinda|sorta)\b/i,
        /\b(?:yeah|yep|nope|dunno|prolly)\b/i
      ]
    }
    
    // Potential false positive triggers in cross-cultural context
    this.crossCulturalChallenges = [
      {
        pattern: /\ban[áàâäã]lysis\b/i, // "análisis" triggering "anal"
        adjustment: -3,
        reason: 'Spanish word containing English trigger'
      },
      {
        pattern: /\bclásico\b/i, // Could trigger "ass" 
        adjustment: -2,
        reason: 'Spanish word with embedded trigger'
      },
      {
        pattern: /\bassessment\b/i, // Should not trigger "ass"
        adjustment: -2,
        reason: 'Professional term with embedded trigger'
      },
      {
        pattern: /\b(?:crítico|crítica)\b/i, // Spanish "critical"
        adjustment: -2,
        reason: 'Spanish professional terminology'
      },
      {
        pattern: /\b(?:assignment|associate|assembly)\b/i,
        adjustment: -2,
        reason: 'Professional terms with potential triggers'
      }
    ]
  }

  analyze(text, metadata = {}) {
    if (!text || typeof text !== 'string') {
      return { score: 0, flags: [], details: {} }
    }

    const result = {
      score: 0,
      flags: [],
      details: {
        detectedStyles: [],
        formalityLevel: 'medium',
        academicLanguage: false,
        crossCulturalAdjustments: [],
        totalAdjustment: 0
      }
    }

    // 1. Detect communication styles
    this.detectCommunicationStyles(text, result)
    
    // 2. Analyze formality level
    this.analyzeFormalityLevel(text, result)
    
    // 3. Detect academic language
    this.detectAcademicLanguage(text, result)
    
    // 4. Apply cross-cultural false positive corrections
    this.applyCrossCulturalCorrections(text, result)
    
    // 5. Calculate cultural context bonus
    this.calculateCulturalBonus(result)

    return result
  }

  detectCommunicationStyles(text, result) {
    for (const [style, config] of Object.entries(this.communicationStyles)) {
      let patternMatches = 0
      let indicatorMatches = 0
      
      // Check general patterns
      config.patterns.forEach(pattern => {
        if (pattern.test(text)) {
          patternMatches++
        }
      })
      
      // Check strong indicators
      config.indicators.forEach(indicator => {
        if (indicator.test(text)) {
          indicatorMatches++
        }
      })
      
      // If we have matches, apply cultural context
      if (patternMatches > 0 || indicatorMatches > 0) {
        const confidence = indicatorMatches > 0 ? 'high' : 'medium'
        const adjustment = indicatorMatches > 0 ? 
          config.positiveAdjustment : 
          Math.floor(config.positiveAdjustment / 2)
        
        result.details.detectedStyles.push({
          style: style,
          confidence: confidence,
          patternMatches: patternMatches,
          indicatorMatches: indicatorMatches,
          adjustment: adjustment
        })
        
        result.score += adjustment
        result.details.totalAdjustment += adjustment
        result.flags.push(`[CULTURAL] ${config.description} detected (${adjustment} points)`)
      }
    }
  }

  analyzeFormalityLevel(text, result) {
    const formalityScores = {
      high: 0,
      medium: 0,
      low: 0
    }
    
    for (const [level, patterns] of Object.entries(this.formalityLevels)) {
      patterns.forEach(pattern => {
        const matches = (text.match(pattern) || []).length
        formalityScores[level] += matches
      })
    }
    
    // Determine dominant formality level
    const maxScore = Math.max(...Object.values(formalityScores))
    const dominantLevel = Object.keys(formalityScores).find(
      level => formalityScores[level] === maxScore
    )
    
    result.details.formalityLevel = dominantLevel
    
    // High formality in some cultures might seem harsh to others
    if (dominantLevel === 'high' && formalityScores.high > 2) {
      result.score -= 1
      result.details.totalAdjustment -= 1
      result.flags.push('[CULTURAL] High formality communication style (-1 point)')
    }
    
    // Very low formality might be misinterpreted as dismissive
    if (dominantLevel === 'low' && formalityScores.low > 3) {
      result.score += 1
      result.flags.push('[CULTURAL] Very informal communication style (+1 point)')
    }
  }

  detectAcademicLanguage(text, result) {
    let academicCount = 0
    
    this.academicPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        academicCount++
      }
    })
    
    if (academicCount >= 2) {
      result.details.academicLanguage = true
      result.score -= 1
      result.details.totalAdjustment -= 1
      result.flags.push('[CULTURAL] Academic language patterns detected (-1 point)')
    }
  }

  applyCrossCulturalCorrections(text, result) {
    this.crossCulturalChallenges.forEach(correction => {
      if (correction.pattern.test(text)) {
        result.score += correction.adjustment
        result.details.totalAdjustment += correction.adjustment
        result.details.crossCulturalAdjustments.push({
          reason: correction.reason,
          adjustment: correction.adjustment
        })
        result.flags.push(`[CULTURAL] ${correction.reason} (${correction.adjustment} points)`)
      }
    })
  }

  calculateCulturalBonus(result) {
    const stylesDetected = result.details.detectedStyles.length
    
    // Multiple cultural indicators suggest authentic international communication
    if (stylesDetected >= 2) {
      result.score -= 2
      result.details.totalAdjustment -= 2
      result.flags.push('[CULTURAL] Multiple cultural patterns detected - authentic international communication (-2 points)')
    }
    
    // Academic + cultural patterns suggest legitimate professional communication
    if (result.details.academicLanguage && stylesDetected > 0) {
      result.score -= 1
      result.details.totalAdjustment -= 1
      result.flags.push('[CULTURAL] Academic + cultural patterns - professional context (-1 point)')
    }
  }

  // Helper method to get cultural context insights
  getCulturalInsights(text) {
    const insights = {
      detectedRegions: [],
      communicationStyle: 'neutral',
      formalityLevel: 'medium',
      recommendations: []
    }
    
    // Detect probable regions based on language patterns
    for (const [style, config] of Object.entries(this.communicationStyles)) {
      let score = 0
      config.patterns.forEach(pattern => {
        if (pattern.test(text)) score++
      })
      config.indicators.forEach(indicator => {
        if (indicator.test(text)) score += 2
      })
      
      if (score > 0) {
        insights.detectedRegions.push({
          region: style,
          confidence: score > 2 ? 'high' : 'medium',
          score: score
        })
      }
    }
    
    return insights
  }

  // Method to test cross-cultural understanding
  testCulturalPattern(text, culture) {
    if (!this.communicationStyles[culture]) {
      return { error: 'Culture not recognized' }
    }
    
    const config = this.communicationStyles[culture]
    const result = {
      culture: culture,
      patterns: [],
      indicators: [],
      likelihood: 'low'
    }
    
    config.patterns.forEach((pattern, index) => {
      if (pattern.test(text)) {
        result.patterns.push(`Pattern ${index + 1} matched`)
      }
    })
    
    config.indicators.forEach((indicator, index) => {
      if (indicator.test(text)) {
        result.indicators.push(`Indicator ${index + 1} matched`)
      }
    })
    
    if (result.indicators.length > 0) {
      result.likelihood = 'high'
    } else if (result.patterns.length > 1) {
      result.likelihood = 'medium'
    }
    
    return result
  }
}

module.exports = { CrossCulturalPlugin } 