
JSONP以前研究过，最近又有点忘了，写篇本文mark一下，旨在理解记住JSONP的原理及其实现。代码实现用到es6语法，使用promise来封装JSONP方法，本地测试用的自己node搭的服务器,具体代码就不贴了。
一句话阐述下JSONP原理：动态生成一个JavaScript标签，其src由接口url、请求参数、callback函数名拼接而成，利用js标签没有跨域限制的特性实现跨域请求。

有几点需要注意：
- 1.callback函数要绑定在window对象上
- 2.服务端返回数据有特定格式要求：callback函数名+'('+JSON.stringify(返回数据) +')'
- 3.不支持post，因为js标签本身就是一个get请求
具体代码如下，最后一段是调用函数的示例，这个函数将返回一个promise对象，获取到数据时状态为resolve

 1初始化url，callbackname，data拼接
- 2创建script
- 3.window函数
- 4script添加到dom中

```js
//https://www.jianshu.com/p/43b48648c730
const jsonp1 = function (url ,data){
  return new Promise((resolve,reject)=>{
    let dataString = url.indexOf('?') === -1 ? '?':'&'
    let callbackName = `jsonpCB_${Date.now()}`
    url += `${dataString}callback=${callbackName}`
    if(data){
      for(let k in data){
        url += `&{k}=${data[k]}`
      }
    }
    let script = document.createElement('script')
    script.src = url
    window[callbackName] = result =>{
      delete window[callbackName]
      document.body.removeChild(script)
      if(result){
        resolve(result)
      }else{
        reject('没有返回数据')
      }
    }
    script.addEventListener('error',()=>{
      delete window[callbackName]
      document.removeChild(script)
      reject('JavaScript资源加载失败')
    },false)
    document.body.appendChild(script)
  })
}
  jsonp1('xxx',{a:1,b:'xixi'})
    .then(result => { console.log(result) })
    .catch(err => { console.log(err)} )
//jsonp callback形式
const jsonp2 = function(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data) {
    success && success(data)
  }
  document.body.appendChild(script)
}
jsonp2('http://xxx', 'callback', function(value) {
  console.log(value)
})


```