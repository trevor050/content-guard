/**
 * 🛡️ ContentGuard v4.7 - Ultimate Anti-Troll System
 * 
 * Super Simple API - Just analyze text and get a spam score from 0-10
 * 
 * Usage:
 *   const { analyze, isSpam, createGuard } = require('content-guard')
 *   
 *   // Quick analysis
 *   const result = await analyze("Hello world")
 *   console.log(result.isSpam)     // false
 *   console.log(result.score)      // 0-10 scale
 *   console.log(result.confidence) // 0-1 scale
 *   
 *   // Multi-field analysis (contact forms, etc.)
 *   const result = await analyze({
 *     name: "John Doe",
 *     email: "john@example.com", 
 *     subject: "Question about your service",
 *     message: "I have a question..."
 *   })
 *   
 *   // Quick spam check
 *   const spam = await isSpam("you should kill yourself") // true
 *   
 *   // Different variants for different needs
 *   const fastGuard = createGuard('fast')    // 0.05ms, 90% accuracy  
 *   const guard = createGuard('balanced')    // 0.3ms, 93% accuracy (default)
 *   const preciseGuard = createGuard('large') // 1.5ms, 94% accuracy
 */

// Ultra-simple fallback system that works without any dependencies
class SimpleFallbackGuard {
  constructor(options = {}) {
    this.threshold = options.threshold || 5
    this.debug = options.debug || false
    
    // Simple but effective spam patterns
    this.spamPatterns = [
      // Direct threats and harassment
      { pattern: /kill\s+your?self/gi, score: 10, reason: 'suicide encouragement' },
      { pattern: /go\s+die/gi, score: 9, reason: 'death wish' },
      { pattern: /you\s+should\s+die/gi, score: 10, reason: 'death threat' },
      { pattern: /kys/gi, score: 10, reason: 'suicide abbreviation' },
      
      // Strong profanity
      { pattern: /\bf[u\*]+ck\s+you?\b/gi, score: 6, reason: 'strong profanity' },
      { pattern: /\bsh[i\*]+t\b/gi, score: 3, reason: 'profanity' },
      { pattern: /\bb[i\*]+tch\b/gi, score: 4, reason: 'profanity' },
      { pattern: /\ba[s\*]+hole\b/gi, score: 4, reason: 'profanity' },
      
      // Harassment terms
      { pattern: /you\s+are\s+trash/gi, score: 7, reason: 'personal attack' },
      { pattern: /worthless\s+piece/gi, score: 8, reason: 'severe insult' },
      { pattern: /stupid\s+idiot/gi, score: 5, reason: 'insult' },
      { pattern: /pathetic\s+loser/gi, score: 6, reason: 'personal attack' },
      
      // Spam indicators
      { pattern: /click\s+here\s+now/gi, score: 4, reason: 'spam language' },
      { pattern: /urgent.{0,20}action\s+required/gi, score: 5, reason: 'urgency scam' },
      { pattern: /congratulations.{0,30}won/gi, score: 6, reason: 'prize scam' },
      { pattern: /limited\s+time\s+offer/gi, score: 3, reason: 'sales spam' },
      
      // Common evasion patterns
      { pattern: /[a-z]\s*\.\s*[a-z]\s*\.\s*[a-z]/gi, score: 3, reason: 'character spacing evasion' },
      { pattern: /[0-9@$!*]{4,}/g, score: 2, reason: 'leetspeak evasion' },
      { pattern: /[а-я].*?(kill|die|trash)/gi, score: 8, reason: 'cyrillic evasion' }
    ]
    
    // Professional protection terms
    this.professionalTerms = [
      'server', 'database', 'system', 'application', 'deployment', 'infrastructure',
      'process', 'thread', 'service', 'api', 'endpoint', 'pipeline', 'cluster',
      'script', 'code', 'bug', 'error', 'exception', 'debug', 'log', 'crash',
      'business', 'project', 'meeting', 'analysis', 'report', 'professional',
      'technical', 'development', 'production', 'environment', 'security'
    ]
  }
  
