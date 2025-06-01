#!/usr/bin/env node

/**
 * 🎯 ContentGuard v4.0 - Hyperparameter Optimization System
 * 
 * Advanced optimization system that tests hundreds of parameter combinations
 * to find the optimal balance between accuracy and speed for the tiered system.
 */

const { TrueTieredSystem } = require('./production-tiered-system-v2.js')
const fs = require('fs')

class HyperparameterOptimizer {
  constructor() {
    this.testDataset = this.generateComprehensiveTestDataset()
    this.bestResults = []
    this.currentIteration = 0
  }
  
  generateComprehensiveTestDataset() {
    return [
      // Clear Clean Cases (should stay in Tier 1)
      { text: 'Hello, how are you today?', expected: 'CLEAN', category: 'polite' },
      { text: 'Thanks for the quick response', expected: 'CLEAN', category: 'professional' },
      { text: 'Looking forward to our meeting', expected: 'CLEAN', category: 'professional' },
      { text: 'Kill the process on server-prod-03', expected: 'CLEAN', category: 'technical' },
      { text: 'Can you help me with this project?', expected: 'CLEAN', category: 'helpful' },
      { text: 'Great work on the presentation', expected: 'CLEAN', category: 'positive' },
      { text: 'The database server needs to be restarted', expected: 'CLEAN', category: 'technical' },
      { text: 'Please send me the updated requirements', expected: 'CLEAN', category: 'professional' },
      
      // Clear Spam Cases (should be caught by Tier 1)
      { text: 'Go kill yourself, nobody likes you', expected: 'SPAM', category: 'direct_violence' },
      { text: 'You are a complete fucking idiot', expected: 'SPAM', category: 'direct_insult' },
      { text: 'Shut up you stupid bitch', expected: 'SPAM', category: 'direct_insult' },
      { text: 'I hope you die in a car crash', expected: 'SPAM', category: 'death_wish' },
      { text: 'kys loser, no one cares about you', expected: 'SPAM', category: 'direct_violence' },
      { text: 'Free money! Click here now! Winner!', expected: 'SPAM', category: 'scam' },
      
      // Subtle Cases (should escalate to higher tiers)
      { text: 'You are being way too sensitive about constructive feedback', expected: 'SPAM', category: 'gaslighting' },
      { text: 'Maybe you should stick to simpler tasks', expected: 'SPAM', category: 'condescending' },
      { text: 'Are you sure you can handle this responsibility?', expected: 'SPAM', category: 'capability_questioning' },
      { text: 'Everyone else seems to understand this fine', expected: 'SPAM', category: 'social_isolation' },
      { text: 'You always seem to have problems with these things', expected: 'SPAM', category: 'pattern_criticism' },
      { text: 'I think this might be too complex for someone at your level', expected: 'SPAM', category: 'condescending' },
      { text: 'Perhaps you should consider a different approach to your career', expected: 'SPAM', category: 'professional_exclusion' },
      { text: 'It would be unfortunate if your personal information became public', expected: 'SPAM', category: 'veiled_threat' },
      
      // Edge Cases (tricky to classify)
      { text: 'Your work quality has been declining lately', expected: 'CLEAN', category: 'legitimate_feedback' },
      { text: 'This task requires more experience than you currently have', expected: 'CLEAN', category: 'legitimate_feedback' },
      { text: 'I disagree with your approach on this project', expected: 'CLEAN', category: 'professional_disagreement' },
      { text: 'You might want to reconsider this decision', expected: 'CLEAN', category: 'professional_advice' },
      { text: 'The team has concerns about your recent performance', expected: 'CLEAN', category: 'legitimate_feedback' },
      { text: 'This is killing me right now lmao', expected: 'CLEAN', category: 'hyperbolic_expression' },
      { text: 'That meeting totally killed my vibe', expected: 'CLEAN', category: 'figurative_language' },
      
      // Modern Harassment Patterns
      { text: 'Not you thinking you did something there', expected: 'SPAM', category: 'modern_dismissal' },
      { text: 'Tell me you don\'t understand without telling me', expected: 'SPAM', category: 'modern_condescension' },
      { text: 'The audacity of this person', expected: 'SPAM', category: 'modern_mockery' },
      { text: 'This is giving me second-hand embarrassment', expected: 'SPAM', category: 'modern_shaming' }
    ]
  }
  
