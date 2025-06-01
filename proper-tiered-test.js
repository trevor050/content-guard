#!/usr/bin/env node

/**
 * 🎯 PROPER ContentGuard Tiered System Testing
 * 
 * This test properly isolates and compares:
 * 1. v3.0 vs v4.0 Tier 1 only (speed focused)
 * 2. v3.0 vs v4.0 Full Tiered System (accuracy focused)
 * 
 * We should see:
 * - Tier 1 much faster than v3.0 but similar accuracy
 * - Full tiered system MASSIVELY more accurate than v3.0
 */

const { ContentGuard } = require('./index.js')
const { ProductionTieredSystem } = require('./production-tiered-system.js')
const { MassiveBenchmarkV4 } = require('./tests/massive-benchmark-v3.js')

// Import v3.0 from NPM for real comparison
const v3ContentGuard = require('./v3-test/node_modules/content-guard')

class ProperTieredTest {
  constructor() {
    this.benchmark = new MassiveBenchmarkV4()
    this.testCases = this.benchmark.testCases.filter(tc => tc.expected !== 'MIXED')
    console.log(`\n🧪 Testing ${this.testCases.length} real-world cases from current massive benchmark`)
  }

  async runProperTest() {
    console.log('🎯 PROPER ContentGuard Tiered System Analysis')
    console.log('='.repeat(80))
    console.log('Testing the REAL performance differences...\n')

    // Test 1: v3.0 baseline (what we're beating)
    console.log('📊 Step 1: Testing v3.0 baseline from NPM...')
    const v3Results = await this.testV3Baseline()

    // Test 2: v4.0 Tier 1 ONLY (speed comparison)  
    console.log('\n📊 Step 2: Testing v4.0 Tier 1 ONLY (speed focused)...')
    const tier1Results = await this.testTier1Only()

    // Test 3: v4.0 Full Tiered System (accuracy comparison)
    console.log('\n📊 Step 3: Testing v4.0 FULL Tiered System (accuracy focused)...')
    const fullTieredResults = await this.testFullTiered()

    // Analysis
    this.analyzeRealDifferences(v3Results, tier1Results, fullTieredResults)
  }

  async testV3Baseline() {
    console.log('   Using actual published v3.0 from NPM...')
    const guard = new v3ContentGuard.ContentGuard()
    return await this.runTestSuite(guard, 'v3.0 NPM Baseline')
  }

  async testTier1Only() {
    console.log('   Testing ONLY Tier 1 (ultra-fast, minimal plugins)...')
    
    // Create a Tier 1 ONLY configuration - no escalation
    const guard = new ContentGuard({
      spamThreshold: 6, // High threshold - only obvious spam
      enableEarlyExit: true,
      enableCaching: false, // For accurate timing
      
      // MINIMAL plugins for speed
      plugins: {
        obscenity: { weight: 3.0, contextAware: false },
        patterns: { weight: 2.5, contextAware: false },
        validation: { weight: 2.0 }
        // NO harassment, sentiment, socialEngineering, ML plugins
      },
      
      // MINIMAL preprocessing for speed
      preprocessing: {
        normalizeUnicode: true,
        normalizeLeetSpeak: false, // Skip expensive operations
        expandSlang: false,
        contextAware: false // No context detection
      }
    })
    
    return await this.runTestSuite(guard, 'v4.0 Tier 1 ONLY')
  }

  async testFullTiered() {
    console.log('   Testing FULL Tiered System with ALL tiers enabled...')
    
    const guard = new ProductionTieredSystem({
      enableTier3: true, // Enable ALL tiers including ML
      escalationStrategy: 'balanced',
      
      // Aggressive tier thresholds for maximum escalation
      tier1: {
        spamThreshold: 7, // Very high - only super obvious spam
        confidenceThreshold: 0.7 // Low confidence = escalate
      },
      tier2: {
        spamThreshold: 4,
        confidenceThreshold: 0.85
      },
      tier3: {
        spamThreshold: 2, // Very sensitive for final decision
        enableMLFeatures: true
      }
    })
    
    return await this.runTestSuite(guard, 'v4.0 FULL Tiered System')
  }

