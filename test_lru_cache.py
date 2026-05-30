import unittest
from lru_cache import LRUCache

class TestLRUCache(unittest.TestCase):
    def test_basic_ops(self):
        cache = LRUCache(2)
        cache.put(1, 1)
        cache.put(2, 2)
        self.assertEqual(cache.get(1), 1)
        cache.put(3, 3)    # evicts key 2
        self.assertEqual(cache.get(2), -1)
        cache.put(4, 4)    # evicts key 1
        self.assertEqual(cache.get(1), -1)
        self.assertEqual(cache.get(3), 3)
        self.assertEqual(cache.get(4), 4)

    def test_update_value(self):
        cache = LRUCache(2)
        cache.put(1, 1)
        cache.put(1, 10)
        self.assertEqual(cache.get(1), 10)
        cache.put(2, 2)
        cache.put(3, 3)    # evicts key 1 (least recently used)
        self.assertEqual(cache.get(1), -1)

    def test_get_updates_lru(self):
        cache = LRUCache(2)
        cache.put(1, 1)
        cache.put(2, 2)
        cache.get(1)       # 1 becomes most recent
        cache.put(3, 3)    # evicts key 2
        self.assertEqual(cache.get(2), -1)
        self.assertEqual(cache.get(1), 1)

if __name__ == '__main__':
    unittest.main()
