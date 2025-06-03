#!/usr/bin/env node

/**
 * ContentGuard CLI Tool v2.1
 * 
 * Enhanced command-line interface for content analysis with detailed explanations
 */

const { ContentGuard, presets, createGuard } = require('../index.js')
const { program } = require('commander')
const chalk = require('chalk')

program
  .name('contentguard')
  .description('Analyze content for spam, toxicity, and harassment')
  .version('4.5.0')

program
  .argument('<text>', 'Text to analyze')
  .option('-p, --preset <preset>', 'Use preset configuration (strict, moderate, lenient, gaming, professional)', 'moderate')
  .option('-v, --variant <variant>', 'Use v4.7 variant (fast, balanced, large, turbo, ultra)', 'balanced')
  .option('-t, --threshold <number>', 'Custom spam threshold', parseFloat)
  .option('-e, --explain', 'Show detailed explanation of the analysis')
  .option('-j, --json', 'Output results as JSON')
  .option('-d, --debug', 'Enable debug mode')
  .option('--performance', 'Show detailed performance metrics')
  .option('--plugins', 'Show plugin breakdown')
  .action(async (text, options) => {
    try {
      // Validate variant
      const validVariants = ['fast', 'balanced', 'large', 'turbo']
      if (!validVariants.includes(options.variant.toLowerCase())) {
        console.error(chalk.red(`❌ Unknown variant: ${options.variant}`))
        console.log(chalk.yellow('Available variants: fast, balanced, large, turbo, ultra'))
        process.exit(1)
      }
      
      // v4.7 variants have their own optimized configurations
      // Only apply basic user overrides, not legacy presets
      let config = {
        debug: options.debug || false
      }
      
      if (options.threshold) {
        config.spamThreshold = options.threshold
      }
      
      // Create the appropriate ContentGuard variant
      const guard = createGuard(options.variant, config)
      
      // Analyze the text
      const startTime = Date.now()
      const result = await guard.analyze({ message: text })
      const totalTime = Date.now() - startTime
      
      if (options.json) {
        console.log(JSON.stringify(result, null, 2))
        return
      }
      
      // Display results
      console.log(chalk.bold('\n🛡️  ContentGuard v4.7 Analysis Results'))
      console.log('=' .repeat(60))
      console.log(`🚀 Variant: ${chalk.cyan(options.variant.toUpperCase())}`)
      console.log();
      
      // Risk level with colors and emojis
      const riskColors = {
        'CLEAN': chalk.green,
        'LOW': chalk.yellow,
        'MEDIUM': chalk.orange,
        'HIGH': chalk.red,
        'CRITICAL': chalk.red.bold
      }
      
      const riskEmojis = {
        'CLEAN': '✅',
        'LOW': '⚠️',
        'MEDIUM': '🔶',
        'HIGH': '🚨',
        'CRITICAL': '💀'
      }
      
      const riskColor = riskColors[result.riskLevel] || chalk.white
      const riskEmoji = riskEmojis[result.riskLevel] || '❓'
      
      console.log(`📊 Score: ${chalk.bold(result.score)} / ${result.preset?.spamThreshold || 'N/A'}`)
      console.log(`${riskEmoji} Risk Level: ${riskColor(result.riskLevel || 'UNKNOWN')}`)
      console.log(`🎯 Classification: ${result.isSpam ? chalk.red('SPAM') : chalk.green('CLEAN')}`)
      console.log(`🤖 Confidence: ${result.confidence}`)
      console.log(`💡 Recommendation: ${result.recommendation || (result.isSpam ? 'Content may be inappropriate' : 'Content appears safe')}`)
      
      // Plugin breakdown
      if (options.plugins || options.explain) {
        console.log(`\n🔌 Plugin Breakdown:`)
        if (result.metadata) {
          Object.entries(result.metadata).forEach(([pluginName, pluginResult]) => {
            if (pluginName.startsWith('_') || !pluginResult || typeof pluginResult !== 'object' || !pluginResult.score === undefined) return // Skip meta fields
            
            const score = pluginResult.score || 0
            const scoreColor = score === 0 ? chalk.green : score < 5 ? chalk.yellow : chalk.red
            
            console.log(`   ${pluginName.toUpperCase()}: ${scoreColor(score + ' points')}`)
            
            if (pluginResult.flags && pluginResult.flags.length > 0 && options.explain) {
              pluginResult.flags.forEach(flag => {
                console.log(`     • ${chalk.gray(flag)}`)
              })
            }
          })
        }
      }
      
      // Detailed explanation
      if (options.explain && result.flags.length > 0) {
        console.log(`\n🔍 Detection Details:`)
        result.flags.forEach(flag => {
          if (flag.includes('[POSITIVE]')) {
            console.log(`   ${chalk.green('✓')} ${flag}`)
          } else {
            console.log(`   ${chalk.red('⚠')} ${flag}`)
          }
        })
      }
      
      // Performance metrics
      if (options.performance || options.debug) {
        console.log(`\n⚡ Performance Metrics:`)
        console.log(`   Analysis time: ${result.metadata?.performance?.processingTime || result.processingTime || 'N/A'}ms`)
        console.log(`   CLI overhead: ${totalTime - (result.metadata?.performance?.processingTime || result.processingTime || 0)}ms`)
        console.log(`   Cache status: ${result.fromCache ? chalk.green('HIT') : chalk.yellow('MISS')}`)
        console.log(`   Early exit: ${result.metadata?.earlyExit ? chalk.yellow('YES') : chalk.green('NO')}`)
        
        // Try to get metrics, but don't fail if the method doesn't exist
        try {
          const metrics = guard.getMetrics ? guard.getMetrics() : guard.getPerformanceMetrics()
          if (metrics && !metrics.error) {
            console.log(`   Cache efficiency: ${metrics.cacheEfficiency || 'N/A'}`)
            console.log(`   Total analyses: ${metrics.totalAnalyses || 'N/A'}`)
            if (metrics.averageTime) {
              console.log(`   Average time: ${metrics.averageTime}`)
            }
            if (metrics.variant) {
              console.log(`   Variant: ${metrics.variant}`)
            }
          }
        } catch (error) {
          console.log(`   Metrics: ${chalk.yellow('Not available for this variant')}`)
        }
      }
      
      // Standard info
      console.log(`\n📋 Analysis Info:`)
      console.log(`   ContentGuard version: v${result.version || result.metadata?.version || '4.5.0'}`)
      console.log(`   Variant: ${result.variant || options.variant}`)
      console.log(`   Plugins: ${result.metadata?.performance?.pluginsUsed?.join(', ') || 'N/A'}`)
      console.log(`   Timestamp: ${result.timestamp ? new Date(result.timestamp).toLocaleString() : new Date().toLocaleString()}`)
      
      // Exit with appropriate code
      process.exit(result.isSpam ? 1 : 0)
      
    } catch (error) {
      console.error(chalk.red(`❌ Analysis failed: ${error.message}`))
      if (options.debug) {
        console.error(error.stack)
      }
      process.exit(2)
    }
  })

