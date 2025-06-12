### **Git 关联仓库**

#### 1.**直接关联（适用于空仓库或强制覆盖）**


```bash
git remote add origin https://github.com/用户名/仓库名.git
```

**如果远程仓库已有内容**（如 README 文件），需先拉取并合并

```bash
git pull origin main --allow-unrelated-histories
```

使用token验证关联仓库

```bash
git remote add origin https://<TOKEN>@github.com/USERNAME/REPOSITORY.git
```

```powershell
git init //把这个目录变成Git可以管理的仓库
git add README.md //文件添加到仓库
git add . //不但可以跟单一文件，还可以跟通配符，更可以跟目录。一个点就把当前目录下所有未追踪的文件全部add了 
git commit -m "first commit" //把文件提交到仓库
git remote add origin git@github.com:wangjiax9/practice.git //关联远程仓库
git push -u origin master //把本地库的所有内容推送到远程库上
```



### **Git 基本命令速查表**

#### **1. 仓库操作**

| 命令              | 解释         |
| :---------------- | :----------- |
| `git init`        | 初始化新仓库 |
| `git clone <url>` | 克隆远程仓库 |

#### **2. 文件跟踪**

| 命令                  | 解释                 |
| :-------------------- | :------------------- |
| `git add <file>`      | 添加文件到暂存区     |
| `git add .`           | 添加所有修改到暂存区 |
| `git commit -m "msg"` | 提交暂存区的更改     |

#### **3. 分支管理**

| 命令                    | 解释       |
| :---------------------- | :--------- |
| `git branch`            | 查看分支   |
| `git branch <name>`     | 创建新分支 |
| `git checkout <branch>` | 切换分支   |
| `git merge <branch>`    | 合并分支   |

#### **4. 远程同步**

| 命令                       | 解释                   |
| :------------------------- | :--------------------- |
| `git push origin <branch>` | 推送分支到远程         |
| `git pull origin <branch>` | 拉取远程更新           |
| `git fetch`                | 下载远程更新（不合并） |

#### **5. 撤销操作**

| 命令                 | 解释                     |
| :------------------- | :----------------------- |
| `git restore <file>` | 丢弃工作区修改           |
| `git reset --hard`   | 重置到最近提交（危险！） |

#### 6. 关联仓库

| 命令                        | 解释             |
| :-------------------------- | :--------------- |
| `git remote add origin url` | 连接远程仓库     |
| `git remote remove origin`  | 删除现有的origin |

### **完整 Git 开发流程示例**

假设我们要在项目中添加一个「用户搜索」功能。

------

#### **1. 拉取最新代码（确保与团队同步）**

```
# 切换到主分支
git checkout main

# 拉取远程最新代码（相当于 git fetch + git merge）
git pull origin main
```

- `checkout main`：切换到主分支
- `pull origin main`：从远程仓库的 `main` 分支拉取最新代码并自动合并到本地

------

#### **2. 创建功能分支（隔离开发环境）**

```
# 创建并切换到新分支 feature/search
git checkout -b feature/search
```

**解释**：

- `-b` 参数表示创建新分支
- 分支命名惯例：`feature/功能名` 或 `fix/问题描述`

------

#### **3. 开发功能并提交**

```
# 修改代码后，添加文件到暂存区
git add src/components/Search.js

# 提交更改（附带清晰的提交信息）
git commit -m "feat: 添加用户搜索组件"
```

**解释**：

- `add`：将文件变更标记为待提交状态
- `commit -m`：提交到本地仓库，消息格式建议：
  - `feat:` 表示新功能
  - `fix:` 表示问题修复
  - `chore:` 表示琐碎调整

------

#### **4. 推送到远程仓库（备份和协作）**

```
# 首次推送需建立追踪关系
git push -u origin feature/search

# 后续推送只需
git push
```

**解释**：

- `-u`：建立本地分支与远程分支的关联（后续可直接 `git push`）
- 其他协作者现在可以看到这个分支

------

#### **5. 发起合并请求（Code Review）**

在 GitHub/GitLab 上：

1. 进入仓库页面 → "Pull Requests" → "New Pull Request"
2. 选择 `feature/search` 合并到 `main`
3. 添加描述并等待团队审核

------

#### **6. 合并到主分支（通过PR后）**

```
# 切换回主分支
git checkout main

# 拉取最新代码（可能已被他人更新）
git pull origin main

# 合并功能分支
git merge feature/search

# 推送更新到远程
git push origin main
```

**解释**：

- 合并前务必先 `pull` 确保 `main` 分支最新
- 如果存在冲突，需要手动解决后再次提交

------

#### **7. 清理分支（可选）**

```
# 删除本地分支
git branch -d feature/search

# 删除远程分支
git push origin --delete feature/search
```

**解释**：

- 功能上线后，删除已合并的分支保持仓库整洁

------

#### **完整流程图示**

```
[本地] git checkout -b feature/search  
       → 开发 → git commit → git push  
       → 创建PR → 审核通过  
[远程] 合并到 main → [本地] git pull origin main
```

#### **关键注意事项**

1. **频繁拉取更新**：每天开始工作前先 `git pull`
2. **小步提交**：一个提交只做一件事（便于回滚）
3. **分支策略**：
   - `main`：稳定版本
   - `feature/*`：功能开发
   - `hotfix/*`：紧急修复

通过这个标准化流程，可以高效协作且避免代码冲突。