  async runTestSuite(guard, configName) {
    const results = {
      configName,
      total: 0,
      correct: 0,
      falsePositives: 0,
      falseNegatives: 0,
      totalTime: 0,
      times: [],
      categories: {},
      detailedResults: []
    }

    // Initialize category tracking  
    const categories = [...new Set(this.testCases.map(tc => tc.category))]
    categories.forEach(cat => {
      results.categories[cat] = { total: 0, correct: 0, fp: 0, fn: 0, cases: [] }
    })

    let processed = 0
    for (const testCase of this.testCases) {
      processed++
      if (processed % 50 === 0) {
        process.stdout.write(`\r   Progress: ${processed}/${this.testCases.length}`)
      }

      const startTime = performance.now()
      
      let result
      try {
        result = await guard.analyze({
          name: 'Test User',
          email: 'test@example.com',
          message: testCase.text
        })
      } catch (error) {
        console.warn(`\nError in ${configName}: ${error.message}`)
        continue
      }
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      results.times.push(processingTime)
      results.totalTime += processingTime

      const isSpam = result.isSpam
      const expected = testCase.expected === 'SPAM'
      const category = testCase.category

      results.total++
      results.categories[category].total++

      const isCorrect = isSpam === expected
      if (isCorrect) {
        results.correct++
        results.categories[category].correct++
      } else {
        if (isSpam && !expected) {
          results.falsePositives++
          results.categories[category].fp++
        } else if (!isSpam && expected) {
          results.falseNegatives++
          results.categories[category].fn++
        }

        // Store incorrect cases for analysis
        results.categories[category].cases.push({
          text: testCase.text.substring(0, 100),
          expected: testCase.expected,
          actual: isSpam ? 'SPAM' : 'CLEAN',
          score: result.score,
          flags: result.flags?.slice(0, 3),
          tier: result.tieredAnalysis?.usedTier,
          processingTime
        })
      }
    }

    console.log() // New line after progress

    // Calculate metrics
    results.accuracy = (results.correct / results.total * 100)
    results.averageTime = results.totalTime / results.total
    results.minTime = Math.min(...results.times)
    results.maxTime = Math.max(...results.times)

    // Calculate category accuracies
    Object.keys(results.categories).forEach(category => {
      const cat = results.categories[category]
      cat.accuracy = cat.total > 0 ? (cat.correct / cat.total * 100) : 0
    })

    console.log(`   ✅ ${configName}:`)
    console.log(`      Overall: ${results.accuracy.toFixed(1)}% accuracy`)
    console.log(`      Speed: ${results.averageTime.toFixed(2)}ms avg (${results.minTime.toFixed(2)}-${results.maxTime.toFixed(2)}ms range)`)
    console.log(`      False Positives: ${results.falsePositives}, False Negatives: ${results.falseNegatives}`)

    return results
  }

