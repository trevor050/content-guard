#!/usr/bin/env node

/**
 * 🧪 ContentGuard v4.7 Variants Comprehensive Benchmark Suite
 * 
 * Tests all ContentGuard v4.7 variants against the Massive Benchmark v3 test cases:
 * - v4.7-fast: Ultra-fast processing with minimal accuracy loss
 * - v4.7-balanced: Optimal speed-accuracy tradeoff
 * - v4.7-large: Maximum accuracy with comprehensive analysis
 * - v4.7-turbo: Extreme speed variant for real-time
 * - v4.0-base: Original base ContentGuard v4.0
 * 
 * Provides detailed performance comparison including:
 * - Accuracy per category and overall
 * - Speed and throughput metrics
 * - False positive/negative analysis
 * - Memory usage and scalability
 * - Detailed error analysis and recommendations
 */

const fs = require('fs')
const path = require('path')

// Import all variants
const { ContentGuard, presets } = require('../index.js')
const { ContentGuardVariantManager } = require('../lib/variant-manager.js')
const { ContentGuardV4Fast } = require('../lib/variants/v4-fast.js')
const { ContentGuardV4Balanced } = require('../lib/variants/v4-balanced.js')
const ContentGuardV4Large = require('../lib/variants/v4-large.js')
const { ContentGuardV4Turbo } = require('../lib/variants/v4-turbo.js')

// Import the test cases from MassiveBenchmarkV4 class
const { MassiveBenchmarkV4 } = require('./massive-benchmark-v3.js')

class ContentGuardV4VariantTester {
  constructor() {
    this.variants = {}
    this.testCases = []
    this.results = {}
    this.initializeVariants()
    this.loadTestCases()
  }

  initializeVariants() {
    console.log('🚀 Initializing ContentGuard v4.7 variants...')
    
    // Base v4.0 ContentGuard
    this.variants['v4.0-base'] = new ContentGuard('moderate', {
      debug: false,
      enableCaching: false
    })

    // v4.7 Turbo variant (new - ultra-fast for massive real-time)
    this.variants['v4.7-turbo'] = new ContentGuardV4Turbo({
      debug: false,
      enableCaching: false
    })

    // v4.7 Fast variant (improved)
    this.variants['v4.7-fast'] = new ContentGuardV4Fast({
      debug: false,
      enableCaching: false
    })

    // v4.7 Balanced variant (enhanced)
    this.variants['v4.7-balanced'] = new ContentGuardV4Balanced({
      debug: false,
      enableCaching: false
    })

    // v4.7 Large variant
    this.variants['v4.7-large'] = new ContentGuardV4Large({
      debug: false,
      enableCaching: false
    })

    console.log(`✅ Initialized ${Object.keys(this.variants).length} variants`)
  }

  loadTestCases() {
    console.log('📋 Loading Massive Benchmark v3 test cases...')
    
    // Create an instance of MassiveBenchmarkV4 to get the test cases
    const benchmarkInstance = new MassiveBenchmarkV4()
    this.testCases = benchmarkInstance.testCases
    
    console.log(`✅ Loaded ${this.testCases.length} test cases across ${Object.keys(benchmarkInstance.results.categories).length} categories`)
  }

  async runComprehensiveBenchmark(variantFilter = null) {
    console.log('\n🔥 ContentGuard v4.7 Variants Comprehensive Benchmark')
    console.log('=' .repeat(80))
    console.log(`Testing ${this.testCases.length} sophisticated real-world scenarios...`)
    console.log('🎯 Target: Compare all variants for accuracy, speed, and reliability')
    console.log()

    const variantsToTest = variantFilter ? 
      variantFilter.split(',').map(v => v.trim()) : 
      Object.keys(this.variants)

    // Test each variant
    for (const variantName of variantsToTest) {
      if (!this.variants[variantName]) {
        console.log(`❌ Unknown variant: ${variantName}`)
        continue
      }

      console.log(`\n🧪 Testing ${variantName.toUpperCase()}...`)
      this.results[variantName] = await this.testVariant(variantName, this.variants[variantName])
    }

    // Generate comprehensive comparison report
    this.generateComparisonReport(variantsToTest)
  }

