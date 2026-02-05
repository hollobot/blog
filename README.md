<div align="center">

# :sparkles: Hello Log :sparkles:

一个基于 VitePress 构建的个人技术日志，记录编程学习笔记、技术总结和面试经验。

[![VitePress](https://img.shields.io/badge/VitePress-1.6.3-blue.svg)](https://vitepress.dev/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

</div>

## ✨ 特性

- 🚀 基于 **VitePress** 构建，快速响应
- 📚 涵盖 **Java、MySQL、Redis、Vue** 等多种技术栈
- 🎨 支持深色/浅色主题切换
- 🔍 内置本地搜索功能
- 📱 响应式设计，支持移动端访问
- 💬 支持 Giscus 评论系统
- 📊 集成不蒜子访问统计
- 🖼️ 图片懒加载和缩放预览
- 📝 支持 Markdown 时间线和任务列表
- 🌳 自动生成页面目录导航

## 📖 内容分类

### 编程

- **数据结构**：数组、链表、栈、队列、哈希表、树、堆、图
- **Java**：JavaSE、并发编程、常用知识点
- **MySQL**：安装、基本操作、函数、索引、事务、锁
- **Redis**：安装、入门、使用场景、分布式缓存、实践
- **RabbitMQ**：消息队列基础
- **MyBatis/MyBatis-Plus**：配置、分页、组件
- **Spring/Spring Cloud**：注解、AOP、快速开始
- **设计模式**：单例、工厂、策略、观察者
- **JVM**：虚拟机基础
- **Vue**：快速开始、路由、组件通信、Pinia、插槽、新组件
- **Electron**：IPC 通讯
- **VitePress**：快速开始、部署上线
- **Git**：基本命令速查
- **npm**：基本指令
- **Linux**：基本指令、配置虚拟机、Docker
- **面试**：Java 基础、集合、并发、JVM、MySQL、MyBatis、Redis、Spring、Vue、简历、项目难点
- **项目**：即时通讯系统

### 工具

- **Cursor**：无限续杯 Claude 3.5
- **IDEA**：无限重置试用 30 天
- **Network**：内网穿透

### 休闲

- **Minecraft**：药水篇

## 🛠 技术栈

- **框架**：[VitePress](https://vitepress.dev/) 1.6.3
- **样式**：Sass
- **插件**：
  - vitepress-markdown-timeline（时间线）
  - markdown-it-task-checkbox（任务列表）
  - vitepress-plugin-group-icons（代码组图标）
  - vitepress-plugin-comment-with-giscus（评论系统）
  - medium-zoom（图片缩放）
  - nprogress-v2（进度条）
  - busuanzi.pure.js（访问统计）

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) 或 [pnpm](https://pnpm.io/)

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173/log/ 查看效果

### 构建生产版本

```bash
npm run docs:build
```

### 预览生产构建

```bash
npm run docs:preview
```

## 📦 项目结构

```
blog/
├── docs/
│   ├── .vitepress/          # VitePress 配置
│   │   ├── components/      # 自定义组件
│   │   ├── directives/      # 自定义指令
│   │   ├── theme/           # 主题配置
│   │   └── config.mjs       # 站点配置
│   ├── src/                 # 文档源文件
│   │   ├── programming/     # 编程相关
│   │   ├── software/        # 工具相关
│   │   ├── leisureTime/     # 休闲相关
│   │   ├── nav/             # 导航页
│   │   └── public/          # 静态资源
│   └── index.md             # 首页
├── .github/workflows/       # GitHub Actions
├── package.json
└── README.md
```

## 🚢 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages。

配置文件位于 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### 手动部署（Windows）

```bash
npm run deploy:win
```

## 🎨 自定义主题

项目在 `docs/.vitepress/theme` 目录下进行了主题自定义，包括：

- 自定义导航链接组件
- 布局切换组件
- 返回顶部组件
- 不蒜子统计组件
- 通知组件
- 自定义样式

## 📝 编写文档

文档使用 Markdown 格式编写，支持以下特性：

- **代码块**：支持语法高亮和行号显示
- **时间线**：使用 `::: timeline` 语法
- **任务列表**：使用 `- [ ]` 语法
- **代码组图标**：自动为代码块添加语言图标
- **图片**：支持懒加载和缩放预览

示例：

````markdown
::: timeline
2024-01-01: 开始学习 Vue
2024-02-01: 完成第一个项目
:::

- [ ] 待完成任务
- [x] 已完成任务

```javascript
console.log("Hello World");
```
````

```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[ISC](LICENSE)

## 🔗 链接

- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub](https://github.com/hollobot)

---

<div align="center">

如有转载或 CV 的请标注本站原文地址

版权所有 © 2025-2025 hello

</div>
```
# :sparkles: Star History :sparkles:
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=hollobot/blog&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=hollobot/blog&type=Date" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=hollobot/blog&type=Date" />
</picture>