// Enhanced examples command
program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(chalk.bold('\n🛡️  ContentGuard CLI Examples'))
    console.log('=' .repeat(60))
    
    const examples = [
      {
        desc: 'Basic analysis with balanced variant',
        cmd: 'contentguard "Hello, this is a test message"'
      },
      {
        desc: 'Use large variant for maximum accuracy',
        cmd: 'contentguard "Some text" --variant large --explain'
      },
      {
        desc: 'Use turbo variant for maximum speed',
        cmd: 'contentguard "Some text" --variant turbo --performance'
      },
      {
        desc: 'Fast variant with custom threshold',
        cmd: 'contentguard "Some text" --variant fast --threshold 3 --plugins'
      },
      {
        desc: 'Professional preset with large variant',
        cmd: 'contentguard "urgent critical issue" --variant large --preset professional --explain'
      },
      {
        desc: 'Gaming context with fast variant',
        cmd: 'contentguard "git gud noob" --variant fast --preset gaming --explain'
      },
      {
        desc: 'Full detailed analysis with large variant',
        cmd: 'contentguard "Some text" --variant large --explain --plugins --performance'
      },
      {
        desc: 'JSON output for automation',
        cmd: 'contentguard "Some text" --variant balanced --json'
      }
    ]
    
    examples.forEach(example => {
      console.log(`\n${chalk.yellow(example.desc)}:`)
      console.log(`  ${chalk.cyan(example.cmd)}`)
    })
    
    console.log(`\n${chalk.bold('🎛️  Available Options:')}`)
    console.log('  --variant <name>    Use v4.7 variant (fast, balanced, large, turbo, ultra)')
    console.log('  --preset <name>     Use predefined configuration')
    console.log('  --threshold <num>   Set custom spam threshold')
    console.log('  --explain           Show detailed detection breakdown')
    console.log('  --plugins           Show per-plugin score breakdown')
    console.log('  --performance       Show performance metrics')
    console.log('  --json              Output raw JSON (for automation)')
    console.log('  --debug             Enable debug mode')
    
    console.log(`\n${chalk.bold('🚀 v4.7 Variants:')}`)
    console.log('  • fast       - Ultra-fast analysis (~0.05ms, 90%+ accuracy)')
    console.log('  • balanced   - Optimal speed/accuracy balance (~0.3ms, 93%+ accuracy)')
    console.log('  • large      - Maximum accuracy (~1.5ms, 94%+ accuracy)')
    console.log('  • turbo      - Extreme speed (~0.02ms, 91%+ accuracy)')
    console.log('  • ultra      - Experimental high accuracy (slow)')
    
    console.log(`\n${chalk.bold('🎯 Available presets:')}`)
    console.log('  • strict       - High sensitivity, low tolerance (threshold: 3)')
    console.log('  • moderate     - Balanced detection (default, threshold: 5)')
    console.log('  • lenient      - Lower sensitivity, higher tolerance (threshold: 8)')
    console.log('  • gaming       - Optimized for gaming communities (threshold: 4)')
    console.log('  • professional - Context-aware for business use (threshold: 6)')
  })

