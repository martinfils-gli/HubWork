export class Node<K, V> {
  key: K | null;
  value: V | null;
  prev: Node<K, V> | null = null;
  next: Node<K, V> | null = null;

  constructor(key: K | null = null, value: V | null = null) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, Node<K, V>>;
  private head: Node<K, V>;
  private tail: Node<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node();
    this.tail = new Node();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private remove(node: Node<K, V>) {
    if (node.prev && node.next) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
  }

  private addToHead(node: Node<K, V>) {
    node.next = this.head.next;
    node.prev = this.head;
    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }

  get(key: K): V | null {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      this.remove(node);
      this.addToHead(node);
      return node.value;
    }
    return null;
  }

  put(key: K, value: V) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      this.remove(node);
      node.value = value;
      this.addToHead(node);
    } else {
      if (this.cache.size >= this.capacity) {
        const lruNode = this.tail.prev!;
        this.remove(lruNode);
        if (lruNode.key !== null) {
          this.cache.delete(lruNode.key);
        }
      }
      const newNode = new Node(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
    }
  }

  getEntries(): { key: K; value: V }[] {
    const entries: { key: K; value: V }[] = [];
    let curr = this.head.next;
    while (curr && curr !== this.tail) {
      if (curr.key !== null && curr.value !== null) {
        entries.push({ key: curr.key, value: curr.value });
      }
      curr = curr.next;
    }
    return entries;
  }

  getSize(): number {
    return this.cache.size;
  }

  getCapacity(): number {
    return this.capacity;
  }
}
