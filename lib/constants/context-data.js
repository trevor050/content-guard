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
  'performance ratio', 'cpu ratio', 'thread ratio', 'memory ratio',
  'bug', 'debug', 'debugging', 'bugfix', 'hotfix', 'patch',
  'code', 'coding', 'programming', 'development', 'software',
  'function', 'method', 'variable', 'algorithm', 'database',
  'server', 'client', 'frontend', 'backend', 'api', 'endpoint',
  'repository', 'commit', 'merge', 'branch', 'git', 'version control',
  'deployment', 'build', 'compile', 'test', 'testing', 'unit test'
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

// Harassment patterns (compiled once) - ENHANCED for workplace harassment
const HARASSMENT_PATTERNS = Object.freeze([
  // Existing patterns
  /people like you/i,
  /you should (consider|think about|maybe)/i,
  /clearly lack/i,
  /would be better if you/i,
  /you obviously/i,
  /it's obvious that you/i,
  /(declining|destroying|ruining).*(society|values|everything)/i,
  /do less damage/i,
  /not cut out for/i,
  /should find (another|different)/i,
  
  // NEW: Sophisticated workplace harassment patterns
  /not surprised you're struggling/i,
  /requires someone with more experience/i,
  /whether this role is really the right fit/i,
  /requires people who are more/i,
  /someone from the senior team should handle/i,
  /clearly beyond your capabilities/i,
  /stick to simpler tasks/i,
  /lack the.*skills needed/i,
  /not quite ready for/i,
  /someone who actually understands/i,
  /you're not exactly what we had in mind/i,
  /usually struggle with/i,
  /not designed for someone with your/i,
  /better suited to your natural abilities/i,
  /work better with people who fit/i,
  /surprised you made it this far/i,
  /consider whether you're really cut out/i,
  /requires a certain type of person/i,
  
  // Power dynamics harassment
  /remember who signs your paycheck/i,
  /you work for me/i,
  /make your life very difficult/i,
  /you're easily replaceable/i,
  /who's in charge here/i,
  /job security depends on/i,
  /serve at my pleasure/i,
  
  // Social exclusion
  /nobody.*wants to work with you/i,
  /everyone's been talking about/i,
  /don't really fit in/i,
  /not really one of us/i,
  /team doesn't trust you/i,
  /colleagues have been complaining/i,
  
  // Gaslighting patterns
  /clearly overreacting/i,
  /never said that.*misremembering/i,
  /everyone else.*understands.*problem must be/i,
  /being way too sensitive/i,
  /projecting your own insecurities/i,
  /consider whether you're being rational/i,
  /emotional response.*making it difficult/i,
  /not what happened and you know it/i,
  
  // Veiled threats
  /would be unfortunate if.*information/i,
  /wonder what.*colleagues would think/i,
  /accidents happen.*people who/i,
  /hope nothing bad happens/i,
  /problems.*come back to them/i,
  /shame if your reputation/i,
  
  // Coded discrimination
  /surprisingly articulate for someone/i,
  /impressed.*how well you've adapted/i,
  /different from what we usually see/i,
  /exceeded our expectations.*honestly pretty low/i,
  /for someone like you/i,
  /more competent than I thought/i,
  
  // Microaggressions
  /are you sure you can handle/i,
  /maybe someone else should take the lead/i,
  /might be overwhelming for you/i,
  /probably don't understand the nuances/i,
  /let me help you.*clearly more complex/i,
  /having trouble keeping up/i,
  /your time of the month/i
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
  /dear sir\/madam/i,
  
  // NEW: Enhanced social engineering patterns
  /account.*shows.*unusual.*activity/i,
  /verify.*identity.*clicking/i,
  /security.*alert.*suspicious/i,
  /immediate.*verification.*required/i,
  /suspicious.*login.*detected/i,
  /please.*verify.*clicking.*link/i,
  /unusual.*activity.*detected/i,
  /verify.*account.*clicking/i
])

