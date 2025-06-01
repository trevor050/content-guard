/**
 * 🎯 ContentGuard v3.0 - Advanced Context Detection
 * 
 * Sophisticated context analysis that can identify professional domains,
 * communication styles, and contextual appropriateness to reduce false positives
 * while maintaining high detection accuracy.
 */

const { 
  TECHNICAL_TERMS, ACADEMIC_TERMS, MEDICAL_TERMS, BUSINESS_TERMS, LEGAL_TERMS 
} = require('../constants/context-data')

/**
 * Extended domain vocabulary for better context detection
 */
const EXTENDED_CONTEXTS = {
  // Technology contexts
  DEVOPS: [
    'deploy', 'deployment', 'kubernetes', 'docker', 'container', 'microservice', 'pipeline', 'ci/cd',
    'server', 'production', 'staging', 'environment', 'cluster', 'node', 'pod', 'namespace',
    'monitoring', 'alerting', 'logging', 'metrics', 'prometheus', 'grafana', 'elk', 'splunk',
    'infrastructure', 'terraform', 'ansible', 'chef', 'puppet', 'provisioning', 'automation'
  ],

  SECURITY: [
    'vulnerability', 'exploit', 'patch', 'update', 'firewall', 'vpn', 'encryption', 'certificate',
    'authentication', 'authorization', 'oauth', 'jwt', 'ssl', 'tls', 'https', 'security audit',
    'penetration test', 'threat', 'malware', 'virus', 'ransomware', 'phishing', 'social engineering'
  ],

  SOFTWARE_DEV: [
    'repository', 'git', 'commit', 'merge', 'branch', 'pull request', 'code review', 'refactor',
    'api', 'endpoint', 'rest', 'graphql', 'database', 'sql', 'query', 'orm', 'migration',
    'framework', 'library', 'dependency', 'package', 'npm', 'yarn', 'webpack', 'babel'
  ],

  // Medical contexts
  CLINICAL: [
    'symptom', 'diagnosis', 'prognosis', 'treatment', 'therapy', 'medication', 'dosage', 'prescription',
    'patient care', 'clinical trial', 'medical history', 'vital signs', 'blood pressure', 'heart rate',
    'laboratory', 'radiology', 'imaging', 'x-ray', 'mri', 'ct scan', 'ultrasound', 'biopsy'
  ],

  EMERGENCY_MEDICAL: [
    'emergency', 'trauma', 'icu', 'intensive care', 'life support', 'resuscitation', 'cardiac arrest',
    'stroke', 'heart attack', 'respiratory failure', 'sepsis', 'shock', 'hemorrhage', 'fracture',
    'ambulance', 'paramedic', 'first aid', 'triage', 'urgent care', 'emergency room'
  ],

  // Business contexts
  FINANCE: [
    'revenue', 'profit', 'loss', 'margin', 'cash flow', 'budget', 'forecast', 'projection',
    'investment', 'roi', 'return on investment', 'equity', 'debt', 'liability', 'asset',
    'balance sheet', 'income statement', 'financial statement', 'audit', 'compliance', 'regulation',
    'market share', 'competitor', 'competition', 'competitive analysis', 'market analysis',
    'business performance', 'sales performance', 'quarterly results', 'market position'
  ],

  MANAGEMENT: [
    'strategy', 'planning', 'execution', 'performance', 'metrics', 'kpi', 'objective', 'goal',
    'milestone', 'deliverable', 'stakeholder', 'resource', 'allocation', 'optimization',
    'workflow', 'process', 'procedure', 'standard operating procedure', 'best practice',
    'competitive advantage', 'market penetration', 'business strategy', 'strategic planning',
    'performance analysis', 'business analysis', 'market research', 'competitive intelligence'
  ],

  // Academic contexts
  RESEARCH: [
    'hypothesis', 'methodology', 'experiment', 'control group', 'variable', 'statistical significance',
    'correlation', 'causation', 'regression', 'sample size', 'population', 'bias', 'validity',
    'reliability', 'peer review', 'publication', 'journal', 'conference', 'citation', 'reference'
  ],

  ENGINEERING: [
    'specification', 'requirement', 'design', 'architecture', 'implementation', 'testing', 'validation',
    'verification', 'prototype', 'iteration', 'optimization', 'efficiency', 'performance',
    'scalability', 'reliability', 'maintainability', 'documentation', 'standard', 'protocol'
  ],

  // NEW: Social Media Context
  SOCIAL_MEDIA: [
    'friend request', 'new follower', 'mentioned you', 'tagged you', 'direct message', 'dm',
    'social media', 'profile', 'feed', 'story', 'post', 'like', 'share', 'comment',
    'tweet', 'retweet', 'hashtag', 'influencer', 'online community', 'forum post'
  ]
}

