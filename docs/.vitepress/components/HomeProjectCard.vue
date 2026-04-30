<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  url: string
  appName: string
  version: string
  fileName: string
  description: string
  detailLink?: string
}

const props = defineProps<Props>()

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

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:none;opacity:0;pointer-events:none'
  iframe.referrerPolicy = 'no-referrer'

  iframe.onload = () => {
    try {
      // 文件下载：浏览器拦截后 iframe 停留在 about:blank（同源，无异常）。
      // 错误 HTML：iframe 加载跨域错误页，访问 location 抛 SecurityError。
      void iframe.contentWindow?.location?.href
    } catch {
      showError('文件下载失败，服务器返回了错误响应，请稍后重试')
    }
    iframe.parentNode?.removeChild(iframe)
  }

  iframe.src = props.url
  document.body.appendChild(iframe)
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
    // 第一步：cors 模式，配置了 CORS 时可读状态码。
    const response = await fetch(props.url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timer)
    if (!response.ok) { showError(`服务器返回 ${response.status}，请稍后重试`); return }
    triggerDownload()
  } catch (err: unknown) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      showError('连接超时，请稍后再试')
      return
    }

    // 第二步：no-cors 区分"CORS 拦截（服务器在线）"和"网络不可达（服务器宕机）"。
    const controller2 = new AbortController()
    const timer2 = setTimeout(() => controller2.abort(), 4000)
    try {
      await fetch(props.url, { method: 'HEAD', mode: 'no-cors', signal: controller2.signal })
      clearTimeout(timer2)
      triggerDownload()
    } catch (err2: unknown) {
      clearTimeout(timer2)
      if (err2 instanceof Error && err2.name === 'AbortError')
        showError('连接超时，请稍后再试')
      else
        showError('下载服务器暂时不可用，请稍后重试')
    }
  }
}
</script>

<template>
  <div class="hpc-card">
    <!-- 左侧：项目信息 -->
    <div class="hpc-left">
      <div class="hpc-icon-wrap">
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
      <div class="hpc-info">
        <div class="hpc-title-row">
          <span class="hpc-name">{{ appName }}</span>
          <span class="hpc-version">v{{ version }}</span>
          <span class="hpc-badge">Windows</span>
        </div>
        <p class="hpc-desc">{{ description }}</p>
        <a v-if="detailLink" :href="detailLink" class="hpc-detail-link">查看项目详情 →</a>
      </div>
    </div>

    <!-- 右侧：下载按钮 -->
    <div class="hpc-right">
      <button
        class="hpc-btn"
        :class="`hpc-btn--${status}`"
        :disabled="status === 'checking'"
        @click="handleDownload"
      >
        <!-- 闲置 -->
        <template v-if="status === 'idle'">
          <svg viewBox="0 0 24 24" fill="none" class="hpc-btn-ico">
            <path d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z" fill="currentColor" />
          </svg>
          下载安装包
        </template>

        <!-- 检测中 -->
        <template v-else-if="status === 'checking'">
          <span class="hpc-spin" />
          检测中…
        </template>

        <!-- 就绪 -->
        <template v-else-if="status === 'ready'">
          <svg viewBox="0 0 24 24" fill="none" class="hpc-btn-ico">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
          </svg>
          开始下载
        </template>

        <!-- 错误 -->
        <template v-else-if="status === 'error'">
          <svg viewBox="0 0 24 24" fill="none" class="hpc-btn-ico">
            <path
              d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="currentColor"
            />
          </svg>
          不可用
        </template>
      </button>

      <!-- 错误提示（按钮下方） -->
      <Transition name="hpc-fade">
        <p v-if="status === 'error'" class="hpc-error-tip">
          ⚠ {{ errorMsg }}
        </p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* ── 卡片：复用首页 home-card 渐变风格 ── */
.hpc-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(70, 98, 217, 0.12) 0%, rgba(70, 98, 217, 0) 60%),
    var(--vp-c-bg-soft);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  flex-wrap: wrap;
  margin: 12px 0 22px;
}

.hpc-card:hover {
  transform: translateY(-2px);
  border-color: #9ab0ef;
  box-shadow: 0 10px 28px rgba(30, 62, 156, 0.1);
}

/* ── 左侧 ── */
.hpc-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.hpc-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #7b97f5 100%);
  flex-shrink: 0;
  color: white;
}

.hpc-icon-wrap svg {
  width: 24px;
  height: 24px;
}

.hpc-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.hpc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.hpc-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.hpc-version {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.hpc-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 99px;
  background: rgba(70, 98, 217, 0.1);
  color: var(--vp-c-brand-1);
}

.hpc-desc {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.hpc-detail-link {
  font-size: 12px;
  font-weight: 600;
  color: #3654c7;
  text-decoration: none;
}

.hpc-detail-link:hover {
  text-decoration: underline;
}

/* ── 右侧 ── */
.hpc-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

/* ── 按钮 ── */
.hpc-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  white-space: nowrap;
}

.hpc-btn--idle {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.hpc-btn--idle:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(70, 98, 217, 0.3);
}

.hpc-btn--checking {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  cursor: not-allowed;
}

.hpc-btn--ready {
  background: #22c55e;
  color: #fff;
}

.hpc-btn--error {
  background: var(--vp-c-red-1);
  color: #fff;
}

.hpc-btn-ico {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* 旋转加载器 */
.hpc-spin {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid var(--vp-c-text-3);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: hpc-spin 0.75s linear infinite;
  flex-shrink: 0;
}

@keyframes hpc-spin {
  to { transform: rotate(360deg); }
}

/* 错误提示 */
.hpc-error-tip {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-red-1);
  text-align: right;
}

/* 过渡 */
.hpc-fade-enter-active,
.hpc-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.hpc-fade-enter-from,
.hpc-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── 移动端 ── */
@media (max-width: 540px) {
  .hpc-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .hpc-right {
    width: 100%;
    align-items: stretch;
  }

  .hpc-btn {
    width: 100%;
    justify-content: center;
  }

  .hpc-error-tip {
    text-align: left;
  }
}
</style>
