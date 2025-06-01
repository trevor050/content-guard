#!/usr/bin/env node

/**
 * ContentGuard CLI Analyzer
 * 
 * Interactive command-line tool for analyzing content with full customization.
 */

const { ContentGuard } = require('../index.js')
const chalk = require('chalk')
const { Command } = require('commander')
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

class ContentGuardCLI {
  constructor() {
    this.guard = new ContentGuard()
    this.savedConfigurations = this.loadSavedConfigurations()
  }
  
  loadSavedConfigurations() {
    try {
      const configPath = path.join(__dirname, '..', 'configs', 'saved-configs.json')
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'))
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Could not load saved configurations'))
    }
    
    return {
      'strict': {
        spamThreshold: 3,
        contextAware: true,
        layerWeights: { obscenity: 1.5, sentiment: 1.3, custom: 1.4, textModerate: 1.2, patterns: 1.1 }
      },
      'balanced': {
        spamThreshold: 5,
        contextAware: true,
        layerWeights: { obscenity: 1.0, sentiment: 1.0, custom: 1.0, textModerate: 1.0, patterns: 1.0 }
      },
      'lenient': {
        spamThreshold: 8,
        contextAware: true,
        layerWeights: { obscenity: 0.8, sentiment: 0.8, custom: 0.9, textModerate: 0.9, patterns: 0.9 }
      }
    }
  }
  
