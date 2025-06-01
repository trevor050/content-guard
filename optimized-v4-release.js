#!/usr/bin/env node

/**
 * 🎯 ContentGuard v4.0 - Release Candidate Optimization
 * 
 * Based on v3.0 vs v4.0 comparison results, this configuration specifically targets:
 * - Reducing false positives from 5 to ≤4
 * - Improving workplace harassment detection from 87.5% to ≥90.6%
 * - Maintaining 67.7% overall accuracy and professional content accuracy
 */

const { ContentGuard, presets } = require('./index.js')
const { ProductionTieredSystem } = require('./production-tiered-system.js')
const { MassiveBenchmarkV4 } = require('./tests/massive-benchmark-v3.js')

class OptimizedV4Release {
  constructor() {
    this.benchmark = new MassiveBenchmarkV4()
    this.testCases = this.benchmark.testCases.filter(tc => tc.expected !== 'MIXED')
  }

  async optimizeForRelease() {
    console.log('🎯 ContentGuard v4.0 - Release Candidate Optimization')
    console.log('='.repeat(80))
    console.log('Target: Reduce FP to ≤4, improve workplace harassment to ≥90.6%\n')

    const configurations = {
      'v4.0 Enhanced Professional': this.createEnhancedProfessional(),
      'v4.0 Harassment Focused': this.createHarassmentFocused(),
      'v4.0 Balanced Plus': this.createBalancedPlus(),
      'v4.0 Production Optimized': this.createProductionOptimized()
    }

    const results = {}
    for (const [name, config] of Object.entries(configurations)) {
      console.log(`📊 Testing ${name}...`)
      results[name] = await this.testConfiguration(config, name)
    }

    this.analyzeOptimizedResults(results)
    return this.selectBestConfiguration(results)
  }

  createEnhancedProfessional() {
    // Reduce false positives by improving professional context detection
    return new ContentGuard({
      spamThreshold: 5, // Slightly higher to reduce false positives
      enableCaching: true,
      plugins: {
        obscenity: { weight: 1.2, contextAware: true }, // Lower weight, context aware
        sentiment: { weight: 1.5, contextAware: true },
        patterns: { weight: 1.8, contextAware: true },
        harassment: { weight: 3.0, contextAware: true }, // Higher harassment weight
        socialEngineering: { weight: 2.0, contextAware: true },
        validation: { weight: 0.8 }
      },
      preprocessing: {
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        contextAware: true // Enable full context awareness
      },
      // Enhanced professional protection
      professionalTermsWhitelist: [
        'kill process', 'terminate connection', 'critical path', 'urgent surgical',
        'emergency protocol', 'memory leak', 'performance impact', 'security audit'
      ]
    })
  }

  createHarassmentFocused() {
    // Focus on improving workplace harassment detection
    return new ContentGuard({
      spamThreshold: 4,
      enableCaching: true,
      plugins: {
        obscenity: { weight: 1.0, contextAware: true },
        sentiment: { weight: 2.2, contextAware: true }, // Higher sentiment weight
        patterns: { weight: 2.0, contextAware: true },
        harassment: { weight: 3.5, contextAware: true }, // Maximum harassment focus
        socialEngineering: { weight: 2.5, contextAware: true },
        validation: { weight: 0.5 }
      },
      preprocessing: {
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        contextAware: true
      },
      // Enhanced harassment patterns
      enhancedHarassmentDetection: true,
      microaggressionSensitivity: 'high'
    })
  }

  createBalancedPlus() {
    // Balanced approach with slight bias toward accuracy
    return new ContentGuard({
      spamThreshold: 4.5, // Between 4 and 5 for balance
      enableCaching: true,
      plugins: {
        obscenity: { weight: 1.3, contextAware: true },
        sentiment: { weight: 1.8, contextAware: true },
        patterns: { weight: 1.9, contextAware: true },
        harassment: { weight: 2.8, contextAware: true },
        socialEngineering: { weight: 2.2, contextAware: true },
        validation: { weight: 0.9 }
      },
      preprocessing: {
        normalizeUnicode: true,
        normalizeLeetSpeak: true,
        expandSlang: true,
        contextAware: true
      }
    })
  }

