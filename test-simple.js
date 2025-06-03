const guard = require('./simple.js');

async function test() {
  console.log('🔥 Testing Ultra-Simple ContentGuard:\n');
  
  const tests = [
    'kill yourself',
    'you are trash', 
    'go die',
    'worthless piece',
    'fuck you',
    'Hello world',
    'I have a question about your service',
    'We need to kill the process and restart the server',
    {
      name: 'John Smith',
      email: 'john@example.com',
      subject: 'Question',
      message: 'Hello, I have a question about your service. Thank you!'
    }
  ];
  
  for (const text of tests) {
    const result = await guard.analyze(text);
    const displayText = typeof text === 'string' ? text : 'Contact Form';
    console.log(`"${displayText}" -> Score: ${result.score}, Spam: ${result.isSpam}, Risk: ${result.riskLevel}`);
    if (result.matches && result.matches.length > 0) {
      console.log(`  Matches: ${result.matches.map(m => m.reason).join(', ')}`);
    }
    console.log();
  }
}

test().catch(console.error); 