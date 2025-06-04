/**
 * Shared Context Data Constants
 * 
 * Global constants to avoid per-instance memory allocation
 */

// Technical terms database (cached globally)
const TECHNICAL_TERMS = Object.freeze([
  'kill process', 'kill task', 'kill command', 'kill signal', 'kill -9',
  'terminate process', 'end process', 'stop process', 'process kill',
  'ratio calculation', 'aspect ratio', 'gear ratio', 'ratio analysis',
  'ratio of', 'financial ratio', 'compression ratio', 'ratio test',
  'urgent priority', 'urgent request', 'urgent issue', 'urgent bug',
  'critical path', 'critical section', 'critical error', 'critical system',
  'performance ratio', 'cpu ratio', 'thread ratio', 'memory ratio'
])

// Academic/professional context indicators
const ACADEMIC_TERMS = Object.freeze([
  'research', 'analysis', 'study', 'paper', 'thesis', 'dissertation',
  'methodology', 'literature review', 'data analysis', 'hypothesis',
  'experiment', 'survey', 'statistical', 'correlation', 'regression',
  'engineering', 'mechanical', 'electrical', 'software', 'civil',
  'structural', 'architectural', 'design', 'optimization',
  'university', 'college', 'academic', 'professor', 'student'
])

// Medical context terms
const MEDICAL_TERMS = Object.freeze([
  'patient', 'medical', 'hospital', 'treatment', 'medication', 'protocol',
  'clinical', 'diagnosis', 'therapeutic', 'healthcare', 'intervention',
  'procedure', 'surgery', 'emergency', 'critical care', 'icu',
  'drug concentration', 'dosage', 'pharmaceutical', 'nursing'
])

// Business/Financial context terms
const BUSINESS_TERMS = Object.freeze([
  'business', 'financial', 'market', 'investment', 'portfolio', 'equity',
  'debt', 'revenue', 'profit', 'budget', 'project', 'deadline',
  'corporate', 'company', 'organization', 'management', 'analysis',
  'risk assessment', 'financial analysis', 'market analysis',
  'game development', 'game design', 'game balance', 'character design',
  'player feedback', 'game mechanics', 'development team', 'game studio'
])

// Legal context terms
const LEGAL_TERMS = Object.freeze([
  'attorney', 'lawyer', 'legal', 'law', 'court', 'case', 'trial', 'hearing',
  'evidence', 'precedent', 'lawsuit', 'litigation', 'contract', 'agreement',
  'settlement', 'judgment', 'appeal', 'defense', 'prosecution', 'client',
  'counsel', 'bar', 'jurisdiction', 'statute', 'regulation', 'compliance'
])

// Professional email patterns (compiled once)
const PROFESSIONAL_PATTERNS = Object.freeze([
  /\b(inquiry|enquiry)\b/i,
  /\b(application|position|opportunity)\b/i,
  /\b(meeting|schedule|appointment)\b/i,
  /\b(proposal|partnership|collaboration)\b/i,
  /\b(portfolio|resume|cv)\b/i,
  /dear (sir|madam|team|colleagues)/i,
  /\b(professional|business|corporate)\b/i
])

// Harassment patterns (compiled once)
const HARASSMENT_PATTERNS = Object.freeze([
  /people like you/i,
  /you should (consider|think about|maybe)/i,
  /clearly lack/i,
  /would be better if you/i,
  /you obviously/i,
  /it's obvious that you/i,
  /(declining|destroying|ruining).*(society|values|everything)/i,
  /do less damage/i,
  /not cut out for/i,
  /should find (another|different)/i
])

// Scam/Manipulation patterns (compiled once)
const SCAM_PATTERNS = Object.freeze([
  /exclusive (opportunity|investment|offer)/i,
  /guaranteed (returns|profits|money)/i,
  /risk.free/i,
  /wealthy prince/i,
  /nigerian prince/i,
  /transfer.*million/i,
  /commission.*percent/i,
  /completely (legal|legitimate)/i,
  /make \$?\d+.*today/i,
  /click (now|here|immediately)/i,
  /urgent.*help.*needed/i,
  /dear sir\/madam/i
])

