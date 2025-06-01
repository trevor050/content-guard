#!/usr/bin/env node

/**
 * ContentGuard - Super Advanced Testing Framework
 * 
 * The ultimate test that combines all test cases and pushes the system to its absolute limits.
 * This will run multiple rounds with different configurations to find optimal settings.
 */

const { ContentGuard } = require('../index.js')
const chalk = require('chalk')
const { Command } = require('commander')
const ora = require('ora')
const fs = require('fs')
const advancedTestCases = require('./advanced-test-cases.js')

class SuperAdvancedTestFramework {
  constructor() {
    this.rounds = []
    this.currentRound = 0
    this.bestConfiguration = null
    this.bestAccuracy = 0
    
    // Even more sophisticated test configurations
    this.configurations = [
      {
        name: 'Ultimate Balanced',
        config: {
          spamThreshold: 5,
          contextAware: true,
          enableAdvancedNLP: true,
          enableFuzzyClassification: true,
          layerWeights: { 
            obscenity: 1.0, sentiment: 1.0, custom: 1.0, textModerate: 1.0, 
            patterns: 1.0, nlp: 1.2, similarity: 1.1, language: 0.8, validation: 0.9 
          },
          detectionCategories: {
            toxicity: true, harassment: true, spam: true, scams: true,
            extremism: true, evasion: true, gaming: true, professional: true
          }
        }
      },
      {
        name: 'Context Master',
        config: {
          spamThreshold: 6,
          contextAware: true,
          enableAdvancedNLP: true,
          technicalTermsBonus: -10,
          academicTermsBonus: -8,
          medicalTermsBonus: -12,
          businessTermsBonus: -6,
          legalTermsBonus: -8,
          layerWeights: { 
            obscenity: 0.8, sentiment: 0.9, custom: 1.3, textModerate: 0.7, 
            patterns: 1.0, nlp: 1.5, similarity: 1.2, language: 0.6, validation: 0.8 
          }
        }
      },
      {
        name: 'Precision Hunter',
        config: {
          spamThreshold: 4,
          contextAware: true,
          enableAdvancedNLP: true,
          enableFuzzyClassification: true,
          layerWeights: { 
            obscenity: 1.5, sentiment: 1.3, custom: 1.8, textModerate: 1.2, 
            patterns: 1.4, nlp: 1.0, similarity: 1.6, language: 1.1, validation: 1.3 
          },
          technicalTermsBonus: -15,
          academicTermsBonus: -12,
          professionalKeywordBonus: -8
        }
      },
      {
        name: 'Lightning Fast',
        config: {
          spamThreshold: 5,
          contextAware: true,
          enableAdvancedNLP: false,
          enableFuzzyClassification: false,
          enableCaching: true,
          enableLayers: {
            obscenity: true, sentiment: true, textModerate: false, custom: true,
            ipReputation: false, patterns: true, nlp: false, similarity: false,
            language: false, validation: true
          }
        }
      },
      {
        name: 'No Mercy Maximum',
        config: {
          spamThreshold: 3,
          contextAware: true,
          enableAdvancedNLP: true,
          layerWeights: { 
            obscenity: 2.0, sentiment: 1.8, custom: 2.2, textModerate: 1.6, 
            patterns: 1.8, nlp: 1.4, similarity: 2.0, language: 1.2, validation: 1.5 
          },
          technicalTermsBonus: -20,
          academicTermsBonus: -18,
          medicalTermsBonus: -25,
          businessTermsBonus: -15,
          legalTermsBonus: -18
        }
      },
      {
        name: 'AI-Powered Beast',
        config: {
          spamThreshold: 5,
          contextAware: true,
          enableAdvancedNLP: true,
          enableFuzzyClassification: true,
          enableSimilarityCheck: true,
          enableLanguageDetection: true,
          enableKeywordExtraction: true,
          layerWeights: { 
            obscenity: 1.1, sentiment: 1.2, custom: 1.4, textModerate: 1.0, 
            patterns: 1.3, nlp: 1.8, similarity: 1.6, language: 1.4, validation: 1.2 
          }
        }
      }
    ]
    
    // Combine all test cases
    this.testCases = this.combineAllTestCases()
  }
  
