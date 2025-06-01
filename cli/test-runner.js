#!/usr/bin/env node

/**
 * ContentGuard CLI Test Runner
 * 
 * Comprehensive test suite with expected outcomes to validate
 * the accuracy and context awareness of ContentGuard.
 * 
 * Usage: node cli/test-runner.js
 */

const { ContentGuard } = require('../index.js')
const chalk = require('chalk')

// Test cases with expected outcomes
const testCases = [
  // === LEGITIMATE CONTENT (Should be CLEAN) ===
  {
    id: 'LEG001',
    input: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah@university.edu',
      subject: 'Engineering Research Collaboration',
      message: 'Hello, I am a mechanical engineering professor at MIT. I would like to discuss potential research collaboration opportunities in structural analysis and ratio calculations.'
    },
    expected: 'CLEAN',
    category: 'Academic Professional',
    description: 'Academic inquiry with technical terms'
  },
  {
    id: 'LEG002',
    input: {
      name: 'DevOps Engineer',
      email: 'admin@company.com',
      subject: 'Critical System Issue',
      message: 'We have a critical system failure. Need to kill the stuck processes immediately. The kill command is not responding on the production server.'
    },
    expected: 'CLEAN',
    category: 'Technical Emergency',
    description: 'Technical context with "kill" and "critical"'
  },
  {
    id: 'LEG003',
    input: {
      name: 'Dr. Michael Chen',
      email: 'mchen@hospital.org',
      subject: 'Urgent Patient Care Protocol',
      message: 'Urgent medical intervention required. Patient shows critical symptoms. Need immediate consultation on treatment protocol and medication ratios.'
    },
    expected: 'CLEAN',
    category: 'Medical Professional',
    description: 'Medical emergency with "urgent" and "critical"'
  },
  {
    id: 'LEG004',
    input: {
      name: 'Financial Analyst',
      email: 'analyst@bank.com',
      subject: 'Risk Assessment Report',
      message: 'Completed risk analysis for Q4. The debt-to-equity ratio shows concerning trends. Urgent review needed for portfolio adjustments.'
    },
    expected: 'CLEAN',
    category: 'Business Professional',
    description: 'Financial analysis with professional terminology'
  },
  {
    id: 'LEG005',
    input: {
      name: 'John Smith',
      email: 'john@gmail.com',
      subject: 'Job Application',
      message: 'Dear Hiring Manager, I am writing to express my interest in the software engineering position. I have 5 years of experience and would love to contribute to your team.'
    },
    expected: 'CLEAN',
    category: 'Professional Inquiry',
    description: 'Standard job application'
  },

  // === BORDERLINE CASES (Should be CLEAN with context awareness) ===
  {
    id: 'BOR001',
    input: {
      name: 'Student',
      email: 'student@edu.edu',
      subject: 'Class Assignment Help',
      message: 'I need help with my engineering assignment. The ratio calculation is killing me. This problem is so hard and I feel stupid.'
    },
    expected: 'CLEAN',
    category: 'Student Expression',
    description: 'Student frustration with academic context'
  },
  {
    id: 'BOR002',
    input: {
      name: 'Game Developer',
      email: 'dev@gamecompany.com',
      subject: 'Game Balance Issues',
      message: 'The new character is overpowered and killing the game balance. Players are saying it is trash and needs urgent nerfs.'
    },
    expected: 'CLEAN',
    category: 'Professional Gaming',
    description: 'Game development context with gaming terms'
  },
  {
    id: 'BOR003',
    input: {
      name: 'Researcher',
      email: 'research@university.edu',
      subject: 'Statistical Analysis',
      message: 'The ratio test failed again. This is frustrating. Need urgent help with the critical analysis of our data set.'
    },
    expected: 'CLEAN',
    category: 'Academic Research',
    description: 'Research frustration in academic context'
  },

  // === OBVIOUS SPAM/TROLL (Should be SPAM) ===
  {
    id: 'SPAM001',
    input: {
      name: 'ligma',
      email: 'troll@temp.com',
      subject: 'bruh',
      message: 'ratio + cope + seethe + cringe + skill issue + touch grass noob'
    },
    expected: 'SPAM',
    category: 'Gaming Troll',
    description: 'Modern gaming troll vocabulary'
  },
  {
    id: 'SPAM002',
    input: {
      name: 'Anonymous',
      email: 'hate@hate.com',
      subject: 'You suck',
      message: 'You are a pathetic loser and your website is trash. Kill yourself you worthless piece of garbage.'
    },
    expected: 'SPAM',
    category: 'Direct Harassment',
    description: 'Clear harassment and threats'
  },
  {
    id: 'SPAM003',
    input: {
      name: 'Nigerian Prince',
      email: 'prince@nigeria.com',
      subject: 'URGENT BUSINESS PROPOSAL!!!',
      message: 'Dear Sir/Madam, I am a wealthy prince with $10 MILLION to transfer. Guaranteed returns with no risk. Click here now!'
    },
    expected: 'SPAM',
    category: 'Classic Scam',
    description: 'Nigerian prince scam pattern'
  },
  {
    id: 'SPAM004',
    input: {
      name: 'ToxicGamer',
      email: 'toxic@gaming.com',
      subject: 'git gud scrub',
      message: 'you are trash at this game. uninstall and go touch grass you basement dweller. ratio + L + cope harder'
    },
    expected: 'SPAM',
    category: 'Gaming Toxicity',
    description: 'Toxic gaming harassment'
  },
  {
    id: 'SPAM005',
    input: {
      name: 'Spammer',
      email: 'spam@spam.com',
      subject: 'MAKE MONEY FAST!!!',
      message: 'CLICK HERE NOW!!! Make $5000 today with this one weird trick! Guaranteed money with no effort required!'
    },
    expected: 'SPAM',
    category: 'Money Scam',
    description: 'Get rich quick scheme'
  },

  // === EVASION ATTEMPTS (Should be SPAM) ===
  {
    id: 'EVA001',
    input: {
      name: 'Evader',
      email: 'evade@test.com',
      subject: 'Clever message',
      message: 'k.i.l.l y.o.u.r.s.e.l.f you p.i.e.c.e o.f t.r.a.s.h'
    },
    expected: 'SPAM',
    category: 'Dotted Evasion',
    description: 'Dotted character evasion attempt'
  },
  {
    id: 'EVA002',
    input: {
      name: 'L33tSp34k',
      email: 'leet@test.com',
      subject: 'h4x0r',
      message: 'y0u 4r3 4 f4gg0t 4nd 5h0uld d13 1n 4 f1r3'
    },
    expected: 'SPAM',
    category: 'Leetspeak Evasion',
    description: 'Leetspeak character substitution'
  },
  {
    id: 'EVA003',
    input: {
      name: 'Sneaky',
      email: 'sneak@test.com',
      subject: 'Innocent message',
      message: 'You should k!ll yourself and g0 d!e you worthl3ss tr4sh'
    },
    expected: 'SPAM',
    category: 'Character Substitution',
    description: 'Mixed character substitution evasion'
  },

  // === SUBTLE HARASSMENT (Should be SPAM) ===
  {
    id: 'SUB001',
    input: {
      name: 'Polite Troll',
      email: 'polite@test.com',
      subject: 'Friendly advice',
      message: 'People like you clearly lack the intelligence for this field. You would be better if you found another career path.'
    },
    expected: 'SPAM',
    category: 'Subtle Harassment',
    description: 'Politely worded harassment'
  },
  {
    id: 'SUB002',
    input: {
      name: 'Concerned Citizen',
      email: 'concerned@test.com',
      subject: 'Constructive feedback',
      message: 'It would be unfortunate if your personal information became public. Just saying, people can find interesting things about you online.'
    },
    expected: 'SPAM',
    category: 'Veiled Threat',
    description: 'Implied doxxing threat'
  },
  {
    id: 'SUB003',
    input: {
      name: 'Helpful Person',
      email: 'help@test.com',
      subject: 'Suggestion',
      message: 'You obviously do not understand how this works. Maybe you should consider that you are not cut out for this.'
    },
    expected: 'SPAM',
    category: 'Condescending Harassment',
    description: 'Condescending put-down'
  },

  // === EDGE CASES ===
  {
    id: 'EDGE001',
    input: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    expected: 'CLEAN',
    category: 'Empty Input',
    description: 'Completely empty input'
  },
  {
    id: 'EDGE002',
    input: {
      name: 'Test',
      email: 'test@test.com',
      subject: 'Test',
      message: 'a'
    },
    expected: 'CLEAN',
    category: 'Minimal Input',
    description: 'Single character message'
  },
  {
    id: 'EDGE003',
    input: {
      name: 'Emoji User',
      email: 'emoji@test.com',
      subject: 'Happy message! 😊',
      message: 'Hello! 🎉🎊🚀✨🌟💫⭐🔥💯🎯 This is a very happy message with lots of emojis! 😄😃😀'
    },
    expected: 'CLEAN',
    category: 'Emoji Heavy',
    description: 'Message with many emojis'
  },
  {
    id: 'EDGE004',
    input: {
      name: 'Caps User',
      email: 'caps@test.com',
      subject: 'IMPORTANT MESSAGE',
      message: 'THIS IS A VERY IMPORTANT BUSINESS MESSAGE ABOUT OUR QUARTERLY FINANCIAL ANALYSIS AND URGENT BUDGET REVIEW'
    },
    expected: 'CLEAN',
    category: 'All Caps Business',
    description: 'Business message in all caps'
  }
]

