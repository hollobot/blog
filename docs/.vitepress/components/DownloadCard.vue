<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  url: string
  appName?: string
  version?: string
  fileName?: string
  platform?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  appName: 'SwiftChat',
  version: '2.1.2',
  fileName: 'SwiftChat Setup 2.1.2.exe',
  platform: 'Windows',
  description: '跨平台桌面即时通讯客户端',
})

type Status = 'idle' | 'checking' | 'ready' | 'error'

const status = ref<Status>('idle')
const errorMsg = ref('')

function showError(msg: string) {
  status.value = 'error'
  errorMsg.value = msg
  setTimeout(() => { status.value = 'idle' }, 5000)
}

function triggerDownload() {
  status.value = 'ready'

  // 用隐藏 iframe 触发下载，避免跨域 <a download> 失效时导致页面跳转。
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:none;opacity:0;pointer-events:none'

  iframe.onload = () => {
    try {
      // 文件下载：浏览器拦截下载后 iframe 停留在 about:blank（同源可访问，无异常）。
      // 错误 HTML：iframe 加载跨域错误页，访问 location 抛 SecurityError。
      void iframe.contentWindow?.location?.href
    } catch {
      showError('文件下载失败，服务器返回了错误响应，请稍后重试')
    }
    iframe.parentNode?.removeChild(iframe)
  }

  iframe.src = props.url
  document.body.appendChild(iframe)
  // 60s 后兜底清理（大文件下载期间保持存在）
  setTimeout(() => { iframe.parentNode?.removeChild(iframe) }, 60_000)
  setTimeout(() => { status.value = 'idle' }, 3000)
}

async function handleDownload() {
  if (status.value === 'checking') return

  status.value = 'checking'
  errorMsg.value = ''

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    // 第一步：cors 模式，服务器配置了 CORS 时可直接读取状态码。
    const response = await fetch(props.url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timer)
    if (!response.ok) { showError(`服务器返回 ${response.status}，请稍后重试`); return }
    triggerDownload()
  } catch (err: unknown) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      showError('连接超时，服务器可能正在维护，请稍后再试')
      return
    }

    // cors 模式抛出：可能是 CORS 错误（服务器在线）或网络错误（服务器宕机）。
    // 第二步：用 no-cors 再探一次，区分两种情况。
    const controller2 = new AbortController()
    const timer2 = setTimeout(() => controller2.abort(), 4000)
    try {
      await fetch(props.url, { method: 'HEAD', mode: 'no-cors', signal: controller2.signal })
      clearTimeout(timer2)
      // no-cors 成功 = 服务器在线，仅 CORS 策略拦截了第一次请求，继续下载
      triggerDownload()
    } catch (err2: unknown) {
      clearTimeout(timer2)
      if (err2 instanceof Error && err2.name === 'AbortError')
        showError('连接超时，服务器可能正在维护，请稍后再试')
      else
        showError('下载服务器暂时不可用，请稍后重试')
    }
  }
}
</script>

<template>
  <div class="dc-wrap">
    <div class="dc-card" :class="{ 'is-error': status === 'error' }">
      <!-- 左侧：图标 + 软件信息 -->
      <div class="dc-info">
        <div class="dc-icon-box">
          <!-- 聊天气泡图标 -->
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              fill="currentColor"
            />
            <circle cx="8" cy="10" r="1.2" fill="white" />
            <circle cx="12" cy="10" r="1.2" fill="white" />
            <circle cx="16" cy="10" r="1.2" fill="white" />
          </svg>
        </div>
        <div class="dc-meta">
          <span class="dc-name">{{ appName }}</span>
          <div class="dc-tags">
            <span class="dc-tag dc-tag--version">v{{ version }}</span>
            <span class="dc-tag dc-tag--platform">{{ platform }}</span>
          </div>
          <span class="dc-desc">{{ description }}</span>
        </div>
      </div>

      <!-- 右侧：下载按钮 -->
      <button
        class="dc-btn"
        :class="`dc-btn--${status}`"
        :disabled="status === 'checking'"
        @click="handleDownload"
      >
        <!-- 闲置 -->
        <template v-if="status === 'idle'">
          <svg class="dc-btn-ico" viewBox="0 0 24 24" fill="none">
            <path d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z" fill="currentColor" />
          </svg>
          下载安装包
        </template>

        <!-- 检测中 -->
        <template v-else-if="status === 'checking'">
          <span class="dc-spin" />
          检测服务器…
        </template>

        <!-- 就绪 / 下载中 -->
        <template v-else-if="status === 'ready'">
          <svg class="dc-btn-ico" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
          </svg>
          开始下载
        </template>

        <!-- 错误 -->
        <template v-else-if="status === 'error'">
          <svg class="dc-btn-ico" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="currentColor"
            />
          </svg>
          服务不可用
        </template>
      </button>
    </div>

    <!-- 错误提示条（带过渡动画） -->
    <Transition name="dc-fade-down">
      <div v-if="status === 'error'" class="dc-error-bar">
        <svg viewBox="0 0 24 24" fill="none" class="dc-err-ico">
          <path
            d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
            fill="currentColor"
          />
        </svg>
        {{ errorMsg }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ── 外层 ── */
.dc-wrap {
  margin: 24px 0;
}

/* ── 卡片 ── */
.dc-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: border-color 0.25s, box-shadow 0.25s;
  flex-wrap: wrap;
}

.dc-card:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 6px 20px rgba(70, 98, 217, 0.08);
}

.dc-card.is-error {
  border-color: var(--vp-c-red-2);
}

/* ── 左侧信息 ── */
.dc-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 图标容器 */
.dc-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #7b97f5 100%);
  flex-shrink: 0;
  color: white;
}

.dc-icon-box svg {
  width: 26px;
  height: 26px;
}

/* 文字信息 */
.dc-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dc-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1;
}

.dc-tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dc-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  line-height: 1.6;
}

.dc-tag--version {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
}

.dc-tag--platform {
  background: rgba(70, 98, 217, 0.1);
  color: var(--vp-c-brand-1);
}

.dc-desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* ── 下载按钮 ── */
.dc-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  white-space: nowrap;
  min-width: 140px;
  justify-content: center;
}

.dc-btn--idle {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.dc-btn--idle:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(70, 98, 217, 0.28);
}

.dc-btn--idle:active {
  transform: translateY(0);
}

.dc-btn--checking {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  cursor: not-allowed;
}

.dc-btn--ready {
  background: #22c55e;
  color: #fff;
}

.dc-btn--error {
  background: var(--vp-c-red-1);
  color: #fff;
}

.dc-btn-ico {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* 旋转加载器 */
.dc-spin {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-text-3);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: dc-spin 0.75s linear infinite;
  flex-shrink: 0;
}

@keyframes dc-spin {
  to { transform: rotate(360deg); }
}

/* ── 错误提示条 ── */
.dc-error-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-red-2);
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-1);
  font-size: 13px;
  line-height: 1.5;
}

.dc-err-ico {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* ── 过渡动画 ── */
.dc-fade-down-enter-active,
.dc-fade-down-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.dc-fade-down-enter-from,
.dc-fade-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── 移动端适配 ── */
@media (max-width: 520px) {
  .dc-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .dc-btn {
    width: 100%;
  }
}
</style>
