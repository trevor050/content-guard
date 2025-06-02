# ContentGuard v4.5 - Ultimate Anti-Troll System

Revolutionary content analysis system with 4 optimized variants for maximum performance flexibility.

## 🚀 Quick Start as NPM Package

### Installation

```bash
npm install content-guard
```

### Basic Usage

```javascript
const { createGuard } = require('content-guard');

// Create a guard with your preferred variant
const guard = createGuard('balanced'); // fast, balanced, large, turbo

// Analyze content
const result = await guard.analyze('Hello world!');
console.log(result.isSpam); // false
console.log(result.score);  // 0

// Check spam content
const spamResult = await guard.analyze('you should kill yourself');
console.log(spamResult.isSpam); // true
console.log(spamResult.score);  // 7+
```

## 🎯 v4.5 Variants

| Variant | Speed | Accuracy | Use Case |
|---------|-------|----------|----------|
| **turbo** | ~0.02ms | 91%+ | Ultra high-throughput systems |
| **fast** | ~0.05ms | 90%+ | Real-time applications |
| **balanced** | ~0.3ms | 93%+ | General production use |
| **large** | ~1.5ms | 94%+ | Critical content moderation |

### Variant Selection

```javascript
const { createGuard } = require('content-guard');

// Ultra-fast for chat systems
const chatGuard = createGuard('turbo', {
  spamThreshold: 4 // More sensitive for chat
});

// Balanced for web forms  
const formGuard = createGuard('balanced', {
  spamThreshold: 6 // More lenient for forms
});

// Maximum accuracy for critical moderation
const moderationGuard = createGuard('large', {
  spamThreshold: 5 // Standard threshold
});
```

## 📋 Real-World Integration Examples

### Express.js Middleware

```javascript
const { createGuard } = require('content-guard');
const guard = createGuard('fast'); // High-throughput variant

const contentModeration = async (req, res, next) => {
  try {
    const content = req.body.message || req.body.comment;
    if (!content) return next();
    
    const result = await guard.analyze(content);
    
    if (result.isSpam) {
      return res.status(400).json({
        error: 'Content blocked',
        reason: 'Inappropriate content detected'
      });
    }
    
    req.moderationResult = result;
    next();
  } catch (error) {
    next(); // Fail open on errors
  }
};

app.use('/api/comments', contentModeration);
```

### Real-time Chat Moderation

```javascript
const { createGuard } = require('content-guard');
const chatGuard = createGuard('turbo'); // Ultra-fast for real-time

class ChatModerator {
  async processMessage(username, message) {
    const result = await chatGuard.analyze({ name: username, message });
    
    if (result.isSpam) {
      return {
        blocked: true,
        reason: 'Message violates community guidelines'
      };
    }
    
    return { blocked: false };
  }
}
```

### Batch Content Processing

```javascript
const { createGuard } = require('content-guard');
const batchGuard = createGuard('large'); // Maximum accuracy

async function processBatch(contents) {
  const results = [];
  
  for (const content of contents) {
    const result = await batchGuard.analyze(content);
    results.push({
      content: content.substring(0, 50) + '...',
      isSpam: result.isSpam,
      score: result.score,
      confidence: result.confidence
    });
  }
  
  return results;
}
```

### Contact Form Processing

```javascript
const { createGuard } = require('content-guard');
const formGuard = createGuard('balanced', {
  spamThreshold: 6 // More lenient for contact forms
});

async function processContactForm(formData) {
  const result = await formGuard.analyze({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message
  });
  
  if (result.isSpam) {
    return {
      success: false,
      error: 'Submission blocked due to policy violation'
    };
  }
  
  return {
    success: true,
    ticketId: `TICKET-${Date.now()}`
  };
}
```

## 🛠️ Advanced Configuration

### Custom Thresholds by Use Case

```javascript
const configs = {
  // Very strict for public forums
  strictForum: createGuard('large', {
    spamThreshold: 3
  }),
  
  // Lenient for gaming communities
  gamingChat: createGuard('fast', {
    spamThreshold: 7
  }),
  
  // Very lenient for professional feedback
  professionalFeedback: createGuard('balanced', {
    spamThreshold: 8
  })
};
```

### Convenience Methods

```javascript
const guard = createGuard('fast');

// Quick spam check
const isSpam = await guard.isSpam('some text');

// Get score only
const score = await guard.getScore('some text');

// Full analysis
const result = await guard.analyze('some text');
```

## 📊 Performance Benchmarks

Run your own benchmarks:

```bash
# Test all variants
node cli/analyze.js benchmark --variant all

# Test specific variant
node cli/analyze.js benchmark --variant fast --iterations 100
```

Example results:
- **Turbo**: 33,333 analyses/sec (0.03ms avg)
- **Fast**: 7,143 analyses/sec (0.14ms avg)  
- **Balanced**: 1,408 analyses/sec (0.71ms avg)
- **Large**: 690 analyses/sec (1.45ms avg)

## 🧪 Testing

Run comprehensive NPM package tests:

```bash
node tests/npm-package-usage-tests.js
```

Run integration examples:

```bash
node examples/npm-package-examples.js
```

## 📖 CLI Usage

ContentGuard also includes a powerful CLI:

```bash
# Analyze with fast variant
npx contentguard "Hello world" --variant fast

# Detailed analysis with large variant
npx contentguard "Some text" --variant large --explain --performance

# Custom threshold
npx contentguard "Some text" --variant balanced --threshold 3

# See all examples
npx contentguard examples
```

## 🎯 Choosing the Right Variant

- **Use `turbo`** for: Real-time chat, live comments, ultra high-volume APIs
- **Use `fast`** for: API endpoints, form validation, moderate-volume processing  
- **Use `balanced`** for: General web applications, contact forms, user content
- **Use `large`** for: Critical moderation, batch processing, maximum accuracy needs

## 🔧 Error Handling

Always implement graceful error handling:

```javascript
const guard = createGuard('balanced');

try {
  const result = await guard.analyze(content);
  // Process result
} catch (error) {
  console.error('Analysis failed:', error.message);
  // Fail open - allow content when in doubt
  // Or implement your fallback logic
}
```

## 📄 Response Format

```javascript
{
  isSpam: false,
  score: 2.3,
  confidence: 0.85,
  variant: 'v4.5-balanced',
  flags: ['Some detection flag'],
  riskLevel: 'LOW',
  recommendation: 'Allow - Clean content detected',
  metadata: {
    processingTime: 12,
    // ... additional metadata
  },
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

## 🌟 Why ContentGuard v4.5?

- **4 Performance Variants**: Choose speed vs accuracy based on your needs
- **93-94% Accuracy**: State-of-the-art detection across all variants
- **Context-Aware**: Understands technical, business, and cultural contexts
- **Production Ready**: Handles errors gracefully, fail-open design
- **TypeScript Support**: Full type definitions included
- **Zero Config**: Works out of the box, customize as needed

---

*ContentGuard v4.5 - The most advanced content analysis system for modern applications.* 