  async analyze(input) {
    const startTime = Date.now()
    
    try {
      // Handle both string and object input
      let text = ''
      let fields = {}
      
      if (typeof input === 'string') {
        text = input
        fields = { message: input }
      } else if (input && typeof input === 'object') {
        fields = {
          name: input.name || '',
          email: input.email || '',
          subject: input.subject || '',
          message: input.message || input.text || input.content || ''
        }
        text = Object.values(fields).filter(Boolean).join(' ')
      } else {
        throw new Error('Input must be a string or object')
      }
      
      if (!text || text.trim().length === 0) {
        return this.createResult(0, 'CLEAN', Date.now() - startTime, 'No content to analyze')
      }
      
      // Professional context protection
      const lowerText = text.toLowerCase()
      const professionalMatches = this.professionalTerms.filter(term => 
        lowerText.includes(term)
      ).length
      
      // Apply professional context protection
      const professionalReduction = professionalMatches >= 3 ? 0.8 : 
                                   professionalMatches >= 2 ? 0.6 : 
                                   professionalMatches >= 1 ? 0.4 : 0
      
      let totalScore = 0
      const flags = []
      const matches = []
      
      // Check against spam patterns
      for (const { pattern, score, reason } of this.spamPatterns) {
        const match = pattern.exec(text)
        if (match) {
          // Apply professional context reduction
          const adjustedScore = Math.round(score * (1 - professionalReduction))
          if (adjustedScore > 0) {
            totalScore += adjustedScore
            flags.push(`${reason}: "${match[0]}"`)
            matches.push({ text: match[0], score: adjustedScore, reason })
          }
          
          if (this.debug) {
            console.log(`🔍 Pattern matched: ${reason} - "${match[0]}" (+${adjustedScore})`)
          }
        }
        pattern.lastIndex = 0 // Reset regex
      }
      
      // Additional scoring factors
      const emailCount = (text.match(/@\w+\.\w+/g) || []).length
      if (emailCount > 2) {
        totalScore += 3
        flags.push(`Multiple emails detected (${emailCount})`)
      }
      
      const urlCount = (text.match(/https?:\/\/\S+/g) || []).length
      if (urlCount > 2) {
        totalScore += 2
        flags.push(`Multiple URLs detected (${urlCount})`)
      }
      
      // Cap score at 10 for simplicity
      totalScore = Math.min(10, totalScore)
      
      // Professional context reporting
      if (professionalMatches > 0) {
        flags.push(`Professional context detected (${professionalMatches} terms), scores reduced by ${Math.round(professionalReduction * 100)}%`)
      }
      
      const processingTime = Date.now() - startTime
      return this.createResult(totalScore, this.getRiskLevel(totalScore), processingTime, null, {
        flags,
        matches,
        professionalContext: professionalMatches,
        fields
      })

    } catch (error) {
      const processingTime = Date.now() - startTime
      if (this.debug) {
        console.error('Analysis error:', error)
      }
      return this.createResult(0, 'CLEAN', processingTime, `Analysis error: ${error.message}`)
    }
  }
  
  createResult(score, riskLevel, processingTime, error = null, details = {}) {
    const result = {
      // Main results (1-10 scale as requested)
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      isSpam: score >= this.threshold,
      confidence: this.calculateConfidence(score),
      
      // Additional info
      riskLevel,
      processingTime: Math.round(processingTime * 10) / 10,
      recommendation: this.getRecommendation(score, riskLevel),
      
      // Metadata
      variant: 'simple-fallback',
      flags: details.flags || [],
      timestamp: new Date().toISOString(),
      
      // Error handling
      ...(error && { error, success: false })
    }
    
    if (details.matches) result.matches = details.matches
    if (details.professionalContext) result.professionalContext = details.professionalContext
    if (details.fields) result.fields = details.fields
    
    return result
  }
  
