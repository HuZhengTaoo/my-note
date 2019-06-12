## 理解javascript中执行上下文和执行栈
https://juejin.im/post/5cfd9d30f265da1b94213d28?utm_source=gold_browser_extension
http://www.ruanyifeng.com/blog/2018/06/javascript-this.html
http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html

## 

> this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式

> 当一个函数被调用时，会创建一个活动记录(有时候也称为执行上下文),这个记录会包含函数(执行上下文)。这个记录会包含函数在那里被调用(调用栈)，函数的调用方式，传入的参数等信息。this就是这个记录的一个属性，会在函数执行的过程中用到

```js
//使用this
function identify(){
  return this.name.toUpperCase()
}

function speak(){
  var greeting = "Hello I'm " + identify.call(this)
  console.log(greeting)
}

var me = {
  name:'kiko'
}

var you = {
  name:'niko'
}

// identify.call(me)
// identify.call(you)

speak.call(me)
speak.call(you)

//不使用this
function identify(context){
  return context.name.toUpperCase()
}

function speak(context){
  var greeting = "Hello I'm " + identify(context)
  console.log(greeting)
}

var me = {
  name:'kiko'
}

var you = {
  name:'niko'
}

identify(me)
identify(you)

speak(me)
speak(you)
```
## this的两大误解

### 指向自身

> 很多人认为this理解为指向函数自身

```js
function foo(num){
  console.log('foo' + num)
  this.count++
}
foo.count =0
var i ;
for(i=0;i<10;i++){
  if(i>5){
    foo(i)
  }
}
console.log(foo.count) // 0

```

```js
function foo(num){
  console.log('foo'+num)
  data.count++
}
var data = {
  count:0
}
var i = 0
for(i=0;i<10;i++){
  if(i>5){
    foo(i)
  }
}
console.log(data.count) // 4
```

```js
function foo(){
  foo.count = 4 //foo指自己
}
setTimeout(function(){
  //匿名函数无法指向自己
},10)

```
```js
//避免了this的问题。并且完全依赖域变量foo的词法作用域
function foo(num){
  console.log('foo' + num)
  foo.count++
}
foo.count =0
var i ;
for(i=0;i<10;i++){
  if(i>5){
    foo(i)
  }
}
console.log(foo.count)

//
function foo(num){
  console.log('foo' + num)
  this.count++
}
foo.count = 0
var i = 0
for(i=0;i<10;i++){
  if(i>5){
    foo.call(foo,i)
  }
}
```

### 它的作用域

> this指向函数作用域 ❎

> this任何情况下都不指向函数的词法作用域

> 在js内部,作用域确实和对象类似，可见的标识符都是它的属性,作用域对象无法通过js代码范围，它存在js引擎内部

```js
function foo(){
  var a = 2
  this.bar()
}

function bar(){
  console.log(this.a)
}
foo( ) //ReferenceError : a is not defined
```

> 调用位置 ： 调用栈

> 调用位置：函数在代码中被调用的位置（而不是声明位置）

> 调用栈(就是为了达到当前执行位置所调用的所有函数)。我们关心的调用位置就在当前正在执行的函数前一个调用中。

```js
function baz(){
  //当前调用栈 : baz
  //当前调用位置是全局作用域
  console.log('baz' , this)
  bar() // <--- bar调用位置
}

function bar() {
  //当前调用栈是 : baz -> bar
  //调用位置是baz中
  console.log('bar',this)
  foo() // <-- foo调用位置
}

function foo(){
  // 当前调用栈是  bar -> bar -> foo
  // 调用位置是bar 中
  console.log('foo',this)
}
baz() // <-- baz调用位置
```
> 绑定规则

- 默认绑定
 - 独立函数调用
```js
function foo(){
  console.log(this.a)
}
var a = 2
foo() //2

// 严格模式
function foo(){
  "use strict"
  console.log(this.a)
}
var a = 2
foo() // TypeError : this is undefined

function foo(){
  console.log(this.a)
}
var a = 2
(function(){
  "use strict"
  foo() //2
})()
```
- 隐式绑定

