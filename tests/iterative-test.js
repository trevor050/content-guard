#!/usr/bin/env node

/**
 * ContentGuard - Advanced Iterative Testing Framework
 * 
 * Runs 5 rounds of testing with different configurations to optimize accuracy.
 * Provides detailed analysis and recommendations for improvements.
 */

const { ContentGuard } = require('../index.js')
const chalk = require('chalk')
const { Command } = require('commander')
const ora = require('ora')
const fs = require('fs')
const path = require('path')

class IterativeTestFramework {
  constructor() {
    this.rounds = []
    this.currentRound = 0
    this.bestConfiguration = null
    this.bestAccuracy = 0
    
    // Test configurations to try
    this.configurations = [
      {
        name: 'Balanced Default',
        config: {
          spamThreshold: 5,
          contextAware: true,
          layerWeights: { obscenity: 1.0, sentiment: 1.0, custom: 1.0, textModerate: 1.0, patterns: 1.0 }
        }
      },
      {
        name: 'Strict Detection',
        config: {
          spamThreshold: 3,
          contextAware: true,
          layerWeights: { obscenity: 1.5, sentiment: 1.3, custom: 1.4, textModerate: 1.2, patterns: 1.1 }
        }
      },
      {
        name: 'Context-Heavy',
        config: {
          spamThreshold: 6,
          contextAware: true,
          technicalTermsBonus: -8,
          academicTermsBonus: -6,
          professionalKeywordBonus: -4,
          layerWeights: { obscenity: 0.8, sentiment: 0.9, custom: 1.2, textModerate: 1.0, patterns: 1.0 }
        }
      },
      {
        name: 'Performance Optimized',
        config: {
          spamThreshold: 5,
          contextAware: false,
          enableLayers: { 
            obscenity: true, 
            sentiment: true, 
            textModerate: false, // Disable slower layer
            custom: true, 
            ipReputation: false, // Disable for speed
            patterns: true 
          }
        }
      },
      {
        name: 'Ultra Sensitive',
        config: {
          spamThreshold: 2,
          contextAware: true,
          layerWeights: { obscenity: 2.0, sentiment: 1.8, custom: 1.6, textModerate: 1.5, patterns: 1.3 },
          technicalTermsBonus: -10,
          academicTermsBonus: -8,
          professionalKeywordBonus: -6
        }
      }
    ]
    
    this.testCases = this.generateTestCases()
  }
  
