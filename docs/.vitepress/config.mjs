import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog/",
  title: "hello blog",
  description: "code blog",
  head: [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicon-180x180.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-180x180.png",
      },
    ],
    ["link", { rel: "shortcut icon", href: "/favicon-16x16.ico" }],
    /* 字体配置 */
    // ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    // [
    //   "link",
    //   { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    // ],
    // [
    //   "link",
    //   {
    //     href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
    //     rel: "stylesheet",
    //   },
    // ],
  ],
  outDir: ".vitepress/dist",
  srcDir: "src",
  themeConfig: {
    search: {
      provider: "local",
      options: {
        miniSearch: {
          options: {
            /* ... */
          },
          searchOptions: {
            /* ... */
          },
        },
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除搜索条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      { text: "java", link: "https://docs.ffffee.com" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
          { text: "Vue", link: "/vue/Vue3快速上手" },
          {
            text: "Java文档",
            collapsed: false, // 设置为false则默认展开
            items: [
              { text: "Java基础", link: "/java/basics" },
              {
                text: "Java进阶",
                collapsed: true, // 第二级可折叠
                items: [
                  { text: "多线程", link: "/java/advanced/multithreading" },
                  {
                    text: "设计模式",
                    collapsed: true, // 第三级可折叠
                    items: [
                      {
                        text: "创建型模式",
                        link: "/java/advanced/design-patterns/creational",
                      },
                      {
                        text: "结构型模式",
                        link: "/java/advanced/design-patterns/structural",
                      },
                      {
                        text: "行为型模式",
                        link: "/java/advanced/design-patterns/behavioral",
                      },
                    ],
                  },
                ],
              },
              { text: "Spring框架", link: "/java/spring" },
            ],
          },
          {
            text: "VitePress",
            collapsed: true,
            items: [
              { text: "快速开始", link: "/vitePress/VitePress快速开始" },
              { text: "部署上线", link: "/vitePress/VitePress部署上线" },
            ],
          },
          {
            text: "MySQL",
            collapsed: true,
            items: [
              { text: "MySQL 基础", link: "/MySQL/MySQL基本操作" },
              { text: "MySQL 函数", link: "/MySQL/MySQL函数" },
            ],
          },
          {
            text: "cursor",
            collapsed: true,
            items: [
              { text: "Cursor 无限续杯 Claude 3.5", link: "/cursor/MySQL基本操作" },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

    footer: {
      message: `<a href="https://beian.miit.gov.cn/" target="_blank">京ICP备20016634号-2</a>`,
      copyright: `版权所有 © 2019-${new Date().getFullYear()} hello`,
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // https://vitepress.dev/zh/reference/default-theme-config#outline
    outline: {
      level: [2, 3],
      label: "页面导航",
      collapsed: true, // 添加此行，设置大纲默认收缩
      position: "left", // 默认就是右侧，
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short", // full
        timeStyle: "short", // medium
      },
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },

  vite: {
    // https://cn.vitejs.dev/config/shared-options.html#publicdir
    publicDir: "../src/public", // 指定 public 目录路径
  },
});