> 隐式绑定规则会把函数调用中的this绑定到这个上下文对象。因为调用foo()时this被绑定到obj，
因此this.a和obj.a是一样的

```js
function foo(){
  console.log(this.a)
}
var obj = {
  a:2,
  foo:foo
}
obj.foo() //2

```
> 对象属性引用链中只有上一层或者最后层调用位置起作用

```js
function foo(){
  console.log(this.a)
}

var obj2 = {
  a:23,
  foo:foo
}
var obj1 = {
  a:2,
  obj2:obj2
}
obj1.obj2.foo() //23
```
```js
var obj2 = {
  b:23,
  foo:foo
}
function foo(){
  console.log(this.a)
}
var obj1 = {
  a:2,
  obj2:obj2
}
obj1.obj2.foo() //undefined

```
- 隐式丢失
 - this绑定到全局对象或者undefined 这取决了严格模式
```js
function foo(){
  console.log(this.a)
}
var obj = {
  a:2,
  foo:foo
}
var bar = obj.foo // 函数别名
var a = "opp"
bar() // "opp"
```

```js
function foo(){
  console.log(this.a)
}
function doFoo(fn){
  //fn 其实引用的是foo
  fn() // <-- 调用位置
}
var obj = {
  a:2,
  foo:foo
}
var a = 'opp'
doFoo(obj.foo) //'opp'
```

```js
function foo(){
  console.log(this.a)
}
var obj = {
  a:2,
  foo:foo
}
var a = 'opp'
setTimeout(obj.foo,100) 'opp'

```

```js
function setTimeout(fn,delay){
  fn() ;//<--调用位置
}
```

### 显示绑定

> 分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this间接(隐式)绑定到这个对象上

> 显示绑定：js绝大数函数都可以使用call(...)和apply(...)的方法。他们的第一个参数是给this准备的，接着在调用函数时将其绑定到this。因为你可以直接指定this的绑定对象

```js
function foo(){
  console.log(this.a)
}
var obj = {
  a:2
}
foo.call(obj)
```
> 如果你传入了一个原始值（字符串，布尔值，数字）,来当作this的绑定对象，这个原始值会被转化（new String(...),new Boolean(...),new Number()）.这个叫做’装箱‘

#### 硬绑定
```js
function foo(){
  console.log(this.a)
}
var obj = {
  a:2
}
var bar = function(){
  foo.call(obj)
}
setTimeout(bar , 100)
bar.call(window)
```
- 应用场景 创建一个包裹函数，负责接收参数并返回值
 - 方法一
```js
function foo(something){
  console.log(this.a,something)
  return this.a + something
}
var obj = {
  a : 2
}
var bar = function(){
  return foo.apply(obj,arguments)
}
var b = bar(3)
console.log(b)
```
 - 方法二
```js
function foo(something){
  console.log(this.a,something)
  return this.a + something
}
// 简单的辅助绑定函数
function bind(fn,obj){
  return function(){
    return fn.apply(obj,arguments)
  }
}
var obj ={
  a:2
}
var bar = bind(foo,obj)
var b = bar(3)
console.log(b)
```
> 由于硬绑定是一种非常常用的方式，所以es5提供了内置Function.prototype.bind
```js
function foo(something){
  console.log(this.a,something)
  return this.a + something
}
var obj = {
  a:2
}
var bar = foo.bind(obj)
var b = bar(3)
console.log(b)
```
> bind(...)会返回一个硬编码的新函数，他会把你指定的参数设置为this的上下文并调用原始函数

#### api调用的’上下文‘

> Many libraries' functions, and indeed many new built-in functions in the JavaScript language and host environment, provide an optional parameter, usually called "context", which is designed as a work-around for you not having to use bind(..) to ensure your callback function uses a particular this.

