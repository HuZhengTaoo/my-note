### Arguments 

- 只能在函数中去使用

```js
Arguments = {
  0:1,
  1:2,
  2:3,
  length:3,
  ...
}  // 是类数组
Array.from(arguments)  ===  [...arguments]  //转变成数组
arguments.callee
arguments.caller  //严格模式移除
arguments.length  
arguments[@@interator]  //表示可迭代，严格模式移除
```
- 函数的参数转成数组

```js
//前提是要在函数里面
var args = Array.prototype.slice.call(arguments)
var args = [].slice.call(arguments)
var toArray = function() {
    try {
        return Array.prototype.slice.call(arguments);
    } catch(e) {
        var arr = [];
        for (var i = 0,
        len = arguments.length; i < len; i++) {
            //arr.push(s[i]);
            arr[i] = arguments[i]; //据说这样比push快
        }
        return arr;
    }
}
```

### call,bind,apply

- call,apply是立即执行的函数

```js
//能将具有length属性的对象转变成数组
Array.prototype.slice.call(arguments) 

```

### Array中api

| 不修改 | 修改 |
|---|---|
|concat|pop|
|every|push|
|some|shift|
|filter |unshift |
|indexOf|reverse |
|join |sort |
|tostring |splice |
|map | |
|slice | |
|valueOf | |
|lastIndexOf | |

### Array 原型上的方法
- from
- isArray
- length
- name
- of
- prototype 
- arguments
- constructor