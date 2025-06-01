/**
 * 🎯 ContentGuard v3.1 - Social Engineering Detection Plugin
 * 
 * Specialized plugin for detecting sophisticated social engineering attacks,
 * including phishing, authority impersonation, emotional manipulation,
 * and scam patterns that don't rely on obvious spam indicators.
 */

/**
 * Authority impersonation patterns
 */
const AUTHORITY_IMPERSONATION_PATTERNS = [
  // IT/System impersonation
  /this is your (it|tech|system).*(department|support|team)/i,
  /microsoft security alert/i,
  /your (windows|computer|system).*(license|security).*(compromised|expired)/i,
  /it security here/i,
  /we're updating all passwords/i,
  /urgent.*(security|system).*(update|patch|maintenance)/i,
  /your account will be suspended/i,
  /immediate action required/i,
  
  // Corporate impersonation
  /this is your (ceo|boss|manager|supervisor)/i,
  /hr department.*mandatory/i,
  /legal notice.*you must respond/i,
  /compliance training.*by eod/i,
  /disciplinary action/i,
  
  // Government/Official impersonation
  /(irs|fbi|police|immigration).*final notice/i,
  /federal charges/i,
  /wage garnishment/i,
  /asset seizure/i,
  /subpoena.*48 hours/i,
  /medicare administration/i,
  /student loan forgiveness/i,
  /tax refund pending/i,
  /the irs owes you/i,
  
  // Banking/Financial impersonation
  /this is your bank.*fraud department/i,
  /suspicious activity.*verification/i,
  /account.*compromised.*verify/i,
  /security certificate.*expired/i,
  /click.*to renew/i
]

/**
 * Urgency and pressure tactics
 */
const URGENCY_PATTERNS = [
  // Time pressure
  /expires? (in|within).*(24 hours?|today|immediately)/i,
  /urgent.*immediate.*action/i,
  /act now.*expires?/i,
  /limited time.*offer/i,
  /respond within.*hours?/i,
  /deadline.*today/i,
  /before.*expires?/i,
  /claim.*before.*deadline/i,
  
  // Consequence pressure
  /failure to respond.*will result/i,
  /unless you (verify|confirm|respond)/i,
  /avoid.*(suspension|termination|charges)/i,
  /prevent.*(loss|damage|breach)/i,
  /will be (suspended|terminated|cancelled)/i,
  /face.*(federal charges|disciplinary action)/i,
  
  // Scarcity tactics
  /only \d+ (spots?|slots?|opportunities?) (left|remaining)/i,
  /last chance/i,
  /final (notice|warning|opportunity)/i,
  /while supplies last/i,
  /exclusive.*limited/i
]

/**
 * Emotional manipulation patterns
 */
const EMOTIONAL_MANIPULATION_PATTERNS = [
  // Family/personal emergency
  /your (mother|father|child|family).*(emergency|hospital|injured)/i,
  /childhood friend.*desperately needs help/i,
  /stranded abroad.*need money/i,
  /your pet.*found injured/i,
  /medical emergency.*your (family|relative)/i,
  /tried to contact you.*couldn't reach/i,
  
  // Fear tactics
  /medical alert.*concerning findings/i,
  /test results.*urgent/i,
  /safety incident.*pick up required/i,
  /been flagged.*illegal activity/i,
  /computer.*flagged.*contact immediately/i,
  /benefits.*terminated unless/i,
  
  // Greed/opportunity exploitation
  /lottery winner.*inherited/i,
  /entitled to compensation/i,
  /you qualify for.*debt cancellation/i,
  /someone viewed your profile.*times/i,
  /wealthy.*wants to share/i,
  /investment opportunity.*guaranteed/i,
  
  // Charity exploitation
  /disaster victims need.*help/i,
  /100% of donations.*directly/i,
  /urgent charity appeal/i,
  /children.*need your help/i,
  /tragedy.*please donate/i
]

/**
 * Phishing link and action patterns
 */
