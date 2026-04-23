# Git 误操作复盘：git checkout . 导致代码丢失

## 🧨 一、问题背景

在本地开发过程中，存在未提交的代码修改：

```bash
git status
```

显示：

- modified 文件（已修改但未提交）
- untracked 文件（新建文件）

此时执行了：

```bash
git checkout .
```

------

## ❌ 二、错误操作

### 1. 使用了危险命令

```bash
git checkout .
```

### 2. 错误理解

以为只是“切换/刷新代码”，实际上：

> 👉 **该命令会用暂存区（index）覆盖工作区（workspace）**

------

## 💥 三、造成的结果

| 类型             | 结果             |
| ---------------- | ---------------- |
| 未 commit 的修改 | ❌ 被覆盖（丢失） |
| 未 add 的新文件  | ❌ 不受保护       |
| 已 commit 的代码 | ✅ 安全           |

------

## 🔍 四、为什么会丢失？

Git 三个区域：

```bash
工作区（workspace）
暂存区（index）
仓库（commit）
```

执行：

```bash
git checkout .
```

等价于：

> 👉 用 index 覆盖 workspace

如果你没有：

- ❌ git add
- ❌ git commit
- ❌ git stash

👉 那 Git 根本没有记录你的代码

------

## 🚫 五、典型错误流程（本次）

```bash
# 有本地修改
git status

# 想切分支/拉代码
git checkout master
git pull

# 出现提示
Please commit your changes or stash them

# ❌ 错误操作
git checkout .

# 💥 代码丢失
```

------

## ✅ 六、正确操作（标准流程）

### ✅ 方案一：stash（推荐🔥）

```bash
git stash           # 保存当前修改
git checkout master
git pull            # 拉代码
git stash pop       # 恢复修改
```

------

### ✅ 方案二：提交（最稳）

```bash
git add .
git commit -m "wip: 临时保存"

git checkout master
git pull

# 切换开发分支合并代码手动解决冲突
git checout dev
git checkout merge master
```

------

### ✅ 方案三：包含新文件（重要）

如果有新文件：

```bash
git stash -u
```

------

## 📦 七、git stash 详解

### 1. 是什么？

> 👉 临时保存当前修改，不进入 commit 历史

------

### 2. 常用命令

```bash
# 保存
git stash

# 保存（包含新文件）
git stash -u

# 查看列表
git stash list

# 恢复（并删除）
git stash pop

# 恢复（不删除）
git stash apply
```

------

### 3. stash 保存内容

| 类型        | 是否保存   |
| ----------- | ---------- |
| 修改的文件  | ✅          |
| 已 add 文件 | ✅          |
| 未跟踪文件  | ❌（需 -u） |

------

## ⚠️ 八、高危命令（禁止乱用）

```bash
git checkout .
git restore .
git reset --hard
```

👉 这些命令 = **直接覆盖本地代码**

------

## 🧠 九、避免再次翻车（核心原则）

### ✅ 原则一

> 👉 操作前必须“存”（stash 或 commit）

------

### ✅ 原则二

看到提示：

```bash
Please commit your changes or stash them
```

👉 永远执行：

```bash
git stash -u
```

------

### ✅ 原则三

养成习惯：

```bash
git add .
git commit -m "wip"
```

------

## 🛠 十、推荐工作流（开发必备）

```bash
# 开始开发
git checkout -b feature/xxx

# 开发过程中
git add .
git commit -m "feat: xxx"

# 拉代码
git pull

# 临时切换任务
git stash -u
git checkout other-branch
```

------

## 🧩 十一、事故总结

本次问题本质是：

> ❌ 在“未提交代码”的情况下执行了“覆盖工作区”的命令

导致：

> 💥 本地修改无法恢复（Git层面）