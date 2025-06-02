#!/usr/bin/env node

/**
 * ContentGuard v4.5 Variant Performance Benchmark
 * 
 * Comprehensive testing of all variants against the baseline v4.0:
 * - Fast: Ultra-speed variant
 * - Balanced: Optimal tradeoff variant  
 * - Large: Maximum accuracy variant
 * - v4.0 Original: Current baseline
 * 
 * Tests speed, accuracy, and real-world performance scenarios.
 */

const { ContentGuardVariantManager } = require('../lib/variant-manager');
const { ContentGuard } = require('../index.js'); // v4.0 baseline

console.log('🚀 ContentGuard v4.5 Variant Performance Benchmark');
console.log('=' .repeat(80));

class VariantBenchmark {
  constructor() {
    // Initialize variant manager
    this.variantManager = new ContentGuardVariantManager({
      defaultVariant: 'balanced',
      enableAutoSelection: false
    });

    // Initialize v4.0 baseline for comparison
    this.baseline = new ContentGuard({ debug: false });

    // Test scenarios
    this.testScenarios = this.initializeTestScenarios();
    
    // Results storage
    this.results = {
      fast: { accuracy: 0, speed: [], totalTime: 0, errors: [] },
      balanced: { accuracy: 0, speed: [], totalTime: 0, errors: [] },
      large: { accuracy: 0, speed: [], totalTime: 0, errors: [] },
      baseline: { accuracy: 0, speed: [], totalTime: 0, errors: [] }
    };
  }

  initializeTestScenarios() {
    return [
      // Professional content (should be CLEAN)
      { text: "We need to kill the server process before it crashes the entire cluster", expected: "CLEAN", category: "professional" },
      { text: "The database performance analysis shows critical bottlenecks requiring immediate attention", expected: "CLEAN", category: "professional" },
      { text: "Patient requires urgent medical consultation on the critical care protocol", expected: "CLEAN", category: "professional" },
      { text: "The quarterly revenue analysis indicates strong market performance this period", expected: "CLEAN", category: "professional" },
      { text: "Research methodology shows significant correlation between variables in the study", expected: "CLEAN", category: "professional" },

      // Clear harassment (should be SPAM)
      { text: "you should kill yourself loser", expected: "SPAM", category: "harassment" },
      { text: "go die in a fire you worthless piece of trash", expected: "SPAM", category: "harassment" },
      { text: "fuck you and your family you piece of shit", expected: "SPAM", category: "harassment" },
      { text: "you are trash and should die immediately", expected: "SPAM", category: "harassment" },
      { text: "I hope you get hit by a car and die", expected: "SPAM", category: "harassment" },

      // Sophisticated harassment (should be SPAM)
      { text: "Remember who signs your paycheck before you decide to push back on my decisions", expected: "SPAM", category: "sophisticated" },
      { text: "I can make your life very difficult here if you continue to question my authority", expected: "SPAM", category: "sophisticated" },
      { text: "People like you usually struggle with the technical aspects of this kind of work", expected: "SPAM", category: "sophisticated" },
      { text: "You're clearly overreacting to what was obviously just constructive feedback", expected: "SPAM", category: "sophisticated" },
      { text: "Everyone else understands this perfectly fine, so the problem must be with you", expected: "SPAM", category: "sophisticated" },

      // Social engineering (should be SPAM) 
      { text: "URGENT: Verify your account immediately or it will be suspended within 24 hours", expected: "SPAM", category: "phishing" },
      { text: "Your password expires in 24 hours - update now to avoid account suspension", expected: "SPAM", category: "phishing" },
      { text: "Suspicious activity detected on your account - confirm your identity immediately", expected: "SPAM", category: "phishing" },
      { text: "Account verification required: Click here to verify your identity before suspension", expected: "SPAM", category: "phishing" },

      // Adversarial attacks (should be SPAM)
      { text: "y0u 4r3 tr4sh 4nd sh0uld k1ll y0urs3lf r1ght n0w", expected: "SPAM", category: "adversarial" },
      { text: "g0 d!3 1n 4 f!r3 y0u w0rth|3ss |053r", expected: "SPAM", category: "adversarial" },
      { text: "уоu аrе trаsh аnd shоuld kiII уоursеIf immeԁiаtеlу", expected: "SPAM", category: "adversarial" },
      { text: "You should d.i.e immediately you piece of garbage", expected: "SPAM", category: "adversarial" },

      // Modern communication (should be CLEAN)
      { text: "This code review is hitting different - very demure, very mindful approach to optimization", expected: "CLEAN", category: "modern" },
      { text: "The analysis slaps fr fr, no cap on the quality of this research", expected: "CLEAN", category: "modern" },
      { text: "Periodt! That presentation was absolutely fire and delivered perfectly", expected: "CLEAN", category: "modern" },

      // Edge cases (mixed expectations)
      { text: "The competitor analysis shows they're killing us in mobile market share this quarter", expected: "CLEAN", category: "edge" },
      { text: "xXx_DeathKiller420_xXx wants to be your friend on social media", expected: "CLEAN", category: "edge" },
      { text: "Kill -9 the background service to free up memory and improve performance", expected: "CLEAN", category: "edge" }
    ];
  }