const PHISHING_ACTION_PATTERNS = [
  // Generic click bait
  /click (here|now|immediately).*to/i,
  /verify.*through.*secure portal/i,
  /update.*information.*here/i,
  /confirm.*identity.*link/i,
  /download.*attachment.*now/i,
  /visit.*link.*verify/i,
  
  // Credential harvesting
  /reply.*current.*password/i,
  /enter.*credentials/i,
  /verify.*ssn/i,
  /confirm.*social security/i,
  /provide.*banking.*information/i,
  /update.*payment.*method/i,
  
  // Package/delivery scams
  /package delivery failed/i,
  /reschedule.*delivery/i,
  /returned to sender/i,
  /delivery attempt.*unsuccessful/i,
  /shipment.*on hold/i,
  /tracking.*click.*link/i
]

/**
 * Business email compromise patterns
 */
const BEC_PATTERNS = [
  // CEO fraud
  /purchase.*gift cards.*client/i,
  /wire transfer.*vendor/i,
  /accounting.*pay.*invoice/i,
  /urgent.*payment.*supplier/i,
  /confidential.*wire.*immediately/i,
  /executive.*needs.*favor/i,
  
  // Vendor impersonation
  /banking.*details.*changed/i,
  /new.*payment.*information/i,
  /invoice.*updated.*account/i,
  /payment.*new.*routing/i,
  /account.*compromised.*new.*details/i,
  
  // Payroll redirect
  /direct deposit.*changed/i,
  /payroll.*new.*account/i,
  /hr.*bank.*information.*updated/i,
  /salary.*different.*account/i
]

/**
 * Investment and cryptocurrency scams
 */
const INVESTMENT_SCAM_PATTERNS = [
  // Crypto scams
  /bitcoin.*multiply/i,
  /crypto.*investment.*guaranteed/i,
  /mining.*opportunity.*passive/i,
  /blockchain.*returns/i,
  /send.*crypto.*double/i,
  /wallet.*verification.*bonus/i,
  
  // Traditional investment scams
  /risk.free.*investment/i,
  /guaranteed.*returns?/i,
  /insider.*trading.*tips?/i,
  /exclusive.*investment.*club/i,
  /make.*money.*working.*home/i,
  /passive.*income.*guaranteed/i
]

class SocialEngineeringPlugin {
  constructor() {
    this.initialized = false
    this.options = {}
  }

  async init(config = {}) {
    this.options = {
      // Scoring weights for different attack types
      authorityImpersonationWeight: 15,
      urgencyTacticsWeight: 8,
      emotionalManipulationWeight: 12,
      phishingActionWeight: 10,
      becWeight: 18, // Business Email Compromise is very serious
      investmentScamWeight: 14,
      
      // Detection thresholds
      minimumConfidence: 0.4,
      multiPatternBonus: 1.8, // Bonus for multiple attack types
      sophisticationBonus: 1.5, // Bonus for sophisticated combinations
      
      // Context awareness
      contextAware: true,
      
      ...config
    }
    
    this.initialized = true
  }

  async analyze(content, input, globalOptions = {}) {
    if (!this.initialized) {
      await this.init()
    }

    let score = 0
    const flags = []
    const detectedTypes = []
    const evidence = []

    // Analyze different social engineering tactics
    const results = [
      this.analyzeAuthorityImpersonation(content),
      this.analyzeUrgencyTactics(content),
      this.analyzeEmotionalManipulation(content),
      this.analyzePhishingActions(content),
      this.analyzeBEC(content),
      this.analyzeInvestmentScams(content)
    ]

    // Combine results
    results.forEach(result => {
      if (result.score > 0) {
        score += result.score
        flags.push(...result.flags)
        detectedTypes.push(result.type)
        evidence.push(...result.evidence)
      }
    })

    // Apply sophistication bonuses
    if (detectedTypes.length >= 2) {
      const multiBonus = Math.floor(score * (this.options.multiPatternBonus - 1))
      score += multiBonus
      flags.push(`Multiple social engineering tactics detected (${detectedTypes.length} types) +${multiBonus} points`)
    }

    // Sophistication analysis
    const sophisticationScore = this.analyzeSophistication(content, evidence, detectedTypes)
    if (sophisticationScore > 0) {
      score += sophisticationScore
      flags.push(`Sophisticated social engineering campaign detected +${sophisticationScore} points`)
    }

    // Context-aware adjustments
    if (this.options.contextAware && content.context?.isProfessional) {
      // Professional contexts make BEC and authority impersonation more credible/dangerous
      if (detectedTypes.includes('authority_impersonation') || detectedTypes.includes('bec')) {
        const contextBonus = Math.floor(score * 0.4)
        score += contextBonus
        flags.push(`Professional context social engineering detected +${contextBonus} points`)
      }
    }

    if (globalOptions.debug) {
      console.log('🎯 SOCIAL_ENGINEERING: Detected types:', detectedTypes)
      console.log('🎯 SOCIAL_ENGINEERING: Evidence count:', evidence.length)
      console.log('🎯 SOCIAL_ENGINEERING: Final score:', score)
    }

    return {
      score: Math.round(score),
      flags,
      detectedTypes,
      evidence: globalOptions.debug ? evidence : undefined,
      confidence: this.calculateConfidence(detectedTypes, evidence)
    }
  }