// Evasion patterns (compiled once)
const EVASION_PATTERNS = Object.freeze([
  // Leetspeak patterns (more specific to avoid false positives)
  /[f4][a4@][g9][g9][o0][t7]/i,
  /[b6][i1!][t7][c<][h]/i, 
  /[s5$][h][i1!][t7]/i,
  /[f4][u][c<][k]/i,
  /[d][i1!][e3]/i,
  /[k][i1!][l1!][l1!]/i,
  
  // Dotted/spaced evasion (more specific patterns)
  /k\.?\s*i\.?\s*l\.?\s*l\.?\s*y\.?\s*o\.?\s*u\.?\s*r\.?\s*s\.?\s*e\.?\s*l\.?\s*f/i,
  /g\.?\s*o\.?\s*d\.?\s*i\.?\s*e/i,
  /f\.?\s*u\.?\s*c\.?\s*k\.?\s*y\.?\s*o\.?\s*u/i,
  /s\.?\s*h\.?\s*i\.?\s*t/i,
  /w\.?\s*o\.?\s*r\.?\s*t\.?\s*h\.?\s*l\.?\s*e\.?\s*s\.?\s*s/i,
  /p\.?\s*i\.?\s*e\.?\s*c\.?\s*e\.?\s*o\.?\s*f\.?\s*t\.?\s*r\.?\s*a\.?\s*s\.?\s*h/i,
  
  // Mixed character substitution
  /k[i1!]ll\s+(y[o0]u|y[a@]|ur)/i,
  /d[i1!][e3]\s+[i1!]n/i,
  /[f4][u][c<]k\s+[o0][f4][f4]/i
])

// Gaming troll keywords
const GAMING_TROLL_KEYWORDS = Object.freeze([
  'fortnite', 'minecraft', 'roblox', 'cod', 'apex', 'valorant', 'cs:go', 'csgo',
  'hop on', 'lets play', 'gamer', 'noob', 'pwned', 'rekt', 'git gud',
  'skill issue', 'mad cuz bad', 'cope', 'seethe', 'cringe', 'based',
  'touch grass', 'go outside', 'basement dweller'
])

// Professional gaming terms
const PROFESSIONAL_GAMING_TERMS = Object.freeze([
  'gaming', 'game', 'player', 'balance', 'exploit', 'character', 'nerf', 'buff'
])

// Troll names
const TROLL_NAMES = Object.freeze([
  'why would i tell you', 'not telling', 'nope', 'none of your business',
  'anonymous', 'anon', 'admin', 'lol', 'lmao', 'ligma',
  'joe mama', 'deez nuts', 'candice', 'sawcon', 'sugma'
])

// Harassment keywords
const HARASSMENT_KEYWORDS = Object.freeze([
  'kill yourself', 'kys', 'kill ya self', 'off yourself', 'end yourself',
  'rope yourself', 'jump off', 'die in a fire', 'get cancer', 'hope you die',
  'nobody likes you', 'everyone hates you', 'worthless', 'pathetic loser'
])

// Modern slang patterns
const SLANG_PATTERNS = Object.freeze([
  'vro', 'bruh', 'bruv', 'bro', 'sis', 'bestie', 'fr', 'no cap', 'periodt',
  'slaps', 'bussin', 'sus', 'amogus', 'among us', 'imposter', 'sussy',
  'deadass', 'finna', 'gonna', 'wanna', 'lowkey', 'highkey', 'ngl',
  'beta', 'alpha', 'sigma', 'chad', 'virgin', 'incel', 'simp', 'cuck',
  'cope harder', 'seethe more', 'touch grass', 'npc'
])

module.exports = {
  TECHNICAL_TERMS,
  ACADEMIC_TERMS,
  MEDICAL_TERMS,
  BUSINESS_TERMS,
  LEGAL_TERMS,
  PROFESSIONAL_PATTERNS,
  HARASSMENT_PATTERNS,
  SCAM_PATTERNS,
  EVASION_PATTERNS,
  GAMING_TROLL_KEYWORDS,
  PROFESSIONAL_GAMING_TERMS,
  TROLL_NAMES,
  HARASSMENT_KEYWORDS,
  SLANG_PATTERNS
} 