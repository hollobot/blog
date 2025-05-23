# VitePress 快速入门

VitePress 是一个[静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

## 一、环境配置

### 1. VSCode

官网：https://code.visualstudio.com/download


![image.tkYb4UkC](.\assets\image.tkYb4UkC.png)

### 2. NodeJS

官网：https://nodejs.org/zh-cn/download/prebuilt-installer

点击这个下载地址进行下载：https://nodejs.org/dist/v20.16.0/node-v20.16.0-x64.msi

![image-1.9cj5ZS7t](.\assets\image-1.9cj5ZS7t.png)

**查看是否安装**

```cmd
C:\Users\23809>node -v
v20.18.3

C:\Users\23809>npm -v
11.3.0
```

**设置全局的 npm 镜像地址**



### 3. 配置执行策略(Windows)

在 PowerShell 中，Get-ExecutionPolicy 命令用于获取当前的执行策略。PowerShell 的执行策略是一种安全功能，它控制脚本文件在系统上运行的条件。

打开 PowerShell，输入 `Get-ExecutionPolicy` 看是否输出 `RemoteSigned`，如果是`Restricted` 则需要继续往下看，需要设置为 `RemoteSigned`

powershell

```powershell
Get-ExecutionPolicy
```

超级管理员方式打开 PowerShell，执行策略设置为 `RemoteSigned`

powershell

```powershell
Set-ExecutionPolicy RemoteSigned
```

**PowerShell `Get-ExecutionPolicy` 可能的返回值：**

| 执行策略         | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| **Restricted**   | 默认设置，不允许任何脚本运行。只能执行单个命令。             |
| **AllSigned**    | 只允许运行由可信发布者签名的脚本和配置文件。                 |
| **RemoteSigned** | 允许运行本地脚本，但从互联网下载的脚本必须由可信发布者签名。 |
| **Unrestricted** | 允许所有脚本运行。下载的脚本在运行之前会提示用户是否愿意运行。 |
| **Bypass**       | 完全绕过执行策略检查，允许所有脚本运行，不显示任何警告或提示。 |
| **Undefined**    | 没有为当前作用域设置执行策略，默认执行策略为 `Restricted`。  |

### 4. 安装 Git

Git 官网：https://git-scm.com/downloads

```cmd
C:\Users\23809>git -v
git version 2.49.0.windows.1

C:\Users\23809>
```

## 二、VitePress安装

### 1. 安装

**前置准备**

- [Node.js](https://nodejs.org/) 18 及以上版本。
- 通过命令行界面 (CLI) 访问 VitePress 的终端。
- 支持Markdown语法的编辑器。
- 推荐 [VSCode](https://code.visualstudio.com/) 及其[官方 Vue 扩展](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。

VitePress 可以单独使用，也可以安装到现有项目中。在这两种情况下，都可以使用以下方式安装它：

```npm
$ npm add -D vitepress
```

```npm
$ npx vitepress init
```

将需要回答几个简单的问题：

```cmd
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◆  Theme:
│  ● Default Theme (Out of the box, good-looking docs)
│  ○ Default Theme + Customization
│  ○ Custom Theme
└
```

### 2. 文件结构

如果正在构建一个独立的 VitePress 站点，可以在当前目录 (`./`) 中搭建站点。但是，如果在现有项目中与其他源代码一起安装 VitePress，建议将站点搭建在嵌套目录 (例如 `./docs`) 中，以便它与项目的其余部分分开。

假设选择在 `./docs` 中搭建 VitePress 项目，生成的文件结构应该是这样的：

```cmd
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

`docs` 目录作为 VitePress 站点的项目**根目录**。`.vitepress` 目录是 VitePress 配置文件、开发服务器缓存、构建输出和可选主题自定义代码的位置。

::: tip
默认情况下，VitePress 将其开发服务器缓存存储在 `.vitepress/cache` 中，并将生产构建输出存储在 `.vitepress/dist` 中。如果使用 Git，应该将它们添加到 `.gitignore` 文件中。也可以手动[配置](https://vitejs.cn/vitepress/reference/site-config#outdir)这些位置。
:::

**配置文件**

配置文件 (`.vitepress/config.js`) 让你能够自定义 VitePress 站点的各个方面，最基本的选项是站点的标题和描述：

```js
// .vitepress/config.js
export default {
  // 站点级选项
  title: 'VitePress',
  description: 'Just playing around.',

  themeConfig: {
    // 主题级选项
  }
}
```

还可以通过 `themeConfig` 选项配置主题的行为。有关所有配置选项的完整详细信息，请参见[配置参考](https://vitejs.cn/vitepress/reference/site-config)。

**源文件**

`.vitepress` 目录之外的 Markdown 文件被视为**源文件**。

VitePress 使用 **基于文件的路由**：每个 `.md` 文件将在相同的路径被编译成为 `.html` 文件。例如，`index.md` 将会被编译成 `index.html`，可以在生成的 VitePress 站点的根路径 `/` 进行访问。

VitePress 还提供了生成简洁 URL、重写路径和动态生成页面的能力。这些将在[路由指南](https://vitejs.cn/vitepress/guide/routing)中进行介绍。

### **3. 启动并运行**

该工具还应该将以下 npm 脚本注入到 `package.json` 中：

```json
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}
```

`docs:dev` 脚本将启动具有即时热更新的本地开发服务器。使用以下命令运行它：

```sh
$ npm run docs:dev
```

除了 npm 脚本，还可以直接调用 VitePress：

```sh
$ npx vitepress dev docs
```

更多的命令行用法请参见 [CLI 参考](https://vitejs.cn/vitepress/reference/cli)。

开发服务应该会运行在 `http://localhost:5173` 上。在浏览器中访问 URL 以查看新站点的运行情况吧！