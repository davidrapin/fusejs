<%= include 'HEADER' %>
(function(global) {

  // private vars
  var DOCUMENT_FRAGMENT_NODE, DOCUMENT_NODE, ELEMENT_NODE, Fuse, Bug, Class,
   Data, Document, Element, Enumerable, Feature, Form, Func, Obj, Node, NodeList,
   RawList, $break, _extend, addListMethods, bind, capitalize, clone, concatList,
   defer, eachKey, emptyFunction, escapeRegExpChars, expando,fromElement,
   getDocument, getNodeName, getWindow, hasKey, inspect, isArray, isElement,
   isEmpty, isHash, isHostObject, isFunction, isNumber, isPrimitive, isRegExp,
   isSameOrigin, isString, isUndefined, K, nil, prependList, returnOffset, slice,
   toInteger, toString, undef, userAgent;

  Fuse =
  global.Fuse = function Fuse() { };

  Fuse._body  =
  Fuse._div   =
  Fuse._doc   =
  Fuse._docEl =
  Fuse._info  =
  Fuse._root  =
  Fuse._scrollEl = null;

  Fuse.debug   = false;
  Fuse.version = '<%= FUSEJS_VERSION %>';

  /*--------------------------------------------------------------------------*/

  // Host objects have a range of typeof values. For example:
  // document.createElement('div').offsetParent -> unknown
  // document.createElement -> object
  isHostObject = (function() {
    var HOST_TYPES = { 'function': 1, 'object': 1, 'unknown': 1 };
    return function(object, property) {
      return !!HOST_TYPES[typeof object[property]];
    };
  })();

  $break =
  Fuse.$break = function $break() { };

  emptyFunction =
  Fuse.emptyFunction = function emptyFunction() { };

  K =
  Fuse.K = function K(x) { return x };

  concatList = function(list, otherList) {
    var pad = list.length, length = otherList.length;
    while (length--) list[pad + length] = otherList[length];
    return list;
  };

  // Allow a pre-sugared array to be passed
  prependList = function(list, value, results) {
    (results = results || [])[0] = value;
    var length = list.length;
    while (length--) results[1 + length] = list[length];
    return results;
  };

  escapeRegExpChars = (function() {
    var matchSpecialChars = /([.*+?^=!:${}()|[\]\/\\])/g;
    return function(string) {
      return String(string).replace(matchSpecialChars, '\\$1');
    };
  })();

  // ECMA-5 9.4 ToInteger implementation
  toInteger = (function() {
    var abs = Math.abs, floor = Math.floor,
     maxBitwiseNumber = Math.pow(2, 31);

    return function(object) {
      var number = +object; // fast coerce to number
      if (number == 0 || !isFinite(number)) return number || 0;

      // avoid issues with large numbers against bitwise operators
      return number < maxBitwiseNumber
        ? number | 0
        : (number < 0 ? -1 : 1) * floor(abs(number));
    };
  })();

  // global.document.createDocumentFragment() nodeType
  DOCUMENT_FRAGMENT_NODE = 11;

  // global.document nodeType
  DOCUMENT_NODE = 9;

  // element nodeType
  ELEMENT_NODE = 1;

  // a unqiue 15 char id used throughout Fuse
  expando = '_fuse' + String(+new Date).slice(0, 10);

  // helps minify nullifying the JScript function declarations
  nil = null;

  // a quick way to copy an array slice.call(array, 0)
  slice = global.Array.prototype.slice;

  // used to access the an object's internal [[Class]] property
  toString = global.Object.prototype.toString;

  // used for some required browser sniffing
  userAgent = global.navigator && navigator.userAgent || '';

  /*--------------------------------------------------------------------------*/

  (function() {

    function getNS(path) {
      var key, i = 0, keys = path.split('.'), object = this;
      while (key = keys[i++])
        if (!(object = object[key])) return false;
      return object;
    }

    function addNS(path) {
      var Klass, Parent, key, i = 0,
       object     = this,
       keys       = path.split('.'),
       length     = keys.length,
       properties = slice.call(arguments, 1);

      if (typeof properties[0] === 'function')
        Parent = properties.shift();

      while (key = keys[i++]) {
        if (!object[key]) {
          if (i === length) {
            if (!hasKey(properties, 'constructor')) properties.constructor = key;
            Klass = Class(Parent || object, properties);
          }
          else Klass = Class(object, { 'constructor': key });
          object = object[key] = new Klass;
        }
        else object = object[key];
      }
      return object;
    }

    function updateSubClassGenerics(object) {
      var subclass, subclasses = object.subclasses || [], i = 0;
      while (subclass = subclasses[i++]) {
        subclass.updateGenerics && subclass.updateGenerics();
        updateSubClassGenerics(subclass);
      }
    }

    function updateGenerics(path, deep) {
      var paths, object, i = 0;
      if (isString(paths)) paths = [paths];
      if (!isArray(paths)) deep  = path;
      if (!paths) paths = ['Array', 'Date', 'Number', 'Object', 'RegExp', 'String', 'Dom.Node']; 

      while (path = paths[i++]) {
        object = isString(path) ? Fuse.getNS(path) : path;
        if (object) {
          object.updateGenerics && object.updateGenerics();
          deep && updateSubClassGenerics(object);
        }
      }
    }

    Fuse.getNS =
    Fuse.prototype.getNS = getNS;

    Fuse.addNS = 
    Fuse.prototype.addNS = addNS;

    Fuse.updateGenerics  = updateGenerics;
  })();

<%= include(
   'env.js',
   'lang/features.js',
   'lang/fusebox.js',

   'lang/object.js',
   'lang/class.js',
   'lang/console.js',

   'lang/function.js',
   'lang/enumerable.js',
   'lang/array.js',
   'lang/number.js',
   'lang/regexp.js',
   'lang/string.js',

   'lang/hash.js',
   'lang/range.js',
   'lang/template.js',
   'lang/timer.js',

   'dom/dom.js',
   'dom/features.js',
   'dom/node.js',
   'dom/document.js',

   'dom/element/element.js',
   'dom/element/attribute.js',
   'dom/element/style.js',
   'dom/element/position.js',

   'dom/form/field.js',
   'dom/form/form.js',

   'lang/grep.js',
   'lang/inspect.js',
   'lang/json.js',

   'dom/raw-list.js',
   'dom/node-list.js',
   'dom/selector/selector.js',
   'dom/selector/nwmatcher.js',
   'dom/element/traversal.js',

   'dom/event/event.js',
   'dom/event/dom-loaded.js',

   'ajax/ajax.js',
   'ajax/responders.js',
   'ajax/base.js',
   'ajax/request.js',
   'ajax/updater.js',
   'ajax/timed-updater.js') %>
  /*--------------------------------------------------------------------------*/

  // update native generics and element methods
  Fuse.updateGenerics(true);

  if (global.Event && global.Event.Methods)
    Event.addMethods();
})(this);
