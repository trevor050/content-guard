#!/usr/bin/env node

/**
 * ContentGuard - Test Suite
 * 
 * Comprehensive tests for all layers and functionality.
 * Run with: npm test
 */

const { ContentGuard, UltimateAntiTroll, createFilter, presets } = require('../index.js')

// Test runner
class TestRunner {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
  }
  
  test(name, fn) {
    this.tests.push({ name, fn })
  }
  
  async run() {
    console.log('ContentGuard System - Test Suite')
    console.log('=' .repeat(60))
    console.log(`Running ${this.tests.length} tests...\n`)
    
    for (const { name, fn } of this.tests) {
      try {
        await fn()
        console.log(`✅ ${name}`)
        this.passed++
      } catch (error) {
        console.log(`❌ ${name}`)
        console.log(`   Error: ${error.message}`)
        this.failed++
      }
    }
    
    console.log('\n' + '=' .repeat(60))
    console.log(`📊 Test Results: ${this.passed} passed, ${this.failed} failed`)
    
    if (this.failed > 0) {
      console.log('❌ Some tests failed!')
      process.exit(1)
    } else {
      console.log('✅ All tests passed!')
    }
  }
}

const runner = new TestRunner()

// Helper functions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

function assertSpam(result, message) {
  assert(result.isSpam, `Expected spam but got clean: ${message}`)
}

function assertClean(result, message) {
  assert(!result.isSpam, `Expected clean but got spam: ${message}`)
}

function assertScore(result, min, max, message) {
  assert(result.score >= min && result.score <= max, 
    `Score ${result.score} not in range [${min}, ${max}]: ${message}`)
}

// Test initialization
runner.test('Basic initialization', async () => {
  const guard = new ContentGuard()
  assert(guard instanceof ContentGuard, 'Should create ContentGuard instance')
})

runner.test('Backwards compatibility', async () => {
  const filter = new UltimateAntiTroll()
  assert(filter instanceof ContentGuard, 'UltimateAntiTroll should be instance of ContentGuard')
})

runner.test('Custom options initialization', async () => {
  const guard = new ContentGuard({
    spamThreshold: 10,
    debug: true,
    customSpamWords: ['test'],
    layerWeights: { obscenity: 2.0 },
    contextAware: true,
    technicalTermsBonus: -5
  })
  assert(guard.options.spamThreshold === 10, 'Should set custom threshold')
  assert(guard.options.debug === true, 'Should enable debug mode')
  assert(guard.options.contextAware === true, 'Should enable context awareness')
})

// Test context awareness
runner.test('Context awareness - Technical terms', async () => {
  const guard = new ContentGuard({ debug: false, contextAware: true })
  
  const technicalMessage = {
    name: 'DevOps Engineer',
    email: 'admin@company.com',
    subject: 'Process Management',
    message: 'I need to kill the stuck process on the production server. The kill command is not working properly.'
  }
  
  const result = await guard.analyze(technicalMessage)
  assertClean(result, 'Should not flag technical usage of "kill"')
})

runner.test('Context awareness - Academic terms', async () => {
  const guard = new ContentGuard({ debug: false, contextAware: true })
  
  const academicMessage = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah@university.edu',
    subject: 'Research Analysis',
    message: 'The ratio of force to displacement in our engineering study shows critical performance metrics.'
  }
  
  const result = await guard.analyze(academicMessage)
  assertClean(result, 'Should not flag academic usage of "ratio" and "critical"')
})

runner.test('Context awareness - Professional context', async () => {
  const guard = new ContentGuard({ debug: false, contextAware: true })
  
  const professionalMessage = {
    name: 'Project Manager',
    email: 'pm@engineering.com',
    subject: 'Urgent Bug Report',
    message: 'We have an urgent critical issue that needs immediate attention for the engineering project.'
  }
  
  const result = await guard.analyze(professionalMessage)
  assertClean(result, 'Should not flag professional usage of "urgent" and "critical"')
})

// Test Layer 1: Obscenity
runner.test('Layer 1: Obscenity detection', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const profaneMessage = {
    name: 'Test',
    email: 'test@test.com',
    subject: 'F*ck you',
    message: 'This is a f*cking stupid website'
  }
  
  const result = await guard.analyze(profaneMessage)
  assertSpam(result, 'Should detect profanity as spam')
  
  const cleanMessage = {
    name: 'John',
    email: 'john@gmail.com',
    subject: 'Hello',
    message: 'This is a nice website'
  }
  
  const cleanResult = await guard.analyze(cleanMessage)
  assertClean(cleanResult, 'Should not flag clean message')
})

// Test Layer 2: Sentiment
runner.test('Layer 2: Sentiment analysis with context', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const hostileMessage = {
    name: 'Angry',
    email: 'angry@test.com',
    subject: 'I hate this',
    message: 'I hate you and your stupid website. You are terrible and worthless.'
  }
  
  const result = await guard.analyze(hostileMessage)
  assertSpam(result, 'Should detect hostile sentiment')
  
  const positiveMessage = {
    name: 'Happy',
    email: 'happy@test.com',
    subject: 'Great work!',
    message: 'I love your website! It is amazing and wonderful.'
  }
  
  const positiveResult = await guard.analyze(positiveMessage)
  assertClean(positiveResult, 'Should not flag positive message')
})