  async optimizeHyperparameters(iterations = 200) {
    console.log(`🎯 Starting comprehensive hyperparameter optimization`)
    console.log(`📊 Dataset: ${this.testDataset.length} test cases`)
    console.log(`🔄 Iterations: ${iterations}`)
    console.log('=' .repeat(60))
    
    let bestOverallScore = 0
    let bestParams = null
    let bestMetrics = null
    
    // Test baseline (default parameters)
    console.log('📈 Testing baseline configuration...')
    const baselineSystem = new TrueTieredSystem()
    await baselineSystem.initializeTiers()
    const baselineMetrics = await this.testConfiguration(baselineSystem)
    const baselineScore = this.calculateOptimizationScore(baselineMetrics)
    
    console.log(`📊 Baseline: Accuracy=${baselineMetrics.accuracy}% Speed=${baselineMetrics.averageTime} Score=${baselineScore.toFixed(3)}`)
    
    bestOverallScore = baselineScore
    bestParams = baselineSystem.options.hyperparameters
    bestMetrics = baselineMetrics
    
    console.log('\n🎲 Starting random parameter exploration...\n')
    
    for (let i = 0; i < iterations; i++) {
      this.currentIteration = i + 1
      
      // Generate random parameter variation
      const testParams = this.generateSmartRandomParameters()
      
      try {
        // Test this configuration
        const system = new TrueTieredSystem({ hyperparameters: testParams })
        await system.initializeTiers()
        const metrics = await this.testConfiguration(system)
        const score = this.calculateOptimizationScore(metrics)
        
        // Track this result
        this.bestResults.push({
          iteration: i + 1,
          score,
          metrics,
          params: JSON.parse(JSON.stringify(testParams))
        })
        
        // Check if this is the best
        if (score > bestOverallScore) {
          bestOverallScore = score
          bestParams = JSON.parse(JSON.stringify(testParams))
          bestMetrics = metrics
          console.log(`🚀 NEW BEST! Iteration ${i + 1}: Score=${score.toFixed(3)} Accuracy=${metrics.accuracy}% Speed=${metrics.averageTime}`)
        }
        
        // Progress update
        if ((i + 1) % 20 === 0) {
          console.log(`⏳ Progress: ${i + 1}/${iterations} | Best Score: ${bestOverallScore.toFixed(3)} | Current: ${score.toFixed(3)}`)
        }
        
      } catch (error) {
        console.warn(`❌ Iteration ${i + 1} failed:`, error.message)
      }
    }
    
    console.log('\n🏆 OPTIMIZATION COMPLETE!')
    console.log('=' .repeat(60))
    
    this.printResults(bestParams, bestMetrics, bestOverallScore)
    this.saveResults(bestParams, bestMetrics, bestOverallScore)
    
    return { bestParams, bestMetrics, bestOverallScore }
  }
  