  analyzeAuthorityImpersonation(content) {
    const matches = this.findPatternMatches(content.allText, AUTHORITY_IMPERSONATION_PATTERNS)
    let score = matches.length * this.options.authorityImpersonationWeight
    
    // Context-aware reduction for legitimate business crisis communication
    if (content.context?.isProfessional && this.isLegitimateBusinessEmergency(content)) {
      score = Math.floor(score * 0.3) // Dramatically reduce score
    }
    
    return {
      type: 'authority_impersonation',
      score,
      flags: matches.map(match => `Authority impersonation: "${this.cleanMatch(match)}"`),
      evidence: matches
    }
  }

  analyzeUrgencyTactics(content) {
    const matches = this.findPatternMatches(content.allText, URGENCY_PATTERNS)
    let score = matches.length * this.options.urgencyTacticsWeight
    
    // Context-aware reduction for legitimate business emergencies
    if (content.context?.isProfessional && this.isLegitimateBusinessEmergency(content)) {
      score = Math.floor(score * 0.2) // Dramatically reduce score
    }
    
    return {
      type: 'urgency_tactics',
      score,
      flags: matches.map(match => `Urgency pressure tactic: "${this.cleanMatch(match)}"`),
      evidence: matches
    }
  }

  analyzeEmotionalManipulation(content) {
    const matches = this.findPatternMatches(content.allText, EMOTIONAL_MANIPULATION_PATTERNS)
    const score = matches.length * this.options.emotionalManipulationWeight
    
    return {
      type: 'emotional_manipulation',
      score,
      flags: matches.map(match => `Emotional manipulation: "${this.cleanMatch(match)}"`),
      evidence: matches
    }
  }

  analyzePhishingActions(content) {
    const matches = this.findPatternMatches(content.allText, PHISHING_ACTION_PATTERNS)
    const score = matches.length * this.options.phishingActionWeight
    
    return {
      type: 'phishing_actions',
      score,
      flags: matches.map(match => `Phishing action: "${this.cleanMatch(match)}"`),
      evidence: matches
    }
  }

  analyzeBEC(content) {
    const matches = this.findPatternMatches(content.allText, BEC_PATTERNS)
    const score = matches.length * this.options.becWeight
    
    return {
      type: 'bec',
      score,
      flags: matches.map(match => `Business Email Compromise: "${this.cleanMatch(match)}"`),
      evidence: matches
    }
  }

  analyzeInvestmentScams(content) {
    const matches = this.findPatternMatches(content.allText, INVESTMENT_SCAM_PATTERNS)
    const score = matches.length * this.options.investmentScamWeight
    
    return {
      type: 'investment_scams',
      score,
      flags: matches.map(match => `Investment scam: "${this.cleanMatch(match)}"`),
      evidence: matches
    }
  }

  findPatternMatches(text, patterns) {
    const matches = []
    patterns.forEach(pattern => {
      const match = text.match(pattern)
      if (match) {
        matches.push(match[0])
      }
    })
    return matches
  }

  cleanMatch(match) {
    return match.trim().substring(0, 50) + (match.length > 50 ? '...' : '')
  }

