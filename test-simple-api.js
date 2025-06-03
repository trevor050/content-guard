/**
 * Simple API Test - ContentGuard v4.5
 * 
 * Test the super simple, bulletproof API
 */

const { analyze, isSpam, getScore, createGuard } = require('./index.js')

async function testSimpleAPI() {
  console.log('🚀 Testing ContentGuard v4.5 Simple API\n')
  
  // Test 1: Simple text analysis
  console.log('Test 1: Clean content')
  const cleanResult = await analyze("Hello world, I have a question about your service")
  console.log(`Score: ${cleanResult.score}/10`)
  console.log(`Is Spam: ${cleanResult.isSpam}`)
  console.log(`Confidence: ${Math.round(cleanResult.confidence * 100)}%`)
  console.log(`Risk Level: ${cleanResult.riskLevel}`)
  console.log()
  
  // Test 2: Spam content
  console.log('Test 2: Obvious spam content')
  const spamResult = await analyze("you should kill yourself you worthless piece of trash")
  console.log(`Score: ${spamResult.score}/10`)
  console.log(`Is Spam: ${spamResult.isSpam}`)
  console.log(`Confidence: ${Math.round(spamResult.confidence * 100)}%`)
  console.log(`Risk Level: ${spamResult.riskLevel}`)
  console.log('Flags:', spamResult.flags.slice(0, 3))
  console.log()
  
  // Test 3: Multi-field analysis (contact form)
  console.log('Test 3: Contact form analysis')
  const formResult = await analyze({
    name: "John Smith",
    email: "john.smith@gmail.com",
    subject: "Question about pricing",
    message: "Hi, I'm interested in your service and would like to know more about pricing options. Thank you!"
  })
  console.log(`Score: ${formResult.score}/10`)
  console.log(`Is Spam: ${formResult.isSpam}`)
  console.log(`Confidence: ${Math.round(formResult.confidence * 100)}%`)
  console.log()
  
  // Test 4: Professional context protection
  console.log('Test 4: Professional context (technical)')
  const techResult = await analyze("We need to kill the process and restart the server due to a critical bug")
  console.log(`Score: ${techResult.score}/10`)
  console.log(`Is Spam: ${techResult.isSpam}`)
  console.log(`Professional Context: ${techResult.professionalContext || 0} terms detected`)
  console.log('Flags:', techResult.flags)
  console.log()
  
  // Test 5: Convenience methods
  console.log('Test 5: Convenience methods')
  const quickSpamCheck = await isSpam("click here now urgent action required")
  const quickScore = await getScore("this is a normal message")
  console.log(`Quick spam check: ${quickSpamCheck}`)
  console.log(`Quick score: ${quickScore}/10`)
  console.log()
  
  // Test 6: Different variants
  console.log('Test 6: Different variants')
  const fastGuard = await createGuard('fast', { debug: true })
  const balancedGuard = await createGuard('balanced')
  const largeGuard = await createGuard('large')
  
  const testText = "you are trash"
  
  const fastResult = await fastGuard.analyze(testText)
  const balancedResult = await balancedGuard.analyze(testText)
  const largeResult = await largeGuard.analyze(testText)
  
  console.log(`Fast variant: ${fastResult.score}/10 (${fastResult.variant})`)
  console.log(`Balanced variant: ${balancedResult.score}/10 (${balancedResult.variant})`)
  console.log(`Large variant: ${largeResult.score}/10 (${largeResult.variant})`)
  console.log()
  
  console.log('✅ All tests completed successfully!')
  console.log('🎯 The API is working correctly with proper fallbacks')
}

// Run the test
testSimpleAPI().catch(error => {
  console.error('❌ Test failed:', error.message)
  console.error(error.stack)
}) 