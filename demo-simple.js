/**
 * ContentGuard v4.5.1 - Super Simple Demo
 * 
 * This shows how incredibly easy it is to use ContentGuard now.
 * Perfect for developers who just want spam detection that works.
 */

console.log('🚀 ContentGuard v4.5.1 - Super Simple Demo\n')

// Method 1: Ultra-simple (bulletproof, always works)
console.log('📦 Method 1: Ultra-Simple (Bulletproof)')
const simple = require('./simple.js')

async function demoSimple() {
  const tests = [
    'Hello, I have a question about your service',  // Clean
    'kill yourself you worthless trash',            // Spam
    'We need to kill the server process'            // Professional (protected)
  ]
  
  for (const text of tests) {
    const result = await simple.analyze(text)
    console.log(`"${text.substring(0, 30)}..." -> ${result.score}/10 (${result.isSpam ? 'SPAM' : 'CLEAN'})`)
  }
}

// Method 2: Smart API (advanced features with fallbacks)
console.log('\n⚡ Method 2: Smart API (Advanced + Fallbacks)')
const { analyze, isSpam, getScore } = require('./index.js')

async function demoSmart() {
  // Single function call - that's it!
  const result = await analyze('you should die in a fire')
  console.log(`Spam detected: ${result.isSpam} (score: ${result.score}/10)`)
  
  // Contact form analysis
  const formResult = await analyze({
    name: 'John Smith',
    email: 'john@example.com',
    subject: 'Question',
    message: 'Hi, I have a question about your pricing. Thanks!'
  })
  console.log(`Contact form: ${formResult.isSpam ? 'BLOCKED' : 'ALLOWED'} (score: ${formResult.score}/10)`)
  
  // Quick methods
  const quickSpam = await isSpam('click here now urgent offer')
  const quickScore = await getScore('normal message')
  console.log(`Quick spam check: ${quickSpam}`)
  console.log(`Quick score: ${quickScore}/10`)
}

// Method 3: Express.js integration (3 lines!)
console.log('\n🌐 Method 3: Express.js Integration')
function demoExpress() {
  console.log(`
// Express.js middleware - just 3 lines!
const { isSpam } = require('content-guard')

const moderate = async (req, res, next) => {
  if (req.body.message && await isSpam(req.body.message)) {
    return res.status(400).json({ error: 'Content blocked' })
  }
  next()
}

app.use('/api/comments', moderate)
`)
}

// Run all demos
async function runAllDemos() {
  await demoSimple()
  await demoSmart()
  demoExpress()
  
  console.log('\n✅ That\'s it! ContentGuard v4.5.1 is incredibly simple to use.')
  console.log('🎯 Choose the method that works best for your needs:')
  console.log('   • Ultra-simple: require("content-guard/simple") - Always works')
  console.log('   • Smart API: require("content-guard") - Advanced features + fallbacks')
  console.log('   • Express.js: 3-line middleware integration')
}

runAllDemos().catch(console.error) 