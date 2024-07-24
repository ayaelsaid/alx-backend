#!/usr/bin/env python3

"""
task5: lfu_cache
"""

from base_caching import BaseCaching
from collections import defaultdict, OrderedDict


class LFUCache(BaseCaching):
    """
    Class LFUCache that inherits from BaseCaching and implements
    LFU caching.
    """

    def __init__(self):
        """Initialize the LFU cache."""
        super().__init__()
        self.cache_data = {}
        self.freq = defaultdict(int)
        self.order = defaultdict(OrderedDict)

    def __reorder_items(self, key):
        """Reorders the items based on frequency."""
        freq = self.freq[key]
        self.order[freq].pop(key)
        self.order[freq + 1][key] = None

    def put(self, key, item):
        """Add an item to the cache."""
        if key is None or item is None:
            return

        if key in self.cache_data:
            # Update existing item frequency
            self.__reorder_items(key)
            self.freq[key] += 1
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                min_freq = min(self.freq.values())
                lfu_keys = list(self.order[min_freq].keys())
                if lfu_keys:
                    lru_key = lfu_keys[0]
                    self.order[min_freq].pop(lru_key)
                    del self.cache_data[lru_key]
                    del self.freq[lru_key]
                    print(f"DISCARD: {lru_key}")

            self.cache_data[key] = item
            self.freq[key] = 1
            self.order[1][key] = None 

    def get(self, key):
        """Get an item by key."""
        if key is None or key not in self.cache_data:
            return None

        # Update the item's frequency
        self.__reorder_items(key)
        self.freq[key] += 1

        return self.cache_data[key]
