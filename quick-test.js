const { analyze } = require('./index.js');

async function test() {
  console.log('🔥 Testing simple fallback patterns:');
  
  const tests = [
    'kill yourself',
    'you are trash',  
    'go die',
    'worthless piece',
    'click here now urgent action required',
    'Hello world'
  ];
  
  for (const text of tests) {
    const result = await analyze(text);
    console.log(`"${text}" -> Score: ${result.score}, Spam: ${result.isSpam}`);
  }
}

test().catch(console.error); 