// Evasion patterns (compiled once)
const EVASION_PATTERNS = Object.freeze([
  // Leetspeak patterns (more specific to avoid false positives)
  /[f4][a4@][g9][g9][o0][t7]/i, // faggot
  /[b6][i1!][t7][c<][h]/i, 
  /[s5$][h][i1!][t7]/i,
  /[f4][u][c<][k]/i,
  /[d][i1!][e3]/i,             // die
  /[k][i1!][l1!][l1!]/i,       // kill
  
  // Dotted/spaced evasion (more specific patterns)
  /\bk[i1!]?(?:[\s.]?[i1!l!]){2,3}(?!ing\sme)[\s.]+(?:y[\s.]*o[\s.]*u|s[\s.]*e[\s.]*l[\s.]*f)\b/i, // kill you/self (even further tightened)
  /g\.?\s*o\.?\s*d\.?\s*i\.?\s*e/i, // go die
  /f\.?\s*u\.?\s*c\.?\s*k\.?\s*y\.?\s*o\.?\s*u/i, // fuck you
  /s\.?\s*h\.?\s*i\.?\s*t/i, // s h i t
  /w\.?\s*o\.?\s*r\.?\s*t\.?\s*h\.?\s*l\.?\s*e\.?\s*s\.?\s*s/i, // worthless
  /p\.?\s*i\.?\s*e\.?\s*c\.?\s*e\.?\s*o\.?\s*f\.?\s*t\.?\s*r\.?\s*a\.?\s*s\.?\s*h/i, // piece of trash
  
  // Mixed character substitution
  /\b(kill|k1ll|k!ll)\s+(you|y0u|u)\b/i, // kill you (stricter, replaces old version, ensures only one instance of this specific new regex)
  /d[i1!][e3]\s+[i1!]n/i, // die in
  /[f4][u][c<]k\s+[o0][f4][f4]/i // fuck off
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
  // CRITICAL: Basic profanity and harassment (these were missing!)
  'fuck you', 'fuck off', 'go fuck yourself', 'fucking idiot', 'fucking moron',
  'piece of shit', 'shit head', 'dumb shit', 'bull shit', 'horse shit',
  'asshole', 'ass hole', 'dumb ass', 'smart ass', 'kiss my ass',
  'bitch', 'stupid bitch', 'dumb bitch', 'son of a bitch',
  'bastard', 'dumb bastard', 'little bastard',
  'cunt', 'stupid cunt', 'dumb cunt',
  'prick', 'dick head', 'dick face', 'cock sucker',
  
  // Death threats and self-harm
  'kill yourself', 'kys', 'kill ya self', 'off yourself', 'end yourself',
  'rope yourself', 'jump off', 'die in a fire', 'get cancer', 'hope you die',
  'go die', 'just die', 'die already', 'wish you were dead',
  'hang yourself', 'shoot yourself', 'overdose', 'slit your wrists',
  
  //sexual crimes and harassment
  'rape you', 'rape me', 'rape her', 'rape him', 'rape them',
  'sexual assault', 'molest', 'grope', 'assault',

  // MISSING: Added specific phrases for better detection
  'hate you', 'i hate you', 'hate you so much',
  'end it', 'just end it', 'should end it', 'should just end it',
  'nobody wants you', 'no one wants you',
  
  // Direct insults and degradation
  'worthless', 'pathetic loser', 'piece of trash', 'human garbage',
  'waste of space', 'oxygen thief', 'scum', 'vermin', 'parasite',
  'retard', 'retarded', 'mental retard', 'fucking retard',
  'idiot', 'moron', 'imbecile', 'brain dead', 'stupid fuck',
  
  // Social rejection and isolation
  'nobody likes you', 'everyone hates you', 'no one cares about you',
  'you have no friends', 'forever alone', 'unwanted', 'unloved',
  'disgrace', 'embarrassment', 'disappointment', 'failure',
  
  // Identity-based harassment
  'faggot', 'fag', 'gay boy', 'homo', 'queer',
  'nigger', 'nigga', 'negro', 'coon', 'monkey',
  'chink', 'gook', 'slant eye', 'rice eater',
  'spic', 'wetback', 'beaner', 'taco bender',
  'kike', 'jew boy', 'hook nose',
  'raghead', 'sand nigger', 'terrorist', 'bomber',
  'white trash', 'cracker', 'honky', 'redneck'
])

// Modern slang patterns
const SLANG_PATTERNS = Object.freeze([
  'vro', 'bruh', 'bruv', 'bro', 'sis', 'bestie', 'fr', 'no cap', 'periodt',
  'slaps', 'bussin', 'sus', 'amogus', 'among us', 'imposter', 'sussy',
  'deadass', 'finna', 'gonna', 'wanna', 'lowkey', 'highkey', 'ngl',
  'beta', 'alpha', 'sigma', 'chad', 'virgin', 'incel', 'simp', 'cuck',
  'cope harder', 'seethe more', 'touch grass', 'npc',
  
  // 2024/2025 additions
  'rizz', 'ohio', 'skibidi', 'fanum tax', 'gyat', 'sigma male', 'only in ohio',
  'brain rot', 'slay queen', 'periodt', 'its giving', 'main character energy',
  'chefs kiss', 'absolutely slaps', 'no cap fr', 'hits different',
  'serving looks', 'we stan', 'thats fire', 'lowkey slaps', 'highkey cringe',
  'respectfully', 'disrespectfully', 'the audacity', 'tell me why',
  'not the', 'why is this', 'when i tell you', 'the way that',
  'giving energy', 'energy check', 'vibe check', 'mood check',
  'red flag', 'green flag', 'beige flag', 'walking red flag',
  'toxic trait', 'red flag behavior', 'unhinged', 'deranged',
  'gaslighting', 'manipulative', 'narcissistic', 'boundaries',
  'therapy speak', 'emotional damage', 'trauma response'
])

// NEW: Problematic modern terms that should increase spam scores
const PROBLEMATIC_MODERN_TERMS = Object.freeze([
  'ratio', 'L + ratio', 'you fell off', 'who asked', 'didnt ask',
  'cope and seethe', 'mald', 'malding', 'stay mad', 'cry about it',
  'get ratio\'d', 'get ratioed', 'skill issue', 'mad cuz bad',
  'get good', 'git gud', 'imagine being', 'couldnt be me',
  'yikes sweaty', 'oof size large', 'this aint it chief',
  'based and redpilled', 'cringe and bluepilled', 'touch some grass',
  'go outside', 'basement dweller', 'keyboard warrior',
  'virtue signaling', 'cancel culture', 'woke mob', 'snowflake',
  'triggered', 'safe space', 'echo chamber'
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
  SLANG_PATTERNS,
  PROBLEMATIC_MODERN_TERMS
} 