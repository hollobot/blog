<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)
const isClosing = ref(false)

// 延迟显示公告，避免首屏闪烁
onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, 500)
})

function closeNotice() {
  isClosing.value = true
  setTimeout(() => {
    visible.value = false
    isClosing.value = false
  }, 300)
}

// 5秒后自动关闭
setTimeout(() => {
  if (visible.value) {
    closeNotice()
  }
}, 5000)
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="notice-backdrop" @click="closeNotice"></div>
  </Transition>
  
  <Transition name="slide-up">
    <div v-if="visible" class="notice-container" :class="{ closing: isClosing }">
      <!-- 关闭按钮 -->
      <button class="notice-close" @click="closeNotice" aria-label="关闭公告">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- 头部 -->
      <div class="notice-header">
        <div class="notice-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  fill="url(#gradient)" />
            <path d="M12 8V12M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round" />
            <defs>
              <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22">
                <stop offset="0%" stop-color="#1e69f5" />
                <stop offset="100%" stop-color="#093ce5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3 class="notice-title">欢迎来到 Hello 的日志</h3>
        <p class="notice-subtitle">感谢您的访问 🎉</p>
      </div>

      <!-- 内容 -->
      <div class="notice-content">
        <div class="notice-item">
          <span class="item-label">📝 最新动态</span>
          <span class="item-value">全新公告样式上线，界面更加美观</span>
        </div>
        
        <div class="notice-item">
          <span class="item-label">👤 关于我</span>
          <span class="item-value">昵称：Hello</span>
        </div>

        <div class="notice-links">
          <a href="mailto:2380983020@qq.com" class="link-item" target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>联系邮箱</span>
          </a>
          
          <a href="https://github.com/hollobot" class="link-item" target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>

        <div class="notice-tip">
          <span>💡 提示：本公告将在 5 秒后自动关闭</span>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="notice-footer">
        <button class="notice-btn" @click="closeNotice">
          <span>知道了</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(calc(-50% + 30px)) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(calc(-50% - 20px)) scale(0.98);
}

/* 背景遮罩 */
.notice-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

/* 公告容器 */
.notice-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 460px;
  max-width: 90vw;
  max-height: 85vh;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dark .notice-container {
  background: #1e1e1e;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* 关闭按钮 */
.notice-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #666;
  z-index: 1;
}

.notice-close:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
  color: #333;
}

.dark .notice-close {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
}

.dark .notice-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* 头部 */
.notice-header {
  padding: 32px 32px 24px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .notice-header {
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notice-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.notice-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
  line-height: 1.3;
}

.dark .notice-title {
  color: #ffffff;
}

.notice-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.dark .notice-subtitle {
  color: #999;
}

/* 内容区域 */
.notice-content {
  padding: 24px 32px;
  overflow-y: auto;
  flex: 1;
}

.notice-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 12px;
  border-left: 3px solid #1e69f5;
}

.dark .notice-item {
  background: #2a2a2a;
  border-left-color: #3b82f6;
}

.item-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e69f5;
}

.dark .item-label {
  color: #3b82f6;
}

.item-value {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.dark .item-value {
  color: #d1d5db;
}

/* 链接区域 */
.notice-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 16px 0;
}

.link-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.link-item:hover {
  background: #f8f9fa;
  border-color: #1e69f5;
  color: #1e69f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 105, 245, 0.15);
}

.dark .link-item {
  background: #2a2a2a;
  border-color: #404040;
  color: #d1d5db;
}

.dark .link-item:hover {
  background: #333;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 提示信息 */
.notice-tip {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border-radius: 10px;
  text-align: center;
}

.dark .notice-tip {
  background: linear-gradient(135deg, #2d2416 0%, #382a1a 100%);
}

.notice-tip span {
  font-size: 13px;
  color: #d97706;
}

.dark .notice-tip span {
  color: #fbbf24;
}

/* 底部 */
.notice-footer {
  padding: 20px 32px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .notice-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.notice-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e69f5 0%, #093ce5 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 105, 245, 0.3);
}

.notice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 105, 245, 0.4);
  background: linear-gradient(135deg, #2575fc 0%, #1660e8 100%);
}

.notice-btn:active {
  transform: translateY(0);
}

/* 响应式 */
@media (max-width: 640px) {
  .notice-container {
    width: 92vw;
    max-height: 90vh;
  }

  .notice-header {
    padding: 24px 20px 20px;
  }

  .notice-content {
    padding: 20px;
  }

  .notice-footer {
    padding: 16px 20px 20px;
  }

  .notice-title {
    font-size: 20px;
  }

  .notice-links {
    grid-template-columns: 1fr;
  }

  .notice-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>