#!/usr/bin/env python3

"""
task2: lifo_cache
"""


from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    class LIFOCache that inherits from BaseCaching
    """

    def __init__(self):
        """ Initialize the LIFO cache
        """
        super().__init__()
        self.order = []  # Keep track of the order of keys

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        if key not in self.cache_data and len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            last_key = self.order.pop()  # Remove the last item added
            del self.cache_data[last_key]
            print(f"DISCARD: {last_key}")

        if key not in self.cache_data:
            self.order.append(key)

        self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
