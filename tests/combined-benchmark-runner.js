#!/usr/bin/env node

const { MassiveBenchmarkV4 } = require('./massive-benchmark-v3')

async function main() {
  const hard = process.argv.includes('--hard')
  const benchmark = new MassiveBenchmarkV4()

  if (hard) {
    benchmark.testCases = benchmark.testCases.concat(benchmark.testCases)
  }

  await benchmark.runBenchmark()
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)
    process.exit(1)
  })
}