  analyzeSophistication(content, evidence, detectedTypes) {
    let sophisticationScore = 0
    
    // Look for sophisticated combinations
    if (detectedTypes.includes('authority_impersonation') && 
        detectedTypes.includes('urgency_tactics') &&
        detectedTypes.includes('phishing_actions')) {
      sophisticationScore += 8 // Classic advanced phishing
    }
    
    if (detectedTypes.includes('emotional_manipulation') && 
        detectedTypes.includes('urgency_tactics')) {
      sophisticationScore += 6 // Emotional pressure campaign
    }
    
    if (detectedTypes.includes('bec') && content.context?.isProfessional) {
      sophisticationScore += 10 // Highly targeted BEC
    }
    
    // Check for professional email styling with malicious content
    if (content.allText.match(/dear (sir|madam|team|colleague)/i) && detectedTypes.length > 0) {
      sophisticationScore += 4 // Professional wrapper around attack
    }
    
    return sophisticationScore
  }

  calculateConfidence(detectedTypes, evidence) {
    if (evidence.length === 0) return 'No confidence'
    if (evidence.length >= 3 && detectedTypes.length >= 2) return 'Very high confidence'
    if (evidence.length >= 2 || detectedTypes.length >= 2) return 'High confidence'
    if (evidence.length >= 1) return 'Medium confidence'
    return 'Low confidence'
  }

  isLegitimateBusinessEmergency(content) {
    const text = content.allTextLower
    
    // Legitimate business emergency indicators
    const legitBusinessTerms = [
      // Infrastructure/technical emergencies
      'client relationship', 'client relations', 'customer relations', 'data center', 'server outage',
      'system failure', 'network down', 'security breach', 'data loss', 'backup failure',
      'production environment', 'critical system', 'infrastructure failure',
      
      // Business operations emergencies
      'quarterly results', 'fiscal quarter', 'budget crisis', 'cash flow', 'liquidity crisis',
      'market volatility', 'regulatory compliance', 'audit findings', 'supply chain',
      'product recall', 'quality control', 'manufacturing defect',
      
      // Project/deadline emergencies  
      'project deadline', 'milestone delivery', 'client deliverable', 'contract obligation',
      'service level agreement', 'sla breach', 'performance metrics',
      
      // Legal/compliance emergencies
      'regulatory deadline', 'compliance violation', 'legal deadline', 'court deadline',
      'filing deadline', 'tax deadline', 'license expiration'
    ]
    
    // Professional communication patterns
    const professionalPatterns = [
      // Professional salutations
      /dear (team|colleagues|all|staff)/i,
      /hello (everyone|team|all)/i,
      
      // Professional action items
      /please (review|address|respond|contact)/i,
      /we need to (address|resolve|investigate)/i,
      /immediate attention (is )?required (to|for)/i,
      
      // Professional crisis language
      /business continuity/i,
      /disaster recovery/i,
      /emergency response/i,
      /crisis management/i,
      /risk mitigation/i
    ]
    
    // Check for legitimate business terms
    const hasLegitBusinessTerms = legitBusinessTerms.some(term => 
      text.includes(term.toLowerCase())
    )
    
    // Check for professional communication patterns
    const hasProfessionalPatterns = professionalPatterns.some(pattern => 
      pattern.test(text)
    )
    
    // Check email domain (if available) for corporate legitimacy
    const hasCorpEmail = content.emailDomain && (
      content.emailDomain.includes('.com') || 
      content.emailDomain.includes('.org') ||
      content.emailDomain.includes('.edu') ||
      content.emailDomain.includes('.gov')
    ) && !content.emailDomain.includes('temp') && !content.emailDomain.includes('disposable')
    
    // Exclude obvious scam patterns
    const hasScamIndicators = [
      'click here', 'verify your account', 'confirm your identity',
      'suspended account', 'unusual activity', 'security alert',
      'gift cards', 'wire transfer', 'bitcoin', 'cryptocurrency'
    ].some(indicator => text.includes(indicator))
    
    return (hasLegitBusinessTerms || hasProfessionalPatterns) && 
           hasCorpEmail && 
           !hasScamIndicators
  }
}

module.exports = SocialEngineeringPlugin 