#!/usr/bin/env node

/**
 * 🔥 COMBINED MASSIVE BENCHMARK RUNNER
 * 
 * Tests ContentGuard against comprehensive test suites:
 * - MassiveBenchmark v3 (632 cases)
 * - SecondaryMassiveBenchmark (~1000 cases)
 * 
 * Against all model variants:
 * - v4.0 Base
 * - v4.5-fast
 * - v4.5-balanced
 * - v4.5-turbo
 * - v4.5-large
 * 
 * Provides comparative analysis and combined results
 */

const fs = require('fs')
const path = require('path')
const { ContentGuard } = require('../index.js')

// Import benchmark classes
const { MassiveBenchmarkV4 } = require('./massive-benchmark-v3.js')

// Variant classes are required lazily in runModelTest to avoid unnecessary
// dependency loading when only specific models are tested. Some variants rely
// on optional packages that may not be installed in every environment. By
// deferring the require() calls we allow running a subset of models (for
// example only v4.5-turbo) without triggering missing-module errors.

class CombinedBenchmarkRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      models: {},
      summary: {
        totalCases: 0,
        bestModel: null,
        worstModel: null
      },
      detailedAnalysis: {
        benchmarkComparison: {},
        categoryBreakdown: {},
        failureAnalysis: {},
        performanceMetrics: {}
      }
    }
    // Default model configurations. Turbo is always included here so the runner
    // tests it out of the box even if no --versions flag is supplied.
    this.defaultModels = {
      'v4.0-base': { type: 'base', debug: false, enableCaching: false },
      'v4.5-fast': { type: 'variant', variant: 'fast', debug: false, enableCaching: false },
      'v4.5-balanced': { type: 'variant', variant: 'balanced', debug: false, enableCaching: false },
      'v4.5-turbo': { type: 'variant', variant: 'turbo', debug: false, enableCaching: false },
      'v4.5-large': {
        type: 'variant',
        variant: 'large',
        debug: false,
        enableCaching: false,
        // Optimal aggressiveness values from hyperparameter optimization (93.95% accuracy)
        aggressiveness: {
          deepPatternAnalysis: 7.478901446478936,
          mlEnsemble: 93.69511246596838,
          adversarialDetection: 37.078888811290554,
          linguisticFingerprinting: 35.88541648014674,
          crossCultural: 11.705793103891548
        }
      }
    }

    // Start with the full default set. This ensures turbo is always part of the
    // initial model list unless explicitly filtered via --versions.
    this.models = { ...this.defaultModels }
    
    // Parse command line arguments
    this.isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v')
    this.includeFull = process.argv.includes('--full') || process.argv.includes('-f')
    this.useWeighted = process.argv.includes('--weighted') || process.argv.includes('-w')
    this.showDetailed = process.argv.includes('--detailed') || process.argv.includes('-d')
    this.showFailures = process.argv.includes('--failures')
    this.showCategories = process.argv.includes('--categories')
    this.showPerformance = process.argv.includes('--performance')
    this.showComparison = process.argv.includes('--comparison')
    this.showExtensiveFailures = process.argv.includes('--extensive-failures')
    this.showCategoryMatrix = process.argv.includes('--category-matrix')
    this.showBenchmarkSplit = process.argv.includes('--benchmark-split')
    this.hardMode = process.argv.includes('--hard') || process.argv.includes('-H')
    
    // Parse number of failure examples to show (--examples 10)
    const examplesIndex = process.argv.findIndex(arg => arg === '--examples')
    this.failureExampleCount = 3 // default
    if (examplesIndex !== -1 && examplesIndex + 1 < process.argv.length) {
      const count = parseInt(process.argv[examplesIndex + 1])
      if (!isNaN(count) && count > 0) {
        this.failureExampleCount = Math.min(count, 20) // max 20 examples
        console.log(`📝 Showing ${this.failureExampleCount} failure examples per category`)
      }
    }
    
    // Parse specific versions to test (--versions v4.0-base,v4.5-large,v2.1-legacy)
    const versionsIndex = process.argv.findIndex(arg => arg === '--versions')
    if (versionsIndex !== -1 && versionsIndex + 1 < process.argv.length) {
      const requestedVersions = process.argv[versionsIndex + 1].split(',').map(v => v.trim())
      console.log(`🎯 Testing specific versions: ${requestedVersions.join(', ')}`)
      
      // Filter models to only include requested versions
      const filteredModels = {}
      requestedVersions.forEach(version => {
        if (this.defaultModels[version]) {
          filteredModels[version] = this.defaultModels[version]
        } else {
          console.warn(`⚠️  Unknown version: ${version}`)
        }
      })

      if (Object.keys(filteredModels).length > 0) {
        this.models = filteredModels
      } else {
        console.error('❌ No valid versions specified, using all models')
        this.models = { ...this.defaultModels }
      }
    }
    
    // Add legacy versions if --full flag is used
    if (this.includeFull) {
      console.log('🕒 Full mode enabled - including legacy versions')
      this.models = {
        ...this.models,
        'v3.0-legacy': { type: 'legacy', version: '3.0', commit: 'c049e98' },
        'v2.1-legacy': { type: 'legacy', version: '2.1', commit: '6873ca5' },
        'v1.02-legacy': { type: 'legacy', version: '1.02', commit: 'e0546c9' }
      }
    }
    
    // Configure weighted scoring if enabled
    if (this.useWeighted) {
      console.log('⚖️  Weighted scoring enabled - prioritizing harassment detection and clean content accuracy')
      this.weightingConfig = {
        harassmentWeight: 3.0,      // 3x weight for harassment categories
        cleanContentWeight: 1.5,    // 1.5x weight for clean content accuracy
        falsePositivepenalty: 2.0,  // 2x penalty for false positives
        falseNegativePenalty: 2.5   // 2.5x penalty for false negatives in harassment
      }
    }
  }

  async loadSecondaryBenchmark() {
    try {
      // Read and parse the secondary benchmark file
      const secondaryContent = fs.readFileSync('./tests/secondary-massive-benchmark.js', 'utf8')
      
      // Extract the secondaryBenchmarkCases object - handle potential syntax issues
      const match = secondaryContent.match(/const secondaryBenchmarkCases = ({[\s\S]*?});?\s*module\.exports/m)
      if (!match) {
        throw new Error('Could not parse secondary benchmark cases')
      }
      
      // Clean up the extracted object string to handle syntax issues
      let objectString = match[1]
      
      // Remove any trailing extra closing parentheses or semicolons before the closing brace
      objectString = objectString.replace(/[);]*\s*}$/, '}')
      
      // Use eval in a controlled way (safe since we control the file)
      const secondaryBenchmarkCases = eval(`(${objectString})`)
      
      // Convert to our test format
      const testCases = []
      
      Object.keys(secondaryBenchmarkCases).forEach(categoryKey => {
        const cases = secondaryBenchmarkCases[categoryKey]
        if (Array.isArray(cases)) {
          cases.forEach(testCase => {
            testCases.push({
              text: testCase.input,
              expected: testCase.expected,
              category: testCase.category || categoryKey.toLowerCase(),
              context: 'secondary_benchmark'
            })
          })
        }
      })
      
      console.log(`📊 Loaded ${testCases.length} secondary benchmark cases`)
      return testCases
    } catch (error) {
      console.error('❌ Failed to load secondary benchmark:', error.message)
      console.log('📋 Attempting alternative parsing method...')
      
      // Alternative parsing method using require (might work better)
      try {
        const secondaryBenchmarkCases = require('./secondary-massive-benchmark.js')
        const testCases = []
        
        Object.keys(secondaryBenchmarkCases).forEach(categoryKey => {
          const cases = secondaryBenchmarkCases[categoryKey]
          if (Array.isArray(cases)) {
            cases.forEach(testCase => {
              testCases.push({
                text: testCase.input,
                expected: testCase.expected,
                category: testCase.category || categoryKey.toLowerCase(),
                context: 'secondary_benchmark'
              })
            })
          }
        })
        
        console.log(`✅ Successfully loaded ${testCases.length} secondary benchmark cases via require`)
        return testCases
      } catch (requireError) {
        console.error('❌ Alternative parsing also failed:', requireError.message)
        return []
      }
    }
  }

  async runModelTest(modelName, modelConfig, testCases) {
    console.log(`\n🚀 Testing ${modelName}...`)
    console.log(`📊 Total test cases: ${testCases.length}`)
    
    const startTime = Date.now()
    
    // Initialize ContentGuard with specific variant configuration
    let guard
    if (modelConfig.type === 'legacy') {
      // For legacy versions, load from legacy directories
      console.log(`🕒 Loading legacy version ${modelConfig.version}...`)
      try {
        const legacyPath = path.resolve(__dirname, `../legacy-versions/v${modelConfig.version}/index.js`)
        
        // Check if the legacy path exists
        if (!fs.existsSync(legacyPath)) {
          throw new Error(`Legacy version path does not exist: ${legacyPath}`)
        }
        
        // Clear require cache for the legacy version
        delete require.cache[legacyPath]
        
        // Temporarily modify require paths for legacy dependencies
        const originalModulePaths = module.paths.slice()
        const legacyNodeModules = path.resolve(__dirname, `../legacy-versions/v${modelConfig.version}/node_modules`)
        if (fs.existsSync(legacyNodeModules)) {
          module.paths.unshift(legacyNodeModules)
        }
        
        try {
          console.log(`📦 Requiring legacy module from: ${legacyPath}`)
          
          // Add timeout for the require() call itself to prevent hanging
          const legacyModule = await Promise.race([
            new Promise((resolve, reject) => {
              try {
                const module = require(legacyPath)
                resolve(module)
              } catch (err) {
                reject(err)
              }
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Module loading timeout after 30 seconds')), 30000)
            )
          ])
          
          if (!legacyModule.ContentGuard) {
            throw new Error('ContentGuard class not found in legacy module')
          }
          
          console.log(`⚙️  Instantiating legacy ContentGuard v${modelConfig.version}...`)
          const LegacyContentGuard = legacyModule.ContentGuard
          
          // Use different config based on version to avoid compatibility issues
          let legacyOptions = { 
            debug: false, 
            enableCaching: false
          }
          
          if (modelConfig.version === '1.02') {
            // Ultra-minimal config for v1.02 to avoid dependency issues
            legacyOptions.enableLayers = {
              obscenity: true,
              sentiment: false,  // Disable sentiment to avoid wink issues
              custom: false,     // Disable custom patterns
              textModerate: false,
              nlp: false,
              patterns: false,   // Disable patterns that might cause issues
              ipReputation: false
            }
          }
          
          guard = new LegacyContentGuard(legacyOptions)
          console.log(`✅ Legacy version ${modelConfig.version} loaded successfully`)
          
        } finally {
          // Restore original module paths
          module.paths = originalModulePaths
        }
      } catch (error) {
        console.error(`❌ Failed to load legacy version ${modelConfig.version}:`, error.message)
        
        // For v1.02, if it's hanging too much, just skip it with a clear message
        if (modelConfig.version === '1.02' && error.message.includes('timeout')) {
          console.log('⚠️  v1.02 legacy version times out during loading - skipping due to compatibility issues')
          throw new Error(`v1.02 legacy version incompatible - module loading hangs (commit: e0546c9)`)
        }
        
        throw error
      }
    } else if (modelConfig.type === 'variant') {
      // For v4.5 variants, use the correct variant class
      const variantOptions = { 
        debug: modelConfig.debug, 
        enableCaching: modelConfig.enableCaching,
        aggressiveness: modelConfig.aggressiveness,
        ...modelConfig // Pass through all config options
      }
      
      switch (modelConfig.variant) {
        case 'fast': {
          const { ContentGuardV4Fast } = require('../lib/variants/v4-fast.js')
          guard = new ContentGuardV4Fast(variantOptions)
          break
        }
        case 'balanced': {
          const { ContentGuardV4Balanced } = require('../lib/variants/v4-balanced.js')
          guard = new ContentGuardV4Balanced(variantOptions)
          break
        }
        case 'large': {
          const ContentGuardV4Large = require('../lib/variants/v4-large.js')
          guard = new ContentGuardV4Large(variantOptions)
          break
        }
        case 'large-optimized': {
          // This variant is reserved for potential future use. It requires a
          // specialized implementation that isn't bundled with the repository.
          // The logic remains for backward compatibility, but will throw if
          // invoked without the appropriate module.
          const ContentGuardV4LargeOptimized = require('../lib/variants/v4-large-optimized.js')
          guard = new ContentGuardV4LargeOptimized(variantOptions)
          break
        }
        case 'turbo': {
          const { ContentGuardV4Turbo } = require('../lib/variants/v4-turbo.js')
          guard = new ContentGuardV4Turbo(variantOptions)
          break
        }
        default:
          throw new Error(`Unknown variant: ${modelConfig.variant}`)
      }
    } else {
      // For v4.0 base, use standard ContentGuard
      guard = new ContentGuard(modelConfig)
    }
    
    const results = {
      model: modelName,
      config: modelConfig,
      total: 0,
      correct: 0,
      incorrect: 0,
      falsePositives: 0,
      falseNegatives: 0,
      accuracy: 0,
      falsePositiveRate: 0,
      falseNegativeRate: 0,
      totalTime: 0,
      averageTime: 0,
      
      // DETAILED BENCHMARK BREAKDOWN
      benchmarkBreakdown: {
        primary: {
          name: 'MassiveBenchmark v3',
          total: 0,
          correct: 0,
          incorrect: 0,
          falsePositives: 0,
          falseNegatives: 0,
          accuracy: 0,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
          categories: {}
        },
        secondary: {
          name: 'SecondaryMassiveBenchmark',
          total: 0,
          correct: 0,
          incorrect: 0,
          falsePositives: 0,
          falseNegatives: 0,
          accuracy: 0,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
          categories: {}
        }
      },
      
      // DETAILED CATEGORY BREAKDOWN
      categories: {},
      
      // DETAILED FAILURE ANALYSIS
      failedCases: {
        falsePositives: [],
        falseNegatives: [],
        byCategory: {},
        byBenchmark: {
          primary: { falsePositives: [], falseNegatives: [] },
          secondary: { falsePositives: [], falseNegatives: [] }
        }
      },
      
      // PERFORMANCE METRICS
      performanceMetrics: {
        timeDistribution: {
          min: Infinity,
          max: 0,
          median: 0,
          p95: 0,
          p99: 0
        },
        processingTimes: []
      }
    }
    
    let processedCount = 0
    
    for (const testCase of testCases) {
      const testStartTime = Date.now()
      
      try {
        const result = await guard.analyze(testCase.text)
        const testEndTime = Date.now()
        const testTime = testEndTime - testStartTime
        
        // Track performance metrics
        results.totalTime += testTime
        results.performanceMetrics.processingTimes.push(testTime)
        results.performanceMetrics.timeDistribution.min = Math.min(results.performanceMetrics.timeDistribution.min, testTime)
        results.performanceMetrics.timeDistribution.max = Math.max(results.performanceMetrics.timeDistribution.max, testTime)
        
        results.total++
        
        // Determine which benchmark this case belongs to
        const benchmarkType = testCase.context === 'secondary_benchmark' ? 'secondary' : 'primary'
        const benchmark = results.benchmarkBreakdown[benchmarkType]
        benchmark.total++
        
        // Initialize category tracking for overall results
        if (!results.categories[testCase.category]) {
          results.categories[testCase.category] = {
            total: 0,
            correct: 0,
            incorrect: 0,
            falsePositives: 0,
            falseNegatives: 0,
            accuracy: 0,
            falsePositiveRate: 0,
            falseNegativeRate: 0,
            benchmarkBreakdown: {
              primary: { total: 0, correct: 0, incorrect: 0, falsePositives: 0, falseNegatives: 0 },
              secondary: { total: 0, correct: 0, incorrect: 0, falsePositives: 0, falseNegatives: 0 }
            }
          }
        }
        
        // Initialize category tracking for benchmark-specific results
        if (!benchmark.categories[testCase.category]) {
          benchmark.categories[testCase.category] = {
            total: 0,
            correct: 0,
            incorrect: 0,
            falsePositives: 0,
            falseNegatives: 0,
            accuracy: 0
          }
        }
        
        // Initialize failure tracking for this category
        if (!results.failedCases.byCategory[testCase.category]) {
          results.failedCases.byCategory[testCase.category] = {
            falsePositives: [],
            falseNegatives: []
          }
        }
        
        results.categories[testCase.category].total++
        results.categories[testCase.category].benchmarkBreakdown[benchmarkType].total++
        benchmark.categories[testCase.category].total++
        
        // FIXED: Use boolean comparison like hyperparameter optimizer for consistent results
        const predicted = result.isSpam ? true : false
        const actual = testCase.expected === 'SPAM'
        const isCorrect = predicted === actual
        
        const failureDetails = {
          text: testCase.text.substring(0, 150) + (testCase.text.length > 150 ? '...' : ''),
          fullText: testCase.text,
          category: testCase.category,
          context: testCase.context,
          benchmark: benchmarkType,
          expected: testCase.expected,
          predicted: predicted ? 'SPAM' : 'CLEAN',
          score: result.score,
          confidence: result.confidence,
          processingTime: testTime,
          riskLevel: result.riskLevel,
          flags: result.flags || [],
          details: result.details || {}
        }
        
        if (isCorrect) {
          results.correct++
          benchmark.correct++
          results.categories[testCase.category].correct++
          results.categories[testCase.category].benchmarkBreakdown[benchmarkType].correct++
          benchmark.categories[testCase.category].correct++
        } else {
          results.incorrect++
          benchmark.incorrect++
          results.categories[testCase.category].incorrect++
          results.categories[testCase.category].benchmarkBreakdown[benchmarkType].incorrect++
          benchmark.categories[testCase.category].incorrect++
          
          if (predicted && !actual) {
            // FALSE POSITIVE: predicted SPAM but expected CLEAN
            results.falsePositives++
            benchmark.falsePositives++
            results.categories[testCase.category].falsePositives++
            results.categories[testCase.category].benchmarkBreakdown[benchmarkType].falsePositives++
            benchmark.categories[testCase.category].falsePositives++
            
            results.failedCases.falsePositives.push(failureDetails)
            results.failedCases.byCategory[testCase.category].falsePositives.push(failureDetails)
            results.failedCases.byBenchmark[benchmarkType].falsePositives.push(failureDetails)
            
          } else if (!predicted && actual) {
            // FALSE NEGATIVE: predicted CLEAN but expected SPAM
            results.falseNegatives++
            benchmark.falseNegatives++
            results.categories[testCase.category].falseNegatives++
            results.categories[testCase.category].benchmarkBreakdown[benchmarkType].falseNegatives++
            benchmark.categories[testCase.category].falseNegatives++
            
            results.failedCases.falseNegatives.push(failureDetails)
            results.failedCases.byCategory[testCase.category].falseNegatives.push(failureDetails)
            results.failedCases.byBenchmark[benchmarkType].falseNegatives.push(failureDetails)
          }
        }
        
        processedCount++
        
        // Progress indicator
        if (processedCount % 200 === 0) {
          console.log(`Progress: ${processedCount}/${testCases.length} (${(processedCount / testCases.length * 100).toFixed(1)}%)`)
        }
        
      } catch (error) {
        console.error(`Error testing case ${processedCount + 1}: ${error.message}`)
      }
    }
    
    // Calculate final metrics for overall results
    results.accuracy = results.total > 0 ? (results.correct / results.total * 100) : 0
    results.falsePositiveRate = results.total > 0 ? (results.falsePositives / results.total * 100) : 0
    results.falseNegativeRate = results.total > 0 ? (results.falseNegatives / results.total * 100) : 0
    results.averageTime = results.total > 0 ? (results.totalTime / results.total) : 0
    
    // Calculate weighted scores if enabled
    if (this.useWeighted) {
      results.weightedMetrics = this.calculateWeightedScores(results)
      console.log(`📊 ${modelName} weighted score: ${results.weightedMetrics.weightedAccuracy.toFixed(2)}% (vs standard: ${results.accuracy.toFixed(2)}%)`)
    }
    
    // Calculate performance distribution
    const sortedTimes = results.performanceMetrics.processingTimes.sort((a, b) => a - b)
    const len = sortedTimes.length
    if (len > 0) {
      results.performanceMetrics.timeDistribution.median = sortedTimes[Math.floor(len / 2)]
      results.performanceMetrics.timeDistribution.p95 = sortedTimes[Math.floor(len * 0.95)]
      results.performanceMetrics.timeDistribution.p99 = sortedTimes[Math.floor(len * 0.99)]
    }
    
    // Calculate benchmark-specific metrics
    Object.values(results.benchmarkBreakdown).forEach(benchmark => {
      benchmark.accuracy = benchmark.total > 0 ? (benchmark.correct / benchmark.total * 100) : 0
      benchmark.falsePositiveRate = benchmark.total > 0 ? (benchmark.falsePositives / benchmark.total * 100) : 0
      benchmark.falseNegativeRate = benchmark.total > 0 ? (benchmark.falseNegatives / benchmark.total * 100) : 0
      
      // Calculate category accuracies within each benchmark
      Object.values(benchmark.categories).forEach(category => {
        category.accuracy = category.total > 0 ? (category.correct / category.total * 100) : 0
      })
    })
    
    // Calculate category accuracies
    Object.values(results.categories).forEach(category => {
      category.accuracy = category.total > 0 ? (category.correct / category.total * 100) : 0
      category.falsePositiveRate = category.total > 0 ? (category.falsePositives / category.total * 100) : 0
      category.falseNegativeRate = category.total > 0 ? (category.falseNegatives / category.total * 100) : 0
      
      // Calculate benchmark-specific category metrics
      Object.values(category.benchmarkBreakdown).forEach(benchmarkCat => {
        benchmarkCat.accuracy = benchmarkCat.total > 0 ? (benchmarkCat.correct / benchmarkCat.total * 100) : 0
        benchmarkCat.falsePositiveRate = benchmarkCat.total > 0 ? (benchmarkCat.falsePositives / benchmarkCat.total * 100) : 0
        benchmarkCat.falseNegativeRate = benchmarkCat.total > 0 ? (benchmarkCat.falseNegatives / benchmarkCat.total * 100) : 0
      })
    })
    
    console.log(`✅ ${modelName} completed: ${results.accuracy.toFixed(2)}% accuracy`)
    console.log(`   Primary Benchmark: ${results.benchmarkBreakdown.primary.accuracy.toFixed(2)}% | Secondary Benchmark: ${results.benchmarkBreakdown.secondary.accuracy.toFixed(2)}%`)
    console.log(`   False Positives: ${results.falsePositives} (${results.falsePositiveRate.toFixed(2)}%) | False Negatives: ${results.falseNegatives} (${results.falseNegativeRate.toFixed(2)}%)`)
    
    return results
  }

  async runCombinedBenchmark() {
    console.log('🔥 COMBINED MASSIVE BENCHMARK RUNNER')
    console.log('=' .repeat(60))
    
    // Load test cases from both benchmarks
    console.log('\n📈 Loading test cases...')
    
    // Load MassiveBenchmark v3 cases
    const massiveBenchmark = new MassiveBenchmarkV4()
    const primaryCases = massiveBenchmark.testCases
    console.log(`📊 Loaded ${primaryCases.length} primary benchmark cases`)
    
    // Load Secondary benchmark cases
    const secondaryCases = await this.loadSecondaryBenchmark()
    
    // Combine all test cases
    let allTestCases = [...primaryCases, ...secondaryCases]
    console.log(`🎯 Total combined test cases: ${allTestCases.length}`)

    if (this.hardMode) {
      console.log('🔥 Hard mode enabled - augmenting cases...')
      allTestCases = this.augmentTestCases(allTestCases)
      console.log(`🎮 Hard mode case count: ${allTestCases.length}`)
    }

    this.results.summary.totalCases = allTestCases.length
    
    // Test each model
    for (const [modelName, modelConfig] of Object.entries(this.models)) {
      try {
        console.log(`\n🚀 Starting test for ${modelName}...`)
        
        // Add timeout for legacy versions to prevent hanging
        let modelResults
        if (modelConfig.type === 'legacy') {
          console.log(`⏰ Testing legacy version ${modelConfig.version} with 60s timeout...`)
          modelResults = await Promise.race([
            this.runModelTest(modelName, modelConfig, allTestCases),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout after 60 seconds')), 60000)
            )
          ])
        } else {
          modelResults = await this.runModelTest(modelName, modelConfig, allTestCases)
        }
        
        this.results.models[modelName] = modelResults
      } catch (error) {
        console.error(`❌ Failed to test ${modelName}:`, error.message)
        
        // Provide more specific error messages for legacy versions
        let errorMessage = error.message
        if (modelConfig.type === 'legacy') {
          if (error.message.includes('Timeout')) {
            errorMessage = `Legacy version ${modelConfig.version} timed out after 60 seconds`
          } else if (error.message.includes('Cannot resolve module')) {
            errorMessage = `Legacy version ${modelConfig.version} has missing dependencies`
          } else {
            errorMessage = `Legacy version ${modelConfig.version} compatibility issue: ${error.message}`
          }
        }
        
        this.results.models[modelName] = {
          error: errorMessage,
          model: modelName,
          accuracy: 0,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
          averageTime: 0,
          total: 0,
          correct: 0,
          incorrect: 0,
          falsePositives: 0,
          falseNegatives: 0
        }
      }
    }
    
    this.generateComparativeReport()
  }

  generateComparativeReport() {
    console.log('\n' + '='.repeat(80))
    console.log('🔥 COMBINED BENCHMARK ANALYSIS')
    console.log('='.repeat(80))
    
    // Sort models by accuracy (or weighted accuracy if enabled) - FIXED: Add proper error handling
    const sortedModels = Object.entries(this.results.models)
      .filter(([_, results]) => !results.error && results.accuracy !== undefined)
      .sort(([,a], [,b]) => {
        if (this.useWeighted && a.weightedMetrics && b.weightedMetrics) {
          return b.weightedMetrics.compositeScore - a.weightedMetrics.compositeScore
        }
        return (b.accuracy || 0) - (a.accuracy || 0)
      })
    
    if (sortedModels.length === 0) {
      console.log('❌ No successful model tests completed')
      return
    }
    
    this.results.summary.bestModel = sortedModels[0][0]
    this.results.summary.worstModel = sortedModels[sortedModels.length - 1][0]
    
    // Always show core analysis
    this.generateConciseOverallComparison(sortedModels)
    this.generateCriticalIssuesOnly(sortedModels)
    
    // Show weighted analysis if enabled
    if (this.useWeighted) {
      this.generateWeightedAnalysis(sortedModels)
    }
    
    // Show specific analysis based on flags (these work independently)
    if (this.showFailures) {
      this.generateFailureAnalysis(sortedModels)
    }
    
    if (this.showCategories) {
      this.generateDetailedCategoryAnalysis(sortedModels)
    }
    
    if (this.showPerformance) {
      this.generatePerformanceAnalysis(sortedModels)
      this.generateSpeedLeaderboard(sortedModels)
    }
    
    if (this.showComparison) {
      this.generateOverallComparison(sortedModels)
      this.generateBenchmarkComparison(sortedModels)
    }
    
    if (this.showCategoryMatrix) {
      this.generateCategoryMatrix(sortedModels)
    }
    
    if (this.showBenchmarkSplit) {
      this.generateBenchmarkSplitAnalysis(sortedModels)
    }
    
    if (this.showExtensiveFailures) {
      this.generateExtensiveFailureAnalysis(sortedModels)
    }
    
    // Show all detailed analysis with --detailed or --verbose
    if (this.showDetailed || this.isVerbose) {
      console.log('\n' + '='.repeat(100))
      console.log('📋 DETAILED ANALYSIS (--detailed mode)')
      console.log('='.repeat(100))
      
      if (!this.showComparison) {
        this.generateOverallComparison(sortedModels)
        this.generateBenchmarkComparison(sortedModels)
      }
      
      if (!this.showCategories) {
        this.generateDetailedCategoryAnalysis(sortedModels)
      }
      
      if (!this.showFailures) {
        this.generateFailureAnalysis(sortedModels)
      }
      
      if (!this.showPerformance) {
        this.generatePerformanceAnalysis(sortedModels)
      }
    }
    
    this.generateActionableRecommendations(sortedModels)
    this.saveDetailedReport()
    
    if (!this.isVerbose && !this.showDetailed) {
      console.log('\n💡 Available flags:')
      console.log('   Basic Analysis:')
      console.log('     --verbose (-v): Full comprehensive analysis')
      console.log('     --detailed (-d): Show all detailed sections')
      console.log('')
      console.log('   Scoring Options:')
      console.log('     --weighted (-w): Use weighted scoring (3x harassment, 1.5x clean)')
      console.log('   Benchmark Difficulty:')
      console.log('     --hard (-H): Add noisy variants of every case for a tougher challenge')
      console.log('')
      console.log('   Specific Analysis:')
      console.log('     --failures: Show detailed failure analysis')
      console.log('     --extensive-failures: Show extensive failure examples')
      console.log('     --categories: Show category-by-category breakdown')
      console.log('     --category-matrix: Show cross-category performance matrix')
      console.log('     --performance: Show processing time and throughput metrics')
      console.log('     --comparison: Show detailed model comparisons')
      console.log('     --benchmark-split: Show primary vs secondary benchmark analysis')
      console.log('')
      console.log('   Model Selection:')
      console.log('     --versions model1,model2: Test specific versions only')
      console.log('       (e.g., --versions v4.0-base,v4.5-large,v2.1-legacy)')
      console.log('     --full (-f): Include all legacy versions (v3.0, v2.1, v1.02)')
      console.log('       Turbo is always included by default when no versions are specified')
      console.log('')
      console.log('   Output Control:')
      console.log('     --examples N: Show N failure examples per category (default: 3, max: 20)')
      console.log('')
      console.log('   Examples:')
      console.log('     node combined-benchmark-runner.js --weighted --failures --examples 5')
      console.log('     node combined-benchmark-runner.js --versions v4.5-large,v4.0-base --detailed')
      console.log('     node combined-benchmark-runner.js --full --weighted --category-matrix')
    }
  }

  generateConciseOverallComparison(sortedModels) {
    console.log(`\n📊 RESULTS (${this.results.summary.totalCases} cases):`)
    console.log('-'.repeat(95))
    console.log('Rank  Model          Overall  Primary  Secondary  FP Rate  Avg Time  Throughput  Status')
    console.log('-'.repeat(95))
    
    sortedModels.forEach(([modelName, results], index) => {
      const rank = index + 1
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  '
      const status = results.accuracy >= 85 ? '✅' : results.accuracy >= 70 ? '⚠️' : '❌'
      const throughput = Math.round(1000 / results.averageTime)
      
      console.log(
        `${medal}${rank}`.padEnd(6) +
        modelName.padEnd(14) +
        `${results.accuracy.toFixed(1)}%`.padEnd(9) +
        `${results.benchmarkBreakdown.primary.accuracy.toFixed(1)}%`.padEnd(9) +
        `${results.benchmarkBreakdown.secondary.accuracy.toFixed(1)}%`.padEnd(11) +
        `${results.falsePositiveRate.toFixed(1)}%`.padEnd(9) +
        `${results.averageTime.toFixed(2)}ms`.padEnd(10) +
        `${throughput}/s`.padEnd(12) +
        status
      )
    })
    
    const bestModel = sortedModels[0][1]
    const fastestModel = sortedModels.reduce((fastest, [name, results]) => 
      results.averageTime < fastest[1].averageTime ? [name, results] : fastest)
    
    console.log(`\nGap to 85% target: ${(85 - bestModel.accuracy).toFixed(1)}pp`)
    console.log(`Fastest model: ${fastestModel[0]} (${fastestModel[1].averageTime.toFixed(2)}ms, ${Math.round(1000/fastestModel[1].averageTime)}/s)`)
  }

  generateCriticalIssuesOnly(sortedModels) {
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    console.log(`\n🚨 CRITICAL ISSUES (${bestModelName}):`);
    
    // Only show categories with < 50% accuracy
    const criticalCategories = Object.entries(bestResults.categories)
      .filter(([_, stats]) => stats.accuracy < 50 && stats.total > 5)
      .sort(([,a], [,b]) => a.accuracy - b.accuracy)
      .slice(0, 8) // Top 8 worst
    
    criticalCategories.forEach(([category, stats]) => {
      const issue = stats.falseNegatives > stats.falsePositives ? 'Missing detection' : 'False alarms'
      console.log(`❌ ${category.replace(/_/g, ' ')}: ${stats.accuracy.toFixed(0)}% (${issue})`)
    })
    
    // Benchmark gap
    const primaryAcc = bestResults.benchmarkBreakdown.primary.accuracy
    const secondaryAcc = bestResults.benchmarkBreakdown.secondary.accuracy
    const gap = Math.abs(primaryAcc - secondaryAcc)
    if (gap > 10) {
      console.log(`⚠️  Benchmark gap: ${gap.toFixed(0)}pp (Primary: ${primaryAcc.toFixed(0)}% vs Secondary: ${secondaryAcc.toFixed(0)}%)`)
    }
  }

  generateOverallComparison(sortedModels) {
    console.log(`\n📊 OVERALL PERFORMANCE RANKINGS (${this.results.summary.totalCases} total cases):`)
    console.log('='.repeat(120))
    
    // Header
    console.log('Rank  Model           Overall    Primary    Secondary   FP Rate   FN Rate   Avg Time   Status')
    console.log('-'.repeat(120))
    
    sortedModels.forEach(([modelName, results], index) => {
      const rank = index + 1
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  '
      const status = results.accuracy >= 85 ? '✅ Target' : 
                   results.accuracy >= 70 ? '⚠️  Needs Work' : '❌ Critical'
      
      console.log(
        `${medal}${rank}`.padEnd(6) +
        modelName.padEnd(15) +
        `${results.accuracy.toFixed(1)}%`.padEnd(11) +
        `${results.benchmarkBreakdown.primary.accuracy.toFixed(1)}%`.padEnd(11) +
        `${results.benchmarkBreakdown.secondary.accuracy.toFixed(1)}%`.padEnd(12) +
        `${results.falsePositiveRate.toFixed(1)}%`.padEnd(10) +
        `${results.falseNegativeRate.toFixed(1)}%`.padEnd(10) +
        `${results.averageTime.toFixed(2)}ms`.padEnd(11) +
        status
      )
    })
    
    // Performance gaps analysis
    const bestModel = sortedModels[0][1]
    const worstModel = sortedModels[sortedModels.length - 1][1]
    
    console.log('\n📈 PERFORMANCE GAPS:')
    console.log(`🏆 Best: ${sortedModels[0][0]} (${bestModel.accuracy.toFixed(2)}% accuracy)`)
    console.log(`⚠️  Worst: ${sortedModels[sortedModels.length - 1][0]} (${worstModel.accuracy.toFixed(2)}% accuracy)`)
    console.log(`📊 Gap: ${(bestModel.accuracy - worstModel.accuracy).toFixed(2)} percentage points`)
    console.log(`⚡ Fastest: ${sortedModels.reduce((fastest, [name, results]) => 
      results.averageTime < fastest[1].averageTime ? [name, results] : fastest)[0]}`)
  }

  generateBenchmarkComparison(sortedModels) {
    console.log('\n' + '='.repeat(120))
    console.log('📋 DETAILED BENCHMARK-BY-BENCHMARK COMPARISON')
    console.log('='.repeat(120))
    
    console.log('\n🎯 PRIMARY BENCHMARK (MassiveBenchmark v3) RESULTS:')
    console.log('-'.repeat(100))
    console.log('Model           Accuracy   Correct/Total   FP Count   FN Count   FP Rate   FN Rate')
    console.log('-'.repeat(100))
    
    const primarySorted = sortedModels.sort(([,a], [,b]) => b.benchmarkBreakdown.primary.accuracy - a.benchmarkBreakdown.primary.accuracy)
    
    primarySorted.forEach(([modelName, results]) => {
      const primary = results.benchmarkBreakdown.primary
      console.log(
        modelName.padEnd(15) +
        `${primary.accuracy.toFixed(1)}%`.padEnd(11) +
        `${primary.correct}/${primary.total}`.padEnd(16) +
        `${primary.falsePositives}`.padEnd(11) +
        `${primary.falseNegatives}`.padEnd(11) +
        `${primary.falsePositiveRate.toFixed(1)}%`.padEnd(10) +
        `${primary.falseNegativeRate.toFixed(1)}%`
      )
    })
    
    console.log('\n🎯 SECONDARY BENCHMARK (SecondaryMassiveBenchmark) RESULTS:')
    console.log('-'.repeat(100))
    console.log('Model           Accuracy   Correct/Total   FP Count   FN Count   FP Rate   FN Rate')
    console.log('-'.repeat(100))
    
    const secondarySorted = sortedModels.sort(([,a], [,b]) => b.benchmarkBreakdown.secondary.accuracy - a.benchmarkBreakdown.secondary.accuracy)
    
    secondarySorted.forEach(([modelName, results]) => {
      const secondary = results.benchmarkBreakdown.secondary
      console.log(
        modelName.padEnd(15) +
        `${secondary.accuracy.toFixed(1)}%`.padEnd(11) +
        `${secondary.correct}/${secondary.total}`.padEnd(16) +
        `${secondary.falsePositives}`.padEnd(11) +
        `${secondary.falseNegatives}`.padEnd(11) +
        `${secondary.falsePositiveRate.toFixed(1)}%`.padEnd(10) +
        `${secondary.falseNegativeRate.toFixed(1)}%`
      )
    })
    
    // Cross-benchmark analysis
    console.log('\n📊 CROSS-BENCHMARK PERFORMANCE ANALYSIS:')
    sortedModels.forEach(([modelName, results]) => {
      const primaryAcc = results.benchmarkBreakdown.primary.accuracy
      const secondaryAcc = results.benchmarkBreakdown.secondary.accuracy
      const gap = primaryAcc - secondaryAcc
      const gapDirection = gap > 0 ? 'better on primary' : 'better on secondary'
      console.log(`${modelName}: ${Math.abs(gap).toFixed(1)}pp ${gapDirection}`)
    })
  }

  generateDetailedCategoryAnalysis(sortedModels) {
    console.log('\n' + '='.repeat(120))
    console.log('🔍 DETAILED CATEGORY-BY-CATEGORY ANALYSIS')
    console.log('='.repeat(120))
    
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    // Get all categories sorted by worst performance first
    const allCategories = Object.entries(bestResults.categories)
      .sort(([,a], [,b]) => a.accuracy - b.accuracy)
    
    console.log(`\n📊 CATEGORY BREAKDOWN - ALL MODELS:`)
    console.log('=' .repeat(150))
    
    // Show detailed header
    console.log('Category                    | v4.0-base | v4.5-fast | v4.5-balanced | v4.5-turbo | v4.5-large | Worst Issue')
    console.log('-'.repeat(150))
    
    allCategories.forEach(([categoryName, categoryStats]) => {
      const categoryNameDisplay = categoryName.toUpperCase().replace(/_/g, ' ').substring(0, 25).padEnd(25)
      let rowData = `${categoryNameDisplay} |`
      
      // Add each model's performance for this category
      sortedModels.forEach(([modelName, results]) => {
        const catStats = results.categories[categoryName] || { accuracy: 0, total: 0 }
        const accuracy = `${catStats.accuracy.toFixed(1)}%`.padEnd(9)
        rowData += ` ${accuracy} |`
      })
      
      // Identify the worst issue for this category
      const worstIssue = categoryStats.falsePositives > categoryStats.falseNegatives ? 'FP dominant' : 'FN dominant'
      rowData += ` ${worstIssue.padEnd(11)}`
      
      console.log(rowData)
    })
    
    console.log('\n🔬 DETAILED CATEGORY ANALYSIS - PER BENCHMARK:')
    console.log('='.repeat(120))
    
    allCategories.forEach(([categoryName, categoryStats]) => {
      console.log(`\n📂 ${categoryName.toUpperCase().replace(/_/g, ' ')}:`)
      console.log('-'.repeat(80))
      
      // Show performance across models and benchmarks
      console.log('Model           | Primary Acc | Secondary Acc | Total FP | Total FN | Primary FP | Secondary FP')
      console.log('-'.repeat(80))
      
      sortedModels.forEach(([modelName, results]) => {
        const catStats = results.categories[categoryName] || { 
          accuracy: 0, 
          falsePositives: 0, 
          falseNegatives: 0, 
          benchmarkBreakdown: { primary: { accuracy: 0, falsePositives: 0 }, secondary: { accuracy: 0, falsePositives: 0 } }
        }
        
        console.log(
          modelName.padEnd(15) +
          ` | ${catStats.benchmarkBreakdown.primary.accuracy.toFixed(1)}%`.padEnd(12) +
          ` | ${catStats.benchmarkBreakdown.secondary.accuracy.toFixed(1)}%`.padEnd(14) +
          ` | ${catStats.falsePositives}`.padEnd(9) +
          ` | ${catStats.falseNegatives}`.padEnd(9) +
          ` | ${catStats.benchmarkBreakdown.primary.falsePositives}`.padEnd(11) +
          ` | ${catStats.benchmarkBreakdown.secondary.falsePositives}`
        )
      })
    })
  }

  generateFailureAnalysis(sortedModels) {
    console.log('\n' + '='.repeat(120))
    console.log('💥 COMPREHENSIVE FAILURE ANALYSIS')
    console.log('='.repeat(120))
    
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    console.log(`\n🔍 DETAILED FAILURE BREAKDOWN - ${bestModelName.toUpperCase()}:`)
    console.log('='.repeat(100))
    
    // False Positives Analysis
    console.log('\n❌ FALSE POSITIVES (Legitimate content flagged as toxic):')
    console.log(`Total: ${bestResults.falsePositives} (${bestResults.falsePositiveRate.toFixed(2)}%)`)
    console.log('-'.repeat(100))
    
    // Group false positives by category
    const fpByCategory = {}
    bestResults.failedCases.falsePositives.forEach(fp => {
      if (!fpByCategory[fp.category]) fpByCategory[fp.category] = []
      fpByCategory[fp.category].push(fp)
    })
    
    Object.entries(fpByCategory)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10) // Top 10 worst categories
      .forEach(([category, fps]) => {
        console.log(`\n📂 ${category.toUpperCase().replace(/_/g, ' ')} (${fps.length} false positives):`)
        fps.slice(0, this.failureExampleCount).forEach((fp, i) => { // Show top 3 examples
          const confidenceStr = typeof fp.confidence === 'number' ? fp.confidence.toFixed(2) : (fp.confidence || 'N/A')
          console.log(`   ${i + 1}. "${fp.text}" (Score: ${fp.score}, Confidence: ${confidenceStr})`)
        })
      })
    
    // False Negatives Analysis
    console.log('\n❌ FALSE NEGATIVES (Toxic content not detected):')
    console.log(`Total: ${bestResults.falseNegatives} (${bestResults.falseNegativeRate.toFixed(2)}%)`)
    console.log('-'.repeat(100))
    
    // Group false negatives by category
    const fnByCategory = {}
    bestResults.failedCases.falseNegatives.forEach(fn => {
      if (!fnByCategory[fn.category]) fnByCategory[fn.category] = []
      fnByCategory[fn.category].push(fn)
    })
    
    Object.entries(fnByCategory)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10) // Top 10 worst categories
      .forEach(([category, fns]) => {
        console.log(`\n📂 ${category.toUpperCase().replace(/_/g, ' ')} (${fns.length} false negatives):`)
        fns.slice(0, this.failureExampleCount).forEach((fn, i) => { // Show top 3 examples
          const confidenceStr = typeof fn.confidence === 'number' ? fn.confidence.toFixed(2) : (fn.confidence || 'N/A')
          console.log(`   ${i + 1}. "${fn.text}" (Score: ${fn.score}, Confidence: ${confidenceStr})`)
        })
      })
    
    // Benchmark-specific failure analysis
    console.log('\n📊 FAILURE DISTRIBUTION BY BENCHMARK:')
    console.log('-'.repeat(60))
    console.log('Benchmark        | False Positives | False Negatives | Total Failures')
    console.log('-'.repeat(60))
    
    Object.entries(bestResults.benchmarkBreakdown).forEach(([benchmarkType, benchmark]) => {
      const totalFailures = benchmark.falsePositives + benchmark.falseNegatives
      console.log(
        benchmark.name.padEnd(16) +
        ` | ${benchmark.falsePositives}`.padEnd(16) +
        ` | ${benchmark.falseNegatives}`.padEnd(16) +
        ` | ${totalFailures}`
      )
    })
  }

  generatePerformanceAnalysis(sortedModels) {
    console.log('\n' + '='.repeat(120))
    console.log('⚡ PERFORMANCE METRICS ANALYSIS')
    console.log('='.repeat(120))
    
    console.log('\n📊 PROCESSING TIME DISTRIBUTION:')
    console.log('-'.repeat(100))
    console.log('Model           | Avg Time | Min Time | Max Time | Median   | 95th %ile | 99th %ile')
    console.log('-'.repeat(100))
    
    sortedModels.forEach(([modelName, results]) => {
      const perf = results.performanceMetrics.timeDistribution
      console.log(
        modelName.padEnd(15) +
        ` | ${results.averageTime.toFixed(2)}ms`.padEnd(9) +
        ` | ${perf.min.toFixed(2)}ms`.padEnd(9) +
        ` | ${perf.max.toFixed(2)}ms`.padEnd(9) +
        ` | ${perf.median.toFixed(2)}ms`.padEnd(9) +
        ` | ${perf.p95.toFixed(2)}ms`.padEnd(10) +
        ` | ${perf.p99.toFixed(2)}ms`
      )
    })
    
    // Throughput analysis
    console.log('\n🚀 THROUGHPUT ANALYSIS:')
    sortedModels.forEach(([modelName, results]) => {
      const throughput = Math.round(1000 / results.averageTime)
      console.log(`${modelName}: ~${throughput} analyses/second`)
    })
  }

  generateSpeedLeaderboard(sortedModels) {
    console.log('\n⚡ SPEED LEADERBOARD:')
    console.log('='.repeat(100))
    
    // Sort by speed (lowest average time first)
    const speedSorted = [...sortedModels].sort(([,a], [,b]) => a.averageTime - b.averageTime)
    
    console.log('Rank  Model           Avg Time   Throughput   Accuracy   Accuracy Rank   Speed vs Accuracy')
    console.log('-'.repeat(100))
    
    speedSorted.forEach(([modelName, results], index) => {
      const speedRank = index + 1
      const throughput = Math.round(1000 / results.averageTime)
      
      // Find accuracy rank
      const accuracyRank = sortedModels.findIndex(([name, _]) => name === modelName) + 1
      
      // Speed vs accuracy trade-off indicator
      const tradeOff = speedRank < accuracyRank ? '🏃‍♂️ Speed>' : 
                      speedRank > accuracyRank ? '🎯 Accuracy>' : '⚖️ Balanced'
      
      const speedMedal = speedRank === 1 ? '🥇' : speedRank === 2 ? '🥈' : speedRank === 3 ? '🥉' : '  '
      
      console.log(
        `${speedMedal}${speedRank}`.padEnd(6) +
        modelName.padEnd(15) +
        `${results.averageTime.toFixed(2)}ms`.padEnd(11) +
        `${throughput}/s`.padEnd(13) +
        `${results.accuracy.toFixed(1)}%`.padEnd(11) +
        `#${accuracyRank}`.padEnd(16) +
        tradeOff
      )
    })
    
    console.log('\n📊 SPEED vs ACCURACY ANALYSIS:')
    const fastest = speedSorted[0]
    const mostAccurate = sortedModels[0]
    
    if (fastest[0] !== mostAccurate[0]) {
      console.log(`⚡ Fastest: ${fastest[0]} (${fastest[1].averageTime.toFixed(2)}ms, ${fastest[1].accuracy.toFixed(1)}% accuracy)`)
      console.log(`🎯 Most Accurate: ${mostAccurate[0]} (${mostAccurate[1].accuracy.toFixed(1)}% accuracy, ${mostAccurate[1].averageTime.toFixed(2)}ms)`)
      console.log(`⚖️  Speed-Accuracy Trade-off: ${(mostAccurate[1].averageTime / fastest[1].averageTime).toFixed(1)}x slower for ${(mostAccurate[1].accuracy - fastest[1].accuracy).toFixed(1)}pp more accuracy`)
    } else {
      console.log(`🏆 ${fastest[0]} is both fastest AND most accurate!`)
    }
  }

  generateActionableRecommendations(sortedModels) {
    console.log('\n' + '='.repeat(120))
    console.log('💡 COMPREHENSIVE ACTIONABLE RECOMMENDATIONS')
    console.log('='.repeat(120))
    
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    console.log('\n🎯 IMMEDIATE PRIORITIES:')
    console.log('-'.repeat(60))
    
    if (bestResults.accuracy < 85) {
      console.log('📈 CRITICAL: No model achieved 85% accuracy target')
      console.log(`   Current best: ${bestModelName} at ${bestResults.accuracy.toFixed(2)}%`)
      console.log(`   Gap to target: ${(85 - bestResults.accuracy).toFixed(2)} percentage points`)
    }
    
    if (bestResults.falsePositiveRate > 2) {
      console.log('🎯 CRITICAL: False positive rate above 2% target')
      console.log(`   Current rate: ${bestResults.falsePositiveRate.toFixed(2)}%`)
      console.log(`   Excess: ${(bestResults.falsePositiveRate - 2).toFixed(2)} percentage points`)
    }
    
    // Category-specific recommendations
    console.log('\n🔧 CATEGORY-SPECIFIC IMPROVEMENTS NEEDED:')
    const worstCategories = Object.entries(bestResults.categories)
      .filter(([_, stats]) => stats.accuracy < 70)
      .sort(([,a], [,b]) => a.accuracy - b.accuracy)
      .slice(0, 5)
    
    worstCategories.forEach(([category, stats]) => {
      console.log(`❌ ${category.toUpperCase().replace(/_/g, ' ')}: ${stats.accuracy.toFixed(1)}% accuracy`)
      if (stats.falseNegatives > stats.falsePositives) {
        console.log(`   → Focus on detection (${stats.falseNegatives} false negatives vs ${stats.falsePositives} false positives)`)
      } else {
        console.log(`   → Focus on reducing false alarms (${stats.falsePositives} false positives vs ${stats.falseNegatives} false negatives)`)
      }
    })
    
    // Model selection recommendations
    console.log('\n🚀 DEPLOYMENT RECOMMENDATIONS:')
    console.log(`🏆 Production: ${bestModelName} (best overall accuracy)`)
    
    const fastestModel = sortedModels.reduce((fastest, [name, results]) => 
      results.averageTime < fastest[1].averageTime ? [name, results] : fastest)
    console.log(`⚡ High-throughput: ${fastestModel[0]} (${fastestModel[1].averageTime.toFixed(2)}ms avg)`)
    
    const bestFPModel = sortedModels.reduce((best, [name, results]) => 
      results.falsePositiveRate < best[1].falsePositiveRate ? [name, results] : best)
    console.log(`🎯 Low false positives: ${bestFPModel[0]} (${bestFPModel[1].falsePositiveRate.toFixed(2)}% FP rate)`)
    
    console.log('\n📊 Next steps: Focus benchmark development on worst-performing categories')
  }

  generateConciseCategoryAnalysis(sortedModels) {
    console.log('\n📊 CATEGORY PERFORMANCE SUMMARY (Best Model):')
    console.log('='.repeat(80))
    
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    // Group categories by performance level
    const critical = []  // < 30%
    const poor = []      // 30-60%
    const fair = []      // 60-85%
    const good = []      // 85%+
    
    Object.entries(bestResults.categories).forEach(([categoryName, stats]) => {
      const categoryData = { name: categoryName, ...stats }
      if (stats.accuracy < 30) critical.push(categoryData)
      else if (stats.accuracy < 60) poor.push(categoryData)
      else if (stats.accuracy < 85) fair.push(categoryData)
      else good.push(categoryData)
    })
    
    console.log(`\n❌ CRITICAL ISSUES (${critical.length} categories < 30% accuracy):`)
    critical.sort((a, b) => a.accuracy - b.accuracy).forEach(cat => {
      console.log(`   ${cat.name.replace(/_/g, ' ')}: ${cat.accuracy.toFixed(1)}% (${cat.falseNegatives} FN, ${cat.falsePositives} FP)`)
    })
    
    console.log(`\n⚠️  POOR PERFORMANCE (${poor.length} categories 30-60% accuracy):`)
    poor.sort((a, b) => a.accuracy - b.accuracy).slice(0, 5).forEach(cat => {
      console.log(`   ${cat.name.replace(/_/g, ' ')}: ${cat.accuracy.toFixed(1)}% (${cat.falseNegatives} FN, ${cat.falsePositives} FP)`)
    })
    
    console.log(`\n🔶 NEEDS IMPROVEMENT (${fair.length} categories 60-85% accuracy):`)
    fair.sort((a, b) => a.accuracy - b.accuracy).slice(0, 3).forEach(cat => {
      console.log(`   ${cat.name.replace(/_/g, ' ')}: ${cat.accuracy.toFixed(1)}% (${cat.falseNegatives} FN, ${cat.falsePositives} FP)`)
    })
    
    console.log(`\n✅ GOOD PERFORMANCE (${good.length} categories 85%+ accuracy):`)
    console.log(`   ${good.map(cat => cat.name.replace(/_/g, ' ')).join(', ')}`)
  }

  generateCriticalIssuesAnalysis(sortedModels) {
    console.log('\n🚨 CRITICAL ISSUES ANALYSIS:')
    console.log('='.repeat(80))
    
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    // Analyze the most critical problems
    console.log(`\n📊 ${bestModelName.toUpperCase()} PERFORMANCE GAPS:`)
    console.log(`   Overall Accuracy: ${bestResults.accuracy.toFixed(1)}% (Target: 85% - Gap: ${(85 - bestResults.accuracy).toFixed(1)}pp)`)
    console.log(`   False Positive Rate: ${bestResults.falsePositiveRate.toFixed(2)}% (Target: <2% - ${bestResults.falsePositiveRate > 2 ? 'EXCEEDED' : 'OK'})`)
    console.log(`   False Negative Rate: ${bestResults.falseNegativeRate.toFixed(2)}%`)
    
    // Primary vs Secondary performance
    const primaryAcc = bestResults.benchmarkBreakdown.primary.accuracy
    const secondaryAcc = bestResults.benchmarkBreakdown.secondary.accuracy
    console.log(`\n📋 BENCHMARK PERFORMANCE GAP:`)
    console.log(`   Primary (v3): ${primaryAcc.toFixed(1)}% | Secondary: ${secondaryAcc.toFixed(1)}% | Gap: ${Math.abs(primaryAcc - secondaryAcc).toFixed(1)}pp`)
    
    // Identify biggest failure categories
    const worstCategories = Object.entries(bestResults.categories)
      .filter(([_, stats]) => stats.total > 5) // Only categories with meaningful sample size
      .sort(([,a], [,b]) => (a.falseNegatives + a.falsePositives) - (b.falseNegatives + b.falsePositives))
      .slice(-5) // Top 5 worst
    
    console.log(`\n💥 HIGHEST FAILURE CATEGORIES:`)
    worstCategories.forEach(([category, stats]) => {
      const totalFailures = stats.falseNegatives + stats.falsePositives
      const dominantType = stats.falseNegatives > stats.falsePositives ? 'Missing toxicity' : 'False alarms'
      console.log(`   ${category.replace(/_/g, ' ')}: ${totalFailures} failures (${dominantType})`)
    })
    
    // Cross-model comparison for critical categories
    const criticalCategories = ['HARASSMENT', 'SOPHISTICATED_HARASSMENT', 'SOCIAL_ENGINEERING', 'WORKPLACE_HARASSMENT']
    console.log(`\n🔍 CRITICAL CATEGORY CROSS-MODEL COMPARISON:`)
    criticalCategories.forEach(category => {
      if (bestResults.categories[category]) {
        console.log(`\n   ${category.replace(/_/g, ' ')}:`)
        sortedModels.forEach(([modelName, results]) => {
          const catStats = results.categories[category] || { accuracy: 0, total: 0 }
          if (catStats.total > 0) {
            console.log(`     ${modelName}: ${catStats.accuracy.toFixed(1)}% (${catStats.correct}/${catStats.total})`)
          }
        })
      }
    })
  }

  saveDetailedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = `combined-benchmark-report-${timestamp}.json`
    
    // fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
    // console.log(`\n📄 Detailed combined report saved to: ${reportPath}`)
    
    // Also save a summary CSV for easy analysis
    const csvPath = `combined-benchmark-summary-${timestamp}.csv`
    const csvContent = this.generateCSVSummary()
    // fs.writeFileSync(csvPath, csvContent)
    // console.log(`📊 CSV summary saved to: ${csvPath}`)
    
    console.log(`\n📄 Report generation disabled (would save to: ${reportPath})`)
    console.log(`📊 CSV generation disabled (would save to: ${csvPath})`)
  }

  generateCSVSummary() {
    const headers = ['Model,Accuracy,False Positive Rate,False Negative Rate,Average Time (ms),Total Cases,Correct,Incorrect']
    const rows = Object.entries(this.results.models)
      .filter(([_, results]) => !results.error)
      .map(([modelName, results]) => {
        return [
          modelName,
          results.accuracy.toFixed(2),
          results.falsePositiveRate.toFixed(2),
          results.falseNegativeRate.toFixed(2),
          results.averageTime.toFixed(2),
          results.total,
          results.correct,
          results.incorrect
        ].join(',')
      })
    
    return [headers, ...rows].join('\n')
  }

  calculateWeightedScores(results) {
    let totalWeightedPoints = 0
    let totalMaxWeightedPoints = 0
    let weightedFalsePositives = 0
    let weightedFalseNegatives = 0
    let totalWeightedCases = 0
    
    const weights = this.weightingConfig
    
    // Calculate weighted scores by category
    Object.entries(results.categories).forEach(([categoryName, categoryStats]) => {
      let categoryWeight = 1.0
      
      // Apply special weights for harassment categories
      const harassmentCategories = [
        'harassment', 'sophisticated_harassment', 'workplace_harassment', 
        'subtle_harassment_edge_cases', 'social_engineering'
      ]
      
      // Apply special weights for clean content categories
      const cleanCategories = [
        'professional_clean', 'modern_clean', 'constructive_clean', 
        'emotional_clean', 'legitimate_content_trap_cases', 'sarcasm_clean'
      ]
      
      if (harassmentCategories.some(cat => categoryName.toLowerCase().includes(cat))) {
        categoryWeight = weights.harassmentWeight
      } else if (cleanCategories.some(cat => categoryName.toLowerCase().includes(cat))) {
        categoryWeight = weights.cleanContentWeight
      }
      
      // Calculate weighted points for this category
      const maxPoints = categoryStats.total * categoryWeight
      const earnedPoints = categoryStats.correct * categoryWeight
      
      totalMaxWeightedPoints += maxPoints
      totalWeightedPoints += earnedPoints
      
      // Apply penalties for false positives/negatives in important categories
      if (harassmentCategories.some(cat => categoryName.toLowerCase().includes(cat))) {
        weightedFalseNegatives += categoryStats.falseNegatives * weights.falseNegativePenalty
      } else {
        weightedFalseNegatives += categoryStats.falseNegatives
      }
      
      if (cleanCategories.some(cat => categoryName.toLowerCase().includes(cat))) {
        weightedFalsePositives += categoryStats.falsePositives * weights.falsePositivepenalty
      } else {
        weightedFalsePositives += categoryStats.falsePositives
      }
      
      totalWeightedCases += categoryStats.total * categoryWeight
    })
    
    // Calculate weighted metrics
    const weightedAccuracy = totalMaxWeightedPoints > 0 ? (totalWeightedPoints / totalMaxWeightedPoints * 100) : 0
    const weightedFalsePositiveRate = totalWeightedCases > 0 ? (weightedFalsePositives / totalWeightedCases * 100) : 0
    const weightedFalseNegativeRate = totalWeightedCases > 0 ? (weightedFalseNegatives / totalWeightedCases * 100) : 0
    
    // Calculate composite weighted score (higher is better)
    const compositeScore = weightedAccuracy - (weightedFalsePositiveRate * 0.5) - (weightedFalseNegativeRate * 0.7)
    
    return {
      weightedAccuracy,
      weightedFalsePositiveRate,
      weightedFalseNegativeRate,
      compositeScore,
      totalWeightedPoints,
      totalMaxWeightedPoints,
      categoryWeights: {
        harassment: weights.harassmentWeight,
        clean: weights.cleanContentWeight,
        fpPenalty: weights.falsePositivepenalty,
        fnPenalty: weights.falseNegativePenalty
      }
    }
  }

  generateWeightedAnalysis(sortedModels) {
    console.log('\n⚖️  WEIGHTED SCORING ANALYSIS:')
    console.log('='.repeat(105))
    console.log('Weighted scoring prioritizes harassment detection and clean content accuracy')
    console.log(`Weights: Harassment=${this.weightingConfig.harassmentWeight}x, Clean=${this.weightingConfig.cleanContentWeight}x, FP penalty=${this.weightingConfig.falsePositivepenalty}x, FN penalty=${this.weightingConfig.falseNegativePenalty}x`)
    console.log('-'.repeat(105))
    console.log('Rank  Model          Weighted   Standard   Composite   WFP Rate  WFN Rate  Avg Time  Throughput')
    console.log('-'.repeat(105))
    
    sortedModels.forEach(([modelName, results], index) => {
      if (results.weightedMetrics) {
        const rank = index + 1
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  '
        const throughput = Math.round(1000 / results.averageTime)
        
        console.log(
          `${medal}${rank}`.padEnd(6) +
          modelName.padEnd(14) +
          `${results.weightedMetrics.weightedAccuracy.toFixed(1)}%`.padEnd(11) +
          `${results.accuracy.toFixed(1)}%`.padEnd(11) +
          `${results.weightedMetrics.compositeScore.toFixed(1)}`.padEnd(12) +
          `${results.weightedMetrics.weightedFalsePositiveRate.toFixed(1)}%`.padEnd(10) +
          `${results.weightedMetrics.weightedFalseNegativeRate.toFixed(1)}%`.padEnd(10) +
          `${results.averageTime.toFixed(2)}ms`.padEnd(10) +
          `${throughput}/s`
        )
      }
    })
    
    // Show improvement analysis
    const bestWeighted = sortedModels[0][1]
    const standardSort = sortedModels.sort(([,a], [,b]) => b.accuracy - a.accuracy)
    const bestStandard = standardSort[0][1]
    const fastestModel = sortedModels.reduce((fastest, [name, results]) => 
      results.averageTime < fastest[1].averageTime ? [name, results] : fastest)
    
    console.log('\n📊 WEIGHTED vs STANDARD COMPARISON:')
    if (bestWeighted.weightedMetrics && bestStandard.accuracy !== bestWeighted.accuracy) {
      console.log(`Best by weighted: ${sortedModels[0][0]} (${bestWeighted.weightedMetrics.weightedAccuracy.toFixed(1)}% weighted)`)
      console.log(`Best by standard: ${standardSort[0][0]} (${bestStandard.accuracy.toFixed(1)}% standard)`)
      console.log(`Fastest overall: ${fastestModel[0]} (${fastestModel[1].averageTime.toFixed(2)}ms, ${Math.round(1000/fastestModel[1].averageTime)}/s)`)
      
      if (sortedModels[0][0] !== standardSort[0][0]) {
        console.log('🔄 Weighted scoring changed the ranking!')
      }
    }
  }

  generateCategoryMatrix(sortedModels) {
    console.log('\n📊 CROSS-CATEGORY PERFORMANCE MATRIX:')
    console.log('='.repeat(120))
    
    console.log('\n🎯 PRIMARY BENCHMARK (MassiveBenchmark v3) RESULTS:')
    console.log('-'.repeat(100))
    console.log('Model           | Accuracy   | FP Rate   | FN Rate')
    console.log('-'.repeat(100))
    
    const primarySorted = sortedModels.sort(([,a], [,b]) => b.benchmarkBreakdown.primary.accuracy - a.benchmarkBreakdown.primary.accuracy)
    
    primarySorted.forEach(([modelName, results]) => {
      const primary = results.benchmarkBreakdown.primary
      console.log(
        modelName.padEnd(15) +
        ` | ${primary.accuracy.toFixed(1)}%`.padEnd(11) +
        ` | ${primary.falsePositiveRate.toFixed(1)}%`.padEnd(9) +
        ` | ${primary.falseNegativeRate.toFixed(1)}%`
      )
    })
    
    console.log('\n🎯 SECONDARY BENCHMARK (SecondaryMassiveBenchmark) RESULTS:')
    console.log('-'.repeat(100))
    console.log('Model           | Accuracy   | FP Rate   | FN Rate')
    console.log('-'.repeat(100))
    
    const secondarySorted = sortedModels.sort(([,a], [,b]) => b.benchmarkBreakdown.secondary.accuracy - a.benchmarkBreakdown.secondary.accuracy)
    
    secondarySorted.forEach(([modelName, results]) => {
      const secondary = results.benchmarkBreakdown.secondary
      console.log(
        modelName.padEnd(15) +
        ` | ${secondary.accuracy.toFixed(1)}%`.padEnd(11) +
        ` | ${secondary.falsePositiveRate.toFixed(1)}%`.padEnd(9) +
        ` | ${secondary.falseNegativeRate.toFixed(1)}%`
      )
    })
  }

  generateBenchmarkSplitAnalysis(sortedModels) {
    console.log('\n📊 PRIMARY VS SECONDARY BENCHMARK ANALYSIS:')
    console.log('='.repeat(120))
    
    const primarySorted = sortedModels.sort(([,a], [,b]) => b.benchmarkBreakdown.primary.accuracy - a.benchmarkBreakdown.primary.accuracy)
    const secondarySorted = sortedModels.sort(([,a], [,b]) => b.benchmarkBreakdown.secondary.accuracy - a.benchmarkBreakdown.secondary.accuracy)
    
    console.log('\n🎯 PRIMARY BENCHMARK (MassiveBenchmark v3) RESULTS:')
    console.log('-'.repeat(100))
    console.log('Model           | Accuracy   | FP Rate   | FN Rate')
    console.log('-'.repeat(100))
    
    primarySorted.forEach(([modelName, results]) => {
      const primary = results.benchmarkBreakdown.primary
      console.log(
        modelName.padEnd(15) +
        ` | ${primary.accuracy.toFixed(1)}%`.padEnd(11) +
        ` | ${primary.falsePositiveRate.toFixed(1)}%`.padEnd(9) +
        ` | ${primary.falseNegativeRate.toFixed(1)}%`
      )
    })
    
    console.log('\n🎯 SECONDARY BENCHMARK (SecondaryMassiveBenchmark) RESULTS:')
    console.log('-'.repeat(100))
    console.log('Model           | Accuracy   | FP Rate   | FN Rate')
    console.log('-'.repeat(100))
    
    secondarySorted.forEach(([modelName, results]) => {
      const secondary = results.benchmarkBreakdown.secondary
      console.log(
        modelName.padEnd(15) +
        ` | ${secondary.accuracy.toFixed(1)}%`.padEnd(11) +
        ` | ${secondary.falsePositiveRate.toFixed(1)}%`.padEnd(9) +
        ` | ${secondary.falseNegativeRate.toFixed(1)}%`
      )
    })
  }

  augmentTestCases(cases) {
    const augmented = []
    cases.forEach(tc => {
      augmented.push(tc)

      const leet = { ...tc, text: this.applyLeetSpeakNoise(tc.text), context: `${tc.context}_leet` }
      const punct = { ...tc, text: this.injectPunctuationNoise(tc.text), context: `${tc.context}_noise` }
      const scramble = { ...tc, text: this.applyWordScrambleNoise(tc.text), context: `${tc.context}_scramble` }
      const unicode = { ...tc, text: this.injectZeroWidthNoise(tc.text), context: `${tc.context}_unicode` }
      const confusable = { ...tc, text: this.applyConfusableNoise(tc.text), context: `${tc.context}_confusable` }
      const reversed = { ...tc, text: this.reverseTextNoise(tc.text), context: `${tc.context}_reverse` }
      const superNoise = { ...tc, text: this.applySuperNoise(tc.text), context: `${tc.context}_super` }

      augmented.push(leet, punct, scramble, unicode, confusable, reversed, superNoise)
    })

    return augmented
  }

  applyLeetSpeakNoise(text) {
    const map = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' }
    return text
      .split('')
      .map(ch => {
        const lower = ch.toLowerCase()
        if (map[lower] && Math.random() < 0.9) {
          return map[lower]
        }
        return ch
      })
      .join('')
  }

  injectPunctuationNoise(text) {
    const symbols = ['!', '?', '#', '$', '%', '~']
    return text
      .split('')
      .map(ch => (Math.random() < 0.6 ? ch + symbols[Math.floor(Math.random() * symbols.length)] : ch))
      .join('')
  }

  applyWordScrambleNoise(text) {
    return text
      .split(' ')
      .map(word => {
        if (word.length > 3 && Math.random() < 0.3) {
          const middle = word.slice(1, -1).split('')
          for (let i = middle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[middle[i], middle[j]] = [middle[j], middle[i]]
          }
          return word[0] + middle.join('') + word[word.length - 1]
        }
        return word
      })
      .join(' ')
  }

  injectZeroWidthNoise(text) {
    const zwChars = ['\u200b', '\u200c', '\u200d']
    return text
      .split('')
      .map(ch => (Math.random() < 0.3 ? ch + zwChars[Math.floor(Math.random() * zwChars.length)] : ch))
      .join('')
  }

  applyConfusableNoise(text) {
    const map = {
      a: 'а',
      e: 'е',
      i: 'і',
      o: 'ο',
      c: 'с',
      p: 'р',
      x: 'х',
      y: 'у'
    }
    return text
      .split('')
      .map(ch => {
        const lower = ch.toLowerCase()
        if (map[lower] && Math.random() < 0.7) {
          const conf = map[lower]
          return ch === lower ? conf : conf.toUpperCase()
        }
        return ch
      })
      .join('')
  }

  reverseTextNoise(text) {
    return text
      .split(' ')
      .map(word => (Math.random() < 0.5 ? word.split('').reverse().join('') : word))
      .join(' ')
  }

  applySuperNoise(text) {
    return this.reverseTextNoise(
      this.applyConfusableNoise(
        this.injectZeroWidthNoise(
          this.applyWordScrambleNoise(
            this.injectPunctuationNoise(
              this.applyLeetSpeakNoise(text)
            )
          )
        )
      )
    )
  }

  generateExtensiveFailureAnalysis(sortedModels) {
    console.log('\n📊 EXTENSIVE FAILURE ANALYSIS:')
    console.log('='.repeat(120))
    
    const bestModel = sortedModels[0]
    const [bestModelName, bestResults] = bestModel
    
    console.log(`\n🔍 DETAILED FAILURE BREAKDOWN - ${bestModelName.toUpperCase()}:`)
    console.log('='.repeat(100))
    
    // False Positives Analysis
    console.log('\n❌ FALSE POSITIVES (Legitimate content flagged as toxic):')
    console.log(`Total: ${bestResults.falsePositives} (${bestResults.falsePositiveRate.toFixed(2)}%)`)
    console.log('-'.repeat(100))
    
    // Group false positives by category
    const fpByCategory = {}
    bestResults.failedCases.falsePositives.forEach(fp => {
      if (!fpByCategory[fp.category]) fpByCategory[fp.category] = []
      fpByCategory[fp.category].push(fp)
    })
    
    Object.entries(fpByCategory)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10) // Top 10 worst categories
      .forEach(([category, fps]) => {
        console.log(`\n📂 ${category.toUpperCase().replace(/_/g, ' ')} (${fps.length} false positives):`)
        fps.slice(0, this.failureExampleCount).forEach((fp, i) => { // Show top 3 examples
          const confidenceStr = typeof fp.confidence === 'number' ? fp.confidence.toFixed(2) : (fp.confidence || 'N/A')
          console.log(`   ${i + 1}. "${fp.text}" (Score: ${fp.score}, Confidence: ${confidenceStr})`)
        })
      })
    
    // False Negatives Analysis
    console.log('\n❌ FALSE NEGATIVES (Toxic content not detected):')
    console.log(`Total: ${bestResults.falseNegatives} (${bestResults.falseNegativeRate.toFixed(2)}%)`)
    console.log('-'.repeat(100))
    
    // Group false negatives by category
    const fnByCategory = {}
    bestResults.failedCases.falseNegatives.forEach(fn => {
      if (!fnByCategory[fn.category]) fnByCategory[fn.category] = []
      fnByCategory[fn.category].push(fn)
    })
    
    Object.entries(fnByCategory)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 10) // Top 10 worst categories
      .forEach(([category, fns]) => {
        console.log(`\n📂 ${category.toUpperCase().replace(/_/g, ' ')} (${fns.length} false negatives):`)
        fns.slice(0, this.failureExampleCount).forEach((fn, i) => { // Show top 3 examples
          const confidenceStr = typeof fn.confidence === 'number' ? fn.confidence.toFixed(2) : (fn.confidence || 'N/A')
          console.log(`   ${i + 1}. "${fn.text}" (Score: ${fn.score}, Confidence: ${confidenceStr})`)
        })
      })
    
    // Benchmark-specific failure analysis
    console.log('\n📊 FAILURE DISTRIBUTION BY BENCHMARK:')
    console.log('-'.repeat(60))
    console.log('Benchmark        | False Positives | False Negatives | Total Failures')
    console.log('-'.repeat(60))
    
    Object.entries(bestResults.benchmarkBreakdown).forEach(([benchmarkType, benchmark]) => {
      const totalFailures = benchmark.falsePositives + benchmark.falseNegatives
      console.log(
        benchmark.name.padEnd(16) +
        ` | ${benchmark.falsePositives}`.padEnd(16) +
        ` | ${benchmark.falseNegatives}`.padEnd(16) +
        ` | ${totalFailures}`
      )
    })
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Combined Massive Benchmark Runner...\n')
  
  const runner = new CombinedBenchmarkRunner()
  
  try {
    await runner.runCombinedBenchmark()
    
    console.log('\n🏁 Combined benchmark completed successfully!')
    console.log('📊 Check the generated reports for detailed analysis.')
    
  } catch (error) {
    console.error('💥 Combined benchmark failed:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main()
}

module.exports = { CombinedBenchmarkRunner } 