# 基本指令



### 代理

```sh
# HTTP代理
export http_proxy="http://192.168.125.134:7897"
export https_proxy="http://192.168.125.134:7897"

export http_proxy="http://192.168.79.1:7897"
export https_proxy="http://192.168.79.1:7897" 

# 如果代理需要认证
export http_proxy="http://username:password@proxy-server:port"
export https_proxy="http://username:password@proxy-server:port"

# 取消环境变量
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY

# 验证是否已取消
echo "http_proxy: $http_proxy"
echo "https_proxy: $https_proxy"
```



### 管道查询

```sh
ps -ef | grep nginx

kill PID
```



### 启动jar包

```sh
nohup java -jar myapp.jar > logout.log 2> logerr.log &

# nohup：防止进程因终端关闭而终止。
# > logout.log：标准输出（stdout）写入 logout.log。
# 2> logerr.log：标准错误（stderr）写入 logerr.log。
# &：让命令在后台运行。
```

