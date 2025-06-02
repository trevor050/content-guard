const ContentGuardV4Large = require('./lib/variants/v4-large');
const { CombinedBenchmarkRunner } = require('./tests/combined-benchmark-runner');

async function testBaseline() {
  console.log('🔍 Running baseline test with all algorithms OFF...');
  
  const runner = new CombinedBenchmarkRunner();
  
  // Override the models to test our specific configurations
  runner.models = {
    'v4.5-large-OFF': {
      type: 'variant',
      variant: 'large',
      debug: false,
      aggressiveness: {
        deepPatternAnalysis: 0,
        mlEnsemble: 0, 
        adversarialDetection: 0,
        linguisticFingerprinting: 0,
        crossCultural: 0
      }
    },
    'v4.5-large-ON': {
      type: 'variant', 
      variant: 'large',
      debug: false,
      aggressiveness: {
        deepPatternAnalysis: 100,
        mlEnsemble: 100,
        adversarialDetection: 100, 
        linguisticFingerprinting: 100,
        crossCultural: 100
      }
    }
  };
  
  const results = await runner.runCombinedBenchmark();
  
  console.log('\n📊 BASELINE COMPARISON:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([modelName, result]) => {
    console.log(`${modelName}:`);
    console.log(`  Accuracy: ${(result.accuracy * 100).toFixed(2)}%`);
    console.log(`  False Positives: ${(result.falsePositiveRate * 100).toFixed(2)}%`);
    console.log(`  False Negatives: ${(result.falseNegativeRate * 100).toFixed(2)}%`);
    console.log(`  Avg Time: ${result.averageTime.toFixed(2)}ms`);
    console.log('');
  });
}

testBaseline().catch(console.error); 