[arrfunc](https://mp.weixin.qq.com/s/N0ahVkwVhDpnzGdZyC8jQg)
https://juejin.im/post/5c76972af265da2dc4538b64
### 快速搭建vuex文件

- 项目目录结构
.src
  -store
    - index.js
    - state.js
    - mutations.js
    - mutations-type.js
    - action.js
    - getters.js

```js
//index.js
import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
```

```js
//getters.js
export const singer = state => state.singer
```

```js
//action.js
```

```js
//mutations.js
import * as types from './mutation-type'

const mutations = {
  [types.SET_SINGER](state,singer){
    state.singer = singer
  }
}
export default mutations
```

```js
//mutations-type.js
export const SET_SINGER = 'SET_SINGER'
```

```js
//state.js
const state = {
  singer:{}
}

export default state
```

```js
//main.js
import Vue from 'vue'
import store from './store'
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
```