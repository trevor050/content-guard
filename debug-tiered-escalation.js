#!/usr/bin/env node

/**
 * 🔍 Debug Tiered Escalation
 * 
 * Focused test to debug why Tier 1 and Full Tiered are giving identical results
 */

const { ProductionTieredSystem } = require('./production-tiered-system.js')
const { ContentGuard } = require('./index.js')

async function debugEscalation() {
  console.log('🔍 DEBUG: Tiered Escalation Analysis')
  console.log('='.repeat(50))
  
  // Test cases that should trigger escalation
  const testCases = [
    'Hello, how are you?',  // Should stay in Tier 1
    'You are being way too sensitive about this - no one else has issues with my management style.', // Should escalate
    'уоu аrе trаsh аnd shоuld kiII уоursеIf immeԁiаtеlу', // Unicode attack - should escalate
    'Maybe you should stick to simpler tasks since this seems beyond your capabilities.', // Harassment - should escalate
    'Kill the process on server-prod-03', // Professional - should stay Tier 1
  ]
  
  const tieredSystem = new ProductionTieredSystem({
    enableTier3: true,
    escalationStrategy: 'balanced'
  })
  
  // Also test Tier 1 only for comparison
  const tier1Only = new ContentGuard({
    spamThreshold: 6,
    enableEarlyExit: true,
    enableCaching: false,
    plugins: {
      obscenity: { weight: 3.0, contextAware: false },
      patterns: { weight: 2.5, contextAware: false },
      validation: { weight: 2.0 }
    },
    preprocessing: {
      normalizeUnicode: true,
      normalizeLeetSpeak: false,
      expandSlang: false,
      contextAware: false
    }
  })
  
  console.log('\n📊 Testing Escalation Behavior:')
  console.log('─'.repeat(80))
  
  for (let i = 0; i < testCases.length; i++) {
    const text = testCases[i]
    console.log(`\n${i + 1}. Testing: "${text.substring(0, 60)}..."`)
    
    // Test Tier 1 only
    const tier1Result = await tier1Only.analyze({
      name: 'Test',
      email: 'test@example.com',
      message: text
    })
    
    // Test Full Tiered System
    const tieredResult = await tieredSystem.analyze({
      name: 'Test',
      email: 'test@example.com',
      message: text
    })
    
    console.log(`   Tier 1 Only:     Score: ${tier1Result.score}, Spam: ${tier1Result.isSpam}, Flags: ${tier1Result.flags?.length || 0}`)
    console.log(`   Tiered System:   Score: ${tieredResult.score}, Spam: ${tieredResult.isSpam}, Tier: ${tieredResult.tieredAnalysis?.usedTier}, Reason: ${tieredResult.tieredAnalysis?.escalationReason}`)
    
    // Check if escalation happened
    const escalated = tieredResult.tieredAnalysis?.usedTier > 1
    const scoreDifferent = Math.abs(tieredResult.score - tier1Result.score) > 0.1
    
    console.log(`   Escalation:      ${escalated ? '✅ ESCALATED' : '❌ STAYED T1'} | Score Change: ${scoreDifferent ? '✅ DIFFERENT' : '❌ IDENTICAL'}`)
    
    // Debug confidence calculation
    if (tieredResult.tieredAnalysis) {
      console.log(`   Confidence:      ${tieredResult.tieredAnalysis.confidence} | Processing: ${tieredResult.tieredAnalysis.processingTime.toFixed(2)}ms`)
    }
  }
  
  // Show overall distribution
  console.log('\n📈 Overall Distribution:')
  const metrics = tieredSystem.getPerformanceMetrics()
  if (metrics) {
    console.log(`   Tier 1: ${metrics.distribution.tier1}%`)
    console.log(`   Tier 2: ${metrics.distribution.tier2}%`)
    console.log(`   Tier 3: ${metrics.distribution.tier3}%`)
    console.log(`   Average Time: ${metrics.averageTime}ms`)
  }
  
  // Test confidence calculation directly
  console.log('\n🧮 Testing Confidence Calculation:')
  const testResults = [
    { score: 0, flags: [] },
    { score: 2, flags: ['[PATTERN] suspicious'] },
    { score: 5, flags: ['[HARASSMENT] detected', '[POSITIVE] professional'] },
    { score: 8, flags: ['[HARASSMENT] multiple', '[OBSCENITY] severe'] }
  ]
  
  testResults.forEach((testResult, i) => {
    const confidence = tieredSystem.calculateConfidence(testResult)
    const shouldEscalate = tieredSystem.shouldEscalateToTier2(testResult)
    console.log(`   Test ${i + 1}: Score ${testResult.score} → Confidence ${confidence} → Escalate: ${shouldEscalate}`)
  })
}

debugEscalation().catch(console.error) 