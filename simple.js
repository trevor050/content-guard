/**
 * ContentGuard Simple - Ultra-Simple Content Analysis
 * 
 * Zero dependencies, bulletproof, just works.
 * Perfect for quick integration when you just need basic spam detection.
 * 
 * Usage:
 *   const guard = require('./simple.js')
 *   
 *   const result = await guard.analyze("Hello world")
 *   console.log(result.isSpam)     // false
 *   console.log(result.score)      // 0-10 scale
 *   
 *   // Multi-field analysis (contact forms, etc.)
 *   const result = await guard.analyze({
 *     name: "John Doe",
 *     email: "john@example.com", 
 *     subject: "Question about your service",
 *     message: "I have a question..."
 *   })
 *   
 *   // Quick spam check
 *   const isSpam = await guard.isSpam("some text")
 *   const score = await guard.getScore("some text")
 */

class SimpleContentGuard {
  constructor(options = {}) {
    this.threshold = options.threshold || 5  // Score 5+ = spam
    this.debug = options.debug || false
    
    // Comprehensive spam patterns (no regex dependencies)
    this.spamPatterns = [
      // CRITICAL THREATS (Score 10)
      { words: ['kill', 'yourself'], score: 10, reason: 'suicide encouragement' },
      { words: ['kill', 'your', 'self'], score: 10, reason: 'suicide encouragement' },
      { text: 'kys', score: 10, reason: 'suicide abbreviation' },
      { words: ['you', 'should', 'die'], score: 10, reason: 'death threat' },
      { words: ['go', 'die'], score: 9, reason: 'death wish' },
      
      // SEVERE HARASSMENT (Score 7-8)
      { words: ['you', 'are', 'trash'], score: 8, reason: 'severe insult' },
      { words: ['worthless', 'piece'], score: 8, reason: 'severe insult' },
      { words: ['pathetic', 'loser'], score: 7, reason: 'personal attack' },
      { words: ['stupid', 'idiot'], score: 6, reason: 'personal attack' },
      
      // STRONG PROFANITY (Score 4-6)
      { text: 'fuck you', score: 6, reason: 'strong profanity' },
      { text: 'fuck off', score: 5, reason: 'strong profanity' },
      { text: 'shit', score: 3, reason: 'profanity' },
      { text: 'bitch', score: 4, reason: 'profanity' },
      { text: 'asshole', score: 4, reason: 'profanity' },
      
      // SPAM INDICATORS (Score 3-6)
      { words: ['click', 'here', 'now'], score: 5, reason: 'spam language' },
      { words: ['urgent', 'action', 'required'], score: 5, reason: 'urgency scam' },
      { words: ['congratulations', 'you', 'won'], score: 6, reason: 'prize scam' },
      { words: ['limited', 'time', 'offer'], score: 4, reason: 'sales spam' },
      { words: ['act', 'now'], score: 3, reason: 'pressure tactics' },
      
      // COMMON INSULTS (Score 2-4)
      { text: 'moron', score: 3, reason: 'insult' },
      { text: 'retard', score: 4, reason: 'offensive slur' },
      { text: 'loser', score: 2, reason: 'mild insult' },
      { text: 'idiot', score: 2, reason: 'mild insult' }
    ]
    
    // Professional protection terms
    this.professionalTerms = [
      'server', 'database', 'system', 'application', 'deployment', 'infrastructure',
      'process', 'thread', 'service', 'api', 'endpoint', 'pipeline', 'cluster',
      'script', 'code', 'bug', 'error', 'exception', 'debug', 'log', 'crash',
      'business', 'project', 'meeting', 'analysis', 'report', 'professional',
      'technical', 'development', 'production', 'environment', 'security',
      'client', 'customer', 'stakeholder', 'requirements', 'implementation'
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
      
      // Normalize text for analysis
      const lowerText = text.toLowerCase()
      const words = lowerText.split(/\s+/)
      
      // Professional context protection
      const professionalMatches = this.professionalTerms.filter(term => 
        lowerText.includes(term)
      ).length
      
      // Apply professional context protection
      const professionalReduction = professionalMatches >= 3 ? 0.7 : 
                                   professionalMatches >= 2 ? 0.5 : 
                                   professionalMatches >= 1 ? 0.3 : 0
      
      let totalScore = 0
      const flags = []
      const matches = []
      
      // Check against spam patterns
      for (const pattern of this.spamPatterns) {
        let isMatch = false
        
        if (pattern.text) {
          // Simple text matching
          if (lowerText.includes(pattern.text)) {
            isMatch = true
          }
        } else if (pattern.words) {
          // Multi-word pattern matching
          const hasAllWords = pattern.words.every(word => 
            words.some(w => w.includes(word))
          )
          if (hasAllWords) {
            isMatch = true
          }
        }
        
        if (isMatch) {
          // Apply professional context reduction
          const adjustedScore = Math.round(pattern.score * (1 - professionalReduction))
          
          if (adjustedScore > 0) {
            totalScore += adjustedScore
            flags.push(`${pattern.reason}: "${pattern.text || pattern.words.join(' ')}"`)
            matches.push({ 
              text: pattern.text || pattern.words.join(' '), 
              score: adjustedScore, 
              reason: pattern.reason 
            })
            
            if (this.debug) {
              console.log(`🔍 Pattern matched: ${pattern.reason} - "${pattern.text || pattern.words.join(' ')}" (+${adjustedScore})`)
            }
          }
        }
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
      
      // Excessive punctuation
      const exclamationCount = (text.match(/!/g) || []).length
      if (exclamationCount > 5) {
        totalScore += 2
        flags.push(`Excessive punctuation (${exclamationCount} exclamation marks)`)
      }
      
      // ALL CAPS (likely shouting/spam)
      const capsWords = words.filter(word => 
        word.length > 2 && word === word.toUpperCase() && /[A-Z]/.test(word)
      ).length
      if (capsWords > 3) {
        totalScore += 3
        flags.push(`Excessive caps (${capsWords} words)`)
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
      // Main results (0-10 scale as requested)
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      isSpam: score >= this.threshold,
      confidence: this.calculateConfidence(score),
      
      // Additional info
      riskLevel,
      processingTime: Math.round(processingTime * 10) / 10,
      recommendation: this.getRecommendation(score, riskLevel),
      
      // Metadata
      variant: 'simple-guard',
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

// Create default instance
const guard = new SimpleContentGuard()

// Export simple API
module.exports = {
  analyze: (input) => guard.analyze(input),
  isSpam: (input) => guard.isSpam(input),
  getScore: (input) => guard.getScore(input),
  createGuard: (options) => new SimpleContentGuard(options),
  SimpleContentGuard
} 