// Enhanced presets command
program
  .command('presets')
  .description('List available presets and their configurations')
  .action(() => {
    console.log(chalk.bold('\n🛡️  ContentGuard Presets Configuration'))
    console.log('=' .repeat(60))
    
    Object.entries(presets).forEach(([name, config]) => {
      console.log(`\n${chalk.yellow.bold(name.toUpperCase())}:`)
      console.log(`  ${chalk.green('Threshold:')} ${config.spamThreshold}`)
      console.log(`  ${chalk.green('Plugins:')}`)
      Object.entries(config.plugins || {}).forEach(([plugin, pluginConfig]) => {
        const weight = pluginConfig.weight || 1.0
        const weightColor = weight > 1 ? chalk.red : weight < 1 ? chalk.yellow : chalk.green
        console.log(`    • ${plugin}: ${weightColor(`weight ${weight}`)}`)
        if (pluginConfig.contextAware) {
          console.log(`      ${chalk.blue('(context-aware)')}`)
        }
      })
      
      // Add use case recommendations
      const useCases = {
        strict: '📝 Forums, comments, user-generated content',
        moderate: '💬 General chat, contact forms, feedback',
        lenient: '📚 Academic, educational, professional forums',
        gaming: '🎮 Gaming communities, Discord servers',
        professional: '🏢 Business communications, enterprise'
      }
      
      if (useCases[name]) {
        console.log(`  ${chalk.blue('Best for:')} ${useCases[name]}`)
      }
    })
    
    console.log(`\n${chalk.bold('💡 Usage Tips:')}`)
    console.log('  • Use --explain to see why content was flagged')
    console.log('  • Use --plugins to see per-plugin breakdown')
    console.log('  • Professional preset includes context awareness')
    console.log('  • Gaming preset understands gaming terminology')
  })

// Benchmark command  
program
  .command('benchmark')
  .description('Run performance benchmark')
  .option('-i, --iterations <number>', 'Number of iterations', '100')
  .option('-v, --variant <variant>', 'Test specific variant (fast, balanced, large, turbo, ultra)', 'all')
  .action(async (options) => {
    console.log(chalk.bold('\n🚀 ContentGuard v4.7 Performance Benchmark'))
    console.log('=' .repeat(50))
    
    const iterations = parseInt(options.iterations)
    const testCases = [
      'Hello, this is a professional inquiry.',
      'you are trash and should kill yourself',
      'Critical emergency medical assistance needed',
      'URGENT BUSINESS PROPOSAL CLICK HERE NOW',
      'Engineering analysis shows ratio calculation'
    ]
    
    const variants = options.variant === 'all' ? ['fast', 'balanced', 'large', 'turbo'] : [options.variant]
    
    console.log(`Running ${iterations} iterations with ${testCases.length} test cases...`)
    
    for (const variant of variants) {
      console.log(`\n🚀 Testing ${chalk.cyan(variant.toUpperCase())} variant...`)
      
      const guard = createGuard(variant, { debug: false })
      const startTime = Date.now()
      const results = []
      
      for (let i = 0; i < iterations; i++) {
        for (const testCase of testCases) {
          const result = await guard.analyze(testCase)
          results.push(result)
        }
      }
      
      const endTime = Date.now()
      const totalTime = endTime - startTime
      const totalTests = iterations * testCases.length
      const avgTime = totalTime / totalTests
      
      console.log(`   Total tests: ${chalk.bold(totalTests)}`)
      console.log(`   Total time: ${chalk.bold(totalTime + 'ms')}`)
      console.log(`   Average: ${chalk.green(avgTime.toFixed(3) + 'ms')} per analysis`)
      console.log(`   Throughput: ${chalk.green(Math.round(1000 / avgTime))} analyses/sec`)
      
      // Performance grade
      let grade = 'F'
      if (avgTime < 0.1) grade = 'A+'
      else if (avgTime < 0.5) grade = 'A'
      else if (avgTime < 1) grade = 'B'
      else if (avgTime < 5) grade = 'C'
      else if (avgTime < 10) grade = 'D'
      
      const gradeColor = grade.startsWith('A') ? chalk.green : grade === 'B' ? chalk.yellow : chalk.red
      console.log(`   Performance grade: ${gradeColor.bold(grade)}`)
      
      // Accuracy estimate (simplified)
      const spamCount = results.filter(r => r.isSpam).length
      console.log(`   Spam detection rate: ${chalk.blue((spamCount / totalTests * 100).toFixed(1) + '%')}`)
    }
    
    console.log(`\n💡 ${chalk.bold('Variant Recommendations:')}`)
    console.log('  🏃 fast     - High-volume, real-time applications')
    console.log('  ⚖️  balanced - General-purpose, production use')
    console.log('  🎯 large    - Critical content moderation')
    console.log('  ⚡ turbo    - Ultra high-throughput systems')
  })

program.parse() 