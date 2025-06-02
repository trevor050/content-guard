/**
 * ContentGuard v4.5 NPM Package Usage Examples
 * 
 * Real-world integration examples for different use cases:
 * - High-throughput API endpoints
 * - Real-time chat moderation
 * - Form submission filtering
 * - Batch content processing
 */

const { createGuard, ContentGuardV4Fast, ContentGuardV4Large } = require('../index.js');

// ==========================================
// Example 1: Express.js API Middleware
// ==========================================

async function expressMiddlewareExample() {
  console.log('\n🚀 Example 1: Express.js API Middleware\n');
  
  // Initialize fast variant for high-throughput API
  const guard = createGuard('fast', {
    spamThreshold: 5,
    debug: false
  });
  
  // Simulated Express middleware
  const contentModerationMiddleware = async (req, res, next) => {
    try {
      const content = req.body.message || req.body.comment || req.body.content;
      
      if (!content) {
        return next(); // Skip if no content to check
      }
      
      const startTime = Date.now();
      const result = await guard.analyze(content);
      const processingTime = Date.now() - startTime;
      
      console.log(`📊 API Request Analysis:`);
      console.log(`   Content: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);
      console.log(`   Score: ${result.score}`);
      console.log(`   Is Spam: ${result.isSpam}`);
      console.log(`   Processing Time: ${processingTime}ms`);
      console.log(`   Confidence: ${result.confidence}`);
      
      if (result.isSpam) {
        return res.status(400).json({
          error: 'Content blocked',
          reason: 'Inappropriate content detected',
          score: result.score,
          flags: result.flags.slice(0, 3) // Don't expose all internal flags
        });
      }
      
      // Add moderation metadata to request
      req.moderationResult = result;
      next();
      
    } catch (error) {
      console.error('Moderation error:', error);
      next(); // Continue on error (fail open)
    }
  };
  
  // Simulate API requests
  const testRequests = [
    { body: { message: "Hello! This is a great service!" } },
    { body: { comment: "you should kill yourself" } },
    { body: { content: "Critical bug fix needed for production server" } },
    { body: { message: "💰 CLICK HERE FOR FREE MONEY 💰" } }
  ];
  
  for (const req of testRequests) {
    const res = {
      status: (code) => ({ json: (data) => console.log(`   Response: ${code} -`, data) }),
      json: (data) => console.log(`   Response: 200 -`, data)
    };
    
    await contentModerationMiddleware(req, res, () => console.log('   ✅ Request approved\n'));
  }
}

// ==========================================
// Example 2: Real-time Chat Moderation
// ==========================================

async function chatModerationExample() {
  console.log('\n💬 Example 2: Real-time Chat Moderation\n');
  
  // Use turbo variant for ultra-fast chat processing
  const chatGuard = createGuard('turbo', {
    spamThreshold: 4, // Slightly more sensitive for chat
    debug: false
  });
  
  // Chat message handler
  class ChatModerator {
    constructor() {
      this.processedMessages = 0;
      this.blockedMessages = 0;
      this.startTime = Date.now();
    }
    
    async processMessage(username, message) {
      this.processedMessages++;
      
      const result = await chatGuard.analyze({
        name: username,
        message: message
      });
      
      if (result.isSpam) {
        this.blockedMessages++;
        console.log(`🚫 BLOCKED: ${username}: "${message}"`);
        console.log(`   Reason: Score ${result.score} (${result.flags[0] || 'Spam detected'})`);
        
        return {
          blocked: true,
          reason: 'Message violates community guidelines',
          score: result.score
        };
      } else {
        console.log(`✅ ALLOWED: ${username}: "${message}"`);
        console.log(`   Score: ${result.score} (Clean)`);
        
        return {
          blocked: false,
          score: result.score
        };
      }
    }
    
    getStats() {
      const runtime = Date.now() - this.startTime;
      const throughput = (this.processedMessages / (runtime / 1000)).toFixed(1);
      const blockRate = ((this.blockedMessages / this.processedMessages) * 100).toFixed(1);
      
      return {
        processed: this.processedMessages,
        blocked: this.blockedMessages,
        blockRate: `${blockRate}%`,
        throughput: `${throughput} messages/sec`,
        runtime: `${runtime}ms`
      };
    }
  }
  
  const moderator = new ChatModerator();
  
  // Simulate chat messages
  const chatMessages = [
    ['Alice', 'Hey everyone! How is everyone doing today?'],
    ['Bob', 'Working on some code, having a great time!'],
    ['TrollUser123', 'you all suck and should kill yourselves'],
    ['Charlie', 'Check out this cool project I found'],
    ['SpamBot', 'CLICK HERE FOR FREE CRYPTO!!! URGENT!!!'],
    ['Dave', 'The server needs a critical restart to kill the hanging processes'],
    ['Eve', 'This game is literally killing my free time lol'],
    ['BadActor', 'kys loser nobody likes you']
  ];
  
  for (const [username, message] of chatMessages) {
    await moderator.processMessage(username, message);
  }
  
  console.log('\n📈 Chat Moderation Stats:', moderator.getStats());
}

// ==========================================
// Example 3: Form Submission Processing
// ==========================================

async function formProcessingExample() {
  console.log('\n📝 Example 3: Contact Form Processing\n');
  
  // Use balanced variant for contact forms (good accuracy + speed)
  const formGuard = createGuard('balanced', {
    spamThreshold: 6, // More lenient for contact forms
    debug: false
  });
  
  const processContactForm = async (formData) => {
    console.log(`📋 Processing form from: ${formData.email}`);
    
    // Combine all text fields for analysis
    const content = [
      formData.name,
      formData.subject,
      formData.message
    ].filter(Boolean).join(' ');
    
    const result = await formGuard.analyze({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });
    
    console.log(`   Combined content: "${content.substring(0, 80)}..."`);
    console.log(`   Analysis result: Score ${result.score}, Spam: ${result.isSpam}`);
    
    if (result.isSpam) {
      console.log(`   🚫 Form rejected - ${result.flags[0] || 'Spam detected'}`);
      return {
        success: false,
        error: 'Submission blocked due to policy violation',
        score: result.score
      };
    } else {
      console.log(`   ✅ Form accepted - forwarding to support team`);
      return {
        success: true,
        ticketId: `TICKET-${Date.now()}`,
        score: result.score
      };
    }
  };
  
  // Test form submissions
  const formSubmissions = [
    {
      name: 'John Smith',
      email: 'john@company.com',
      subject: 'Product inquiry',
      message: 'Hi, I\'m interested in learning more about your enterprise solutions.'
    },
    {
      name: 'Angry Customer',
      email: 'mad@email.com',
      subject: 'URGENT COMPLAINT',
      message: 'Your service is absolute garbage and you should all kill yourselves!'
    },
    {
      name: 'Technical User',
      email: 'dev@startup.com',
      subject: 'Critical server issue',
      message: 'Our production server is experiencing critical issues. Need to kill hanging processes ASAP.'
    },
    {
      name: 'Spammer',
      email: 'bot@spam.com',
      subject: 'MAKE MONEY FAST!!!',
      message: 'CLICK HERE NOW!!! Make $5000 per day working from home!!! Limited time offer!!!'
    }
  ];
  
  for (const form of formSubmissions) {
    const result = await processContactForm(form);
    console.log(`   Result:`, result);
    console.log('');
  }
}

// ==========================================
// Example 4: Batch Content Processing
// ==========================================

async function batchProcessingExample() {
  console.log('\n⚡ Example 4: Batch Content Processing\n');
  
  // Use large variant for batch processing where accuracy is key
  const batchGuard = createGuard('large', {
    spamThreshold: 5,
    debug: false
  });
  
  const processBatch = async (contents, batchId) => {
    console.log(`📦 Processing batch ${batchId} (${contents.length} items)`);
    
    const startTime = Date.now();
    const results = [];
    let spamCount = 0;
    
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      const result = await batchGuard.analyze(content);
      
      results.push({
        id: `${batchId}-${i + 1}`,
        content: content.substring(0, 50) + '...',
        score: result.score,
        isSpam: result.isSpam,
        confidence: result.confidence,
        primaryFlag: result.flags[0] || 'None'
      });
      
      if (result.isSpam) spamCount++;
    }
    
    const processingTime = Date.now() - startTime;
    const avgTime = processingTime / contents.length;
    
    console.log(`   Processed: ${contents.length} items in ${processingTime}ms`);
    console.log(`   Average: ${avgTime.toFixed(2)}ms per item`);
    console.log(`   Spam detected: ${spamCount}/${contents.length} (${((spamCount/contents.length)*100).toFixed(1)}%)`);
    
    return {
      batchId,
      totalItems: contents.length,
      spamDetected: spamCount,
      processingTime,
      avgTimePerItem: avgTime,
      results
    };
  };
  
  // Simulate batch of user-generated content
  const contentBatch = [
    "This product is amazing! Really helped solve our problem.",
    "Worst service ever, complete waste of money",
    "you should all die in a fire",
    "The technical documentation could use some improvements",
    "URGENT: Critical security vulnerability needs immediate attention",
    "kys stupid developers",
    "Great customer support, very responsive team",
    "Process needs to be killed immediately - server hanging",
    "💰💰 MAKE MONEY FAST CLICK HERE NOW 💰💰",
    "Looking forward to the next product release!"
  ];
  
  const batchResult = await processBatch(contentBatch, 'BATCH-001');
  
  console.log('\n📊 Batch Results Summary:');
  console.log(`   Batch ID: ${batchResult.batchId}`);
  console.log(`   Items processed: ${batchResult.totalItems}`);
  console.log(`   Spam detected: ${batchResult.spamDetected}`);
  console.log(`   Average processing time: ${batchResult.avgTimePerItem.toFixed(2)}ms`);
  
  console.log('\n📋 Detailed Results:');
  batchResult.results.forEach(item => {
    const status = item.isSpam ? '🚫 SPAM' : '✅ CLEAN';
    console.log(`   ${item.id}: ${status} (Score: ${item.score.toFixed(1)}) - ${item.content}`);
  });
}

// ==========================================
// Example 5: Custom Configuration Patterns
// ==========================================

async function customConfigurationExample() {
  console.log('\n⚙️ Example 5: Custom Configuration Patterns\n');
  
  // Different configurations for different use cases
  const configs = {
    strictForum: createGuard('large', {
      spamThreshold: 3, // Very strict
      debug: false
    }),
    
    gamingChat: createGuard('fast', {
      spamThreshold: 7, // More lenient for gaming terminology
      debug: false
    }),
    
    professionalFeedback: createGuard('balanced', {
      spamThreshold: 8, // Very lenient for professional context
      debug: false
    })
  };
  
  const testContent = "This approach is completely wrong and needs to die";
  
  console.log(`Test content: "${testContent}"\n`);
  
  for (const [configName, guard] of Object.entries(configs)) {
    const result = await guard.analyze(testContent);
    
    console.log(`${configName.toUpperCase()}:`);
    console.log(`   Score: ${result.score.toFixed(2)}`);
    console.log(`   Is Spam: ${result.isSpam}`);
    console.log(`   Confidence: ${result.confidence}`);
    console.log(`   Primary Flag: ${result.flags[0] || 'None'}`);
    console.log('');
  }
}

// ==========================================
// Example 6: Performance Comparison
// ==========================================

async function performanceComparisonExample() {
  console.log('\n🏎️ Example 6: Performance Comparison\n');
  
  const variants = ['turbo', 'fast', 'balanced', 'large'];
  const testMessage = "you should kill yourself stupid idiot";
  const iterations = 10;
  
  console.log(`Testing "${testMessage}" across all variants (${iterations} iterations each)\n`);
  
  for (const variant of variants) {
    const guard = createGuard(variant, { debug: false });
    const times = [];
    let totalScore = 0;
    let detectionCount = 0;
    
    console.log(`${variant.toUpperCase()} Variant:`);
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      const result = await guard.analyze(testMessage);
      const time = Date.now() - startTime;
      
      times.push(time);
      totalScore += result.score;
      if (result.isSpam) detectionCount++;
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const avgScore = totalScore / iterations;
    const detectionRate = (detectionCount / iterations) * 100;
    
    console.log(`   Average time: ${avgTime.toFixed(2)}ms (${minTime}-${maxTime}ms range)`);
    console.log(`   Average score: ${avgScore.toFixed(2)}`);
    console.log(`   Detection rate: ${detectionRate.toFixed(0)}%`);
    console.log(`   Throughput: ${Math.round(1000 / avgTime)} analyses/sec`);
    console.log('');
  }
}

// ==========================================
// Main Execution
// ==========================================

async function runAllExamples() {
  console.log('🧪 ContentGuard v4.5 NPM Package Usage Examples');
  console.log('='.repeat(60));
  
  try {
    await expressMiddlewareExample();
    await chatModerationExample();
    await formProcessingExample();
    await batchProcessingExample();
    await customConfigurationExample();
    await performanceComparisonExample();
    
    console.log('\n🎉 All examples completed successfully!');
    console.log('\n💡 Integration Tips:');
    console.log('   • Use "turbo" for real-time chat/messaging');
    console.log('   • Use "fast" for high-volume API endpoints');
    console.log('   • Use "balanced" for general web forms');
    console.log('   • Use "large" for critical content moderation');
    console.log('   • Adjust spamThreshold based on your tolerance');
    console.log('   • Always handle errors gracefully (fail open)');
    
  } catch (error) {
    console.error('❌ Example failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run examples if called directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  expressMiddlewareExample,
  chatModerationExample,
  formProcessingExample,
  batchProcessingExample,
  customConfigurationExample,
  performanceComparisonExample
}; 