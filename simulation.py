import threading
import random
import time
from lru_cache import LRUCache

def worker(cache, thread_id, num_ops, max_key):
    for i in range(num_ops):
        key = random.randint(0, max_key)
        op = random.choice(['put', 'get'])

        if op == 'put':
            value = f"val-{thread_id}-{i}"
            cache.put(key, value)
            # print(f"Thread {thread_id}: put({key}, {value})")
        else:
            res = cache.get(key)
            # print(f"Thread {thread_id}: get({key}) -> {res}")

        # Small sleep to simulate workload and increase interleaving
        # time.sleep(0.0001)

def run_simulation():
    capacity = 10
    num_threads = 5
    ops_per_thread = 2000
    max_key = 20

    cache = LRUCache(capacity)
    threads = []

    print(f"Starting simulation with {num_threads} threads, {ops_per_thread} ops each...")
    start_time = time.time()

    for i in range(num_threads):
        t = threading.Thread(target=worker, args=(cache, i, ops_per_thread, max_key))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    end_time = time.time()
    print(f"Simulation finished in {end_time - start_time:.2f} seconds.")

    # Final checks
    print(f"Final cache size: {len(cache)}")
    assert len(cache) <= capacity, f"Cache size {len(cache)} exceeds capacity {capacity}"

    # Verify internal consistency
    # We can check if the linked list length matches the cache dictionary size
    with cache.lock:
        curr = cache.head.next
        count = 0
        while curr != cache.tail:
            count += 1
            assert curr.key in cache.cache, f"Node key {curr.key} not in cache dictionary"
            curr = curr.next
        assert count == len(cache.cache), f"Linked list size {count} != dictionary size {len(cache.cache)}"
        print("Internal consistency check passed (Linked list matches hash map).")

if __name__ == "__main__":
    run_simulation()
