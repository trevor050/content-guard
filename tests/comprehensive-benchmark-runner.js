/**
 * Comprehensive Benchmark Runner for ContentGuard v4.5
 * 
 * Runs both primary (345 cases) and secondary (400+ cases) benchmarks
 * Total: 750+ test cases to prevent overfitting
 * Primary focus: False positive detection and prevention
 */

const { ContentGuard } = require('../index.js')
const { ContentGuardV4Turbo } = require('../lib/variants/v4-turbo.js')
const { ContentGuardV4Fast } = require('../lib/variants/v4-fast.js')  
const { ContentGuardV4Balanced } = require('../lib/variants/v4-balanced.js')
const ContentGuardV4Large = require('../lib/variants/v4-large.js')
const fs = require('fs')
const path = require('path')

// Import both benchmark suites
const { MassiveBenchmarkV4 } = require('./massive-benchmark-v3.js')
const secondaryBenchmark = require('./secondary-massive-benchmark.js')

class ComprehensiveBenchmarkRunner {
  constructor() {
    this.variants = {}
    this.results = {}
    this.combinedResults = {}
  }

  async initializeVariants() {
    console.log('🚀 Initializing all ContentGuard variants for comprehensive testing...')
    
    this.variants = {
      'v4.0-base': new ContentGuard('moderate', {
        debug: false,
        enableCaching: false
      }),
      'v4.5-turbo': new ContentGuardV4Turbo({
        debug: false,
        enableCaching: false
      }),
      'v4.5-fast': new ContentGuardV4Fast({
        debug: false,
        enableCaching: false
      }),
      'v4.5-balanced': new ContentGuardV4Balanced({
        debug: false,
        enableCaching: false
      }),
      'v4.5-large': new ContentGuardV4Large({
        debug: false,
        enableCaching: false
      })
    }
    
    console.log('✅ All variants initialized')
  }

  flattenTestCases(benchmarkData) {
    const testCases = []
    
    // Handle primary benchmark (from MassiveBenchmarkV4 instance)
    if (benchmarkData instanceof Array) {
      // Already flattened test cases
      return benchmarkData.map((testCase, index) => ({
        input: testCase.text,
        expected: testCase.expected,
        category: testCase.category,
        id: `${testCase.category}_${index}`
      }))
    }
    
    // Handle secondary benchmark (object with categories)
    for (const [categoryName, cases] of Object.entries(benchmarkData)) {
      if (Array.isArray(cases)) {
        cases.forEach((testCase, index) => {
          testCases.push({
            ...testCase,
            id: `${categoryName}_${index}`,
            category: testCase.category || categoryName.toLowerCase()
          })
        })
      }
    }
    
    return testCases
  }

  async runBenchmarkSuite(variantName, variant, testCases, suiteName) {
    console.log(`\n🧪 Testing ${variantName} on ${suiteName} (${testCases.length} cases)...`)
    
    const results = {
      variant: variantName,
      suite: suiteName,
      totalCases: testCases.length,
      correct: 0,
      falsePositives: 0,
      falseNegatives: 0,
      errors: 0,
      categoryResults: {},
      falsePositiveDetails: [],
      falseNegativeDetails: [],
      performanceStats: {
        totalTime: 0,
        avgTime: 0,
        minTime: Infinity,
        maxTime: 0
      }
    }

    // Track categories
    const categories = [...new Set(testCases.map(tc => tc.category))]
    categories.forEach(cat => {
      results.categoryResults[cat] = {
        total: 0,
        correct: 0,
        falsePositives: 0,
        falseNegatives: 0,
        accuracy: 0
      }
    })

    // Progress tracking
    let processed = 0
    const progressInterval = Math.max(1, Math.floor(testCases.length / 50))

    for (const testCase of testCases) {
      const startTime = performance.now()
      
      try {
        // Handle different variant interfaces
        let result
        if (variantName === 'v4.0-base') {
          result = await variant.analyze({
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: testCase.input
          })
        } else {
          result = await variant.analyze({
            message: testCase.input
          })
        }
        
        const endTime = performance.now()
        const processingTime = endTime - startTime
        
        // Update performance stats
        results.performanceStats.totalTime += processingTime
        results.performanceStats.minTime = Math.min(results.performanceStats.minTime, processingTime)
        results.performanceStats.maxTime = Math.max(results.performanceStats.maxTime, processingTime)
        
        // Determine if result is correct
        const predicted = result.isSpam ? 'TOXIC' : 'CLEAN'
        const expected = testCase.expected
        const isCorrect = predicted === expected
        
        // Update overall stats
        if (isCorrect) {
          results.correct++
        } else if (predicted === 'TOXIC' && expected === 'CLEAN') {
          results.falsePositives++
          results.falsePositiveDetails.push({
            input: testCase.input,
            category: testCase.category,
            score: result.score,
            flags: result.flags,
            processingTime: processingTime
          })
        } else if (predicted === 'CLEAN' && expected === 'TOXIC') {
          results.falseNegatives++
          results.falseNegativeDetails.push({
            input: testCase.input,
            category: testCase.category,
            score: result.score,
            processingTime: processingTime
          })
        }
        
        // Update category stats
        const category = testCase.category
        results.categoryResults[category].total++
        if (isCorrect) {
          results.categoryResults[category].correct++
        } else if (predicted === 'TOXIC' && expected === 'CLEAN') {
          results.categoryResults[category].falsePositives++
        } else if (predicted === 'CLEAN' && expected === 'TOXIC') {
          results.categoryResults[category].falseNegatives++
        }
        
      } catch (error) {
        results.errors++
        console.error(`Error testing case: ${testCase.input.substring(0, 50)}...`, error.message)
      }
      
      processed++
      if (processed % progressInterval === 0) {
        const progress = Math.round((processed / testCases.length) * 100)
        process.stdout.write(`\r   Progress: ${progress}% (${processed}/${testCases.length})`)
      }
    }

    // Calculate final stats
    results.accuracy = (results.correct / results.totalCases) * 100
    results.performanceStats.avgTime = results.performanceStats.totalTime / results.totalCases
    
    // Calculate category accuracies
    Object.keys(results.categoryResults).forEach(category => {
      const catResult = results.categoryResults[category]
      catResult.accuracy = catResult.total > 0 ? (catResult.correct / catResult.total) * 100 : 0
    })

    console.log(`\n   ✅ ${variantName} ${suiteName}: ${results.accuracy.toFixed(1)}% accuracy`)
    console.log(`   🟡 False Positives: ${results.falsePositives}`)
    console.log(`   🔴 False Negatives: ${results.falseNegatives}`)
    console.log(`   ⚡ Avg Time: ${results.performanceStats.avgTime.toFixed(1)}ms`)

    return results
  }

