# ContentGuard v0.1.2

**Professional content moderation and spam detection for modern applications.**

[![npm version](https://img.shields.io/npm/v/content-guard.svg)](https://www.npmjs.com/package/content-guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ContentGuard analyzes text for spam, harassment and malicious patterns. It combines a powerful rule engine with optional machine‑learning plugins to deliver fast and accurate results across many languages.

## Installation

```bash
npm install content-guard
```

## Quick start

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('moderate');
const result = await guard.analyze('Hello world');
console.log(result.isSpam);
```

## Key features

- Multiple presets from **lenient** to **strict**
- Context-aware detection using natural language processing
- Pluggable rule engine with keyboard spam, sentiment and harassment filters
- Optional ML plugins for emoji sentiment, cross‑cultural checks and toxicity analysis
- Unicode confusables normalization to stop obfuscation attacks
- CLI for batch processing and scripting
- Lightweight and fast – suitable for serverless environments
- TypeScript definitions included

## v4.5 Variants

ContentGuard v4.5 ships four tuned variants so you can balance speed and accuracy:

| Variant        | Accuracy | Avg time | Use case                                 |
|---------------|---------:|---------:|------------------------------------------|
| **v4.5-turbo**    | ~91%    | 0.02ms   | Real‑time chat and high‑volume streams   |
| **v4.5-fast**     | ~90%    | 0.06ms   | API gateways and microservices           |
| **v4.5-balanced** | ~93%    | 0.25ms   | General production deployments (default) |
| **v4.5-large**    | ~94%    | 1.32ms   | Enterprise and critical moderation       |

Select a variant when creating an instance or via the CLI.

## Plugins and use cases

ContentGuard includes a modular plugin system. Enable only what you need:

| Plugin                  | Description & typical use case                                 |
|-------------------------|----------------------------------------------------------------|
| **Obscenity**           | Detects offensive language. Use for community guidelines.       |
| **Sentiment**           | Scores tone of text. Great for chat analytics.                  |
| **Harassment**          | Flags bullying or hateful phrases. Essential for social apps.   |
| **Social Engineering**  | Finds phishing or scam attempts. Useful for email filters.       |
| **Keyboard Spam**       | Identifies random key mashing. Perfect for form submissions.     |
| **Emoji Sentiment**     | Interprets emoji tone. Adds nuance to sentiment analysis.        |
| **Cross‑Cultural**      | Checks for culturally sensitive terms. Global deployments.       |
| **ML Toxicity**         | Machine‑learning based toxicity scoring. Higher accuracy.        |
| **Confusables**         | Normalizes look‑alike Unicode characters. Prevents obfuscation.  |

## CLI usage

```bash
npx content-guard "Some text" --preset strict --variant fast
```

See the `examples/` folder for integration samples.

## Configuration

Each preset can be customized. Review `lib/presets` and adjust plugin weights, thresholds and preprocessing options to match your needs.

## License

ContentGuard is released under the MIT License.

---

**Other languages:** [Español](README.es.md) | [Français](README.fr.md) | [中文](README.cn.md)
