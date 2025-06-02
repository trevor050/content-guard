#!/usr/bin/env node

/**
 * 🏭 ContentGuard v4.0 - TRUE Tiered Analysis System
 * 
 * Revolutionary three-tier architecture with actual ML differentiation:
 * 
 * Tier 1: Ultra-fast rule-based analysis (0.3-0.5ms)
 * Tier 2: Lightweight ML models (10-50ms) 
 * Tier 3: Heavy ML ensemble (100-500ms)
 * 
 * Each tier uses DIFFERENT analysis approaches, not just different weights!
 */

const fs = require('fs')
const path = require('path')

class TrueTieredSystem {
  constructor(options = {}) {
    this.options = {
      enableTier3: options.enableTier3 !== false,
      escalationStrategy: options.escalationStrategy || 'balanced',
      hyperparameters: options.hyperparameters || this.getDefaultHyperparameters(),
      debug: options.debug || false
    }
    
    // Performance tracking
    this.metrics = {
      totalAnalyses: 0,
      tier1Decisions: 0,
      tier2Decisions: 0,
      tier3Decisions: 0,
      totalTime: 0,
      tier1Time: 0,
      tier2Time: 0,
      tier3Time: 0,
      accuracyStats: { correct: 0, total: 0 }
    }
    
    // Initialize tiers
    this.initialized = false
  }
  
  getDefaultHyperparameters() {
    return {
      // Tier 1 thresholds (rule-based confidence)
      tier1: {
        cleanThreshold: 0.1,      // Below this = confident clean
        spamThreshold: 8.0,       // Above this = confident spam
        uncertaintyMin: 0.5,      // Start of uncertainty zone
        uncertaintyMax: 7.5       // End of uncertainty zone
      },
      
      // Tier 2 thresholds (lightweight ML)
      tier2: {
        confidenceThreshold: 0.75,  // Need this confidence to stop
        sentimentThreshold: 0.65,   // Negative sentiment cutoff
        semanticThreshold: 0.6,     // Semantic similarity cutoff
        escalationThreshold: 0.7    // Below this = escalate to Tier 3
      },
      
      // Tier 3 thresholds (heavy ML ensemble)
      tier3: {
        ensembleThreshold: 0.8,     // Final decision threshold
        modelWeights: {             // Ensemble weights
          toxicity: 0.4,
          sentiment: 0.3,
          semantic: 0.3
        }
      },
      
      // Escalation strategy weights
      escalation: {
        conservative: { tier1_to_tier2: 0.85, tier2_to_tier3: 0.9 },
        balanced: { tier1_to_tier2: 0.75, tier2_to_tier3: 0.8 },
        aggressive: { tier1_to_tier2: 0.65, tier2_to_tier3: 0.7 }
      }
    }
  }
  
  async initializeTiers() {
    console.log('🏭 Initializing True Tiered System...')
    
    // Initialize Tier 1 (Rule-based)
    this.tier1 = new Tier1RuleEngine(this.options.hyperparameters.tier1)
    console.log('✅ Tier 1: Rule-based engine ready')
    
    // Initialize Tier 2 (Lightweight ML)
    this.tier2 = new Tier2LightweightML(this.options.hyperparameters.tier2)
    await this.tier2.initialize()
    console.log('✅ Tier 2: Lightweight ML ready')
    
    // Initialize Tier 3 (Heavy ML Ensemble)
    if (this.options.enableTier3) {
      this.tier3 = new Tier3HeavyMLEnsemble(this.options.hyperparameters.tier3)
      await this.tier3.initialize()
      console.log('✅ Tier 3: Heavy ML ensemble ready')
    }
    
    this.initialized = true
    console.log('🚀 All tiers initialized successfully!')
  }
  
