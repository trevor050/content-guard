/**
 * Test script for Enhanced ML Toxicity Detection
 * 
 * Tests the new state-of-the-art RoBERTa models:
 * - s-nlp/roberta_toxicity_classifier
 * - cardiffnlp/twitter-roberta-base-hate
 */

const { EnhancedMLToxicityPlugin } = require('./lib/plugins/enhanced-ml-toxicity-plugin')

async function testEnhancedML() {
  console.log('🚀 Testing Enhanced ML Toxicity Detection Plugin')
  console.log('=' .repeat(60))
  
  const plugin = new EnhancedMLToxicityPlugin()
  
  // Test cases that were previously failing
  const testCases = [
    // Adversarial attacks that were scoring 0% accuracy
    {
      text: "уоu аrе trаsh",
      category: "Adversarial v2",
      expected: "Should detect Cyrillic substitution"
    },
    {
      text: "k1ll y0urs3lf n0w",
      category: "Adversarial attacks", 
      expected: "Should detect l33tspeak evasion"
    },
    {
      text: "f u c k   y o u",
      category: "Adversarial attacks",
      expected: "Should detect spacing evasion"
    },
    
    // Cross-cultural harassment (33.3% accuracy)
    {
      text: "go back to your country where you belong",
      category: "Cross-cultural harassment",
      expected: "Should detect cultural harassment"
    },
    {
      text: "people like you don't understand real work",
      category: "Cross-cultural harassment", 
      expected: "Should detect identity-based harassment"
    },
    
    // AI-generated content (45.5% accuracy)
    {
      text: "I understand your concern, but perhaps you should consider that your perspective may be limited by your background",
      category: "AI-generated harassment",
      expected: "Should detect AI-style dismissive patterns"
    },
    
    // Emoji unicode attacks (21.4% accuracy)
    {
      text: "You should 💀💀💀 yourself",
      category: "Emoji unicode attacks",
      expected: "Should detect emoji-based threats"
    },
    {
      text: "🖕 you and your stupid ideas",
      category: "Emoji unicode attacks",
      expected: "Should detect offensive emoji patterns"
    },
    
    // Sophisticated harassment
    {
      text: "Remember who signs your paycheck when you question my decisions",
      category: "Power dynamics abuse",
      expected: "Should detect workplace harassment"
    },
    {
      text: "You're clearly overreacting to what was just constructive feedback",
      category: "Gaslighting",
      expected: "Should detect gaslighting patterns"
    },
    
    // Professional content (should NOT be flagged)
    {
      text: "We need immediate action to prevent catastrophic system failure",
      category: "Professional content",
      expected: "Should NOT flag legitimate business communication"
    },
    {
      text: "Critical security breach detected - all hands on deck to eliminate the threat",
      category: "Professional content",
      expected: "Should NOT flag technical emergency language"
    }
  ]
  
  console.log('Initializing enhanced ML models...')
  await plugin.initialize()
  
  if (plugin.initialized) {
    console.log('✅ Enhanced ML models loaded successfully!')
    console.log('📊 Model Details:')
    console.log('   - RoBERTa Toxicity Classifier: s-nlp/roberta_toxicity_classifier (AUC-ROC 0.98)')
    console.log('   - Twitter Hate Speech: cardiffnlp/twitter-roberta-base-hate')
  } else {
    console.log('⚠️ ML models failed to load, testing with semantic patterns only')
  }
  
  console.log('\n🧪 Running Test Cases...')
  console.log('=' .repeat(60))
  
  for (const testCase of testCases) {
    console.log(`\n📝 Testing: "${testCase.text.substring(0, 50)}..."`)
    console.log(`   Category: ${testCase.category}`)
    console.log(`   Expected: ${testCase.expected}`)
    
    const startTime = performance.now()
    const result = await plugin.analyze(testCase.text)
    const processingTime = performance.now() - startTime
    
    console.log(`   📊 Results:`)
    console.log(`      Score: ${result.score.toFixed(2)}`)
    console.log(`      Confidence: ${(result.details.confidence * 100).toFixed(1)}%`)
    console.log(`      Processing Time: ${processingTime.toFixed(2)}ms`)
    
    if (plugin.initialized) {
      console.log(`      RoBERTa Toxicity: ${result.details.roberta_toxicity ? (result.details.roberta_toxicity * 100).toFixed(1) + '%' : 'N/A'}`)
      console.log(`      Twitter Hate: ${result.details.twitter_hate ? (result.details.twitter_hate * 100).toFixed(1) + '%' : 'N/A'}`)
    }
    
    if (result.flags.length > 0) {
      console.log(`      Flags: ${result.flags.join(', ')}`)
    }
    
    if (result.details.semanticPatterns.length > 0) {
      console.log(`      Semantic Patterns: ${result.details.semanticPatterns.map(p => p.type).join(', ')}`)
    }
    
    // Simple scoring interpretation
    let interpretation = ''
    if (result.score === 0) {
      interpretation = '✅ CLEAN'
    } else if (result.score < 3) {
      interpretation = '⚠️ LOW RISK'
    } else if (result.score < 8) {
      interpretation = '🔴 MODERATE RISK'
    } else {
      interpretation = '🚨 HIGH RISK'
    }
    
    console.log(`      Interpretation: ${interpretation}`)
  }
  
  console.log('\n🎯 Summary')
  console.log('=' .repeat(60))
  console.log('Enhanced ML Toxicity Plugin combines:')
  console.log('✅ State-of-the-art RoBERTa models (AUC-ROC 0.98)')
  console.log('✅ Advanced semantic pattern detection')
  console.log('✅ Context-aware adjustments')
  console.log('✅ Ensemble scoring for maximum accuracy')
  console.log('✅ Professional content protection')
}

// Run the test
testEnhancedML().catch(error => {
  console.error('❌ Test failed:', error)
  process.exit(1)
}) 