  analyzeRealDifferences(v3Results, tier1Results, fullTieredResults) {
    console.log('\n\n🏆 REAL PERFORMANCE ANALYSIS')
    console.log('='.repeat(80))

    // Overall comparison table
    console.log('\n📊 HEAD-TO-HEAD COMPARISON:')
    console.log('┌─────────────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐')
    console.log('│ System                  │ Accuracy│ Speed   │ FalsePos│ FalseNeg│ Improve │')
    console.log('├─────────────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤')
    
    console.log(`│ v3.0 NPM Baseline       │ ${v3Results.accuracy.toFixed(1).padStart(7)}%│ ${v3Results.averageTime.toFixed(1).padStart(7)}ms│ ${v3Results.falsePositives.toString().padStart(7)} │ ${v3Results.falseNegatives.toString().padStart(7)} │ baseline│`)
    
    const tier1SpeedGain = ((v3Results.averageTime - tier1Results.averageTime) / v3Results.averageTime * 100).toFixed(0)
    const tier1AccGain = (tier1Results.accuracy - v3Results.accuracy).toFixed(1)
    console.log(`│ v4.0 Tier 1 ONLY        │ ${tier1Results.accuracy.toFixed(1).padStart(7)}%│ ${tier1Results.averageTime.toFixed(1).padStart(7)}ms│ ${tier1Results.falsePositives.toString().padStart(7)} │ ${tier1Results.falseNegatives.toString().padStart(7)} │ ${tier1SpeedGain}% faster│`)
    
    const fullAccGain = (fullTieredResults.accuracy - v3Results.accuracy).toFixed(1)
    const fullSpeedGain = ((v3Results.averageTime - fullTieredResults.averageTime) / v3Results.averageTime * 100).toFixed(0)
    console.log(`│ v4.0 FULL Tiered System │ ${fullTieredResults.accuracy.toFixed(1).padStart(7)}%│ ${fullTieredResults.averageTime.toFixed(1).padStart(7)}ms│ ${fullTieredResults.falsePositives.toString().padStart(7)} │ ${fullTieredResults.falseNegatives.toString().padStart(7)} │ +${fullAccGain}pp acc│`)
    
    console.log('└─────────────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘')

    // Expected vs Actual Analysis
    console.log('\n🎯 EXPECTED vs ACTUAL RESULTS:')
    
    console.log('\n   Tier 1 vs v3.0 (should be MUCH faster, similar accuracy):')
    const tier1SpeedWin = tier1Results.averageTime < v3Results.averageTime
    const tier1AccSimilar = Math.abs(tier1Results.accuracy - v3Results.accuracy) < 5
    console.log(`   ${tier1SpeedWin ? '✅' : '❌'} Speed: ${tier1SpeedGain}% faster (expected: >50% faster)`)
    console.log(`   ${tier1AccSimilar ? '✅' : '❌'} Accuracy: ${tier1AccGain > 0 ? '+' : ''}${tier1AccGain}pp difference (expected: similar)`)
    
    console.log('\n   Full Tiered vs v3.0 (should be MASSIVELY more accurate):')
    const fullAccMassive = fullTieredResults.accuracy > v3Results.accuracy + 10 // Expect 10+ point gain
    const fullSpeedGood = fullTieredResults.averageTime <= v3Results.averageTime * 2 // Not more than 2x slower
    console.log(`   ${fullAccMassive ? '✅' : '❌'} Accuracy: +${fullAccGain}pp (expected: >+10pp improvement)`)
    console.log(`   ${fullSpeedGood ? '✅' : '❌'} Speed: ${fullSpeedGain}% change (expected: reasonable cost)`)

    // Category breakdown for most important areas
    console.log('\n📋 CATEGORY BREAKDOWN (key problem areas):')
    const importantCategories = ['workplace_harassment', 'sophisticated_harassment', 'adversarial_attacks', 'professional']
    
    importantCategories.forEach(category => {
      if (v3Results.categories[category] && fullTieredResults.categories[category]) {
        const v3Acc = v3Results.categories[category].accuracy
        const fullAcc = fullTieredResults.categories[category].accuracy
        const improvement = (fullAcc - v3Acc).toFixed(1)
        
        console.log(`\n   ${category}:`)
        console.log(`   v3.0: ${v3Acc.toFixed(1)}% → v4.0 Full: ${fullAcc.toFixed(1)}% (${improvement > 0 ? '+' : ''}${improvement}pp)`)
        
        // Show worst missed cases if accuracy is low
        if (fullAcc < 85 && fullTieredResults.categories[category].cases.length > 0) {
          console.log(`   Worst misses:`)
          fullTieredResults.categories[category].cases.slice(0, 2).forEach((issue, i) => {
            console.log(`     ${i + 1}. "${issue.text}" (expected ${issue.expected}, got ${issue.actual})`)
          })
        }
      }
    })

    // Final verdict
    console.log('\n🏆 FINAL ASSESSMENT:')
    
    if (tier1SpeedWin && tier1AccSimilar && fullAccMassive) {
      console.log('✅ TIERED SYSTEM IS WORKING PROPERLY!')
      console.log('   - Tier 1 delivers speed advantage')
      console.log('   - Full system delivers massive accuracy boost')
      console.log('   - Ready for release consideration')
    } else {
      console.log('❌ TIERED SYSTEM HAS ISSUES!')
      if (!tier1SpeedWin) console.log('   - Tier 1 not fast enough vs v3.0')
      if (!tier1AccSimilar) console.log('   - Tier 1 accuracy problems vs v3.0') 
      if (!fullAccMassive) console.log('   - Full tiered system not accurate enough')
      console.log('   - Requires debugging and optimization')
    }

    return {
      tier1Working: tier1SpeedWin && tier1AccSimilar,
      fullTieredWorking: fullAccMassive,
      overallAssessment: tier1SpeedWin && tier1AccSimilar && fullAccMassive
    }
  }
}

// Main execution
async function main() {
  const tester = new ProperTieredTest()
  const results = await tester.runProperTest()
  
  if (results?.overallAssessment) {
    console.log('\n🚀 System working as expected - ready for release prep!')
  } else {
    console.log('\n⚠️  System needs debugging before release!')
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { ProperTieredTest } 