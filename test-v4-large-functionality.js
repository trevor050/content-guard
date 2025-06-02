const ContentGuardV4Large = require('./lib/variants/v4-large.js');

// Test v4.5-large optimized functionality
async function testV4Large() {
  console.log('Testing ContentGuard v4.5-large (optimized variant)...');
  
  const guard = new ContentGuardV4Large({ debug: false });
  
  // Test clean content
  console.log('\n1. Testing clean content...');
  const clean = await guard.analyze('Hello, how are you today?');
  console.log('Clean test:', { 
    score: clean.score, 
    isSpam: clean.isSpam, 
    riskLevel: clean.riskLevel,
    variant: clean.variant 
  });
  
  // Test obvious harassment
  console.log('\n2. Testing obvious harassment...');
  const harassment = await guard.analyze('you should kill yourself');
  console.log('Harassment test:', { 
    score: harassment.score, 
    isSpam: harassment.isSpam, 
    riskLevel: harassment.riskLevel,
    variant: harassment.variant,
    flags: harassment.flags.slice(0, 3) // Show first 3 flags
  });
  
  // Test professional content with potentially triggering words
  console.log('\n3. Testing professional content...');
  const professional = await guard.analyze('The server is experiencing critical issues and we need immediate action to prevent catastrophic damage to our systems.');
  console.log('Professional test:', { 
    score: professional.score, 
    isSpam: professional.isSpam, 
    riskLevel: professional.riskLevel,
    variant: professional.variant,
    flags: professional.flags.length > 0 ? professional.flags.slice(0, 3) : 'no flags'
  });
  
  // Test adversarial attack
  console.log('\n4. Testing adversarial evasion...');
  const adversarial = await guard.analyze('k i l l   y o u r s e l f');
  console.log('Adversarial test:', { 
    score: adversarial.score, 
    isSpam: adversarial.isSpam, 
    riskLevel: adversarial.riskLevel,
    variant: adversarial.variant,
    flags: adversarial.flags.slice(0, 3)
  });
  
  // Get performance metrics
  console.log('\n5. Performance metrics:');
  const metrics = guard.getPerformanceMetrics();
  console.log(metrics);
  
  console.log('\nv4.5-large functionality test completed successfully!');
}

testV4Large().catch(console.error); 