  async runComprehensiveBenchmark() {
    console.log('\n📊 Starting Comprehensive Variant Benchmark...');
    console.log(`Testing ${this.testScenarios.length} scenarios across 4 variants\n`);

    // Test each variant
    await this.testVariant('fast', this.variantManager.variants.fast);
    await this.testVariant('balanced', this.variantManager.variants.balanced);
    await this.testVariant('large', this.variantManager.variants.large);
    await this.testVariant('baseline', this.baseline);

    // Generate comprehensive report
    this.generateComprehensiveReport();
  }

  async testVariant(variantName, variant) {
    console.log(`🧪 Testing ${variantName.toUpperCase()} variant...`);
    
    let correct = 0;
    const errors = [];
    const times = [];
    let totalTime = 0;

    for (const scenario of this.testScenarios) {
      const startTime = performance.now();
      
      try {
        const result = await variant.analyze(scenario.text);
        const processingTime = performance.now() - startTime;
        
        times.push(processingTime);
        totalTime += processingTime;

        const actualType = result.isSpam ? 'SPAM' : 'CLEAN';
        const isCorrect = actualType === scenario.expected;
        
        if (isCorrect) {
          correct++;
        } else {
          errors.push({
            text: scenario.text.substring(0, 60) + '...',
            expected: scenario.expected,
            actual: actualType,
            score: result.score,
            confidence: result.confidence,
            category: scenario.category
          });
        }

        // Progress indicator
        if (this.testScenarios.indexOf(scenario) % 5 === 0) {
          process.stdout.write('.');
        }

      } catch (error) {
        errors.push({
          text: scenario.text.substring(0, 60) + '...',
          error: error.message,
          category: scenario.category
        });
      }
    }

    // Store results
    this.results[variantName] = {
      accuracy: (correct / this.testScenarios.length) * 100,
      speed: times,
      totalTime,
      errors,
      averageTime: totalTime / this.testScenarios.length,
      throughput: Math.round(1000 / (totalTime / this.testScenarios.length))
    };

    console.log(` ✅ Complete\n`);
  }