  combineAllTestCases() {
    // Import original test cases
    const originalLegitimate = this.getOriginalLegitimateTests()
    const originalSpam = this.getOriginalSpamTests()
    
    return {
      legitimate: [
        ...originalLegitimate,
        ...advancedTestCases.sophisticatedLegitimate,
        ...advancedTestCases.extremeEdgeCases
      ],
      spam: [
        ...originalSpam,
        ...advancedTestCases.sophisticatedSpam
      ]
    }
  }
  
  getOriginalLegitimateTests() {
    return [
      {
        category: 'Academic Research',
        name: 'Dr. Emily Chen',
        email: 'echen@mit.edu',
        subject: 'Research Methodology Question',
        message: 'I am conducting a critical analysis of ratio calculations in structural engineering. The kill switch mechanism in our experimental setup requires urgent attention for our thesis defense.',
        expected: false
      },
      {
        category: 'Medical Emergency',
        name: 'Dr. Sarah Johnson',
        email: 'sjohnson@hospital.org',
        subject: 'Patient Care Urgency',
        message: 'We have a critical patient situation requiring urgent intervention. The medication ratio needs immediate adjustment to prevent complications.',
        expected: false
      },
      {
        category: 'Technical DevOps',
        name: 'DevOps Engineer',
        email: 'admin@tech.com',
        subject: 'Production Issue',
        message: 'Need to kill the stuck processes on server cluster. The kill -9 command is not working. This is urgent as it affects critical production systems.',
        expected: false
      },
      {
        category: 'Business Finance',
        name: 'Financial Analyst',
        email: 'analyst@corp.com',
        subject: 'Critical Financial Analysis',
        message: 'The debt-to-equity ratio shows critical risk levels. We need urgent action to rebalance the portfolio before market close.',
        expected: false
      }
    ]
  }
  
  getOriginalSpamTests() {
    return [
      {
        category: 'Direct Harassment',
        name: 'ToxicUser',
        email: 'toxic@temp.com',
        subject: 'You suck',
        message: 'You are a f*cking idiot and should kill yourself. Nobody likes you, you worthless piece of sh*t.',
        expected: true
      },
      {
        category: 'Gaming Toxicity',
        name: 'ProGamer',
        email: 'gamer@gaming.com',
        subject: 'Git Gud',
        message: 'git gud scrub, you are absolute trash. go back to minecraft you noob. skill issue + ratio + cope harder',
        expected: true
      },
      {
        category: 'Professional Scam',
        name: 'Business Opportunity',
        email: 'opportunity@business.com',
        subject: 'Exclusive Investment',
        message: 'Dear Sir/Madam, Exclusive investment opportunity guaranteeing 500% returns. Completely risk-free and legitimate. Send $1000 immediately.',
        expected: true
      }
    ]
  }
  
  async runSuperTest() {
    console.log(chalk.magenta('🚀 ContentGuard - SUPER ADVANCED Testing Framework'))
    console.log(chalk.magenta('=' .repeat(70)))
    console.log(chalk.yellow(`Testing ${this.configurations.length} ultra-sophisticated configurations...`))
    console.log(chalk.cyan(`Total test cases: ${this.testCases.legitimate.length + this.testCases.spam.length}`))
    console.log('')
    
    for (let i = 0; i < this.configurations.length; i++) {
      this.currentRound = i + 1
      await this.runSuperRound(this.configurations[i])
    }
    
    this.analyzeSuperResults()
    this.generateSuperReport()
    
    return {
      rounds: this.rounds,
      bestConfiguration: this.bestConfiguration,
      bestAccuracy: this.bestAccuracy
    }
  }
  
  async runSuperRound(configuration) {
    const spinner = ora(`Round ${this.currentRound}: Testing ${configuration.name}`).start()
    
    try {
      const guard = new ContentGuard(configuration.config)
      const results = await this.testSuperConfiguration(guard, configuration)
      
      this.rounds.push({
        round: this.currentRound,
        configuration,
        results
      })
      
      const accuracy = results.accuracy
      if (accuracy > this.bestAccuracy) {
        this.bestAccuracy = accuracy
        this.bestConfiguration = configuration
      }
      
      spinner.succeed(chalk.green(
        `Round ${this.currentRound}: ${configuration.name} - ${accuracy.toFixed(1)}% accuracy`
      ))
      
      this.displaySuperRoundResults(results)
      
    } catch (error) {
      spinner.fail(chalk.red(`Round ${this.currentRound} failed: ${error.message}`))
    }
    
    console.log('')
  }
  
