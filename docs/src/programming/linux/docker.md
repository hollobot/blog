# docker



## 安装docker

### **1. 卸载旧版本**

较旧的 Docker 版本称为 docker 或 docker-engine，如果已安装这些程序，请卸载它们以及相关的依赖项。

运行以下命令卸载旧版本：

```sh
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```



### 2、安装docker的yum库

```sh
yum install -y yum-utils
```



### 3、配置docker的yum源

```sh
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```



### 4、安装docker

```sh
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```



### 5、启动和校验docker

```sh
docker -v # 查看版本
systemctl start docker # 手动启动
systemctl stop docker # 手动停止
systemctl restart docker # 重启
systemctl enable docker # 开机自启动
```



## Docker 容器使用

Docker 容器是一个轻量级、可移植、自给自足的软件环境，用于运行应用程序。容器将应用程序及其所有依赖项 （包括库、配置文件、系统工具等）封装在一个标准化的包中，使得应用能够在任何地方一致地运行。



### 基本概念

**镜像（Image）**：容器的静态模板，包含了应用程序运行所需的所有依赖和文件。镜像是不可变的。

**容器（Container）**：镜像的一个运行实例，具有自己的文件系统、进程、网络等，且是动态的。容器从镜像启动，并在运行时保持可变。



### 常用命令

| 命令           | 功能                         | 示例                   |
| :------------- | :--------------------------- | :--------------------- |
| `docker run`   | 启动一个新的容器并运行命令   | `docker run -d ubuntu` |
| `docker ps`    | 列出当前正在运行的容器       | `docker ps`            |
| `docker ps -a` | 列出所有容器（包括已停止的） | `docker ps -a`         |



### 容器操作

**1.配置镜像**

修改 /etc/docker/daemon.json，设置 registry mirror，具体命令如下:

```sh
sudo vim /etc/docker/daemon.json

## 粘贴进去，保存。
{
    "registry-mirrors": [
        "https://docker.xuanyuan.me"
    ]
}
```

重启docker

```sh
systemctl daemon-reload  # 用于重新加载systemd的配置。
systemctl restart docker # 重启
```



**2.获取镜像**

如果本地没有所需的镜像，可以使用 docker pull 命令从 Docker Hub 下载：

```sh
docker pull docker.xuanyuan.run/library/redis:latest
```



**3.启动镜像**

比如你已经拉取了 `redis` 镜像，要运行它

```sh
# 启动一个 Redis 容器
docker run -d --name myredis -p 6379:6379 redis
```

解释：

- docker run：用镜像启动一个容器

- -d：后台运行

- --name myredis：给容器取名，方便后续管理
- -p 6379:6379：把宿主机的 6379 端口映射到容器的 6379 端口
- redis：镜像名



**4.进入容器**

```sh
docker exec -it myredis redis-cli
```

- `docker` 调用 Docker 命令
- `exec` 在已运行的容器里执行命令
- `-it`    两个参数组合： `-i` 保持标准输入 (stdin) 打开 `-t` 分配一个伪终端 (tty)，让你可以交互
- `myredis` 容器名称或容器 ID，你要操作的目标容器
- `redis-cli` 容器内要执行的命令，这里是 Redis 的命令行客户端



**5.关闭容器**

关闭（停止）运行中的容器：

```sh
docker stop myredis
```

如果想重新启动它：

```sh
docker start myredis
```

如果不再需要，可以删除：

```sh
docker rm myredis
```



## Docker 配置代理

Docker 守护进程拉取镜像时不会用你 shell 的 `http_proxy`，要单独配置 systemd 服务。



**1.给 Docker 配置代理**

```sh
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo vim /etc/systemd/system/docker.service.d/proxy.conf
```

```sh
[Service]
Environment="HTTP_PROXY=http://192.168.79.1:7897"
Environment="HTTPS_PROXY=http://192.168.79.1:7897"
Environment="NO_PROXY=localhost,127.0.0.1"
```



**2.重新加载 Docker 配置**

```sh
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart docker
```



**4.验证 Docker 环境变量是否生效**

```sh
systemctl show --property=Environment docker
```

你应该能看到：

```sh
Environment=HTTP_PROXY=http://192.168.79.1:7897 HTTPS_PROXY=http://192.168.79.1:7897 ...
```

 如果还是不行，可以在 `/etc/docker/daemon.json` 里加一份代理配置：

```sh
{
  "proxies": {
    "default": {
      "httpProxy": "http://192.168.79.1:7897",
      "httpsProxy": "http://192.168.79.1:7897",
      "noProxy": "localhost,127.0.0.1"
    }
  }
}
```

然后 `sudo systemctl restart docker`。