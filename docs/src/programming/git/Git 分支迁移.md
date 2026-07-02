# Git 分支迁移笔记：把未提交的改动从一个分支转移到另一个分支

## 场景
在 `regular_version` 分支上开发了一批改动（包括已跟踪文件的修改 + 全新的未跟踪文件），
但还没有 commit，需要把这些改动转移到 `taoxiao` 分支继续开发。

## 核心命令

```powershell
# 1. 把当前所有改动存起来（-u 表示连未跟踪的新文件也一起存，缺一不可）
git stash -u

# 2. 切换到目标分支
git checkout taoxiao

# 3. 把刚才存起来的改动应用回工作区
git stash pop
```

## 关键点说明

- `git stash` 默认**只存已跟踪文件的修改**，不会存"从没被 git 记录过的新文件"（untracked files）。
  如果改动里有新建的文件，必须加 `-u`（等价于 `--include-untracked`），否则新文件会被落下。

- `git stash pop` = 应用改动 + 自动删除这条 stash 记录。
  如果想应用后**保留**这条 stash 记录（留个备份），改用：
```powershell
git stash apply
```

- PowerShell 下如果要显式指定某一条 stash（比如不是最新的一条），
  必须给 `stash@{0}` 加引号，否则花括号会被 PowerShell 解析出错：
```powershell
git stash pop "stash@{0}"
git stash show --stat "stash@{0}"
```
  只操作最新一条时可以省略索引，直接写 `git stash pop` 即可。

## 常见问题排查

### 切换分支报错 / 找不到 taoxiao 分支
```powershell
# 先看本地和远程都有哪些分支
git branch -a

# 如果只有远程分支 remotes/origin/taoxiao，没有本地分支，先创建并关联远程
git checkout -b taoxiao origin/taoxiao
```

### pop 时提示冲突
说明 `taoxiao` 分支上已有内容和 stash 里的改动冲突了，需要手动解决：
```powershell
# 1. 打开冲突文件，处理 <<<<<<< / ======= / >>>>>>> 标记的部分
# 2. 标记为已解决
git add .
# 3. pop 失败不会自动清理 stash 记录，需要手动删除
git stash drop
```

### 确认改动是否安全（在操作前先看一眼）
```powershell
git status                        # 查看当前哪些文件被修改/未跟踪
git stash list                    # 查看当前有哪些 stash
git stash show --stat             # 看最新一条 stash 里改了哪些文件（只看文件名）
git stash show -p                 # 看最新一条 stash 的具体 diff 内容
```

## 完整心法总结
> **改动没提交 + 想换分支 + 不想丢内容** → `stash -u` → `checkout` → `pop`