class TestRunner {
  constructor() {
    this.guard = new ContentGuard({ debug: false })
    this.results = []
    this.passed = 0
    this.failed = 0
  }

  async runAllTests() {
    console.log(chalk.blue.bold('\n🧪 ContentGuard CLI Test Runner'))
    console.log(chalk.blue('=' .repeat(60)))
    console.log(chalk.gray(`Running ${testCases.length} comprehensive test cases...\n`))

    for (const testCase of testCases) {
      await this.runSingleTest(testCase)
    }

    this.printSummary()
    return this.failed === 0
  }

  async runSingleTest(testCase) {
    try {
      const result = await this.guard.analyze(testCase.input)
      const actualOutcome = result.isSpam ? 'SPAM' : 'CLEAN'
      const passed = actualOutcome === testCase.expected
      
      if (passed) {
        this.passed++
        console.log(chalk.green(`✅ ${testCase.id}`), chalk.gray(`${testCase.category} - ${testCase.description}`))
      } else {
        this.failed++
        console.log(chalk.red(`❌ ${testCase.id}`), chalk.gray(`${testCase.category} - ${testCase.description}`))
        console.log(chalk.red(`   Expected: ${testCase.expected}, Got: ${actualOutcome} (Score: ${result.score})`))
        console.log(chalk.yellow(`   Message: "${testCase.input.message.substring(0, 60)}..."`))
        if (result.flags.length > 0) {
          console.log(chalk.yellow(`   Flags: ${result.flags.slice(0, 3).join(', ')}`))
        }
      }

      this.results.push({
        ...testCase,
        actualOutcome,
        passed,
        score: result.score,
        flags: result.flags
      })

    } catch (error) {
      this.failed++
      console.log(chalk.red(`💥 ${testCase.id}`), chalk.red(`ERROR: ${error.message}`))
    }
  }

