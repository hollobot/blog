# 这是我的日志

## git 快速入门

#### 第一次开发

```sh
// 1. 克隆远程仓库
git clone <url>
cd objectName

// 2. 创建自己的分支开发
git branch taoxiao

// 3. 缓存、提交、push
git add .
git commit -m xxx
git push origin taoxiao
```

#### 第二次开发

```sh
git checkout main
git pull origin main
git checkout taoxiao
git merge main


// 3. 缓存、提交、push
git add .
git commit -m xxx
git push origin taoxiao
```