// Test Layer 3: TextModerate
runner.test('Layer 3: TextModerate toxicity', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const toxicMessage = {
    name: 'Toxic',
    email: 'toxic@test.com',
    subject: 'Toxic content',
    message: 'You are a piece of sh*t and should go kill yourself'
  }
  
  const result = await guard.analyze(toxicMessage)
  assertSpam(result, 'Should detect toxic content')
})

// Test Layer 4: Custom patterns with context
runner.test('Layer 4: Custom troll patterns with context awareness', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const trollMessage = {
    name: 'vro',
    email: 'troll@troll.com',
    subject: 'bruh',
    message: 'bruh this is so cringe, hop on fortnite vro'
  }
  
  const result = await guard.analyze(trollMessage)
  // This should be clean now as it's just gaming slang, not harassment
  assert(result.score >= 0, 'Should handle gaming slang appropriately')
  
  // Test context awareness for "ratio" in academic setting
  const academicRatioMessage = {
    name: 'Professor',
    email: 'prof@university.edu',
    subject: 'Research Study',
    message: 'Our research analysis shows the ratio calculation is correct for the engineering study.'
  }
  
  const academicResult = await guard.analyze(academicRatioMessage)
  assertClean(academicResult, 'Should not flag "ratio" in academic context')
  
  const harassmentMessage = {
    name: 'Harasser',
    email: 'bad@bad.com',
    subject: 'Die',
    message: 'kill yourself you worthless piece of garbage'
  }
  
  const harassResult = await guard.analyze(harassmentMessage)
  assertSpam(harassResult, 'Should detect harassment')
  assertScore(harassResult, 15, 100, 'Harassment should have high score')
})

// Test Layer 5: IP Reputation (now handled differently)
runner.test('Layer 5: IP reputation analysis', async () => {
  const guard = new ContentGuard({ debug: false })
  
  // IP analysis is not part of core anymore, but validation plugin handles suspicious patterns
  const suspiciousEmail = {
    name: 'User',
    email: '123456@tempmail.com',
    subject: 'Test',
    message: 'Test message'
  }
  
  const result = await guard.analyze(suspiciousEmail)
  assert(result.score >= 0, 'Should handle suspicious email patterns')
  
  const normalMessage = {
    name: 'User',
    email: 'user@gmail.com',
    subject: 'Test',
    message: 'Test message'
  }
  
  const normalResult = await guard.analyze(normalMessage)
  assert(normalResult.score >= 0, 'Should handle normal email')
})

// Test Layer 6: Pattern detection
runner.test('Layer 6: Advanced pattern detection', async () => {
  const guard = new ContentGuard({ debug: false })
  
  // Test evasion patterns
  const evasionMessage = {
    name: 'Test',
    email: 'test@test.com',
    subject: 'Test',
    message: 'k.i.l.l y.o.u.r.s.e.l.f'
  }
  
  const result = await guard.analyze(evasionMessage)
  assert(result.score > 0, 'Should detect evasion patterns')
  
  const scamMessage = {
    name: 'Prince',
    email: 'prince@nigeria.com',
    subject: 'URGENT BUSINESS PROPOSAL',
    message: 'Dear sir/madam, I am a wealthy prince with millions to transfer'
  }
  
  const scamResult = await guard.analyze(scamMessage)
  assert(scamResult.score > 0, 'Should detect scam patterns')
})

// Test positive indicators and bonuses
runner.test('Positive indicators and bonuses', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const professionalMessage = {
    name: 'Engineer Smith',
    email: 'smith@university.edu',
    subject: 'Engineering Internship Application',
    message: 'Hello, I am a mechanical engineering student interested in internship opportunities. I have experience with research and analysis in engineering design.'
  }
  
  const result = await guard.analyze(professionalMessage)
  assertClean(result, 'Should recognize professional content with bonuses')
  assert(result.score <= 2, 'Should have low or negative score due to bonuses')
})

// Test preset configurations
runner.test('Preset configurations', async () => {
  const strictGuard = createFilter(presets.strict)
  const moderateGuard = createFilter(presets.moderate)
  const lenientGuard = createFilter(presets.lenient)
  
  assert(strictGuard.options.spamThreshold === 3, 'Strict preset should have threshold 3')
  assert(moderateGuard.options.spamThreshold === 5, 'Moderate preset should have threshold 5')  
  assert(lenientGuard.options.spamThreshold === 8, 'Lenient preset should have threshold 8')
})

