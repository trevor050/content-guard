const { ContentGuard } = require('./index.js');
const filter = new ContentGuard({ debug: false });

async function testEdgeCases() {
  console.log('Testing edge cases with ContentGuard...\n');
  
  const tests = [
    { message: '', description: 'Empty message' },
    { message: 'a', description: 'Single character' },
    { message: 'The ratio of engineering force to displacement is important for structural analysis.', description: 'Academic ratio usage' },
    { message: 'I need to kill the process running on port 3000. The kill command should terminate the stuck process.', description: 'Technical kill usage' },
    { message: 'URGENT BUSINESS PROPOSAL!!!', description: 'All caps business spam' },
    { message: 'Hello world! 🎉🎊🚀✨🌟', description: 'Many emojis' },
    { message: 'aaaaaaaaaaaaaaaaaaaaaa', description: 'Repeated characters' },
    { message: '123456789012345', description: 'Numbers only' },
    { 
      name: 'Dr. Sarah Johnson',
      email: 'sarah@university.edu',
      subject: 'Critical Analysis of Ratio Calculations',
      message: 'Dear Engineering Team, I need urgent assistance with ratio analysis for my research project.',
      description: 'Academic context with flagged words'
    },
    {
      name: 'DevOps Engineer',
      email: 'admin@company.com',
      subject: 'Kill Process Command',
      message: 'Please help me kill the stuck process on the production server. The kill command is not working.',
      description: 'Technical context with kill commands'
    }
  ];
  
  for (const test of tests) {
    try {
      const result = await filter.analyze(test);
      console.log(`${test.description}: Score ${result.score}, Spam: ${result.isSpam}`);
      if (result.score > 0) {
        console.log(`  Flags: ${result.flags.slice(0, 3).join(', ')}`);
      }
    } catch (error) {
      console.log(`${test.description}: ERROR - ${error.message}`);
    }
  }
}

testEdgeCases().catch(console.error); 