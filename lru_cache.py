import threading

class Node:
    def __init__(self, key=None, value=None):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> Node
        self.head = Node()  # Dummy head
        self.tail = Node()  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self.lock = threading.Lock()

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_head(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                self._remove(node)
                self._add_to_head(node)
                return node.value
            return -1

    def put(self, key, value):
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                self._remove(node)
                node.value = value
                self._add_to_head(node)
            else:
                if len(self.cache) >= self.capacity:
                    # Remove from tail
                    lru_node = self.tail.prev
                    self._remove(lru_node)
                    del self.cache[lru_node.key]

                new_node = Node(key, value)
                self.cache[key] = new_node
                self._add_to_head(new_node)

    def __len__(self):
        with self.lock:
            return len(self.cache)