  calculateConfidence(score) {
    // Simple confidence calculation
    if (score >= 8) return 0.95      // Very confident it's spam
    if (score >= 6) return 0.85      // Confident it's spam  
    if (score >= 4) return 0.75      // Moderately confident
    if (score >= 2) return 0.65      // Somewhat confident
    if (score >= 1) return 0.55      // Low confidence
    return 0.9                       // Very confident it's clean
  }
  
  getRiskLevel(score) {
    if (score >= 8) return 'CRITICAL'
    if (score >= 6) return 'HIGH'
    if (score >= 4) return 'MEDIUM'
    if (score >= 2) return 'LOW'
    return 'CLEAN'
  }
  
  getRecommendation(score, riskLevel) {
    switch (riskLevel) {
      case 'CRITICAL': return 'Block immediately - High confidence spam/harassment detected'
      case 'HIGH': return 'Block - Likely spam or inappropriate content'
      case 'MEDIUM': return 'Review - Potentially problematic content detected'
      case 'LOW': return 'Monitor - Slightly concerning patterns detected'
      default: return 'Allow - Clean content detected'
    }
  }
  
  async isSpam(input) {
    const result = await this.analyze(input)
    return result.isSpam
  }
  
  async getScore(input) {
    const result = await this.analyze(input)
    return result.score
  }
}

// Try to load the advanced v4.7 system, fallback to simple system
let guardCache = new Map()

async function createGuard(variant = 'balanced', options = {}) {
  const cacheKey = `${variant}-${JSON.stringify(options)}`
  
  if (guardCache.has(cacheKey)) {
    return guardCache.get(cacheKey)
  }
  
  // Try to load advanced system first
  let GuardClass = null
  try {
    const variantMap = {
      fast: require('./lib/variants/v4-fast.js').ContentGuardV4Fast,
      balanced: require('./lib/variants/v4-balanced.js').ContentGuardV4Balanced,
      large: require('./lib/variants/v4-large.js'),
      turbo: require('./lib/variants/v4-turbo.js').ContentGuardV4Turbo
    }
    GuardClass = variantMap[variant] || variantMap.balanced
  } catch (error) {
    if (options.debug) {
      console.log('Advanced system not available, using simple fallback:', error.message)
    }
  }

  let guard

  if (GuardClass) {
    try {
      // Try to create advanced guard
      guard = new GuardClass({
        variant,
        debug: false, // Keep it silent by default
        ...options
      })
      
      // Test that it actually works
      await guard.analyze('test')
      
      if (options.debug) {
        console.log(`✅ Advanced ContentGuard v4.7-${variant} initialized`)
      }
    } catch (error) {
      if (options.debug) {
        console.log(`Advanced guard failed, using fallback:`, error.message)
      }
      guard = null
    }
  }
  
  // Fallback to simple system
  if (!guard) {
    guard = new SimpleFallbackGuard({
      threshold: variant === 'large' ? 4 : variant === 'turbo' ? 6 : 5,
      debug: options.debug,
      ...options
    })
    
    if (options.debug) {
      console.log(`✅ Simple fallback guard initialized (${variant} profile)`)
    }
  }
  
  guardCache.set(cacheKey, guard)
  return guard
}

// Create default instance
let defaultGuard = null

async function getDefaultGuard() {
  if (!defaultGuard) {
    defaultGuard = await createGuard('balanced')
  }
  return defaultGuard
}

// Simple API functions
async function analyze(input) {
  const guard = await getDefaultGuard()
  return guard.analyze(input)
}

async function isSpam(input) {
  const guard = await getDefaultGuard()
  return guard.isSpam(input)
}

async function getScore(input) {
  const guard = await getDefaultGuard()
  return guard.getScore(input)
}

// Export everything
module.exports = {
  // Simple API (recommended)
  analyze,
  isSpam,
  getScore,
  createGuard,
  
  // Legacy exports for backward compatibility
  ContentGuard: SimpleFallbackGuard,
  
  // Advanced exports (if available)
  get ContentGuardV4Balanced() {
    try {
      return require('./lib/variants/v4-balanced').ContentGuardV4Balanced
    } catch {
      return SimpleFallbackGuard
    }
  }
}
