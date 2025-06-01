#!/usr/bin/env node

const { ContentGuard } = require('./index.js')

async function testUnicodeAttack() {
  console.log('🔍 DEBUG: Unicode Attack Detection')
  console.log('='.repeat(50))
  
  const guard = new ContentGuard({
    plugins: { 
      obscenity: { weight: 3, contextAware: false }, 
      patterns: { weight: 3, contextAware: false } 
    },
    preprocessing: { 
      normalizeUnicode: true,
      normalizeLeetSpeak: true
    }
  })

  // Test the Cyrillic attack
  const cyrillic = 'уоu аrе trаsh аnd shоuld kiII уоursеIf immeԁiаtеlу'
  const normalLatin = 'you are trash and should kill yourself immediately'
  
  console.log('Testing Cyrillic attack:')
  console.log('Original:', cyrillic)
  console.log('Expected:', normalLatin)
  console.log('Codepoints:', Array.from(cyrillic).slice(0, 10).map(c => c.codePointAt(0).toString(16)))
  
  const result = await guard.analyze({ message: cyrillic })
  console.log('\nResult:')
  console.log('- Score:', result.score)
  console.log('- IsSpam:', result.isSpam)
  console.log('- Flags:', result.flags)
  console.log('- Preprocessing applied:', result.preprocessingApplied)
  console.log('- Normalized text:', result.normalizedText?.substring(0, 50))
  
  // Test normal version for comparison
  const normalResult = await guard.analyze({ message: normalLatin })
  console.log('\nNormal version result:')
  console.log('- Score:', normalResult.score)
  console.log('- IsSpam:', normalResult.isSpam)
  console.log('- Flags:', normalResult.flags)
  
  if (result.score === 0 && normalResult.score > 0) {
    console.log('\n❌ CRITICAL: Unicode normalization FAILED!')
    console.log('The Cyrillic attack is not being normalized to Latin characters')
  } else if (result.score > 0) {
    console.log('\n✅ Unicode normalization working')
  }
}

testUnicodeAttack().catch(console.error) 