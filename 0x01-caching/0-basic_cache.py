#!/usr/bin/env python3

"""task-0: basic_cache"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """Class BasicCache that inherits from BaseCaching."""

    def put(self, key, item):
        """Add an item to the dictionary `self.cache_data`."""
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """Return the value in `self.cache_data` linked to `key`."""
        if key is None:
            return None

        return self.cache_data.get(key, None)
