import { execFileSync, type ExecFileSyncOptionsWithStringEncoding } from 'node:child_process'

/** Invoke npm's JS entrypoint, avoiding Windows .cmd execution and shell quoting. */
export function runNpm(args: string[], options: ExecFileSyncOptionsWithStringEncoding): string {
  const cli = process.env.npm_execpath
  if (!cli) throw new Error('Run this script through npm run so npm_execpath is available')
  return execFileSync(process.execPath, [cli, ...args], options)
}
