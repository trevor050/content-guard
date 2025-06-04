const { ContentGuard } = require('./index.js');

// Performance test
console.log('🚀 ContentGuard v2.0 Performance Benchmark');
console.log('=' .repeat(50));

async function benchmark() {
  const guard = new ContentGuard({ debug: false });
  
  const testCases = [
    { name: 'John', email: 'john@company.com', message: 'Hello, this is a professional inquiry about your services.' },
    { name: 'Troll', email: 'troll@fake.com', message: 'you are trash and should kill yourself loser' },
    { name: 'Dr. Smith', email: 'dr.smith@university.edu', message: 'We need urgent medical consultation on the critical patient analysis.' }
  ];
  
  const iterations = 100;
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    for (const testCase of testCases) {
      await guard.analyze(testCase);
    }
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / (iterations * testCases.length);
  
  console.log(`📊 Results:`);
  console.log(`   Total tests: ${iterations * testCases.length}`);
  console.log(`   Total time: ${totalTime}ms`);
  console.log(`   Average per analysis: ${avgTime.toFixed(2)}ms`);
  console.log(`   Throughput: ${Math.round(1000 / avgTime)} analyses/sec`);
  
  const metrics = guard.getMetrics();
  console.log(`   Cache efficiency: ${metrics.cacheEfficiency}`);
  console.log(`   Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
}

benchmark().catch(console.error); 