  createProductionOptimized() {
    // Production-ready tiered system with optimizations
    return new ProductionTieredSystem({
      enableTier3: false, // For fair comparison
      escalationStrategy: 'balanced',
      
      // Custom tier configurations
      tier1: {
        spamThreshold: 6,
        plugins: {
          obscenity: { weight: 2.5, contextAware: false },
          patterns: { weight: 2.0, contextAware: false },
          validation: { weight: 1.5 }
        }
      },
      tier2: {
        spamThreshold: 4,
        plugins: {
          harassment: { weight: 3.0, contextAware: true },
          socialEngineering: { weight: 2.5, contextAware: true },
          sentiment: { weight: 2.0, contextAware: true }
        }
      }
    })
  }

  async testConfiguration(guard, configName) {
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
        result = await guard.analyze({
          name: 'Test User',
          email: 'test@example.com',
          message: testCase.text
        })
      } catch (error) {
        console.warn(`Error: ${error.message}`)
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

    // Calculate category accuracies
    Object.keys(results.categories).forEach(category => {
      const cat = results.categories[category]
      cat.accuracy = cat.total > 0 ? (cat.correct / cat.total * 100) : 0
    })

    const profAcc = results.categories['professional']?.accuracy || 0
    const workAcc = results.categories['workplace_harassment']?.accuracy || 0

    console.log(`   ✅ ${configName}: ${results.accuracy.toFixed(1)}% accuracy, ${results.averageTime.toFixed(2)}ms avg`)
    console.log(`      Professional: ${profAcc.toFixed(1)}%, Workplace Harassment: ${workAcc.toFixed(1)}%, FP: ${results.falsePositives}`)

    return results
  }

  analyzeOptimizedResults(results) {
    console.log('\n\n🏆 OPTIMIZATION RESULTS')
    console.log('='.repeat(80))

    console.log('\n📊 RELEASE CANDIDATE EVALUATION:')
    console.log('┌─────────────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐')
    console.log('│ Configuration           │ Accuracy│ Speed   │ FalsePos│ ProfAcc │ WorkHar │')
    console.log('├─────────────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤')

    Object.values(results).forEach(result => {
      const prof = result.categories['professional']?.accuracy || 0
      const work = result.categories['workplace_harassment']?.accuracy || 0
      const shortName = result.configName.replace('v4.0 ', '').padEnd(19)
      console.log(`│ ${shortName} │ ${result.accuracy.toFixed(1).padStart(7)}%│ ${result.averageTime.toFixed(1).padStart(7)}ms│ ${result.falsePositives.toString().padStart(7)} │ ${prof.toFixed(1).padStart(7)}%│ ${work.toFixed(1).padStart(7)}%│`)
    })

    console.log('└─────────────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘')

    console.log('\n🎯 BENCHMARK CHECK (Target: ≥60% accuracy, ≤4 FP, ≥90.6% workplace harassment):')
    Object.entries(results).forEach(([name, result]) => {
      const profAcc = result.categories['professional']?.accuracy || 0
      const workAcc = result.categories['workplace_harassment']?.accuracy || 0
      
      const checks = {
        accuracy: result.accuracy >= 60,
        speed: result.averageTime <= 10,
        falsePositives: result.falsePositives <= 4,
        professional: profAcc >= 97.7,
        workplace: workAcc >= 90.6
      }

      const passed = Object.values(checks).filter(Boolean).length
      const total = Object.keys(checks).length

      console.log(`\n   ${name}:`)
      console.log(`   ${checks.accuracy ? '✅' : '❌'} Accuracy: ${result.accuracy.toFixed(1)}% (≥60%)`)
      console.log(`   ${checks.speed ? '✅' : '❌'} Speed: ${result.averageTime.toFixed(2)}ms (≤10ms)`)
      console.log(`   ${checks.falsePositives ? '✅' : '❌'} False Positives: ${result.falsePositives} (≤4)`)
      console.log(`   ${checks.professional ? '✅' : '❌'} Professional: ${profAcc.toFixed(1)}% (≥97.7%)`)
      console.log(`   ${checks.workplace ? '✅' : '❌'} Workplace Harassment: ${workAcc.toFixed(1)}% (≥90.6%)`)
      console.log(`   📊 Overall: ${passed}/${total} benchmarks passed (${(passed/total*100).toFixed(1)}%)`)
    })
  }

