# electron ipc 通讯

## **invoke/handle 模式**（推荐方式）

```js
// 渲染进程
const result = await window.ipcRenderer.invoke('checkAvatarExists', localAvatarPath);

// 主进程 这段代码通常在应用启动时执行一次
ipcMain.handle('checkAvatarExists', async (event, avatarPath) => {
    //existsSync检测是否存在路径
  return fs.existsSync检测是否存在路径(avatarPath);
});
```

**特点：**

- 基于 Promise，支持 async/await
- 有返回值
- 更现代化的异步处理方式



## **send/on 模式**（传统方式）

```js
// 渲染进程
window.ipcRenderer.send('checkAvatarExists', localAvatarPath);
window.ipcRenderer.on('avatarExistsResult', (event, exists) => {
  console.log(exists);
});

// 主进程
ipcMain.on('checkAvatarExists', (event, avatarPath) => {
  const exists = fs.existsSync(avatarPath);
  event.reply('avatarExistsResult', exists);
});
```

**特点：**

- 基于事件监听
- 需要额外的回调处理
- 代码相对复杂



## **sendSync**（同步方式）

```js
// 渲染进程
const result = window.ipcRenderer.sendSync('checkAvatarExists', localAvatarPath);

// 主进程
ipcMain.on('checkAvatarExists', (event, avatarPath) => {
  event.returnValue = fs.existsSync(avatarPath);
});
```

**特点：**

- 阻塞执行
- 可能导致界面卡顿
- 不推荐使用



## 使用场景对比

- **invoke/handle**：适合需要返回值的操作，如文件检查、数据查询等
- **send/on**：适合单向通信或复杂的事件驱动场景
- **sendSync**：仅在必须同步执行的极少数情况下使用



## 场景

**邮箱改变获取本地头像改变头像**

```js
// 监听邮箱变化  （渲染进程）
watch(
    () => userInfoForm.value.email,
    (newEmail) => {
        if (!newEmail) {
            // 邮箱为空时显示默认头像
            avatarPath.value = avatar;
            return;
        }
        // 截取邮箱@前面的部分作为用户id
        const userId = newEmail.split('@')[0];
        // 构建本地头像路径
        const localAvatarPath = `avatar/${userId}.png`;
        
        // 使用 window.ipcRenderer 检查文件是否存在
        window.ipcRenderer.invoke('checkAvatarExists', localAvatarPath)
            .then(exists => {
                if (exists) {
                    avatarPath.value = localAvatarPath;
                } else {
                    avatarPath.value = avatar; // 不存在时使用默认头像
                }
            })
            .catch(() => {
                avatarPath.value = avatar; // 出错时使用默认头像
            });
    }
);
```

