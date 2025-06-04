/**
 * ContentGuard v2.1 TypeScript Definitions
 * 
 * Modern content analysis system with plugin architecture
 */

export interface AnalysisInput {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface PreparedContent {
  name: string;
  email: string;
  subject: string;
  message: string;
  allText: string;
  allTextLower: string;
  emailDomain: string;
}

export interface PluginResult {
  score: number;
  flags: string[];
  error?: string;
  metadata?: Record<string, any>;
}

export interface AnalysisResult {
  score: number;
  isSpam: boolean;
  riskLevel: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threshold: number;
  flags: string[];
  pluginResults: Record<string, PluginResult>;
  recommendation: string;
  confidence: string;
  metadata: {
    processingTime: number;
    version: string;
    enabledPlugins: string[];
    timestamp: string;
    earlyExit: boolean;
  };
  fromCache?: boolean;
  error?: string;
}

export interface PluginConfig {
  weight?: number;
  contextAware?: boolean;
  enabled?: boolean;
  [key: string]: any;
}

export interface ContentGuardOptions {
  // Core settings
  spamThreshold?: number;
  enableEarlyExit?: boolean;
  criticalThreshold?: number;
  
  // Performance optimization
  enableCaching?: boolean;
  cacheSize?: number;
  
  // Plugin configuration
  plugins?: Record<string, PluginConfig>;
  
  // Feature toggles
  enableLazyLoading?: boolean;
  debug?: boolean;
  enableMetrics?: boolean;
  
  // Context awareness
  contextAware?: boolean;
  
  // Backwards compatibility
  enableLayers?: Record<string, boolean>;
  layerWeights?: Record<string, number>;
}

/**
 * Enhanced Plugin Interface
 * 
 * Strongly typed plugin interface for better DX and type safety
 */
export interface CGPlugin {
  /**
   * Plugin name (for identification)
   */
  readonly name: string;
  
  /**
   * Plugin version
   */
  readonly version: string;
  
  /**
   * Initialize the plugin with configuration
   * @param config Plugin-specific configuration
   * @returns Promise for async initialization or void for sync
   */
  init?(config: PluginConfig): Promise<void> | void;
  
  /**
   * Analyze content and return score + flags
   * @param content Prepared content object
   * @param rawInput Original raw input
   * @param options Global analysis options
   * @returns Promise<PluginResult> or PluginResult for sync plugins
   */
  analyze(
    content: PreparedContent, 
    rawInput: AnalysisInput, 
    options: ContentGuardOptions
  ): Promise<PluginResult> | PluginResult;
  
  /**
   * Cleanup plugin resources (optional)
   */
  destroy?(): Promise<void> | void;
}

/**
 * Async Plugin Interface (for heavy ML/NLP plugins)
 */
export interface AsyncCGPlugin extends CGPlugin {
  analyze(
    content: PreparedContent,
    rawInput: AnalysisInput,
    options: ContentGuardOptions
  ): Promise<PluginResult>;
}

/**
 * Sync Plugin Interface (for lightweight regex/rule-based plugins)
 */
export interface SyncCGPlugin extends CGPlugin {
  analyze(
    content: PreparedContent,
    rawInput: AnalysisInput,
    options: ContentGuardOptions
  ): PluginResult;
}

export interface Metrics {
  totalAnalyses: number;
  spamDetected: number;
  cleanContent: number;
  averageProcessingTime: number;
  cacheHits: number;
  cacheMisses: number;
  pluginPerformance: Record<string, any>;
  spamRate: string;
  cacheEfficiency: string;
}

export declare class PluginManager {
  constructor(options?: any);
  register(name: string, plugin: CGPlugin): this;
  enable(name: string, config?: PluginConfig): this;
  disable(name: string): this;
  analyze(content: PreparedContent, input: AnalysisInput): Promise<Record<string, PluginResult>>;
  getAvailable(): string[];
  getEnabled(): string[];
}

export declare class ContentGuard {
  constructor(options?: ContentGuardOptions);
  
  // Main analysis method
  analyze(input: AnalysisInput, options?: Partial<ContentGuardOptions>): Promise<AnalysisResult>;
  
  // Convenience methods
  isSpam(text: string, options?: Partial<ContentGuardOptions>): Promise<boolean>;
  getScore(text: string, options?: Partial<ContentGuardOptions>): Promise<number>;
  
  // Plugin management
  addPlugin(name: string, plugin: CGPlugin): this;
  enablePlugin(name: string, config?: PluginConfig): this;
  disablePlugin(name: string): this;
  
  // Metrics and management
  getMetrics(): Metrics | { error: string };
  reset(): void;
}

// Backwards compatibility
export declare class UltimateAntiTroll extends ContentGuard {}

// Factory function
export declare function createFilter(options?: ContentGuardOptions): ContentGuard;

// Enhanced utility exports with type safety
export declare const utils: {
  isValidEmail(email: string): boolean;
  cosineSimilarity(vectorA: number[], vectorB: number[]): number;
  stringSimilarity(str1: string, str2: string): number;
  levenshteinDistance(str1: string, str2: string): number;
  deepMerge(target: any, ...sources: any[]): any;
  isObject(item: any): boolean;
  debounce<T extends (...args: any[]) => any>(func: T, delay: number): T;
  throttle<T extends (...args: any[]) => any>(func: T, delay: number): T;
  flatten<T>(arr: (T | T[])[]): T[];
  unique<T>(arr: T[]): T[];
  clamp(number: number, min: number, max: number): number;
  fastHash(str: string): string;
  safeRegexTest(regex: RegExp, str: string, timeoutMs?: number): boolean;
  StringUtils: {
    includesIgnoreCase(str: string, search: string): boolean;
    countOccurrences(str: string, search: string): number;
    truncateAtWord(str: string, maxLength: number): string;
  };
  LRUCache: new (maxSize?: number) => {
    get(key: string): any;
    set(key: string, value: any): void;
    has(key: string): boolean;
    clear(): void;
    readonly size: number;
  };
  // Legacy alias
  simpleHash: typeof utils.fastHash;
};

// Constants with readonly types
export declare const constants: {
  readonly TECHNICAL_TERMS: readonly string[];
  readonly ACADEMIC_TERMS: readonly string[];
  readonly MEDICAL_TERMS: readonly string[];
  readonly BUSINESS_TERMS: readonly string[];
  readonly LEGAL_TERMS: readonly string[];
  readonly PROFESSIONAL_PATTERNS: readonly RegExp[];
  readonly HARASSMENT_PATTERNS: readonly RegExp[];
  readonly SCAM_PATTERNS: readonly RegExp[];
  readonly EVASION_PATTERNS: readonly RegExp[];
  readonly GAMING_TROLL_KEYWORDS: readonly string[];
  readonly PROFESSIONAL_GAMING_TERMS: readonly string[];
  readonly TROLL_NAMES: readonly string[];
  readonly HARASSMENT_KEYWORDS: readonly string[];
  readonly SLANG_PATTERNS: readonly string[];
};

// Presets with proper typing
export declare const presets: {
  readonly strict: ContentGuardOptions;
  readonly moderate: ContentGuardOptions;
  readonly lenient: ContentGuardOptions;
  readonly gaming: ContentGuardOptions;
  readonly professional: ContentGuardOptions;
};

// Default export
declare const _default: {
  ContentGuard: typeof ContentGuard;
  UltimateAntiTroll: typeof ContentGuard;
  createFilter: typeof createFilter;
  PluginManager: typeof PluginManager;
  utils: typeof utils;
  constants: typeof constants;
  presets: typeof presets;
};

export default _default; 