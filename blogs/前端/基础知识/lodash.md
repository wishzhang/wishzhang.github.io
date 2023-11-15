---
title: lodash
date: 2023-11-14
tags: 

categories:

- 前端
---

看来还是比较少处理复杂的数据，一直以来用ES6的新增API处理大部分简单的数据，但偶尔会遇到一些比较复杂情况，这时往往自己绞尽脑汁去写一堆代码完成任务，殊不知已经有了现成的工具函数可以拿来用，现在gpt出来了更甚了。使用lodash比较频繁的API是防抖节流、深拷贝，很少用其它的API了，以为ES6大部分能替代了。但现在发现lodash是有很多实用的API是ES6没有的，如果能够熟练使用lodash对于复杂数据的处理就不在话下了。

```js
_.zip(['a', 'b'], [1, 2], [true, false]);
// => [['a', 1, true], ['b', 2, false]]
```

```js
_.zipObject(['a', 'b'], [1, 2]);
// => { 'a': 1, 'b': 2 }
```

```js
_.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
  return a + b + c;
});
// => [111, 222]
```

```js
_.countBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': 1, '6': 2 }
 
// The `_.property` iteratee shorthand.
_.countBy(['one', 'two', 'three'], 'length');
// => { '3': 2, '5': 1 }

let str = _.countBy([
  {name: 'one'}, 
  {name: 'one'}, 
  {name: 'two'}
], (el)=>el.name);
// => {one: 2, two: 1}
```

```js
const arr1 = [0,[[7,8],9],[1,2,3]];
console.log(arr1.flat(Infinity));
// expected output: Array [0, 7, 8, 9, 1, 2, 3]
```

```js
const arr = [1, 2, 3, 4];

arr.flatMap((x) => [x, x * 2]);
// 等价于
const n = arr.length;
const acc = new Array(n * 2);
for (let i = 0; i < n; i++) {
  const x = arr[i];
  acc[i * 2] = x;
  acc[i * 2 + 1] = x * 2;
}
// [1, 2, 2, 4, 3, 6, 4, 8]
```

```js
_.groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }
 
// The `_.property` iteratee shorthand.
_.groupBy(['one', 'two', 'three'], 'length');
// => { '3': ['one', 'two'], '5': ['three'] }
```

```js
var array = [
  { 'dir': 'left', 'code': 97 },
  { 'dir': 'right', 'code': 100 }
];
 
_.keyBy(array, 'dir');
// => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
```

```js
var users = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 34 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 36 }
];
 
// Sort by `user` in ascending order and by `age` in descending order.
_.orderBy(users, ['user', 'age'], ['asc', 'desc']);
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]

var users = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 36 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 34 }
];
 
_.sortBy(users, [function(o) { return o.user; }]);
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 
_.sortBy(users, ['user', 'age']);
// => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
都是稳定排序
sortBy只能按照升序排序，而orderBy可以指定升序或降序12。
sortBy返回的是一个新的数组，不会改变原始的集合，而orderBy也是返回一个新的数组，但是会改变原始的集合3。
```

```js
var users = [
  { 'user': 'barney',  'age': 36, 'active': false },
  { 'user': 'fred',    'age': 40, 'active': true },
  { 'user': 'pebbles', 'age': 1,  'active': false }
];
 
let r = _.partition(users, function(o) { return o.active; });
console.log(r)
[
[{ 'user': 'fred',    'age': 40, 'active': true },]
  [{ 'user': 'barney',  'age': 36, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': false }]
]
```

```js
_.sample([1, 2, 3, 4]);
// => 2

_.sampleSize([1, 2, 3], 2);
// => [3, 1]
 
_.sampleSize([1, 2, 3], 4);
// => [2, 3, 1]
```

```js
_.shuffle([1, 2, 3, 4]);
// => [4, 1, 3, 2]
```

```js
jQuery(element).on('click', _.before(5, addContactToList));
// => Allows adding up to 4 contacts to the list.
```

```js
var saves = ['profile', 'settings'];
 
var done = _.after(saves.length, function() {
  console.log('done saving!');
});
 
_.forEach(saves, function(type) {
  asyncSave({ 'type': type, 'complete': done });
});
// => Logs 'done saving!' after the two async saves have completed.
```

```js
var initialize = _.once(createApplication);
initialize();
initialize();
// => `createApplication` is invoked once
```

```js
var object = { 'a': 1 };
var other = { 'a': 1 };
 
_.eq(object, object);
// => true
 
_.eq(object, other);
// => false
 
_.eq('a', 'a');
// => true
 
_.eq('a', Object('a'));
// => false
 
_.eq(NaN, NaN);
// => true

NaN===NaN
// => false
```

```js
_.isArrayLike([1, 2, 3]);
// => true
 
_.isArrayLike(document.body.children);
// => true
 
_.isArrayLike('abc');
// => true
 
_.isArrayLike(_.noop);
// => false

Array.isArray()
```

