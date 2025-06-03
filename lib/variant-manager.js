/**
 * ContentGuard v4.7 Variant Manager
 * 
 * Provides unified access to all performance-optimized variants:
 * - Fast: Ultra-speed with minimal accuracy loss  
 * - Balanced: Optimal speed-accuracy tradeoff
 * - Large: Maximum accuracy with acceptable performance
 * 
 * Includes performance comparison and automatic variant selection.
 */

const { ContentGuardV4Fast } = require('./variants/v4-fast');
const { ContentGuardV4Balanced } = require('./variants/v4-balanced');
const ContentGuardV4Large = require('./variants/v4-large');
const { ContentGuardV47Ultra } = require('./variants/v4-ultra');

class ContentGuardVariantManager {
  constructor(options = {}) {
    this.options = {
      defaultVariant: options.defaultVariant || 'balanced',
      enableAutoSelection: options.enableAutoSelection || false,
      performanceTarget: options.performanceTarget || 'balanced', // 'speed', 'balanced', 'accuracy'
      debug: options.debug || false,
      ...options
    };

    // Initialize variants
    this.variants = {
      fast: new ContentGuardV4Fast(options.fast || {}),
      balanced: new ContentGuardV4Balanced(options.balanced || {}),
      large: new ContentGuardV4Large(options.large || {}),
      ultra: new ContentGuardV47Ultra(options.ultra || {})
    };

    // Performance tracking
    this.performanceMetrics = {
      fast: { totalTime: 0, analyses: 0, accuracy: null },
      balanced: { totalTime: 0, analyses: 0, accuracy: null },
      large: { totalTime: 0, analyses: 0, accuracy: null },
      ultra: { totalTime: 0, analyses: 0, accuracy: null }
    };

    // Variant specifications
    this.variantSpecs = {
      fast: {
        name: 'ContentGuard v4.7 Fast',
        description: 'Ultra-fast processing with minimal accuracy loss',
        targetSpeed: '<0.3ms',
        targetAccuracy: '65%+',
        architecture: 'Single-tier rule-based',
        bestFor: ['High-volume applications', 'Real-time filtering', 'Basic content screening'],
        tradeoffs: ['Limited ML features', 'Basic pattern detection', 'Minimal preprocessing']
      },
      balanced: {
        name: 'ContentGuard v4.7 Balanced',
        description: 'Optimal speed-accuracy tradeoff for most use cases',
        targetSpeed: '<1ms',
        targetAccuracy: '75%+',
        architecture: 'Smart 2-tier with selective escalation',
        bestFor: ['General content moderation', 'Production applications', 'Balanced requirements'],
        tradeoffs: ['Moderate ML usage', 'Context-aware processing', 'Smart caching']
      },
      large: {
        name: 'ContentGuard v4.7 Large',
        description: 'Maximum accuracy with comprehensive analysis',
        targetSpeed: '<5ms',
        targetAccuracy: '80%+',
        architecture: 'Multi-tier progressive with ML ensemble',
        bestFor: ['Critical moderation', 'High-accuracy requirements', 'Comprehensive analysis'],
        tradeoffs: ['Higher processing time', 'More resource usage', 'Advanced ML features']
      },
      ultra: {
        name: 'ContentGuard v4.7 Ultra',
        description: 'Experimental maximum accuracy with ML classifier',
        targetSpeed: '<20ms',
        targetAccuracy: '90%+',
        architecture: 'Large variant with logistic regression layer',
        bestFor: ['Accuracy research', 'Offline analysis'],
        tradeoffs: ['Very slow', 'High resource usage']
      }
    };
  }

  /**
   * Analyze content using the specified variant or auto-selected variant
   */
  async analyze(input, variantName = null) {
    const selectedVariant = variantName || this.selectVariant(input);
    const variant = this.variants[selectedVariant];

    if (!variant) {
      throw new Error(`Unknown variant: ${selectedVariant}. Available: ${Object.keys(this.variants).join(', ')}`);
    }

    const startTime = performance.now();
    const result = await variant.analyze(input);
    const processingTime = performance.now() - startTime;

    // Track performance metrics
    this.updateVariantMetrics(selectedVariant, processingTime);

    // Add variant selection metadata
    result.variantSelection = {
      selected: selectedVariant,
      reason: variantName ? 'manual' : 'auto-selected',
      alternatives: this.getAlternativeRecommendations(result, selectedVariant)
    };

    return result;
  }

  /**
   * Auto-select the best variant based on content characteristics and performance targets
   */
  selectVariant(input) {
    if (!this.options.enableAutoSelection) {
      return this.options.defaultVariant;
    }

    const text = typeof input === 'string' ? input : 
                 (input.message || input.text || input.content || '');

    // Quick content analysis for variant selection
    const contentAnalysis = this.analyzeContentForVariantSelection(text);
    
    switch (this.options.performanceTarget) {
      case 'speed':
        return this.selectForSpeed(contentAnalysis);
      case 'accuracy':
        return this.selectForAccuracy(contentAnalysis);
      default:
        return this.selectForBalance(contentAnalysis);
    }
  }

