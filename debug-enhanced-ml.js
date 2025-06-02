/**
 * Debug script to understand why Enhanced ML plugin is causing false positives
 */

const ContentGuardV4Large = require('./lib/variants/v4-large')
const { ContentGuardV4Balanced } = require('./lib/variants/v4-balanced')

async function debugFalsePositives() {
  console.log('🔍 Debugging Enhanced ML False Positives')
  console.log('=' .repeat(60))
  
  // Test clean, legitimate content that should NOT be flagged
  const cleanContent = [
    "Thank you for your feedback on the project proposal.",
    "The meeting is scheduled for 3pm in conference room A.",
    "Please review the quarterly sales report and provide comments.",
    "The system maintenance will occur during off-peak hours.",
    "Your presentation was very informative and well-structured.",
    "I appreciate your hard work on this challenging assignment.",
    "The client requested changes to the user interface design.",
    "Could you please send me the updated project timeline?",
    "The training session covered important security protocols.",
    "Thank you for attending today's team meeting."
  ]
  
  const v4Large = new ContentGuardV4Large()
  const v4Balanced = new ContentGuardV4Balanced()
  
  // Allow time for ML models to initialize
  console.log('⏳ Waiting for ML models to initialize...')
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  console.log('\n🧪 Testing Clean Content:')
  console.log('=' .repeat(60))
  
  for (let i = 0; i < cleanContent.length; i++) {
    const text = cleanContent[i]
    console.log(`\n📝 Test ${i + 1}: "${text}"`)
    
    // Test both variants
    const largeResult = await v4Large.analyze(text)
    const balancedResult = await v4Balanced.analyze(text)
    
    console.log(`   v4.5-large: Score ${largeResult.score.toFixed(2)}, Risk: ${largeResult.riskLevel}`)
    console.log(`   v4.5-balanced: Score ${balancedResult.score.toFixed(2)}, Risk: ${balancedResult.riskLevel}`)
    
    // Show detailed flags for high-scoring content
    if (largeResult.score > 3) {
      console.log(`   🚨 v4.5-large flags: ${largeResult.flags.slice(0, 3).join(', ')}`)
    }
    
    if (balancedResult.score > 3) {
      console.log(`   🚨 v4.5-balanced flags: ${balancedResult.flags.slice(0, 3).join(', ')}`)
    }
    
    // Highlight discrepancies
    const scoreDiff = Math.abs(largeResult.score - balancedResult.score)
    if (scoreDiff > 5) {
      console.log(`   ⚠️ LARGE DISCREPANCY: ${scoreDiff.toFixed(2)} point difference!`)
    }
  }
  
  console.log('\n🎯 Summary')
  console.log('=' .repeat(60))
  console.log('Enhanced ML models should NOT flag clean professional content.')
  console.log('High scores on clean content indicate false positive issues.')
}

// Run the debug
debugFalsePositives().catch(error => {
  console.error('❌ Debug failed:', error)
  process.exit(1)
}) 