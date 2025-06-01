#!/usr/bin/env node

/**
 * ContentGuard - Comprehensive Test Suite
 * 
 * Extensive testing with edge cases, performance analysis, and improvement recommendations.
 * This tests for false positives, false negatives, and edge cases.
 */

const { ContentGuard } = require('../index.js')
const fs = require('fs')

class ComprehensiveTestSuite {
  constructor() {
    this.results = {
      falsePositives: [],
      falseNegatives: [],
      edgeCases: [],
      performance: [],
      summary: {
        total: 0,
        correct: 0,
        falsePositives: 0,
        falseNegatives: 0,
        accuracy: 0
      }
    }
    
    this.guard = new ContentGuard({ 
      debug: false, 
      contextAware: true,
      spamThreshold: 5 
    })
  }
  
  async runAllTests() {
    console.log('🛡️ ContentGuard - Comprehensive Testing Suite')
    console.log('=' .repeat(70))
    console.log('Testing for false positives, false negatives, and edge cases...\n')
    
    await this.testFalsePositives()
    await this.testFalseNegatives() 
    await this.testEdgeCases()
    await this.testPerformance()
    
    this.analyzeResults()
    this.generateReport()
    
    return this.results
  }
  
  async testFalsePositives() {
    console.log('🔍 Testing False Positives (legitimate content that might be flagged)...')
    
    const legitMessages = [
      // Academic contexts
      {
        category: 'Academic',
        name: 'Dr. Emily Chen',
        email: 'echen@mit.edu',
        subject: 'Research Methodology Question',
        message: 'I am conducting a critical analysis of ratio calculations in structural engineering. The kill switch mechanism in our experimental setup requires urgent attention for our thesis defense.',
        expected: false,
        description: 'Academic research with technical terms'
      },
      {
        category: 'Academic',
        name: 'Professor Williams',
        email: 'williams@stanford.edu',
        subject: 'Statistical Analysis Review',
        message: 'The ratio between control and experimental groups shows critical significance. We need urgent review of the methodology before publication.',
        expected: false,
        description: 'Statistical research language'
      },
      
      // Medical contexts
      {
        category: 'Medical',
        name: 'Dr. Sarah Johnson',
        email: 'sjohnson@hospital.org',
        subject: 'Patient Care Urgency',
        message: 'We have a critical patient situation requiring urgent intervention. The medication ratio needs immediate adjustment to prevent complications.',
        expected: false,
        description: 'Medical emergency communication'
      },
      {
        category: 'Medical',
        name: 'Nurse Manager',
        email: 'manager@healthcenter.com',
        subject: 'Treatment Protocol',
        message: 'Critical care protocol requires urgent implementation. The drug concentration ratio must be calculated precisely to avoid adverse effects.',
        expected: false,
        description: 'Medical protocol discussion'
      },
      
      // Technical/DevOps contexts
      {
        category: 'Technical',
        name: 'DevOps Engineer',
        email: 'devops@company.com',
        subject: 'Production Issue',
        message: 'Need to kill the stuck processes on server cluster. The kill -9 command is not working. This is urgent as it affects critical production systems.',
        expected: false,
        description: 'System administration emergency'
      },
      {
        category: 'Technical',
        name: 'Software Developer',
        email: 'dev@startup.io',
        subject: 'Performance Optimization',
        message: 'The CPU ratio is critical for performance. We need to kill redundant processes and optimize the thread ratio to prevent system crashes.',
        expected: false,
        description: 'Software optimization discussion'
      },
      
      // Business/Professional contexts
      {
        category: 'Business',
        name: 'Project Manager',
        email: 'pm@corporation.com',
        subject: 'Project Deadline Critical',
        message: 'We have a critical deadline approaching. The resource allocation ratio is insufficient and we need urgent approval for additional budget.',
        expected: false,
        description: 'Business project urgency'
      },
      {
        category: 'Business',
        name: 'Financial Analyst',
        email: 'analyst@finance.com',
        subject: 'Risk Assessment',
        message: 'The debt-to-equity ratio shows critical risk levels. We need urgent action to rebalance the portfolio before market close.',
        expected: false,
        description: 'Financial analysis communication'
      },
      
      // Legal contexts
      {
        category: 'Legal',
        name: 'Attorney',
        email: 'lawyer@lawfirm.com',
        subject: 'Case Review Urgent',
        message: 'Critical review needed for the evidence ratio in the upcoming trial. The precedent analysis requires urgent attention before the hearing.',
        expected: false,
        description: 'Legal case discussion'
      },
      
      // Scientific contexts
      {
        category: 'Scientific',
        name: 'Research Scientist',
        email: 'scientist@lab.org',
        subject: 'Experiment Results',
        message: 'The chemical reaction ratio shows critical instability. We need urgent review of the experimental conditions to prevent dangerous outcomes.',
        expected: false,
        description: 'Scientific research warning'
      },
      
      // Engineering contexts
      {
        category: 'Engineering',
        name: 'Mechanical Engineer',
        email: 'engineer@aerospace.com',
        subject: 'Design Critical Review',
        message: 'The stress-strain ratio indicates critical failure points. Urgent design revision needed to prevent catastrophic structural failure.',
        expected: false,
        description: 'Engineering safety analysis'
      },
      
      // Gaming discussions (legitimate)
      {
        category: 'Gaming',
        name: 'Game Developer',
        email: 'dev@gamedev.com',
        subject: 'Game Balance Discussion',
        message: 'The damage-to-health ratio in our game needs balancing. Players are finding critical exploits that kill the game experience.',
        expected: false,
        description: 'Professional game development'
      },
      
      // Education contexts
      {
        category: 'Education',
        name: 'Math Teacher',
        email: 'teacher@school.edu',
        subject: 'Curriculum Question',
        message: 'Students are struggling with ratio calculations in critical thinking exercises. Need urgent guidance on teaching methodology.',
        expected: false,
        description: 'Educational instruction'
      },
      
      // News/Media contexts
      {
        category: 'Media',
        name: 'Journalist',
        email: 'reporter@news.com',
        subject: 'Story Research',
        message: 'Investigating the critical ratio of housing prices to income. This urgent housing crisis requires immediate public attention.',
        expected: false,
        description: 'Journalism research'
      }
    ]
    
    for (const test of legitMessages) {
      const result = await this.guard.analyze(test)
      const isCorrect = result.isSpam === test.expected
      
      this.results.summary.total++
      if (isCorrect) {
        this.results.summary.correct++
      } else {
        this.results.summary.falsePositives++
        this.results.falsePositives.push({
          ...test,
          actualResult: result.isSpam,
          score: result.score,
          flags: result.flags,
          riskLevel: result.riskLevel
        })
      }
      
      console.log(`  ${isCorrect ? '✅' : '❌'} ${test.category}: ${test.description} (Score: ${result.score}, Spam: ${result.isSpam})`)
      if (!isCorrect) {
        console.log(`    🚩 FALSE POSITIVE - Flagged legitimate ${test.category.toLowerCase()} content`)
        console.log(`    📝 Top flags: ${result.flags.slice(0, 2).join(', ')}`)
      }
    }
    
    console.log(`\n📊 False Positive Results: ${this.results.falsePositives.length}/${legitMessages.length} legitimate messages incorrectly flagged\n`)
  }
  