  async runComprehensiveAnalysis() {
    console.log('\n🔥 COMPREHENSIVE CONTENTGUARD BENCHMARK ANALYSIS')
    console.log('=' .repeat(80))
    console.log('Primary Benchmark: 345 sophisticated real-world cases')
    console.log('Secondary Benchmark: 400+ false-positive focused cases')
    console.log('Total: 750+ test cases to prevent overfitting\n')

    // Prepare test suites
    const benchmarkInstance = new MassiveBenchmarkV4()
    const primaryTestCases = this.flattenTestCases(benchmarkInstance.testCases)
    const secondaryTestCases = this.flattenTestCases(secondaryBenchmark)
    
    console.log(`📊 Primary Suite: ${primaryTestCases.length} cases`)
    console.log(`📊 Secondary Suite: ${secondaryTestCases.length} cases`)
    console.log(`📊 Total Cases: ${primaryTestCases.length + secondaryTestCases.length}`)

    // Run all variants on both suites
    for (const [variantName, variant] of Object.entries(this.variants)) {
      console.log(`\n🎯 TESTING ${variantName.toUpperCase()}`)
      console.log('-'.repeat(50))
      
      // Run primary benchmark
      const primaryResults = await this.runBenchmarkSuite(
        variantName, 
        variant, 
        primaryTestCases, 
        'Primary'
      )
      
      // Run secondary benchmark  
      const secondaryResults = await this.runBenchmarkSuite(
        variantName,
        variant,
        secondaryTestCases,
        'Secondary'
      )
      
      // Store results
      this.results[variantName] = {
        primary: primaryResults,
        secondary: secondaryResults,
        combined: this.calculateCombinedResults(primaryResults, secondaryResults)
      }
    }

    return this.generateComprehensiveReport()
  }

  calculateCombinedResults(primary, secondary) {
    return {
      totalCases: primary.totalCases + secondary.totalCases,
      correct: primary.correct + secondary.correct,
      falsePositives: primary.falsePositives + secondary.falsePositives,
      falseNegatives: primary.falseNegatives + secondary.falseNegatives,
      accuracy: ((primary.correct + secondary.correct) / (primary.totalCases + secondary.totalCases)) * 100,
      avgTime: (primary.performanceStats.avgTime + secondary.performanceStats.avgTime) / 2,
      primaryAccuracy: primary.accuracy,
      secondaryAccuracy: secondary.accuracy,
      falsePositiveRate: ((primary.falsePositives + secondary.falsePositives) / (primary.totalCases + secondary.totalCases)) * 100
    }
  }