  async testVariant(variantName, variant) {
    console.log(`\n📊 Running ${variantName} against ${this.testCases.length} test cases...`)

    const results = {
      variantName,
      total: 0,
      correct: 0,
      incorrect: 0,
      falsePositives: 0,
      falseNegatives: 0,
      issues: [],
      categories: {},
      timings: [],
      totalTime: 0,
      averageTime: 0,
      minTime: Infinity,
      maxTime: 0,
      memoryUsage: {
        start: process.memoryUsage(),
        peak: process.memoryUsage(),
        end: null
      }
    }

    // Initialize category results
    const categories = [...new Set(this.testCases.map(tc => tc.category))]
    categories.forEach(category => {
      results.categories[category] = {
        total: 0,
        correct: 0,
        incorrect: 0,
        falsePositives: 0,
        falseNegatives: 0,
        issues: [],
        timings: []
      }
    })

    // Progress tracking
    const progressBar = Array(50).fill('░')
    let completed = 0

    for (const testCase of this.testCases) {
      // Update progress
      const progress = Math.floor((completed / this.testCases.length) * 50)
      progressBar.fill('▓', 0, progress)
      process.stdout.write(`\r   Progress: [${progressBar.join('')}] ${completed}/${this.testCases.length}`)

      completed++
      
      // Time the analysis
      const startTime = performance.now()
      let result
      
      try {
        // Handle different variant interfaces
        if (variantName === 'v4.0-base') {
          result = await variant.analyze({
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: testCase.text
          })
        } else {
          result = await variant.analyze({
            message: testCase.text
          })
        }
      } catch (error) {
        console.log(`\n❌ Error testing ${variantName} on case: ${testCase.text.substring(0, 50)}...`)
        console.log(`   Error: ${error.message}`)
        continue
      }
      
      const endTime = performance.now()
      const analysisTime = endTime - startTime
      
      // Update timing stats
      results.timings.push(analysisTime)
      results.totalTime += analysisTime
      results.minTime = Math.min(results.minTime, analysisTime)
      results.maxTime = Math.max(results.maxTime, analysisTime)
      
      // Track memory usage
      const currentMemory = process.memoryUsage()
      if (currentMemory.heapUsed > results.memoryUsage.peak.heapUsed) {
        results.memoryUsage.peak = currentMemory
      }

      // Determine if the result is spam
      const isSpam = result.isSpam !== undefined ? result.isSpam : (result.score >= (result.spamThreshold || 5))
      const expected = testCase.expected === 'SPAM'
      
      results.total++
      results.categories[testCase.category].total++
      results.categories[testCase.category].timings.push(analysisTime)

      if (testCase.expected === 'MIXED') {
        // For mixed cases, just record what happened without judging correctness
        const issue = {
          text: this.truncateText(testCase.text),
          expected: 'MIXED',
          actual: isSpam ? 'SPAM' : 'CLEAN',
          score: result.score || 0,
          context: testCase.context || 'general',
          analysisTime: analysisTime.toFixed(2),
          category: testCase.category
        }
        results.categories[testCase.category].issues.push(issue)
        continue
      }

      if (isSpam === expected) {
        results.correct++
        results.categories[testCase.category].correct++
      } else {
        results.incorrect++
        results.categories[testCase.category].incorrect++

        const issue = {
          text: this.truncateText(testCase.text),
          expected: testCase.expected,
          actual: isSpam ? 'SPAM' : 'CLEAN',
          score: result.score || 0,
          flags: result.flags?.slice(0, 3) || [],
          context: testCase.context || 'general',
          analysisTime: analysisTime.toFixed(2),
          category: testCase.category,
          confidence: result.confidence,
          recommendation: result.recommendation
        }

        if (isSpam && !expected) {
          results.falsePositives++
          results.categories[testCase.category].falsePositives++
          issue.type = 'FALSE_POSITIVE'
        } else if (!isSpam && expected) {
          results.falseNegatives++
          results.categories[testCase.category].falseNegatives++
          issue.type = 'FALSE_NEGATIVE'
        }

        results.issues.push(issue)
        results.categories[testCase.category].issues.push(issue)
      }
    }

    console.log() // New line after progress

    // Calculate final metrics
    results.averageTime = results.totalTime / results.total
    results.accuracy = results.total > 0 ? (results.correct / results.total * 100) : 0
    results.memoryUsage.end = process.memoryUsage()

    // Calculate throughput
    results.throughput = 1000 / results.averageTime // ops per second

    // Calculate percentiles
    const sortedTimings = [...results.timings].sort((a, b) => a - b)
    results.percentiles = {
      p50: sortedTimings[Math.floor(sortedTimings.length * 0.5)],
      p95: sortedTimings[Math.floor(sortedTimings.length * 0.95)],
      p99: sortedTimings[Math.floor(sortedTimings.length * 0.99)]
    }

    // Print summary
    console.log(`   🎯 Accuracy: ${results.accuracy.toFixed(1)}% (${results.correct}/${results.total})`)
    console.log(`   🟡 False Positives: ${results.falsePositives}`)
    console.log(`   🔴 False Negatives: ${results.falseNegatives}`)
    console.log(`   ⚡ Performance: Avg ${results.averageTime.toFixed(1)}ms | Min ${results.minTime.toFixed(1)}ms | Max ${results.maxTime.toFixed(1)}ms`)
    console.log(`   🚀 Throughput: ${results.throughput.toFixed(0)} ops/sec`)

    return results
  }

