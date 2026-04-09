import { promises as fs } from "node:fs";
import path from "node:path";

const SRC_ROOT = path.resolve(process.cwd(), "docs", "src");
const EXCLUDED_DIRS = new Set(["public", ".vitepress"]);
const EXCLUDED_FILES = new Set(["index.md"]);
// 预留足够数量供首页按 Top N 动态筛选。
const MAX_ITEMS = 80;

const CATEGORY_MAP = {
  programming: "编程",
  software: "工具",
  AI: "AI",
  leisureTime: "休闲",
  nav: "导航",
};

// 将绝对路径转换为 VitePress 站内路由。
function toVitePressLink(absolutePath) {
  const relativePath = path.relative(SRC_ROOT, absolutePath).split(path.sep).join("/");
  const withoutExt = relativePath.replace(/\.md$/i, "");
  // 保留 /index，和站点 config.mjs 中显式路由风格保持一致。
  return withoutExt ? `/${encodeURI(withoutExt)}` : "/";
}

// 优先读取 frontmatter.title，其次读取一级标题，最后回退文件名。
function parseTitle(content, fileName) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch?.[1]) {
      return titleMatch[1].trim();
    }
  }

  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match?.[1]) {
    return h1Match[1].trim();
  }

  return fileName.replace(/\.md$/i, "").trim();
}

// 递归扫描所有 Markdown 文件。
async function walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        files.push(...(await walkMarkdownFiles(entryPath)));
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith(".md")) {
      continue;
    }

    if (EXCLUDED_FILES.has(entry.name)) {
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

// 根据一级目录映射文章分类标签。
function toCategory(absolutePath) {
  const relativePath = path.relative(SRC_ROOT, absolutePath).split(path.sep);
  const rootDir = relativePath[0] || "";
  return CATEGORY_MAP[rootDir] || "其他";
}

export default {
  // 在构建阶段加载最近更新数据。
  async load() {
    const mdFiles = await walkMarkdownFiles(SRC_ROOT);

    const records = await Promise.all(
      mdFiles.map(async (filePath) => {
        const [stat, content] = await Promise.all([
          fs.stat(filePath),
          fs.readFile(filePath, "utf8"),
        ]);

        return {
          title: parseTitle(content, path.basename(filePath)),
          link: toVitePressLink(filePath),
          updatedAt: stat.mtimeMs,
          updatedText: new Intl.DateTimeFormat("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(stat.mtime),
          category: toCategory(filePath),
        };
      }),
    );

    return records
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_ITEMS)
      .map(({ updatedAt, ...rest }) => rest);
  },
};
