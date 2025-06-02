/**
 * COMPREHENSIVE TORTURE TEST BENCHMARK for ContentGuard v4.5
 * 
 * This is the ultimate battle-tested benchmark with 1,250+ challenging cases
 * Designed to push accuracy from 48% to 85%+ and maintain <2% false positives
 * 
 * Test Structure:
 * - Primary Suite: 345 sophisticated real-world cases  
 * - Secondary Suite: 1000+ edge cases, sarcasm, false positive traps
 * - Total: 1,345+ cases for comprehensive testing
 */

const ContentGuardV4Large = require('../lib/variants/v4-large')
const primaryBenchmarkCases = require('./primary-benchmark')
const secondaryBenchmarkCases = require('./secondary-massive-benchmark')

class ComprehensiveBenchmark {
  constructor() {
    this.variants = {
      'v4.5-large': new ContentGuardV4Large()
    }
    this.results = {}
  }

  async runComprehensiveBenchmark() {
    console.log('🚀 ContentGuard COMPREHENSIVE TORTURE TEST BENCHMARK')
    console.log('==================================================')
    console.log('🎯 Target: 85%+ accuracy with <2% false positives')
    console.log('📊 Testing against 1,345+ challenging real-world cases')
    console.log('')

    for (const [variantName, variant] of Object.entries(this.variants)) {
      console.log(`\n🧪 Testing ${variantName}...`)
      await this.testVariant(variantName, variant)
    }

    this.printFinalResults()
  }

  async testVariant(variantName, variant) {
    console.log('🔄 Initializing ML plugins...')
    await variant.initializeMLPlugins()
    
    const startTime = Date.now()
    
    // Test Primary Suite (sophisticated real-world cases)
    console.log('\n📋 Primary Suite (Real-world sophistication)...')
    const primaryResults = await this.runTestSuite(variant, this.getPrimaryTestCases(), 'primary')
    
    // Test Secondary Suite (massive edge cases and false positive traps)  
    console.log('\n📋 Secondary Suite (Massive torture test)...')
    const secondaryResults = await this.runTestSuite(variant, this.getSecondaryTestCases(), 'secondary')
    
    const totalTime = Date.now() - startTime

    // Calculate combined metrics
    const combinedResults = this.calculateCombinedMetrics(primaryResults, secondaryResults)
    
    this.results[variantName] = {
      ...combinedResults,
      totalTime,
      primary: primaryResults,
      secondary: secondaryResults
    }

    this.printVariantResults(variantName, this.results[variantName])
  }

  getPrimaryTestCases() {
    // Convert primary benchmark to our format
    if (primaryBenchmarkCases && primaryBenchmarkCases.length) {
      return primaryBenchmarkCases
    }
    
    // Fallback primary cases if file doesn't exist
    return [
      {
        input: "You're an absolute idiot and should quit your job immediately",
        expected: "TOXIC",
        category: "harassment"
      },
      {
        input: "This code review feedback is constructive and helpful for improvement",
        expected: "CLEAN", 
        category: "professional"
      },
      {
        input: "The way this algorithm performs is absolutely killing our response times",
        expected: "CLEAN",
        category: "technical"
      },
      // Add more sophisticated primary cases...
    ]
  }

  getSecondaryTestCases() {
    const allSecondaryTests = []
    
    // Combine all categories from secondary benchmark
    Object.values(secondaryBenchmarkCases).forEach(category => {
      if (Array.isArray(category)) {
        allSecondaryTests.push(...category)
      }
    })

    console.log(`📊 Loaded ${allSecondaryTests.length} secondary test cases`)
    return allSecondaryTests
  }

  async runTestSuite(variant, testCases, suiteName) {
    let correct = 0
    let total = testCases.length
    let truePositives = 0
    let falsePositives = 0
    let trueNegatives = 0
    let falseNegatives = 0
    let totalProcessingTime = 0
    let errors = 0

    const categoryStats = {}
    const failedCases = []

    console.log(`   Testing ${total} cases...`)

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      
      if (i % 100 === 0 && i > 0) {
        console.log(`   Progress: ${i}/${total} (${((i/total)*100).toFixed(1)}%)`)
      }

      try {
        const startTime = performance.now()
        const result = await variant.analyze(testCase.input)
        const processingTime = performance.now() - startTime
        totalProcessingTime += processingTime

        const predicted = result.isSpam ? 'TOXIC' : 'CLEAN'
        const actual = testCase.expected
        const isCorrect = predicted === actual

        if (isCorrect) {
          correct++
        } else {
          failedCases.push({
            input: testCase.input.substring(0, 100),
            expected: actual,
            predicted: predicted,
            category: testCase.category,
            score: result.score,
            confidence: result.confidence
          })
        }

        // Calculate confusion matrix
        if (actual === 'TOXIC' && predicted === 'TOXIC') truePositives++
        else if (actual === 'CLEAN' && predicted === 'TOXIC') falsePositives++
        else if (actual === 'CLEAN' && predicted === 'CLEAN') trueNegatives++
        else if (actual === 'TOXIC' && predicted === 'CLEAN') falseNegatives++

        // Category statistics
        const category = testCase.category || 'unknown'
        if (!categoryStats[category]) {
          categoryStats[category] = { correct: 0, total: 0 }
        }
        categoryStats[category].total++
        if (isCorrect) categoryStats[category].correct++

      } catch (error) {
        console.error(`Error processing test case: ${error.message}`)
        errors++
      }
    }