  generateComprehensiveReport() {
    console.log('\n📈 COMPREHENSIVE VARIANT PERFORMANCE REPORT');
    console.log('=' .repeat(80));

    // Overview table
    console.log('\n📊 PERFORMANCE OVERVIEW');
    console.log('-' .repeat(80));
    console.log('Variant    | Accuracy | Avg Time | Throughput | vs Baseline');
    console.log('-' .repeat(80));

    const baselineAccuracy = this.results.baseline.accuracy;
    const baselineTime = this.results.baseline.averageTime;

    for (const [variant, data] of Object.entries(this.results)) {
      const accuracyDiff = variant !== 'baseline' ? 
        (data.accuracy - baselineAccuracy).toFixed(1) : '0.0';
      const speedDiff = variant !== 'baseline' ? 
        ((baselineTime / data.averageTime - 1) * 100).toFixed(0) : '0';

      console.log(
        `${variant.padEnd(10)} | ${data.accuracy.toFixed(1)}%     | ${data.averageTime.toFixed(2)}ms  | ${data.throughput.toString().padEnd(10)} | ${variant !== 'baseline' ? `${accuracyDiff > 0 ? '+' : ''}${accuracyDiff}% acc, ${speedDiff > 0 ? '+' : ''}${speedDiff}% speed` : 'baseline'}`
      );
    }

    // Detailed performance analysis
    console.log('\n🎯 DETAILED PERFORMANCE ANALYSIS');
    console.log('-' .repeat(80));

    for (const [variant, data] of Object.entries(this.results)) {
      console.log(`\n${variant.toUpperCase()} VARIANT:`);
      console.log(`   Accuracy: ${data.accuracy.toFixed(1)}% (${Math.round((this.testScenarios.length - data.errors.length))}/${this.testScenarios.length} correct)`);
      console.log(`   Speed: ${data.averageTime.toFixed(2)}ms avg (min: ${Math.min(...data.speed).toFixed(2)}ms, max: ${Math.max(...data.speed).toFixed(2)}ms)`);
      console.log(`   Throughput: ${data.throughput} analyses/sec`);
      console.log(`   Errors: ${data.errors.length} cases`);

      // Speed vs baseline comparison
      if (variant !== 'baseline') {
        const speedImprovement = ((baselineTime / data.averageTime - 1) * 100);
        const accuracyDiff = data.accuracy - baselineAccuracy;
        
        console.log(`   vs Baseline: ${speedImprovement.toFixed(1)}% ${speedImprovement > 0 ? 'faster' : 'slower'}, ${accuracyDiff.toFixed(1)}pp ${accuracyDiff > 0 ? 'more' : 'less'} accurate`);
      }
    }

    // Error analysis by category
    console.log('\n🔍 ERROR ANALYSIS BY CATEGORY');
    console.log('-' .repeat(80));

    const categories = ['professional', 'harassment', 'sophisticated', 'phishing', 'adversarial', 'modern', 'edge'];
    
    for (const category of categories) {
      console.log(`\n${category.toUpperCase()}:`);
      
      for (const [variant, data] of Object.entries(this.results)) {
        const categoryErrors = data.errors.filter(e => e.category === category);
        const categoryTotal = this.testScenarios.filter(s => s.category === category).length;
        const categoryAccuracy = ((categoryTotal - categoryErrors.length) / categoryTotal * 100);
        
        console.log(`   ${variant}: ${categoryAccuracy.toFixed(1)}% (${categoryErrors.length}/${categoryTotal} errors)`);
      }
    }

    // Speed distribution analysis
    console.log('\n⚡ SPEED DISTRIBUTION ANALYSIS');
    console.log('-' .repeat(80));

    for (const [variant, data] of Object.entries(this.results)) {
      const times = data.speed;
      const p95 = this.calculatePercentile(times, 95);
      const p99 = this.calculatePercentile(times, 99);
      
      console.log(`\n${variant.toUpperCase()}:`);
      console.log(`   Average: ${data.averageTime.toFixed(2)}ms`);
      console.log(`   95th percentile: ${p95.toFixed(2)}ms`);
      console.log(`   99th percentile: ${p99.toFixed(2)}ms`);
      console.log(`   Min/Max: ${Math.min(...times).toFixed(2)}ms / ${Math.max(...times).toFixed(2)}ms`);
    }

    // Recommendations
    this.generateRecommendations();
  }