  generateComparisonReport(variantsToTest) {
    console.log('\n\n📊 COMPREHENSIVE VARIANT COMPARISON REPORT')
    console.log('=' .repeat(80))

    // Overall performance table
    this.generateOverallPerformanceTable(variantsToTest)
    
    // Category-by-category analysis
    this.generateCategoryAnalysis(variantsToTest)
    
    // Speed and performance analysis
    this.generateSpeedAnalysis(variantsToTest)
    
    // Memory usage analysis
    this.generateMemoryAnalysis(variantsToTest)
    
    // Error analysis
    this.generateErrorAnalysis(variantsToTest)
    
    // Recommendations
    this.generateRecommendations(variantsToTest)
  }

  generateOverallPerformanceTable(variantsToTest) {
    console.log('\n🏆 OVERALL PERFORMANCE COMPARISON')
    console.log('-' .repeat(80))
    
    // Create comparison table
    const tableData = []
    const headers = ['Variant', 'Accuracy', 'Avg Speed', 'Throughput', 'False Pos', 'False Neg', 'Memory']
    
    variantsToTest.forEach(variantName => {
      if (!this.results[variantName]) return
      
      const result = this.results[variantName]
      const memoryDelta = result.memoryUsage.end.heapUsed - result.memoryUsage.start.heapUsed
      
      tableData.push([
        variantName,
        `${result.accuracy.toFixed(1)}%`,
        `${result.averageTime.toFixed(1)}ms`,
        `${result.throughput.toFixed(0)} ops/sec`,
        result.falsePositives.toString(),
        result.falseNegatives.toString(),
        `${(memoryDelta / 1024 / 1024).toFixed(1)}MB`
      ])
    })
    
    this.printTable(headers, tableData)
  }

  generateCategoryAnalysis(variantsToTest) {
    console.log('\n\n📈 CATEGORY-BY-CATEGORY ANALYSIS')
    console.log('-' .repeat(80))

    // Get all categories
    const allCategories = new Set()
    Object.values(this.results).forEach(result => {
      Object.keys(result.categories).forEach(cat => allCategories.add(cat))
    })

    Array.from(allCategories).forEach(category => {
      console.log(`\n🔍 Category: ${category.toUpperCase()}`)
      console.log('-' .repeat(50))
      
      const categoryData = []
      const headers = ['Variant', 'Accuracy', 'Total', 'FP', 'FN', 'Avg Time']
      
      variantsToTest.forEach(variantName => {
        if (!this.results[variantName]?.categories[category]) return
        
        const catResult = this.results[variantName].categories[category]
        const accuracy = catResult.total > 0 ? (catResult.correct / catResult.total * 100) : 0
        const avgTime = catResult.timings.length > 0 ? 
          (catResult.timings.reduce((a, b) => a + b, 0) / catResult.timings.length) : 0
        
        categoryData.push([
          variantName,
          `${accuracy.toFixed(1)}%`,
          catResult.total.toString(),
          catResult.falsePositives.toString(),
          catResult.falseNegatives.toString(),
          `${avgTime.toFixed(1)}ms`
        ])
      })
      
      this.printTable(headers, categoryData)
    })
  }

