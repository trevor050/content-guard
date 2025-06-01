/**
 * 🛡️ ContentGuard - Advanced Content Analysis System
 * 
 * A comprehensive multi-layer defense system for detecting spam, toxicity, 
 * trolling, harassment, and other unwanted content with context awareness.
 * 
 * @author ContentGuard Contributors
 * @license MIT
 */

const { RegExpMatcher, englishDataset, englishRecommendedTransformers } = require('obscenity')
const Sentiment = require('sentiment')
const TextModerate = require('text-moderate')
const natural = require('natural')
const compromise = require('compromise')
const { franc } = require('franc')
const keywordExtractor = require('keyword-extractor')
const Filter = require('bad-words')
const { LRUCache } = require('lru-cache')
const { cosine } = require('cosine-similarity')
const leven = require('leven')
const validator = require('validator')
const emailValidator = require('email-validator')
const lodash = require('lodash')

/**
 * Main ContentGuard class providing comprehensive content analysis
 */
class ContentGuard {
  constructor(options = {}) {
    this.options = {
      // Scoring thresholds with fuzzy classification
      spamThreshold: options.spamThreshold || 5,
      lowRiskThreshold: options.lowRiskThreshold || 2,
      mediumRiskThreshold: options.mediumRiskThreshold || 8,
      highRiskThreshold: options.highRiskThreshold || 15,
      
      // Fuzzy classification options
      enableFuzzyClassification: options.enableFuzzyClassification !== false,
      fuzzyConfidenceLevels: options.fuzzyConfidenceLevels || {
        veryLow: 0.2,
        low: 0.4,
        medium: 0.6,
        high: 0.8,
        veryHigh: 0.95
      },
      
      // Layer weights (multiply scores by these factors)
      layerWeights: {
        obscenity: options.layerWeights?.obscenity || 1.0,
        sentiment: options.layerWeights?.sentiment || 1.0,
        textModerate: options.layerWeights?.textModerate || 1.0,
        custom: options.layerWeights?.custom || 1.0,
        ipReputation: options.layerWeights?.ipReputation || 1.0,
        patterns: options.layerWeights?.patterns || 1.0,
        nlp: options.layerWeights?.nlp || 1.0,
        similarity: options.layerWeights?.similarity || 1.0,
        language: options.layerWeights?.language || 1.0,
        validation: options.layerWeights?.validation || 1.0
      },
      
      // Feature toggles
      enableLayers: {
        obscenity: options.enableLayers?.obscenity !== false,
        sentiment: options.enableLayers?.sentiment !== false,
        textModerate: options.enableLayers?.textModerate !== false,
        custom: options.enableLayers?.custom !== false,
        ipReputation: options.enableLayers?.ipReputation !== false,
        patterns: options.enableLayers?.patterns !== false,
        nlp: options.enableLayers?.nlp !== false,
        similarity: options.enableLayers?.similarity !== false,
        language: options.enableLayers?.language !== false,
        validation: options.enableLayers?.validation !== false
      },
      
      // Custom content filtering
      customSpamWords: options.customSpamWords || [],
      customWhitelistWords: options.customWhitelistWords || [],
      customTrollPatterns: options.customTrollPatterns || [],
      customContextPatterns: options.customContextPatterns || {},
      
      // Customizable detection categories
      detectionCategories: {
        toxicity: options.detectionCategories?.toxicity !== false,
        harassment: options.detectionCategories?.harassment !== false,
        spam: options.detectionCategories?.spam !== false,
        scams: options.detectionCategories?.scams !== false,
        extremism: options.detectionCategories?.extremism !== false,
        evasion: options.detectionCategories?.evasion !== false,
        gaming: options.detectionCategories?.gaming !== false,
        professional: options.detectionCategories?.professional !== false
      },
      
      // Context awareness settings with extensive customization
      contextAware: options.contextAware !== false,
      technicalTermsBonus: options.technicalTermsBonus || -3,
      academicTermsBonus: options.academicTermsBonus || -2,
      medicalTermsBonus: options.medicalTermsBonus || -4,
      businessTermsBonus: options.businessTermsBonus || -2,
      legalTermsBonus: options.legalTermsBonus || -3,
      
      // Positive indicators boost with granular control
      professionalKeywordBonus: options.professionalKeywordBonus || -2,
      trustedDomainBonus: options.trustedDomainBonus || -1,
      eduGovBonus: options.eduGovBonus || -4,
      structuredContentBonus: options.structuredContentBonus || -2,
      politeLanguageBonus: options.politeLanguageBonus || -1,
      
      // Performance optimization
      enableCaching: options.enableCaching !== false,
      cacheSize: options.cacheSize || 1000,
      cacheMaxAge: options.cacheMaxAge || 1000 * 60 * 5, // 5 minutes
      
      // Advanced NLP settings
      enableAdvancedNLP: options.enableAdvancedNLP !== false,
      enableLanguageDetection: options.enableLanguageDetection !== false,
      enableKeywordExtraction: options.enableKeywordExtraction !== false,
      enableSimilarityCheck: options.enableSimilarityCheck !== false,
      
      // Machine learning features
      enableMLFeatures: options.enableMLFeatures !== false,
      similarityThreshold: options.similarityThreshold || 0.8,
      
      // Customizable severity levels
      severityLevels: options.severityLevels || {
        clean: { min: -50, max: 1, action: 'allow' },
        suspicious: { min: 2, max: 4, action: 'review' },
        likely_spam: { min: 5, max: 9, action: 'flag' },
        definite_spam: { min: 10, max: 19, action: 'block' },
        critical: { min: 20, max: 100, action: 'ban' }
      },
      
      // Debug and monitoring
      debug: options.debug || false,
      enableMetrics: options.enableMetrics !== false,
      enableDetailedLogs: options.enableDetailedLogs || false
    }
    
    this.initializeLibraries()
    this.initializeContextData()
    this.initializeCache()
    this.initializeMetrics()
    
    if (this.options.debug) {
      console.log('🛡️ ContentGuard Advanced System Initialized')
      console.log('Features enabled:', Object.keys(this.options.enableLayers).filter(
        layer => this.options.enableLayers[layer]
      ))
    }
  }
  
  /**
   * Initialize all detection libraries and advanced NLP tools
   */
  initializeLibraries() {
    try {
      // Initialize Obscenity (Layer 1)
      if (this.options.enableLayers.obscenity) {
        this.profanityMatcher = new RegExpMatcher({
          ...englishDataset.build(),
          ...englishRecommendedTransformers,
        })
      }
      
      // Initialize Sentiment (Layer 2)
      if (this.options.enableLayers.sentiment) {
        this.sentiment = new Sentiment()
      }
      
      // Initialize TextModerate (Layer 3)
      if (this.options.enableLayers.textModerate) {
        this.textModerate = new TextModerate()
      }
      
      // Initialize Bad Words Filter
      this.badWordsFilter = new Filter()
      this.badWordsFilter.addWords(...this.options.customSpamWords)
      
      // Initialize Natural Language Processing tools
      if (this.options.enableAdvancedNLP) {
        this.stemmer = natural.PorterStemmer
        this.tokenizer = new natural.WordTokenizer()
        this.tfidf = new natural.TfIdf()
      }
      
    } catch (error) {
      console.error('⚠️ Failed to initialize some libraries:', error.message)
    }
  }
  
  /**
   * Initialize performance cache
   */
  initializeCache() {
    if (this.options.enableCaching) {
      this.cache = new LRUCache({
        max: this.options.cacheSize,
        ttl: this.options.cacheMaxAge
      })
    }
  }
  
  /**
   * Initialize metrics collection
   */
  initializeMetrics() {
    if (this.options.enableMetrics) {
      this.metrics = {
        totalAnalyses: 0,
        spamDetected: 0,
        cleanContent: 0,
        averageProcessingTime: 0,
        layerPerformance: {},
        cacheHits: 0,
        cacheMisses: 0
      }
    }
  }
  