  async analyze(input) {
    if (!this.initialized) {
      throw new Error('TrueTieredSystem not initialized. Call await system.initializeTiers() first.')
    }
    
    const startTime = performance.now()
    this.metrics.totalAnalyses++
    
    // Normalize input
    const text = typeof input === 'string' ? input : 
                 (input.message || input.text || input.content || '')
    
    if (!text?.trim()) {
      return this.createEmptyResult()
    }
    
    let result = null
    let usedTier = 1
    let escalationReason = null
    let tierTimes = { tier1: 0, tier2: 0, tier3: 0 }
    
    // TIER 1: Ultra-fast rule-based analysis
    const tier1Start = performance.now()
    const tier1Result = await this.tier1.analyze(text, input)
    tierTimes.tier1 = performance.now() - tier1Start
    this.metrics.tier1Time += tierTimes.tier1
    
    // Check if Tier 1 is confident enough
    if (this.shouldStayTier1(tier1Result)) {
      result = tier1Result
      usedTier = 1
      this.metrics.tier1Decisions++
    } else {
      // TIER 2: Lightweight ML analysis
      const tier2Start = performance.now()
      const tier2Result = await this.tier2.analyze(text, input, tier1Result)
      tierTimes.tier2 = performance.now() - tier2Start
      this.metrics.tier2Time += tierTimes.tier2
      
      // Check if Tier 2 is confident enough
      if (this.shouldStayTier2(tier2Result) || !this.options.enableTier3) {
        result = tier2Result
        usedTier = 2
        escalationReason = 'tier1_uncertain'
        this.metrics.tier2Decisions++
      } else {
        // TIER 3: Heavy ML ensemble
        const tier3Start = performance.now()
        const tier3Result = await this.tier3.analyze(text, input, tier1Result, tier2Result)
        tierTimes.tier3 = performance.now() - tier3Start
        this.metrics.tier3Time += tierTimes.tier3
        
        result = tier3Result
        usedTier = 3
        escalationReason = 'tier2_uncertain'
        this.metrics.tier3Decisions++
      }
    }
    
    const totalTime = performance.now() - startTime
    this.metrics.totalTime += totalTime
    
    // Add tiered analysis metadata
    result.tieredAnalysis = {
      usedTier,
      escalationReason,
      processingTime: totalTime,
      tierTimes,
      confidence: result.confidence,
      distribution: this.getDistributionStats()
    }
    
    return result
  }
  
  shouldStayTier1(tier1Result) {
    const params = this.options.hyperparameters.tier1
    const score = tier1Result.score
    const confidence = tier1Result.confidence
    
    // Stay in Tier 1 if very confident about decision
    if (score <= params.cleanThreshold && confidence > 0.9) return true
    if (score >= params.spamThreshold && confidence > 0.9) return true
    
    // Escalate if in uncertainty zone or low confidence
    if (score >= params.uncertaintyMin && score <= params.uncertaintyMax) return false
    if (confidence < this.getEscalationThreshold('tier1_to_tier2')) return false
    
    return true // Default stay in Tier 1
  }
  
  shouldStayTier2(tier2Result) {
    const confidence = tier2Result.confidence
    const threshold = this.getEscalationThreshold('tier2_to_tier3')
    
    return confidence >= threshold
  }
  
  getEscalationThreshold(type) {
    const strategy = this.options.escalationStrategy
    return this.options.hyperparameters.escalation[strategy][type]
  }
  
  getDistributionStats() {
    const total = this.metrics.totalAnalyses
    if (total === 0) return { tier1: '0', tier2: '0', tier3: '0' }
    
    return {
      tier1: ((this.metrics.tier1Decisions / total) * 100).toFixed(1),
      tier2: ((this.metrics.tier2Decisions / total) * 100).toFixed(1),  
      tier3: ((this.metrics.tier3Decisions / total) * 100).toFixed(1)
    }
  }
  
  createEmptyResult() {
    return {
      score: 0,
      isSpam: false,
      confidence: 1.0,
      flags: [],
      riskLevel: 'CLEAN',
      recommendation: 'Allow - Empty content',
      details: {},
      tieredAnalysis: {
        usedTier: 1,
        escalationReason: null,
        processingTime: 0,
        tierTimes: { tier1: 0, tier2: 0, tier3: 0 },
        confidence: 1.0,
        distribution: this.getDistributionStats()
      }
    }
  }
  
  getPerformanceMetrics() {
    const total = this.metrics.totalAnalyses
    if (total === 0) return null
    
    return {
      totalAnalyses: total,
      averageTime: (this.metrics.totalTime / total).toFixed(2) + 'ms',
      tier1AverageTime: this.metrics.tier1Decisions > 0 ? 
        (this.metrics.tier1Time / this.metrics.tier1Decisions).toFixed(3) + 'ms' : '0ms',
      tier2AverageTime: this.metrics.tier2Decisions > 0 ? 
        (this.metrics.tier2Time / this.metrics.tier2Decisions).toFixed(2) + 'ms' : '0ms',
      tier3AverageTime: this.metrics.tier3Decisions > 0 ? 
        (this.metrics.tier3Time / this.metrics.tier3Decisions).toFixed(2) + 'ms' : '0ms',
      distribution: this.getDistributionStats(),
      accuracy: this.metrics.accuracyStats.total > 0 ? 
        (this.metrics.accuracyStats.correct / this.metrics.accuracyStats.total * 100).toFixed(1) + '%' : 'N/A'
    }
  }
  
