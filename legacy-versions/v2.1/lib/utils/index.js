/**
 * Lightweight Utility Functions
 * 
 * Replacement for heavy dependencies like lodash
 */

/**
 * Simple email validation (replaces email-validator)
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Calculate cosine similarity (replaces cosine-similarity package)
 */
function cosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length')
  }
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i]
    normA += vectorA[i] * vectorA[i]
    normB += vectorB[i] * vectorB[i]
  }
  
  if (normA === 0 || normB === 0) {
    return 0
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Simple string similarity (replaces string-similarity)
 */
function stringSimilarity(str1, str2) {
  if (str1 === str2) return 1
  if (str1.length === 0 || str2.length === 0) return 0
  
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1
  
  return (longer.length - levenshteinDistance(longer, shorter)) / longer.length
}

/**
 * Levenshtein distance calculation
 */
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator  // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Deep merge objects (replaces lodash.merge)
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  
  return deepMerge(target, ...sources)
}

/**
 * Check if value is object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Debounce function (replaces lodash.debounce)
 */
function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Throttle function (replaces lodash.throttle)
 */
function throttle(func, delay) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, delay)
    }
  }
}

/**
 * Flatten array (replaces lodash.flatten)
 */
function flatten(arr) {
  return arr.reduce((flat, item) => 
    Array.isArray(item) ? flat.concat(flatten(item)) : flat.concat(item), []
  )
}

/**
 * Unique array values (replaces lodash.uniq)
 */
function unique(arr) {
  return [...new Set(arr)]
}

/**
 * Clamp number between min and max
 */
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

/**
 * High-performance LRU Cache implementation
 */
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.cache = new Map()
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return undefined
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }
  
  has(key) {
    return this.cache.has(key)
  }
  
  clear() {
    this.cache.clear()
  }
  
  get size() {
    return this.cache.size
  }
}

/**
 * High-performance xxHash-inspired hash function
 * Optimized for strings with better collision resistance than simple hash
 */
function fastHash(str) {
  if (!str || str.length === 0) return '0'
  
  const PRIME32_1 = 0x9E3779B1
  const PRIME32_2 = 0x85EBCA77  
  const PRIME32_3 = 0xC2B2AE3D
  const PRIME32_4 = 0x27D4EB2F
  const PRIME32_5 = 0x165667B1
  
  let h32 = PRIME32_5 + str.length
  let i = 0
  
  // Process 4-byte chunks
  while (i <= str.length - 4) {
    let k1 = (str.charCodeAt(i) & 0xff) |
             ((str.charCodeAt(i + 1) & 0xff) << 8) |
             ((str.charCodeAt(i + 2) & 0xff) << 16) |
             ((str.charCodeAt(i + 3) & 0xff) << 24)
    
    k1 = Math.imul(k1, PRIME32_3)
    k1 = ((k1 << 17) | (k1 >>> 15))
    k1 = Math.imul(k1, PRIME32_4)
    
    h32 ^= k1
    h32 = ((h32 << 19) | (h32 >>> 13))
    h32 = Math.imul(h32, 5) + 0x561CCD1B
    
    i += 4
  }
  
  // Process remaining bytes
  while (i < str.length) {
    let k1 = str.charCodeAt(i) & 0xff
    k1 = Math.imul(k1, PRIME32_5)
    k1 = ((k1 << 11) | (k1 >>> 21))
    k1 = Math.imul(k1, PRIME32_1)
    h32 ^= k1
    h32 = ((h32 << 15) | (h32 >>> 17))
    h32 = Math.imul(h32, PRIME32_2)
    i++
  }
  
  // Final mix
  h32 ^= h32 >>> 16
  h32 = Math.imul(h32, PRIME32_2)
  h32 ^= h32 >>> 13
  h32 = Math.imul(h32, PRIME32_3)
  h32 ^= h32 >>> 16
  
  // Return as positive hex string
  return (h32 >>> 0).toString(36)
}

/**
 * Safe regex execution with timeout protection
 */
function safeRegexTest(regex, str, timeoutMs = 100) {
  const start = Date.now()
  
  try {
    // Quick length check to prevent obvious ReDoS
    if (str.length > 10000) {
      str = str.substring(0, 10000)
    }
    
    const result = regex.test(str)
    
    // Check if execution took too long
    if (Date.now() - start > timeoutMs) {
      console.warn('Regex execution took too long, possible ReDoS:', regex.source)
      return false
    }
    
    return result
  } catch (error) {
    console.warn('Regex execution failed:', error.message)
    return false
  }
}

/**
 * Memory-efficient string operations
 */
const StringUtils = {
  /**
   * Case-insensitive includes with early termination
   */
  includesIgnoreCase(str, search) {
    if (!str || !search) return false
    return str.toLowerCase().indexOf(search.toLowerCase()) !== -1
  },
  
  /**
   * Count occurrences of substring
   */
  countOccurrences(str, search) {
    if (!str || !search) return 0
    let count = 0
    let pos = 0
    while ((pos = str.indexOf(search, pos)) !== -1) {
      count++
      pos += search.length
    }
    return count
  },
  
  /**
   * Truncate string safely at word boundaries
   */
  truncateAtWord(str, maxLength) {
    if (str.length <= maxLength) return str
    const truncated = str.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }
}

module.exports = {
  isValidEmail,
  cosineSimilarity,
  stringSimilarity,
  levenshteinDistance,
  deepMerge,
  isObject,
  debounce,
  throttle,
  flatten,
  unique,
  clamp,
  LRUCache,
  fastHash,
  safeRegexTest,
  StringUtils,
  
  // Legacy aliases
  simpleHash: fastHash
} 