  /**
   * Initialize context awareness data
   */
  initializeContextData() {
    // Enhanced technical terms database
    this.technicalTerms = [
      'kill process', 'kill task', 'kill command', 'kill signal', 'kill -9',
      'terminate process', 'end process', 'stop process', 'process kill',
      'ratio calculation', 'aspect ratio', 'gear ratio', 'ratio analysis',
      'ratio of', 'financial ratio', 'compression ratio', 'ratio test',
      'urgent priority', 'urgent request', 'urgent issue', 'urgent bug',
      'critical path', 'critical section', 'critical error', 'critical system',
      'performance ratio', 'cpu ratio', 'thread ratio', 'memory ratio'
    ]
    
    // Expanded academic/professional context indicators
    this.academicTerms = [
      'research', 'analysis', 'study', 'paper', 'thesis', 'dissertation',
      'methodology', 'literature review', 'data analysis', 'hypothesis',
      'experiment', 'survey', 'statistical', 'correlation', 'regression',
      'engineering', 'mechanical', 'electrical', 'software', 'civil',
      'structural', 'architectural', 'design', 'optimization',
      'university', 'college', 'academic', 'professor', 'student'
    ]
    
    // Medical context terms
    this.medicalTerms = [
      'patient', 'medical', 'hospital', 'treatment', 'medication', 'protocol',
      'clinical', 'diagnosis', 'therapeutic', 'healthcare', 'intervention',
      'procedure', 'surgery', 'emergency', 'critical care', 'icu',
      'drug concentration', 'dosage', 'pharmaceutical', 'nursing'
    ]
    
    // Business/Financial context terms
    this.businessTerms = [
      'business', 'financial', 'market', 'investment', 'portfolio', 'equity',
      'debt', 'revenue', 'profit', 'budget', 'project', 'deadline',
      'corporate', 'company', 'organization', 'management', 'analysis',
      'risk assessment', 'financial analysis', 'market analysis',
      'game development', 'game design', 'game balance', 'character design',
      'player feedback', 'game mechanics', 'development team', 'game studio'
    ]
    
    // Professional email patterns
    this.professionalPatterns = [
      /\b(inquiry|enquiry)\b/i,
      /\b(application|position|opportunity)\b/i,
      /\b(meeting|schedule|appointment)\b/i,
      /\b(proposal|partnership|collaboration)\b/i,
      /\b(portfolio|resume|cv)\b/i,
      /dear (sir|madam|team|colleagues)/i,
      /\b(professional|business|corporate)\b/i
    ]
    
    // Subtle harassment patterns
    this.subtleHarassmentPatterns = [
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
    ]
    
    // Scam/Manipulation patterns
    this.scamPatterns = [
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
    ]
    
    // Coded language/Extremist patterns
    this.codedLanguagePatterns = [
      /great replacement/i,
      /traditional values/i,
      /heritage.*replace/i,
      /truth.*they.*want/i,
      /media lies/i,
      /wake up.*sheep/i,
      /join.*community.*truth/i,
      /real information/i,
      /globalist/i,
      /deep state/i
    ]
    
    // Doxxing/Threat patterns
    this.doxxingPatterns = [
      /found.*information.*online/i,
      /your address/i,
      /workplace.*family/i,
      /would be unfortunate/i,
      /public information/i,
      /interesting.*about you/i,
      /know where you/i
    ]
    
    // Enhanced evasion detection patterns
    this.evasionPatterns = [
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
    ]
    
    // Legal context terms
    this.legalTerms = [
      'attorney', 'lawyer', 'legal', 'law', 'court', 'case', 'trial', 'hearing',
      'evidence', 'precedent', 'lawsuit', 'litigation', 'contract', 'agreement',
      'settlement', 'judgment', 'appeal', 'defense', 'prosecution', 'client',
      'counsel', 'bar', 'jurisdiction', 'statute', 'regulation', 'compliance'
    ]
  }
  
  /**
   * Enhanced main analysis function with caching and fuzzy classification
   */
  async analyze(input, options = {}) {
    const startTime = Date.now()
    
    // Generate cache key for performance optimization
    const cacheKey = this.generateCacheKey(input)
    
    // Check cache first
    if (this.options.enableCaching && this.cache) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        if (this.options.enableMetrics) {
          this.metrics.cacheHits++
        }
        return { ...cached, fromCache: true }
      }
      