  // Hyperparameter optimization methods
  updateHyperparameters(newParams) {
    this.options.hyperparameters = { ...this.options.hyperparameters, ...newParams }
    // Reinitialize tiers with new parameters
    this.initializeTiers()
  }
  
  async optimizeHyperparameters(testDataset, iterations = 100) {
    console.log(`🎯 Starting hyperparameter optimization with ${iterations} iterations...`)
    
    let bestParams = { ...this.options.hyperparameters }
    let bestScore = 0
    let bestMetrics = null
    
    for (let i = 0; i < iterations; i++) {
      // Generate random parameter variations
      const testParams = this.generateRandomParameters()
      
      // Test with these parameters
      this.updateHyperparameters(testParams)
      const metrics = await this.testOnDataset(testDataset)
      
      // Calculate composite score (accuracy + speed)
      const score = this.calculateOptimizationScore(metrics)
      
      if (score > bestScore) {
        bestScore = score
        bestParams = { ...testParams }
        bestMetrics = metrics
        console.log(`📈 New best score: ${score.toFixed(3)} (iteration ${i + 1})`)
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`⏳ Progress: ${i + 1}/${iterations} iterations completed`)
      }
    }
    
    // Apply best parameters
    this.updateHyperparameters(bestParams)
    console.log('🏆 Hyperparameter optimization complete!')
    console.log('Best metrics:', bestMetrics)
    
    return { bestParams, bestScore, bestMetrics }
  }
  
  generateRandomParameters() {
    // Generate random variations of hyperparameters within reasonable bounds
    return {
      tier1: {
        cleanThreshold: Math.random() * 0.5,
        spamThreshold: 6 + Math.random() * 4,
        uncertaintyMin: 0.3 + Math.random() * 0.5,
        uncertaintyMax: 6 + Math.random() * 3
      },
      tier2: {
        confidenceThreshold: 0.6 + Math.random() * 0.3,
        sentimentThreshold: 0.5 + Math.random() * 0.3,
        semanticThreshold: 0.4 + Math.random() * 0.4,
        escalationThreshold: 0.6 + Math.random() * 0.3
      },
      tier3: {
        ensembleThreshold: 0.7 + Math.random() * 0.2,
        modelWeights: {
          toxicity: 0.2 + Math.random() * 0.6,
          sentiment: 0.2 + Math.random() * 0.6,
          semantic: 0.2 + Math.random() * 0.6
        }
      }
    }
  }
  
  calculateOptimizationScore(metrics) {
    // Weighted combination of accuracy and speed
    const accuracy = parseFloat(metrics.accuracy) / 100
    const avgTime = parseFloat(metrics.averageTime)
    const tier1Rate = parseFloat(metrics.distribution.tier1) / 100
    
    // Target: 85%+ accuracy, <2ms average, 75%+ Tier 1 handling
    const accuracyScore = Math.min(accuracy / 0.85, 1.0) * 0.5
    const speedScore = Math.min(2.0 / avgTime, 1.0) * 0.3
    const distributionScore = Math.min(tier1Rate / 0.75, 1.0) * 0.2
    
    return accuracyScore + speedScore + distributionScore
  }
  
  async testOnDataset(dataset) {
    // Reset metrics for this test
    const originalMetrics = { ...this.metrics }
    this.metrics = {
      totalAnalyses: 0, tier1Decisions: 0, tier2Decisions: 0, tier3Decisions: 0,
      totalTime: 0, tier1Time: 0, tier2Time: 0, tier3Time: 0,
      accuracyStats: { correct: 0, total: 0 }
    }
    
    // Run analysis on dataset
    for (const testCase of dataset) {
      const result = await this.analyze(testCase.text)
      const expected = testCase.expected === 'SPAM'
      const actual = result.isSpam
      
      this.metrics.accuracyStats.total++
      if (actual === expected) {
        this.metrics.accuracyStats.correct++
      }
    }
    
    const metrics = this.getPerformanceMetrics()
    
    // Restore original metrics
    this.metrics = originalMetrics
    
    return metrics
  }
}

/**
 * TIER 1: Ultra-Fast Rule-Based Engine
 * 
 * Pure rule-based analysis focusing on obvious patterns.
 * Target: <0.5ms processing time, handle 75-85% of cases.
 */
class Tier1RuleEngine {
  constructor(params) {
    this.params = params
    this.initializeRules()
  }
  
