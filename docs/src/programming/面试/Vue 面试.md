# vue 面经

## 1. Vue2 / Vue3 生命周期各阶段用途

> Vue2 选项式、Vue3 组合式对照，直接记业务常用场景

#### Vue2 选项式 API

#### 🔹创建阶段：实例初始化，**DOM 还没生成**

1. **beforeCreate**

- 实例刚初始化，data、methods 还没初始化，拿不到`this.xxx`数据
- 几乎不用，极少场景做简单配置初始化

1. **created ✨高频**

- data、methods 已经初始化完成，可以访问`this.数据`、调用方法
- **DOM 还不存在，$el 拿不到，不能操作 dom**
- 常用：**接口请求初始化数据**、初始化数据、处理 computed/watch、给 data 赋值

------

#### 🔹挂载阶段：DOM 创建渲染，页面显示出来

1. **beforeMount**

- 模板编译完成，虚拟 DOM 生成，**真实 DOM 还没挂载到页面**
- $el 已经有了，但页面上还没渲染出来
- 很少用，可以修改模板数据，不会触发额外更新

1. **mounted ✨高频**

- **真实 DOM 已经渲染挂载完毕，可以操作 DOM**
- 常用：获取 DOM 元素、$ref、初始化第三方 DOM 插件（echarts、地图）、也可以发接口；页面已经可见

------

#### 🔹更新阶段：响应式数据变化 → DOM 重新渲染

1. **beforeUpdate**

- 数据改变，虚拟 DOM 开始重新 diff，**旧 DOM 还没更新**
- 可以获取更新前的 DOM 状态
- 很少业务使用

1. **updated**

- 数据更新完成，**DOM 已经刷新完毕**
- 注意：频繁修改数据会反复触发；不要在这里修改会再次变更的数据，容易死循环
- 使用：拿到更新之后的最新 DOM

------

#### 🔹销毁阶段：组件销毁，组件实例即将 / 已经销毁

1. **beforeDestroy ✨高频**

- 组件实例还在，组件还没销毁，DOM 还存在
- **重点在这里清理资源**：定时器 setInterval、延时器、事件监听、websocket、订阅、解绑第三方插件，防止内存泄漏

1. **destroyed**

- 组件完全销毁，所有指令、监听移除，DOM 解绑
- 几乎很少使用

> Vue2 补充：activated /deactivated 配合 keep‑alive 缓存组件使用

#### Vue3 组合式 API（setup 语法糖）

> setup 相当于 Vue2 beforeCreate，**setup 执行比 beforeCreate 还要早，setup 内部没有 this**

#### 🔹创建阶段

**setup ✨高频**

- 组件实例创建最早执行，**没有 this，拿不到 DOM**
- 做：声明响应式 ref/reactive、定义函数、写 watch/computed；可以发初始化请求
- ❗不能操作 DOM

#### 🔹挂载阶段

1. **onBeforeMount**

   等价于 Vue2 beforeMount；DOM 未挂载，很少用

2. **onMounted ✨高频**

   等价 Vue2 mounted；DOM 挂载完成，可操作 dom、ref、初始化 echarts 地图插件

#### 🔹更新阶段

1. **onBeforeUpdate**：等价 beforeUpdate，DOM 更新前
2. **onUpdated**：等价 updated，DOM 更新完成，避免修改响应式数据造成循环更新

#### 🔹卸载阶段（Vue3 改名，销毁→卸载）

1. **onBeforeUnmount ✨高频**

   等价 Vue2 beforeDestroy

   **最重要：清除定时器、事件监听、取消请求、关闭 socket，防止内存泄漏**

2. **onUnmounted**

   等价 destroyed；组件完全卸载，几乎不用

> Vue3 keep‑alive：`onActivated`、`onDeactivated`

#### 快速记忆总结表

|            生命周期             |           能干什么            |                不能干什么                |
| :-----------------------------: | :---------------------------: | :--------------------------------------: |
|         created / setup         |     初始化数据，请求接口      |              操作 DOM、ref               |
|       mounted / onMounted       | 操作 DOM、ref、第三方库初始化 |           不要大量修改初始数据           |
| beforeDestroy / onBeforeUnmount |  **清除定时器、监听、订阅**   |             不要写业务新逻辑             |
|       updated / onUpdated       |       拿到更新后的 DOM        | 不要修改会再次触发更新的数据，防止死循环 |

#### 开发最佳实践

1. **初始化接口请求**：
   1. Vue2：`created`；Vue3：`setup` / `onMounted`都可以；
   2. 优先 created/setup 更早请求，减少等待；依赖 DOM 的请求放 mounted
2. **DOM 操作、Echarts、第三方插件**：只能写在`mounted / onMounted`
3. **清除定时器、事件解绑**：必须写在`beforeDestroy / onBeforeUnmount`，不要写 destroyed/onUnmounted，此时部分资源已经丢失
4. **不要在 updated 里面改响应式数据，会无限循环更新**