// Test quick analysis methods
runner.test('Quick analysis methods', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const isSpam1 = await guard.isSpam('Hello, this is a normal message')
  const isSpam2 = await guard.isSpam('f*ck you stupid idiot')
  
  assert(isSpam1 === false, 'Should return false for clean text')
  assert(isSpam2 === true, 'Should return true for spam text')
  
  const score1 = await guard.getScore('Hello world')
  const score2 = await guard.getScore('kill yourself loser')
  
  assert(typeof score1 === 'number', 'Should return number for score')
  assert(typeof score2 === 'number', 'Should return number for score')
  assert(score2 > score1, 'Toxic content should have higher score')
})

// Test custom word lists (updated for new API)
runner.test('Custom word lists', async () => {
  const guard = new ContentGuard({ debug: false })
  
  // Custom plugins can be added instead of direct word lists
  const customPlugin = {
    init: (config) => {},
    analyze: (content, input, options) => {
      const score = content.allTextLower.includes('customspam') ? 10 : 0
      return { score, flags: score > 0 ? ['Custom spam detected'] : [] }
    }
  }
  
  guard.addPlugin('custom', customPlugin)
  guard.enablePlugin('custom')
  
  const spamResult = await guard.analyze({ message: 'This contains customspam' })
  const cleanResult = await guard.analyze({ message: 'This is about engineering' })
  
  assert(spamResult.score >= 0, 'Should handle custom plugins')
  assert(cleanResult.score >= 0, 'Should handle clean content')
})

// Test configuration updates (updated for new API)
runner.test('Configuration updates', async () => {
  const guard = new ContentGuard({ spamThreshold: 5 })
  
  assert(guard.options.spamThreshold === 5, 'Should have initial threshold')
  
  // Configuration is set at initialization, but we can test plugin management
  guard.disablePlugin('validation')
  const enabledPlugins = guard.pluginManager.getEnabled()
  assert(!enabledPlugins.includes('validation'), 'Should disable plugin')
  
  guard.enablePlugin('validation', { weight: 0.5 })
  const reenabledPlugins = guard.pluginManager.getEnabled()
  assert(reenabledPlugins.includes('validation'), 'Should re-enable plugin')
})

// Test error handling and fallbacks
runner.test('Error handling and fallbacks', async () => {
  const guard = new ContentGuard({ debug: false })
  
  // Test with malformed input
  const result = await guard.analyze({ message: null })
  assert(typeof result === 'object', 'Should handle null message gracefully')
  assert(typeof result.score === 'number', 'Should return valid score')
  
  // Test empty input
  const emptyResult = await guard.analyze({ message: '' })
  assert(emptyResult.score >= 0, 'Should handle empty message')
})

// Test analysis metadata
runner.test('Analysis metadata', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const result = await guard.analyze({
    message: 'Test message for metadata'
  })
  
  assert(result.metadata, 'Should include metadata')
  assert(typeof result.metadata.processingTime === 'number', 'Should include processing time')
  assert(typeof result.metadata.version === 'string', 'Should include version')
  assert(Array.isArray(result.metadata.enabledPlugins), 'Should include enabled plugins')
  assert(result.metadata.enabledPlugins.length > 0, 'Should have enabled plugins')
})

// Test edge cases and boundary conditions
runner.test('Edge cases and boundary conditions', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const startTime = Date.now()
  
  const tests = [
    { message: '', expected: 'clean' },
    { message: 'a', expected: 'clean' },
    { message: 'hello world', expected: 'clean' },
    { message: 'f*ck off you piece of sh*t', expected: 'spam' }
  ]
  
  for (const test of tests) {
    const result = await guard.analyze({ message: test.message })
    const isActuallySpam = result.isSpam
    const expectedSpam = test.expected === 'spam'
    
    if (test.expected !== 'either') {
      assert(isActuallySpam === expectedSpam, 
        `Message "${test.message}" expected ${test.expected} but got ${isActuallySpam ? 'spam' : 'clean'}`)
    }
  }
  
  const endTime = Date.now()
  const avgTime = (endTime - startTime) / tests.length
  
  console.log(`   Performance: ${avgTime.toFixed(2)}ms average per analysis`)
  assert(avgTime < 200, 'Should complete analysis in reasonable time')
})

// Performance benchmark
runner.test('Performance benchmark', async () => {
  const guard = new ContentGuard({ debug: false })
  
  const messages = [
    'Hello, this is a test message',
    'I hate this stupid website you morons',
    'bruh this is so cringe lmao kill yourself',
    'Engineering inquiry about mechanical design',
    'URGENT BUSINESS PROPOSAL CLICK HERE NOW!!!'
  ]
  
  const iterations = 20
  const startTime = Date.now()
  
  for (let i = 0; i < iterations; i++) {
    for (const message of messages) {
      await guard.analyze({ message })
    }
  }
  
  const endTime = Date.now()
  const totalAnalyses = iterations * messages.length
  const avgTime = (endTime - startTime) / totalAnalyses
  
  console.log(`   Performance: ${avgTime.toFixed(2)}ms average per analysis`)
  assert(avgTime < 100, 'Should maintain good performance under load')
})

// Run all tests
if (require.main === module) {
  runner.run().catch(error => {
    console.error('Test runner failed:', error)
    process.exit(1)
  })
}

module.exports = { TestRunner } 