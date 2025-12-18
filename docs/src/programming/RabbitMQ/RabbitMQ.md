# RabbitMQ

## 一、 docker 运行 RabbitMQ

#### 1. 卸载旧版本（避免冲突）

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

#### 2. 安装依赖包

安装 yum 工具和证书相关依赖，用于通过 HTTPS 拉取软件包：

```sh
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

#### 3. 添加 Docker 官方 yum 源

替换默认的 CentOS 源为 Docker 官方源（国内可选用阿里云镜像源，速度更快）：

```sh
# 官方源（通用）
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

```sh
# 阿里云源（国内推荐）
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

####  4. 安装最新稳定版（推荐）

```sh
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

- `docker-ce`：Docker 引擎核心包；
- `containerd.io`：容器运行时；
- `docker-buildx-plugin`/`docker-compose-plugin`：构建和编排插件（可选，建议安装）。

#### 5. 启动并配置 Docker

```sh
# 启动服务
sudo systemctl start docker
# 设置开机自启
sudo systemctl enable docker
# 查看状态（确认运行）
sudo systemctl status docker
```

```sh
# 创建目录
sudo mkdir -p /etc/docker

# 配置镜像
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://docker.1ms.run"
    ]
}
EOF

# 重新加载配置
sudo systemctl daemon-reload
# 重启 Docker 服务
sudo systemctl restart docker
```

#### 6. 拉取运行镜像

```sh
# 拉取镜像
docker pull rabbitmq:3.13-management

# 拉取运行镜像
docker run -d \
  --name rabbitmq \
  --hostname rabbitmq-server \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=root \
  -e RABBITMQ_DEFAULT_PASS=root \
  -v rabbitmq-data:/var/lib/rabbitmq \
  rabbitmq:3.13-management
```

- **后台跑**：`-d` 让 RabbitMQ 在后台默默运行；
- **好管理**：`--name` 给容器起名字，不用记冗长的容器 ID；
- **能访问**：`-p` 开放两个端口，一个给程序连，一个给浏览器看管理界面；
- **有权限**：`-e` 设置用户名密码（root/root），不用用默认的 guest（只能本地访问）；
- **不丢数据**：`-v` 把 RabbitMQ 的数据存在 Docker 数据卷里，删了容器数据也还在；
- **带管理界面**：镜像后缀 `management` 表示包含 Web 控制台，能可视化操作。

![image-20251218144005045](./assets/image-20251218144005045.png)
