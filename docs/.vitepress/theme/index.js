import DefaultTheme from "vitepress/theme";
import LayoutToggle from "../components/LayoutToggle.vue";
import "./styles/index.css";
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("LayoutToggle", LayoutToggle);
  },

  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 在导航栏添加布局切换按钮
      "nav-bar-content-after": () => h(LayoutToggle),
      // 或者在侧边栏顶部添加
      // 'aside-top': () => h(LayoutToggle),
      // 或者在文档内容顶部添加
      // 'doc-before': () => h(LayoutToggle)
    });
  },
};