  generateSpeedAnalysis(variantsToTest) {
    console.log('\n\n⚡ SPEED & PERFORMANCE ANALYSIS')
    console.log('-' .repeat(80))
    
    const speedData = []
    const headers = ['Variant', 'Min', 'Avg', 'Max', 'P50', 'P95', 'P99', 'Throughput']
    
    variantsToTest.forEach(variantName => {
      if (!this.results[variantName]) return
      
      const result = this.results[variantName]
      speedData.push([
        variantName,
        `${result.minTime.toFixed(1)}ms`,
        `${result.averageTime.toFixed(1)}ms`,
        `${result.maxTime.toFixed(1)}ms`,
        `${result.percentiles.p50.toFixed(1)}ms`,
        `${result.percentiles.p95.toFixed(1)}ms`,
        `${result.percentiles.p99.toFixed(1)}ms`,
        `${result.throughput.toFixed(0)} ops/sec`
      ])
    })
    
    this.printTable(headers, speedData)

    // Speed analysis insights
    console.log('\n💡 Speed Analysis Insights:')
    const fastestVariant = variantsToTest.reduce((fastest, current) => {
      if (!this.results[current] || !this.results[fastest]) return current
      return this.results[current].averageTime < this.results[fastest].averageTime ? current : fastest
    })
    const slowestVariant = variantsToTest.reduce((slowest, current) => {
      if (!this.results[current] || !this.results[slowest]) return current
      return this.results[current].averageTime > this.results[slowest].averageTime ? current : slowest
    })
    
    console.log(`   🏃 Fastest: ${fastestVariant} (${this.results[fastestVariant]?.averageTime.toFixed(1)}ms avg)`)
    console.log(`   🐌 Slowest: ${slowestVariant} (${this.results[slowestVariant]?.averageTime.toFixed(1)}ms avg)`)
    
    if (this.results[fastestVariant] && this.results[slowestVariant]) {
      const speedup = this.results[slowestVariant].averageTime / this.results[fastestVariant].averageTime
      console.log(`   📊 Speed difference: ${speedup.toFixed(1)}x faster`)
    }
  }

  generateMemoryAnalysis(variantsToTest) {
    console.log('\n\n💾 MEMORY USAGE ANALYSIS')
    console.log('-' .repeat(80))
    
    const memoryData = []
    const headers = ['Variant', 'Start (MB)', 'Peak (MB)', 'End (MB)', 'Delta (MB)', 'Efficiency']
    
    variantsToTest.forEach(variantName => {
      if (!this.results[variantName]) return
      
      const result = this.results[variantName]
      const startMB = result.memoryUsage.start.heapUsed / 1024 / 1024
      const peakMB = result.memoryUsage.peak.heapUsed / 1024 / 1024
      const endMB = result.memoryUsage.end.heapUsed / 1024 / 1024
      const deltaMB = endMB - startMB
      const efficiency = result.total / deltaMB // analyses per MB
      
      memoryData.push([
        variantName,
        startMB.toFixed(1),
        peakMB.toFixed(1),
        endMB.toFixed(1),
        deltaMB.toFixed(1),
        `${efficiency.toFixed(0)} analyses/MB`
      ])
    })
    
    this.printTable(headers, memoryData)
  }

  generateErrorAnalysis(variantsToTest) {
    console.log('\n\n🔍 DETAILED ERROR ANALYSIS')
    console.log('-' .repeat(80))

    variantsToTest.forEach(variantName => {
      if (!this.results[variantName]) return
      
      console.log(`\n💥 ${variantName.toUpperCase()} Error Breakdown:`)
      
      const result = this.results[variantName]
      const falsePositives = result.issues.filter(i => i.type === 'FALSE_POSITIVE').slice(0, 3)
      const falseNegatives = result.issues.filter(i => i.type === 'FALSE_NEGATIVE').slice(0, 3)
      
      if (falsePositives.length > 0) {
        console.log(`\n   🟡 TOP FALSE POSITIVES (${result.falsePositives} total):`)
        falsePositives.forEach((issue, i) => {
          console.log(`   ${i + 1}. "${issue.text}" (score: ${issue.score})`)
          console.log(`      Category: ${issue.category} | Time: ${issue.analysisTime}ms`)
          if (issue.flags?.length > 0) {
            console.log(`      Triggers: ${issue.flags.join(', ')}`)
          }
        })
      }
      
      if (falseNegatives.length > 0) {
        console.log(`\n   🔴 TOP FALSE NEGATIVES (${result.falseNegatives} total):`)
        falseNegatives.forEach((issue, i) => {
          console.log(`   ${i + 1}. "${issue.text}" (score: ${issue.score})`)
          console.log(`      Category: ${issue.category} | Time: ${issue.analysisTime}ms`)
        })
      }
    })
  }

