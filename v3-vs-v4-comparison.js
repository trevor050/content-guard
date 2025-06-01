#!/usr/bin/env node

/**
 * 🎯 ContentGuard v3.0 vs v4.0 - Real Comparison Test
 * 
 * This test pulls the ACTUAL published v3.0 from NPM and compares it
 * against our current v4.0 using the exact same test cases to get
 * real performance baselines.
 */

const fs = require('fs')
const path = require('path')

// Import v3.0 from NPM
const v3ContentGuard = require('./v3-test/node_modules/content-guard')

// Import our current v4.0
const v4ContentGuard = require('./index.js')
const { ProductionTieredSystem } = require('./production-tiered-system.js')
const { MassiveBenchmarkV4 } = require('./tests/massive-benchmark-v3.js')

class V3VsV4Comparison {
  constructor() {
    this.benchmark = new MassiveBenchmarkV4()
    this.testCases = this.benchmark.testCases.filter(tc => tc.expected !== 'MIXED') // Only definitive cases
    
    // Release candidate benchmarks (based on v3.0 claims from CHANGELOG.md)
    this.releaseBenchmarks = {
      overallAccuracy: {
        v3Baseline: 56.6,
        v4Target: 60.0, // At least 3.4pp improvement
        description: "Overall accuracy must beat v3.0 by significant margin"
      },
      professionalContent: {
        v3Baseline: 97.7,
        v4Target: 97.7, // Maintain excellence
        description: "Professional content accuracy must maintain v3.0 level"
      },
      workplaceHarassment: {
        v3Baseline: 90.6,
        v4Target: 90.6, // Maintain or improve
        description: "Workplace harassment detection must maintain v3.0 level"
      },
      speed: {
        v3Baseline: 28.5, // Average from v3.0 (12-45ms)
        v4Target: 10.0, // Must be significantly faster
        description: "Speed must be at least 3x faster than v3.0"
      },
      falsePositives: {
        v3Baseline: 4,
        v4Target: 4, // Same or better
        description: "False positives must not exceed v3.0"
      }
    }
  }

  async runComparison() {
    console.log('🎯 ContentGuard v3.0 vs v4.0 - REAL Comparison Test')
    console.log('='.repeat(80))
    console.log('Testing ACTUAL published v3.0 vs our v4.0 on identical test cases...\n')

    // Test published v3.0
    console.log('📊 Testing Published v3.0 from NPM...')
    const v3Results = await this.testV3()
    
    // Test our v4.0 configurations
    console.log('\n📊 Testing Our v4.0 Configurations...')
    const v4Results = {
      'v4.0 Default': await this.testV4Default(),
      'v4.0 Speed Optimized': await this.testV4Speed(),
      'v4.0 Balanced': await this.testV4Balanced(),
      'v4.0 Tiered Production': await this.testV4Tiered()
    }

    // Comprehensive analysis
    this.analyzeResults(v3Results, v4Results)
    this.checkReleaseCandidateStatus(v3Results, v4Results)
  }

  async testV3() {
    console.log('   Testing with v3.0 default configuration...')
    const guard = new v3ContentGuard.ContentGuard()
    return await this.runTestSuite(guard, 'v3.0 Published')
  }

  async testV4Default() {
    console.log('   Testing v4.0 default configuration...')
    const guard = new v4ContentGuard.ContentGuard()
    return await this.runTestSuite(guard, 'v4.0 Default')
  }

  async testV4Speed() {
    console.log('   Testing v4.0 speed optimized...')
    const guard = new v4ContentGuard.ContentGuard({
      spamThreshold: 6,
      enableEarlyExit: true,
      enableCaching: false,
      plugins: {
        obscenity: { weight: 2.5, contextAware: false },
        patterns: { weight: 2.0, contextAware: false },
        validation: { weight: 1.5 }
      },
      preprocessing: {
        normalizeUnicode: true,
        normalizeLeetSpeak: false,
        expandSlang: false,
        contextAware: false
      }
    })
    return await this.runTestSuite(guard, 'v4.0 Speed')
  }

  async testV4Balanced() {
    console.log('   Testing v4.0 balanced configuration...')
    const guard = new v4ContentGuard.ContentGuard({
      spamThreshold: 4,
      enableEarlyExit: true,
      plugins: {
        obscenity: { weight: 1.5, contextAware: true },
        sentiment: { weight: 2.0, contextAware: true },
        patterns: { weight: 1.8, contextAware: true },
        harassment: { weight: 2.5, contextAware: true },
        socialEngineering: { weight: 2.0, contextAware: true },
        validation: { weight: 1.0 }
      }
    })
    return await this.runTestSuite(guard, 'v4.0 Balanced')
  }