## 2. v-bind指令和v-model指令的区别

- v-bind

  ：单向数据绑定，将数据绑定到HTML属性

  ```vue
  <input :value="message" />
  ```

- v-model

  ：双向数据绑定，用于表单控件

  ```vue
  <input v-model="message" />
  ```

v-model实际上是v-bind和事件监听的语法糖。

## 3. Vue.js的组件通信方式及其优缺点

- **Props/Emit**：父子组件通信，简单直接但层级深时繁琐
- **Provide/Inject**：跨层级通信，灵活但难以追踪数据流
- **Pinia/Vuex**：全局状态管理，适合复杂应用但有学习成本
- **事件总线**：任意组件通信，但难以维护
- **ref/expose**：直接访问子组件，简单但破坏封装性

## 4. Vue.js如何实现父子组件之间的数据传递

```vue
<!-- 父组件 -->
<template>
  <ChildComponent 
    :parent-data="data" 
    @child-event="handleChildEvent" 
  />
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const data = ref('来自父组件的数据')
const handleChildEvent = (childData) => {
  console.log('来自子组件：', childData)
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <p>{{ parentData }}</p>
    <button @click="sendToParent">发送给父组件</button>
  </div>
</template>

<script setup>
const props = defineProps({
  parentData: String
})

const emit = defineEmits(['child-event'])

const sendToParent = () => {
  emit('child-event', '来自子组件的数据')
}
</script>
```

## 5. Vue.js中的响应式原理

Vue 3使用**Proxy**实现响应式：

- 通过Proxy拦截对象的读取、设置操作
- 读取时进行依赖收集（track）
- 设置时触发更新（trigger）
- 使用WeakMap存储依赖关系
- 相比Vue 2的Object.defineProperty，支持数组索引和动态属性

## 6. 如何在Vue.js中实现路由跳转

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 编程式导航
const goToPage = () => {
  // 路径跳转
  router.push('/about')
  
  // 命名路由跳转
  router.push({ name: 'User', params: { id: 123 } })
  
  // 带查询参数
  router.push({ path: '/search', query: { q: 'vue' } })
  
  // 替换当前记录
  router.replace('/home')
  
  // 历史记录操作
  router.go(-1) // 后退
}
</script>

<template>
  <!-- 声明式导航 -->
  <router-link to="/about">关于</router-link>
  <router-link :to="{ name: 'User', params: { id: 123 } }">用户</router-link>
</template>
```

## 7. computed和watch的区别

**computed（计算属性）**：

- 基于依赖的缓存，依赖不变时不重新计算
- 必须返回值
- 适合模板中的复杂逻辑

**watch（侦听器）**：

- 监听数据变化执行回调
- 不需要返回值
- 适合异步操作或开销较大的操作

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const count = ref(0)

// computed
const doubleCount = computed(() => count.value * 2)

// watch
watch(count, (newVal, oldVal) => {
  console.log(`count从${oldVal}变为${newVal}`)
})
</script>
```

## 8. v-for指令和v-if指令的区别

**执行优先级**：Vue 3中v-if比v-for优先级更高

**最佳实践**：

```vue
<!-- 避免这样做 -->
<li v-for="user in users" v-if="user.isActive" :key="user.id">
  {{ user.name }}
</li>

<!-- 推荐做法1：使用computed -->
<li v-for="user in activeUsers" :key="user.id">
  {{ user.name }}
</li>

<!-- 推荐做法2：使用template -->
<template v-for="user in users" :key="user.id">
  <li v-if="user.isActive">{{ user.name }}</li>
</template>
```

## 9. mixins和extends的作用及其区别

**Vue 3推荐使用组合式函数（Composables）替代mixins**：

```javascript
// 组合式函数
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// 在组件中使用
<script setup>
import { useCounter } from './composables/useCounter'

const { count, increment } = useCounter()
</script>
```

**区别**：

- **mixins**：合并多个对象，可能有命名冲突
- **extends**：继承单个组件
- **Composables**：更清晰的逻辑复用，避免命名冲突

## 10. keep-alive组件的作用及如何使用

**作用**：缓存组件实例，避免重复渲染

```vue
<template>
  <!-- 缓存所有组件 -->
  <keep-alive>
    <router-view />
  </keep-alive>

  <!-- 条件缓存 -->
  <keep-alive :include="['ComponentA', 'ComponentB']">
    <component :is="currentComponent" />
  </keep-alive>

  <!-- 排除某些组件 -->
  <keep-alive :exclude="['ComponentC']">
    <router-view />
  </keep-alive>

  <!-- 限制缓存数量 -->
  <keep-alive :max="3">
    <router-view />
  </keep-alive>
</template>

<script setup>
import { onActivated, onDeactivated } from 'vue'

// 组件激活时调用
onActivated(() => {
  console.log('组件被激活')
})

// 组件失活时调用
onDeactivated(() => {
  console.log('组件被缓存')
})
</script>
```