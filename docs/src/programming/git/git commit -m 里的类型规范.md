# git commit -m 里的 “类型规范”

## 一、标准格式

```bash
git commit -m "type: 描述"
```

进阶一点：

```bash
git commit -m "type(scope): 描述"
```

示例：

```bash
git commit -m "feat: 新增家长课目标计算逻辑"
git commit -m "fix: 修复家长课标准值计算错误"
```



## 二、常见 type（必须掌握🔥）

| 类型 | 核心含义 | 适用场景 | 示例 | 判断要点 |
| --- | --- | --- | --- | --- |
| `feat` |  新功能  | 新增 API 接口、新增页面/组件、新增配置项、对现有功能做显著行为扩展 | `feat: 新增 OAuth 登录`<br>`feat(api): 新增批量下载接口` | 用户/调用方能感知到「多了什么」 |
| `fix` | 缺陷修复 | 修复空指针/越界异常、接口数据错误、功能在特定条件下失效、样式错位、修改某个功能使其符合原设计预期 | `fix: 修复列表为空时崩溃`<br>`fix(login): 修复重复点击提交` | 有「不符合预期的行为」被纠正，不管是 bug 还是功能偏差 |
| `refactor` | 重构 | 改善代码结构/可读性、拆分大函数、消除重复代码、变量/函数改名，外部行为不变 | `refactor: 拆分 UserService`<br>`refactor(order): 简化折扣计算` | 既不修 bug 也不加功能；若行为有变则用 `fix`/`feat` |
| `perf` | 性能优化 | 减少查询次数、加缓存、优化算法复杂度、懒加载、减小包体积 | `perf: 列表接口增加分页缓存`<br>`perf(img): 首屏图片改为懒加载` | 有可量化的性能收益，逻辑语义不变 |
| `style` | 代码格式 | 缩进、空格、换行、分号、lint 自动修复，不影响任何运行逻辑 | `style: 统一使用单引号`<br>`style: 修复 ESLint 警告` | diff 只有格式噪音，逻辑完全不变 |
| `test` | 测试 | 新增/修改单元测试、集成测试、E2E 测试、测试工具配置，不改业务代码 | `test: 补充 OrderService 单元测试`<br>`test(auth): 新增登录失败场景` | 只动测试文件 |
| `docs` | 文档变更 | 修改 README、注释、接口文档、Wiki、CHANGELOG，不涉及任何逻辑代码 | `docs: 更新部署说明`<br>`docs(api): 补充鉴权字段描述` | 只改文档，代码逻辑零变动 |
| `chore` | 杂项 | 升级/新增依赖、修改 `.gitignore`、脚本工具、项目配置，不影响业务逻辑 | `chore: 升级 lodash 至 4.17.21`<br>`chore: 添加 husky pre-commit 钩子` | 既不是业务代码也不是构建/CI，属于日常维护 |
| `build` | 构建系统 | 修改 webpack/vite/rollup 配置、Dockerfile、Maven/Gradle 构建脚本 | `build: 开启 tree-shaking`<br>`build: 多阶段 Docker 镜像优化` | 影响「如何构建/打包」产物 |
| `ci` | CI/CD | 修改 GitHub Actions、Jenkins、GitLab CI 流水线，部署脚本 | `ci: 新增 PR 自动代码检查`<br>`ci: 修复 release 流水线超时` | 只影响自动化流程，不影响业务代码 |
| `revert` | 回滚提交 | 撤销之前某次提交，通常由 `git revert` 自动生成 | `revert: revert "feat: 新增导出功能"` | 明确回滚来源，保留操作记录 |

> **常见纠结点**
> - **改了一个功能** → 修复偏差用 `fix`，扩展能力用 `feat`，优化实现用 `refactor`
> - **fix vs refactor** → 有不符合预期的行为用 `fix`；行为正确只是代码丑用 `refactor`
> - **feat vs refactor** → 对外行为变了用 `feat`；只是内部重写用 `refactor`
> - **chore vs build** → 改打包工具/脚本用 `build`；改依赖/工具配置用 `chore`

## 三、你这个项目的真实例子（直接能用）

### 👉 你刚写的逻辑

```bash
git commit -m "feat: 新增家长课目标值和标准值计算"
```

------

### 👉 修 bug

```bash
git commit -m "fix: 修复标准值未区分天数的问题"
```

------

### 👉 优化代码

```bash
git commit -m "refactor: 优化家长课计算逻辑结构"
```

------

### 👉 UI 修改

```bash
git commit -m "style: 调整表格展示样式"
```

------

##  四、scope（可选但推荐）

格式：

```bash
git commit -m "type(模块): 描述"
```

示例：

```bash
git commit -m "feat(teacher): 新增家长课统计逻辑"
git commit -m "fix(controller): 修复接口返回异常"
git commit -m "refactor(service): 优化计算逻辑"
```

------

##  五、推荐你用的规范（简单版）

👉 日常开发直接用这 3 个就够：

```bash
feat     # 新功能
fix      # 修bug
refactor # 优化
```