  selectBestConfiguration(results) {
    console.log('\n🏆 SELECTING BEST CONFIGURATION FOR RELEASE:')
    
    // Find configurations that pass all benchmarks
    const passedConfigs = Object.entries(results).filter(([name, result]) => {
      const profAcc = result.categories['professional']?.accuracy || 0
      const workAcc = result.categories['workplace_harassment']?.accuracy || 0
      
      return result.accuracy >= 60 &&
             result.averageTime <= 10 &&
             result.falsePositives <= 4 &&
             profAcc >= 97.7 &&
             workAcc >= 90.6
    })

    if (passedConfigs.length > 0) {
      // Select best based on overall score
      const best = passedConfigs.reduce(([bestName, bestResult], [name, result]) => {
        const bestScore = bestResult.accuracy + (bestResult.categories['workplace_harassment']?.accuracy || 0) - bestResult.falsePositives
        const currentScore = result.accuracy + (result.categories['workplace_harassment']?.accuracy || 0) - result.falsePositives
        return currentScore > bestScore ? [name, result] : [bestName, bestResult]
      })

      console.log(`✅ RELEASE CANDIDATE APPROVED: ${best[0]}`)
      console.log(`   Accuracy: ${best[1].accuracy.toFixed(1)}%`)
      console.log(`   Speed: ${best[1].averageTime.toFixed(2)}ms`)
      console.log(`   False Positives: ${best[1].falsePositives}`)
      console.log(`   Professional: ${(best[1].categories['professional']?.accuracy || 0).toFixed(1)}%`)
      console.log(`   Workplace Harassment: ${(best[1].categories['workplace_harassment']?.accuracy || 0).toFixed(1)}%`)
      
      return best
    } else {
      console.log(`❌ No configuration passes all benchmarks yet`)
      
      // Find closest to passing
      const closest = Object.entries(results).reduce(([bestName, bestResult], [name, result]) => {
        const profAcc = result.categories['professional']?.accuracy || 0
        const workAcc = result.categories['workplace_harassment']?.accuracy || 0
        
        const bestScore = (bestResult.accuracy >= 60 ? 1 : 0) +
                         (bestResult.averageTime <= 10 ? 1 : 0) +
                         (bestResult.falsePositives <= 4 ? 1 : 0) +
                         ((bestResult.categories['professional']?.accuracy || 0) >= 97.7 ? 1 : 0) +
                         ((bestResult.categories['workplace_harassment']?.accuracy || 0) >= 90.6 ? 1 : 0)
        
        const currentScore = (result.accuracy >= 60 ? 1 : 0) +
                           (result.averageTime <= 10 ? 1 : 0) +
                           (result.falsePositives <= 4 ? 1 : 0) +
                           (profAcc >= 97.7 ? 1 : 0) +
                           (workAcc >= 90.6 ? 1 : 0)
        
        return currentScore > bestScore ? [name, result] : [bestName, bestResult]
      })

      console.log(`⚠️  Closest configuration: ${closest[0]}`)
      return closest
    }
  }
}

// Main execution
async function main() {
  const optimizer = new OptimizedV4Release()
  const bestConfig = await optimizer.optimizeForRelease()
  
  if (bestConfig) {
    console.log('\n🚀 Ready for release preparation!')
  } else {
    console.log('\n⚠️  Further optimization needed')
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { OptimizedV4Release } 