  async testSuperConfiguration(guard, configuration) {
    const results = {
      total: 0,
      correct: 0,
      falsePositives: [],
      falseNegatives: [],
      performance: [],
      accuracy: 0,
      categoryBreakdown: {},
      advancedMetrics: {}
    }
    
    // Test legitimate content
    for (const test of this.testCases.legitimate) {
      const startTime = Date.now()
      const result = await guard.analyze(test)
      const processingTime = Date.now() - startTime
      
      results.total++
      results.performance.push(processingTime)
      
      if (!results.categoryBreakdown[test.category]) {
        results.categoryBreakdown[test.category] = { total: 0, correct: 0, errors: [] }
      }
      results.categoryBreakdown[test.category].total++
      
      if (result.isSpam === test.expected) {
        results.correct++
        results.categoryBreakdown[test.category].correct++
      } else {
        results.falsePositives.push({
          ...test,
          actualResult: result.isSpam,
          score: result.score,
          flags: result.flags,
          confidence: result.confidence
        })
        results.categoryBreakdown[test.category].errors.push({
          type: 'false_positive',
          score: result.score,
          description: test.description
        })
      }
    }
    
    // Test spam content
    for (const test of this.testCases.spam) {
      const startTime = Date.now()
      const result = await guard.analyze(test)
      const processingTime = Date.now() - startTime
      
      results.total++
      results.performance.push(processingTime)
      
      if (!results.categoryBreakdown[test.category]) {
        results.categoryBreakdown[test.category] = { total: 0, correct: 0, errors: [] }
      }
      results.categoryBreakdown[test.category].total++
      
      if (result.isSpam === test.expected) {
        results.correct++
        results.categoryBreakdown[test.category].correct++
      } else {
        results.falseNegatives.push({
          ...test,
          actualResult: result.isSpam,
          score: result.score,
          flags: result.flags,
          confidence: result.confidence
        })
        results.categoryBreakdown[test.category].errors.push({
          type: 'false_negative',
          score: result.score,
          description: test.description
        })
      }
    }
    
    results.accuracy = (results.correct / results.total) * 100
    results.avgPerformance = results.performance.reduce((a, b) => a + b, 0) / results.performance.length
    results.minPerformance = Math.min(...results.performance)
    results.maxPerformance = Math.max(...results.performance)
    
    // Calculate advanced metrics
    results.advancedMetrics = {
      falsePositiveRate: (results.falsePositives.length / this.testCases.legitimate.length * 100).toFixed(2) + '%',
      falseNegativeRate: (results.falseNegatives.length / this.testCases.spam.length * 100).toFixed(2) + '%',
      precision: results.total > 0 ? ((results.correct - results.falsePositives.length) / (results.correct - results.falsePositives.length + results.falsePositives.length) * 100).toFixed(2) + '%' : '0%',
      recall: results.total > 0 ? ((results.correct - results.falseNegatives.length) / (results.correct - results.falseNegatives.length + results.falseNegatives.length) * 100).toFixed(2) + '%' : '0%'
    }
    
    return results
  }
  
  displaySuperRoundResults(results) {
    console.log(chalk.gray(`  📊 Detailed Results:`))
    console.log(chalk.gray(`     Accuracy: ${results.accuracy.toFixed(1)}%`))
    console.log(chalk.gray(`     False Positives: ${results.falsePositives.length} (${results.advancedMetrics.falsePositiveRate})`))
    console.log(chalk.gray(`     False Negatives: ${results.falseNegatives.length} (${results.advancedMetrics.falseNegativeRate})`))
    console.log(chalk.gray(`     Performance: ${results.avgPerformance.toFixed(1)}ms avg (${results.minPerformance}-${results.maxPerformance}ms)`))
    console.log(chalk.gray(`     Precision: ${results.advancedMetrics.precision}`))
    console.log(chalk.gray(`     Recall: ${results.advancedMetrics.recall}`))
    
    // Show problematic categories
    const problemCategories = Object.entries(results.categoryBreakdown)
      .filter(([_, data]) => data.errors.length > 0)
      .map(([category, data]) => `${category} (${data.errors.length} errors)`)
    
    if (problemCategories.length > 0) {
      console.log(chalk.red(`     🚩 Problem Categories: ${problemCategories.join(', ')}`))
    }
  }
  
