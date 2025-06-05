#!/usr/bin/env node

/**
 * Test all variants with clear spam cases to ensure they work correctly
 */

const { createGuard } = require('./index.js');

const clearSpamCases = [
  'fuck you asshole you should kill yourself',
  'you are a worthless piece of shit', 
  'go die in a fire you stupid bitch',
  'I hate you so much you should just end it',
  'kill yourself retard nobody likes you'
];

const variants = ['fast', 'balanced', 'turbo', 'large'];

async function testAllVariants() {
  console.log('🧪 TESTING ALL VARIANTS WITH CLEAR SPAM CASES\n');
  
  const results = {};
  
  for (const variant of variants) {
    console.log(`🚀 Testing v4.5-${variant}:`);
    console.log('='.repeat(50));
    
    try {
      const guard = createGuard(variant, { debug: false });
      let passedCount = 0;
      const variantResults = [];
      
      for (let i = 0; i < clearSpamCases.length; i++) {
        const testCase = clearSpamCases[i];
        const startTime = Date.now();
        const result = await guard.analyze(testCase);
        const endTime = Date.now();
        
        const status = result.isSpam ? '🚫 BLOCKED' : '⚠️  ALLOWED';
        const emoji = result.isSpam ? '✅' : '❌';
        const processingTime = endTime - startTime;
        
        console.log(`${emoji} Test ${i+1}: Score ${result.score} | ${status} | Risk: ${result.riskLevel} | ${processingTime}ms`);
        console.log(`   Input: "${testCase.substring(0, 50)}${testCase.length > 50 ? '...' : ''}"`);
        
        if (result.isSpam) {
          passedCount++;
        } else {
          console.log(`   ❌ FAILED - Should have been blocked!`);
        }
        
        variantResults.push({
          testCase: testCase.substring(0, 30) + '...',
          score: result.score,
          isSpam: result.isSpam,
          riskLevel: result.riskLevel,
          processingTime
        });
      }
      
      const avgTime = variantResults.reduce((sum, r) => sum + r.processingTime, 0) / variantResults.length;
      
      console.log(`\n📊 ${variant} Summary: ${passedCount}/5 correctly blocked | Avg time: ${avgTime.toFixed(2)}ms\n`);
      
      results[variant] = {
        passedCount,
        totalTests: clearSpamCases.length,
        avgProcessingTime: avgTime,
        results: variantResults
      };
      
    } catch (error) {
      console.error(`❌ ${variant} variant failed:`, error.message);
      results[variant] = { error: error.message };
    }
  }
  
  // Summary table
  console.log('\n📈 SUMMARY TABLE:');
  console.log('='.repeat(80));
  console.log('Variant     | Pass Rate | Avg Time  | Status');
  console.log('-'.repeat(80));
  
  variants.forEach(variant => {
    const result = results[variant];
    if (result.error) {
      console.log(`v4.5-${variant.padEnd(7)} | ERROR     | N/A       | ❌ Failed`);
    } else {
      const passRate = `${result.passedCount}/${result.totalTests}`;
      const avgTime = `${result.avgProcessingTime.toFixed(2)}ms`;
      const status = result.passedCount === result.totalTests ? '✅ Perfect' : 
                    result.passedCount >= 4 ? '⚠️  Good' : '❌ Poor';
      
      console.log(`v4.5-${variant.padEnd(7)} | ${passRate.padEnd(9)} | ${avgTime.padEnd(9)} | ${status}`);
    }
  });
  
  return results;
}

if (require.main === module) {
  testAllVariants().catch(console.error);
}

module.exports = { testAllVariants }; 