  analyzeContentForVariantSelection(text) {
    return {
      length: text.length,
      complexity: this.assessComplexity(text),
      suspiciousIndicators: this.countSuspiciousIndicators(text),
      professionalContext: this.hasStrongProfessionalContext(text),
      requiresDeepAnalysis: this.requiresDeepAnalysis(text)
    };
  }

  assessComplexity(text) {
    let complexity = 0;
    
    // Length-based complexity
    if (text.length > 200) complexity++;
    if (text.length > 500) complexity++;
    
    // Pattern-based complexity
    if (/[0-9@$!*]{2,}/.test(text)) complexity++; // Leetspeak
    if (/[а-я]/i.test(text)) complexity++; // Unicode
    if (/\s{3,}/.test(text)) complexity++; // Spacing evasion
    
    return complexity;
  }

  countSuspiciousIndicators(text) {
    let count = 0;
    const indicators = [
      /\b(kill|die|threat|harm)\b/i,
      /\b(hate|stupid|trash|worthless)\b/i,
      /\b(urgent|verify|suspended|expires)\b/i,
      /[!?]{2,}/,
      /\b[A-Z]{3,}\b/
    ];
    
    for (const indicator of indicators) {
      if (indicator.test(text)) count++;
    }
    
    return count;
  }

  hasStrongProfessionalContext(text) {
    const professionalTerms = [
      'database', 'server', 'application', 'medical', 'patient',
      'analysis', 'review', 'meeting', 'research', 'quarterly'
    ];
    
    const matches = professionalTerms.filter(term => 
      text.toLowerCase().includes(term)
    );
    
    return matches.length >= 2;
  }

  requiresDeepAnalysis(text) {
    // Check for patterns that benefit from sophisticated analysis
    const sophisticatedPatterns = [
      /\b(remember who|you work for|make your life)\b/i,
      /\b(people like you|not what we had)\b/i,
      /\b(you must be|clearly over)\b/i
    ];
    
    return sophisticatedPatterns.some(pattern => pattern.test(text));
  }

  selectForSpeed(analysis) {
    // Always prefer fast unless deep analysis is clearly needed
    if (analysis.requiresDeepAnalysis || analysis.suspiciousIndicators >= 3) {
      return 'balanced';
    }
    return 'fast';
  }

  selectForAccuracy(analysis) {
    // Prefer large for complex or suspicious content
    if (analysis.complexity >= 2 || analysis.suspiciousIndicators >= 2 || analysis.requiresDeepAnalysis) {
      return 'large';
    }
    return 'balanced';
  }

  selectForBalance(analysis) {
    // Balanced selection based on content characteristics
    if (analysis.requiresDeepAnalysis || analysis.suspiciousIndicators >= 3) {
      return 'large';
    }
    if (analysis.complexity <= 1 && analysis.suspiciousIndicators <= 1) {
      return 'fast';
    }
    return 'balanced';
  }

  getAlternativeRecommendations(result, usedVariant) {
    const alternatives = [];
    
    if (usedVariant === 'fast' && (result.score >= 3 || result.confidence < 0.8)) {
      alternatives.push({
        variant: 'balanced',
        reason: 'Higher accuracy for uncertain content',
        expectedImprovement: 'Better pattern detection'
      });
    }
    
    if (usedVariant === 'balanced' && result.confidence < 0.7) {
      alternatives.push({
        variant: 'large',
        reason: 'Maximum accuracy for complex content',
        expectedImprovement: 'Advanced ML analysis'
      });
    }
    
    if (usedVariant === 'large' && result.processingTime > 3) {
      alternatives.push({
        variant: 'balanced',
        reason: 'Faster processing with acceptable accuracy',
        expectedImprovement: '2-3x speed improvement'
      });
    }
    
    return alternatives;
  }

  updateVariantMetrics(variantName, processingTime) {
    const metrics = this.performanceMetrics[variantName];
    metrics.totalTime += processingTime;
    metrics.analyses++;
  }