    const accuracy = (correct / total) * 100
    const precision = truePositives / (truePositives + falsePositives) || 0
    const recall = truePositives / (truePositives + falseNegatives) || 0
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0
    const falsePositiveRate = (falsePositives / (falsePositives + trueNegatives)) * 100
    const avgProcessingTime = totalProcessingTime / total

    return {
      suiteName,
      total,
      correct,
      accuracy,
      precision,
      recall,
      f1Score,
      falsePositiveRate,
      avgProcessingTime,
      errors,
      categoryStats,
      failedCases: failedCases.slice(0, 10), // Keep first 10 failures for analysis
      confusionMatrix: {
        truePositives,
        falsePositives,
        trueNegatives,
        falseNegatives
      }
    }
  }

  calculateCombinedMetrics(primaryResults, secondaryResults) {
    const totalCorrect = primaryResults.correct + secondaryResults.correct
    const totalTests = primaryResults.total + secondaryResults.total
    const combinedAccuracy = (totalCorrect / totalTests) * 100

    const totalTruePositives = primaryResults.confusionMatrix.truePositives + secondaryResults.confusionMatrix.truePositives
    const totalFalsePositives = primaryResults.confusionMatrix.falsePositives + secondaryResults.confusionMatrix.falsePositives
    const totalTrueNegatives = primaryResults.confusionMatrix.trueNegatives + secondaryResults.confusionMatrix.trueNegatives
    const totalFalseNegatives = primaryResults.confusionMatrix.falseNegatives + secondaryResults.confusionMatrix.falseNegatives

    const combinedPrecision = totalTruePositives / (totalTruePositives + totalFalsePositives) || 0
    const combinedRecall = totalTruePositives / (totalTruePositives + totalFalseNegatives) || 0
    const combinedF1 = 2 * (combinedPrecision * combinedRecall) / (combinedPrecision + combinedRecall) || 0
    const combinedFalsePositiveRate = (totalFalsePositives / (totalFalsePositives + totalTrueNegatives)) * 100

    return {
      combinedAccuracy,
      combinedPrecision,
      combinedRecall,
      combinedF1,
      combinedFalsePositiveRate,
      totalTests,
      totalCorrect
    }
  }

  printVariantResults(variantName, results) {
    console.log(`\n🎯 ${variantName} COMPREHENSIVE RESULTS`)
    console.log('=' .repeat(50))
    
    // Combined Results
    console.log('📊 COMBINED PERFORMANCE:')
    console.log(`   🎯 Overall Accuracy: ${results.combinedAccuracy.toFixed(2)}% (Target: 85%+)`)
    console.log(`   🚫 False Positive Rate: ${results.combinedFalsePositiveRate.toFixed(2)}% (Target: <2%)`)
    console.log(`   📏 Precision: ${results.combinedPrecision.toFixed(3)}`)
    console.log(`   📏 Recall: ${results.combinedRecall.toFixed(3)}`)
    console.log(`   📏 F1-Score: ${results.combinedF1.toFixed(3)}`)
    console.log(`   📊 Total Cases: ${results.totalTests}`)
    console.log(`   ✅ Correct: ${results.totalCorrect}`)
    
    // Suite Breakdown
    console.log('\n📋 SUITE BREAKDOWN:')
    console.log(`   Primary (Real-world): ${results.primary.accuracy.toFixed(2)}% (${results.primary.correct}/${results.primary.total})`)
    console.log(`   Secondary (Torture): ${results.secondary.accuracy.toFixed(2)}% (${results.secondary.correct}/${results.secondary.total})`)
    
    // Detailed Category Analysis
    console.log('\n🔍 CATEGORY ANALYSIS:')
    console.log('   PRIMARY SUITE CATEGORIES:')
    Object.entries(results.primary.categoryStats).forEach(([category, stats]) => {
      const accuracy = ((stats.correct / stats.total) * 100).toFixed(1)
      const status = accuracy >= 85 ? '✅' : accuracy >= 70 ? '⚠️' : '🚨'
      console.log(`     ${status} ${category}: ${accuracy}% (${stats.correct}/${stats.total})`)
    })
    
    console.log('   SECONDARY SUITE CATEGORIES:')
    Object.entries(results.secondary.categoryStats).forEach(([category, stats]) => {
      const accuracy = ((stats.correct / stats.total) * 100).toFixed(1)
      const status = accuracy >= 85 ? '✅' : accuracy >= 70 ? '⚠️' : '🚨'
      console.log(`     ${status} ${category}: ${accuracy}% (${stats.correct}/${stats.total})`)
    })
    
    // Failed Cases Analysis
    console.log('\n❌ FAILED CASES ANALYSIS:')
    console.log('   PRIMARY SUITE FAILURES:')
    results.primary.failedCases.slice(0, 5).forEach((failure, i) => {
      console.log(`     ${i+1}. [${failure.category}] Expected: ${failure.expected}, Got: ${failure.predicted}`)
      console.log(`        "${failure.input}"`)
    })
    
    console.log('   SECONDARY SUITE FAILURES:')
    results.secondary.failedCases.slice(0, 5).forEach((failure, i) => {
      console.log(`     ${i+1}. [${failure.category}] Expected: ${failure.expected}, Got: ${failure.predicted}`)
      console.log(`        "${failure.input}"`)
    })
    
    // Performance
    console.log('\n⚡ PERFORMANCE:')
    console.log(`   ⏱️  Total Time: ${results.totalTime}ms`)
    console.log(`   ⏱️  Avg Time: ${results.primary.avgProcessingTime.toFixed(2)}ms/case`)
    console.log(`   🚀 Throughput: ${Math.round(1000 / results.primary.avgProcessingTime)} analyses/sec`)
    
    // Alert for critical metrics
    if (results.combinedFalsePositiveRate > 2.0) {
      console.log(`\n🚨 CRITICAL: False positive rate ${results.combinedFalsePositiveRate.toFixed(2)}% exceeds 2% target!`)
    }
    
    if (results.combinedAccuracy < 85) {
      console.log(`\n⚠️  WARNING: Accuracy ${results.combinedAccuracy.toFixed(2)}% below 85% target`)
      console.log(`   📈 Need +${(85 - results.combinedAccuracy).toFixed(2)}% improvement`)
    }

    // Success metrics
    if (results.combinedFalsePositiveRate <= 2.0 && results.combinedAccuracy >= 85) {
      console.log(`\n🎉 SUCCESS: Achieved production targets!`)
      console.log(`   ✅ False positives: ${results.combinedFalsePositiveRate.toFixed(2)}% ≤ 2%`)
      console.log(`   ✅ Accuracy: ${results.combinedAccuracy.toFixed(2)}% ≥ 85%`)
    }
  }

  printFinalResults() {
    console.log('\n🏆 COMPREHENSIVE BENCHMARK SUMMARY')
    console.log('=' .repeat(60))
    
    Object.entries(this.results).forEach(([variantName, results]) => {
      const status = results.combinedFalsePositiveRate <= 2.0 && results.combinedAccuracy >= 85 
        ? '🎉 PRODUCTION READY' 
        : results.combinedFalsePositiveRate <= 2.0 
          ? '⚠️  NEEDS ACCURACY IMPROVEMENT'
          : '🚨 NEEDS FALSE POSITIVE FIX'
      
      console.log(`${variantName}: ${results.combinedAccuracy.toFixed(2)}% accuracy, ${results.combinedFalsePositiveRate.toFixed(2)}% FP - ${status}`)
    })

    console.log('\n🎯 TARGET METRICS:')
    console.log('   📈 Accuracy: 85%+ (for production deployment)')
    console.log('   🚫 False Positives: <2% (critical for user experience)')
    console.log('   📊 Total Test Cases: 1,345+ (comprehensive torture test)')
    console.log('\n✨ Ready for production when both targets are met!')
  }
}

// Run the comprehensive benchmark
async function runBenchmark() {
  const benchmark = new ComprehensiveBenchmark()
  await benchmark.runComprehensiveBenchmark()
}

if (require.main === module) {
  runBenchmark().catch(console.error)
}

module.exports = ComprehensiveBenchmark 