#!/usr/bin/env python3

'''Task3: lru_cache
'''


from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    class LRUCache that inherits from BaseCaching
    """

    def __init__(self):
        """ Initialize the LRU cache
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.order.remove(key)
            self.order.append(key)
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                lru_key = self.order.pop(0)
                del self.cache_data[lru_key]
                print(f"DISCARD: {lru_key}")

            self.order.append(key)

        self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
        """
        if key is None:
            return None

        if key not in self.cache_data:
            return None

        self.order.remove(key)
        self.order.append(key)
        return self.cache_data.get(key)
