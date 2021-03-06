  /*------------------------------- LANG: GREP -------------------------------*/

  (function() {
    fuse.Array.plugin.grep = (function() {
      function grep(pattern, callback, thisArg) {
        if (this == null) throw new TypeError;
        if (toArray && (!pattern || pattern == '' || isRegExp(pattern) &&
           !pattern.source)) return toArray.call(this);

        callback = callback || K;
        var item, i = 0, results = fuse.Array(), object = Object(this),
         length = object.length >>> 0;

        if (isString(pattern))
          pattern = new RegExp(escapeRegExpChars(pattern));

        for ( ; i < length; i++)
          if (i in object && pattern.test(object[i]))
            results.push(callback.call(thisArg, object[i], i, object));
        return results;
      }

      var toArray = fuse.Array.plugin.toArray;
      return grep;
    })();

    if (Enumerable)
      Enumerable.grep = function grep(pattern, callback, thisArg) {
        if (!pattern || pattern == '' || isRegExp(pattern) &&
           !pattern.source) return this.toArray();

        callback = callback || K;
        var results = fuse.Array();
        if (isString(pattern))
          pattern = new RegExp(escapeRegExpChars(pattern));

        this._each(function(value, index, iterable) {
          if (pattern.test(value))
            results.push(callback.call(thisArg, value, index, iterable));
        });
        return results;
      };

    if (fuse.Hash)
      fuse.Hash.plugin.grep = function grep(pattern, callback, thisArg) {
        if (!pattern || pattern == '' || isRegExp(pattern) &&
           !pattern.source) return this.clone();

        callback = callback || K;
        var key, pair, value, i = 0, pairs = this._pairs, result = new $H();
        if (isString(pattern))
          pattern = new RegExp(escapeRegExpChars(pattern));

        while (pair = pairs[i++]) {
          if (pattern.test(value = pair[1]))
            result.set(key = pair[0], callback.call(thisArg, value, key, this));
        }
        return result;
      };

    // prevent JScript bug with named function expressions
    var grep = nil;
  })();
