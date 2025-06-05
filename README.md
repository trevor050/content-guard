# ContentGuard v0.1.0 (Beta)

🛡️ **Advanced Content Analysis System - Pre-1.0 Development Version**

> ⚠️ **BETA SOFTWARE**: This is a pre-1.0 development version. The API may change between releases. Use in production at your own risk.

Modern content moderation and spam detection with context-aware analysis, harassment detection, and ML-powered toxicity classification.

## 🚀 Quick Start

### Installation

```bash
npm install content-guard
```

**Note**: This is version 0.1.0 - a development release. For production use, please wait for v1.0.0 stable.

### Basic Usage

```javascript
const { ContentGuard } = require('content-guard');

// Create an instance
const guard = new ContentGuard('moderate');

// Analyze content
const result = await guard.analyze('Hello world!');
console.log(result.isSpam); // false
console.log(result.score);  // 0

// Check problematic content
const spamResult = await guard.analyze('toxic message here');
console.log(spamResult.isSpam); // true
console.log(spamResult.score);  // 7+
```

## 🎯 Available Variants (Beta)

| Variant | Speed | Accuracy | Status | Use Case |
|---------|-------|----------|--------|----------|
| **ContentGuard** | ~0.3ms | 92%+ | ✅ Stable | General use (recommended) |
| **V4Fast** | ~0.05ms | 90%+ | 🧪 Beta | High-throughput systems |
| **V4Balanced** | ~0.3ms | 93%+ | 🧪 Beta | Production applications |
| **V4Large** | ~1.5ms | 94%+ | 🧪 Beta | Maximum accuracy |
| **V4Turbo** | ~0.02ms | 91%+ | 🧪 Beta | Ultra-fast processing |

### Using Variants

```javascript
const { ContentGuard, createGuard } = require('content-guard');

// Recommended: Use main ContentGuard class
const guard = new ContentGuard('moderate');

// Beta: Use variants (API may change)
const fastGuard = createGuard('fast');
const balancedGuard = createGuard('balanced');
```

## 📋 Integration Examples

### Express.js Middleware

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('moderate');

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
    
    next();
  } catch (error) {
    console.error('Moderation error:', error);
    next(); // Fail open on errors
  }
};

app.use('/api/comments', contentModeration);
```

### Contact Form Processing

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('lenient'); // More permissive for forms

async function processContactForm(formData) {
  try {
    const result = await guard.analyze({
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
    
    return { success: true };
  } catch (error) {
    console.error('Form processing error:', error);
    // Fail open in beta - allow submission
    return { success: true };
  }
}
```

## 🛠️ Configuration

### Preset Configurations

```javascript
const { ContentGuard } = require('content-guard');

// Available presets
const strictGuard = new ContentGuard('strict');     // Low tolerance
const moderateGuard = new ContentGuard('moderate'); // Balanced (default)
const lenientGuard = new ContentGuard('lenient');   // High tolerance
const gamingGuard = new ContentGuard('gaming');     // Gaming-aware
const professionalGuard = new ContentGuard('professional'); // Business context
```

### Custom Configuration

```javascript
const guard = new ContentGuard('moderate', {
  spamThreshold: 6,           // Custom threshold
  enableMLFeatures: true,     // Enable ML analysis (beta)
  enableEmojiAnalysis: true,  // Emoji sentiment (beta)
  enableCrossCultural: true,  // Cross-cultural analysis (beta)
  debug: false
});
```

## 📊 Response Format

```javascript
{
  isSpam: false,
  score: 2.3,
  confidence: 0.85,
  flags: ['Detection reason'],
  preset: 'moderate',
  version: '0.1.0',
  metadata: {
    processingTime: 12,
    context: { /* context analysis */ },
    mlAnalysis: { /* ML results (beta) */ },
    performance: { /* performance metrics */ }
  },
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

## 🧪 Testing & Development

### Run Tests

```bash
# Run basic tests
npm test

# Run simple demo
npm run demo:simple

# Run benchmark
npm run benchmark
```

### CLI Usage (Beta)

```bash
# Analyze text
npx contentguard "Hello world"

# With options
npx contentguard "Some text" --preset strict --explain

# See examples
npx contentguard examples
```

## ⚠️ Beta Limitations & Known Issues

- **API Stability**: Method signatures may change before v1.0
- **Performance**: Not yet optimized for high-volume production
- **ML Features**: Experimental, may have accuracy issues
- **Documentation**: Some features may be underdocumented
- **Breaking Changes**: Expected between 0.x versions

## 🔧 Error Handling

Always implement robust error handling in this beta version:

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('moderate');

async function analyzeWithFallback(content) {
  try {
    return await guard.analyze(content);
  } catch (error) {
    console.error('ContentGuard error:', error.message);
    
    // Beta fallback - return safe default
    return {
      isSpam: false,
      score: 0,
      confidence: 0,
      flags: ['Analysis failed - using fallback'],
      error: true
    };
  }
}
```

## 🗺️ Roadmap to v1.0

- [ ] **v0.2.0**: API stabilization, performance improvements
- [ ] **v0.3.0**: Enhanced ML features, better accuracy
- [ ] **v0.4.0**: Production optimizations, memory improvements
- [ ] **v0.5.0**: Complete documentation, comprehensive tests
- [ ] **v1.0.0**: Stable API, production-ready, breaking change freeze

## 🤝 Contributing & Feedback

This is a beta package. Issues and feedback are welcome:

- **Issues**: [GitHub Issues](https://github.com/trevor050/content-guard/issues)
- **Feature Requests**: Tag as `enhancement`
- **Bug Reports**: Tag as `bug`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏷️ Version History

- **0.1.0** (Current): Initial beta release, basic functionality
- **Previous versions (1.x-4.x)**: Legacy versions, not recommended

> **Note**: Versions 1.0.0 through 4.7.1 were incorrectly published before the package was stable. Starting with 0.1.0, we're following proper semantic versioning. The legacy versions are deprecated.

---

**ContentGuard v0.1.0** - Modern content analysis for the web (Beta) 