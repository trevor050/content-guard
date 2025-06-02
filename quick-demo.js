// Quick Demo: ContentGuard v4.5 Clean Setup
// This demonstrates instant setup with no console noise

const { ContentGuard } = require('./index.js')

async function quickDemo() {
  console.log('🚀 ContentGuard v4.5 Quick Demo\n')
  
  // 1. INSTANT SETUP - Default v4.5-balanced, no console noise
  console.log('1. Instant Setup (Default v4.5-balanced):')
  const guard = new ContentGuard()
  
  // Test clean content - should be silent
  console.log('   Testing clean content... (should be silent)')
  const cleanResult = await guard.analyze("Hello, this is a professional message about our project.")
  console.log(`   ✅ Clean: Score ${cleanResult.score}, ${cleanResult.riskLevel}`)
  
  // Test spam content - should be silent
  console.log('   Testing harmful content... (should be silent)')
  const spamResult = await guard.analyze("уоu аrе trаsh and should go die")
  console.log(`   🚨 Spam: Score ${spamResult.score}, ${spamResult.riskLevel}`)
  
  console.log()
  
  // 2. EASY VARIANT SWITCHING - One line change
  console.log('2. Easy Variant Switching (One Line):')
  
  // Fast variant
  const fastGuard = new ContentGuard({ variant: 'fast' })
  const fastResult = await fastGuard.analyze("уоu аrе trаsh and should go die")
  console.log(`   Fast: Score ${fastResult.score}, Time: ${fastResult.processingTime}ms`)
  
  // Large variant  
  const largeGuard = new ContentGuard({ variant: 'large' })
  const largeResult = await largeGuard.analyze("уоu аrе trаsh and should go die")
  console.log(`   Large: Score ${largeResult.score}, Time: ${largeResult.processingTime}ms`)
  
  // Turbo variant
  const turboGuard = new ContentGuard({ variant: 'turbo' })
  const turboResult = await turboGuard.analyze("уоu аrе trаsh and should go die")
  console.log(`   Turbo: Score ${turboResult.score}, Time: ${turboResult.processingTime}ms`)
  
  console.log()
  
  // 3. SIMPLE SPAM CHECK
  console.log('3. Simple Spam Check:')
  const isSpam = await guard.isSpam("Click here for free money!!!")
  console.log(`   "Click here for free money!!!" → ${isSpam ? 'SPAM' : 'CLEAN'}`)
  
  const isClean = await guard.isSpam("Thank you for your professional feedback.")
  console.log(`   "Thank you for your professional feedback." → ${isClean ? 'SPAM' : 'CLEAN'}`)
  
  console.log('\n✨ Demo complete! Clean setup, no noise, easy switching.')
}

quickDemo().catch(console.error) 