  generateTestCases() {
    return {
      // Legitimate content that should NOT be flagged
      legitimate: [
        {
          category: 'Academic Research',
          name: 'Dr. Emily Chen',
          email: 'echen@mit.edu',
          subject: 'Critical Analysis of Structural Ratios',
          message: 'Our research shows critical stress ratios in engineering design. Urgent review needed for publication deadline.',
          expected: false
        },
        {
          category: 'Medical Emergency',
          name: 'Dr. Sarah Johnson',
          email: 'sjohnson@hospital.org',
          subject: 'Patient Critical Status',
          message: 'Critical patient requiring urgent intervention. Medication concentration ratios need immediate adjustment.',
          expected: false
        },
        {
          category: 'Technical DevOps',
          name: 'DevOps Engineer',
          email: 'admin@tech.com',
          subject: 'Production System Kill Process',
          message: 'Need to kill stuck processes on production. The kill -9 command is not responding. Critical system failure.',
          expected: false
        },
        {
          category: 'Business Finance',
          name: 'Financial Analyst',
          email: 'analyst@corp.com',
          subject: 'Critical Financial Ratio Analysis',
          message: 'The debt-to-equity ratio shows critical risk levels. Urgent action needed before market close.',
          expected: false
        },
        {
          category: 'Legal Professional',
          name: 'Attorney Smith',
          email: 'smith@lawfirm.com',
          subject: 'Case Evidence Ratio',
          message: 'Critical analysis of evidence ratios for upcoming trial. Urgent review required before hearing.',
          expected: false
        },
        {
          category: 'Educational Content',
          name: 'Professor Williams',
          email: 'williams@university.edu',
          subject: 'Statistical Methodology',
          message: 'Students need help with ratio calculations in critical thinking exercises. Assessment deadline approaching.',
          expected: false
        },
        {
          category: 'Engineering Safety',
          name: 'Safety Engineer',
          email: 'safety@aerospace.com',
          subject: 'Critical Design Review',
          message: 'Stress-strain ratios indicate critical failure points. Urgent design revision needed to prevent catastrophic failure.',
          expected: false
        },
        {
          category: 'Game Development',
          name: 'Game Designer',
          email: 'dev@gamedev.com',
          subject: 'Game Balance Analysis',
          message: 'Player damage ratio is unbalanced. Critical gameplay issues affecting user experience.',
          expected: false
        }
      ],
      
      // Spam/toxic content that SHOULD be flagged
      spam: [
        {
          category: 'Direct Harassment',
          name: 'ToxicUser',
          email: 'toxic@temp.com',
          subject: 'You suck',
          message: 'You are a f*cking idiot and should kill yourself. Nobody likes you, you worthless piece of sh*t.',
          expected: true
        },
        {
          category: 'Subtle Harassment',
          name: 'Concerned Citizen',
          email: 'concerned@email.com',
          subject: 'Feedback',
          message: 'People like you are clearly not cut out for this work. Maybe you should consider a different career where you can do less damage to society.',
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
          category: 'Scam Professional',
          name: 'Business Opportunity',
          email: 'opportunity@business.com',
          subject: 'Exclusive Investment',
          message: 'Dear Sir/Madam, Exclusive investment opportunity guaranteeing 500% returns. Completely risk-free and legitimate. Send $1000 immediately.',
          expected: true
        },
        {
          category: 'Coded Harassment',
          name: 'Patriot1488',
          email: 'freedom@america.com',
          subject: 'Traditional Values',
          message: 'We need to preserve our heritage from the great replacement. Traditional values are under attack by globalists.',
          expected: true
        },
        {
          category: 'Evasion Leetspeak',
          name: 'Troll',
          email: 'troll@evil.com',
          subject: 'Message',
          message: 'y0u 4r3 such 4 f4gg0t 4nd sh0uld k1ll y0ur53lf y0u p13c3 0f 5h1t',
          expected: true
        },
        {
          category: 'Evasion Dotted',
          name: 'Hater',
          email: 'hate@mail.com',
          subject: 'Review',
          message: 'k.i.l.l y.o.u.r.s.e.l.f you w.o.r.t.h.l.e.s.s p.i.e.c.e of t.r.a.s.h',
          expected: true
        },
        {
          category: 'Manipulation Threat',
          name: 'Investigator',
          email: 'investigate@research.com',
          subject: 'Public Information',
          message: 'I found interesting information about you online. Your address and workplace. It would be unfortunate if this became widely known.',
          expected: true
        },
        {
          category: 'Modern Trolling',
          name: 'BasedChad',
          email: 'based@sigma.com',
          subject: 'Opinion',
          message: 'this is so cringe bro. imagine being this much of a beta cuck. touch grass and get some bitches you absolute npc',
          expected: true
        },
        {
          category: 'Concern Trolling',
          name: 'Concerned Parent',
          email: 'parent@family.com',
          subject: 'Website Concern',
          message: 'As a concerned parent, your website promotes degeneracy and corrupts children. People like you are destroying traditional family values.',
          expected: true
        }
      ]
    }
  }
  
  async runAllRounds() {
    console.log(chalk.cyan('🧪 ContentGuard - Advanced Iterative Testing Framework'))
    console.log(chalk.cyan('=' .repeat(70)))
    console.log(chalk.yellow(`Testing ${this.configurations.length} configurations across multiple rounds...\n`))
    
    for (let i = 0; i < this.configurations.length; i++) {
      this.currentRound = i + 1
      await this.runRound(this.configurations[i])
    }
    
    this.analyzeBestConfiguration()
    this.generateReport()
    
    return {
      rounds: this.rounds,
      bestConfiguration: this.bestConfiguration,
      bestAccuracy: this.bestAccuracy
    }
  }
  
  async runRound(configuration) {
    const spinner = ora(`Round ${this.currentRound}: Testing ${configuration.name}`).start()
    
    try {
      const guard = new ContentGuard(configuration.config)
      const results = await this.testConfiguration(guard, configuration)
      
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
      
      this.displayRoundResults(results)
      
    } catch (error) {
      spinner.fail(chalk.red(`Round ${this.currentRound} failed: ${error.message}`))
    }
    
    console.log('')
  }
  
