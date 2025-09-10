# npm

## npm 代理

```powershell
// 查看代理
npm config get proxy
npm config get https-proxy

// 设置代理
npm config set proxy http://127.0.0.1:7897
npm config set https-proxy http://127.0.0.1:7897

// 删除代理
npm config delete proxy
npm config delete https-proxy
```

## npm 镜像

```powershell
#查询当前使用的镜像源
npm get registry

#设置为淘宝镜像源 
npm config set registry https://registry.npmmirror.com/

#验证设置
npm get registry

#还原为官方源
npm config set registry https://registry.npmjs.org/ 


```

## 设置环境变量（临时）

```powershell
# cmd
set http_proxy=http://127.0.0.1:7897
set https_proxy=http://127.0.0.1:7897

# 删除代理
set http_proxy=
set https_proxy=

# 查看代理
echo %http_proxy%
echo %https_proxy%

# 使用 setx 命令永久设置（需要重新打开 cmd 窗口生效）：
setx http_proxy "http://127.0.0.1:7897"
setx https_proxy "http://127.0.0.1:7897"

setx http_proxy ""
setx https_proxy ""

# powershell
$env:http_proxy = "http://127.0.0.1:7897"
$env:https_proxy = "http://127.0.0.1:7897"
# 查看代理
$env:http_proxy
$env:https_proxy
```

## npm install

```powershell
# 使用详细输出参数
npm install --verbose
# 或简写
npm install -d

# 显示所有日志级别
npm install --loglevel verbose
# 或者
npm install --loglevel silly

```

## 查看 npm 配置中是否有相关设置

```powershell
npm config list
```

