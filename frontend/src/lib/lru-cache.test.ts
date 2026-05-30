import { describe, it, expect, beforeEach } from 'vitest'
import { LRUCache } from './lru-cache'

describe('LRUCache', () => {
  let cache: LRUCache<string, string>

  beforeEach(() => {
    cache = new LRUCache<string, string>(2)
  })

  it('should store and retrieve values', () => {
    cache.put('a', '1')
    expect(cache.get('a')).toBe('1')
  })

  it('should evict least recently used items', () => {
    cache.put('a', '1')
    cache.put('b', '2')
    cache.put('c', '3') // evicts 'a'
    expect(cache.get('a')).toBe(null)
    expect(cache.get('b')).toBe('2')
    expect(cache.get('c')).toBe('3')
  })

  it('should update order on get', () => {
    cache.put('a', '1')
    cache.put('b', '2')
    cache.get('a') // 'a' is now MRU
    cache.put('c', '3') // evicts 'b'
    expect(cache.get('b')).toBe(null)
    expect(cache.get('a')).toBe('1')
  })

  it('should return correct entries in order', () => {
    cache.put('a', '1')
    cache.put('b', '2')
    const entries = cache.getEntries()
    expect(entries[0].key).toBe('b') // MRU
    expect(entries[1].key).toBe('a') // LRU
  })
})
