# JavaScript

## Promise 

**标准写法**

```js
return new Promise((resolve, reject) => {
  // 异步操作代码
  if (/* 操作成功 */) {
    resolve(value); // 成功时调用，传递结果值
  } else {
    reject(error); // 失败时调用，传递错误原因
  }
});
```

**作用解释**：

Promise 是 JavaScript 中用于处理异步操作的对象，它代表一个尚未完成但预期将来会完成的操作。

**主要作用**：

**管理异步操作**：提供了一种更优雅的方式来处理异步操作，避免了回调地狱（Callback Hell）。

**状态管理**：Promise 有三种状态：

- pending（进行中）
- fulfilled（已成功）
- rejected（已失败

**链式调用**：支持 `.then()` 和 `.catch()` 的链式调用，使异步代码更易读和维护。

**参数说明：**

- `resolve`：函数，当异步操作成功时调用，将 Promise 状态从 pending 改为 fulfilled
- `reject`：函数，当异步操作失败时调用，将 Promise 状态从 pending 改为 rejected

**使用示例：**

```js
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

// 使用
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

- Promise 是现代 JavaScript 异步编程的基础，也是 async/await 语法的基础。

