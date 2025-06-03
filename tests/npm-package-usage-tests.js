/**
 * ContentGuard v4.7 NPM Package Usage Tests
 * 
 * Demonstrates real-world usage patterns for ContentGuard as an NPM package
 * Tests all 4 variants: fast, balanced, large, turbo
 */

const assert = require('assert');
const { 
  ContentGuard, 
  ContentGuardV4Fast, 
  ContentGuardV4Balanced, 
  ContentGuardV4Large, 
  ContentGuardV4Turbo,
  createGuard 
} = require('../index.js');

// Simple test runner
const tests = [];
const results = { passed: 0, failed: 0, total: 0 };

function test(description, testFn) {
  tests.push({ description, testFn });
}

function group(name, groupFn) {
  console.log(`\n📋 ${name}`);
  console.log('─'.repeat(50));
  groupFn();
}

async function runTests() {
  console.log('🧪 Running ContentGuard v4.7 NPM Package Usage Tests...\n');
  
  for (const { description, testFn } of tests) {
    try {
      results.total++;
      await testFn();
      console.log(`  ✅ ${description}`);
      results.passed++;
    } catch (error) {
      console.log(`  ❌ ${description}`);
      console.log(`     Error: ${error.message}`);
      results.failed++;
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Test Results: ${results.passed} passed, ${results.failed} failed, ${results.total} total`);
  
  if (results.failed === 0) {
    console.log('🎉 All tests passed! ContentGuard v4.7 is ready for production use.');
  } else {
    console.log('⚠️ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Test data representing realistic user content
const testCases = {
  clean: [
    "Hello! I'm excited about this new project opportunity.",
    "The quarterly report shows promising growth in Q3.",
    "Could you please send me the meeting notes from yesterday?",
    "Great work on the presentation, it was very informative.",
    "I'll be working from home tomorrow due to a doctor's appointment."
  ],
  spam: [
    "you should kill yourself",
    "go die in a fire you worthless piece of trash",
    "I'll find where you live and make you pay",
    "kys loser nobody likes you anyway",
    "die already you pathetic waste of space"
  ],
  borderline: [
    "Your performance has been concerning lately",
    "This is absolutely critical and needs immediate attention",
    "I'm disappointed with the quality of this work",
    "We need to discuss your attitude problem",
    "Your approach to this project is completely wrong"
  ],
  technical: [
    "Need to kill the database process that's consuming too much memory",
    "The server is experiencing critical issues and may die",
    "Let's terminate the hanging processes and restart the service",
    "Kill all zombie processes before deploying",
    "This bug is literally killing our application performance"
  ]
};

// Performance tracking
const performanceResults = {
  fast: [],
  balanced: [],
  large: [],
  turbo: []
};

// Define all tests
group('Basic Package Import and Initialization', () => {
  test('should import all v4.7 variants successfully', () => {
    assert(ContentGuardV4Fast, 'ContentGuardV4Fast should be available');
    assert(ContentGuardV4Balanced, 'ContentGuardV4Balanced should be available');
    assert(ContentGuardV4Large, 'ContentGuardV4Large should be available');
    assert(ContentGuardV4Turbo, 'ContentGuardV4Turbo should be available');
    assert(createGuard, 'createGuard factory should be available');
  });

  test('should create instances of each variant', () => {
    const fastGuard = new ContentGuardV4Fast();
    const balancedGuard = new ContentGuardV4Balanced();
    const largeGuard = new ContentGuardV4Large();
    const turboGuard = new ContentGuardV4Turbo();

    assert(fastGuard instanceof ContentGuardV4Fast, 'Fast variant should instantiate');
    assert(balancedGuard instanceof ContentGuardV4Balanced, 'Balanced variant should instantiate');
    assert(largeGuard instanceof ContentGuardV4Large, 'Large variant should instantiate');
    assert(turboGuard instanceof ContentGuardV4Turbo, 'Turbo variant should instantiate');
  });

  test('should use createGuard factory for all variants', () => {
    const fastGuard = createGuard('fast');
    const balancedGuard = createGuard('balanced');
    const largeGuard = createGuard('large');
    const turboGuard = createGuard('turbo');

    assert(fastGuard, 'Fast guard should be created via factory');
    assert(balancedGuard, 'Balanced guard should be created via factory');
    assert(largeGuard, 'Large guard should be created via factory');
    assert(turboGuard, 'Turbo guard should be created via factory');
  });
});

group('Real-World Content Analysis - Fast Variant (High Throughput)', () => {
  let fastGuard;

  test('initialize fast variant', () => {
    fastGuard = createGuard('fast', { debug: false });
    assert(fastGuard, 'Fast guard should initialize');
  });

  test('should correctly identify clean content', async () => {
    const text = testCases.clean[0];
    const startTime = Date.now();
    const result = await fastGuard.analyze(text);
    const processingTime = Date.now() - startTime;
    
    performanceResults.fast.push(processingTime);
    
    assert.strictEqual(result.isSpam, false, `Clean content should not be flagged as spam: "${text}"`);
    assert(result.score < 5, `Clean content score should be low: ${result.score} for "${text}"`);
    assert(processingTime < 200, `Fast variant should be quick: ${processingTime}ms`);
    
    console.log(`     Performance: ${processingTime}ms, Score: ${result.score}`);
  });

  test('should correctly identify spam content', async () => {
    const text = testCases.spam[0];
    const startTime = Date.now();
    const result = await fastGuard.analyze(text);
    const processingTime = Date.now() - startTime;
    
    performanceResults.fast.push(processingTime);
    
    assert.strictEqual(result.isSpam, true, `Spam content should be flagged: "${text}"`);
    assert(result.score >= 5, `Spam content score should be high: ${result.score} for "${text}"`);
    assert(result.flags.length > 0, 'Spam content should have detection flags');
    assert(processingTime < 200, `Fast variant should be quick: ${processingTime}ms`);
    
    console.log(`     Performance: ${processingTime}ms, Score: ${result.score}, Flags: ${result.flags.length}`);
  });

  test('should handle technical content appropriately', async () => {
    const text = testCases.technical[0];
    const result = await fastGuard.analyze(text);
    
    // Technical content might trigger some patterns but should have lower scores
    assert(result.score < 8, `Technical content should have moderate score: ${result.score} for "${text}"`);
    console.log(`     Technical content score: ${result.score}`);
  });
});

group('Real-World Content Analysis - Balanced Variant (Production Use)', () => {
  let balancedGuard;

  test('initialize balanced variant', () => {
    balancedGuard = createGuard('balanced', { debug: false });
    assert(balancedGuard, 'Balanced guard should initialize');
  });

  test('should provide balanced accuracy and speed', async () => {
    const text = testCases.clean[0];
    const startTime = Date.now();
    const result = await balancedGuard.analyze(text);
    const processingTime = Date.now() - startTime;
    
    performanceResults.balanced.push(processingTime);
    
    assert.strictEqual(result.isSpam, false, `Clean content should not be flagged: "${text}"`);
    assert(processingTime < 1000, `Balanced variant should be reasonably fast: ${processingTime}ms`);
    
    console.log(`     Performance: ${processingTime}ms, Score: ${result.score}`);
  });

  test('should handle borderline content with nuance', async () => {
    const text = testCases.borderline[0];
    const result = await balancedGuard.analyze(text);
    
    // Borderline content should not be flagged as spam in professional contexts
    assert.strictEqual(result.isSpam, false, `Borderline professional content should not be spam: "${text}"`);
    assert(result.score < 5, `Borderline content should have low score: ${result.score}`);
    
    console.log(`     Borderline content score: ${result.score}`);
  });

  test('should provide detailed analysis metadata', async () => {
    const result = await balancedGuard.analyze(testCases.spam[0]);
    
    assert(result.metadata || result.flags, 'Should provide detailed metadata or flags');
    assert(result.confidence > 0.5, 'Should provide confidence score');
    
    console.log(`     Confidence: ${result.confidence}, Flags: ${result.flags?.length || 0}`);
  });
});

group('Real-World Content Analysis - Large Variant (Maximum Accuracy)', () => {
  let largeGuard;

  test('initialize large variant', () => {
    largeGuard = createGuard('large', { debug: false });
    assert(largeGuard, 'Large guard should initialize');
  });

  test('should provide maximum accuracy for critical decisions', async () => {
    const text = testCases.spam[0];
    const startTime = Date.now();
    const result = await largeGuard.analyze(text);
    const processingTime = Date.now() - startTime;
    
    performanceResults.large.push(processingTime);
    
    assert.strictEqual(result.isSpam, true, `Large variant should catch all spam: "${text}"`);
    assert(result.flags.length > 0, 'Should provide detailed detection flags');
    assert(processingTime < 5000, `Large variant should complete in reasonable time: ${processingTime}ms`);
    
    console.log(`     Performance: ${processingTime}ms, Score: ${result.score}, Flags: ${result.flags.length}`);
  });

  test('should provide sophisticated context awareness', async () => {
    const text = testCases.technical[0];
    const result = await largeGuard.analyze(text);
    
    // Large variant should be context-aware and not flag technical content
    assert.strictEqual(result.isSpam, false, `Technical content should not be flagged: "${text}"`);
    assert(result.score < 5, `Technical content should have low score: ${result.score}`);
    
    console.log(`     Technical content handling - Score: ${result.score}`);
  });
});

group('Real-World Content Analysis - Turbo Variant (Ultra Speed)', () => {
  let turboGuard;

  test('initialize turbo variant', () => {
    turboGuard = createGuard('turbo', { debug: false });
    assert(turboGuard, 'Turbo guard should initialize');
  });

  test('should provide ultra-fast analysis', async () => {
    const text = testCases.clean[0];
    const startTime = Date.now();
    const result = await turboGuard.analyze(text);
    const processingTime = Date.now() - startTime;
    
    performanceResults.turbo.push(processingTime);
    
    assert.strictEqual(result.isSpam, false, `Clean content should not be flagged: "${text}"`);
    assert(processingTime < 100, `Turbo variant should be extremely fast: ${processingTime}ms`);
    
    console.log(`     Ultra-fast performance: ${processingTime}ms, Score: ${result.score}`);
  });

  test('should still catch obvious spam quickly', async () => {
    const result = await turboGuard.analyze("you should kill yourself");
    
    assert.strictEqual(result.isSpam, true, 'Should catch obvious spam');
    assert(result.score > 5, 'Should have high spam score');
    
    console.log(`     Spam detection - Score: ${result.score}`);
  });
});

group('Batch Processing Simulation', () => {
  test('should handle high-volume content with fast variant', async () => {
    const fastGuard = createGuard('fast');
    const batchSize = 50; // Reduced for faster testing
    const testMessages = [];
    
    // Create a realistic batch of mixed content
    for (let i = 0; i < batchSize; i++) {
      const contentType = i % 4;
      switch (contentType) {
        case 0:
          testMessages.push(testCases.clean[i % testCases.clean.length]);
          break;
        case 1:
          testMessages.push(testCases.spam[i % testCases.spam.length]);
          break;
        case 2:
          testMessages.push(testCases.borderline[i % testCases.borderline.length]);
          break;
        case 3:
          testMessages.push(testCases.technical[i % testCases.technical.length]);
          break;
      }
    }
    
    const startTime = Date.now();
    const results = [];
    
    for (const message of testMessages) {
      const result = await fastGuard.analyze(message);
      results.push(result);
    }
    
    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / batchSize;
    const throughput = (batchSize / (totalTime / 1000)).toFixed(0);
    
    console.log(`     📊 Batch Results: ${batchSize} messages, ${totalTime}ms total`);
    console.log(`     📈 Average: ${avgTime.toFixed(2)}ms, Throughput: ${throughput}/sec`);
    
    assert(avgTime < 50, `Average processing time should be under 50ms: ${avgTime}ms`);
    assert(results.length === batchSize, 'Should process all messages');
    
    // Verify spam detection accuracy
    const spamResults = results.filter(r => r.isSpam);
    assert(spamResults.length > 5, 'Should detect spam messages');
  });
});

group('Configuration and Customization', () => {
  test('should accept custom configuration options', async () => {
    const customGuard = createGuard('balanced', {
      spamThreshold: 3, // Lower threshold
      debug: false
    });
    
    const result = await customGuard.analyze("This is borderline content");
    assert(result, 'Should work with custom configuration');
    
    console.log(`     Custom config result - Score: ${result.score}`);
  });

  test('should provide convenience methods', async () => {
    const guard = createGuard('fast');
    
    const isSpamResult = await guard.isSpam("you should kill yourself");
    const scoreResult = await guard.getScore("hello world");
    
    assert.strictEqual(typeof isSpamResult, 'boolean', 'isSpam should return boolean');
    assert.strictEqual(typeof scoreResult, 'number', 'getScore should return number');
    assert.strictEqual(isSpamResult, true, 'Should detect spam with isSpam method');
    assert(scoreResult < 5, 'Should return low score for clean content');
    
    console.log(`     Convenience methods - isSpam: ${isSpamResult}, score: ${scoreResult}`);
  });
});

group('Error Handling and Edge Cases', () => {
  test('should handle empty content gracefully', async () => {
    const guard = createGuard('balanced');
    
    const result = await guard.analyze('');
    assert(result, 'Should handle empty content');
    assert.strictEqual(result.isSpam, false, 'Empty content should not be spam');
    
    console.log(`     Empty content handling - Score: ${result.score}`);
  });

  test('should handle very long content', async () => {
    const guard = createGuard('fast');
    const longContent = 'This is a test message. '.repeat(100); // Reduced for testing
    
    const startTime = Date.now();
    const result = await guard.analyze(longContent);
    const processingTime = Date.now() - startTime;
    
    assert(result, 'Should handle long content');
    assert(processingTime < 2000, `Should process long content efficiently: ${processingTime}ms`);
    
    console.log(`     Long content (${longContent.length} chars) - ${processingTime}ms`);
  });

  test('should handle special characters and unicode', async () => {
    const guard = createGuard('balanced');
    const unicodeContent = "Hello 🌍! This has émojis and spëcial chars 中文";
    
    const result = await guard.analyze(unicodeContent);
    assert(result, 'Should handle unicode content');
    assert.strictEqual(result.isSpam, false, 'Unicode content should not be flagged');
    
    console.log(`     Unicode content - Score: ${result.score}`);
  });
});

// Run tests and show performance summary
runTests().then(() => {
  console.log('\n📈 Performance Summary:');
  
  const variants = ['fast', 'balanced', 'large', 'turbo'];
  variants.forEach(variant => {
    const times = performanceResults[variant];
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      console.log(`   ${variant.toUpperCase()}:`);
      console.log(`     Average: ${avg.toFixed(2)}ms (${min}-${max}ms range)`);
      console.log(`     Samples: ${times.length}`);
    }
  });
  
  console.log('\n💡 Usage Examples:');
  console.log('   const { createGuard } = require("content-guard");');
  console.log('   const guard = createGuard("fast"); // or balanced, large, turbo');
  console.log('   const result = await guard.analyze("Hello world");');
  console.log('   console.log(result.isSpam, result.score);');
  
}).catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
}); 