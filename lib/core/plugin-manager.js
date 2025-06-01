/**
 * ContentGuard Plugin Manager
 * 
 * Manages loading, initialization, and execution of detection plugins
 */

class PluginManager {
  constructor(options = {}) {
    this.plugins = new Map()
    this.enabledPlugins = new Set()
    this.options = options
    this.cache = new Map()
  }

  /**
   * Register a plugin
   */
  register(name, plugin) {
    if (typeof plugin.init !== 'function' || typeof plugin.analyze !== 'function') {
      throw new Error(`Plugin ${name} must have init() and analyze() methods`)
    }
    
    this.plugins.set(name, plugin)
    return this
  }

  /**
   * Enable a plugin
   */
  enable(name, config = {}) {
    if (!this.plugins.has(name)) {
      throw new Error(`Plugin ${name} not found`)
    }
    
    const plugin = this.plugins.get(name)
    plugin.init(config)
    this.enabledPlugins.add(name)
    return this
  }

  /**
   * Disable a plugin
   */
  disable(name) {
    this.enabledPlugins.delete(name)
    return this
  }

  /**
   * Run analysis through all enabled plugins
   */
  async analyze(content, input) {
    const results = {}
    const enabledList = Array.from(this.enabledPlugins)
    
    // Early exit optimization - if score gets too high, stop processing
    let totalScore = 0
    const criticalThreshold = this.options.criticalThreshold || 20
    
    for (const pluginName of enabledList) {
      const plugin = this.plugins.get(pluginName)
      
      try {
        const result = await plugin.analyze(content, input, this.options)
        results[pluginName] = result
        totalScore += result.score || 0
        
        // Early exit if we hit critical threshold
        if (totalScore >= criticalThreshold && this.options.enableEarlyExit !== false) {
          results._earlyExit = true
          results._totalScore = totalScore
          break
        }
        
      } catch (error) {
        results[pluginName] = {
          score: 0,
          flags: [`Plugin error: ${error.message}`],
          error: error.message
        }
      }
    }
    
    return results
  }

  /**
   * Get list of available plugins
   */
  getAvailable() {
    return Array.from(this.plugins.keys())
  }

  /**
   * Get list of enabled plugins
   */
  getEnabled() {
    return Array.from(this.enabledPlugins)
  }
}

module.exports = PluginManager 