/**
 * Professional communication indicators
 */
const COMMUNICATION_PATTERNS = {
  FORMAL: [
    /dear (sir|madam|team|colleagues|mr|ms|dr|professor)/i,
    /yours (sincerely|faithfully|truly)/i,
    /best regards/i,
    /kind regards/i,
    /thank you for your (time|consideration|attention)/i,
    /please find attached/i,
    /i am writing to (inform|request|inquire)/i,
    /we would like to (inform|request|propose)/i
  ],

  PROFESSIONAL: [
    /meeting (scheduled|request|invitation)/i,
    /project (status|update|deadline|milestone)/i,
    /please (review|approve|consider|confirm)/i,
    /urgent (request|matter|issue|priority)/i,
    /deadline (approaching|extended|missed)/i,
    /follow up/i,
    /action items/i,
    /next steps/i
  ],

  TECHNICAL: [
    /technical (issue|problem|solution|specification)/i,
    /system (failure|outage|maintenance|upgrade)/i,
    /performance (issue|improvement|optimization)/i,
    /bug (report|fix|tracking)/i,
    /feature (request|implementation|deployment)/i,
    /code (review|deployment|rollback)/i
  ]
}

/**
 * Potentially harmful words that are legitimate in professional contexts
 */
const CONTEXTUAL_WORDS = {
  // Words that trigger false positives but are legitimate in context
  'kill': {
    professional_contexts: ['DEVOPS', 'SOFTWARE_DEV', 'TECHNICAL'],
    legitimate_phrases: [
      'kill process', 'kill task', 'kill command', 'kill signal', 'kill switch',
      'kill the process', 'kill runaway process', 'kill stuck process'
    ],
    weight_reduction: 0.8 // Reduce impact by 80% in professional context
  },

  'critical': {
    professional_contexts: ['CLINICAL', 'EMERGENCY_MEDICAL', 'DEVOPS', 'SECURITY', 'BUSINESS'],
    legitimate_phrases: [
      'critical care', 'critical condition', 'critical system', 'critical path',
      'critical issue', 'critical thinking', 'critical analysis', 'critical success factor'
    ],
    weight_reduction: 0.9
  },

  'urgent': {
    professional_contexts: ['CLINICAL', 'EMERGENCY_MEDICAL', 'BUSINESS', 'DEVOPS'],
    legitimate_phrases: [
      'urgent care', 'urgent matter', 'urgent request', 'urgent priority',
      'urgent surgery', 'urgent intervention', 'urgent response'
    ],
    weight_reduction: 0.8
  },

  'ass': {
    professional_contexts: ['ACADEMIC', 'BUSINESS', 'RESEARCH'],
    legitimate_phrases: [
      'assess', 'assessment', 'class', 'classic', 'assist', 'assistance',
      'associate', 'association', 'asset', 'passage', 'embassy', 'mass'
    ],
    weight_reduction: 0.95
  },

  'analyze': {
    professional_contexts: ['ACADEMIC', 'RESEARCH', 'BUSINESS', 'TECHNICAL'],
    legitimate_phrases: [
      'analyze data', 'analyze results', 'analyze performance', 'analyze trends',
      'analyze patterns', 'analyze behavior', 'analyze metrics'
    ],
    weight_reduction: 0.0 // Completely legitimate
  }
}

/**
 * Professional email domain patterns
 */
const PROFESSIONAL_DOMAINS = {
  CORPORATE: [
    'company.com', 'corp.com', 'inc.com', 'ltd.com', 'llc.com',
    'microsoft.com', 'google.com', 'apple.com', 'amazon.com', 'facebook.com'
  ],
  EDUCATIONAL: [
    '.edu', '.ac.uk', '.ac.in', '.edu.au', '.edu.sg', 'university.', 'college.'
  ],
  GOVERNMENT: [
    '.gov', '.gov.uk', '.gov.au', '.gov.ca', '.mil', '.state.'
  ],
  HEALTHCARE: [
    'hospital.', 'clinic.', 'medical.', 'health.', '.nhs.', 'mayo.', 'kaiser.'
  ]
}

class ContextDetector {
  constructor(options = {}) {
    this.options = {
      enableDomainDetection: true,
      enablePatternMatching: true,
      enableVocabularyAnalysis: true,
      confidenceThreshold: 0.3,
      ...options
    }
  }