  async testV4Tiered() {
    console.log('   Testing v4.0 tiered production...')
    const guard = new ProductionTieredSystem({
      enableTier3: false, // Fair comparison without expensive ML
      escalationStrategy: 'balanced'
    })
    return await this.runTestSuite(guard, 'v4.0 Tiered')
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
      categories: {}
    }

    // Initialize category tracking
    const categories = [...new Set(this.testCases.map(tc => tc.category))]
    categories.forEach(cat => {
      results.categories[cat] = { total: 0, correct: 0, fp: 0, fn: 0 }
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
        if (guard.analyze) {
          result = await guard.analyze({
            name: 'Test User',
            email: 'test@example.com',
            message: testCase.text
          })
        } else {
          continue
        }
      } catch (error) {
        console.warn(`Error processing test case: ${error.message}`)
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

      if (isSpam === expected) {
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

    console.log(`   ✅ ${configName}: ${results.accuracy.toFixed(1)}% accuracy, ${results.averageTime.toFixed(2)}ms avg`)
    return results
  }

  analyzeResults(v3Results, v4Results) {
    console.log('\n\n🏆 COMPREHENSIVE COMPARISON RESULTS')
    console.log('='.repeat(80))

    console.log('\n📊 PERFORMANCE SUMMARY TABLE:')
    console.log('┌─────────────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐')
    console.log('│ Configuration           │ Accuracy│ Speed   │ FalsePos│ ProfAcc │ WorkHar │')
    console.log('├─────────────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤')

    // v3.0 row
    const v3Prof = v3Results.categories['professional']?.accuracy || 0
    const v3Work = v3Results.categories['workplace_harassment']?.accuracy || 0
    console.log(`│ v3.0 Published (NPM)    │ ${v3Results.accuracy.toFixed(1).padStart(7)}%│ ${v3Results.averageTime.toFixed(1).padStart(7)}ms│ ${v3Results.falsePositives.toString().padStart(7)} │ ${v3Prof.toFixed(1).padStart(7)}%│ ${v3Work.toFixed(1).padStart(7)}%│`)

    // v4.0 rows
    Object.values(v4Results).forEach(result => {
      const prof = result.categories['professional']?.accuracy || 0
      const work = result.categories['workplace_harassment']?.accuracy || 0
      const shortName = result.configName.replace('v4.0 ', '').padEnd(19)
      console.log(`│ ${shortName} │ ${result.accuracy.toFixed(1).padStart(7)}%│ ${result.averageTime.toFixed(1).padStart(7)}ms│ ${result.falsePositives.toString().padStart(7)} │ ${prof.toFixed(1).padStart(7)}%│ ${work.toFixed(1).padStart(7)}%│`)
    })

    console.log('└─────────────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘')

    console.log('\n🎯 KEY IMPROVEMENTS vs v3.0:')
    Object.entries(v4Results).forEach(([name, result]) => {
      const accuracyImprovement = (result.accuracy - v3Results.accuracy).toFixed(1)
      const speedImprovement = ((v3Results.averageTime - result.averageTime) / v3Results.averageTime * 100).toFixed(1)
      const fpChange = result.falsePositives - v3Results.falsePositives

      console.log(`\n   ${name}:`)
      console.log(`   • Accuracy: ${accuracyImprovement > 0 ? '+' : ''}${accuracyImprovement}pp (${result.accuracy.toFixed(1)}% vs ${v3Results.accuracy.toFixed(1)}%)`)
      console.log(`   • Speed: ${speedImprovement}% faster (${result.averageTime.toFixed(2)}ms vs ${v3Results.averageTime.toFixed(2)}ms)`)
      console.log(`   • False Positives: ${fpChange > 0 ? '+' : ''}${fpChange} (${result.falsePositives} vs ${v3Results.falsePositives})`)
    })
  }

  checkReleaseCandidateStatus(v3Results, v4Results) {
    console.log('\n\n🎯 RELEASE CANDIDATE EVALUATION')
    console.log('='.repeat(80))

    console.log('\n📋 Release Benchmarks (based on v3.0 performance):')
    Object.entries(this.releaseBenchmarks).forEach(([metric, bench]) => {
      console.log(`   • ${metric}: Target ≥${bench.v4Target} (v3.0 baseline: ${bench.v3Baseline})`)
      console.log(`     ${bench.description}`)
    })

    console.log('\n🏅 EVALUATION RESULTS:')
    
    let bestConfig = null
    let bestScore = 0
    let passedConfigs = []

    Object.entries(v4Results).forEach(([name, result]) => {
      console.log(`\n   ${name}:`)
      
      const checks = {
        overallAccuracy: result.accuracy >= this.releaseBenchmarks.overallAccuracy.v4Target,
        speed: result.averageTime <= this.releaseBenchmarks.speed.v4Target,
        falsePositives: result.falsePositives <= this.releaseBenchmarks.falsePositives.v4Target,
        professionalContent: (result.categories['professional']?.accuracy || 0) >= this.releaseBenchmarks.professionalContent.v4Target,
        workplaceHarassment: (result.categories['workplace_harassment']?.accuracy || 0) >= this.releaseBenchmarks.workplaceHarassment.v4Target
      }

      Object.entries(checks).forEach(([check, passed]) => {
        const metric = this.releaseBenchmarks[check]
        let current
        if (check === 'overallAccuracy') current = result.accuracy.toFixed(1)
        else if (check === 'speed') current = result.averageTime.toFixed(2) + 'ms'
        else if (check === 'falsePositives') current = result.falsePositives
        else if (check === 'professionalContent') current = (result.categories['professional']?.accuracy || 0).toFixed(1) + '%'
        else if (check === 'workplaceHarassment') current = (result.categories['workplace_harassment']?.accuracy || 0).toFixed(1) + '%'
        
        console.log(`     ${passed ? '✅' : '❌'} ${check}: ${current} (target: ${metric.v4Target})`)
      })

      const passedCount = Object.values(checks).filter(Boolean).length
      const totalChecks = Object.keys(checks).length
      const score = passedCount / totalChecks

      console.log(`     Overall: ${passedCount}/${totalChecks} checks passed (${(score * 100).toFixed(1)}%)`)

      if (score > bestScore) {
        bestScore = score
        bestConfig = { name, result, score }
      }

      if (passedCount === totalChecks) {
        passedConfigs.push(name)
      }
    })

    console.log('\n🏆 FINAL VERDICT:')
    if (passedConfigs.length > 0) {
      console.log(`✅ RELEASE CANDIDATE APPROVED!`)
      console.log(`   Configurations meeting all benchmarks: ${passedConfigs.join(', ')}`)
      console.log(`   Recommended for production: ${bestConfig.name}`)
      
      this.generateReleaseNotes(v3Results, bestConfig.result)
      return true
    } else {
      console.log(`❌ RELEASE CANDIDATE REJECTED`)
      console.log(`   Best configuration: ${bestConfig.name} (${(bestConfig.score * 100).toFixed(1)}% benchmarks passed)`)
      console.log(`   Requires optimization before release`)
      
      this.identifyImprovementAreas(v3Results, v4Results)
      return false
    }
  }

  generateReleaseNotes(v3Results, bestV4Results) {
    console.log('\n📝 RELEASE NOTES SUMMARY:')
    console.log('─'.repeat(50))
    
    const accuracyGain = (bestV4Results.accuracy - v3Results.accuracy).toFixed(1)
    const speedGain = ((v3Results.averageTime - bestV4Results.averageTime) / v3Results.averageTime * 100).toFixed(1)
    
    console.log(`✨ ContentGuard v4.0 delivers significant improvements:`)
    console.log(`   • ${accuracyGain}pp accuracy improvement (${bestV4Results.accuracy.toFixed(1)}% vs ${v3Results.accuracy.toFixed(1)}%)`)
    console.log(`   • ${speedGain}% speed improvement (${bestV4Results.averageTime.toFixed(2)}ms vs ${v3Results.averageTime.toFixed(2)}ms)`)
    console.log(`   • Revolutionary 3-tier architecture for optimal compute efficiency`)
    console.log(`   • Production-ready tiered system with user-controlled ML`)
    console.log(`   • Enhanced enterprise scalability`)
  }

  identifyImprovementAreas(v3Results, v4Results) {
    console.log('\n🔧 REQUIRED IMPROVEMENTS:')
    console.log('─'.repeat(40))
    
    const bestResult = Object.values(v4Results).reduce((best, current) => 
      current.accuracy > best.accuracy ? current : best
    )

    if (bestResult.accuracy < this.releaseBenchmarks.overallAccuracy.v4Target) {
      console.log(`• Overall accuracy: Need ${(this.releaseBenchmarks.overallAccuracy.v4Target - bestResult.accuracy).toFixed(1)}pp improvement`)
    }
    if (bestResult.averageTime > this.releaseBenchmarks.speed.v4Target) {
      console.log(`• Speed: Need ${(bestResult.averageTime - this.releaseBenchmarks.speed.v4Target).toFixed(1)}ms improvement`)
    }
    if (bestResult.falsePositives > this.releaseBenchmarks.falsePositives.v4Target) {
      console.log(`• False positives: Reduce by ${bestResult.falsePositives - this.releaseBenchmarks.falsePositives.v4Target}`)
    }
  }
}

// Main execution
async function main() {
  const comparison = new V3VsV4Comparison()
  const isReleaseReady = await comparison.runComparison()
  
  if (isReleaseReady) {
    console.log('\n🚀 Ready to proceed with release preparation!')
  } else {
    console.log('\n⚠️  Optimization required before release')
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { V3VsV4Comparison } 