```js
_.isArrayLikeObject([1, 2, 3]);
// => true
 
_.isArrayLikeObject(document.body.children);
// => true
 
_.isArrayLikeObject('abc');
// => false
 
_.isArrayLikeObject(_.noop);
// => false
```

```js
_.isEmpty(null);
// => true
 
_.isEmpty(true);
// => true
 
_.isEmpty(1);
// => true
 
_.isEmpty([1, 2, 3]);
// => false
 
_.isEmpty({ 'a': 1 });
// => false

_.isEmpty({})
// => true
```

```js
var object = { 'a': 1 };
var other = { 'a': 1 };
 
_.isEqual(object, other);
// => true
 
object === other;
// => false
```

```js
function isGreeting(value) {
  return /^h(?:i|ello)$/.test(value);
}
 
function customizer(objValue, othValue) {
  if (isGreeting(objValue) && isGreeting(othValue)) {
    return true;
  }
}
 
var array = ['hello', 'goodbye'];
var other = ['hi', 'goodbye'];
 
_.isEqualWith(array, other, customizer);
// => true
```

```js
_.isNil(null);
// => true
 
_.isNil(void 0);
// => true
 
_.isNil(NaN);
// => false
```

```js
function Foo() {
  this.a = 1;
}
 
_.isPlainObject(new Foo);
// => false
 
_.isPlainObject([1, 2, 3]);
// => false

_.isPlainObject(null);
// => false

_.isPlainObject({ 'x': 0, 'y': 0 });
// => true
 
_.isPlainObject(Object.create(null));
// => true

_.isPlainObject(new Object());
// => true
```

```js
_.mean([4, 2, 8, 6]);
// => 5

var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 
_.meanBy(objects, function(o) { return o.n; });
// => 5
```

```js
var objects = [{ 'n': 1 }, { 'n': 2 }];
 
_.minBy(objects, function(o) { return o.n; });
```

```js
_.sum([4, 2, 8, 6]);
// => 20

var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 
_.sumBy(objects, function(o) { return o.n; });
// => 20
```

```js
_.random(0, 5);
// => an integer between 0 and 5
 
_.random(5);
// => also an integer between 0 and 5
 
_.random(5, true);
// => a floating-point number between 0 and 5
 
_.random(1.2, 5.2);
// => a floating-point number between 1.2 and 5.2
```

```js
var object = { 'a': 1, 'b': 2, 'c': 1 };
 
_.invert(object);
// => { '1': 'c', '2': 'b' }
```

```js
var object = { 'a': 1, 'b': 2, 'c': 1 };
 
_.invertBy(object);
// => { '1': ['a', 'c'], '2': ['b'] }
```

```js
var object = {
  'a': [{ 'b': 2 }, { 'd': 4 }]
};
 
var other = {
  'a': [{ 'c': 3 }, { 'e': 5 }]
};
 
_.merge(object, other);
// => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
 
var object = { 'a': [1], 'b': [2] };
var other = { 'a': [3], 'b': [4] };
 
_.mergeWith(object, other, customizer);
// => { 'a': [1, 3], 'b': [2, 4] }
```

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };
 
_.omit(object, ['a', 'c']);
// => { 'b': '2' }

var object = { 'a': 1, 'b': '2', 'c': 3 };
 
_.omitBy(object, _.isNumber);
// => { 'b': '2' }

var object = { 'a': 1, 'b': '2', 'c': 3 };
 
_.pick(object, ['a', 'c']);
// => { 'a': 1, 'c': 3 }

var object = { 'a': 1, 'b': '2', 'c': 3 };
 
_.pickBy(object, _.isNumber);
// => { 'a': 1, 'c': 3 }
```

```js
function Foo() {
  this.a = 1;
  this.b = 2;
}
 
Foo.prototype.c = 3;
 
_.toPairs(new Foo);
// => [['a', 1], ['b', 2]] (iteration order is not guaranteed)

function Foo() {
  this.a = 1;
  this.b = 2;
}
 
Foo.prototype.c = 3;
 
_.toPairsIn(new Foo);
// => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
```

```js
_.camelCase('Foo Bar');
// => 'fooBar'

_.camelCase('FooBar');
// => 'fooBar'

_.camelCase('foo-bar');
// => 'fooBar'
 
_.camelCase('--foo-bar--');
// => 'fooBar'
 
_.camelCase('__FOO_BAR__');
// => 'fooBar'
```

```js
_.kebabCase('Foo Bar');
// => 'foo-bar'

_.kebabCase('FooBar')
// => 'foo-bar'

_.kebabCase('foo-bar')
// => 'foo-bar'
 
_.kebabCase('fooBar');
// => 'foo-bar'
 
_.kebabCase('__FOO_BAR__');
// => 'foo-bar'
```





