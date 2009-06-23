  /*---------------------------- SELECTOR: PEPPY -----------------------------*/

  Fuse.addNS('Dom.Selector');

  (function() {
    this.match = function match(element, selector) {
      var item, i = 0,
       results = peppy.query(String(selector || ''), getDocument(element));
      while (item = results[i++])
        if (item === element) return true;
      return false;
    };

    this.select = (function() {
      var select = function select(selector, context) {
        return toList(peppy.query(String(selector || ''), context || Fuse._doc))
          .map(Element.extend);
      };

      if (Feature('ELEMENT_EXTENSIONS'))
        select = function select(selector, context) {
          return toList(peppy.query(String(selector || ''), context || Fuse._doc));
        };

      var toList = Fuse.List.fromNodeList;
      return select;
    })();

    // prevent JScript bug with named function expressions
    var match = null;
  }).call(Fuse.Dom.Selector);