  calculatePercentile(values, percentile) {
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile / 100) - 1;
    return sorted[index];
  }

  generateRecommendations() {
    console.log('\n💡 VARIANT SELECTION RECOMMENDATIONS');
    console.log('-' .repeat(80));

    const fastData = this.results.fast;
    const balancedData = this.results.balanced; 
    const largeData = this.results.large;
    const baselineData = this.results.baseline;

    // Speed champion
    const speedWinner = Object.entries(this.results)
      .reduce((winner, [variant, data]) => 
        data.averageTime < winner.time ? { variant, time: data.averageTime } : winner,
        { variant: 'none', time: Infinity }
      );

    // Accuracy champion  
    const accuracyWinner = Object.entries(this.results)
      .reduce((winner, [variant, data]) => 
        data.accuracy > winner.accuracy ? { variant, accuracy: data.accuracy } : winner,
        { variant: 'none', accuracy: 0 }
      );

    console.log(`🏆 Speed Champion: ${speedWinner.variant.toUpperCase()} (${speedWinner.time.toFixed(2)}ms)`);
    console.log(`🎯 Accuracy Champion: ${accuracyWinner.variant.toUpperCase()} (${accuracyWinner.accuracy.toFixed(1)}%)`);

    console.log('\n📋 USE CASE RECOMMENDATIONS:');
    
    // High-volume applications
    console.log('\n🔥 High-Volume Applications (>1000 req/sec):');
    if (fastData.averageTime < 0.5) {
      console.log(`   ✅ FAST variant recommended: ${fastData.averageTime.toFixed(2)}ms, ${fastData.accuracy.toFixed(1)}% accuracy`);
    } else {
      console.log(`   ⚠️  FAST variant needs optimization: ${fastData.averageTime.toFixed(2)}ms (target: <0.5ms)`);
    }

    // General production use
    console.log('\n⚖️  General Production Use:');
    if (balancedData.averageTime < 1.0 && balancedData.accuracy >= 75) {
      console.log(`   ✅ BALANCED variant recommended: ${balancedData.averageTime.toFixed(2)}ms, ${balancedData.accuracy.toFixed(1)}% accuracy`);
    } else {
      console.log(`   ⚠️  BALANCED variant needs tuning: ${balancedData.averageTime.toFixed(2)}ms, ${balancedData.accuracy.toFixed(1)}%`);
    }

    // Critical content moderation
    console.log('\n🛡️  Critical Content Moderation:');
    if (largeData.accuracy >= 80) {
      console.log(`   ✅ LARGE variant recommended: ${largeData.accuracy.toFixed(1)}% accuracy, ${largeData.averageTime.toFixed(2)}ms`);
    } else {
      console.log(`   ⚠️  LARGE variant needs accuracy improvements: ${largeData.accuracy.toFixed(1)}% (target: >80%)`);
    }

    // Best overall improvement vs baseline
    console.log('\n🚀 BEST OVERALL IMPROVEMENT vs v4.0 Baseline:');
    
    const variants = ['fast', 'balanced', 'large'];
    let bestImprovement = { variant: 'none', score: -Infinity };
    
    for (const variant of variants) {
      const data = this.results[variant];
      const speedImprovement = (baselineData.averageTime / data.averageTime - 1) * 100;
      const accuracyImprovement = data.accuracy - baselineData.accuracy;
      
      // Combined score: prioritize speed improvements with minimal accuracy loss
      const combinedScore = speedImprovement * 2 + accuracyImprovement * 3; // Weight accuracy higher
      
      console.log(`   ${variant.toUpperCase()}: ${speedImprovement.toFixed(1)}% faster, ${accuracyImprovement.toFixed(1)}pp accuracy (score: ${combinedScore.toFixed(1)})`);
      
      if (combinedScore > bestImprovement.score) {
        bestImprovement = { variant, score: combinedScore };
      }
    }
    
    console.log(`\n🏅 Overall Winner: ${bestImprovement.variant.toUpperCase()} variant (score: ${bestImprovement.score.toFixed(1)})`);

    // Version 4.5 readiness assessment
    console.log('\n✅ v4.5 RELEASE READINESS ASSESSMENT:');
    
    const readyCriteria = {
      fastSpeed: fastData.averageTime < 0.5,
      fastAccuracy: fastData.accuracy >= 65,
      balancedSpeed: balancedData.averageTime < 1.0,
      balancedAccuracy: balancedData.accuracy >= 75,
      largeAccuracy: largeData.accuracy >= 80,
      improvementOverBaseline: Object.values(this.results).some(data => 
        data !== baselineData && (
          data.averageTime < baselineData.averageTime || 
          data.accuracy > baselineData.accuracy
        )
      )
    };

    const readyCount = Object.values(readyCriteria).filter(Boolean).length;
    const totalCriteria = Object.keys(readyCriteria).length;
    
    console.log(`   Ready: ${readyCount}/${totalCriteria} criteria met`);
    
    if (readyCount >= totalCriteria * 0.8) {
      console.log('   🎉 v4.5 is READY for release!');
    } else {
      console.log('   ⚠️  v4.5 needs more optimization before release');
      
      // Show failing criteria
      for (const [criterion, met] of Object.entries(readyCriteria)) {
        if (!met) {
          console.log(`      ❌ ${criterion}`);
        }
      }
    }
  }

  async runQuickComparison() {
    console.log('\n⚡ Running Quick Variant Comparison...\n');
    
    const quickTests = [
      "you should kill yourself loser",
      "We need to kill the server process",
      "I can make your life very difficult here",
      "y0u 4r3 tr4sh 4nd sh0uld d13"
    ];

    for (const text of quickTests) {
      console.log(`📝 "${text.substring(0, 40)}..."`);
      
      for (const variant of ['fast', 'balanced', 'large']) {
        const startTime = performance.now();
        const result = await this.variantManager.analyze(text, variant);
        const time = performance.now() - startTime;
        
        console.log(`   ${variant.padEnd(8)}: ${result.isSpam ? 'SPAM' : 'CLEAN'} (${result.score}, ${time.toFixed(2)}ms, ${(result.confidence * 100).toFixed(0)}%)`);
      }
      console.log('');
    }
  }
}

// Run the benchmark
async function runBenchmark() {
  const benchmark = new VariantBenchmark();
  
  // Check if quick mode requested
  const args = process.argv.slice(2);
  if (args.includes('--quick')) {
    await benchmark.runQuickComparison();
  } else {
    await benchmark.runComprehensiveBenchmark();
  }
}

// Auto-run if called directly
if (require.main === module) {
  runBenchmark().catch(console.error);
}

module.exports = { VariantBenchmark }; 