  generateRecommendations(variantsToTest) {
    console.log('\n\n🎯 VARIANT RECOMMENDATIONS')
    console.log('-' .repeat(80))

    // Find best performer in each category
    const bestAccuracy = variantsToTest.reduce((best, current) => {
      if (!this.results[current] || !this.results[best]) return current
      return this.results[current].accuracy > this.results[best].accuracy ? current : best
    })

    const bestSpeed = variantsToTest.reduce((best, current) => {
      if (!this.results[current] || !this.results[best]) return current
      return this.results[current].averageTime < this.results[best].averageTime ? current : best
    })

    const bestBalance = variantsToTest.reduce((best, current) => {
      if (!this.results[current] || !this.results[best]) return current
      const currentScore = this.results[current].accuracy / this.results[current].averageTime
      const bestScore = this.results[best].accuracy / this.results[best].averageTime
      return currentScore > bestScore ? current : best
    })

    console.log('\n🏆 PERFORMANCE LEADERS:')
    console.log(`   🎯 Best Accuracy: ${bestAccuracy} (${this.results[bestAccuracy]?.accuracy.toFixed(1)}%)`)
    console.log(`   ⚡ Best Speed: ${bestSpeed} (${this.results[bestSpeed]?.averageTime.toFixed(1)}ms)`)
    console.log(`   ⚖️ Best Balance: ${bestBalance} (accuracy/speed ratio)`)

    console.log('\n📋 USE CASE RECOMMENDATIONS:')
    console.log('   🚀 High-Volume/Real-time: Use v4.7-fast for maximum throughput')
    console.log('   🏢 Production Applications: Use v4.7-balanced for best overall performance')
    console.log('   🔬 Critical Moderation: Use v4.7-large for maximum accuracy')
    console.log('   🔄 Hybrid Strategy: Use variant auto-selection based on content complexity')

    console.log('\n⚠️ AREAS FOR IMPROVEMENT:')
    const worstAccuracy = variantsToTest.reduce((worst, current) => {
      if (!this.results[current] || !this.results[worst]) return current
      return this.results[current].accuracy < this.results[worst].accuracy ? current : worst
    })
    
    console.log(`   📉 ${worstAccuracy} needs accuracy improvements (${this.results[worstAccuracy]?.accuracy.toFixed(1)}%)`)
    console.log(`   🔧 Focus on reducing false negatives across all variants`)
    console.log(`   💡 Consider ensemble methods combining multiple variants`)
  }

  printTable(headers, data) {
    // Calculate column widths
    const columnWidths = headers.map((header, i) => {
      const maxDataWidth = Math.max(...data.map(row => (row[i] || '').toString().length))
      return Math.max(header.length, maxDataWidth)
    })

    // Print header
    const headerRow = headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ')
    console.log(`   ${headerRow}`)
    console.log(`   ${columnWidths.map(w => '-'.repeat(w)).join('-+-')}`)

    // Print data rows
    data.forEach(row => {
      const dataRow = row.map((cell, i) => (cell || '').toString().padEnd(columnWidths[i])).join(' | ')
      console.log(`   ${dataRow}`)
    })
  }

  truncateText(text, maxLength = 80) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  // Export results to JSON for further analysis
  exportResults(filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportFile = filename || `variant-benchmark-results-${timestamp}.json`
    
    const exportData = {
      timestamp: new Date().toISOString(),
      testCasesCount: this.testCases.length,
      results: this.results,
      summary: this.generateSummary()
    }
    
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2))
    console.log(`\n💾 Results exported to: ${exportFile}`)
  }

  generateSummary() {
    const summary = {}
    Object.keys(this.results).forEach(variantName => {
      const result = this.results[variantName]
      summary[variantName] = {
        accuracy: result.accuracy,
        averageTime: result.averageTime,
        throughput: result.throughput,
        falsePositives: result.falsePositives,
        falseNegatives: result.falseNegatives
      }
    })
    return summary
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const variantFilter = args.find(arg => arg.startsWith('--variants='))?.split('=')[1]
  const exportResults = args.includes('--export')
  
  console.log('🧪 ContentGuard v4.7 Variants Comprehensive Benchmark Suite')
  console.log('=' .repeat(80))
  
  if (variantFilter) {
    console.log(`🎯 Testing specific variants: ${variantFilter}`)
  } else {
    console.log('🎯 Testing all available variants')
  }
  
  const tester = new ContentGuardV4VariantTester()
  await tester.runComprehensiveBenchmark(variantFilter)
  
  if (exportResults) {
    tester.exportResults()
  }
  
  console.log('\n✅ Benchmark completed successfully!')
  console.log('\nUsage examples:')
  console.log('  node tests/test-v4-variants.js                    # Test all variants')
  console.log('  node tests/test-v4-variants.js --variants=v4.7-fast,v4.7-large  # Test specific variants') 
  console.log('  node tests/test-v4-variants.js --export           # Export results to JSON')
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { ContentGuardV4VariantTester } 