  async testFalseNegatives() {
    console.log('🔍 Testing False Negatives (spam/troll content that might not be flagged)...')
    
    const spamMessages = [
      // Subtle harassment
      {
        category: 'Subtle Harassment',
        name: 'Concerned Citizen',
        email: 'concerned@email.com',
        subject: 'Feedback',
        message: 'I hope you realize that people like you are the reason society is declining. Maybe you should consider finding a different career path where you can do less damage.',
        expected: true,
        description: 'Politely worded harassment'
      },
      {
        category: 'Subtle Harassment',
        name: 'Anonymous',
        email: 'anon@temp.com',
        subject: 'Suggestion',
        message: 'It would be better for everyone if you just stopped trying. You clearly lack the intelligence and competence for this work.',
        expected: true,
        description: 'Condescending harassment'
      },
      
      // Coded language/dog whistles
      {
        category: 'Coded Language',
        name: 'Patriot1488',
        email: 'freedom@america.com',
        subject: 'Cultural Discussion',
        message: 'We need to preserve traditional values and protect our heritage from those who seek to replace us. The great replacement is real.',
        expected: true,
        description: 'Coded hate speech'
      },
      
      // Creative spelling to bypass
      {
        category: 'Evasion',
        name: 'Troll',
        email: 'troll@evil.com',
        subject: 'Message',
        message: 'You are such a f4gg0t and should g0 k1ll y0ur5elf you p1ece 0f 5h1t',
        expected: true,
        description: 'Leetspeak harassment evasion'
      },
      {
        category: 'Evasion',
        name: 'Hater',
        email: 'hate@mail.com',
        subject: 'Review',
        message: 'k.i.l.l y.o.u.r.s.e.l.f you w.o.r.t.h.l.e.s.s p.i.e.c.e o.f t.r.a.s.h',
        expected: true,
        description: 'Dotted harassment evasion'
      },
      
      // Sophisticated trolling
      {
        category: 'Sophisticated Trolling',
        name: 'Concerned Parent',
        email: 'parent@family.com',
        subject: 'Website Concern',
        message: 'As a concerned parent, I must say your website promotes degeneracy and corrupts our children. People like you are destroying traditional family values and should be stopped.',
        expected: true,
        description: 'Concern trolling'
      },
      
      // Spam with good formatting
      {
        category: 'Professional Spam',
        name: 'Business Opportunity',
        email: 'opportunity@business.com',
        subject: 'Exclusive Investment Opportunity',
        message: 'Dear Sir/Madam, I am writing to inform you of an exclusive investment opportunity that will guarantee 500% returns within 30 days. This is completely legitimate and risk-free. Send $1000 to get started immediately.',
        expected: true,
        description: 'Professional-looking scam'
      },
      
      // Toxic gaming communities
      {
        category: 'Toxic Gaming',
        name: 'ProGamer',
        email: 'gamer@gaming.com',
        subject: 'Gaming Discussion',
        message: 'git gud scrub, you are trash at this game and should uninstall. go back to playing minecraft you absolute noob. skill issue + ratio + cope harder',
        expected: true,
        description: 'Toxic gaming harassment'
      },
      
      // Manipulation tactics
      {
        category: 'Manipulation',
        name: 'Helper',
        email: 'help@assistance.com',
        subject: 'Urgent Help Needed',
        message: 'I am a wealthy prince from Nigeria and I need your help to transfer $10 million dollars. You will receive 30% commission for your assistance. This is completely legal and legitimate.',
        expected: true,
        description: 'Classic scam manipulation'
      },
      
      // Extremist recruitment (subtle)
      {
        category: 'Extremist',
        name: 'Truth Seeker',
        email: 'truth@reality.com',
        subject: 'Wake Up',
        message: 'The media lies to you every day. Join our community of truth seekers who understand what is really happening. We have the real information they do not want you to see.',
        expected: true,
        description: 'Extremist recruitment language'
      },
      
      // Doxxing threats (subtle)
      {
        category: 'Doxxing',
        name: 'Investigator',
        email: 'investigate@research.com',
        subject: 'Public Information',
        message: 'I found some interesting public information about you online. Your address, workplace, and family members. It would be unfortunate if this information became more widely known.',
        expected: true,
        description: 'Implied doxxing threat'
      },
      
      // Modern trolling patterns
      {
        category: 'Modern Trolling',
        name: 'BasedChad',
        email: 'based@sigma.com',
        subject: 'Opinion',
        message: 'this is so cringe bro. imagine being this much of a beta. touch grass and get some bitches. you are clearly an npc with no original thoughts.',
        expected: true,
        description: 'Modern troll vocabulary'
      }
    ]
    
    for (const test of spamMessages) {
      const result = await this.guard.analyze(test)
      const isCorrect = result.isSpam === test.expected
      
      this.results.summary.total++
      if (isCorrect) {
        this.results.summary.correct++
      } else {
        this.results.summary.falseNegatives++
        this.results.falseNegatives.push({
          ...test,
          actualResult: result.isSpam,
          score: result.score,
          flags: result.flags,
          riskLevel: result.riskLevel
        })
      }
      
      console.log(`  ${isCorrect ? '✅' : '❌'} ${test.category}: ${test.description} (Score: ${result.score}, Spam: ${result.isSpam})`)
      if (!isCorrect) {
        console.log(`    🚩 FALSE NEGATIVE - Missed ${test.category.toLowerCase()} content`)
        console.log(`    📝 Message: "${test.message.substring(0, 80)}..."`)
      }
    }
    
    console.log(`\n📊 False Negative Results: ${this.results.falseNegatives.length}/${spamMessages.length} spam messages not detected\n`)
  }
  
