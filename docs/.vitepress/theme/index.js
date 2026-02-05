import DefaultTheme from "vitepress/theme";
import LayoutToggle from "../components/LayoutToggle.vue";
import "./styles/index.css";
import "virtual:group-icons.css"; // 代码组样式
import { h } from "vue";

// 只需添加以下一行代码，引入时间线样式
import "vitepress-markdown-timeline/dist/theme/index.css";

// 图片预览缩放功能
import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";
import { useRoute, useData } from "vitepress";

// 访问量统计功能
import { inBrowser } from "vitepress";
import busuanzi from "busuanzi.pure.js";

// 进度条组件
import { NProgress } from "nprogress-v2/dist/index.js";
import "nprogress-v2/dist/index.css";

import bsz from "../components/bsz.vue";

// giscus 评论组件
import giscusTalk from "vitepress-plugin-comment-with-giscus";

// 文章元信息组件、文字数、阅读时间等
import ArticleMetadata from "../components/ArticleMetadata.vue";

// 放回顶部
import backtotop from "../components/backtotop.vue";

// 公告
import notice from "../components/notice.vue";

// 导航链接组件
import MNavLinks from "./components/MNavLinks.vue";

export default {
  extends: DefaultTheme,

  // 合并所有 enhanceApp 逻辑
  enhanceApp({ app, router }) {
    // 注册全局组件
    app.component("LayoutToggle", LayoutToggle);
    app.component("ArticleMetadata", ArticleMetadata);
    app.component("MNavLinks", MNavLinks);

    // 访问量统计 + 进度条
    if (inBrowser) {
      // 配置进度条
      NProgress.configure({ showSpinner: false });

      // 路由变化前 - 开始进度条
      router.onBeforeRouteChange = () => {
        NProgress.start();
      };

      // 路由变化后 - 停止进度条 + 更新访问统计
      router.onAfterRouteChanged = () => {
        busuanzi.fetch();
        NProgress.done();
      };
    }
  },

  // 图片预览缩放功能
  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };

    // Get frontmatter and route
    const { frontmatter } = useData();

    // giscus配置
    giscusTalk(
      {
        repo: "hollobot/log", //仓库
        repoId: "R_kgDOOulU_w", //仓库ID
        category: "General", // 讨论分类
        categoryId: "DIC_kwDOOulU_84Cx0GE", //讨论分类ID
        mapping: "pathname",
        inputPosition: "bottom",
        lang: "zh-CN",
      },
      {
        frontmatter,
        route,
      },
      //默认值为true，表示已启用，此参数可以忽略；
      //如果为false，则表示未启用
      //您可以使用“comment:true”序言在页面上单独启用它
      true,
    );

    onMounted(() => {
      initZoom();
    });

    watch(
      () => route.path,
      () => nextTick(() => initZoom()),
    );
  },

  Layout() {
    const props = {};
    // 获取 frontmatter
    const { frontmatter } = useData();

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(DefaultTheme.Layout, null, {
      // 在导航栏添加布局切换按钮
      "nav-bar-content-after": () => h(LayoutToggle),
      // 指定组件使用 layout-bottom 插槽，显示在每个页面的底部
      "layout-bottom": () => h(bsz),
      // 指定组件使用doc-footer-before插槽
      "doc-footer-before": () => h(backtotop),
      // 指定组件使用layout-top插槽
      "layout-top": () => h(notice),
    });
  },
};
