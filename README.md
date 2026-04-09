<div align="center">

# :sparkles: Hello Blog :sparkles:

一个基于 VitePress 构建的个人技术日志，记录编程学习笔记、技术总结和实践经验。

[![VitePress](https://img.shields.io/badge/VitePress-1.6.3-blue.svg)](https://vitepress.dev/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

</div>

## ✨ 特性

- 🚀 基于 **VitePress** 构建，启动快、构建快
- 📚 覆盖 **Java、MySQL、Redis、Vue、AI** 等多类内容
- 🎨 支持深色/浅色主题切换
- 🔍 内置本地搜索
- 📱 响应式布局，兼容移动端
- 💬 集成 Giscus 评论系统
- 📊 集成不蒜子访问统计
- 🖼️ 图片缩放预览（medium-zoom）
- 📝 支持时间线、任务列表、代码组图标
- 🤖 新增 AI 专题交互文档页（按模块筛选）

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
- **Vue**：快速开始、路由、组件通信、Pinia、插槽
- **Electron**：IPC 通讯
- **VitePress**：快速开始、部署上线
- **Git / npm / Linux**：常用命令与实操
- **面试**：Java、并发、JVM、MySQL、Redis、Spring、Vue

### AI

- **Java AI 开发笔记（交互版）**：
  - 路径：`docs/src/AI/index.md`
  - 覆盖：基础词汇、模型对比、LangChain4j、Spring AI、RAG、Agent、实战架构
  - 支持：目录按钮筛选、卡片化阅读、代码片段速览

### 工具

- **Cursor**：开发辅助
- **IDEA**：使用技巧
- **Network**：内网穿透

### 休闲

- **Minecraft**：药水篇

## 🛠 技术栈

- **框架**：[VitePress](https://vitepress.dev/) `1.6.3`
- **样式**：Sass
- **插件与能力**：
  - `vitepress-markdown-timeline`（时间线）
  - `markdown-it-task-checkbox`（任务列表）
  - `vitepress-plugin-group-icons`（代码组图标）
  - `vitepress-plugin-comment-with-giscus`（评论）
  - `medium-zoom`（图片缩放）
  - `nprogress-v2`（页面切换进度条）
  - `busuanzi.pure.js`（访问统计）

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18（CI 使用 Node 20）
- npm

### 安装依赖

```bash
npm ci
```

### 本地开发

```bash
npm run dev
```

默认访问：`http://localhost:5173/blog/`

### 构建生产版本

```bash
npm run docs:build
```

### 预览生产构建

```bash
npm run docs:preview
```

### Windows 手动部署脚本

```bash
npm run deploy:win
```

## 📦 项目结构

```text
blog/
├── docs/
│   ├── .vitepress/
│   │   ├── components/      # 全局组件（含 AI 专题组件）
│   │   ├── theme/           # 主题扩展与样式
│   │   └── config.mjs       # 站点配置
│   └── src/
│       ├── AI/              # AI 专题文档
│       ├── programming/     # 编程内容
│       ├── software/        # 工具内容
│       ├── leisureTime/     # 休闲内容
│       └── index.md         # 首页
├── .github/workflows/       # GitHub Actions
├── package.json
└── README.md
```

## 🚢 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。

- 工作流：`.github/workflows/deploy.yml`
- 构建产物目录：`docs/.vitepress/dist`

## 🎨 主题与增强

`docs/.vitepress/theme` 已集成：

- 自定义导航链接组件
- 布局切换组件
- 返回顶部组件
- 访问统计组件
- 通知组件
- 评论系统与页面切换进度条

## 📝 文档编写说明

文档使用 Markdown 编写，支持：

- 代码块高亮
- 时间线语法（`::: timeline`）
- 任务列表（`- [ ]` / `- [x]`）
- 代码组图标
- 图片缩放预览

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

[ISC](LICENSE)

## 🔗 链接

- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub](https://github.com/hollobot)

---

<div align="center">

如有转载或引用，请标注本站原文地址。  
版权所有 © 2025 hello

</div>

## :sparkles: Star History :sparkles:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=hollobot/blog&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=hollobot/blog&type=Date" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=hollobot/blog&type=Date" />
</picture>