  /**
   * Analyze content for context and communication style
   */
  analyzeContext(content, input = {}) {
    const context = {
      domains: this.detectDomains(content),
      communicationStyle: this.detectCommunicationStyle(content),
      professionalIndicators: this.detectProfessionalIndicators(content, input),
      vocabularyAnalysis: this.analyzeVocabulary(content),
      emailContext: this.analyzeEmailContext(input.email || ''),
      confidence: 0
    }

    // Calculate overall confidence
    context.confidence = this.calculateContextConfidence(context)

    // Add convenience flags
    context.isProfessional = this.isProfessionalContext(context)
    context.isTechnical = context.domains.includes('DEVOPS') || context.domains.includes('SOFTWARE_DEV') || context.domains.includes('SECURITY')
    context.isMedical = context.domains.includes('CLINICAL') || context.domains.includes('EMERGENCY_MEDICAL')
    context.isAcademic = context.domains.includes('RESEARCH') || context.domains.includes('ENGINEERING')
    context.isBusiness = context.domains.includes('FINANCE') || context.domains.includes('MANAGEMENT')
    context.isSocialMedia = context.domains.includes('SOCIAL_MEDIA')

    return context
  }

  /**
   * Detect specific domain contexts
   */
  detectDomains(content) {
    const detectedDomains = []
    const text = content.allTextLower

    for (const [domain, vocabulary] of Object.entries(EXTENDED_CONTEXTS)) {
      if (!vocabulary || !Array.isArray(vocabulary)) continue
      
      const matches = vocabulary.filter(term => text.includes(term.toLowerCase())).length
      const threshold = Math.max(1, Math.ceil(vocabulary.length * 0.05))

      if (matches >= threshold) {
        detectedDomains.push(domain)
      }
    }

    // Check for individual technical terms (more flexible)
    const technicalMatches = TECHNICAL_TERMS.filter(term => {
      const termWords = term.toLowerCase().split(' ')
      // If it's a phrase, all words must be present (but not necessarily together)
      if (termWords.length > 1) {
        return termWords.every(word => text.includes(word))
      }
      // Single word matches
      return text.includes(term.toLowerCase())
    })

    if (technicalMatches.length > 0 && !detectedDomains.includes('DEVOPS')) {
      detectedDomains.push('DEVOPS')
    }

    // Check for business terms (more flexible)
    const businessMatches = BUSINESS_TERMS.filter(term => {
      const termWords = term.toLowerCase().split(' ')
      // If it's a phrase, all words must be present (but not necessarily together)
      if (termWords.length > 1) {
        return termWords.every(word => text.includes(word))
      }
      // Single word matches
      return text.includes(term.toLowerCase())
    })

    if (businessMatches.length > 0 && !detectedDomains.includes('FINANCE')) {
      detectedDomains.push('FINANCE')
    }

    return detectedDomains
  }

  /**
   * Detect communication style patterns
   */
  detectCommunicationStyle(content) {
    const styles = []
    const text = content.allText

    for (const [style, patterns] of Object.entries(COMMUNICATION_PATTERNS)) {
      const matches = patterns.filter(pattern => pattern.test(text)).length
      
      if (matches > 0) {
        styles.push(style)
      }
    }

    return styles
  }

  /**
   * Detect professional indicators
   */
  detectProfessionalIndicators(content, input) {
    const indicators = {
      hasBusinessTerms: false,
      hasTechnicalTerms: false,
      hasAcademicTerms: false,
      hasMedicalTerms: false,
      hasLegalTerms: false,
      isProfessionalEmail: false,
      usesBusinessLanguage: false
    }

    const text = content.allTextLower

    // Check for professional vocabulary
    indicators.hasBusinessTerms = BUSINESS_TERMS.some(term => text.includes(term.toLowerCase()))
    indicators.hasTechnicalTerms = TECHNICAL_TERMS.some(term => text.includes(term.toLowerCase()))
    indicators.hasAcademicTerms = ACADEMIC_TERMS.some(term => text.includes(term.toLowerCase()))
    indicators.hasMedicalTerms = MEDICAL_TERMS.some(term => text.includes(term.toLowerCase()))
    indicators.hasLegalTerms = LEGAL_TERMS.some(term => text.includes(term.toLowerCase()))

    // Check email domain
    if (input.email) {
      indicators.isProfessionalEmail = this.isProfessionalEmail(input.email)
    }

    // Check for business language patterns
    const businessPatterns = [
      /quarterly (results|report|analysis)/i,
      /annual (report|review|meeting)/i,
      /board (meeting|approval|decision)/i,
      /stakeholder (meeting|communication|feedback)/i,
      /client (request|meeting|feedback)/i,
      /customer (service|support|inquiry)/i
    ]

    indicators.usesBusinessLanguage = businessPatterns.some(pattern => pattern.test(content.allText))

    return indicators
  }

