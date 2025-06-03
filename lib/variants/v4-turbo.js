/**
 * ContentGuard v4.7 Turbo - Ultra-High-Speed Variant
 * 
 * Optimized for extreme speed to handle hundreds of thousands of real-time messages.
 * Target: <0.1ms processing with 50%+ accuracy
 * Use case: Massive chat monitoring, real-time stream processing
 * 
 * Architecture:
 * - Zero preprocessing
 * - Pre-compiled critical patterns only
 * - Integer-based scoring for speed
 * - No external dependencies
 * - No caching overhead
 * - Minimal object allocation
 */

class ContentGuardV4Turbo {
  constructor(options = {}) {
    this.spamThreshold = options.spamThreshold || 4;
    this.debug = options.debug || false;
    
    // Pre-compile only the most critical patterns for maximum speed
    this.criticalPatterns = this.compileCriticalPatterns();
    
    // Minimal metrics
    this.totalAnalyses = 0;
    this.totalTime = 0;
  }

  compileCriticalPatterns() {
    // Only the most critical patterns - pre-compiled for speed
    // Prioritized by severity and frequency
    return [
      // Death threats (weight 8) - HIGHEST PRIORITY
      { pattern: /\b(kill\s+yourself|kys|k\s*y\s*s)\b/i, weight: 8 },
      { pattern: /\b(you\s+should\s+die|hope\s+you\s+die|wish\s+you\s+were\s+dead)\b/i, weight: 8 },
      { pattern: /\b(go\s+die|die\s+in\s+a\s+fire|die\s+painfully)\b/i, weight: 8 },
      { pattern: /\b(end\s+your\s+life|take\s+your\s+own\s+life)\b/i, weight: 8 },
      { pattern: /\b(drink\s+bleach|jump\s+off\s+a\s+bridge|hang\s+yourself)\b/i, weight: 8 },
      { pattern: /\b(overdose\s+on|slice\s+your\s+wrists)\b/i, weight: 8 },
      
      // Direct harassment (weight 6-7) - HIGH FREQUENCY
      { pattern: /\b(fuck\s+you|f\*ck\s+you|f\*\*k\s+you|fck\s+you)\b/i, weight: 6 },
      { pattern: /\b(piece\s+of\s+shit|worthless\s+trash|human\s+garbage)\b/i, weight: 6 },
      { pattern: /\b(stupid\s+bitch|dumb\s+ass|fucking\s+idiot|retarded\s+loser)\b/i, weight: 6 },
      { pattern: /\b(scum\s+of\s+the\s+earth|waste\s+of\s+space|oxygen\s+thief)\b/i, weight: 6 },
      { pattern: /\b(rot\s+in\s+hell|burn\s+in\s+hell)\b/i, weight: 6 },
      
      // High-confidence spam (weight 4-5) - COMMON PATTERNS
      { pattern: /\b(hate\s+you|despise\s+you|can't\s+stand\s+you)\b/i, weight: 5 },
      { pattern: /\b(shut\s+up|stfu)\b/i, weight: 4 },
      { pattern: /\b(you\s+suck|you're\s+pathetic|you're\s+disgusting)\b/i, weight: 4 },
      { pattern: /\b(nobody\s+likes\s+you|everyone\s+hates\s+you)\b/i, weight: 5 },
      
      // Basic profanity (weight 3-4) - To replace quickObscenityCheck
      { pattern: /\b(fuck|shit|bitch|damn|crap|asshole)\b/i, weight: 3 },

      // Professional context protection (negative weight) - PREVENT FALSE POSITIVES - Lightly pruned
      { pattern: /\b(kill\s+process|kill\s+task|kill\s+server|terminate\s+process)\b/i, weight: -5 },
      { pattern: /\b(database|server|application|system|deployment|pipeline)\b/i, weight: -2 },
      { pattern: /\b(urgent|critical|important)\s+(issue|matter|task|update|bug)\b/i, weight: -2 },
      { pattern: /\b(medical|patient|emergency|treatment|diagnosis|hospital)\b/i, weight: -3 },
      { pattern: /\b(quarterly|revenue|financial|market|business|investment)\b/i, weight: -2 },
      { pattern: /\b(docker|kubernetes|microservice|api|endpoint)\b/i, weight: -2 },
      { pattern: /\b(team|department|colleague|stakeholder|client)\b/i, weight: -1 },

      // Emoji or l33t threats (weight 5)
      { pattern: /(?:💀|☠️|🔪|💣)/, weight: 5 },
      { pattern: /k\s*i\s*l\s*l/i, weight: 5 },
      { pattern: /d\s*(?:1|!|i)\s*3/i, weight: 5 }
    ];
  }

  async analyze(input) {
    const startTime = performance.now();
    this.totalAnalyses++;

    const text = typeof input === 'string' ? input : 
                 (input.message || input.text || input.content || '');
    
    if (!text || text.length === 0) {
      return this.createResult(0, startTime);
    }

    const lowerCaseText = text.toLowerCase();

    let score = 0;
    let matchedPattern = false;

    // Single pass through critical patterns
    for (let i = 0; i < this.criticalPatterns.length; i++) {
      const { pattern, weight } = this.criticalPatterns[i];
      if (pattern.test(lowerCaseText)) {
        score += weight;
        matchedPattern = true;
        if (weight >= 6) break;
      }
    }

    // const adversarialScore = this.detectAdversarialAttacks(text, lowerCaseText);
    // if (adversarialScore > 0) {
    //   score += adversarialScore;
    //   matchedPattern = true;
    // }

    // const emojiAttackScore = this.detectEmojiUnicodeAttacks(text, lowerCaseText);
    // if (emojiAttackScore > 0) {
    //   score += emojiAttackScore;
    //   matchedPattern = true;
    // }

    // const modernHarassmentScore = this.detectModernHarassment(lowerCaseText);
    // if (modernHarassmentScore > 0) {
    //   score += modernHarassmentScore;
    //   matchedPattern = true;
    // }

    // const crossCulturalScore = this.detectCrossCulturalHarassment(lowerCaseText);
    // if (crossCulturalScore > 0) {
    //   score += crossCulturalScore;
    //   matchedPattern = true;
    // }
    
    // const edgeCaseScore = this.detectEdgeCases(text, lowerCaseText);
    // if (edgeCaseScore > 0) {
    //   score += edgeCaseScore;
    //   matchedPattern = true;
    // }

    return this.createResult(score, startTime);
  }

  detectAdversarialAttacks(text, lowerCaseText) {
    let score = 0;
    
    const cyrillicPattern = /[а-яёА-ЯЁ]/g;
    const cyrillicMatches = text.match(cyrillicPattern);
    if (cyrillicMatches && cyrillicMatches.length > 2) {
      const suspiciousWords = ['trash', 'kill', 'die', 'worthless', 'stupid'];
      let hasToxicIntent = suspiciousWords.some(word => {
        const cyrillicWord = word.replace(/a/g, 'а').replace(/e/g, 'е').replace(/o/g, 'о');
        return lowerCaseText.includes(cyrillicWord) || lowerCaseText.includes(word);
      });
      
      if (hasToxicIntent) {
        score += 8;
      }
    }
    
    const leetPattern = /[0-9@$!*]{2,}/g;
    const leetMatches = text.match(leetPattern);
    if (leetMatches && leetMatches.length > 1) {
      const suspiciousLeet = [
        /k1ll|k!ll|k@ll/gi,
        /tr4sh|tr@sh/gi,
        /d13|d!3|d@e/gi,
        /st0p1d|stup!d/gi,
        /w0rth|w@rth/gi
      ];
      
      for (const pattern of suspiciousLeet) {
        if (pattern.test(text)) {
          score += 7;
          break;
        }
      }
    }
    
    const spacingPattern = /\b\w\s+\w\s+\w\s+\w/g;
    if (spacingPattern.test(text)) {
      const spacedText = text.replace(/\s+/g, '').toLowerCase();
      const toxicWords = ['kill', 'die', 'trash', 'worthless', 'stupid'];
      if (toxicWords.some(word => spacedText.includes(word))) {
        score += 6;
      }
    }
    
    const hasLatin = /[a-zA-Z]/.test(text);
    const hasCyrillic = /[а-яёА-ЯЁ]/.test(text);
    const hasGreek = /[α-ωΑ-Ω]/.test(text);
    const scriptCount = [hasLatin, hasCyrillic, hasGreek].filter(Boolean).length;
    
    if (scriptCount >= 2 && text.length < 100) {
      score += 4;
    }
    
    return score;
  }

  detectEmojiUnicodeAttacks(text, lowerCaseText) {
    let score = 0;
    
    const unicodeFontPatterns = [
      /[\u{1D400}-\u{1D7FF}]/gu,
      /[ａ-ｚＡ-Ｚ]/g
    ];
    
    let hasUnicodeFont = false;
    for (const pattern of unicodeFontPatterns) {
      if (pattern.test(text)) {
        hasUnicodeFont = true;
        break;
      }
    }
    
    if (hasUnicodeFont) {
      const normalizedTextForCheck = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const toxicWords = ['trash', 'kill', 'die', 'worthless'];
      if (toxicWords.some(word => normalizedTextForCheck.includes(word))) {
        score += 8;
      }
    }
    
    const threateningEmojiPatterns = [
      /💀☠️|🔫💥|🖕🖕/g,
      /💩🗑️|🤮🤢/g,
      /😈👹|👿😡/g,
      /🔪⚔️|💣💥/g
    ];
    
    for (const pattern of threateningEmojiPatterns) {
      if (pattern.test(text)) {
        score += 5;
        break;
      }
    }
    
    if (/💀|☠️/.test(text) && /\\b(you|die|kill)\\b/i.test(lowerCaseText)) {
      score += 6;
    }
    
    if (/🗑️|💩/.test(text) && /\\b(trash|garbage|worthless)\\b/i.test(lowerCaseText)) {
      score += 5;
    }
    
    return score;
  }

  detectModernHarassment(lowerCaseText) {
    let score = 0;
    
    const modernSlangPatterns = [
      /ratio\\s*\\+\\s*l/,
      /fell\\s+off\\s+hard/,
      /cope\\s+harder/,
      /skill\\s+issue/,
      /get\\s+ratioed/,
      /stay\\s+mad/,
      /basement\\s+dweller/,
      /touch\\s+grass/,
      /malding\\s+and\\s+seething/,
      /imagine\\s+being\\s+this\\s+mid/
    ];
    
    let modernSlangCount = 0;
    for (const pattern of modernSlangPatterns) {
      if (pattern.test(lowerCaseText)) {
        modernSlangCount++;
      }
    }
    
    if (modernSlangCount >= 3) {
      score += 7;
    } else if (modernSlangCount >= 2) {
      score += 5;
    } else if (modernSlangCount >= 1) {
      score += 3;
    }
    
    const gamingHarassmentPatterns = [
      /git\\s+gud/,
      /you\\s+got\\s+owned/,
      /pwned/,
      /noob/,
      /scrub/
    ];
    
    for (const pattern of gamingHarassmentPatterns) {
      if (pattern.test(lowerCaseText)) {
        score += 2;
      }
    }
    
    return score;
  }

  createResult(score, startTime) {
    const processingTime = performance.now() - startTime;
    this.totalTime += processingTime;

    return {
      score,
      isSpam: score >= this.spamThreshold,
      riskLevel: this.getRiskLevel(score),
      processingTime: Math.round(processingTime * 1000) / 1000,
      recommendation: this.getRecommendation(score),
      confidence: this.getConfidence(score),
      flags: score > 0 ? ['TURBO_DETECTION'] : [],
      variant: 'v4.7-turbo',
      metadata: {
        optimizedFor: 'massive-real-time-monitoring',
        architecture: 'zero-overhead-single-pass'
      }
    };
  }

  getRiskLevel(score) {
    if (score >= 8) return 'CRITICAL';
    if (score >= 6) return 'HIGH'; 
    if (score >= 4) return 'MEDIUM';
    if (score >= 2) return 'LOW';
    return 'CLEAN';
  }

  getRecommendation(score) {
    if (score >= 8) return 'Block immediately - Critical threat detected';
    if (score >= 6) return 'Block - High risk content';
    if (score >= 4) return 'Review - Spam detected';
    if (score >= 2) return 'Monitor - Low risk';
    return 'Allow - Clean';
  }

  getConfidence(score) {
    if (score >= 8) return 0.95;
    if (score >= 6) return 0.85;
    if (score >= 4) return 0.75;
    if (score >= 2) return 0.65;
    return 0.6;
  }

  // Convenience methods for batch processing
  async isSpam(text) {
    const result = await this.analyze(text);
    return result.isSpam;
  }

  async getScore(text) {
    const result = await this.analyze(text);
    return result.score;
  }

  // Batch processing for massive throughput
  async analyzeBatch(messages) {
    const results = [];
    const startTime = performance.now();
    
    for (let i = 0; i < messages.length; i++) {
      results.push(await this.analyze(messages[i]));
    }
    
    return {
      results,
      batchTime: performance.now() - startTime,
      throughput: messages.length / ((performance.now() - startTime) / 1000),
      totalMessages: messages.length
    };
  }

  getPerformanceMetrics() {
    const avgTime = this.totalAnalyses > 0 ? this.totalTime / this.totalAnalyses : 0;
    const throughput = avgTime > 0 ? 1000 / avgTime : 0;
    
    return {
      variant: 'v4.7-turbo',
      totalAnalyses: this.totalAnalyses,
      averageTime: `${Math.round(avgTime * 1000) / 1000}ms`,
      estimatedThroughput: `${Math.round(throughput).toLocaleString()} msgs/sec`,
      targetSpeed: avgTime < 0.1 ? '✅ ACHIEVED' : '❌ NEEDS WORK',
      optimizations: [
        'Zero preprocessing',
        'Pre-compiled patterns',
        'Single-pass processing',
        'No external dependencies',
        'Minimal object allocation',
        'Integer-based scoring',
        'Early exit strategies'
      ],
      useCase: 'Massive real-time chat monitoring (100k+ messages)'
    };
  }

  detectCrossCulturalHarassment(lowerCaseText) {
    let score = 0;
    
    const adaptationPatterns = [
      /that's\\s+not\\s+how\\s+we\\s+do\\s+things\\s+in\\s+this\\s+country/,
      /you\\s+need\\s+to\\s+adapt/,
      /when\\s+in\\s+rome/,
      /this\\s+is\\s+america/,
      /speak\\s+english/,
      /go\\s+back\\s+to\\s+your\\s+country/
    ];
    
    for (const pattern of adaptationPatterns) {
      if (pattern.test(lowerCaseText)) {
        score += 6;
        break;
      }
    }
    
    const languageBarrierPatterns = [
      /your\\s+accent\\s+makes\\s+it\\s+hard/,
      /can't\\s+understand\\s+your\\s+english/,
      /speak\\s+proper\\s+english/,
      /your\\s+broken\\s+english/,
      /learn\\s+to\\s+speak\\s+correctly/
    ];
    
    for (const pattern of languageBarrierPatterns) {
      if (pattern.test(lowerCaseText)) {
        score += 7;
        break;
      }
    }
    
    const culturalStereotypePatterns = [
      /people\\s+from\\s+your\\s+part\\s+of\\s+the\\s+world/,
      /your\\s+cultural\\s+background\\s+influences/,
      /that's\\s+typical\\s+for\\s+your\\s+culture/,
      /in\\s+your\\s+culture\\s+you\\s+probably/,
      /people\\s+like\\s+you\\s+from/
    ];
    
    for (const pattern of culturalStereotypePatterns) {
      if (pattern.test(lowerCaseText)) {
        score += 6;
        break;
      }
    }
    
    if (/not\\s+surprised/.test(lowerCaseText) && /accent/.test(lowerCaseText)) {
      score += 8;
    }
    
    return score;
  }

  detectEdgeCases(text, lowerCaseText) {
    let score = 0;
    
    const charRepetition = /(.)\\1{10,}/g;
    if (charRepetition.test(text)) {
      score += 4;
    }
    
    const words = lowerCaseText.split(/\s+/);
    if (words.length > 3) {
      const wordCounts = {};
      for (const word of words) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
      
      const maxCount = Math.max(...Object.values(wordCounts));
      if (maxCount > 5) {
        score += 3;
      }
    }
    
    const excessivePunctuation = /[!?]{5,}/g;
    if (excessivePunctuation.test(text)) {
      score += 2;
    }
    
    const allCapsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (allCapsRatio > 0.7 && text.length > 20 && !/\\b(API|HTTP|URL|SQL|CPU|GPU|RAM|SSD)\\b/.test(text)) {
      score += 3;
    }
    
    return score;
  }
}

module.exports = { ContentGuardV4Turbo }; 