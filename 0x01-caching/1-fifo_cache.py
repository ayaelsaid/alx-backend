#!/usr/bin/env python3

"""
task-1: fifo_cache
"""

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    Class FIFOCache that inherits from BaseCaching
    """

    def __init__(self):
        """ Initialize the FIFO cache. """
        super().__init__()
        self.cache_data = {}
        self.order = []

    def put(self, key, item):
        """ Add an item in the cache. """
        if key is None or item is None:
            return

        if key in self.cache_data:
            # If key is already in the cache, just update its value
            self.cache_data[key] = item
        else:
            # Check if we need to remove the oldest item
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                oldest_key = self.order.pop(0)
                del self.cache_data[oldest_key]
                print(f"DISCARD: {oldest_key}")

            # Add the new item
            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """ Get an item by key. """
        return self.cache_data.get(key, None)