      if (this.options.enableMetrics) {
        this.metrics.cacheMisses++
      }
    }
    
    if (this.options.debug) {
      console.log('🔍 === STARTING ADVANCED CONTENTGUARD ANALYSIS ===')
      console.log('Input:', { 
        name: input.name, 
        email: input.email, 
        subject: input.subject, 
        messageLength: input.message?.length,
        ip: input.ip
      })
    }
    
    try {
      // Prepare content for analysis
      const content = this.prepareContent(input)
      
      // Run all enabled layers
      const layerResults = await this.runAllLayers(content, input)
      
      // Calculate final score and classification with fuzzy logic
      const analysis = this.calculateAdvancedScore(layerResults, content, input)
      
      // Add advanced metadata and features
      analysis.metadata = {
        processingTime: Date.now() - startTime,
        version: require('./package.json').version,
        enabledLayers: Object.keys(this.options.enableLayers).filter(
          layer => this.options.enableLayers[layer]
        ),
        cacheKey,
        analysisId: this.generateAnalysisId(),
        timestamp: new Date().toISOString()
      }
      
      // Add advanced features if enabled
      if (this.options.enableAdvancedNLP) {
        analysis.nlpFeatures = await this.extractNLPFeatures(content)
      }
      
      if (this.options.enableFuzzyClassification) {
        analysis.fuzzyClassification = this.calculateFuzzyClassification(analysis.score)
      }
      
      // Update metrics
      if (this.options.enableMetrics) {
        this.updateMetrics(analysis, Date.now() - startTime)
      }
      
      // Cache the result
      if (this.options.enableCaching && this.cache) {
        this.cache.set(cacheKey, analysis)
      }
      
      if (this.options.debug) {
        console.log('🏁 Advanced analysis complete:', analysis)
        console.log('🛡️ === ANALYSIS COMPLETE ===')
      }
      
      return analysis
      
    } catch (error) {
      console.error('❌ Analysis failed:', error)
      return this.createFallbackResult(input, error)
    }
  }
  
  /**
   * Generate cache key for content
   */
  generateCacheKey(input) {
    const content = `${input.name || ''}|${input.email || ''}|${input.subject || ''}|${input.message || ''}|${input.ip || ''}`
    return require('crypto').createHash('md5').update(content).digest('hex')
  }
  
  /**
   * Generate unique analysis ID
   */
  generateAnalysisId() {
    return `cg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Calculate fuzzy classification with confidence levels
   */
  calculateFuzzyClassification(score) {
    const levels = this.options.fuzzyConfidenceLevels
    const threshold = this.options.spamThreshold
    
    // Calculate distance from threshold
    const distance = Math.abs(score - threshold)
    const normalized = Math.max(0, Math.min(1, distance / 10)) // Normalize to 0-1
    
    let confidence, certainty
    
    if (normalized >= levels.veryHigh) {
      confidence = 'very_high'
      certainty = 0.95 + (normalized - levels.veryHigh) * 0.05
    } else if (normalized >= levels.high) {
      confidence = 'high'
      certainty = 0.8 + (normalized - levels.high) * 0.15
    } else if (normalized >= levels.medium) {
      confidence = 'medium'
      certainty = 0.6 + (normalized - levels.medium) * 0.2
    } else if (normalized >= levels.low) {
      confidence = 'low'
      certainty = 0.4 + (normalized - levels.low) * 0.2
    } else {
      confidence = 'very_low'
      certainty = normalized / levels.low * 0.4
    }
    
    return {
      confidence,
      certainty: Math.round(certainty * 100) / 100,
      score,
      threshold,
      distance,
      recommendation: this.getFuzzyRecommendation(confidence, score >= threshold)
    }
  }
  
  /**
   * Get fuzzy recommendation based on confidence
   */
  getFuzzyRecommendation(confidence, isSpam) {
    if (confidence === 'very_high') {
      return isSpam ? 'Definitely block - high confidence spam' : 'Definitely allow - high confidence legitimate'
    } else if (confidence === 'high') {
      return isSpam ? 'Block - likely spam' : 'Allow - likely legitimate'
    } else if (confidence === 'medium') {
      return isSpam ? 'Flag for review - moderate spam indicators' : 'Allow with monitoring - moderate legitimacy'
    } else if (confidence === 'low') {
      return 'Requires human review - low confidence classification'
    } else {
      return 'Uncertain classification - manual review strongly recommended'
    }
  }
  
  /**
   * Extract advanced NLP features
   */
  async extractNLPFeatures(content) {
    const features = {}
    
    try {
      // Language detection
      if (this.options.enableLanguageDetection) {
        features.detectedLanguage = franc(content.allText)
        features.isEnglish = features.detectedLanguage === 'eng'
      }
      
      // Keyword extraction
      if (this.options.enableKeywordExtraction) {
        features.keywords = keywordExtractor.extract(content.allText, {
          language: 'english',
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: true
        })
      }
      
      // Advanced text analysis with compromise
      const doc = compromise(content.allText)
      features.sentenceCount = doc.sentences().length
      features.wordCount = doc.terms().length
      features.averageWordsPerSentence = features.wordCount / Math.max(1, features.sentenceCount)
      
      // Named entity recognition
      features.people = doc.people().out('array')
      features.places = doc.places().out('array')
      features.organizations = doc.organizations().out('array')
      
      // Grammatical analysis
      features.questions = doc.questions().length
      features.exclamations = doc.exclamations().length
      features.contractions = doc.contractions().length
      
      // Readability metrics
      features.readability = this.calculateReadability(content.allText)
      
      // Emotional indicators
      features.emotionalWords = this.detectEmotionalWords(content.allText)
      
    } catch (error) {
      console.warn('NLP feature extraction failed:', error.message)
    }
    
    return features
  }
  
  /**
   * Calculate readability score
   */
  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    // Flesch Reading Ease Score
    const avgSentenceLength = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length
    
    return Math.max(0, 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord))
  }
  
  /**
   * Count syllables in a word (approximation)
   */
  countSyllables(word) {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i])
      if (isVowel && !previousWasVowel) {
        count++
      }
      previousWasVowel = isVowel
    }
    
    // Adjust for silent e
    if (word.endsWith('e')) count--
    
    return Math.max(1, count)
  }
  
  /**
   * Detect emotional words and patterns
   */
  detectEmotionalWords(text) {
    const emotions = {
      anger: ['angry', 'mad', 'furious', 'rage', 'hate', 'stupid', 'idiot'],
      joy: ['happy', 'great', 'awesome', 'wonderful', 'amazing', 'excellent'],
      fear: ['scared', 'afraid', 'worried', 'nervous', 'terrified'],
      sadness: ['sad', 'depressed', 'disappointed', 'sorry', 'grief'],
      surprise: ['wow', 'amazing', 'incredible', 'shocking', 'surprising']
    }
    
    const detected = {}
    const lowerText = text.toLowerCase()
    
    Object.entries(emotions).forEach(([emotion, words]) => {
      const matches = words.filter(word => lowerText.includes(word))
      if (matches.length > 0) {
        detected[emotion] = matches
      }
    })
    
    return detected
  }
  
  /**
   * Update performance metrics
   */
  updateMetrics(analysis, processingTime) {
    this.metrics.totalAnalyses++
    
    if (analysis.isSpam) {
      this.metrics.spamDetected++
    } else {
      this.metrics.cleanContent++
    }
    
    // Update rolling average
    const total = this.metrics.totalAnalyses
    this.metrics.averageProcessingTime = (
      (this.metrics.averageProcessingTime * (total - 1)) + processingTime
    ) / total
    
    // Update layer performance
    if (analysis.layerAnalysis) {
      Object.entries(analysis.layerAnalysis).forEach(([layer, result]) => {
        if (!this.metrics.layerPerformance[layer]) {
          this.metrics.layerPerformance[layer] = { 
            totalCalls: 0, 
            totalScore: 0, 
            averageScore: 0 
          }
        }
        
        const layerMetrics = this.metrics.layerPerformance[layer]
        layerMetrics.totalCalls++
        layerMetrics.totalScore += result.score || 0
        layerMetrics.averageScore = layerMetrics.totalScore / layerMetrics.totalCalls
      })
    }
  }
  
  /**
   * Prepare content for analysis with enhanced preprocessing
   */
  prepareContent(input) {
    const name = input.name || ''
    const email = input.email || ''
    const subject = input.subject || ''
    const message = input.message || ''
    
    return {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      allText: `${name} ${subject} ${message}`,
      allTextLower: `${name} ${subject} ${message}`.toLowerCase(),
      emailDomain: email.split('@')[1]?.toLowerCase() || ''
    }
  }
  
  /**
   * Enhanced runAllLayers with new detection capabilities
   */
  async runAllLayers(content, input) {
    const results = {}
    
    // Layer 1: Obscenity (Advanced Profanity Detection)
    if (this.options.enableLayers.obscenity) {
      results.obscenity = this.runObscenityLayer(content)
    }
    
    // Layer 2: Enhanced sentiment analysis with context awareness
    if (this.options.enableLayers.sentiment) {
      results.sentiment = this.runSentimentLayer(content)
    }
    
    // Layer 3: Enhanced TextModerate with error handling
    if (this.options.enableLayers.textModerate) {
      results.textModerate = this.runTextModerateLayer(content)
    }
    
    // Layer 4: Enhanced custom troll patterns with improved detection
    if (this.options.enableLayers.custom) {
      results.custom = this.runCustomLayer(content)
    }
    
    // Layer 5: IP Reputation
    if (this.options.enableLayers.ipReputation && input.ip) {
      results.ipReputation = this.runIpReputationLayer(input.ip)
    }
    
    // Layer 6: Advanced Pattern Detection
    if (this.options.enableLayers.patterns) {
      results.patterns = this.runPatternLayer(content)
    }
    
    // Layer 7: Advanced NLP Analysis
    if (this.options.enableLayers.nlp) {
      results.nlp = await this.runNLPLayer(content)
    }
    
    // Layer 8: Similarity Detection
    if (this.options.enableLayers.similarity) {
      results.similarity = await this.runSimilarityLayer(content)
    }
    
    // Layer 9: Language Analysis
    if (this.options.enableLayers.language) {
      results.language = this.runLanguageLayer(content)
    }
    
    // Layer 10: Validation Layer
    if (this.options.enableLayers.validation) {
      results.validation = this.runValidationLayer(content, input)
    }
    
    return results
  }
  
  /**
   * Layer 1: Obscenity - Advanced profanity detection
   */
  runObscenityLayer(content) {
    if (!this.profanityMatcher) {
      return { score: 0, flags: [], error: 'Obscenity library not initialized' }
    }
    
    if (this.options.debug) console.log('🔍 LAYER 1: Running Obscenity analysis...')
    
    let score = 0
    const flags = []
    
    const checks = [
      { field: 'name', text: content.name },
      { field: 'subject', text: content.subject },
      { field: 'message', text: content.message },
      { field: 'combined', text: content.allText }
    ]
    
    checks.forEach(({ field, text }) => {
      const matches = this.profanityMatcher.getAllMatches(text)
      if (matches.length > 0) {
        matches.forEach(match => {
          const { phraseMetadata } = englishDataset.getPayloadWithPhraseMetadata(match)
          const word = phraseMetadata.originalWord
          
          // Check context awareness
          if (this.isContextuallyAppropriate(content, word)) {
            if (this.options.debug) {
              console.log(`🧠 LAYER 1: Contextually appropriate: "${word}" in ${field}`)
            }
            return // Skip this match
          }
          
          const fieldScore = 4
          score += fieldScore
          flags.push(`Profanity in ${field}: "${word}"`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 1: Profanity in ${field}: "${word}" (+4 points)`)
          }
        })
      }
    })
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.obscenity)
    
    if (this.options.debug) console.log(`📊 LAYER 1 (Obscenity) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 2: Enhanced sentiment analysis with context awareness
   */
  runSentimentLayer(content) {
    if (!this.sentiment) {
      return { score: 0, flags: [], error: 'Sentiment library not initialized' }
    }
    
    if (this.options.debug) console.log('🔍 LAYER 2: Running enhanced sentiment analysis...')
    
    let score = 0
    const flags = []
    
    try {
      const result = this.sentiment.analyze(content.allText)
      
      if (this.options.debug) console.log('LAYER 2 Raw sentiment:', result)
      
      // Detect professional contexts for threshold adjustment
      const contexts = this.detectContext(content)
      const hasProtectedContext = contexts.length > 0
      
      // Adjust thresholds based on context
      let negativeThreshold = -0.5
      let moderateThreshold = -0.2
      
      if (hasProtectedContext) {
        negativeThreshold = -0.8  // Much more tolerant in professional contexts
        moderateThreshold = -0.6
      }
      
      // Professional language often uses words like "critical", "urgent", "prevent" which
      // shouldn't be considered hostile in context
      const professionalNegativeWords = [
        'critical', 'urgent', 'prevent', 'avoid', 'risk', 'failure', 'problem',
        'issue', 'concern', 'emergency', 'stuck', 'error', 'bug', 'kill'
      ]
      
      // Filter out negative words that appear in professional contexts
      let filteredNegativeWords = []
      if (result.negative && result.negative.length > 0) {
        filteredNegativeWords = result.negative.filter(word => {
          // Check if this is a professional word used in appropriate context
          if (professionalNegativeWords.includes(word.toLowerCase()) && hasProtectedContext) {
            if (this.options.debug) {
              console.log(`🧠 LAYER 2: Filtering professional word "${word}" in context`)
            }
            return false
          }
          
          // Check if word appears in contextually appropriate usage
          return !this.isContextuallyAppropriate(content, word)
        })
      }
      
      // Hostile/negative sentiment scoring with enhanced context awareness
      if (result.comparative <= negativeThreshold) {
        // Only flag if we have actual hostile words after filtering
        if (filteredNegativeWords.length > 0) {
          score += 6
          flags.push(`Highly negative sentiment (${result.comparative.toFixed(3)})`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 2: Highly negative: ${result.comparative.toFixed(3)} (+6 points)`)
          }
        }
      } else if (result.comparative <= moderateThreshold) {
        if (filteredNegativeWords.length > 0) {
          score += 3
          flags.push(`Negative sentiment (${result.comparative.toFixed(3)})`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 2: Negative: ${result.comparative.toFixed(3)} (+3 points)`)
          }
        }
      }
      
      // Enhanced hostile words detection with context filtering
      const hostileCount = filteredNegativeWords.length
      
      if (hostileCount >= 3) {
        score += 4
        flags.push(`Multiple hostile words (${hostileCount}): ${filteredNegativeWords.slice(0,3).join(', ')}`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 2: Multiple hostile words (+4 points)`)
        }
      } else if (hostileCount >= 1) {
        // Only add score for truly hostile words, not professional language
        const actuallyHostile = filteredNegativeWords.filter(word => {
          const hostileWords = ['hate', 'stupid', 'idiot', 'moron', 'loser', 'pathetic', 'worthless', 'trash', 'garbage']
          return hostileWords.some(hostile => word.toLowerCase().includes(hostile))
        })
        
        if (actuallyHostile.length > 0) {
          score += 2
          flags.push(`Hostile words (${actuallyHostile.length}): ${actuallyHostile.join(', ')}`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 2: Hostile words (+2 points)`)
          }
        }
      }
      
    } catch (error) {
      flags.push(`Sentiment analysis error: ${error.message}`)
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.sentiment)
    
    if (this.options.debug) console.log(`📊 LAYER 2 (Enhanced Sentiment) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 3: Enhanced TextModerate with error handling
   */
  runTextModerateLayer(content) {
    if (!this.textModerate) {
      return { score: 0, flags: [], error: 'TextModerate library not initialized' }
    }
    
    if (this.options.debug) console.log('🔍 LAYER 3: Running enhanced TextModerate analysis...')
    
    let score = 0
    const flags = []
    
    // Handle empty content
    if (!content.allText || content.allText.trim().length === 0) {
      return { score: 0, flags: [] }
    }
    
    try {
      // Check for profanity
      const isProfane = this.textModerate.isProfane(content.allText)
      if (isProfane) {
        score += 5
        flags.push('TextModerate detected profanity')
        if (this.options.debug) {
          console.log(`🚨 LAYER 3: TextModerate profanity (+5 points)`)
        }
      }
      
      // Check filtering
      const cleanedText = this.textModerate.clean(content.allText)
      const hasFilteredContent = cleanedText !== content.allText
      if (hasFilteredContent) {
        score += 3
        flags.push('Content required filtering')
        if (this.options.debug) {
          console.log(`🚨 LAYER 3: Content filtering required (+3 points)`)
        }
      }
      
      // Sentiment analysis with enhanced context awareness
      try {
        const tmSentiment = this.textModerate.analyzeSentiment(content.allText)
        
        // Check for professional contexts to adjust threshold
        const contexts = this.detectContext(content)
        const hasProtectedContext = contexts.length > 0
        
        const threshold = hasProtectedContext ? -0.7 : -0.4
        
        if (tmSentiment.comparative <= threshold) {
          score += 4
          flags.push(`TextModerate negative sentiment (${tmSentiment.comparative.toFixed(3)})`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 3: Negative sentiment (+4 points)`)
          }
        }
      } catch (e) {
        if (this.options.debug) {
          console.log('LAYER 3: TextModerate sentiment failed:', e.message)
        }
      }
      
    } catch (error) {
      flags.push(`TextModerate error: ${error.message}`)
      if (this.options.debug) {
        console.log('LAYER 3: TextModerate error:', error.message)
      }
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.textModerate)
    
    if (this.options.debug) console.log(`📊 LAYER 3 (Enhanced TextModerate) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 4: Enhanced custom troll patterns with improved detection
   */
  runCustomLayer(content) {
    if (this.options.debug) console.log('🔍 LAYER 4: Running enhanced custom analysis...')
    
    let score = 0
    const flags = []
    
    // Detect context first
    const contexts = this.detectContext(content)
    const hasProtectedContext = contexts.length > 0
    
    // Subtle harassment detection
    this.subtleHarassmentPatterns.forEach(pattern => {
      if (pattern.test(content.allText)) {
        score += 6
        flags.push(`Subtle harassment pattern detected`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: Subtle harassment detected (+6 points)`)
        }
      }
    })
    
    // Scam/Manipulation detection
    this.scamPatterns.forEach(pattern => {
      if (pattern.test(content.allText)) {
        score += 8
        flags.push(`Scam/manipulation pattern detected`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: Scam pattern detected (+8 points)`)
        }
      }
    })
    
    // Coded language/Extremist detection
    this.codedLanguagePatterns.forEach(pattern => {
      if (pattern.test(content.allText)) {
        score += 7
        flags.push(`Coded language/extremist pattern detected`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: Coded language detected (+7 points)`)
        }
      }
    })
    
    // Doxxing/Threat detection
    this.doxxingPatterns.forEach(pattern => {
      if (pattern.test(content.allText)) {
        score += 10
        flags.push(`Doxxing/threat pattern detected`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: Doxxing threat detected (+10 points)`)
        }
      }
    })
    
    // Evasion detection
    this.evasionPatterns.forEach(pattern => {
      if (pattern.test(content.allText)) {
        score += 8
        flags.push(`Evasion attempt detected`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: Evasion detected (+8 points)`)
        }
      }
    })
    
    // Gaming/troll culture keywords with enhanced context awareness
    const gamingTrollKeywords = [
      'fortnite', 'minecraft', 'roblox', 'cod', 'apex', 'valorant', 'cs:go', 'csgo',
      'hop on', 'lets play', 'gamer', 'noob', 'pwned', 'rekt', 'git gud',
      'skill issue', 'mad cuz bad', 'cope', 'seethe', 'cringe', 'based',
      'touch grass', 'go outside', 'basement dweller', ...this.options.customTrollPatterns
    ]
    
    // Professional gaming terms that should not be flagged in business contexts
    const professionalGamingTerms = ['gaming', 'game', 'player', 'balance', 'exploit', 'character', 'nerf', 'buff']
    
    // Check if this is a game development context
    const isGameDev = contexts.some(c => c.type === 'game_development') || 
                     contexts.some(c => c.type === 'business') && 
                     (content.allTextLower.includes('game') && 
                      (content.allTextLower.includes('developer') || 
                       content.allTextLower.includes('development') ||
                       content.allTextLower.includes('balance') ||
                       content.emailDomain.includes('game')))
    
    // Only flag "ratio" if NOT in protected professional contexts AND not discussing finance/math
    const shouldCheckRatio = !hasProtectedContext || 
      !contexts.some(c => ['business', 'academic', 'medical'].includes(c.type))
    
    if (shouldCheckRatio && content.allTextLower.includes('ratio') && 
        !content.allTextLower.includes('calculation') && 
        !content.allTextLower.includes('analysis') && 
        !content.allTextLower.includes('financial')) {
      gamingTrollKeywords.push('ratio')
    }
    
    gamingTrollKeywords.forEach(keyword => {
      if (content.allTextLower.includes(keyword)) {
        // Skip professional gaming terms in game development context
        if (isGameDev && professionalGamingTerms.includes(keyword)) {
          if (this.options.debug) {
            console.log(`🧠 LAYER 4: Skipping professional gaming term "${keyword}" in game dev context`)
          }
          return
        }
        
        // Reduce penalty for professional gaming terms in business context
        let penalty = 3
        if (isGameDev && professionalGamingTerms.includes(keyword)) {
          penalty = 1
        }
        
        score += penalty
        flags.push(`Gaming/troll keyword: "${keyword}"`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: Gaming/troll: "${keyword}" (+${penalty} points)`)
        }
      }
    })
    
    // Harassment/violent keywords (always flagged)
    const harassmentKeywords = [
      'kill yourself', 'kys', 'kill ya self', 'off yourself', 'end yourself',
      'rope yourself', 'jump off', 'die in a fire', 'get cancer', 'hope you die',
      'nobody likes you', 'everyone hates you', 'worthless', 'pathetic loser'
    ]
    
    harassmentKeywords.forEach(keyword => {
      if (content.allTextLower.includes(keyword)) {
        score += 8
        flags.push(`Harassment detected: "${keyword}"`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 4: HARASSMENT: "${keyword}" (+8 points)`)
        }
      }
    })
    
    // Modern slang patterns
    const slangPatterns = [
      'vro', 'bruh', 'bruv', 'bro', 'sis', 'bestie', 'fr', 'no cap', 'periodt',
      'slaps', 'bussin', 'sus', 'amogus', 'among us', 'imposter', 'sussy',
      'deadass', 'finna', 'gonna', 'wanna', 'lowkey', 'highkey', 'ngl',
      'beta', 'alpha', 'sigma', 'chad', 'virgin', 'incel', 'simp', 'cuck',
      'cope harder', 'seethe more', 'touch grass', 'npc'
    ]
    
    const slangCount = slangPatterns.filter(slang => content.allTextLower.includes(slang)).length
    if (slangCount >= 3) {
      score += 4
      flags.push(`Excessive slang (${slangCount} terms)`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 4: Excessive slang: ${slangCount} (+4 points)`)
      }
    } else if (slangCount >= 1) {
      score += 2
      flags.push(`Informal slang (${slangCount} terms)`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 4: Slang: ${slangCount} (+2 points)`)
      }
    }
    
    // Fake/troll names
    const trollNames = [
      'why would i tell you', 'not telling', 'nope', 'none of your business',
      'anonymous', 'anon', 'admin', 'lol', 'lmao', 'ligma',
      'joe mama', 'deez nuts', 'candice', 'sawcon', 'sugma'
    ]
    
    if (trollNames.some(trollName => content.name.toLowerCase().includes(trollName))) {
      score += 6
      flags.push(`Troll/fake name: "${content.name}"`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 4: Troll name: "${content.name}" (+6 points)`)
      }
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.custom)
    
    if (this.options.debug) console.log(`📊 LAYER 4 (Enhanced Custom) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 5: IP Reputation
   */
  runIpReputationLayer(ip) {
    if (this.options.debug) console.log('🔍 LAYER 5: Running IP reputation analysis...')
    
    let score = 0
    const flags = []
    
    // Basic IP checks (can be extended with external APIs)
    
    // Check for local/private IPs (suspicious for web forms)
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.') || ip === '127.0.0.1') {
      score += 2
      flags.push(`Private IP address: ${ip}`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 5: Private IP: ${ip} (+2 points)`)
      }
    }
    
    // Check for known problematic IP ranges (can be customized)
    const suspiciousRanges = [
      '185.220.', // Tor exit nodes
      '198.98.',   // VPN services
      '23.129.'    // Some VPN/proxy services
    ]
    
    suspiciousRanges.forEach(range => {
      if (ip.startsWith(range)) {
        score += 3
        flags.push(`Suspicious IP range: ${range}xxx`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 5: Suspicious range: ${range} (+3 points)`)
        }
      }
    })
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.ipReputation)
    
    if (this.options.debug) console.log(`📊 LAYER 5 (IP Reputation) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 6: Advanced Pattern Detection
   */
  runPatternLayer(content) {
    if (this.options.debug) console.log('🔍 LAYER 6: Running pattern analysis...')
    
    let score = 0
    const flags = []
    
    // Gibberish detection
    if (/(.)\1{4,}/gi.test(content.allText)) {
      score += 3
      flags.push('Repeated character gibberish detected')
      if (this.options.debug) {
        console.log(`🚨 LAYER 6: Gibberish pattern (+3 points)`)
      }
    }
    
    // All caps detection
    const allCapsWords = content.allText.match(/\b[A-Z]{3,}\b/g) || []
    if (allCapsWords.length >= 3) {
      score += 2
      flags.push(`Excessive caps (${allCapsWords.length} words)`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 6: Excessive caps: ${allCapsWords.length} (+2 points)`)
      }
    }
    
    // Number/letter ratio (spam often has weird ratios)
    const numbers = (content.allText.match(/\d/g) || []).length
    const letters = (content.allText.match(/[a-zA-Z]/g) || []).length
    if (letters > 0 && numbers / letters > 0.3) {
      score += 2
      flags.push(`Suspicious number/letter ratio: ${(numbers/letters).toFixed(2)}`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 6: Number/letter ratio: ${(numbers/letters).toFixed(2)} (+2 points)`)
      }
    }
    
    // Emoji spam detection
    const emojiCount = (content.allText.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length
    
    // Be more lenient with emojis if there's legitimate content
    const hasLegitimateContent = content.allText.length > 50 && 
                                (content.allText.includes('hello') || 
                                 content.allText.includes('message') ||
                                 content.allText.includes('happy') ||
                                 content.allText.includes('thank'))
    
    const emojiThreshold = hasLegitimateContent ? 15 : 8
    
    if (emojiCount >= emojiThreshold) {
      score += 2
      flags.push(`Excessive emojis (${emojiCount})`)
      if (this.options.debug) {
        console.log(`🚨 LAYER 6: Emoji spam: ${emojiCount} (+2 points)`)
      }
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.patterns)
    
    if (this.options.debug) console.log(`📊 LAYER 6 (Patterns) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 7: Advanced NLP Analysis
   */
  async runNLPLayer(content) {
    if (this.options.debug) console.log('🔍 LAYER 7: Running advanced NLP analysis...')
    
    let score = 0
    const flags = []
    
    try {
      // Tokenize and analyze with Natural
      if (this.options.enableAdvancedNLP && this.tokenizer) {
        const tokens = this.tokenizer.tokenize(content.allText)
        
        // Check for repetitive patterns
        const uniqueTokens = new Set(tokens.map(token => token.toLowerCase()))
        const repetitionRatio = tokens.length / uniqueTokens.size
        
        if (repetitionRatio > 3) {
          score += 4
          flags.push(`High repetition ratio: ${repetitionRatio.toFixed(1)}`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 7: High repetition detected (+4 points)`)
          }
        }
        
        // Stemming analysis for consistent pattern detection
        const stemmedTokens = tokens.map(token => this.stemmer.stem(token.toLowerCase()))
        const stemRepetition = stemmedTokens.length / new Set(stemmedTokens).size
        
        if (stemRepetition > 2.5) {
          score += 2
          flags.push(`Stem repetition detected`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 7: Stem repetition detected (+2 points)`)
          }
        }
      }
      
      // Advanced compromise analysis
      const doc = compromise(content.allText)
      
      // Check for excessive punctuation
      const punctuationCount = (content.allText.match(/[!?]{2,}/g) || []).length
      if (punctuationCount > 2) {
        score += 3
        flags.push(`Excessive punctuation patterns`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 7: Excessive punctuation (+3 points)`)
        }
      }
      
      // Check for suspicious time references
      const timeWords = doc.match('#Date').out('array')
      if (timeWords.some(word => ['urgent', 'now', 'immediately', 'asap'].includes(word.toLowerCase()))) {
        score += 2
        flags.push(`Suspicious urgency indicators`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 7: Urgency indicators (+2 points)`)
        }
      }
      
    } catch (error) {
      flags.push(`NLP analysis error: ${error.message}`)
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.nlp)
    
    if (this.options.debug) console.log(`📊 LAYER 7 (Advanced NLP) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 8: Similarity Detection
   */
  async runSimilarityLayer(content) {
    if (this.options.debug) console.log('🔍 LAYER 8: Running similarity analysis...')
    
    let score = 0
    const flags = []
    
    try {
      // Check against known spam patterns using edit distance
      const knownSpamPatterns = [
        'click here now',
        'make money fast',
        'congratulations you won',
        'urgent response required',
        'act now limited time',
        'free money no strings attached'
      ]
      
      for (const pattern of knownSpamPatterns) {
        const distance = leven(content.allText.toLowerCase(), pattern)
        const similarity = 1 - (distance / Math.max(content.allText.length, pattern.length))
        
        if (similarity > this.options.similarityThreshold) {
          score += 6
          flags.push(`High similarity to spam pattern: "${pattern}"`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 8: Spam pattern similarity (+6 points)`)
          }
        }
      }
      
      // Check for template-like structure
      const templateIndicators = [
        /dear (sir|madam|customer)/i,
        /this is (not|completely) a scam/i,
        /\$\d+.*guaranteed/i,
        /click.*link.*below/i
      ]
      
      templateIndicators.forEach(pattern => {
        if (pattern.test(content.allText)) {
          score += 4
          flags.push(`Template spam pattern detected`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 8: Template pattern detected (+4 points)`)
          }
        }
      })
      
    } catch (error) {
      flags.push(`Similarity analysis error: ${error.message}`)
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.similarity)
    
    if (this.options.debug) console.log(`📊 LAYER 8 (Similarity) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 9: Language Analysis
   */
  runLanguageLayer(content) {
    if (this.options.debug) console.log('🔍 LAYER 9: Running language analysis...')
    
    let score = 0
    const flags = []
    
    try {
      // Detect language
      const detectedLang = franc(content.allText)
      
      // Flag non-English content in English-expected contexts
      if (detectedLang !== 'eng' && content.allText.length > 20) {
        score += 2
        flags.push(`Non-English content detected: ${detectedLang}`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 9: Non-English content (+2 points)`)
        }
      }
      
      // Check for mixed scripts (potential evasion)
      const scripts = {
        latin: /[a-zA-Z]/,
        cyrillic: /[\u0400-\u04FF]/,
        arabic: /[\u0600-\u06FF]/,
        chinese: /[\u4e00-\u9fff]/
      }
      
      const foundScripts = Object.keys(scripts).filter(script => 
        scripts[script].test(content.allText)
      )
      
      if (foundScripts.length > 1) {
        score += 3
        flags.push(`Mixed scripts detected: ${foundScripts.join(', ')}`)
        if (this.options.debug) {
          console.log(`🚨 LAYER 9: Mixed scripts (+3 points)`)
        }
      }
      
    } catch (error) {
      flags.push(`Language analysis error: ${error.message}`)
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.language)
    
    if (this.options.debug) console.log(`📊 LAYER 9 (Language) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Layer 10: Validation Layer
   */
  runValidationLayer(content, input) {
    if (this.options.debug) console.log('🔍 LAYER 10: Running validation analysis...')
    
    let score = 0
    const flags = []
    
    try {
      // Email validation
      if (input.email) {
        if (!emailValidator.validate(input.email)) {
          score += 3
          flags.push(`Invalid email format: ${input.email}`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 10: Invalid email (+3 points)`)
          }
        }
        
        // Check for suspicious email patterns
        const suspiciousEmailPatterns = [
          /\d{6,}@/,  // Many numbers
          /temp.*mail/i,
          /disposable/i,
          /fake.*mail/i
        ]
        
        suspiciousEmailPatterns.forEach(pattern => {
          if (pattern.test(input.email)) {
            score += 2
            flags.push(`Suspicious email pattern`)
            if (this.options.debug) {
              console.log(`🚨 LAYER 10: Suspicious email pattern (+2 points)`)
            }
          }
        })
      }
      
      // URL validation in content
      const urlMatches = content.allText.match(/https?:\/\/[^\s]+/g) || []
      urlMatches.forEach(url => {
        try {
          new URL(url)
          // Valid URL - check for suspicious patterns
          if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('t.co')) {
            score += 2
            flags.push(`Shortened URL detected: ${url}`)
            if (this.options.debug) {
              console.log(`🚨 LAYER 10: Shortened URL (+2 points)`)
            }
          }
        } catch {
          score += 1
          flags.push(`Malformed URL detected`)
        }
      })
      
      // Phone number patterns
      const phonePatterns = [
        /\b\d{3}-\d{3}-\d{4}\b/,
        /\(\d{3}\)\s*\d{3}-\d{4}/,
        /\b\d{10}\b/
      ]
      
      phonePatterns.forEach(pattern => {
        if (pattern.test(content.allText)) {
          score += 1
          flags.push(`Phone number pattern detected`)
          if (this.options.debug) {
            console.log(`🚨 LAYER 10: Phone pattern (+1 point)`)
          }
        }
      })
      
    } catch (error) {
      flags.push(`Validation analysis error: ${error.message}`)
    }
    
    // Apply weight
    score = Math.round(score * this.options.layerWeights.validation)
    
    if (this.options.debug) console.log(`📊 LAYER 10 (Validation) Score: ${score}`)
    
    return { score, flags }
  }
  
  /**
   * Check if text appears in a technical/academic context
   */
  isContextuallyAppropriate(content, flaggedWord) {
    if (!this.options.contextAware) return false
    
    const lowerText = content.allTextLower
    const flaggedLower = flaggedWord.toLowerCase()
    
    // Check for legitimate word context (e.g., "ass" in "assessment", "class", etc.)
    const legitimateWords = {
      'ass': ['assessment', 'class', 'classic', 'assist', 'associate', 'asset', 'passage', 'embassy', 'mass', 'brass', 'glass'],
      'hell': ['hello', 'shell', 'shelter', 'helpful'],
      'damn': ['damage', 'damnation'],
      'crap': ['scrap', 'scrape'],
      'shit': ['shift', 'shirt', 'ship']
    }
    
    if (legitimateWords[flaggedLower]) {
      for (const legitWord of legitimateWords[flaggedLower]) {
        if (lowerText.includes(legitWord)) {
          if (this.options.debug) {
            console.log(`🧠 Context: "${flaggedWord}" appears in legitimate word "${legitWord}"`)
          }
          return true
        }
      }
    }
    
    // Check for technical context
    for (const term of this.technicalTerms) {
      if (lowerText.includes(term.toLowerCase()) && term.toLowerCase().includes(flaggedLower)) {
        if (this.options.debug) {
          console.log(`🧠 Context: "${flaggedWord}" appears technical in "${term}"`)
        }
        return true
      }
    }
    
    // Check for academic context
    const hasAcademicContext = this.academicTerms.some(term => 
      lowerText.includes(term.toLowerCase())
    )
    
    if (hasAcademicContext) {
      const academicUsage = [
        'ratio', 'analysis', 'research', 'study', 'critical', 'urgent'
      ]
      if (academicUsage.includes(flaggedLower)) {
        if (this.options.debug) {
          console.log(`🧠 Context: "${flaggedWord}" appears academic`)
        }
        return true
      }
    }
    
    // Check for professional email context
    const isProfessional = this.professionalPatterns.some(pattern => 
      pattern.test(lowerText)
    )
    
    if (isProfessional && ['urgent', 'critical', 'kill'].includes(flaggedLower)) {
      if (this.options.debug) {
        console.log(`🧠 Context: "${flaggedWord}" appears professional`)
      }
      return true
    }
    
    // Check for medical/business contexts
    const contexts = this.detectContext(content)
    if (contexts.length > 0) {
      const protectedInContext = ['urgent', 'critical', 'ratio', 'analysis', 'risk']
      if (protectedInContext.includes(flaggedLower)) {
        if (this.options.debug) {
          console.log(`🧠 Context: "${flaggedWord}" appears in professional context`)
        }
        return true
      }
    }
    
    return false
  }
  
  /**
   * Enhanced positive indicators with context-specific bonuses
   */
  applyPositiveIndicators(score, content, flags) {
    const originalScore = score
    
    // Detect contexts
    const contexts = this.detectContext(content)
    
    // Apply context-specific bonuses
    contexts.forEach(context => {
      let bonus = 0
      let description = ''
      
      switch (context.type) {
        case 'medical':
          bonus = -6 * Math.min(3, context.strength)
          description = `Medical context (${context.strength} terms)`
          break
        case 'business':
          bonus = -4 * Math.min(3, context.strength)
          description = `Business context (${context.strength} terms)`
          break
        case 'academic':
          bonus = -5 * Math.min(3, context.strength)
          description = `Academic context (${context.strength} terms)`
          break
        case 'technical':
          bonus = -6 * Math.min(3, context.strength)
          description = `Technical context (${context.strength} terms)`
          break
        case 'professional':
          bonus = -3
          description = `Professional communication patterns`
          break
        case 'legal':
          bonus = -5 * Math.min(3, context.strength)
          description = `Legal context (${context.strength} terms)`
          break
        case 'game_development':
          bonus = -4 * Math.min(3, context.strength)
          description = `Game development context (${context.strength} terms)`
          break
      }
      
      if (bonus < 0) {
        score += bonus
        flags.push(`[POSITIVE] ${description}: ${bonus} points`)
        if (this.options.debug) {
          console.log(`✅ ${description}: ${bonus} points`)
        }
      }
    })
    
    // Trusted email domains
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com']
    if (trustedDomains.includes(content.emailDomain)) {
      score += this.options.trustedDomainBonus
      flags.push(`[POSITIVE] Trusted email domain: ${content.emailDomain}`)
      if (this.options.debug) {
        console.log(`✅ Trusted domain: ${content.emailDomain} (${this.options.trustedDomainBonus} points)`)
      }
    }
    
    // Educational/government domains get stronger bonus
    const eduGovDomains = ['.edu', '.gov', '.ac.uk', '.edu.au', '.org']
    if (eduGovDomains.some(domain => content.emailDomain.includes(domain))) {
      score += this.options.eduGovBonus
      flags.push(`[POSITIVE] Educational/government domain: ${content.emailDomain}`)
      if (this.options.debug) {
        console.log(`✅ Edu/gov domain: ${content.emailDomain} (${this.options.eduGovBonus} points)`)
      }
    }
    
    // Professional keywords
    const professionalKeywords = [
      'engineering', 'engineer', 'mechanical', 'college', 'university', 'student',
      'application', 'portfolio', 'project', 'internship', 'academic', 'job',
      'career', 'position', 'opportunity', 'collaboration', 'research', 'thesis',
      'degree', 'graduation', 'professor', 'resume', 'cv', 'hire', 'employment',
      'professional', 'business', 'corporate', 'company', 'organization',
      ...this.options.customWhitelistWords
    ]
    
    const professionalCount = professionalKeywords.filter(keyword => 
      content.allTextLower.includes(keyword)
    ).length
    
    if (professionalCount > 0) {
      const bonus = Math.min(8, professionalCount * this.options.professionalKeywordBonus)
      score += bonus
      flags.push(`[POSITIVE] Professional keywords (${professionalCount}): ${bonus} points`)
      if (this.options.debug) {
        console.log(`✅ Professional keywords: ${professionalCount} (${bonus} points)`)
      }
    }
    
    // Well-structured content
    const sentences = content.message.split(/[.!?]+/).filter(s => s.trim().length > 15)
    if (sentences.length >= 3 && content.message.length > 150) {
      score -= 3
      flags.push('[POSITIVE] Well-structured message')
      if (this.options.debug) {
        console.log(`✅ Well-structured content (-3 points)`)
      }
    }
    
    // Detect professional formatting
    if (/dear (sir|madam|team|mr|ms|dr)/i.test(content.allText)) {
      score -= 4
      flags.push('[POSITIVE] Professional salutation')
      if (this.options.debug) {
        console.log(`✅ Professional salutation (-4 points)`)
      }
    }
    
    return score
  }
  
  /**
   * Create fallback result when analysis fails
   */
  createFallbackResult(input, error) {
    return {
      score: 10, // Assume suspicious when analysis fails
      isSpam: true,
      riskLevel: 'MEDIUM',
      threshold: this.options.spamThreshold,
      flags: [`Analysis failed: ${error.message}`],
      layerAnalysis: null,
      recommendation: 'Manual review required',
      confidence: 'Low - analysis failed',
      error: error.message
    }
  }
  
  /**
   * Quick spam check - simplified version for basic use cases
   */
  async isSpam(text, options = {}) {
    const result = await this.analyze({ message: text }, options)
    return result.isSpam
  }
  
  /**
   * Get spam score only
   */
  async getScore(text, options = {}) {
    const result = await this.analyze({ message: text }, options)
    return result.score
  }
  
  /**
   * Add custom spam words
   */
  addSpamWords(words) {
    if (Array.isArray(words)) {
      this.options.customSpamWords.push(...words)
    } else {
      this.options.customSpamWords.push(words)
    }
  }
  
  /**
   * Add custom whitelist words
   */
  addWhitelistWords(words) {
    if (Array.isArray(words)) {
      this.options.customWhitelistWords.push(...words)
    } else {
      this.options.customWhitelistWords.push(words)
    }
  }
  
  /**
   * Update configuration
   */
  configure(newOptions) {
    this.options = { ...this.options, ...newOptions }
    this.initializeLibraries() // Reinitialize if needed
    this.initializeContextData() // Reinitialize context data
  }
  
  /**
   * Enhanced context detection
   */
  detectContext(content) {
    const contexts = []
    const lowerText = content.allTextLower
    
    // Medical context detection
    const medicalCount = this.medicalTerms.filter(term => 
      lowerText.includes(term.toLowerCase())
    ).length
    if (medicalCount >= 2) {
      contexts.push({ type: 'medical', strength: medicalCount })
    }
    
    // Business/Financial context
    const businessCount = this.businessTerms.filter(term =>
      lowerText.includes(term.toLowerCase())
    ).length
    if (businessCount >= 2) {
      contexts.push({ type: 'business', strength: businessCount })
    }
    
    // Academic context
    const academicCount = this.academicTerms.filter(term =>
      lowerText.includes(term.toLowerCase())
    ).length
    if (academicCount >= 2) {
      contexts.push({ type: 'academic', strength: academicCount })
    }
    
    // Technical context
    const technicalCount = this.technicalTerms.filter(term =>
      lowerText.includes(term.toLowerCase())
    ).length
    if (technicalCount >= 1) {
      contexts.push({ type: 'technical', strength: technicalCount })
    }
    
    // Professional email patterns
    const professionalMatch = this.professionalPatterns.some(pattern =>
      pattern.test(lowerText)
    )
    if (professionalMatch) {
      contexts.push({ type: 'professional', strength: 1 })
    }
    
    // Legal context
    const legalCount = this.legalTerms.filter(term =>
      lowerText.includes(term.toLowerCase())
    ).length
    if (legalCount >= 2) {
      contexts.push({ type: 'legal', strength: legalCount })
    }
    
    // Game development context (subset of business)
    const gameDevTerms = ['game', 'character', 'player', 'balance', 'nerf', 'buff', 'overpowered']
    const gameDevCount = gameDevTerms.filter(term =>
      lowerText.includes(term.toLowerCase())
    ).length
    if (gameDevCount >= 2 && (lowerText.includes('development') || lowerText.includes('developer') || content.emailDomain.includes('game'))) {
      contexts.push({ type: 'game_development', strength: gameDevCount })
    }
    
    return contexts
  }
  
  /**
   * Calculate advanced final score with fuzzy logic and severity levels
   */
  calculateAdvancedScore(layerResults, content, input) {
    // Sum all layer scores
    let totalScore = Object.values(layerResults).reduce((sum, layer) => sum + (layer.score || 0), 0)
    
    // Collect all flags
    const allFlags = []
    Object.entries(layerResults).forEach(([layerName, layer]) => {
      if (layer.flags) {
        allFlags.push(...layer.flags.map(flag => `[${layerName.toUpperCase()}] ${flag}`))
      }
    })
    
    // Apply positive indicators (bonuses)
    totalScore = this.applyPositiveIndicators(totalScore, content, allFlags)
    
    // Ensure minimum score of 0
    totalScore = Math.max(0, totalScore)
    
    // Determine classification with enhanced logic
    const isSpam = totalScore >= this.options.spamThreshold
    const riskLevel = this.calculateRiskLevel(totalScore)
    const severityInfo = this.calculateSeverityLevel(totalScore)
    
    return {
      score: totalScore,
      isSpam,
      riskLevel,
      severity: severityInfo,
      threshold: this.options.spamThreshold,
      flags: allFlags,
      layerAnalysis: layerResults,
      recommendation: this.getAdvancedRecommendation(totalScore, riskLevel, severityInfo),
      confidence: this.calculateConfidence(totalScore, layerResults),
      categories: this.identifySpamCategories(layerResults, content)
    }
  }
  
  /**
   * Calculate risk level based on score
   */
  calculateRiskLevel(score) {
    if (score >= this.options.highRiskThreshold) return 'CRITICAL'
    if (score >= this.options.mediumRiskThreshold) return 'HIGH'
    if (score >= this.options.spamThreshold) return 'MEDIUM'
    if (score >= this.options.lowRiskThreshold) return 'LOW'
    return 'CLEAN'
  }
  
  /**
   * Calculate severity level with custom actions
   */
  calculateSeverityLevel(score) {
    const levels = this.options.severityLevels
    
    for (const [level, config] of Object.entries(levels)) {
      if (score >= config.min && score <= config.max) {
        return {
          level,
          action: config.action,
          score,
          range: `${config.min}-${config.max}`
        }
      }
    }
    
    return {
      level: 'unknown',
      action: 'review',
      score,
      range: 'unknown'
    }
  }
  
  /**
   * Get advanced recommendation based on multiple factors
   */
  getAdvancedRecommendation(score, riskLevel, severityInfo) {
    const action = severityInfo.action
    
    switch (action) {
      case 'allow':
        return `Allow - Clean content (Score: ${score})`
      case 'review':
        return `Review recommended - Suspicious indicators (Score: ${score})`
      case 'flag':
        return `Flag for moderation - Likely spam (Score: ${score})`
      case 'block':
        return `Block content - Definite spam detected (Score: ${score})`
      case 'ban':
        return `Ban user - Critical spam/harassment (Score: ${score})`
      default:
        return `Manual review required - Score: ${score}`
    }
  }
  
  /**
   * Calculate confidence level based on layer consensus
   */
  calculateConfidence(score, layerResults) {
    const layerScores = Object.values(layerResults).map(layer => layer.score || 0)
    const activeLayersCount = layerScores.filter(s => s > 0).length
    const totalLayers = Object.keys(layerResults).length
    
    // Calculate consensus
    const consensus = activeLayersCount / totalLayers
    
    if (consensus >= 0.8) {
      return 'Very high confidence - multiple layers agree'
    } else if (consensus >= 0.6) {
      return 'High confidence - most layers agree'
    } else if (consensus >= 0.4) {
      return 'Moderate confidence - some layers agree'
    } else if (consensus >= 0.2) {
      return 'Low confidence - few layers triggered'
    } else {
      return 'Very low confidence - minimal detection'
    }
  }
  
  /**
   * Identify specific spam categories detected
   */
  identifySpamCategories(layerResults, content) {
    const categories = []
    
    // Check each detection category if enabled
    Object.entries(this.options.detectionCategories).forEach(([category, enabled]) => {
      if (!enabled) return
      
      switch (category) {
        case 'toxicity':
          if (this.detectToxicity(layerResults, content)) {
            categories.push('toxicity')
          }
          break
        case 'harassment':
          if (this.detectHarassment(layerResults, content)) {
            categories.push('harassment')
          }
          break
        case 'spam':
          if (this.detectSpamPatterns(layerResults, content)) {
            categories.push('spam')
          }
          break
        case 'scams':
          if (this.detectScams(layerResults, content)) {
            categories.push('scams')
          }
          break
        case 'extremism':
          if (this.detectExtremism(layerResults, content)) {
            categories.push('extremism')
          }
          break
        case 'evasion':
          if (this.detectEvasion(layerResults, content)) {
            categories.push('evasion')
          }
          break
        case 'gaming':
          if (this.detectGamingToxicity(layerResults, content)) {
            categories.push('gaming_toxicity')
          }
          break
      }
    })
    
    return categories
  }
  
  /**
   * Helper methods for category detection
   */
  detectToxicity(layerResults, content) {
    return (layerResults.obscenity?.score > 3) || 
           (layerResults.sentiment?.score > 4) ||
           (layerResults.textModerate?.score > 3)
  }
  
  detectHarassment(layerResults, content) {
    const harassmentKeywords = ['kill yourself', 'worthless', 'nobody likes you']
    return harassmentKeywords.some(keyword => 
      content.allTextLower.includes(keyword)
    ) || (layerResults.custom?.score > 6)
  }
  
  detectSpamPatterns(layerResults, content) {
    return (layerResults.patterns?.score > 3) ||
           (layerResults.similarity?.score > 4) ||
           content.allTextLower.includes('click here')
  }
  
  detectScams(layerResults, content) {
    const scamKeywords = ['guaranteed money', 'risk-free', 'nigerian prince']
    return scamKeywords.some(keyword => 
      content.allTextLower.includes(keyword)
    )
  }
  
  detectExtremism(layerResults, content) {
    const extremistKeywords = ['great replacement', 'globalist', 'deep state']
    return extremistKeywords.some(keyword => 
      content.allTextLower.includes(keyword)
    )
  }
  
  detectEvasion(layerResults, content) {
    return /[a-z]\..*[a-z]\..*[a-z]/i.test(content.allText) ||
           /[0-9]+[a-z]+[0-9]+/i.test(content.allText)
  }
  
  detectGamingToxicity(layerResults, content) {
    const gamingToxicWords = ['git gud', 'noob', 'scrub', 'skill issue']
    return gamingToxicWords.some(word => 
      content.allTextLower.includes(word)
    )
  }
  
  /**
   * Enhanced metrics and analytics
   */
  getMetrics() {
    if (!this.options.enableMetrics) {
      return { error: 'Metrics collection disabled' }
    }
    
    const metrics = { ...this.metrics }
    
    // Calculate additional analytics
    metrics.spamRate = this.metrics.totalAnalyses > 0 ? 
      (this.metrics.spamDetected / this.metrics.totalAnalyses * 100).toFixed(2) + '%' : '0%'
    
    metrics.cacheEfficiency = (this.metrics.cacheHits + this.metrics.cacheMisses) > 0 ?
      (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100).toFixed(2) + '%' : '0%'
    
    return metrics
  }
  
  /**
   * Clear metrics data
   */
  clearMetrics() {
    if (this.options.enableMetrics) {
      this.metrics = {
        totalAnalyses: 0,
        spamDetected: 0,
        cleanContent: 0,
        averageProcessingTime: 0,
        layerPerformance: {},
        cacheHits: 0,
        cacheMisses: 0
      }
    }
  }
  
  /**
   * Export configuration for saving
   */
  exportConfiguration() {
    return {
      options: this.options,
      version: require('./package.json').version,
      exportDate: new Date().toISOString()
    }
  }
  
  /**
   * Import configuration from exported data
   */
  importConfiguration(configData) {
    if (configData.options) {
      this.configure(configData.options)
      return true
    }
    return false
  }
}

// Export the class and some utilities
module.exports = {
  ContentGuard,
  
  // Keep old name for backwards compatibility
  UltimateAntiTroll: ContentGuard,
  
  // Convenience function for quick usage
  createFilter: (options = {}) => new ContentGuard(options),
  
  // Default presets
  presets: {
    strict: {
      spamThreshold: 3,
      layerWeights: { obscenity: 1.5, sentiment: 1.2, custom: 1.3 }
    },
    moderate: {
      spamThreshold: 5,
      layerWeights: { obscenity: 1.0, sentiment: 1.0, custom: 1.0 }
    },
    lenient: {
      spamThreshold: 8,
      layerWeights: { obscenity: 0.8, sentiment: 0.8, custom: 0.9 }
    }
  }
} 