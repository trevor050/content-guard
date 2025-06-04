/**
 * ContentGuard Presets
 * 
 * Predefined configurations for different use cases
 */

/**
 * Strict preset - High sensitivity, low tolerance
 * Best for: Forums, comments, user-generated content
 */
const strict = {
  spamThreshold: 3,
  enableEarlyExit: true,
  criticalThreshold: 15,
  plugins: {
    obscenity: { weight: 1.5, contextAware: true },
    sentiment: { weight: 1.2, contextAware: true },
    patterns: { weight: 1.3 },
    validation: { weight: 1.0 }
  }
}

/**
 * Moderate preset - Balanced detection (default)
 * Best for: General chat, contact forms, feedback
 */
const moderate = {
  spamThreshold: 5,
  enableEarlyExit: true,
  criticalThreshold: 20,
  plugins: {
    obscenity: { weight: 1.0, contextAware: true },
    sentiment: { weight: 1.0, contextAware: true },
    patterns: { weight: 1.0 },
    validation: { weight: 0.5 }
  }
}

/**
 * Lenient preset - Lower sensitivity, higher tolerance
 * Best for: Academic, educational, professional forums
 */
const lenient = {
  spamThreshold: 8,
  enableEarlyExit: true,
  criticalThreshold: 25,
  contextAware: true,
  plugins: {
    obscenity: { weight: 0.8, contextAware: true },
    sentiment: { weight: 0.8, contextAware: true },
    patterns: { weight: 0.9 },
    validation: { weight: 0.3 }
  }
}

/**
 * Gaming preset - Optimized for gaming communities
 * Best for: Gaming communities, Discord servers
 */
const gaming = {
  spamThreshold: 4,
  enableEarlyExit: true,
  criticalThreshold: 18,
  plugins: {
    obscenity: { weight: 1.2, contextAware: true },
    patterns: { weight: 1.5 },
    sentiment: { weight: 0.8, contextAware: true },
    validation: { weight: 0.2 }
  }
}

/**
 * Professional preset - Context-aware for business use
 * Best for: Business communications, enterprise
 */
const professional = {
  spamThreshold: 6,
  enableEarlyExit: true,
  criticalThreshold: 22,
  contextAware: true,
  plugins: {
    obscenity: { weight: 0.7, contextAware: true },
    sentiment: { weight: 0.8, contextAware: true },
    patterns: { weight: 1.0 },
    validation: { weight: 1.0 }
  }
}

/**
 * Enterprise preset - Maximum context awareness, low false positives
 * Best for: Corporate environments, customer support
 */
const enterprise = {
  spamThreshold: 7,
  enableEarlyExit: true,
  criticalThreshold: 25,
  contextAware: true,
  plugins: {
    obscenity: { weight: 0.6, contextAware: true },
    sentiment: { weight: 0.7, contextAware: true },
    patterns: { weight: 0.9 },
    validation: { weight: 1.2 }
  }
}

/**
 * Security preset - High vigilance for security-sensitive environments
 * Best for: Financial services, healthcare, government
 */
const security = {
  spamThreshold: 4,
  enableEarlyExit: false, // Analyze everything
  criticalThreshold: 15,
  plugins: {
    obscenity: { weight: 1.3, contextAware: true },
    sentiment: { weight: 1.1, contextAware: true },
    patterns: { weight: 1.4 },
    validation: { weight: 1.5 }
  }
}

module.exports = {
  strict,
  moderate,
  lenient,
  gaming,
  professional,
  enterprise,
  security,
  
  // Export all presets for discovery
  all: {
    strict,
    moderate,
    lenient,
    gaming,
    professional,
    enterprise,
    security
  },
  
  // Metadata
  meta: {
    strict: {
      name: 'Strict',
      description: 'High sensitivity, low tolerance',
      useCases: ['Forums', 'Comments', 'User-generated content'],
      threshold: 3
    },
    moderate: {
      name: 'Moderate',
      description: 'Balanced detection (default)',
      useCases: ['General chat', 'Contact forms', 'Feedback'],
      threshold: 5
    },
    lenient: {
      name: 'Lenient',
      description: 'Lower sensitivity, higher tolerance',
      useCases: ['Academic', 'Educational', 'Professional forums'],
      threshold: 8
    },
    gaming: {
      name: 'Gaming',
      description: 'Optimized for gaming communities',
      useCases: ['Gaming communities', 'Discord servers'],
      threshold: 4
    },
    professional: {
      name: 'Professional',
      description: 'Context-aware for business use',
      useCases: ['Business communications', 'Enterprise'],
      threshold: 6
    },
    enterprise: {
      name: 'Enterprise',
      description: 'Maximum context awareness, low false positives',
      useCases: ['Corporate environments', 'Customer support'],
      threshold: 7
    },
    security: {
      name: 'Security',
      description: 'High vigilance for security-sensitive environments',
      useCases: ['Financial services', 'Healthcare', 'Government'],
      threshold: 4
    }
  }
} 