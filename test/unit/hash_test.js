new Test.Unit.Runner({
  testSet: function() {
    var h = $H({a: 'A'})

    this.assertEqual('B', h.set('b', 'B'));
    this.assertHashEqual({a: 'A', b: 'B'}, h);
    
    this.assertUndefined(h.set('c'));
    this.assertHashEqual({a: 'A', b: 'B', c: undefined}, h);
  },

  testGet: function() {
    var h = $H({ 'a': 'A' }), empty = $H({ }),
     properties = ['constructor', 'hasOwnProperty', 'isPrototypeOf',
       'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

    this.assertEqual('A', h.get('a'));
    this.assertUndefined(h.a);
    this.assertUndefined(empty.get('a'));

    // ensure Hash#get only returns the objects own properties
    properties.each(function(property) {
      this.assertUndefined(empty.get(property),
        'Returned the "' + property + '" property of its prototype.');
    }, this);
  },
  
  testUnset: function() {
    var hash = $H(Fixtures.many);
    this.assertEqual('B', hash.unset('b'));
    this.assertHashEqual({a:'A', c: 'C', d:'D#'}, hash);
    this.assertUndefined(hash.unset('z'));
    this.assertHashEqual({a:'A', c: 'C', d:'D#'}, hash);
    // not equivalent to Hash#remove
    this.assertEqual('A', hash.unset('a', 'c'));
    this.assertHashEqual({c: 'C', d:'D#'}, hash);
  },
  
  testToObject: function() {
    var hash = $H(Fixtures.many), object = hash.toObject();
    this.assertInstanceOf(Object, object);
    this.assertHashEqual(Fixtures.many, object);
    this.assertNotIdentical(Fixtures.many, object);
    hash.set('foo', 'bar');
    this.assertHashNotEqual(object, hash.toObject());
  },
  
  testConstruct: function() {
    var object = Object.clone(Fixtures.one);
    var h = new Hash(object), h2 = $H(object);
    this.assertInstanceOf(Hash, h);
    this.assertInstanceOf(Hash, h2);
    
    this.assertHashEqual({}, new Hash());
    this.assertHashEqual(object, h);
    this.assertHashEqual(object, h2);
    
    h.set('foo', 'bar');
    this.assertHashNotEqual(object, h);
    
    var clone = $H(h);
    this.assertInstanceOf(Hash, clone);
    this.assertHashEqual(h, clone);
    h.set('foo', 'foo');
    this.assertHashNotEqual(h, clone);
    this.assertIdentical($H, Hash.from);
  },

  testInclude: function() {
    this.assert($H(Fixtures.one).include('A#'));
    this.assert($H(Fixtures.many).include('A'));
    this.assert(!$H(Fixtures.many).include('Z'));
    this.assert(!$H().include('foo'));
  },

  testKeys: function() {
    this.assertEnumEqual([],               $H({}).keys());
    this.assertEnumEqual(['a'],            $H(Fixtures.one).keys());
    this.assertEnumEqual($w('a b c d'),    $H(Fixtures.many).keys().sort());
    this.assertEnumEqual($w('plus quad'),  $H(Fixtures.functions).keys().sort());
  },
  
  testValues: function() {
    this.assertEnumEqual([],             $H({}).values());
    this.assertEnumEqual(['A#'],         $H(Fixtures.one).values());
    this.assertEnumEqual($w('A B C D#'), $H(Fixtures.many).values().sort());
    this.assertEnumEqual($w('function function'),
      $H(Fixtures.functions).values().map(function(i){ return typeof i }));
    this.assertEqual(9, $H(Fixtures.functions).get('quad')(3));
    this.assertEqual(6, $H(Fixtures.functions).get('plus')(3));
  },

  testKeyOf: function() {
    this.assert('a', $H(Fixtures.one).keyOf('A#'));
    this.assert('a', $H(Fixtures.many).keyOf('A'));
    
    this.assertIdentical(-1, $H().keyOf('foo'));
    this.assertIdentical(-1, $H(Fixtures.many).keyOf('Z'));

    var hash = $H({ 'a':1, 'b':'2', 'c':1});
    this.assert(['a','c'].include(hash.keyOf(1)));
    this.assertIdentical(-1, hash.keyOf('1'));
  },

  testFilter: function() {
    this.assertHashEqual({ 'a':'A', 'b':'B' },
      $H(Fixtures.many).filter(function(value, key) {
        return /[ab]/.test(key);
      }));
  },

  testGrep: function() {
    // test empty pattern
    this.assertHashEqual(Fixtures.many, $H(Fixtures.many).grep(''));
    this.assertHashEqual(Fixtures.many, $H(Fixtures.many).grep(new RegExp('')));
    
    this.assert(/(ab|ba)/.test($H(Fixtures.many).grep(/[ab]/i).keys().join('')));
    this.assert(/(CCD#D#|D#D#CC)/.test($H(Fixtures.many).grep(/[cd]/i, function(v) {
      return v + v;
    }).values().join('')));
  },

  testMerge: function() {
    var h = $H(Fixtures.many);
    this.assertNotIdentical(h, h.merge());
    this.assertNotIdentical(h, h.merge({}));
    this.assertInstanceOf(Hash, h.merge());
    this.assertInstanceOf(Hash, h.merge({}));
    this.assertHashEqual(h, h.merge());
    this.assertHashEqual(h, h.merge({}));
    this.assertHashEqual(h, h.merge($H()));
    this.assertHashEqual({a:'A',  b:'B', c:'C', d:'D#', aaa:'AAA' }, h.merge({aaa: 'AAA'}));
    this.assertHashEqual({a:'A#', b:'B', c:'C', d:'D#' }, h.merge(Fixtures.one));
  },

  testPartition: function() {
    var result = $H(Fixtures.many).partition(function(value) {
      return /[AB]/.test(value);
    });

    this.assertEqual(2, result.length);
    this.assertHashEqual({ 'a':'A', 'b':'B' }, result[0]);
    this.assertHashEqual({ 'c':'C', 'd':'D#' }, result[1]);
  },

  testUpdate: function() {
    var h = $H(Fixtures.many);
    this.assertIdentical(h, h.update());
    this.assertIdentical(h, h.update({}));
    this.assertHashEqual(h, h.update());
    this.assertHashEqual(h, h.update({}));
    this.assertHashEqual(h, h.update($H()));
    this.assertHashEqual({a:'A',  b:'B', c:'C', d:'D#', aaa:'AAA' }, h.update({aaa: 'AAA'}));
    this.assertHashEqual({a:'A#', b:'B', c:'C', d:'D#', aaa:'AAA' }, h.update(Fixtures.one));
  },

  testReject: function() {
    this.assertHashEqual({ 'c':'C', 'd': 'D#' },
      $H(Fixtures.many).reject(function(value) {
        return !/[CD]/.test(value);
      }));
  },

  testToQueryString: function() {
    this.assertEqual('',                   $H({}).toQueryString());
    this.assertEqual('a%23=A',             $H({'a#': 'A'}).toQueryString());
    this.assertEqual('a=A%23',             $H(Fixtures.one).toQueryString());
    this.assertEqual('a=A&b=B&c=C&d=D%23', $H(Fixtures.many).toQueryString());
    this.assertEqual("a=b&c",              $H(Fixtures.value_undefined).toQueryString());
    this.assertEqual("a=b&c",              $H("a=b&c".toQueryParams()).toQueryString());
    this.assertEqual("a=b&c=",             $H(Fixtures.value_null).toQueryString());
    this.assertEqual("a=b&c=0",            $H(Fixtures.value_zero).toQueryString());
    this.assertEqual("color=r&color=g&color=b", $H(Fixtures.multiple).toQueryString());
    this.assertEqual("color=r&color=&color=g&color&color=0", $H(Fixtures.multiple_nil).toQueryString());
    this.assertEqual("color=&color",       $H(Fixtures.multiple_all_nil).toQueryString());
    this.assertEqual("",                   $H(Fixtures.multiple_empty).toQueryString());
    this.assertEqual("",                   $H({foo: {}, bar: {}}).toQueryString());
    this.assertEqual("stuff%5B%5D=%24&stuff%5B%5D=a&stuff%5B%5D=%3B", $H(Fixtures.multiple_special).toQueryString());
    this.assertHashEqual(Fixtures.multiple_special, $H(Fixtures.multiple_special).toQueryString().toQueryParams());
    this.assertIdentical(Object.toQueryString, Hash.toQueryString);
  },
  
  testInspect: function() {
    this.assertEqual('#<Hash:{}>',              $H({}).inspect());
    this.assertEqual("#<Hash:{'a': 'A#'}>",     $H(Fixtures.one).inspect());
    this.assertEqual("#<Hash:{'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D#'}>", $H(Fixtures.many).inspect());
  },

  testClone: function() {
    var h = $H(Fixtures.many);
    this.assertHashEqual(h, h.clone());
    this.assertInstanceOf(Hash, h.clone());
    this.assertNotIdentical(h, h.clone());
  },
  
  testToJSON: function() {
    this.assertEqual('{\"b\": [false, true], \"c\": {\"a\": \"hello!\"}}',
      $H({'b': [undefined, false, true, undefined], c: {a: 'hello!'}}).toJSON());
  },

  testZip: function() {
    var jq = $H({ 'name':'jquery', 'size':'18kb' }),
     proto = $H({ 'name':'prototype', 'size':'28kb' }),
     fuse  = $H({ 'name': 'fusejs', 'size': '29kb' });
 
    var result = jq.zip(proto, fuse);
    this.assertHashEqual({ 'name':['jquery', 'prototype', 'fusejs'], 'size':['18kb', '28kb', '29kb'] }, result);
    
    result = jq.zip(proto, fuse, function(values) {
      return values.join(', ');
    })
    this.assertHashEqual({ 'name':'jquery, prototype, fusejs', 'size':'18kb, 28kb, 29kb' }, result);
  },

  testAbilityToContainAnyKey: function() {
    var h = $H({ _each: 'E', map: 'M', keys: 'K', pluck: 'P', unset: 'U' });
    this.assertEnumEqual($w('_each keys map pluck unset'), h.keys().sort());
    this.assertEqual('U', h.unset('unset'));
    this.assertHashEqual({ _each: 'E', map: 'M', keys: 'K', pluck: 'P' }, h);
  },
  
  testHashToTemplateReplacements: function() {
    var template = new Template("#{a} #{b}"), hash = $H({ a: "hello", b: "world" });
    this.assertEqual("hello world", template.evaluate(hash.toObject()));
    this.assertEqual("hello world", template.evaluate(hash));
    this.assertEqual("hello", "#{a}".interpolate(hash));
  },
  
  testPreventIterationOverShadowedProperties: function() {
    // redundant now that object is systematically cloned.
    var FooMaker = function(value) {
      this.key = value;
    };
    FooMaker.prototype.key = 'foo';
    var foo = new FooMaker('bar');
    this.assertEqual("key=bar", new Hash(foo).toQueryString());
    this.assertEqual("key=bar", new Hash(new Hash(foo)).toQueryString());
  }
  
});