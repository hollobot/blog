# vue 面经

## 1. Vue.js的生命周期函数及其执行顺序

Vue 3的组合式API生命周期钩子：

- `onBeforeMount()` - 组件挂载前
- `onMounted()` - 组件挂载后
- `onBeforeUpdate()` - 组件更新前
- `onUpdated()` - 组件更新后
- `onBeforeUnmount()` - 组件卸载前
- `onUnmounted()` - 组件卸载后
- `onErrorCaptured()` - 捕获错误时

执行顺序：创建 → 挂载 → 更新（可多次） → 卸载

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