  saveConfiguration(name, config) {
    this.savedConfigurations[name] = config
    
    try {
      const configDir = path.join(__dirname, '..', 'configs')
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
      }
      
      fs.writeFileSync(
        path.join(configDir, 'saved-configs.json'),
        JSON.stringify(this.savedConfigurations, null, 2)
      )
      
      console.log(chalk.green(`✅ Configuration '${name}' saved successfully`))
    } catch (error) {
      console.log(chalk.red(`❌ Failed to save configuration: ${error.message}`))
    }
  }
  
  async interactiveMode() {
    console.log(chalk.cyan('🛡️ ContentGuard Interactive Analyzer'))
    console.log(chalk.cyan('=' .repeat(50)))
    
    while (true) {
      const action = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'Analyze Content',
            'Configure Settings',
            'Load Configuration',
            'Save Configuration',
            'Batch Analysis',
            'Performance Test',
            'Exit'
          ]
        }
      ])
      
      switch (action.action) {
        case 'Analyze Content':
          await this.analyzeContent()
          break
        case 'Configure Settings':
          await this.configureSettings()
          break
        case 'Load Configuration':
          await this.loadConfiguration()
          break
        case 'Save Configuration':
          await this.saveCurrentConfiguration()
          break
        case 'Batch Analysis':
          await this.batchAnalysis()
          break
        case 'Performance Test':
          await this.performanceTest()
          break
        case 'Exit':
          console.log(chalk.green('👋 Goodbye!'))
          process.exit(0)
      }
      
      console.log('') // Add spacing
    }
  }
  
  async analyzeContent() {
    const input = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Name (optional):'
      },
      {
        type: 'input',
        name: 'email',
        message: 'Email (optional):'
      },
      {
        type: 'input',
        name: 'subject',
        message: 'Subject (optional):'
      },
      {
        type: 'editor',
        name: 'message',
        message: 'Message content:',
        default: 'Enter your message here...'
      },
      {
        type: 'input',
        name: 'ip',
        message: 'IP Address (optional):'
      }
    ])
    
    console.log(chalk.yellow('\n🔍 Analyzing content...'))
    
    const startTime = Date.now()
    const result = await this.guard.analyze(input)
    const processingTime = Date.now() - startTime
    
    this.displayAnalysisResult(result, processingTime)
  }
  
  displayAnalysisResult(result, processingTime) {
    console.log(chalk.cyan('\n📊 Analysis Results'))
    console.log(chalk.cyan('=' .repeat(30)))
    
    // Main classification
    const statusColor = result.isSpam ? chalk.red : chalk.green
    const statusIcon = result.isSpam ? '🚨' : '✅'
    
    console.log(`${statusIcon} Classification: ${statusColor(result.isSpam ? 'SPAM' : 'CLEAN')}`)
    console.log(`📈 Score: ${chalk.yellow(result.score)} / ${result.threshold}`)
    console.log(`⚠️ Risk Level: ${this.getRiskLevelColor(result.riskLevel)(result.riskLevel)}`)
    console.log(`🎯 Confidence: ${chalk.gray(result.confidence)}`)
    console.log(`⚡ Processing Time: ${chalk.gray(processingTime)}ms`)
    
    // Layer breakdown
    if (result.layerAnalysis) {
      console.log(chalk.cyan('\n🔬 Layer Analysis'))
      Object.entries(result.layerAnalysis).forEach(([layer, analysis]) => {
        const layerColor = analysis.score > 5 ? chalk.red : analysis.score > 2 ? chalk.yellow : chalk.green
        console.log(`  ${layer.toUpperCase()}: ${layerColor(analysis.score)} points`)
      })
    }
    
    // Flags
    if (result.flags && result.flags.length > 0) {
      console.log(chalk.cyan('\n🚩 Detection Flags'))
      result.flags.forEach(flag => {
        const flagColor = flag.startsWith('[POSITIVE]') ? chalk.green : chalk.red
        console.log(`  ${flagColor(flag)}`)
      })
    }
    
    // Recommendation
    console.log(chalk.cyan('\n💡 Recommendation'))
    console.log(`  ${this.getRecommendationColor(result.recommendation)(result.recommendation)}`)
  }
  
  getRiskLevelColor(riskLevel) {
    switch (riskLevel) {
      case 'CRITICAL': return chalk.red.bold
      case 'HIGH': return chalk.red
      case 'MEDIUM': return chalk.yellow
      case 'LOW': return chalk.yellow
      case 'CLEAN': return chalk.green
      default: return chalk.gray
    }
  }
  
  getRecommendationColor(recommendation) {
    if (recommendation.includes('Block')) return chalk.red
    if (recommendation.includes('Allow')) return chalk.green
    return chalk.yellow
  }
  
  async configureSettings() {
    const currentConfig = this.guard.options
    
    const newConfig = await inquirer.prompt([
      {
        type: 'number',
        name: 'spamThreshold',
        message: 'Spam threshold (1-20):',
        default: currentConfig.spamThreshold,
        validate: (input) => input >= 1 && input <= 20
      },
      {
        type: 'confirm',
        name: 'contextAware',
        message: 'Enable context awareness?',
        default: currentConfig.contextAware
      },
      {
        type: 'confirm',
        name: 'debug',
        message: 'Enable debug mode?',
        default: currentConfig.debug
      },
      {
        type: 'number',
        name: 'obscenityWeight',
        message: 'Obscenity detection weight (0.1-3.0):',
        default: currentConfig.layerWeights.obscenity,
        validate: (input) => input >= 0.1 && input <= 3.0
      },
      {
        type: 'number',
        name: 'sentimentWeight',
        message: 'Sentiment analysis weight (0.1-3.0):',
        default: currentConfig.layerWeights.sentiment,
        validate: (input) => input >= 0.1 && input <= 3.0
      },
      {
        type: 'number',
        name: 'customWeight',
        message: 'Custom patterns weight (0.1-3.0):',
        default: currentConfig.layerWeights.custom,
        validate: (input) => input >= 0.1 && input <= 3.0
      }
    ])
    
    // Update configuration
    this.guard.configure({
      spamThreshold: newConfig.spamThreshold,
      contextAware: newConfig.contextAware,
      debug: newConfig.debug,
      layerWeights: {
        obscenity: newConfig.obscenityWeight,
        sentiment: newConfig.sentimentWeight,
        custom: newConfig.customWeight,
        textModerate: currentConfig.layerWeights.textModerate,
        patterns: currentConfig.layerWeights.patterns
      }
    })
    
    console.log(chalk.green('✅ Configuration updated successfully'))
  }
  
  async loadConfiguration() {
    const configChoices = Object.keys(this.savedConfigurations)
    
    if (configChoices.length === 0) {
      console.log(chalk.yellow('⚠️ No saved configurations found'))
      return
    }
    
    const choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'config',
        message: 'Select configuration to load:',
        choices: configChoices
      }
    ])
    
    const selectedConfig = this.savedConfigurations[choice.config]
    this.guard.configure(selectedConfig)
    
    console.log(chalk.green(`✅ Configuration '${choice.config}' loaded successfully`))
    console.log(chalk.gray('Current settings:'))
    console.log(chalk.gray(JSON.stringify(selectedConfig, null, 2)))
  }
  
  async saveCurrentConfiguration() {
    const input = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Configuration name:',
        validate: (input) => input.length > 0
      }
    ])
    
    this.saveConfiguration(input.name, this.guard.options)
  }
  
  async batchAnalysis() {
    const input = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Path to JSON file with test data:',
        validate: (input) => fs.existsSync(input)
      }
    ])
    
    try {
      const testData = JSON.parse(fs.readFileSync(input.filePath, 'utf8'))
      
      console.log(chalk.yellow(`\n🔍 Analyzing ${testData.length} items...`))
      
      const results = []
      for (let i = 0; i < testData.length; i++) {
        const item = testData[i]
        const result = await this.guard.analyze(item)
        results.push({ ...item, result })
        
        process.stdout.write(`\r${'█'.repeat(Math.floor((i + 1) / testData.length * 20))}${'░'.repeat(20 - Math.floor((i + 1) / testData.length * 20))} ${i + 1}/${testData.length}`)
      }
      
      console.log('\n')
      this.displayBatchResults(results)
      
    } catch (error) {
      console.log(chalk.red(`❌ Error processing file: ${error.message}`))
    }
  }
  
  displayBatchResults(results) {
    const spam = results.filter(r => r.result.isSpam)
    const clean = results.filter(r => r.result.isSpam === false)
    const avgScore = results.reduce((sum, r) => sum + r.result.score, 0) / results.length
    
    console.log(chalk.cyan('\n📊 Batch Analysis Results'))
    console.log(chalk.cyan('=' .repeat(30)))
    console.log(`Total Items: ${chalk.yellow(results.length)}`)
    console.log(`Spam Detected: ${chalk.red(spam.length)} (${(spam.length / results.length * 100).toFixed(1)}%)`)
    console.log(`Clean Content: ${chalk.green(clean.length)} (${(clean.length / results.length * 100).toFixed(1)}%)`)
    console.log(`Average Score: ${chalk.yellow(avgScore.toFixed(1))}`)
    
    // Risk level breakdown
    const riskLevels = {}
    results.forEach(r => {
      riskLevels[r.result.riskLevel] = (riskLevels[r.result.riskLevel] || 0) + 1
    })
    
    console.log(chalk.cyan('\n📈 Risk Level Breakdown'))
    Object.entries(riskLevels).forEach(([level, count]) => {
      console.log(`  ${level}: ${chalk.yellow(count)} items`)
    })
  }
  
  async performanceTest() {
    const input = await inquirer.prompt([
      {
        type: 'number',
        name: 'iterations',
        message: 'Number of iterations to run:',
        default: 100,
        validate: (input) => input > 0 && input <= 10000
      }
    ])
    
    const testMessage = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Performance Test',
      message: 'This is a performance test message to measure processing speed and throughput.'
    }
    
    console.log(chalk.yellow(`\n⚡ Running ${input.iterations} iterations...`))
    
    const times = []
    const startTime = Date.now()
    
    for (let i = 0; i < input.iterations; i++) {
      const iterStart = Date.now()
      await this.guard.analyze(testMessage)
      times.push(Date.now() - iterStart)
      
      if (i % 10 === 0) {
        process.stdout.write(`\r${i}/${input.iterations} completed`)
      }
    }
    
    const totalTime = Date.now() - startTime
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    const throughput = Math.round(1000 / avgTime)
    
    console.log(chalk.cyan('\n\n⚡ Performance Results'))
    console.log(chalk.cyan('=' .repeat(25)))
    console.log(`Total Time: ${chalk.yellow(totalTime)}ms`)
    console.log(`Average Time: ${chalk.yellow(avgTime.toFixed(2))}ms`)
    console.log(`Min Time: ${chalk.green(minTime)}ms`)
    console.log(`Max Time: ${chalk.red(maxTime)}ms`)
    console.log(`Throughput: ${chalk.yellow(throughput)} messages/second`)
  }
}

// Command line interface
const program = new Command()

program
  .name('contentguard-analyze')
  .description('Interactive ContentGuard analyzer')
  .option('-i, --interactive', 'Run in interactive mode', true)
  .option('-f, --file <path>', 'Analyze file content')
  .option('-t, --text <text>', 'Analyze text directly')
  .option('-c, --config <name>', 'Load saved configuration')
  .action(async (options) => {
    const cli = new ContentGuardCLI()
    
    if (options.config) {
      await cli.loadConfiguration()
    }
    
    if (options.text) {
      const result = await cli.guard.analyze({ message: options.text })
      cli.displayAnalysisResult(result, 0)
    } else if (options.file) {
      try {
        const content = fs.readFileSync(options.file, 'utf8')
        const result = await cli.guard.analyze({ message: content })
        cli.displayAnalysisResult(result, 0)
      } catch (error) {
        console.error(chalk.red('Error reading file:', error.message))
      }
    } else {
      await cli.interactiveMode()
    }
  })

// Run if called directly
if (require.main === module) {
  program.parse()
}

module.exports = { ContentGuardCLI } 