  generateSmartRandomParameters() {
    // Generate parameters with smart bounds based on what we know works
    return {
      tier1: {
        cleanThreshold: Math.random() * 0.8,  // 0-0.8
        spamThreshold: 6 + Math.random() * 6,  // 6-12
        uncertaintyMin: 0.3 + Math.random() * 1.0,  // 0.3-1.3
        uncertaintyMax: 5 + Math.random() * 4  // 5-9
      },
      tier2: {
        confidenceThreshold: 0.6 + Math.random() * 0.35,  // 0.6-0.95
        sentimentThreshold: 0.4 + Math.random() * 0.4,  // 0.4-0.8
        semanticThreshold: 0.3 + Math.random() * 0.5,  // 0.3-0.8
        escalationThreshold: 0.5 + Math.random() * 0.4  // 0.5-0.9
      },
      tier3: {
        ensembleThreshold: 0.6 + Math.random() * 0.3,  // 0.6-0.9
        modelWeights: {
          toxicity: 0.2 + Math.random() * 0.6,  // 0.2-0.8
          sentiment: 0.1 + Math.random() * 0.7,  // 0.1-0.8
          semantic: 0.1 + Math.random() * 0.7   // 0.1-0.8
        }
      },
      escalation: {
        conservative: { 
          tier1_to_tier2: 0.8 + Math.random() * 0.15, 
          tier2_to_tier3: 0.85 + Math.random() * 0.1 
        },
        balanced: { 
          tier1_to_tier2: 0.65 + Math.random() * 0.2, 
          tier2_to_tier3: 0.7 + Math.random() * 0.2 
        },
        aggressive: { 
          tier1_to_tier2: 0.5 + Math.random() * 0.25, 
          tier2_to_tier3: 0.55 + Math.random() * 0.25 
        }
      }
    }
  }
  
  async testConfiguration(system) {
    let correct = 0
    let totalTime = 0
    let tier1Count = 0
    let tier2Count = 0
    let tier3Count = 0
    
    const categoryResults = {}
    
    for (const testCase of this.testDataset) {
      const startTime = performance.now()
      
      try {
        const result = await system.analyze(testCase.text)
        const endTime = performance.now()
        
        const expected = testCase.expected === 'SPAM'
        const actual = result.isSpam
        const isCorrect = actual === expected
        
        if (isCorrect) correct++
        totalTime += (endTime - startTime)
        
        // Track tier usage
        const tier = result.tieredAnalysis?.usedTier || 1
        if (tier === 1) tier1Count++
        else if (tier === 2) tier2Count++
        else if (tier === 3) tier3Count++
        
        // Track by category
        if (!categoryResults[testCase.category]) {
          categoryResults[testCase.category] = { correct: 0, total: 0 }
        }
        categoryResults[testCase.category].total++
        if (isCorrect) categoryResults[testCase.category].correct++
        
      } catch (error) {
        console.warn(`Test failed for "${testCase.text}":`, error.message)
        totalTime += 50 // Penalty for failure
      }
    }
    
    const accuracy = (correct / this.testDataset.length * 100)
    const avgTime = totalTime / this.testDataset.length
    const total = this.testDataset.length
    
    return {
      accuracy: accuracy.toFixed(1),
      averageTime: avgTime.toFixed(2),
      distribution: {
        tier1: (tier1Count / total * 100).toFixed(1),
        tier2: (tier2Count / total * 100).toFixed(1),
        tier3: (tier3Count / total * 100).toFixed(1)
      },
      categoryResults
    }
  }
  
  calculateOptimizationScore(metrics) {
    const accuracy = parseFloat(metrics.accuracy) / 100
    const avgTime = parseFloat(metrics.averageTime)
    const tier1Rate = parseFloat(metrics.distribution.tier1) / 100
    
    // Multi-objective optimization
    // Priority: Accuracy > Speed > Distribution
    const accuracyScore = Math.pow(Math.min(accuracy / 0.85, 1.0), 2) * 0.6  // Squared for emphasis
    const speedScore = Math.min(50.0 / Math.max(avgTime, 1), 1.0) * 0.25
    const distributionScore = Math.min(tier1Rate / 0.75, 1.0) * 0.15
    
    // Bonus for excellent accuracy
    const accuracyBonus = accuracy > 0.9 ? 0.1 : 0
    
    return accuracyScore + speedScore + distributionScore + accuracyBonus
  }
  