  /**
   * Compare performance across all variants using sample content
   */
  async compareVariants(sampleTexts = null) {
    if (!sampleTexts) {
      sampleTexts = this.getDefaultSampleTexts();
    }

    const results = {
      fast: { accurateResults: 0, totalTime: 0, results: [] },
      balanced: { accurateResults: 0, totalTime: 0, results: [] },
      large: { accurateResults: 0, totalTime: 0, results: [] }
    };

    for (const variant of Object.keys(this.variants)) {
      for (const sample of sampleTexts) {
        const startTime = performance.now();
        const result = await this.variants[variant].analyze(sample.text);
        const processingTime = performance.now() - startTime;

        results[variant].totalTime += processingTime;
        results[variant].results.push({
          text: sample.text.substring(0, 50) + '...',
          expected: sample.expected,
          actual: result.isSpam ? 'SPAM' : 'CLEAN',
          correct: (result.isSpam && sample.expected === 'SPAM') || 
                  (!result.isSpam && sample.expected === 'CLEAN'),
          score: result.score,
          confidence: result.confidence,
          processingTime
        });

        if (results[variant].results[results[variant].results.length - 1].correct) {
          results[variant].accurateResults++;
        }
      }
    }

    return this.formatComparisonResults(results, sampleTexts.length);
  }

  getDefaultSampleTexts() {
    return [
      { text: "We need to kill the server process before it crashes", expected: "CLEAN" },
      { text: "you should kill yourself loser", expected: "SPAM" },
      { text: "Great work on the analysis! Looking forward to collaborating", expected: "CLEAN" },
      { text: "I can make your life very difficult here if you don't comply", expected: "SPAM" },
      { text: "The database performance analysis shows critical bottlenecks", expected: "CLEAN" },
      { text: "URGENT: Verify your account immediately or it will be suspended", expected: "SPAM" },
      { text: "y0u 4r3 tr4sh 4nd sh0uld d13", expected: "SPAM" },
      { text: "The medical team needs urgent consultation on this case", expected: "CLEAN" }
    ];
  }

  formatComparisonResults(results, totalSamples) {
    const comparison = {};
    
    for (const [variant, data] of Object.entries(results)) {
      const accuracy = (data.accurateResults / totalSamples) * 100;
      const avgTime = data.totalTime / totalSamples;
      const spec = this.variantSpecs[variant];
      
      comparison[variant] = {
        ...spec,
        performance: {
          accuracy: `${accuracy.toFixed(1)}%`,
          averageTime: `${avgTime.toFixed(2)}ms`,
          throughput: `${Math.round(1000 / avgTime)} ops/sec`,
          targetsMet: {
            speed: spec.targetSpeed.includes('<') ? 
                   avgTime < parseFloat(spec.targetSpeed.replace(/[<>ms]/g, '')) : 'N/A',
            accuracy: accuracy >= parseFloat(spec.targetAccuracy.replace('%+', ''))
          }
        },
        results: data.results
      };
    }
    
    return comparison;
  }

  /**
   * Get performance recommendations based on current usage patterns
   */
  getPerformanceRecommendations() {
    const recommendations = [];
    
    for (const [variant, metrics] of Object.entries(this.performanceMetrics)) {
      if (metrics.analyses === 0) continue;
      
      const avgTime = metrics.totalTime / metrics.analyses;
      const spec = this.variantSpecs[variant];
      
      if (variant === 'fast' && avgTime > 0.5) {
        recommendations.push({
          variant,
          issue: 'Speed target not met',
          recommendation: 'Consider optimizing patterns or reducing feature set',
          impact: 'Performance optimization'
        });
      }
      
      if (variant === 'balanced' && avgTime > 1.5) {
        recommendations.push({
          variant,
          issue: 'Processing time higher than target',
          recommendation: 'Review escalation thresholds or enable caching',
          impact: 'Speed improvement'
        });
      }
      
      if (variant === 'large' && avgTime > 8) {
        recommendations.push({
          variant,
          issue: 'High processing time',
          recommendation: 'Consider balanced variant for non-critical content',
          impact: 'Significant speed improvement'
        });
      }
    }
    
    return recommendations;
  }

  /**
   * Get overall performance metrics across all variants
   */
  getOverallMetrics() {
    const overall = {
      totalAnalyses: 0,
      variantUsage: {},
      averageTimes: {},
      recommendations: this.getPerformanceRecommendations()
    };
    
    for (const [variant, metrics] of Object.entries(this.performanceMetrics)) {
      overall.totalAnalyses += metrics.analyses;
      overall.variantUsage[variant] = metrics.analyses;
      overall.averageTimes[variant] = metrics.analyses > 0 ? 
        (metrics.totalTime / metrics.analyses).toFixed(2) + 'ms' : 'No data';
    }
    
    return overall;
  }

  /**
   * Convenience methods for direct variant access
   */
  fast(input) { return this.analyze(input, 'fast'); }
  balanced(input) { return this.analyze(input, 'balanced'); }
  large(input) { return this.analyze(input, 'large'); }

  /**
   * Get variant specifications
   */
  getVariantSpecs() {
    return this.variantSpecs;
  }

  /**
   * Update variant configurations
   */
  updateVariantConfig(variantName, config) {
    if (this.variants[variantName]) {
      this.variants[variantName].updateConfig(config);
    } else {
      throw new Error(`Unknown variant: ${variantName}`);
    }
  }
}

module.exports = { ContentGuardVariantManager }; 