  async testEdgeCases() {
    console.log('🔍 Testing Edge Cases...')
    
    const edgeCases = [
      // Length extremes
      {
        category: 'Length',
        name: 'Test',
        email: 'test@test.com',
        subject: 'A',
        message: 'Hi',
        expected: false,
        description: 'Very short message'
      },
      {
        category: 'Length',
        name: 'Academic Researcher',
        email: 'researcher@university.edu',
        subject: 'Comprehensive Research Analysis',
        message: 'This is a comprehensive analysis of the critical factors affecting the ratio calculations in mechanical engineering systems. ' +
                'The research methodology involves extensive testing of structural components under various stress conditions. ' +
                'Critical evaluation of the stress-strain ratios indicates potential failure points that require urgent attention. ' +
                'The experimental setup includes multiple sensors monitoring displacement, force, and acceleration ratios. ' +
                'Preliminary results suggest that the current safety ratios may be inadequate for critical applications. ' +
                'Further investigation is needed to establish proper safety margins and prevent catastrophic failures. ' +
                'The implications for engineering design are significant and require immediate consideration by the engineering community.',
        expected: false,
        description: 'Very long legitimate message'
      },
      
      // Special characters and encoding
      {
        category: 'Encoding',
        name: 'Tést Üser',
        email: 'tëst@ëxämplë.com',
        subject: 'Spëciäl Chäräctërs',
        message: 'Héllo! I äm intërëstëd in yöur ëngineëring sërvicës. Plëäsë cöntäct më.',
        expected: false,
        description: 'Unicode characters'
      },
      {
        category: 'Encoding',
        name: 'مستخدم',
        email: 'user@arabic.com',
        subject: 'استفسار هندسي',
        message: 'مرحبا، أنا مهتم بخدماتكم الهندسية. الرجاء التواصل معي.',
        expected: false,
        description: 'Arabic text'
      },
      
      // All caps variations
      {
        category: 'Caps',
        name: 'URGENT REQUESTER',
        email: 'urgent@business.com',
        subject: 'CRITICAL BUSINESS PROPOSAL',
        message: 'THIS IS AN URGENT BUSINESS PROPOSAL REQUIRING IMMEDIATE ATTENTION. THE FINANCIAL RATIOS SHOW CRITICAL OPPORTUNITIES.',
        expected: true,
        description: 'All caps business (likely spam)'
      },
      {
        category: 'Caps',
        name: 'EMERGENCY RESPONDER',
        email: 'emergency@hospital.org',
        subject: 'MEDICAL EMERGENCY PROTOCOL',
        message: 'CRITICAL PATIENT REQUIRING URGENT INTERVENTION. MEDICATION RATIOS MUST BE CALCULATED IMMEDIATELY.',
        expected: false,
        description: 'All caps emergency (legitimate)'
      },
      
      // Number and symbol spam
      {
        category: 'Symbols',
        name: '$$$ MONEY $$$',
        email: 'money@cash.com',
        subject: '!!! URGENT !!! 💰💰💰',
        message: '$$$ MAKE $5000 TODAY!!! 💰💰💰 GUARANTEED PROFITS!!! 📈📈📈 CLICK NOW!!! 👇👇👇',
        expected: true,
        description: 'Symbol and emoji spam'
      },
      
      // Mixed legitimate and suspicious
      {
        category: 'Mixed',
        name: 'Dr. Smith',
        email: 'smith@university.edu',
        subject: 'Research Collaboration',
        message: 'I am a legitimate researcher, but I also think you should kill yourself because you are stupid. Just kidding! I am interested in your work.',
        expected: true,
        description: 'Mixed legitimate and harassment'
      },
      
      // Empty/minimal content
      {
        category: 'Minimal',
        name: '',
        email: '',
        subject: '',
        message: '',
        expected: false,
        description: 'Completely empty'
      },
      {
        category: 'Minimal',
        name: '.',
        email: 'a@b.c',
        subject: '.',
        message: '.',
        expected: false,
        description: 'Minimal punctuation'
      },
      
      // Repeated patterns
      {
        category: 'Patterns',
        name: 'Spammer',
        email: 'spam@spam.com',
        subject: 'URGENT URGENT URGENT',
        message: 'buy buy buy now now now click click click here here here urgent urgent urgent',
        expected: true,
        description: 'Repeated word patterns'
      },
      
      // Code snippets
      {
        category: 'Code',
        name: 'Developer',
        email: 'dev@company.com',
        subject: 'Kill Process Script',
        message: 'Here is the script to kill stuck processes:\n\nps aux | grep stuck_process | awk \'{print $2}\' | xargs kill -9\n\nThis will kill all matching processes.',
        expected: false,
        description: 'Code snippet with kill commands'
      }
    ]
    
    for (const test of edgeCases) {
      const result = await this.guard.analyze(test)
      
      this.results.edgeCases.push({
        ...test,
        actualResult: result.isSpam,
        score: result.score,
        flags: result.flags,
        riskLevel: result.riskLevel,
        processingTime: result.metadata.processingTime
      })
      
      console.log(`  📝 ${test.category}: ${test.description}`)
      console.log(`     Result: ${result.isSpam ? 'SPAM' : 'CLEAN'} (Score: ${result.score}) - ${result.metadata.processingTime}ms`)
      if (result.flags.length > 0) {
        console.log(`     Flags: ${result.flags.slice(0, 2).join(', ')}`)
      }
    }
    
    console.log(`\n📊 Edge Cases Tested: ${edgeCases.length} scenarios\n`)
  }
  