  initializeRules() {
    // Critical spam patterns (obvious cases)
    this.spamPatterns = [
      { pattern: /fuck|shit|damn|hell|bitch|asshole/gi, score: 3, type: 'profanity' },
      { pattern: /stupid|idiot|moron|dumbass|retard/gi, score: 4, type: 'insult' },
      { pattern: /kill yourself|kys|die|suicide|hang yourself/gi, score: 10, type: 'violence' },
      { pattern: /useless|worthless|pathetic|loser|trash/gi, score: 5, type: 'degradation' },
      { pattern: /nobody likes you|no one cares|everyone hates/gi, score: 6, type: 'social_rejection' },
      { pattern: /free money|click here|buy now|limited time/gi, score: 8, type: 'scam' },
      { pattern: /viagra|casino|lottery|winner/gi, score: 6, type: 'spam' },
      
      // Subtle harassment patterns that should still be caught by Tier 1
      { pattern: /(?:maybe|perhaps)\s+you\s+should\s+(?:stick\s+to|try|consider)\s+(?:simpler|easier)/gi, score: 4, type: 'condescending' },
      { pattern: /(?:are\s+you\s+sure|can\s+you\s+handle|do\s+you\s+think\s+you\s+can)/gi, score: 3, type: 'capability_questioning' },
      { pattern: /(?:everyone|people|we\s+all)\s+(?:else\s+)?(?:knows?|thinks?|understands?)/gi, score: 4, type: 'social_isolation' },
      { pattern: /(?:you\s+always|you\s+never|you\s+constantly)\s+(?:mess|fail|screw|get\s+it\s+wrong)/gi, score: 5, type: 'pattern_criticism' }
    ]
    
    // Clean patterns (professional/technical)
    this.cleanPatterns = [
      { pattern: /thank you|please|appreciate|regards/gi, score: -2, type: 'politeness' },
      { pattern: /meeting|project|deadline|schedule/gi, score: -1, type: 'professional' },
      { pattern: /server|database|API|deployment|process|system/gi, score: -1, type: 'technical' },
      { pattern: /help|support|assist|guidance/gi, score: -1, type: 'helpful' },
      { pattern: /feedback|suggestion|recommendation|advice/gi, score: -1, type: 'constructive' }
    ]
  }
  
  async analyze(text, input = {}) {
    const startTime = performance.now()
    
    let score = 0
    const flags = []
    const details = { patterns: [], confidence_factors: [] }
    
    // Check spam patterns
    for (const rule of this.spamPatterns) {
      const matches = text.match(rule.pattern)
      if (matches) {
        const ruleScore = rule.score * matches.length
        score += ruleScore
        flags.push(`[T1] ${rule.type}: +${ruleScore}`)
        details.patterns.push({ type: rule.type, matches: matches.length, score: ruleScore })
      }
    }
    
    // Check clean patterns
    for (const rule of this.cleanPatterns) {
      const matches = text.match(rule.pattern)
      if (matches) {
        const ruleScore = rule.score * matches.length
        score += ruleScore
        flags.push(`[T1] ${rule.type}: ${ruleScore}`)
        details.patterns.push({ type: rule.type, matches: matches.length, score: ruleScore })
      }
    }
    
    // Calculate confidence based on pattern strength
    let confidence = 0.5 // Default uncertain
    
    if (score <= this.params.cleanThreshold) {
      confidence = 0.95 // Very confident clean
      details.confidence_factors.push('clear_clean_signals')
    } else if (score >= this.params.spamThreshold) {
      confidence = 0.95 // Very confident spam  
      details.confidence_factors.push('clear_spam_signals')
    } else if (score >= this.params.uncertaintyMin && score <= this.params.uncertaintyMax) {
      confidence = 0.3 // Uncertain zone
      details.confidence_factors.push('uncertainty_zone')
    } else {
      confidence = 0.7 // Moderate confidence
      details.confidence_factors.push('moderate_signals')
    }
    
    // Length and complexity adjustments
    if (text.length < 10) {
      confidence *= 0.8 // Less confident on short text
      details.confidence_factors.push('short_text_penalty')
    }
    
    const processingTime = performance.now() - startTime
    
    return {
      score: Math.max(0, score),
      isSpam: score >= 5, // Fixed threshold for Tier 1
      confidence,
      flags,
      details,
      riskLevel: score >= 10 ? 'CRITICAL' : score >= 5 ? 'HIGH' : score >= 2 ? 'MEDIUM' : 'CLEAN',
      recommendation: this.getRecommendation(score, confidence),
      tier: 1,
      processingTime
    }
  }
  
  getRecommendation(score, confidence) {
    if (score >= 10) return 'Block immediately - Critical threat detected'
    if (score >= 5) return 'Flag for review - Likely spam'
    if (score >= 2) return 'Monitor - Potential risk'
    return 'Allow - Clean content'
  }
}

/**
 * TIER 2: Lightweight ML Analysis
 * 
 * Uses small, fast ML models for semantic understanding.
 * Target: 10-50ms processing time, catches subtle patterns.
 */