  generateComprehensiveReport() {
    console.log('\n\n📊 COMPREHENSIVE BENCHMARK REPORT')
    console.log('=' .repeat(80))
    
    // Overall comparison table
    console.log('\n🏆 OVERALL PERFORMANCE COMPARISON (750+ test cases)')
    console.log('-'.repeat(90))
    console.log('   Variant       | Combined | Primary | Secondary | FP Rate | FN Count | Avg Time')
    console.log('   ' + '-'.repeat(88))
    
    const sortedVariants = Object.entries(this.results).sort((a, b) => 
      b[1].combined.accuracy - a[1].combined.accuracy
    )
    
    sortedVariants.forEach(([variantName, results]) => {
      const combined = results.combined
      const fpRate = combined.falsePositiveRate.toFixed(1)
      console.log(`   ${variantName.padEnd(13)} | ${combined.accuracy.toFixed(1).padStart(7)}% | ${combined.primaryAccuracy.toFixed(1).padStart(6)}% | ${combined.secondaryAccuracy.toFixed(1).padStart(8)}% | ${fpRate.padStart(6)}% | ${combined.falseNegatives.toString().padStart(7)} | ${combined.avgTime.toFixed(1).padStart(7)}ms`)
    })

    // False Positive Analysis (CRITICAL)
    console.log('\n🚨 FALSE POSITIVE ANALYSIS (CRITICAL)')
    console.log('-'.repeat(50))
    console.log('False positives are more damaging than false negatives!')
    
    const fpSorted = sortedVariants.sort((a, b) => 
      a[1].combined.falsePositives - b[1].combined.falsePositives
    )
    
    fpSorted.forEach(([variantName, results]) => {
      const combined = results.combined
      console.log(`${variantName}: ${combined.falsePositives} FPs (${combined.falsePositiveRate.toFixed(1)}% rate)`)
      
      // Show top false positive examples for v4.5-large
      if (variantName === 'v4.5-large' && results.secondary.falsePositiveDetails.length > 0) {
        console.log('   Top False Positives:')
        results.secondary.falsePositiveDetails.slice(0, 3).forEach((fp, i) => {
          console.log(`   ${i+1}. "${fp.input.substring(0, 60)}..." (score: ${fp.score})`)
        })
      }
    })

    // Overfitting Detection
    console.log('\n🔍 OVERFITTING DETECTION')
    console.log('-'.repeat(30))
    
    Object.entries(this.results).forEach(([variantName, results]) => {
      const primaryAcc = results.primary.accuracy
      const secondaryAcc = results.secondary.accuracy
      const gap = primaryAcc - secondaryAcc
      
      const overfittingStatus = gap > 10 ? '🚨 POSSIBLE OVERFITTING' : 
                               gap > 5 ? '⚠️  Monitor closely' : '✅ Good generalization'
      
      console.log(`${variantName}: ${gap.toFixed(1)}% gap ${overfittingStatus}`)
    })

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS')
    console.log('-'.repeat(20))
    
    const bestOverall = sortedVariants[0]
    const lowestFP = fpSorted[0]
    
    console.log(`🏆 Best Overall: ${bestOverall[0]} (${bestOverall[1].combined.accuracy.toFixed(1)}% accuracy)`)
    console.log(`🛡️  Lowest False Positives: ${lowestFP[0]} (${lowestFP[1].combined.falsePositives} FPs)`)
    
    if (this.results['v4.5-large'].combined.falsePositiveRate > 2.0) {
      console.log(`⚠️  v4.5-large has high false positive rate (${this.results['v4.5-large'].combined.falsePositiveRate.toFixed(1)}%)`)
      console.log('   → Focus on reducing false positives before accuracy improvements')
    }
    
    if (this.results['v4.5-large'].combined.accuracy < 85) {
      console.log(`📈 v4.5-large accuracy: ${this.results['v4.5-large'].combined.accuracy.toFixed(1)}% (target: 85%)`)
      console.log('   → Continue targeted improvements while monitoring false positives')
    }

    return this.results
  }

  async saveResults(filename = 'comprehensive-benchmark-results.json') {
    const resultsPath = path.join(__dirname, filename)
    await fs.promises.writeFile(resultsPath, JSON.stringify(this.results, null, 2))
    console.log(`\n💾 Results saved to: ${resultsPath}`)
  }
}

// Main execution
async function runComprehensiveBenchmark() {
  const runner = new ComprehensiveBenchmarkRunner()
  
  try {
    await runner.initializeVariants()
    const results = await runner.runComprehensiveAnalysis()
    await runner.saveResults()
    
    console.log('\n✅ Comprehensive benchmark completed!')
    console.log('\nNext steps:')
    console.log('1. If false positive rate > 2%, focus on reducing FPs')
    console.log('2. If accuracy < 85%, continue targeted improvements')
    console.log('3. Monitor for overfitting between primary/secondary results')
    
  } catch (error) {
    console.error('❌ Comprehensive benchmark failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runComprehensiveBenchmark()
}

module.exports = { ComprehensiveBenchmarkRunner } 