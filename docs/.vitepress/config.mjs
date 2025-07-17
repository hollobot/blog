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
      {
        text: "编程",
        link: "/programming/java/java",
      },
      { text: "工具", link: "/software/cursor/cursor" },
      { text: "休闲", link: "/leisureTime/minecraft/药水篇" },
    ],

    sidebar: {
      "/programming/": [
        {
          text: "编程",
          items: [
            {
              text: "java",
              collapsed: true, // 设置为false则默认展开
              items: [{ text: "Java基础", link: "/programming/java/java" }],
            },
            {
              text: "vue",
              collapsed: true, // 设置为false则默认展开
              items: [
                { text: "快速开始", link: "/programming/vue/快速开始" },
                { text: "router", link: "/programming/vue/router" },
                { text: "组件通信", link: "/programming/vue/组件通信" },
                { text: "pinia ", link: "/programming/vue/pinia " },
                { text: "slot ", link: "/programming/vue/slot " },
                { text: "其他 API", link: "/programming/vue/其他 API" },
                { text: "vue3新组件", link: "/programming/vue/vue3新组件" },
                { text: "vue 随笔", link: "/programming/vue/vue 随笔" },
                {
                  text: "JavaScript 随笔",
                  link: "/programming/vue/JavaScript 随笔",
                },
              ],
            },

            {
              text: "vitePress",
              collapsed: true,
              items: [
                {
                  text: "快速开始",
                  link: "/programming/vitePress/VitePress快速开始",
                },
                {
                  text: "部署上线",
                  link: "/programming/vitePress/VitePress部署上线",
                },
              ],
            },
            {
              text: "mysql",
              collapsed: true,
              items: [
                {
                  text: "MySQL 基础",
                  link: "/programming/MySQL/MySQL基本操作",
                },
                { text: "MySQL 函数", link: "/programming/MySQL/MySQL函数" },
              ],
            },
            {
              text: "git",
              collapsed: true,
              items: [
                {
                  text: "git 快速上手",
                  link: "/programming/git/Git 基本命令速查表",
                },
              ],
            },
            {
              text: "electron",
              collapsed: true,
              items: [{ text: "ipc 通讯", link: "/programming/electron/ipc" }],
            },
            {
              text: "mybatis",
              collapsed: true,
              items: [
                {
                  text: "mybatis配置",
                  link: "/programming/mybatis/mybatis配置",
                },
                {
                  text: "springboot 整合mybatis分页",
                  link: "/programming/mybatis/springboot 整合mybatis分页",
                },
              ],
            },
            {
              text: "mybatis-plus",
              collapsed: true,
              items: [
                {
                  text: "快速开始",
                  link: "/programming/mybatis-plus/快速开始",
                },
              ],
            },
            {
              text: "spring cloud",
              collapsed: true,
              items: [
                {
                  text: "快速入门",
                  link: "/programming/Spring Cloud/Spring Cloud 快速入门",
                },
              ],
            },
            {
              text: "npm",
              collapsed: true,
              items: [
                {
                  text: "基本指令",
                  link: "/programming/npm/npm",
                },
              ],
            },
            {
              text: "linux",
              collapsed: true,
              items: [
                {
                  text: "基本指令",
                  link: "/programming/linux/linux",
                },
              ],
            },
            {
              text: "Spring",
              collapsed: true,
              items: [
                {
                  text: "注解",
                  link: "/programming/spring/Spring相关注解",
                },
              ],
            },
            {
              text: "redis",
              collapsed: true,
              items: [
                {
                  text: "redis 基本操作",
                  link: "/programming/redis/redis基本操作",
                },
              ],
            },
            {
              text: "面试",
              collapsed: true,
              items: [
                {
                  text: "简历面试题",
                  link: "/programming/面试/简历面试题",
                },
                {
                  text: "mysql面试",
                  link: "/programming/面试/mysql面试",
                },
                {
                  text: "vue面试",
                  link: "/programming/面试/vue面试",
                },
              ],
            },
            {
              text: "项目",
              collapsed: true,
              items: [
                {
                  text: "即时通讯系统",
                  link: "/programming/project/chat",
                },
              ],
            },
          ],
        },
      ],
      "/software/": [
        {
          text: "软件",
          items: [
            {
              text: "cursor",
              collapsed: true,
              items: [
                {
                  text: "Cursor 无限续杯 Claude 3.5",
                  link: "/software/cursor/cursor",
                },
              ],
            },
            {
              text: "idea",
              collapsed: true,
              items: [
                {
                  text: "idea 无限重置试用30天",
                  link: "/software/idea/idea",
                },
              ],
            },
          ],
        },
      ],
      "/leisureTime/": [
        {
          text: "休闲",
          items: [
            {
              text: "minecraft",
              collapsed: true,
              items: [
                {
                  text: "药水篇",
                  link: "/leisureTime/minecraft/药水篇",
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/hollobot" },
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
      level: [2, 5],
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
