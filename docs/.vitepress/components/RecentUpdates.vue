<script setup>
import { computed, ref } from "vue";
import { withBase } from "vitepress";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

// Top 数量选项，支持用户在首页交互切换。
const topOptions = [6, 12, 18, 24, 36];

// 默认展示 Top 12；如果总量不足会在计算属性中自动截断。
const selectedTop = ref(12);

// Top 按钮显示为统一尺寸，避免不同数字位数导致视觉抖动。
const topButtonClass = "top-btn";

// 按用户选择的 Top 值动态裁剪展示数量。
const visibleItems = computed(() => {
  const safeCount = Number(selectedTop.value) || 12;
  return props.items.slice(0, safeCount);
});

// 分类映射为样式类名，让不同主题板块拥有不同视觉风格。
function getCategoryClass(category) {
  const classMap = {
    编程: "cat-programming",
    AI: "cat-ai",
    工具: "cat-tool",
    休闲: "cat-life",
    导航: "cat-nav",
    其他: "cat-other",
  };
  return classMap[category] || classMap.其他;
}

// 站内链接统一加 base，避免部署在子路径时点击失效。
function toPageLink(link) {
  return withBase(link);
}
</script>

<template>
  <div class="toolbar">
    <div class="top-select" role="group" aria-label="最近更新展示条数">
      <span><strong>展示 Top</strong></span>
      <button
        v-for="size in topOptions"
        :key="size"
        type="button"
        :class="[topButtonClass, { active: selectedTop === size }]"
        @click="selectedTop = size"
      >
        {{ size }}
      </button>
    </div>
    <span class="total">共 {{ items.length }} 篇，当前展示 {{ visibleItems.length }} 篇</span>
  </div>

  <div class="recent-wrap">
    <a
      v-for="item in visibleItems"
      :key="`${item.link}-${item.updatedText}`"
      class="recent-item"
      :class="getCategoryClass(item.category)"
      :href="toPageLink(item.link)"
    >
      <div class="head">
        <span class="category" :class="getCategoryClass(item.category)">{{ item.category }}</span>
        <time>{{ item.updatedText }}</time>
      </div>
      <h3>{{ item.title }}</h3>
    </a>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 10px 0 8px;
}

.top-select {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.top-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  transition: all 0.2s ease;
}

.top-btn:hover {
  border-color: #9ab0ef;
  color: #3452c4;
}

.top-btn.active {
  border-color: #7f99ee;
  background: rgba(69, 96, 214, 0.12);
  color: #2e4cbd;
}

.total {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.recent-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin: 12px 0 22px;
}

.recent-item {
  display: block;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  min-height: 102px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.recent-item.cat-programming {
  background: linear-gradient(180deg, rgba(79, 126, 247, 0.08), rgba(79, 126, 247, 0.02));
}

.recent-item.cat-ai {
  background: linear-gradient(180deg, rgba(124, 92, 255, 0.09), rgba(124, 92, 255, 0.02));
}

.recent-item.cat-tool {
  background: linear-gradient(180deg, rgba(46, 155, 115, 0.08), rgba(46, 155, 115, 0.02));
}

.recent-item.cat-life {
  background: linear-gradient(180deg, rgba(255, 141, 77, 0.09), rgba(255, 141, 77, 0.02));
}

.recent-item.cat-nav {
  background: linear-gradient(180deg, rgba(101, 114, 138, 0.09), rgba(101, 114, 138, 0.02));
}

.recent-item.cat-other {
  background: linear-gradient(180deg, rgba(123, 135, 149, 0.08), rgba(123, 135, 149, 0.02));
}

.recent-item:hover {
  transform: translateY(-2px);
  border-color: #99aceb;
  box-shadow: 0 10px 24px rgba(28, 52, 120, 0.09);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 10px;
}

.category {
  display: inline-block;
  width: 56px;
  text-align: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.category.cat-programming {
  color: #2f5cd1;
  background: rgba(79, 126, 247, 0.15);
}

.category.cat-ai {
  color: #5e45cf;
  background: rgba(124, 92, 255, 0.15);
}

.category.cat-tool {
  color: #1f7f5b;
  background: rgba(46, 155, 115, 0.16);
}

.category.cat-life {
  color: #c76627;
  background: rgba(255, 141, 77, 0.16);
}

.category.cat-nav {
  color: #4f5d78;
  background: rgba(101, 114, 138, 0.16);
}

.category.cat-other {
  color: #4d5968;
  background: rgba(123, 135, 149, 0.16);
}

time {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .recent-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
