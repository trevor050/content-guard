/**
 * 🛡️ ContentGuard - Advanced Content Analysis System - TypeScript Definitions
 */

export interface LayerWeights {
  obscenity?: number
  sentiment?: number
  textModerate?: number
  custom?: number
  ipReputation?: number
  patterns?: number
}

export interface EnabledLayers {
  obscenity?: boolean
  sentiment?: boolean
  textModerate?: boolean
  custom?: boolean
  ipReputation?: boolean
  patterns?: boolean
}

export interface ContentGuardOptions {
  spamThreshold?: number
  layerWeights?: LayerWeights
  enableLayers?: EnabledLayers
  customSpamWords?: string[]
  customWhitelistWords?: string[]
  customTrollPatterns?: string[]
  contextAware?: boolean
  technicalTermsBonus?: number
  academicTermsBonus?: number
  professionalKeywordBonus?: number
  trustedDomainBonus?: number
  eduGovBonus?: number
  debug?: boolean
}

export interface AnalysisInput {
  name?: string
  email?: string
  subject?: string
  message: string
  ip?: string
}

export interface LayerResult {
  score: number
  flags: string[]
  error?: string
}

export interface LayerAnalysis {
  obscenity?: LayerResult
  sentiment?: LayerResult
  textModerate?: LayerResult
  custom?: LayerResult
  ipReputation?: LayerResult
  patterns?: LayerResult
}

export interface AnalysisMetadata {
  processingTime: number
  version: string
  enabledLayers: string[]
}

export interface AnalysisResult {
  score: number
  isSpam: boolean
  riskLevel: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  threshold: number
  flags: string[]
  layerAnalysis: LayerAnalysis
  recommendation: string
  confidence: string
  metadata: AnalysisMetadata
  error?: string
}

export interface PresetOptions {
  strict: ContentGuardOptions
  moderate: ContentGuardOptions
  lenient: ContentGuardOptions
}

export declare class ContentGuard {
  constructor(options?: ContentGuardOptions)
  
  /**
   * Analyze content for spam/troll patterns with context awareness
   */
  analyze(input: AnalysisInput, options?: any): Promise<AnalysisResult>
  
  /**
   * Quick spam check
   */
  isSpam(text: string, options?: any): Promise<boolean>
  
  /**
   * Get spam score only
   */
  getScore(text: string, options?: any): Promise<number>
  
  /**
   * Add custom spam words
   */
  addSpamWords(words: string | string[]): void
  
  /**
   * Add custom whitelist words
   */
  addWhitelistWords(words: string | string[]): void
  
  /**
   * Update configuration
   */
  configure(newOptions: Partial<ContentGuardOptions>): void
}

/**
 * Legacy alias for backwards compatibility
 */
export declare class UltimateAntiTroll extends ContentGuard {}

/**
 * Create a new filter instance
 */
export declare function createFilter(options?: ContentGuardOptions): ContentGuard

/**
 * Default presets
 */
export declare const presets: PresetOptions

export { ContentGuard as default } 