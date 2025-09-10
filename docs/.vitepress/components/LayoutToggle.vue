<template>
  <div class="layout-toggle">
    <button
      @click="toggleLayout"
      :class="['toggle-btn', { 'wide-mode': isWideLayout }]"
      :title="isWideLayout ? '切换到默认宽度' : '切换到宽屏模式'"
    >
      <span class="toggle-text">{{ isWideLayout ? "默认布局" : "宽屏布局" }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const isWideLayout = ref(false);

// 从localStorage读取用户偏好
onMounted(() => {
  const saved = localStorage.getItem("vitepress-layout-wide");
  if (saved) {
    isWideLayout.value = JSON.parse(saved);
    applyLayout();
  }
});

// 监听变化并保存到localStorage
watch(isWideLayout, (newVal) => {
  localStorage.setItem("vitepress-layout-wide", JSON.stringify(newVal));
  applyLayout();
});

const toggleLayout = () => {
  isWideLayout.value = !isWideLayout.value;
};

const applyLayout = () => {
  const root = document.documentElement;
  if (isWideLayout.value) {
    root.classList.add("layout-wide");
  } else {
    root.classList.remove("layout-wide");
  }
};
</script>

<style scoped>
.layout-toggle {
  display: flex;
  align-items: center;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 16px;
  padding: 6px 12px;
  height: 32px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-border, #e2e2e3);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2, #476582);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  user-select: none;
  outline: none;
}

.toggle-btn:hover {
  background: var(--vp-c-bg-mute, #f1f1f2);
  border-color: var(--vp-c-border-hover, #c2c2c4);
  color: var(--vp-c-text-1, #2c3e50);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.toggle-btn.wide-mode {
  background: var(--vp-c-brand-soft, #e0f2fe);
  border-color: var(--vp-c-brand, #3eaf7c);
  color: var(--vp-c-brand-dark, #2c8f6a);
}

.toggle-btn.wide-mode:hover {
  background: var(--vp-c-brand-softer, #d0ebf8);
  border-color: var(--vp-c-brand-dark, #2c8f6a);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.toggle-btn:hover .toggle-icon {
  transform: scale(1.1);
}

.toggle-text {
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
