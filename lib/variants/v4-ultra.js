/**
 * ContentGuard v4.7 Ultra Preview - Experimental Maximum Accuracy Variant
 *
 * This variant uses a small logistic regression classifier on top of the
 * existing v4.7-large heuristics. It demonstrates integration with the
 * "natural" library as a lightweight ML example. The model is trained on
 * a tiny in-memory dataset and is intentionally slow compared to other
 * variants.
 */

const natural = require('natural')
const ContentGuardV4Large = require('./v4-large')

class ContentGuardV47Ultra extends ContentGuardV4Large {
  constructor(options = {}) {
    super(options)
    this.classifier = new natural.LogisticRegressionClassifier()
    // Minimal training data for demonstration
    this.classifier.addDocument('i hate you', 'harassment')
    this.classifier.addDocument('kill yourself', 'harassment')
    this.classifier.addDocument('you are trash', 'harassment')
    this.classifier.addDocument('have a nice day', 'clean')
    this.classifier.addDocument('let us schedule a meeting', 'clean')
    this.classifier.train()
  }

  async analyze(text, additionalData = {}) {
    const result = await super.analyze(text, additionalData)
    const label = this.classifier.classify(text.toLowerCase())
    if (label === 'harassment') {
      result.score += 2
      result.flags.push('ml-harassment')
    }
    return result
  }
}

module.exports = ContentGuardV47Ultra
module.exports.ContentGuardV47Ultra = ContentGuardV47Ultra
