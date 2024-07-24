#!/usr/bin/env python3

"""task-0: basic_cache"""


from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """class BasicCache that inherits from BaseCaching"""

    def put(self, key, item):
        """add item to the dictionary
        `self.cache_data` the
        """
        if key is None or item is None:
            return
    
        self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
        """
        if key is None:
            return None

        if key not in self.cache_data:
            return None

        return self.cache_data.get(key)