  printSummary() {
    console.log(chalk.blue('\n' + '=' .repeat(60)))
    console.log(chalk.blue.bold('📊 TEST SUMMARY'))
    console.log(chalk.blue('=' .repeat(60)))
    
    const total = this.passed + this.failed
    const passRate = ((this.passed / total) * 100).toFixed(1)
    
    console.log(chalk.green(`✅ Passed: ${this.passed}/${total} (${passRate}%)`))
    if (this.failed > 0) {
      console.log(chalk.red(`❌ Failed: ${this.failed}/${total}`))
    }

    // Show failed tests details
    if (this.failed > 0) {
      console.log(chalk.red.bold('\n🔍 FAILED TESTS ANALYSIS:'))
      const failedTests = this.results.filter(r => !r.passed)
      
      failedTests.forEach(test => {
        console.log(chalk.red(`\n❌ ${test.id} - ${test.description}`))
        console.log(chalk.gray(`   Category: ${test.category}`))
        console.log(chalk.gray(`   Expected: ${test.expected}, Got: ${test.actualOutcome}`))
        console.log(chalk.gray(`   Score: ${test.score}`))
        console.log(chalk.gray(`   Message: "${test.input.message}"`))
        if (test.flags.length > 0) {
          console.log(chalk.gray(`   Flags: ${test.flags.slice(0, 5).join(', ')}`))
        }
      })

      console.log(chalk.yellow.bold('\n💡 RECOMMENDATIONS:'))
      this.analyzeFailures(failedTests)
    }

    console.log(chalk.blue('\n' + '=' .repeat(60)))
    
    if (this.failed === 0) {
      console.log(chalk.green.bold('🎉 ALL TESTS PASSED! ContentGuard is working perfectly!'))
    } else {
      console.log(chalk.red.bold('⚠️  Some tests failed. Review the analysis above for improvements.'))
    }
  }

  analyzeFailures(failedTests) {
    const falsePositives = failedTests.filter(t => t.expected === 'CLEAN' && t.actualOutcome === 'SPAM')
    const falseNegatives = failedTests.filter(t => t.expected === 'SPAM' && t.actualOutcome === 'CLEAN')

    if (falsePositives.length > 0) {
      console.log(chalk.yellow(`\n🔸 False Positives (${falsePositives.length}): Legitimate content flagged as spam`))
      falsePositives.forEach(test => {
        console.log(chalk.yellow(`   - ${test.id}: ${test.category} - Consider improving context awareness`))
      })
    }

    if (falseNegatives.length > 0) {
      console.log(chalk.yellow(`\n🔸 False Negatives (${falseNegatives.length}): Spam content not detected`))
      falseNegatives.forEach(test => {
        console.log(chalk.yellow(`   - ${test.id}: ${test.category} - Consider strengthening detection patterns`))
      })
    }
  }
}

// CLI execution
if (require.main === module) {
  const runner = new TestRunner()
  runner.runAllTests().then(success => {
    process.exit(success ? 0 : 1)
  }).catch(error => {
    console.error(chalk.red('💥 Test runner failed:'), error)
    process.exit(1)
  })
}

module.exports = { TestRunner, testCases } 