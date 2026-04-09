---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: home-log

hero:
  name: "hello blog"
  image:
    src: /logo.png
    alt: hello
  text: "开发日志 & 学习笔记"
  tagline: 记录日常实战、踩坑复盘、面试总结与技术沉淀
  actions:
    - theme: brand
      text: 进入编程主线
      link: /programming/数据结构/index
    - theme: alt
      text: AI 专题总览
      link: /AI/index

features:
  - title: 编程主线
    details: 按学习路径整理的核心笔记，覆盖后端必备知识与高频问题。
    link: /programming/数据结构/index
  - title: AI 专题
    details: 以落地为导向的 AI 日志，记录模型接入、RAG、Agent 方案实践。
    link: /AI/index
  - title: 工具实践
    details: 开发工具链配置、问题排查与效率提升经验的持续沉淀。
    link: /software/cursor/cursor
  - title: 导航总览
    details: 全站内容地图，帮助按主题快速定位目标笔记与章节。
    link: /nav/
---

<script setup>
import { withBase } from "vitepress";
import RecentUpdates from "../.vitepress/components/RecentUpdates.vue";
import { data as recentUpdates } from "./recent-updates.data.mjs";

// 首页学习入口卡片数据，统一管理标题、描述和路由。
const entryCards = [
  {
    title: "Java 基础与进阶",
    desc: "从 JavaSE 到并发编程，建立后端核心语言能力。",
    linkText: "进入 Java 专区",
    link: "/programming/java/JavaSE",
  },
  {
    title: "MySQL 与数据存储",
    desc: "覆盖索引、事务、锁、性能优化与常见面试题。",
    linkText: "进入 MySQL 专区",
    link: "/programming/MySQL/MySQL基本操作",
  },
  {
    title: "Redis 实战",
    desc: "从入门到分布式缓存、持久化和高并发场景设计。",
    linkText: "进入 Redis 专区",
    link: "/programming/Redis/Redis 入门",
  },
  {
    title: "Vue 开发",
    desc: "组件通信、路由、状态管理与工程化实践。",
    linkText: "进入 Vue 专区",
    link: "/programming/vue/快速开始",
  },
  {
    title: "AI 开发专题",
    desc: "模型、推理、LangChain4j、Spring AI、RAG、Agent 全链路。",
    linkText: "进入 AI 专题",
    link: "/AI/index",
  },
  {
    title: "开发工具箱",
    desc: "整理高频工具使用经验，提升日常开发效率。",
    linkText: "进入工具专区",
    link: "/software/cursor/cursor",
  },
];

// 将站内路径转换为可点击地址，自动兼容 base 和中文/空格路径。
function toSafeLink(link) {
  return withBase(encodeURI(link));
}
</script>

## 最近更新文章

<RecentUpdates :items="recentUpdates" />

## 学习入口

<div class="home-grid">
  <a
    v-for="card in entryCards"
    :key="card.link"
    class="home-card"
    :href="toSafeLink(card.link)"
  >
    <h3>{{ card.title }}</h3>
    <p>{{ card.desc }}</p>
    <span>{{ card.linkText }}</span>
  </a>
</div>

## 学习路线

<div class="home-steps">
  <div class="step-item">
    <strong>01 基础能力搭建</strong>
    <span>目标：建立稳定的计算机基础与代码表达能力。</span>
    <em>建议路径：数据结构总览 -> 数组与链表 -> 栈与队列 -> JavaSE 语法与集合。每个主题至少配 1 个可运行小练习。</em>
  </div>
  <div class="step-item">
    <strong>02 后端核心知识</strong>
    <span>目标：把数据库、缓存与服务框架串成完整后端认知。</span>
    <em>建议路径：MySQL 基本操作 -> 索引/事务/锁 -> Redis 入门/场景 -> Spring 与分层设计，重点理解数据一致性与性能边界。</em>
  </div>
  <div class="step-item">
    <strong>03 工程化与交付</strong>
    <span>目标：从“会写代码”进阶到“可持续交付”。</span>
    <em>建议路径：Git 协作规范 -> Linux 常用命令 -> Docker 基础 -> 项目部署上线与回滚，形成标准化开发与发布流程。</em>
  </div>
  <div class="step-item">
    <strong>04 项目复盘与面试沉淀</strong>
    <span>目标：把做过的事情沉淀成可复用、可表达的方法论。</span>
    <em>建议每次复盘记录：背景、问题、方案、取舍、结果、可优化点；并同步补全对应面试题，形成“问题 -> 方案 -> 结果”的叙事链路。</em>
  </div>
  <div class="step-item">
    <strong>05 AI 能力融合实践</strong>
    <span>目标：把 AI 从概念能力转换为业务可落地能力。</span>
    <em>建议路径：模型调用 -> RAG 检索增强 -> Tool 调用 -> Agent 多步骤任务，优先做小闭环场景并持续记录成本、效果与稳定性。</em>
  </div>
</div>

## 面试时间线

::: timeline 2026-02-26
- 泛微网络科技股份有限公司
- 岗位 后端开发
- 技术二面记录 https://l0x09m00y4c.feishu.cn/docx/XKqvdetNboZQhJxwdLbc2ArxnAh
- 拒了
:::

<style scoped>
.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin: 12px 0 22px;
}

.home-card {
  display: block;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(70, 98, 217, 0.12) 0%, rgba(70, 98, 217, 0) 60%),
    var(--vp-c-bg-soft);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.home-card:hover {
  transform: translateY(-2px);
  border-color: #9ab0ef;
  box-shadow: 0 10px 28px rgba(30, 62, 156, 0.1);
}

.home-card h3 {
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  font-size: 16px;
}

.home-card p {
  margin: 0 0 10px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.home-card span {
  color: #3654c7;
  font-size: 12px;
  font-weight: 600;
}

.home-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 12px 0 22px;
}

.step-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-left: 3px solid #6f8fff;
  border-radius: 0 10px 10px 0;
  background: var(--vp-c-bg-soft);
}

.step-item strong {
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.step-item span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.step-item em {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-style: normal;
  line-height: 1.6;
}
</style>
