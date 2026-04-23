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

| 类型     | 含义                   | 示例                   |
| -------- | ---------------------- | ---------------------- |
| feat     | 新功能                 | feat: 新增用户登录     |
| fix      | 修复bug                | fix: 修复空指针异常    |
| docs     | 文档                   | docs: 更新README       |
| style    | 代码格式（不影响逻辑） | style: 格式优化        |
| refactor | 重构（不改功能）       | refactor: 优化计算逻辑 |
| perf     | 性能优化               | perf: 提升查询效率     |
| test     | 测试                   | test: 添加单元测试     |
| chore    | 杂项（构建/依赖）      | chore: 升级依赖        |
| build    | 构建相关               | build: 修改打包配置    |
| ci       | CI/CD                  | ci: 修改流水线         |

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