  /**
   * Analyze vocabulary sophistication and domain specificity
   */
  analyzeVocabulary(content) {
    const words = content.allTextLower.split(/\s+/).filter(word => word.length > 3)
    
    return {
      totalWords: words.length,
      uniqueWords: new Set(words).size,
      averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      technicalTermsCount: this.countTerms(content.allTextLower, TECHNICAL_TERMS),
      businessTermsCount: this.countTerms(content.allTextLower, BUSINESS_TERMS),
      academicTermsCount: this.countTerms(content.allTextLower, ACADEMIC_TERMS),
      medicalTermsCount: this.countTerms(content.allTextLower, MEDICAL_TERMS)
    }
  }

  /**
   * Analyze email context for professional indicators
   */
  analyzeEmailContext(email) {
    if (!email) return { isProfessional: false, domain: '', type: 'unknown' }

    const domain = email.split('@')[1]?.toLowerCase() || ''
    
    for (const [type, domains] of Object.entries(PROFESSIONAL_DOMAINS)) {
      if (domains.some(profDomain => domain.includes(profDomain))) {
        return { isProfessional: true, domain, type: type.toLowerCase() }
      }
    }

    // Check for common professional patterns
    const professionalPatterns = [
      /\.(com|org|net)$/,
      /^[a-zA-Z]+\.(com|org)$/,
      /company|corp|inc|ltd|llc/
    ]

    const isProfessional = professionalPatterns.some(pattern => pattern.test(domain))

    return { isProfessional, domain, type: isProfessional ? 'corporate' : 'personal' }
  }

  /**
   * Calculate scoring adjustments for potentially problematic words in context
   */
  getContextualAdjustments(content, detectedContext) {
    const adjustments = []
    const text = content.allTextLower

    for (const [word, config] of Object.entries(CONTEXTUAL_WORDS)) {
      if (text.includes(word)) {
        // Check if word appears in professional context
        const hasRelevantContext = config.professional_contexts.some(ctx => 
          detectedContext.domains.includes(ctx)
        )

        // Check if word appears in legitimate phrases
        const inLegitimatePhrase = config.legitimate_phrases.some(phrase => 
          text.includes(phrase.toLowerCase())
        )

        if (hasRelevantContext || inLegitimatePhrase) {
          adjustments.push({
            word,
            reason: hasRelevantContext ? 'professional_context' : 'legitimate_phrase',
            weightReduction: config.weight_reduction,
            contexts: config.professional_contexts
          })
        }
      }
    }

    return adjustments
  }

  /**
   * Determine if overall context is professional
   */
  isProfessionalContext(context) {
    const professionalIndicators = [
      context.professionalIndicators.hasBusinessTerms,
      context.professionalIndicators.hasTechnicalTerms,
      context.professionalIndicators.hasAcademicTerms,
      context.professionalIndicators.hasMedicalTerms,
      context.professionalIndicators.hasLegalTerms,
      context.professionalIndicators.isProfessionalEmail,
      context.professionalIndicators.usesBusinessLanguage,
      context.communicationStyle.includes('FORMAL'),
      context.communicationStyle.includes('PROFESSIONAL'),
      context.domains.length > 0
    ]

    const professionalScore = professionalIndicators.filter(Boolean).length / professionalIndicators.length

    return professionalScore >= 0.3 // 30% threshold
  }

  /**
   * Check if email is from professional domain
   */
  isProfessionalEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase() || ''
    
    return Object.values(PROFESSIONAL_DOMAINS)
      .flat()
      .some(profDomain => domain.includes(profDomain))
  }

  /**
   * Count occurrences of terms in text
   */
  countTerms(text, terms) {
    return terms.filter(term => text.includes(term.toLowerCase())).length
  }

  /**
   * Calculate overall context confidence
   */
  calculateContextConfidence(context) {
    let confidence = 0
    
    // Domain detection confidence
    confidence += context.domains.length * 0.2

    // Communication style confidence
    confidence += context.communicationStyle.length * 0.15

    // Professional indicators confidence
    const profIndicators = Object.values(context.professionalIndicators).filter(Boolean).length
    confidence += profIndicators * 0.1

    // Email context confidence
    if (context.emailContext.isProfessional) {
      confidence += 0.2
    }

    // Vocabulary analysis confidence
    if (context.vocabularyAnalysis.averageWordLength > 5) {
      confidence += 0.1
    }

    return Math.min(1.0, confidence)
  }
}

module.exports = { ContextDetector, EXTENDED_CONTEXTS, CONTEXTUAL_WORDS, PROFESSIONAL_DOMAINS } 