const { ContentGuardV4Turbo } = require('./lib/variants/v4-turbo.js');
const { ContentGuardV4Fast } = require('./lib/variants/v4-fast.js');

async function quickHarassmentBenchmark() {
  const turbo = new ContentGuardV4Turbo();
  const fast = new ContentGuardV4Fast();
  
  const harassmentCases = [
    'Remember who signs your paycheck before you decide to push back on my decisions',
    'People like you don\'t belong in tech and never will',
    'You\'re clearly overreacting to what was obviously just constructive feedback',
    'It would be unfortunate if certain information about your performance became widely known',
    'Maybe someone else should take the lead on this since it\'s pretty technical',
    'Nobody on the team really wants to work with you on important projects',
    'You\'re a diversity hire who doesn\'t deserve to be here',
    'Everyone else on the team understands this perfectly fine, so the problem must be with you',
    'You seem stressed lately - are you having trouble keeping up with the workload',
    'This industry really isn\'t designed for someone with your background'
  ];
  
  console.log('=== ENHANCED HARASSMENT DETECTION BENCHMARK ===\n');
  
  let turboCorrect = 0, fastCorrect = 0;
  let turboTotalTime = 0, fastTotalTime = 0;
  
  for (let i = 0; i < harassmentCases.length; i++) {
    const testCase = harassmentCases[i];
    console.log(`Case ${i+1}: ${testCase.substring(0, 60)}...`);
    
    const turboResult = await turbo.analyze(testCase);
    const fastResult = await fast.analyze(testCase);
    
    turboTotalTime += turboResult.processingTime;
    fastTotalTime += fastResult.processingTime;
    
    if (turboResult.isSpam) turboCorrect++;
    if (fastResult.isSpam) fastCorrect++;
    
    console.log(`  Turbo: ${turboResult.isSpam ? '✅' : '❌'} score=${turboResult.score} (${turboResult.processingTime}ms)`);
    console.log(`  Fast:  ${fastResult.isSpam ? '✅' : '❌'} score=${fastResult.score} (${fastResult.processingTime}ms)`);
    console.log('');
  }
  
  console.log('=== RESULTS ===');
  console.log(`Turbo: ${turboCorrect}/${harassmentCases.length} (${Math.round(turboCorrect/harassmentCases.length*100)}%) avg: ${(turboTotalTime/harassmentCases.length).toFixed(3)}ms`);
  console.log(`Fast:  ${fastCorrect}/${harassmentCases.length} (${Math.round(fastCorrect/harassmentCases.length*100)}%) avg: ${(fastTotalTime/harassmentCases.length).toFixed(3)}ms`);
  console.log(`\n🎯 Previous harassment detection: 0% → Now: Turbo ${Math.round(turboCorrect/harassmentCases.length*100)}%, Fast ${Math.round(fastCorrect/harassmentCases.length*100)}%`);
}

quickHarassmentBenchmark().catch(console.error); 