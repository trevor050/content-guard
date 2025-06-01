#!/usr/bin/env node

/**
 * ContentGuard - Basic Usage Examples
 * 
 * This example demonstrates the core functionality and context-aware features
 * of the ContentGuard system.
 * Run with: npm run example
 */

const { ContentGuard, createFilter, presets } = require('../index.js')

console.log('ContentGuard - Basic Usage Examples\n')

async function runExamples() {
  
  // Example 1: Basic usage with context awareness
  console.log('📝 Example 1: Basic Analysis with Context Awareness')
  console.log('=' .repeat(50))
  
  const guard = new ContentGuard({ debug: false })
  
  const testMessages = [
    {
      name: 'John Doe',
      email: 'john@gmail.com',
      subject: 'Engineering Internship Inquiry',
      message: 'Hello! I am a mechanical engineering student at MIT and I am very interested in learning more about internship opportunities at your company. I have experience with CAD design and project management.',
      description: 'Legitimate engineering inquiry'
    },
    {
      name: 'vro',
      email: 'no@no.com',
      subject: 'yo',
      message: 'bruh kill ya self and hop on fortnite with me vro',
      description: 'Obvious troll message'
    },
    {
      name: 'Anonymous',
      email: 'test@test.com',
      subject: 'F*ck you',
      message: 'You suck and your website is trash. Go die you pathetic loser.',
      description: 'Harassment with profanity'
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      subject: 'Critical Analysis Research',
      message: 'I am reaching out regarding the ratio calculations in our engineering research. We need urgent assistance with the critical analysis of structural displacement ratios.',
      description: 'Academic inquiry with context-sensitive terms'
    },
    {
      name: 'DevOps Engineer',
      email: 'admin@company.com',
      subject: 'Process Management Issue',
      message: 'I need help to kill the stuck process on the production server. The kill command is not working and we need urgent assistance.',
      description: 'Technical context with potentially flagged terms'
    }
  ]
  
  for (const test of testMessages) {
    console.log(`\n🔍 Testing: ${test.description}`)
    console.log(`Input: "${test.name}" <${test.email}> - "${test.subject}"`)
    console.log(`Message: "${test.message.substring(0, 60)}..."`)
    
    const result = await guard.analyze(test)
    
    console.log(`📊 Result: ${result.riskLevel} (Score: ${result.score}/${result.threshold})`)
    console.log(`🎯 Classification: ${result.isSpam ? '🚨 SPAM/TROLL' : '✅ LEGITIMATE'}`)
    console.log(`🤖 Recommendation: ${result.recommendation}`)
    console.log(`⏱️ Processing time: ${result.metadata.processingTime}ms`)
    
    if (result.flags.length > 0) {
      console.log(`🚩 Top flags: ${result.flags.slice(0, 3).join(', ')}`)
    }
    
    console.log('-'.repeat(80))
  }
  
  // Example 2: Context awareness demonstration
  console.log('\n📝 Example 2: Context Awareness in Action')
  console.log('=' .repeat(50))
  
  const contextTests = [
    {
      context: 'Academic',
      message: 'The ratio of force to displacement shows critical performance in our engineering analysis.',
      description: 'Academic usage of "ratio" and "critical"'
    },
    {
      context: 'Technical',
      message: 'Please kill the process running on port 3000 using the kill command.',
      description: 'Technical usage of "kill"'
    },
    {
      context: 'Professional',
      message: 'We have an urgent critical bug that needs immediate attention.',
      description: 'Professional usage of "urgent" and "critical"'
    },
    {
      context: 'Gaming/Troll',
      message: 'ratio + cope + cringe + skill issue bruh',
      description: 'Gaming/troll usage of "ratio"'
    }
  ]
  
  for (const test of contextTests) {
    console.log(`\n🧠 ${test.context} Context: ${test.description}`)
    console.log(`Text: "${test.message}"`)
    
    const result = await guard.analyze({ message: test.message })
    
    console.log(`Result: ${result.isSpam ? 'FLAGGED' : 'CLEAN'} (Score: ${result.score})`)
    if (result.flags.length > 0) {
      console.log(`Flags: ${result.flags.slice(0, 2).join(', ')}`)
    }
  }
  
  // Example 3: Different presets
  console.log('\n\n📝 Example 3: Detection Presets')
  console.log('=' .repeat(50))
  
  const trollMessage = {
    name: 'ligma',
    email: 'troll@troll.com',
    subject: 'bruh',
    message: 'cope and seethe you cringe noob'
  }
  
  const presetNames = ['strict', 'moderate', 'lenient']
  
  for (const presetName of presetNames) {
    const presetGuard = createFilter(presets[presetName])
    const result = await presetGuard.analyze(trollMessage)
    
    console.log(`\n🎚️ ${presetName.toUpperCase()} preset:`)
    console.log(`  Score: ${result.score} | Threshold: ${result.threshold} | Spam: ${result.isSpam ? 'YES' : 'NO'}`)
  }
  
  // Example 4: Advanced configuration with context awareness
  console.log('\n\n📝 Example 4: Advanced Configuration')
  console.log('=' .repeat(50))
  
  const advancedGuard = new ContentGuard({
    spamThreshold: 4,
    contextAware: true,
    layerWeights: {
      obscenity: 2.0,    // Double profanity detection impact
      sentiment: 1.5,    // Increase sentiment analysis weight
      custom: 1.8        // Emphasize custom troll patterns
    },
    customTrollPatterns: ['minecraft', 'roblox', 'among us'],
    customWhitelistWords: ['portfolio', 'resume', 'professional'],
    technicalTermsBonus: -5,  // Strong bonus for technical content
    academicTermsBonus: -3,   // Moderate bonus for academic content
    professionalKeywordBonus: -4, // Bigger bonus for professional terms
    debug: false
  })
  
  const advancedTests = [
    {
      name: 'Engineer',
      email: 'dev@company.com',
      subject: 'Technical Issue',
      message: 'Critical system failure. Need to kill all processes immediately.',
      description: 'Technical emergency'
    },
    {
      name: 'Professor',
      email: 'prof@university.edu',
      subject: 'Research Collaboration',
      message: 'Urgent analysis needed for ratio calculations in mechanical engineering research.',
      description: 'Academic research'
    },
    {
      name: 'Gamer123',
      email: 'gamer@hotmail.com',
      subject: 'minecraft server',
      message: 'yo want to play minecraft on my server? among us is also available',
      description: 'Gaming-related message'
    }
  ]
  
  for (const test of advancedTests) {
    console.log(`\n🔧 ${test.description}:`)
    console.log(`"${test.message}"`)
    const result = await advancedGuard.analyze(test)
    console.log(`Result: ${result.isSpam ? 'SPAM' : 'CLEAN'} | Score: ${result.score} | Risk: ${result.riskLevel}`)
    
    if (result.flags.length > 0) {
      console.log(`Key flags: ${result.flags.filter(f => f.includes('POSITIVE') || f.includes('Context')).slice(0, 2).join(', ')}`)
    }
  }
  
  // Example 5: Quick analysis methods
  console.log('\n\n📝 Example 5: Quick Analysis Methods')
  console.log('=' .repeat(50))
  
  const quickTexts = [
    'Hello, I am interested in your engineering services.',
    'bruh this is so cringe lmao',
    'F*ck off you piece of trash',
    'The ratio calculation for our structural analysis is complete.',
    'kill the process on port 3000'
  ]
  
  for (const text of quickTexts) {
    const isSpam = await guard.isSpam(text)
    const score = await guard.getScore(text)
    
    console.log(`\n"${text.substring(0, 40)}..."`)
    console.log(`  Quick check - Spam: ${isSpam ? 'YES' : 'NO'} | Score: ${score}`)
  }
  
  // Example 6: Layer-by-layer analysis with context
  console.log('\n\n📝 Example 6: Detailed Layer Analysis')
  console.log('=' .repeat(50))
  
  const debugGuard = new ContentGuard({ debug: true, contextAware: true })
  
  const complexTest = {
    name: 'Dr. Smith',
    email: 'smith@university.edu',
    subject: 'Critical Engineering Analysis',
    message: 'Our research shows critical issues with the ratio calculations. We need urgent analysis of the kill switch mechanism in our engineering system.',
    ip: '8.8.8.8'
  }
  
  console.log('\n🔍 Academic message with potentially flagged terms:')
  console.log(`Subject: "${complexTest.subject}"`)
  console.log(`Message: "${complexTest.message}"`)
  
  const debugResult = await debugGuard.analyze(complexTest)
  
  console.log(`\n📊 Final Analysis:`)
  console.log(`  Total Score: ${debugResult.score}`)
  console.log(`  Risk Level: ${debugResult.riskLevel}`)
  console.log(`  Classification: ${debugResult.isSpam ? 'SPAM/TROLL' : 'LEGITIMATE'}`)
  
  console.log(`\n🔍 Layer Breakdown:`)
  Object.entries(debugResult.layerAnalysis).forEach(([layer, result]) => {
    console.log(`  ${layer.toUpperCase()}: ${result.score} points`)
    if (result.flags.length > 0) {
      console.log(`    Flags: ${result.flags.slice(0, 2).join(', ')}`)
    }
  })
  
  console.log(`\n🧠 Context Awareness Features:`)
  const contextFlags = debugResult.flags.filter(flag => 
    flag.includes('Context') || flag.includes('POSITIVE') || flag.includes('Technical') || flag.includes('Academic')
  )
  if (contextFlags.length > 0) {
    contextFlags.forEach((flag, index) => {
      console.log(`  ${index + 1}. ${flag}`)
    })
  } else {
    console.log(`  No context awareness bonuses applied`)
  }
  
  // Example 7: Performance demonstration
  console.log('\n\n📝 Example 7: Performance Demonstration')
  console.log('=' .repeat(50))
  
  const performanceGuard = new ContentGuard({ debug: false })
  const testMessages = [
    'Hello world',
    'This is spam content with bad words',
    'Engineering research proposal',
    'bruh kill yourself cringe',
    'Professional business inquiry'
  ]
  
  const iterations = 50
  const startTime = Date.now()
  
  for (let i = 0; i < iterations; i++) {
    for (const message of testMessages) {
      await performanceGuard.analyze({ message })
    }
  }
  
  const endTime = Date.now()
  const totalAnalyses = iterations * testMessages.length
  const avgTime = (endTime - startTime) / totalAnalyses
  
  console.log(`\n⚡ Performance Results:`)
  console.log(`  Total analyses: ${totalAnalyses}`)
  console.log(`  Average time per analysis: ${avgTime.toFixed(2)}ms`)
  console.log(`  Throughput: ${Math.round(1000 / avgTime)} analyses per second`)
  
  console.log('\n✅ Examples completed successfully!')
  console.log('🛡️ ContentGuard is ready for production use!')
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(error => {
    console.error('❌ Example failed:', error)
    process.exit(1)
  })
}

module.exports = { runExamples } 