class Tier2LightweightML {
  constructor(params) {
    this.params = params
    this.initialized = false
    this.sentimentAnalyzer = null
    this.semanticPatterns = []
  }
  
  async initialize() {
    try {
      // Initialize lightweight sentiment analysis
      console.log('🔄 Loading Tier 2 ML models...')
      
      // Use small, quantized models for speed
      const { pipeline } = await import('@xenova/transformers')
      
      this.sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { quantized: true, progress_callback: null }
      )
      
      // Simple semantic similarity for context
      this.semanticPatterns = this.initializeSemanticPatterns()
      
      this.initialized = true
      console.log('✅ Tier 2 ML models loaded successfully')
      
    } catch (error) {
      console.warn('⚠️ Tier 2 ML initialization failed, using fallback:', error.message)
      this.initialized = false
      // Still initialize semantic patterns for fallback
      this.semanticPatterns = this.initializeSemanticPatterns()
    }
  }
  
  initializeSemanticPatterns() {
    return [
      // Harassment patterns that need semantic understanding
      { 
        keywords: ['incompetent', 'useless', 'pathetic', 'worthless'],
        context: ['work', 'job', 'performance', 'ability'],
        score: 6,
        type: 'workplace_harassment'
      },
      {
        keywords: ['sensitive', 'emotional', 'overreacting', 'dramatic'],
        context: ['you', 'being', 'too', 'stop'],
        score: 4,
        type: 'gaslighting'
      },
      {
        keywords: ['wrong', 'mistake', 'error', 'fail'],
        context: ['always', 'never', 'constantly', 'typical'],
        score: 3,
        type: 'pattern_criticism'
      }
    ]
  }
  
  async analyze(text, input = {}, tier1Result = {}) {
    const startTime = performance.now()
    
    let score = tier1Result.score || 0
    const flags = [...(tier1Result.flags || [])]
    const details = { 
      ...tier1Result.details,
      sentiment: null,
      semanticPatterns: [],
      mlAnalysis: {}
    }
    
    // Sentiment analysis
    if (this.initialized && this.sentimentAnalyzer) {
      try {
        const sentimentResult = await this.performSentimentAnalysis(text)
        details.sentiment = sentimentResult
        
        if (sentimentResult.negative && sentimentResult.confidence > this.params.sentimentThreshold) {
          const sentimentScore = Math.round(sentimentResult.confidence * 5)
          score += sentimentScore
          flags.push(`[T2] Negative sentiment: +${sentimentScore} (${(sentimentResult.confidence * 100).toFixed(1)}%)`)
        }
      } catch (error) {
        console.warn('Tier 2 sentiment analysis failed:', error.message)
      }
    }
    
    // Semantic pattern analysis
    const semanticScore = this.analyzeSemanticPatterns(text, details)
    score += semanticScore
    
    // Calculate Tier 2 confidence
    const confidence = this.calculateTier2Confidence(score, details, tier1Result)
    
    const processingTime = performance.now() - startTime
    
    return {
      score: Math.max(0, score),
      isSpam: score >= 4, // Lower threshold than Tier 1
      confidence,
      flags,
      details,
      riskLevel: score >= 8 ? 'CRITICAL' : score >= 4 ? 'HIGH' : score >= 2 ? 'MEDIUM' : 'CLEAN',
      recommendation: this.getRecommendation(score, confidence),
      tier: 2,
      processingTime: processingTime + (tier1Result.processingTime || 0)
    }
  }
  
  async performSentimentAnalysis(text) {
    const result = await this.sentimentAnalyzer(text)
    
    if (result && result[0]) {
      const { label, score } = result[0]
      return {
        label,
        confidence: score,
        negative: label === 'NEGATIVE',
        positive: label === 'POSITIVE'
      }
    }
    
    return { label: 'UNKNOWN', confidence: 0, negative: false, positive: false }
  }
  
  analyzeSemanticPatterns(text, details) {
    let semanticScore = 0
    const lowerText = text.toLowerCase()
    
    for (const pattern of this.semanticPatterns) {
      const keywordMatches = pattern.keywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      ).length
      
      const contextMatches = pattern.context.filter(context =>
        lowerText.includes(context.toLowerCase())
      ).length
      
      // Need both keywords and context for semantic match
      if (keywordMatches > 0 && contextMatches > 0) {
        const patternScore = Math.round(pattern.score * (keywordMatches + contextMatches) / 4)
        semanticScore += patternScore
        
        details.semanticPatterns.push({
          type: pattern.type,
          keywordMatches,
          contextMatches,
          score: patternScore
        })
      }
    }
    
    return semanticScore
  }
  
  calculateTier2Confidence(score, details, tier1Result) {
    let confidence = 0.5
    
    // Base confidence on score clarity
    if (score <= 1) confidence = 0.9
    else if (score >= 8) confidence = 0.9
    else if (score >= 2 && score <= 6) confidence = 0.4 // Uncertain range
    else confidence = 0.7
    
    // Boost confidence if sentiment and semantic agree
    if (details.sentiment?.negative && details.semanticPatterns.length > 0) {
      confidence = Math.min(confidence + 0.2, 0.95)
    }
    
    // Boost confidence if Tier 1 was also confident
    if (tier1Result.confidence > 0.8) {
      confidence = Math.min(confidence + 0.1, 0.95)
    }
    
    // Reduce confidence for mixed signals
    const hasPositive = details.sentiment?.positive
    const hasNegative = details.sentiment?.negative || details.semanticPatterns.length > 0
    
    if (hasPositive && hasNegative) {
      confidence *= 0.7
    }
    
    return Math.round(confidence * 100) / 100
  }
  
  getRecommendation(score, confidence) {
    if (score >= 8) return 'Block - High confidence threat'
    if (score >= 4 && confidence > 0.8) return 'Flag - Likely harmful'
    if (score >= 4) return 'Review - Potential threat'
    if (score >= 2) return 'Monitor - Low risk'
    return 'Allow - Clean content'
  }
}

