# slot

### 1. 默认插槽

```vue
父组件中：
<template>
  <ChildComponent>
    <p>这是传递给子组件的内容</p>
  </ChildComponent>
</template>
子组件中：ChildComponen.vue
<template>
  <div>
    <slot></slot>  <!-- 插槽的位置 -->
  </div>
</template>
```

### 2. 具名插槽

```vue
父组件中：
<template>
  <ChildComponent>
    <template v-slot:header>
      <h1>这是头部内容</h1>
    </template>
    <template v-slot:footer>
      <p>这是底部内容</p>
    </template>
  </ChildComponent>
</template>

子组件中：ChildComponen.vue
<template>
  <div>
    <header><slot name="header"></slot></header>
    <main><slot></slot></main>  <!-- 默认插槽 -->
    <footer><slot name="footer"></slot></footer>
  </div>
</template>

```

### 3. 作用域插槽 

1. 作用域插槽允许父组件不仅传递内容，还可以将子组件的一些数据传递给父组件，从而让父组件根据子组件的数据动态渲染插槽内容。使用作用域插槽时，父组件能够访问子组件内部的数据。

2. 具体编码：

   ```vue
   父组件中：
   <template>
     <ChildComponent v-slot:default="slotProps">
       <p>{{ slotProps.message }}</p>
     </ChildComponent>
   </template>
   
   
   子组件中：ChildComponen.vue
   <template>
     <div>
       <slot :message="message"></slot> <!-- 将 message 作为插槽的 prop 传递 -->
     </div>
   </template>
   
   <script>
   export default {
     data() {
       return {
         message: '来自子组件的消息'
       };
     }
   };
   </script>
   ```

### 4. 作用域插槽 

1、具名作用域插槽结合了命名插槽和作用域插槽，允许父组件根据不同的插槽名称传递内容，并访问子组件暴露的数据。

2、具体编码

```vue
<template>
  <ChildComponent>
    <template v-slot:header="slotProps">
      <h1>{{ slotProps.headerText }}</h1>
    </template>
    <template v-slot:footer="slotProps">
      <p>{{ slotProps.footerText }}</p>
    </template>
  </ChildComponent>
</template>

子组件中：ChildComponen.vue
<template>
  <div>
    <header><slot name="header" :headerText="headerText"></slot></header>
    <footer><slot name="footer" :footerText="footerText"></slot></footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerText: '这是头部',
      footerText: '这是底部'
    };
  }
};
</script>


```

### 5. 嵌套插槽

```vue
<template>
  <Layout>
    <!-- 为 left-content 插槽提供内容 -->
    <template v-slot:left-content>
      <div class="custom-left">
        <h2>自定义左侧内容</h2>
        <p>这部分内容覆盖了默认的左侧插槽内容</p>
      </div>
    </template>

    <!-- 为 top 插槽提供内容 -->
    <template v-slot:top>
      <h3>自定义顶部内容</h3>
    </template>

    <!-- 为 data-list 插槽提供内容 -->
    <template v-slot:data-list>
      <ul>
        <li>数据项 1</li>
        <li>数据项 2</li>
        <li>数据项 3</li>
      </ul>
    </template>

    <!-- 为 right-content 插槽提供内容 -->
    <template v-slot:right-content>
      <div>右侧的自定义内容</div>
    </template>
  </Layout>
</template>

子组件中：Layout.vue
<template>
  <div class="layout">
    <div class="left-content">
      <!-- left-content 插槽 -->
      <slot name="left-content">
        <div class="top">
          <!-- top 插槽 -->
          <slot name="top"></slot>
        </div>
        <div class="data-list">
          <!-- data-list 插槽 -->
          <slot name="data-list"></slot>
        </div>
      </slot>
    </div>
    <div class="right-content">
      <!-- right-content 插槽 -->
      <slot name="right-content"></slot>
    </div>
  </div>
</template>

```

