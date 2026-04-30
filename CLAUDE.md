# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 命令

```bash
npm ci                  # 安装依赖（推荐，与 CI 环境一致）
npm run dev             # 启动本地开发服务器，访问 http://localhost:5173/blog/
npm run docs:build      # 生产构建，产物在 docs/.vitepress/dist
npm run docs:preview    # 预览构建产物
```

无 lint 和测试命令（`npm test` 是占位符，会失败）。

**不要主动执行编译或测试**：完成代码改动后直接汇报即可，不要自行运行 `npm run docs:build`、启动 dev server 或用浏览器截图验证，除非用户明确要求。

## 架构概览

基于 VitePress `^1.6.3` 的个人技术博客，Node 20，TypeScript/JavaScript 混用。

**配置入口**：`docs/.vitepress/config.mjs`
- 站点的 nav、sidebar、markdown 插件、Vite 配置均在此文件手动维护
- `base` 根据环境变量切换：`DEPLOY_ENV=cf` 时为 `/`，否则为 `/blog/`
- `srcDir` 指向 `docs/src`，`outDir` 指向 `docs/.vitepress/dist`

**主题扩展**：`docs/.vitepress/theme/index.js`
- 继承 DefaultTheme，在此注册全局组件、挂载插件（Giscus 评论、medium-zoom、NProgress、busuanzi 统计）
- 全局组件注册只能在此文件完成

**组件分两类**：
- `docs/.vitepress/components/` — 页面级组件（ArticleMetadata、LayoutToggle、backtotop、notice、bsz）
- `docs/.vitepress/theme/components/` — 导航卡片组件（MNavLink、MNavLinks）

**内容结构**：`docs/src/`
- `programming/`、`AI/`、`article/`、`software/`、`leisureTime/`、`nav/`
- `recent-updates.data.mjs` — VitePress 数据加载器，构建时扫描所有 `.md` 文件并按 git 提交时间排序

**ArticleMetadata 注入方式**：在 `config.mjs` 的 `markdown.config` 中通过覆写 `heading_close` 渲染规则，在每个 `h1` 后自动插入 `<ArticleMetadata />`，无需在 Markdown 中手动添加。

## 关键约定

- **新增文章**后必须同步更新 `docs/.vitepress/config.mjs` 中对应的 sidebar 条目
- `docs/.vitepress/theme/untils/` 目录名拼写为 `untils`（非 `utils`），不要修改
- CSS 优先使用 VitePress CSS 变量（`--vp-*`），组件样式使用 `<style scoped>`
- Vue SFC 顺序：`<script setup>` → `<template>` → `<style scoped>`
- 浏览器专属逻辑必须加 `inBrowser` 守卫或在生命周期钩子中执行
- `config.mjs` 文件体积较大且手动维护，修改时做最小外科手术式改动，避免乱序或空白符变动
