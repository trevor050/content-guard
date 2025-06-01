#!/usr/bin/env node

const { ConfusablesAdvancedPlugin } = require('./lib/plugins/confusables-advanced-plugin')

async function testConfusables() {
  console.log('🔍 Testing Confusables Plugin')
  console.log('='.repeat(40))
  
  const plugin = new ConfusablesAdvancedPlugin()
  
  const testCases = [
    'уоu аrе trаsh аnd shоuld kiII уоursеIf immeԁiаtеlу', // Cyrillic attack
    'you are trash and should kill yourself immediately', // Normal
    'hеllo wоrld', // Mixed Cyrillic
    'hello world'  // Normal
  ]
  
  for (const text of testCases) {
    console.log(`\nTesting: "${text}"`)
    console.log('Codepoints:', Array.from(text).slice(0, 10).map(c => c.codePointAt(0).toString(16)))
    
    const result = plugin.analyze(text, {})
    console.log('Normalized:', result.normalizedText)
    console.log('Score:', result.score)
    console.log('Flags:', result.flags)
    console.log('Same?', text === result.normalizedText)
  }
}

testConfusables().catch(console.error) 