  async testPerformance() {
    console.log('🔍 Testing Performance...')
    
    const performanceTests = [
      {
        name: 'Short messages',
        messages: Array(100).fill('Hello world'),
        description: 'Simple short messages'
      },
      {
        name: 'Long messages',
        messages: Array(50).fill('This is a very long message that contains many words and should test the performance of the system when dealing with longer content that might be typical of contact forms or user submissions in real applications.'),
        description: 'Longer content analysis'
      },
      {
        name: 'Mixed content',
        messages: [
          'Hello world',
          'f*ck you stupid idiot',
          'I am interested in your engineering services',
          'bruh this is so cringe lmao',
          'Critical analysis of ratio calculations'
        ],
        description: 'Mixed spam and legitimate content'
      }
    ]
    
    for (const test of performanceTests) {
      const startTime = Date.now()
      const results = []
      
      for (const message of test.messages) {
        const result = await this.guard.analyze({ message })
        results.push(result)
      }
      
      const endTime = Date.now()
      const totalTime = endTime - startTime
      const avgTime = totalTime / test.messages.length
      const throughput = Math.round(1000 / avgTime)
      
      this.results.performance.push({
        testName: test.name,
        messageCount: test.messages.length,
        totalTime,
        avgTime,
        throughput,
        description: test.description
      })
      
      console.log(`  ⚡ ${test.name}: ${avgTime.toFixed(2)}ms avg, ${throughput} msgs/sec (${test.messages.length} messages)`)
    }
    
    console.log('')
  }
  