/**
 * TIER 3: Heavy ML Ensemble
 * 
 * Multiple large ML models for maximum accuracy.
 * Target: 100-500ms processing time, final decision authority.
 */
class Tier3HeavyMLEnsemble {
  constructor(params) {
    this.params = params
    this.initialized = false
    this.models = {}
  }
  
  async initialize() {
    try {
      console.log('🔄 Loading Tier 3 heavy ML models...')
      
      const { pipeline } = await import('@xenova/transformers')
      
      // Load multiple models for ensemble - using models that actually exist
      this.models.sentiment = await pipeline(
        'sentiment-analysis',
        'Xenova/roberta-base-go_emotions',
        { quantized: true }
      )
      
      this.models.toxicity = await pipeline(
        'text-classification',
        'Xenova/toxic-bert',
        { quantized: true }
      )
      
      // For now, use a simpler approach that's guaranteed to work
      this.advancedRules = this.initializeAdvancedRules()
      
      this.initialized = true
      console.log('✅ Tier 3 heavy ML ensemble loaded successfully')
      
    } catch (error) {
      console.warn('⚠️ Tier 3 ML initialization failed:', error.message)
      this.initialized = false
      // Initialize advanced rules for fallback
      this.advancedRules = this.initializeAdvancedRules()
    }
  }
  
