import { defineConfig } from "vitepress";
import timeline from "vitepress-markdown-timeline";
import markdownItTaskCheckbox from "markdown-it-task-checkbox";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

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
        href: "/blog/favicon-180x180.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/blog/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/blog/favicon-16x16.png",
      },
    ],
    ["link", { rel: "shortcut icon", href: "/blog/favicon.ico" }],
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
        link: "/programming/java/JavaSE",
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
              text: "数据结构",
              collapsed: true,
              items: [
                {
                  text: "数组与链表",
                  link: "/programming/数据结构/数组与链表",
                },
                {
                  text: "栈与队列",
                  link: "/programming/数据结构/栈与队列",
                },
                {
                  text: "哈希表",
                  link: "/programming/数据结构/哈希表",
                },
                {
                  text: "树",
                  link: "/programming/数据结构/树",
                },
                {
                  text: "堆",
                  link: "/programming/数据结构/堆",
                },
                {
                  text: "图",
                  link: "/programming/数据结构/图",
                },
              ],
            },
            {
              text: "Java",
              collapsed: true, // 设置为false则默认展开
              items: [
                { text: "安装 Java", link: "/programming/java/安装 Java" },
                { text: "Java 基础", link: "/programming/java/JavaSE" },
                { text: "并发编程", link: "/programming/java/并发编程" },
                { text: "Java 小技巧", link: "/programming/java/java 小技巧" },
              ],
            },
            {
              text: "MySQL",
              collapsed: true,
              items: [
                {
                  text: "MySQL 安装",
                  link: "/programming/MySQL/MySQL 安装",
                },
                {
                  text: "MySQL 基础",
                  link: "/programming/MySQL/MySQL基本操作",
                },
                { text: "MySQL 函数", link: "/programming/MySQL/MySQL函数" },
                { text: "索引", link: "/programming/MySQL/索引" },
                { text: "事务", link: "/programming/MySQL/事务" },
                { text: "锁", link: "/programming/MySQL/锁" },
              ],
            },
            {
              text: "Redis",
              collapsed: true,
              items: [
                {
                  text: "Redis 安装",
                  link: "/programming/Redis/Redis 安装",
                },
                {
                  text: "Redis 入门",
                  link: "/programming/Redis/Redis 入门",
                },
                {
                  text: "Redis 使用场景",
                  link: "/programming/Redis/Redis 使用场景",
                },
                {
                  text: "分布式缓存",
                  link: "/programming/Redis/分布式缓存",
                },
                {
                  text: "Redis 实践",
                  link: "/programming/Redis/Redis 实践",
                },
              ],
            },
            {
              text: "MyBatis",
              collapsed: true,
              items: [
                {
                  text: "Mybatis 配置",
                  link: "/programming/mybatis/MyBatis 配置",
                },
                {
                  text: "Mybatis 分页",
                  link: "/programming/mybatis/MyBatis 分页",
                },
                {
                  text: "Mybatis 组件",
                  link: "/programming/mybatis/MyBatis 组件",
                },
              ],
            },
            {
              text: "Mybatis-Plus",
              collapsed: true,
              items: [
                {
                  text: "快速开始",
                  link: "/programming/mybatis-plus/快速开始",
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
                {
                  text: "AOP",
                  link: "/programming/spring/AOP",
                },
              ],
            },
            {
              text: "Spring Cloud",
              collapsed: true,
              items: [
                {
                  text: "快速开始",
                  link: "/programming/Spring Cloud/快速开始",
                },
              ],
            },
            {
              text: "Design Pattern",
              collapsed: true,
              items: [
                {
                  text: "单例模式",
                  link: "/programming/设计模式/单例模式",
                },
                {
                  text: "工厂模式",
                  link: "/programming/设计模式/工厂模式",
                },
                {
                  text: "策略模式",
                  link: "/programming/设计模式/策略模式",
                },
                {
                  text: "观察者模式",
                  link: "/programming/设计模式/观察者模式",
                },
              ],
            },
            {
              text: "Jvm",
              collapsed: true,
              items: [
                {
                  text: "jvm 基础",
                  link: "/programming/jvm/jvm",
                },
              ],
            },
            {
              text: "Vue",
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
              text: "Electron",
              collapsed: true,
              items: [{ text: "ipc 通讯", link: "/programming/electron/ipc" }],
            },

            {
              text: "VitePress",
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
              text: "Git",
              collapsed: true,
              items: [
                {
                  text: "git 快速上手",
                  link: "/programming/git/Git 基本命令速查表",
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
              text: "Linux",
              collapsed: true,
              items: [
                {
                  text: "基本指令",
                  link: "/programming/linux/linux",
                },
                {
                  text: "配置虚拟机",
                  link: "/programming/linux/配置虚拟机",
                },
                {
                  text: "docker",
                  link: "/programming/linux/docker",
                },
              ],
            },
            {
              text: "面试",
              collapsed: true,
              items: [
                {
                  text: "Java 基础",
                  link: "/programming/面试/Java 基础",
                },
                {
                  text: "Java 集合",
                  link: "/programming/面试/Java 集合",
                },
                {
                  text: "Java 并发",
                  link: "/programming/面试/Java 并发",
                },
                {
                  text: "Jvm 虚拟机",
                  link: "/programming/面试/Jvm 虚拟机",
                },
                {
                  text: "MySQL 面试题",
                  link: "/programming/面试/MySQL",
                },
                {
                  text: "MyBatis 面试题",
                  link: "/programming/面试/MyBatis 面试题",
                },
                {
                  text: "Redis 面试题",
                  link: "/programming/面试/Redis 面试题",
                },
                {
                  text: "Spring 面试题",
                  link: "/programming/面试/Spring 面试题",
                },
                {
                  text: "Vue 面试",
                  link: "/programming/面试/Vue 面试",
                },
                {
                  text: "简历面试题",
                  link: "/programming/面试/简历面试题",
                },
                {
                  text: "项目难点",
                  link: "/programming/面试/项目难点",
                },
                {
                  text: "面试题",
                  link: "/programming/面试/面试题",
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
          text: "工具",
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
            {
              text: "network",
              collapsed: true,
              items: [
                {
                  text: "内网穿透",
                  link: "/software/network/内网穿透",
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

    socialLinks: [{ icon: "github", link: "https://github.com/hollobot" }],

    footer: {
      copyright: `版权所有 © 2025-${new Date().getFullYear()} hello`,
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // https://vitepress.dev/zh/reference/default-theme-config#outline
    outline: {
      level: [2, 3], // 控制显示标题的级别，默认值是 [2, 3]
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
    plugins: [
      groupIconVitePlugin(), //代码组图标
    ],
  },

  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    //行号显示
    lineNumbers: true,

    config: (md) => {
      md.use(timeline); //时间线
      md.use(markdownItTaskCheckbox); //任务列表
      md.use(groupIconMdPlugin); //代码组图标
      // 在这里添加自定义的 Markdown 规则、文字数、阅读时间、跟新时间
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === "h1") htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      };
    },
  },
});
