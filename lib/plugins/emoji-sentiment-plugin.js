/**
 * 🎭 Emoji Sentiment Analysis Plugin v4.0
 * 
 * Advanced emoji-based toxicity detection using semantic analysis.
 * Identifies negative emotional indicators, hostile emoji combinations,
 * and coded harassment patterns through emoji usage.
 */

const emojiSentimentData = require('emoji-sentiment')

class EmojiSentimentPlugin {
  constructor() {
    this.name = 'emoji-sentiment'
    this.description = 'ML-powered emoji toxicity detection'
    this.version = '4.0.0'
    
    // Convert emoji-sentiment data to a lookup map
    this.emojiSentimentMap = new Map()
    Object.values(emojiSentimentData).forEach(entry => {
      if (entry.sequence) {
        // Convert hex sequence to emoji
        const codePoints = entry.sequence.split('-').map(hex => parseInt(hex, 16))
        const emoji = String.fromCodePoint(...codePoints)
        this.emojiSentimentMap.set(emoji, entry)
      }
    })
    
    // Toxic emoji patterns that indicate harassment
    this.toxicPatterns = [
      // Violence/Aggression
      { emojis: ['🔫', '💥'], severity: 'high', pattern: 'violence_threat' },
      { emojis: ['⚰️'], severity: 'high', pattern: 'death_reference' },
      { emojis: ['🤬', '😡', '👿'], severity: 'medium', pattern: 'anger_hostility' },
      { emojis: ['🖕'], severity: 'high', pattern: 'explicit_gesture' },
      
      // Degradation/Mockery
      { emojis: ['🤡', '🎪'], severity: 'medium', pattern: 'mockery_degradation' },
      { emojis: ['🗑️', '💩'], severity: 'medium', pattern: 'dehumanization' },
      { emojis: ['🤮', '🤢'], severity: 'medium', pattern: 'disgust_rejection' },
      
      // Combined hostile patterns (much worse when together)
      { emojis: ['💀', '🔫'], severity: 'critical', pattern: 'death_threat_combo' },
      { emojis: ['🤡', '💩'], severity: 'high', pattern: 'degradation_combo' },
      { emojis: ['🖕', '😡'], severity: 'critical', pattern: 'explicit_hostility' }
    ]
    
    // Positive emojis that soften negative sentiment
    this.positiveEmojis = [
      '😊', '😀', '😄', '😃', '😁', '😅', '😂', '🤣', '😉', '😌', '😍', '🥰', '😘',
      '👍', '👏', '🙌', '💪', '❤️', '💕', '💖', '💯', '✨', '🌟', '⭐', '🎉', '🎊'
    ]
  }

  getEmojiSentiment(emoji) {
    // Try direct lookup first
    if (this.emojiSentimentMap.has(emoji)) {
      return this.emojiSentimentMap.get(emoji)
    }
    
    // Fallback: convert emoji to hex sequence for lookup
    const codePoints = Array.from(emoji).map(char => char.codePointAt(0).toString(16).toUpperCase())
    const sequence = codePoints.join('-')
    
    // Try to find by sequence
    for (const entry of Object.values(emojiSentimentData)) {
      if (entry.sequence === sequence) {
        return entry
      }
    }
    
    return null
  }

  analyze(text, metadata = {}) {
    if (!text || typeof text !== 'string') {
      return { score: 0, flags: [], details: {} }
    }

    const result = {
      score: 0,
      flags: [],
      details: {
        emojiCount: 0,
        sentimentScore: 0,
        toxicPatterns: [],
        positiveSignals: 0,
        contextualScore: 0
      }
    }

    // Extract all emojis from text
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    const emojis = text.match(emojiRegex) || []
    
    if (emojis.length === 0) {
      return result // No emojis to analyze
    }

    result.details.emojiCount = emojis.length

    // 1. Basic sentiment analysis using emoji-sentiment library
    let totalSentiment = 0
    let analyzedCount = 0
    
    emojis.forEach(emoji => {
      const sentimentData = this.getEmojiSentiment(emoji)
      if (sentimentData && sentimentData.score !== undefined) {
        totalSentiment += sentimentData.score
        analyzedCount++
      }
    })

    if (analyzedCount > 0) {
      result.details.sentimentScore = totalSentiment / analyzedCount
      
      // Negative emoji sentiment contributes to toxicity
      if (result.details.sentimentScore < -0.2) {
        result.score += 3
        result.flags.push('[EMOJI] Strongly negative emoji sentiment')
      } else if (result.details.sentimentScore < -0.1) {
        result.score += 2
        result.flags.push('[EMOJI] Negative emoji sentiment')
      }
    }

    // 2. Pattern-based toxic emoji detection
    this.toxicPatterns.forEach(pattern => {
      const foundEmojis = pattern.emojis.filter(emoji => emojis.includes(emoji))
      
      if (foundEmojis.length === pattern.emojis.length) {
        // All emojis in pattern found
        const severityScore = {
          'critical': 5,
          'high': 4,
          'medium': 3,
          'low': 2
        }[pattern.severity] || 2

        result.score += severityScore
        result.details.toxicPatterns.push({
          type: pattern.pattern,
          emojis: foundEmojis,
          severity: pattern.severity
        })
        result.flags.push(`[EMOJI] Toxic pattern: ${pattern.pattern}`)
      } else if (foundEmojis.length > 0 && pattern.severity !== 'critical') {
        // Partial match for non-critical patterns
        result.score += 1
        result.details.toxicPatterns.push({
          type: pattern.pattern + '_partial',
          emojis: foundEmojis,
          severity: 'low'
        })
        result.flags.push(`[EMOJI] Partial toxic pattern: ${pattern.pattern}`)
      }
    })

    // 3. Positive emoji signals (reduce toxicity score)
    const positiveCount = emojis.filter(emoji => 
      this.positiveEmojis.includes(emoji)
    ).length

    result.details.positiveSignals = positiveCount
    
    if (positiveCount > 0) {
      const reduction = Math.min(positiveCount, 3) // Cap at 3 point reduction
      result.score = Math.max(0, result.score - reduction)
      result.flags.push(`[EMOJI] Positive signals detected (-${reduction} points)`)
    }

    // 4. Contextual analysis
    const emojiDensity = emojis.length / text.length
    
    // High emoji density in short toxic messages is suspicious
    if (emojiDensity > 0.1 && text.length < 100 && result.score > 0) {
      result.score += 1
      result.flags.push('[EMOJI] High emoji density in short message')
    }

    // 5. Repeated toxic emojis (spam-like behavior)
    const emojiCounts = {}
    emojis.forEach(emoji => {
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1
    })

    const repeatedToxic = Object.entries(emojiCounts).find(([emoji, count]) => {
      const isToxic = this.toxicPatterns.some(pattern => 
        pattern.emojis.includes(emoji)
      )
      return isToxic && count >= 3
    })

    if (repeatedToxic) {
      result.score += 2
      result.flags.push(`[EMOJI] Repeated toxic emoji: ${repeatedToxic[0]} (${repeatedToxic[1]}x)`)
    }

    result.details.contextualScore = result.score

    return result
  }

  // Helper method to get emoji insights for debugging
  getEmojiInsights(text) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    const emojis = text.match(emojiRegex) || []
    
    return emojis.map(emoji => ({
      emoji,
      sentiment: this.getEmojiSentiment(emoji),
      isToxicPattern: this.toxicPatterns.some(pattern => 
        pattern.emojis.includes(emoji)
      ),
      isPositive: this.positiveEmojis.includes(emoji)
    }))
  }
}

module.exports = { EmojiSentimentPlugin } 