  initializeAdvancedRules() {
    return [
      // Very sophisticated harassment patterns
      { 
        pattern: /\b(?:you'?re|you\s+are)\s+(?:clearly|obviously|just)\s+(?:not\s+)?(?:cut\s+out|right|suited)\s+for/gi, 
        score: 6, 
        type: 'professional_exclusion' 
      },
      { 
        pattern: /\b(?:maybe|perhaps|i\s+think)\s+you\s+should\s+(?:consider|try|stick\s+to)\s+(?:something\s+)?(?:simpler|easier|different)/gi, 
        score: 5, 
        type: 'condescending_suggestion' 
      },
      { 
        pattern: /\b(?:everyone|people|we\s+all)\s+(?:knows?|thinks?|agrees?)\s+(?:that\s+)?you/gi, 
        score: 4, 
        type: 'social_isolation' 
      },
      { 
        pattern: /\b(?:no\s+one|nobody)\s+(?:wants?|likes?|respects?|trusts?)\s+you/gi, 
        score: 7, 
        type: 'social_rejection' 
      },
      { 
        pattern: /\b(?:you\s+always|you\s+never|you\s+constantly)\s+(?:mess\s+up|fail|screw\s+up|get\s+it\s+wrong)/gi, 
        score: 5, 
        type: 'pattern_criticism' 
      }
    ]
  }
  
  async analyze(text, input = {}, tier1Result = {}, tier2Result = {}) {
    const startTime = performance.now()
    
    let score = tier2Result?.score || tier1Result?.score || 0
    const flags = [...(tier2Result?.flags || tier1Result?.flags || [])]
    const details = {
      ...(tier2Result?.details || tier1Result?.details || {}),
      ensemble: {
        toxicity: null,
        emotion: null,
        hate: null,
        finalScore: 0,
        confidence: 0
      }
    }
    
    if (this.initialized) {
      try {
        // Run all models in parallel for speed
        const [sentimentResult, toxicityResult] = await Promise.all([
          this.models.sentiment ? this.models.sentiment(text) : null,
          this.models.toxicity ? this.models.toxicity(text) : null
        ])
        
        // Process results
        details.text = text // Store text for advanced rule processing
        const ensembleScore = this.processEnsembleResults(
          sentimentResult, toxicityResult, null, details
        )
        
        score += ensembleScore
        
      } catch (error) {
        console.warn('Tier 3 ensemble analysis failed:', error.message)
        flags.push('[T3] ML ensemble error, using previous tiers')
      }
    } else {
      // Fallback to advanced rule-based analysis
      const fallbackScore = this.advancedRuleBasedFallback(text, details)
      score += fallbackScore
    }
    
    // Final confidence calculation
    const confidence = this.calculateFinalConfidence(score, details, tier1Result, tier2Result)
    
    const processingTime = performance.now() - startTime
    const totalProcessingTime = processingTime + 
      (tier2Result?.processingTime || tier1Result?.processingTime || 0)
    
    return {
      score: Math.max(0, score),
      isSpam: score >= 3, // Most sensitive threshold
      confidence,
      flags,
      details,
      riskLevel: score >= 6 ? 'CRITICAL' : score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'CLEAN',
      recommendation: this.getFinalRecommendation(score, confidence),
      tier: 3,
      processingTime: totalProcessingTime
    }
  }
  
  processEnsembleResults(sentimentResult, toxicityResult, hateResult, details) {
    let ensembleScore = 0
    const weights = this.params.modelWeights
    
    // Process sentiment model
    if (sentimentResult && sentimentResult[0]) {
      const result = sentimentResult[0]
      details.ensemble.sentiment = result
      
      // Check for negative emotions
      const negativeEmotions = ['anger', 'disgust', 'fear', 'sadness']
      if (negativeEmotions.includes(result.label.toLowerCase()) && result.score > 0.3) {
        ensembleScore += result.score * weights.sentiment * 5
      }
    }
    
    // Process toxicity model
    if (toxicityResult && toxicityResult[0]) {
      details.ensemble.toxicity = toxicityResult[0]
      
      if (toxicityResult[0].label === 'TOXIC' && toxicityResult[0].score > 0.5) {
        ensembleScore += toxicityResult[0].score * weights.toxicity * 8
      }
    }
    
    // Use advanced rule patterns as third component
    let ruleScore = 0
    if (this.advancedRules) {
      for (const rule of this.advancedRules) {
        const matches = details.text?.match(rule.pattern) || []
        if (matches.length > 0) {
          ruleScore += rule.score * matches.length
        }
      }
    }
    
    ensembleScore += ruleScore * weights.semantic
    details.ensemble.advancedRules = { score: ruleScore, detected: ruleScore > 0 }
    
    details.ensemble.finalScore = ensembleScore
    return Math.round(ensembleScore)
  }
  
  advancedRuleBasedFallback(text, details) {
    // Advanced rule-based patterns when ML fails
    const advancedPatterns = [
      { pattern: /\b(you\s+are|you're)\s+(so\s+)?(stupid|dumb|worthless|useless)\b/gi, score: 5 },
      { pattern: /\b(go\s+)?(kill\s+yourself|die|suicide)\b/gi, score: 10 },
      { pattern: /\b(i\s+hate|i\s+despise|can't\s+stand)\s+you\b/gi, score: 6 },
      { pattern: /\b(you\s+should|you\s+need\s+to)\s+(leave|quit|stop)\b/gi, score: 4 }
    ]
    
    let score = 0
    for (const pattern of advancedPatterns) {
      const matches = text.match(pattern.pattern)
      if (matches) {
        score += pattern.score * matches.length
      }
    }
    
    return score
  }
  
  calculateFinalConfidence(score, details, tier1Result, tier2Result) {
    let confidence = 0.5
    
    // Base confidence on score clarity
    if (score <= 0.5) confidence = 0.95
    else if (score >= 8) confidence = 0.95
    else if (score >= 3 && score <= 6) confidence = 0.85
    else confidence = 0.9
    
    // Boost confidence if all tiers agree
    const tier1Spam = tier1Result?.isSpam
    const tier2Spam = tier2Result?.isSpam
    const tier3Spam = score >= 3
    
    const agreementCount = [tier1Spam, tier2Spam, tier3Spam].filter(Boolean).length
    if (agreementCount >= 2) {
      confidence = Math.min(confidence + 0.1, 0.98)
    }
    
    // Boost confidence with ensemble agreement
    if (details.ensemble && this.initialized) {
      const models = [details.ensemble.sentiment, details.ensemble.toxicity, details.ensemble.advancedRules]
      const modelAgreement = models.filter(m => {
        if (m && typeof m === 'object' && 'score' in m) {
          return m.score > 0.5
        }
        if (m && typeof m === 'object' && 'detected' in m) {
          return m.detected
        }
        return false
      }).length
      
      if (modelAgreement >= 2) {
        confidence = Math.min(confidence + 0.05, 0.99)
      }
    }
    
    return Math.round(confidence * 100) / 100
  }
  
  getFinalRecommendation(score, confidence) {
    if (score >= 8) return 'BLOCK - Critical threat detected by ensemble'
    if (score >= 6) return 'BLOCK - High confidence harmful content'
    if (score >= 3 && confidence > 0.8) return 'FLAG - Likely harmful content'
    if (score >= 3) return 'REVIEW - Potential harmful content'
    if (score >= 1) return 'MONITOR - Low risk detected'
    return 'ALLOW - Clean content verified by ensemble'
  }
}

// Export the main class
module.exports = { TrueTieredSystem }

// CLI interface for testing and optimization
if (require.main === module) {
  async function runTieredSystemDemo() {
    console.log('🏭 ContentGuard True Tiered System Demo')
    console.log('=' .repeat(50))
    
    const system = new TrueTieredSystem({
      enableTier3: true,
      escalationStrategy: 'balanced',
      debug: true
    })
    
    // Wait for initialization to complete
    await system.initializeTiers()
    
    const testCases = [
      { text: 'Hello, how are you today?', expected: 'CLEAN' },
      { text: 'You are completely useless and worthless', expected: 'SPAM' },
      { text: 'Kill the process on server-prod-03', expected: 'CLEAN' },
      { text: 'Go kill yourself, nobody likes you', expected: 'SPAM' },
      { text: 'Your work quality has been declining lately', expected: 'CLEAN' },
      { text: 'You are being way too sensitive about constructive feedback', expected: 'SPAM' },
      { text: 'Thanks for the quick response to my question', expected: 'CLEAN' },
      { text: 'Maybe you should stick to simpler tasks', expected: 'SPAM' }
    ]
    
    console.log('\n🧪 Testing True Tiered System:')
    console.log('-'.repeat(50))
    
    let correct = 0
    for (const testCase of testCases) {
      const result = await system.analyze(testCase.text)
      
      const expected = testCase.expected === 'SPAM'
      const isCorrect = result.isSpam === expected
      if (isCorrect) correct++
      
      console.log(`${isCorrect ? '✅' : '❌'} T${result.tieredAnalysis.usedTier} | ${result.tieredAnalysis.processingTime.toFixed(2)}ms | Score: ${result.score} | "${testCase.text.substring(0, 40)}..."`)
      console.log(`   Confidence: ${result.confidence} | Flags: ${result.flags.length}`)
    }
    
    console.log('\n📊 Performance Metrics:')
    console.log('-'.repeat(30))
    const metrics = system.getPerformanceMetrics()
    console.log(`• Accuracy: ${(correct / testCases.length * 100).toFixed(1)}%`)
    console.log(`• Average Time: ${metrics.averageTime}`)
    console.log(`• Tier 1 Time: ${metrics.tier1AverageTime}`)
    console.log(`• Tier 2 Time: ${metrics.tier2AverageTime}`)
    console.log(`• Tier 3 Time: ${metrics.tier3AverageTime}`)
    console.log(`• Distribution: T1:${metrics.distribution.tier1}% T2:${metrics.distribution.tier2}% T3:${metrics.distribution.tier3}%`)
    
    console.log('\n🎯 System Status:')
    const accuracy = (correct / testCases.length * 100)
    const avgTime = parseFloat(metrics.averageTime)
    const tier1Rate = parseFloat(metrics.distribution.tier1)
    
    console.log(`• Accuracy: ${accuracy >= 85 ? '✅' : '❌'} ${accuracy.toFixed(1)}% (target: >85%)`)
    console.log(`• Speed: ${avgTime < 50 ? '✅' : '❌'} ${avgTime.toFixed(1)}ms (target: <50ms)`)
    console.log(`• Distribution: ${tier1Rate >= 60 ? '✅' : '❌'} ${tier1Rate}% Tier 1 (target: >60%)`)
    
    const targetsHit = [accuracy >= 85, avgTime < 50, tier1Rate >= 60].filter(Boolean).length
    console.log(`\n🏅 Overall: ${targetsHit}/3 targets achieved`)
    
    if (targetsHit === 3) {
      console.log('🎉 TRUE TIERED SYSTEM WORKING! Ready for optimization.')
    } else {
      console.log('⚠️  Needs tuning. Consider hyperparameter optimization.')
    }
  }
  
  runTieredSystemDemo().catch(console.error)
} 