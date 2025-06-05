# vue 随笔

### 修饰符

Vue.js 提供了一系列事件修饰符来处理 DOM 事件细节。下面我将详细解释常用的事件修饰符，并通过具体示例演示它们的用法。

| 修饰符     | 作用                         | 等效原生 JS                                 |
| :--------- | :--------------------------- | :------------------------------------------ |
| `.stop`    | 阻止事件冒泡                 | `event.stopPropagation()`                   |
| `.prevent` | 阻止默认行为                 | `event.preventDefault()`                    |
| `.capture` | 使用捕获模式监听事件         | `addEventListener(..., true)`               |
| `.self`    | 仅当事件从元素自身触发时执行 | `if (event.target === event.currentTarget)` |
| `.once`    | 事件只触发一次               | -                                           |
| `.passive` | 提升滚动性能                 | `addEventListener(..., {passive: true})`    |

#### .stop修饰符

**作用**：阻止事件继续向上级元素传播（冒泡）

```html
<template>
  <div @click="parentClick" style="padding: 20px; background: lightblue">
    <button @click.stop="childClick">点我(不会触发父级点击)</button>
  </div>
</template>

<script>
export default {
  methods: {
    parentClick() {
      console.log('父元素被点击');
    },
    childClick() {
      console.log('子元素被点击，不会冒泡到父元素');
    }
  }
}
</script>

```

#### .prevent修饰符

**作用**：阻止元素的默认行为，如表单提交、链接跳转等

```html
<template>
  <!-- 阻止表单默认提交行为 -->
  <form @submit.prevent="handleSubmit">
    <button type="submit">提交</button>
  </form>
  
  <!-- 阻止链接默认跳转行为 -->
  <a href="https://vuejs.org" @click.prevent="handleLinkClick">Vue官网</a>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      console.log('表单提交被拦截，执行自定义逻辑');
      // 这里可以写AJAX提交逻辑
    },
    handleLinkClick() {
      console.log('链接点击被拦截，执行自定义逻辑');
      // 可以在这里做路由跳转或其他操作
    }
  }
}
</script>
```

#### .capture修饰符

**作用**：使用事件捕获模式（从外到内）

```html
<template>
  <div @click.capture="captureClick" style="padding: 20px; background: lightgreen">
    <button @click="normalClick">点我测试捕获模式</button>
  </div>
</template>

<script>
export default {
  methods: {
    captureClick() {
      console.log('捕获阶段触发 - 父元素');
    },
    normalClick() {
      console.log('冒泡阶段触发 - 子元素');
    }
  }
}
</script>
```

#### .self修饰符

**作用**：只有当事件是从侦听器绑定的元素本身触发时才触发回调

```html
<template>
  <div @click.self="parentClick" style="padding: 20px; background: lightpink">
    <button @click="childClick">点我测试.self修饰符</button>
  </div>
</template>

<script>
export default {
  methods: {
    parentClick() {
      console.log('只有点击父元素区域才会触发，点击子元素不会触发');
    },
    childClick() {
      console.log('子元素被点击');
    }
  }
}
</script>
```

#### .once修饰符

**作用**：事件只会触发一次

```html
<template>
  <button @click.once="onceClick">我只能被点击一次</button>
</template>

<script>
export default {
  methods: {
    onceClick() {
      console.log('这个日志只会出现一次，后续点击无效');
    }
  }
}
</script>
```

#### .passive修饰符

**作用**：主要用于改善移动端滚动性能

```html
<template>
  <div @scroll.passive="handleScroll" style="height: 200px; overflow: auto">
    <div style="height: 1000px">滚动我测试passive效果</div>
  </div>
</template>

<script>
export default {
  methods: {
    handleScroll() {
      // 在移动端，使用passive可以显著提升滚动性能
      console.log('滚动中...');
    }
  }
}
</script>
```