  printResults(bestParams, bestMetrics, bestScore) {
    console.log(`\n🎯 BEST CONFIGURATION (Score: ${bestScore.toFixed(3)}):`)
    console.log(`• Accuracy: ${bestMetrics.accuracy}%`)
    console.log(`• Speed: ${bestMetrics.averageTime}ms`)
    console.log(`• Distribution: T1:${bestMetrics.distribution.tier1}% T2:${bestMetrics.distribution.tier2}% T3:${bestMetrics.distribution.tier3}%`)
    
    console.log('\n📋 Category Breakdown:')
    Object.entries(bestMetrics.categoryResults).forEach(([category, stats]) => {
      const acc = (stats.correct / stats.total * 100).toFixed(1)
      console.log(`   ${category}: ${acc}% (${stats.correct}/${stats.total})`)
    })
    
    console.log('\n⚙️ Optimal Hyperparameters:')
    console.log('Tier 1:', JSON.stringify(bestParams.tier1, null, 2))
    console.log('Tier 2:', JSON.stringify(bestParams.tier2, null, 2))
    console.log('Tier 3:', JSON.stringify(bestParams.tier3, null, 2))
    
    // Show top 5 configurations
    console.log('\n🏅 Top 5 Configurations:')
    const sorted = this.bestResults.sort((a, b) => b.score - a.score).slice(0, 5)
    sorted.forEach((result, i) => {
      console.log(`${i + 1}. Score: ${result.score.toFixed(3)} | Accuracy: ${result.metrics.accuracy}% | Speed: ${result.metrics.averageTime}ms`)
    })
  }
  
  saveResults(bestParams, bestMetrics, bestScore) {
    const results = {
      timestamp: new Date().toISOString(),
      optimization: {
        score: bestScore,
        metrics: bestMetrics,
        hyperparameters: bestParams
      },
      allResults: this.bestResults,
      dataset: this.testDataset.map(t => ({ text: t.text.substring(0, 50), expected: t.expected, category: t.category }))
    }
    
    fs.writeFileSync('optimization-results-v2.json', JSON.stringify(results, null, 2))
    fs.writeFileSync('optimal-hyperparameters-v2.json', JSON.stringify(bestParams, null, 2))
    
    console.log('\n💾 Results saved to:')
    console.log('• optimization-results-v2.json (full results)')
    console.log('• optimal-hyperparameters-v2.json (best parameters)')
  }
}

// Main execution
if (require.main === module) {
  async function main() {
    const optimizer = new HyperparameterOptimizer()
    
    // Get iterations from command line or use default
    const iterations = parseInt(process.argv[2]) || 100
    
    console.log('🚀 ContentGuard v4.0 Hyperparameter Optimization')
    console.log(`🎯 Target: >85% accuracy, <50ms speed, >60% Tier 1 handling`)
    console.log(`🔄 Running ${iterations} iterations...\n`)
    
    const startTime = Date.now()
    const results = await optimizer.optimizeHyperparameters(iterations)
    const endTime = Date.now()
    
    console.log(`\n⏱️  Total optimization time: ${((endTime - startTime) / 1000 / 60).toFixed(2)} minutes`)
    console.log(`🎯 Final optimization score: ${results.bestOverallScore.toFixed(3)}`)
    
    // Quick verification test
    console.log('\n🧪 Quick verification test...')
    const testSystem = new TrueTieredSystem({ hyperparameters: results.bestParams })
    await testSystem.initializeTiers()
    
    const verificationCases = [
      'Go kill yourself, nobody likes you',
      'Maybe you should stick to simpler tasks',
      'Thanks for the quick response'
    ]
    
    for (const testText of verificationCases) {
      const result = await testSystem.analyze(testText)
      console.log(`T${result.tieredAnalysis.usedTier} | ${result.tieredAnalysis.processingTime.toFixed(2)}ms | ${result.isSpam ? 'SPAM' : 'CLEAN'} | "${testText.substring(0, 40)}..."`)
    }
    
    console.log('\n✅ Optimization complete! Use optimal-hyperparameters-v2.json in production.')
  }
  
  main().catch(console.error)
}

module.exports = { HyperparameterOptimizer } 