> Internally, these various functions almost certainly use explicit binding via call(..) or apply(..), saving you the trouble.

```js
function foo(el){
  console.log(el,this.id)
}
var obj = {
  id:'kiko'
}
//调用foo(...)时会把this绑定到obj
[1,2,3].forEach(foo,obj)
```
### new绑定

> 构造函数只是一些使用new操作符时被调用的函数，他们并不会属于某个类，也不会实例化一个类。
实际上他们甚至都不能说是一种特殊函数，他们只是被new操作符调用的普通函数

> 实际上不存在所谓的’构造函数‘只存在’构造调用‘

:::tip
new
(1)创建（或者构造）一个全新的对象
(2)这个对象会被执行[[prototype]]链接
(3)这个新对象会绑定到函数调用的this
(4)如果函数没有返回其他对象，那么new表达式中的函数会自动返回这个新对象
:::

### 优先级

> Function.prototype.bind(...)会创建一个新的包装对象，这个函数会忽略它当前的this绑定(无论绑定的对象是什么)，并把我们提供的对象绑定到this上面

```js
function foo(something){
  this.a = something
}
var obj1 = {}
var bar = foo.bind(obj1)
bar(2)
// obj1 => {a:2}
console.log(obj1.a) //2

var bar = new bar(3)
console.log(obj1.a) //2
console.log(baz.a) //3
//foo{a:3}
```
- MDN bind(...)

```js
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError( "Function.prototype.bind - what " +
				"is trying to be bound is not callable"
			);
		}

		var aArgs = Array.prototype.slice.call( arguments, 1 ),
			fToBind = this,
			fNOP = function(){},
			fBound = function(){
				return fToBind.apply(
					(
						this instanceof fNOP &&
						oThis ? this : oThis
					),
					aArgs.concat( Array.prototype.slice.call( arguments ) )
				);
			}
		;

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}
```
> 只所以在new中使用硬绑定函数，主要目的是预先设置函数的一些参数，这样在使用new进行初始化就只传入其余参数。bind(...)的功能之一就是可以把除了第一个参数之外的参数传递给下层的函数(柯里化(部分应用))

```js
function foo(p1,p2){
  this.val = p1 + p2
}
var bar = foo.bind(null,'p1')
var baz = new bar('p2')
baz.val // p1p2
```
- 判断this
 - 1 函数是否在new中调用(new绑定)?如果是的话this绑定的是新创建的对象
 - 2 函数是否通过call，apply(显示绑定)或者硬绑定调用，如果是，this绑定的是指定独享
  var bar = foo.call(obj2)
 - 3 函数是否在某个上下文对象中调用(隐式绑定)?如果是，this绑定的就是那个上下文对象var bar = obj1.foo()
 - 4 如果都不是，使用默认绑定，如果在严格模式，就绑定到undefined。否则绑定到全局对象
 var bar = foo()

### 绑定之外

#### 被忽略的this
```js
function foo(){
  console.log(this.a)
}
var a = 2
foo.call(null) //2

```
```js
function foo(a,b){
  console.log("a"+a+"b"+b)
}
foo.apply(null,[2,3]) // a：2，b:3
var bar = foo.bind(null,2)
bar(3) // a：2，b:3
```
> 更加安全的this
```js
function foo(a,b){
  console.log("a"+a+"b"+b)
}
// 我们的DMZ空对象
var ø = Object.create(null)
foo.apply(ø,[2,3])
//把数组展开成参数
var bar = foo.bind(ø,2)
bar(3) //a:2,b:3
```
#### 间接引用
```js
function foo() {
	console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2

```
> p.foo = o.foo return foo(){console.log(this.a)}

> 赋值表达式p.foo = o.foo的返回值是目标函数的引用，因此调用的位置是foo()而不是p.foo()或者o.foo(),而是默认绑定
严格模式是undefined

#### 软绑定
```js

```