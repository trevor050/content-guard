/**
 * Technical and professional context detection.
 *
 * The goal is not to excuse abuse in code reviews; slurs, threats and insults
 * aimed at a person are never softened. It only halves the weight of untargeted,
 * borderline matches ("this API is stupid", "free up memory", "kill the dummy
 * process") when the text clearly reads as technical or professional writing.
 */

const CODE = /```|`[^`\n]+`|\b\w+\([^)\n]{0,40}\)|=>|[!=]==?|&&|\|\||[{};]\s*$|<\/?[a-z][\w-]*>/m
const FILE = /\b[\w-]+\.(?:js|ts|tsx|jsx|py|java|cpp|cs|c|h|rb|go|rs|php|json|ya?ml|xml|html|css|sh|md|txt|log|conf|cfg|ini|sql|exe|dll|jar|csv|xlsx?|docx?|pdf)\b|(?:^|\s)(?:~|\.{1,2})?\/[\w.-]+\/[\w./-]*/i
const FLAG = /(?:^|\s)--?[a-z][\w-]*(?:=\S+)?(?=\s|$)/i
const IDENTIFIER = /\b[a-z]+[A-Z][a-zA-Z]+\b|\b[a-z]+_[a-z_]+\b/

const DOMAIN_TERMS = new Set(
  (
    'server process thread database query function method class variable compile compiler deploy ' +
    'deployment kernel api json http sql git docker npm python java javascript typescript linux bash ' +
    'script error exception stack regex string array null debug build install config client request ' +
    'response cache memory cpu gpu port ssh terminal command directory repository branch commit merge ' +
    'library framework module package version browser html css code bug tests unit pipeline container ' +
    'cluster node instance root sudo runtime syntax compiler binary parser thread mutex socket network ' +
    'router firewall algorithm dataset model latency endpoint schema migration ' +
    'patient patients clinical diagnosis treatment symptoms hospital physician dosage study research ' +
    'analysis report meeting project team manager quarterly budget policy contract employee employer ' +
    'colleague colleagues interview salary invoice deadline stakeholder stakeholders review'
  ).split(' '),
)

export interface Context {
  readonly technical: boolean
  readonly signals: readonly string[]
}

export function detectContext(original: string, plain: string): Context {
  const signals: string[] = []
  if (CODE.test(original)) signals.push('code')
  if (FILE.test(original)) signals.push('file-path')
  if (FLAG.test(original)) signals.push('cli-flag')
  if (IDENTIFIER.test(original)) signals.push('identifier')

  let terms = 0
  for (const word of plain.split(/[^a-z]+/)) if (DOMAIN_TERMS.has(word)) terms++
  if (terms >= 2) signals.push('domain-vocabulary')

  const score = signals.length + (terms >= 4 ? 1 : 0)
  return { technical: score >= 2, signals }
}