  async testConfiguration(guard, configuration) {
    const results = {
      total: 0,
      correct: 0,
      falsePositives: [],
      falseNegatives: [],
      performance: [],
      accuracy: 0
    }
    
    // Test legitimate content
    for (const test of this.testCases.legitimate) {
      const startTime = Date.now()
      const result = await guard.analyze(test)
      const processingTime = Date.now() - startTime
      
      results.total++
      results.performance.push(processingTime)
      
      if (result.isSpam === test.expected) {
        results.correct++
      } else {
        results.falsePositives.push({
          ...test,
          actualResult: result.isSpam,
          score: result.score,
          flags: result.flags
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
      
      if (result.isSpam === test.expected) {
        results.correct++
      } else {
        results.falseNegatives.push({
          ...test,
          actualResult: result.isSpam,
          score: result.score,
          flags: result.flags
        })
      }
    }
    
    results.accuracy = (results.correct / results.total) * 100
    results.avgPerformance = results.performance.reduce((a, b) => a + b, 0) / results.performance.length
    
    return results
  }
  
  displayRoundResults(results) {
    console.log(chalk.gray(`  📊 Results:`))
    console.log(chalk.gray(`     Accuracy: ${results.accuracy.toFixed(1)}%`))
    console.log(chalk.gray(`     False Positives: ${results.falsePositives.length}`))
    console.log(chalk.gray(`     False Negatives: ${results.falseNegatives.length}`))
    console.log(chalk.gray(`     Avg Performance: ${results.avgPerformance.toFixed(1)}ms`))
    
    if (results.falsePositives.length > 0) {
      console.log(chalk.red(`     🚩 FP Categories: ${results.falsePositives.map(fp => fp.category).join(', ')}`))
    }
    
    if (results.falseNegatives.length > 0) {
      console.log(chalk.red(`     🚩 FN Categories: ${results.falseNegatives.map(fn => fn.category).join(', ')}`))
    }
  }
  
  analyzeBestConfiguration() {
    console.log(chalk.green('\n🏆 BEST CONFIGURATION FOUND'))
    console.log(chalk.green('=' .repeat(50)))
    console.log(chalk.yellow(`Configuration: ${this.bestConfiguration.name}`))
    console.log(chalk.yellow(`Accuracy: ${this.bestAccuracy.toFixed(1)}%`))
    console.log(chalk.gray('\nConfiguration Details:'))
    console.log(chalk.gray(JSON.stringify(this.bestConfiguration.config, null, 2)))
    
    // Find the best round
    const bestRound = this.rounds.find(r => r.results.accuracy === this.bestAccuracy)
    
    console.log(chalk.cyan('\n📈 Performance Breakdown:'))
    console.log(chalk.gray(`False Positives: ${bestRound.results.falsePositives.length}`))
    console.log(chalk.gray(`False Negatives: ${bestRound.results.falseNegatives.length}`))
    console.log(chalk.gray(`Average Processing Time: ${bestRound.results.avgPerformance.toFixed(1)}ms`))
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
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
        avgPerformance: round.results.avgPerformance
      })),
      recommendations: this.generateRecommendations()
    }
    
    try {
      fs.writeFileSync('tests/iterative-test-report.json', JSON.stringify(report, null, 2))
      console.log(chalk.green('\n📄 Detailed report saved to tests/iterative-test-report.json'))
    } catch (error) {
      console.log(chalk.red('\n⚠️ Could not save report file:', error.message))
    }
  }
  
  generateRecommendations() {
    const recommendations = []
    
    // Analyze patterns across rounds
    const avgAccuracy = this.rounds.reduce((sum, r) => sum + r.results.accuracy, 0) / this.rounds.length
    const accuracySpread = Math.max(...this.rounds.map(r => r.results.accuracy)) - Math.min(...this.rounds.map(r => r.results.accuracy))
    
    if (accuracySpread > 10) {
      recommendations.push('High accuracy variance detected - configuration tuning is important')
    }
    
    if (avgAccuracy < 90) {
      recommendations.push('Consider adding more sophisticated detection layers')
    }
    
    // Analyze false positive patterns
    const allFalsePositives = this.rounds.flatMap(r => r.results.falsePositives)
    const fpCategories = {}
    allFalsePositives.forEach(fp => {
      fpCategories[fp.category] = (fpCategories[fp.category] || 0) + 1
    })
    
    Object.entries(fpCategories).forEach(([category, count]) => {
      if (count >= 2) {
        recommendations.push(`Improve ${category} context detection - appearing in multiple configurations`)
      }
    })
    
    // Analyze false negative patterns
    const allFalseNegatives = this.rounds.flatMap(r => r.results.falseNegatives)
    const fnCategories = {}
    allFalseNegatives.forEach(fn => {
      fnCategories[fn.category] = (fnCategories[fn.category] || 0) + 1
    })
    
    Object.entries(fnCategories).forEach(([category, count]) => {
      if (count >= 2) {
        recommendations.push(`Enhance ${category} detection - missed in multiple configurations`)
      }
    })
    
    return recommendations
  }
}

// Command line interface
const program = new Command()

program
  .name('iterative-test')
  .description('Advanced iterative testing framework for ContentGuard')
  .option('-r, --rounds <number>', 'Number of rounds to run', '5')
  .option('-c, --config <path>', 'Custom configuration file')
  .option('-o, --output <path>', 'Output report path', 'tests/iterative-test-report.json')
  .action(async (options) => {
    const framework = new IterativeTestFramework()
    
    if (options.config) {
      try {
        const customConfig = JSON.parse(fs.readFileSync(options.config, 'utf8'))
        framework.configurations = customConfig
      } catch (error) {
        console.error(chalk.red('Error loading custom configuration:', error.message))
        process.exit(1)
      }
    }
    
    await framework.runAllRounds()
  })

// Run if called directly
if (require.main === module) {
  program.parse()
}

module.exports = { IterativeTestFramework } 