  analyzeResults() {
    const { total, correct, falsePositives, falseNegatives } = this.results.summary
    this.results.summary.accuracy = ((correct / total) * 100).toFixed(1)
    
    console.log('📈 ANALYSIS SUMMARY')
    console.log('=' .repeat(50))
    console.log(`Total tests: ${total}`)
    console.log(`Correct classifications: ${correct}`)
    console.log(`False positives: ${falsePositives} (legitimate flagged as spam)`)
    console.log(`False negatives: ${falseNegatives} (spam not detected)`)
    console.log(`Overall accuracy: ${this.results.summary.accuracy}%`)
    
    console.log('\n🔍 FALSE POSITIVE ANALYSIS:')
    if (this.results.falsePositives.length > 0) {
      const fpCategories = {}
      this.results.falsePositives.forEach(fp => {
        fpCategories[fp.category] = (fpCategories[fp.category] || 0) + 1
      })
      Object.entries(fpCategories).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} false positives`)
      })
      
      console.log('\n  Most problematic flags in false positives:')
      const flagCounts = {}
      this.results.falsePositives.forEach(fp => {
        fp.flags.forEach(flag => {
          const flagType = flag.split(']')[0] + ']'
          flagCounts[flagType] = (flagCounts[flagType] || 0) + 1
        })
      })
      Object.entries(flagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([flag, count]) => {
          console.log(`    ${flag}: ${count} times`)
        })
    } else {
      console.log('  ✅ No false positives detected!')
    }
    
    console.log('\n🔍 FALSE NEGATIVE ANALYSIS:')
    if (this.results.falseNegatives.length > 0) {
      const fnCategories = {}
      this.results.falseNegatives.forEach(fn => {
        fnCategories[fn.category] = (fnCategories[fn.category] || 0) + 1
      })
      Object.entries(fnCategories).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} false negatives`)
      })
      
      console.log('\n  Missed spam characteristics:')
      this.results.falseNegatives.forEach(fn => {
        console.log(`    ${fn.category}: Score ${fn.score} - "${fn.message.substring(0, 60)}..."`)
      })
    } else {
      console.log('  ✅ No false negatives detected!')
    }
    
    console.log('\n⚡ PERFORMANCE ANALYSIS:')
    this.results.performance.forEach(perf => {
      console.log(`  ${perf.testName}: ${perf.avgTime.toFixed(2)}ms avg, ${perf.throughput} msgs/sec`)
    })
  }
  
  generateReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      falsePositives: this.results.falsePositives.map(fp => ({
        category: fp.category,
        description: fp.description,
        score: fp.score,
        message: fp.message.substring(0, 100),
        flags: fp.flags.slice(0, 3)
      })),
      falseNegatives: this.results.falseNegatives.map(fn => ({
        category: fn.category,
        description: fn.description,
        score: fn.score,
        message: fn.message.substring(0, 100)
      })),
      performance: this.results.performance,
      recommendations: this.generateRecommendations()
    }
    
    try {
      fs.writeFileSync('tests/test-report.json', JSON.stringify(reportData, null, 2))
      console.log('\n📄 Detailed report saved to tests/test-report.json')
    } catch (error) {
      console.log('\n⚠️ Could not save report file:', error.message)
    }
  }
  
  generateRecommendations() {
    const recommendations = []
    
    // Analyze false positives for recommendations
    if (this.results.falsePositives.length > 0) {
      const fpCategories = {}
      this.results.falsePositives.forEach(fp => {
        fpCategories[fp.category] = (fpCategories[fp.category] || 0) + 1
      })
      
      if (fpCategories['Academic'] > 0) {
        recommendations.push('Improve academic context detection - add more academic vocabulary and phrase patterns')
      }
      if (fpCategories['Medical'] > 0) {
        recommendations.push('Add medical context awareness - medical terminology should have strong positive indicators')
      }
      if (fpCategories['Technical'] > 0) {
        recommendations.push('Enhance technical context detection - expand technical terms database')
      }
      if (fpCategories['Business'] > 0) {
        recommendations.push('Improve business communication recognition - add more professional language patterns')
      }
    }
    
    // Analyze false negatives for recommendations
    if (this.results.falseNegatives.length > 0) {
      const fnCategories = {}
      this.results.falseNegatives.forEach(fn => {
        fnCategories[fn.category] = (fnCategories[fn.category] || 0) + 1
      })
      
      if (fnCategories['Subtle Harassment'] > 0) {
        recommendations.push('Add subtle harassment detection - look for condescending language patterns')
      }
      if (fnCategories['Evasion'] > 0) {
        recommendations.push('Improve evasion detection - handle leetspeak and character substitution')
      }
      if (fnCategories['Professional Spam'] > 0) {
        recommendations.push('Add professional spam detection - detect scams disguised as business communications')
      }
      if (fnCategories['Coded Language'] > 0) {
        recommendations.push('Implement coded language detection - identify dog whistles and extremist terminology')
      }
    }
    
    // Performance recommendations
    const avgPerformance = this.results.performance.reduce((sum, p) => sum + p.avgTime, 0) / this.results.performance.length
    if (avgPerformance > 50) {
      recommendations.push('Optimize performance - consider caching or preprocessing for better response times')
    }
    
    return recommendations
  }
}

// Run comprehensive tests if this file is executed directly
if (require.main === module) {
  const suite = new ComprehensiveTestSuite()
  suite.runAllTests().catch(error => {
    console.error('❌ Comprehensive test failed:', error)
    process.exit(1)
  })
}

module.exports = { ComprehensiveTestSuite } 