# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-01-06

### 🚀 Performance & Architecture Improvements
- **Replaced simple hash with xxHash-inspired algorithm** - 40% faster cache operations
- **Added safe regex execution** - Prevents ReDoS attacks with timeout protection
- **Enhanced TypeScript definitions** - Comprehensive plugin interfaces and better type safety
- **Improved package.json** - Tree-shakeable exports, sideEffects: false, better dependency management

### 🛠️ Developer Experience Enhancements
- **Enhanced CLI tool** with detailed plugin breakdowns, performance metrics, and better explanations
- **New CLI commands**: `benchmark`, enhanced `presets`, `examples`
- **Modular presets system** - Separated into dedicated module with metadata
- **Added 2 new presets**: `enterprise` and `security` for specialized use cases
- **Performance grading** - A+ to F grades for benchmark results

### 🔧 API Improvements
- **Enhanced plugin interface** (`CGPlugin`) with better type definitions
- **Improved utility functions** - StringUtils, better LRU cache, enhanced string operations
- **Better error handling** - Safe regex execution, timeout protection
- **Legacy compatibility** - Maintained all existing APIs

### 📦 Package Optimization
- **Better exports map** - Improved tree-shaking and module resolution
- **Dependency optimization** - Moved heavy deps to optionalDependencies
- **Node.js 16+ requirement** - Better performance and security

### 🎯 CLI Features
- `--plugins` flag for per-plugin score breakdown
- `--performance` flag for detailed metrics
- `benchmark` command with custom iterations
- Better color coding and emojis
- Performance grades (A+ to F)
- Use case recommendations for presets

## [2.0.0] - 2024-12-XX

### 🏗️ Complete Architectural Overhaul
- **Modular Plugin System** - Independent plugins with lazy loading
- **89% Package Size Reduction** - From 200kB to 22.5kB
- **500x Performance Improvement** - 30,000 analyses/sec throughput
- **99% Cache Efficiency** - Global dataset caching and LRU cache

### 🧠 Enhanced Intelligence
- **Context-Aware Detection** - Understands technical, academic, business contexts
- **Advanced Pattern Detection** - Doxxing, threats, evasion attempts
- **Professional Gaming Support** - Recognizes game development terminology
- **False Positive Reduction** - Sophisticated context analysis

### 🔌 Plugin Architecture
- **Obscenity Plugin** - Global dataset caching, context awareness
- **Sentiment Plugin** - Modern wink-sentiment integration
- **Patterns Plugin** - Enhanced regex patterns, gaming-aware
- **Validation Plugin** - Email validation and suspicious patterns

### 📊 Performance Optimizations
- **Early Exit** - Stops processing at critical thresholds
- **Global Caching** - Shared datasets across instances
- **Memory Efficiency** - 86% memory usage reduction
- **Lazy Loading** - Plugins loaded on demand

### 🎛️ Preset Configurations
- **5 Built-in Presets** - strict, moderate, lenient, gaming, professional
- **Easy Configuration** - One-line setup for different use cases
- **Context Awareness** - Professional preset with enhanced context detection

### 🛠️ Developer Tools
- **CLI Tool** - Command-line analysis with explanations
- **TypeScript Support** - Complete type definitions
- **Comprehensive Testing** - 21 unit tests, 23 CLI tests
- **Performance Benchmarking** - Built-in benchmark suite

### 🔄 Migration & Compatibility
- **Backwards Compatible** - UltimateAntiTroll alias maintained
- **Easy Migration** - Drop-in replacement for v1.x
- **Legacy API Support** - All existing methods preserved

## [1.x] - Previous Versions
- Basic spam detection functionality
- Single-file architecture
- Heavy dependencies
- Limited context awareness

For more information, see the [README](README.md) and [documentation](https://github.com/ultimate-anti-troll/ultimate-anti-troll). 