  analyzeSuperResults() {
    console.log(chalk.magenta('\n🏆 ULTIMATE CONFIGURATION CHAMPION'))
    console.log(chalk.magenta('=' .repeat(60)))
    console.log(chalk.yellow(`Champion: ${this.bestConfiguration.name}`))
    console.log(chalk.yellow(`Ultimate Accuracy: ${this.bestAccuracy.toFixed(2)}%`))
    
    // Find the champion round
    const championRound = this.rounds.find(r => r.results.accuracy === this.bestAccuracy)
    
    console.log(chalk.cyan('\n🎯 Champion Performance:'))
    console.log(chalk.gray(`False Positives: ${championRound.results.falsePositives.length}`))
    console.log(chalk.gray(`False Negatives: ${championRound.results.falseNegatives.length}`))
    console.log(chalk.gray(`Processing Speed: ${championRound.results.avgPerformance.toFixed(1)}ms average`))
    console.log(chalk.gray(`Precision: ${championRound.results.advancedMetrics.precision}`))
    console.log(chalk.gray(`Recall: ${championRound.results.advancedMetrics.recall}`))
    
    console.log(chalk.cyan('\n⚙️ Champion Configuration:'))
    console.log(chalk.gray(JSON.stringify(this.bestConfiguration.config, null, 2)))
    
    // Show accuracy comparison across all rounds
    console.log(chalk.cyan('\n📈 All Configurations Performance:'))
    this.rounds.forEach(round => {
      const color = round.results.accuracy === this.bestAccuracy ? chalk.green : 
                    round.results.accuracy >= 95 ? chalk.yellow : chalk.gray
      console.log(color(`  ${round.configuration.name}: ${round.results.accuracy.toFixed(1)}%`))
    })
  }
  
  generateSuperReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testType: 'super_advanced',
      totalTestCases: this.testCases.legitimate.length + this.testCases.spam.length,
      summary: {
        totalRounds: this.rounds.length,
        bestAccuracy: this.bestAccuracy,
        bestConfiguration: this.bestConfiguration
      },
      rounds: this.rounds.map(round => ({
        round: round.round,
        name: round.configuration.name,
        accuracy: round.results.accuracy,
        falsePositives: round.results.falsePositives.length,
        falseNegatives: round.results.falseNegatives.length,
        avgPerformance: round.results.avgPerformance,
        advancedMetrics: round.results.advancedMetrics,
        categoryBreakdown: round.results.categoryBreakdown
      })),
      recommendations: this.generateSuperRecommendations()
    }
    
    try {
      fs.writeFileSync('tests/super-advanced-test-report.json', JSON.stringify(report, null, 2))
      console.log(chalk.green('\n📄 Ultimate test report saved to tests/super-advanced-test-report.json'))
    } catch (error) {
      console.log(chalk.red('\n⚠️ Could not save report file:', error.message))
    }
  }
  
  generateSuperRecommendations() {
    const recommendations = []
    
    // Analyze champion round for insights
    const championRound = this.rounds.find(r => r.results.accuracy === this.bestAccuracy)
    
    if (championRound.results.falsePositives.length > 0) {
      const fpCategories = championRound.results.falsePositives.map(fp => fp.category)
      const uniqueFpCategories = [...new Set(fpCategories)]
      uniqueFpCategories.forEach(category => {
        recommendations.push(`Further enhance ${category} context detection`)
      })
    }
    
    if (championRound.results.falseNegatives.length > 0) {
      const fnCategories = championRound.results.falseNegatives.map(fn => fn.category)
      const uniqueFnCategories = [...new Set(fnCategories)]
      uniqueFnCategories.forEach(category => {
        recommendations.push(`Strengthen ${category} detection patterns`)
      })
    }
    
    // Performance recommendations
    if (championRound.results.avgPerformance > 50) {
      recommendations.push('Consider performance optimizations for production use')
    }
    
    if (this.bestAccuracy < 98) {
      recommendations.push('Fine-tune layer weights for even higher accuracy')
    }
    
    return recommendations
  }
}

// Command line interface
const program = new Command()

program
  .name('super-advanced-test')
  .description('Ultimate advanced testing framework for ContentGuard')
  .action(async () => {
    const framework = new SuperAdvancedTestFramework()
    await framework.runSuperTest()
  })

// Run if called directly
if (require.main === module) {
  program.parse()
}

module.exports = { SuperAdvancedTestFramework } 