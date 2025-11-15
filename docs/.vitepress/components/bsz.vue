<template>
  <div class="busuanzi-container">
    <div class="busuanzi-stats">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span id="busuanzi_container_site_uv">
        访客数 <span class="stat-value" id="busuanzi_value_site_uv">--</span>
      </span>
      
      <span class="divider">|</span>
      
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span id="busuanzi_container_site_pv">
        总访问量 <span class="stat-value" id="busuanzi_value_site_pv">--</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // 等待不蒜子加载完成后显示数据
  const checkInterval = setInterval(() => {
    const pvElement = document.getElementById('busuanzi_value_site_pv');
    const uvElement = document.getElementById('busuanzi_value_site_uv');
    
    if (pvElement?.innerText && uvElement?.innerText) {
      clearInterval(checkInterval);
    }
  }, 100);
  
  // 10秒后清理定时器
  setTimeout(() => clearInterval(checkInterval), 10000);
});
</script>

<style scoped>
.busuanzi-container {
  padding: 20px 0;
  margin-top: 32px;
}

.busuanzi-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  vertical-align: middle;
  margin-right: 4px;
  color: var(--vp-c-brand-1);
}

.stat-value {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: 'Courier New', monospace;
  margin: 0 2px;
}

.divider {
  color: var(--vp-c-divider);
  margin: 0 8px;
  user-select: none;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .busuanzi-stats {
    font-size: 13px;
    gap: 8px;
  }
  
  .icon {
    width: 14px;
    height: 14px;
  }
  
  .divider {
    margin: 0 4px;
  }
}
</style>