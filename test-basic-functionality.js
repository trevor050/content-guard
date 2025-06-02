const { ContentGuard } = require('./index.js');

// Test basic v4.5-large (optimized) functionality
async function testBasic() {
  console.log('Testing ContentGuard v4.5-large (optimized)...');
  
  const guard = new ContentGuard('maximum_accuracy', { debug: false });
  
  // Test clean content
  const clean = await guard.analyze('Hello, how are you today?');
  console.log('Clean test:', { score: clean.score, isSpam: clean.isSpam, riskLevel: clean.riskLevel });
  
  // Test obvious harassment
  const harassment = await guard.analyze('you should kill yourself');
  console.log('Harassment test:', { score: harassment.score, isSpam: harassment.isSpam, riskLevel: harassment.riskLevel });
  
  // Test professional content
  const professional = await guard.analyze('The server is experiencing critical issues and we need immediate action to prevent catastrophic damage to our systems.');
  console.log('Professional test:', { score: professional.score, isSpam: professional.isSpam, riskLevel: professional.riskLevel });
  
  console.log('Basic functionality test completed successfully!');
}

testBasic().catch(console.error); 