# Git Revert 场景复盘

## 一、什么是 git revert？

`git revert` 是 Git 中用于**撤销某次提交**的命令。

它的核心原理是：**新增一个"反向提交"来抵消目标提交的改动**，而不是直接删除历史记录。

### revert vs reset 的区别

| 对比项   | `git revert`       | `git reset`            |
| -------- | ------------------ | ---------------------- |
| 操作方式 | 新增一个反向提交   | 直接回退指针，删除历史 |
| 历史记录 | ✅ 保留所有历史     | ❌ 会丢失历史           |
| 适用场景 | 已推送到远程的提交 | 本地未推送的提交       |
| 团队协作 | ✅ 安全，不影响他人 | ⚠️ 危险，会导致他人冲突 |

### 负负得正原理

```
你的提交      = +100 行代码
revert 你     = -100 行代码（抵消）
revert revert = -(-100) = +100 行代码（代码回来了）
```

------

## 二、场景说明

**背景：**

1. 你在 `taoxiao` 分支提交代码，并发起 MR 合并到 `master`
2. 组长审核通过后合并，但发现有问题
3. 组长在 `master` 上执行了 `git revert`，撤销了你的代码
4. 组长通知你："我先给你代码 revert 了，你记得再 revert 回去"

------

### ⚠️ 先检查你的分支，再决定要不要操作

组长的 revert **只发生在 master 上**，你的功能分支不一定受影响。
 执行下面的操作前，先判断自己属于哪种情况：

```bash
git checkout taoxiao
git revert <组长的revert hash>
```

**情况一：提示 `nothing to commit`（你的情况）**

```
master:   ... → 你的MR合并 → 组长revert   （只有 master 被改动）
taoxiao:  ... → 你的提交                   （完全没被动过 ✅）
```

说明你的 taoxiao 分支代码**完好无损**，不需要任何 revert。
 ✅ **直接改 bug，重新提 MR 即可。**

------

**情况二：成功创建了新 commit（需要 revert 的场景）**

这种情况发生在你曾经把 master 合并回自己的分支：

```bash
git checkout taoxiao
git merge master   # ← 执行过这步，就会把组长的 revert 带进来
master:   ... → 你的MR合并 → 组长revert
taoxiao:  ... → 你的提交   → merge master → 你的代码也没了 ❌
```

此时才需要执行 revert，把组长的 revert 抵消掉，代码才能找回来。

------

## 三、完整操作步骤（适用于情况二：分支代码丢失时）

### 第一步：同步最新的 master

```bash
git checkout master
git pull origin master
```

**作用：** 拉取组长 revert 后的最新 master，确保本地代码是最新状态。

------

### 第二步：找到组长 revert 的 commit hash

```bash
git log --oneline
```

输出示例：

```
a1b2c3d  Revert "你当时的提交信息"   ← 组长的 revert commit
e4f5g6h  你当时的提交信息
7h8i9j0  上上次的提交...
```

**作用：** 找到组长 revert 操作对应的 commit hash（如 `a1b2c3d`），后续操作需要用到它。

------

### 第三步：切回 taoxiao 分支并同步

```bash
git checkout taoxiao
git pull origin taoxiao
```

**作用：** 回到你自己的开发分支，并拉取远程最新状态，避免后续 push 冲突。

------

### 第四步：revert 掉组长的 revert（核心操作）

```bash
git revert a1b2c3d   # 替换为你第二步找到的 hash
```

执行后会弹出编辑器让你确认 commit message，直接保存退出即可（`:wq`）。

**作用：** 对组长的 revert 再做一次 revert，负负得正，你的代码重新回来了。此时代码状态与你当初提 MR 时完全一致。

> ⚠️ 如果提示有冲突，手动解决后执行：
>
> ```bash
> git add .
> git revert --continue
> ```

------

### 第五步：在此基础上修复问题

```bash
# 修改你的代码，解决组长发现的问题...

git add .
git commit -m "fix: 修复 xxx 问题"
```

**作用：** 在找回的代码基础上，继续修复 bug，完成后提交。

------

### 第六步：推送并重新提 MR

```bash
git push origin taoxiao
```

**作用：** 将修复好的代码推送到远程，然后在平台（GitLab / GitHub）上重新发起合并请求，让组长再次审核。

------

## 四、整个流程图示

**情况一：taoxiao 分支未受影响（直接改 bug）**

```
时间轴 →

master:   ... ──→ [你的MR合并] ──→ [组长 Revert] ──→ (等待新 MR)

taoxiao:  ... ──→ [你的提交，代码完好] ──→ [改 bug] ──→ 重新提 MR
```

**情况二：曾把 master merge 回 taoxiao（需要 revert revert）**

```
时间轴 →

master:   ... ──→ [你的MR合并] ──→ [组长 Revert] ──→ (等待新 MR)
                                          ↓ merge 进来
taoxiao:  ... ──→ [你的提交] ──→ [代码丢失] ──→ [revert 组长] ──→ [改 bug] ──→ 重新提 MR
```

------

## 五、常用 revert 命令速查

```bash
# revert 某一个特定提交
git revert <commit-hash>

# revert 但不自动创建提交（手动 commit）
git revert <commit-hash> --no-commit

# revert 一个范围内的提交（不含 start，含 end）
git revert <start-hash>..<end-hash>

# 查看提交记录（找 hash 用）
git log --oneline
```

------

## 六、注意事项

- **不要用 `git reset`** 替代 `git revert`，在已推送的分支上 reset 会导致他人代码冲突
- revert 操作**不会丢失你的代码**，只是产生新的提交来抵消，所有历史都完整保留
- 如果不确定操作，可以先 `git stash` 保存本地未提交的修改