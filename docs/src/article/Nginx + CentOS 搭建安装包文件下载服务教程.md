# Nginx + CentOS 搭建安装包文件下载服务教程

> 适用环境：CentOS 7 / 8，Nginx 1.18+


## 一、环境准备

### 1.1 关闭 SELinux（避免权限冲突）

#### SELinux 是什么

**Security-Enhanced Linux**，是 Linux 内核内置的一套**强制访问控制**安全机制，由美国 NSA 开发。

普通 Linux 权限（chmod/chown）是"自主访问控制"，**用户/进程自己说了算**。SELinux 在这之上再加一层，**由系统策略说了算**，即使是 root 也受限制。

```bash
普通权限：  文件属于 nginx 用户 → nginx 进程能读 ✅
SELinux：   文件的安全标签不对  → nginx 进程被拦截 ❌（即使权限正确）
```

#### 为什么装 Nginx 要关它？

Nginx 默认只被允许访问 `/usr/share/nginx/html` 等标准目录。你把文件放到自定义目录 `/data/packages/` 时，SELinux 不认识这个目录的标签，**直接拦截 → 返回 403**，而且报错信息很隐蔽，新手很难排查。

> 生产环境不想关 SELinux 的话，可以用这条命令给目录打标签：
>
> ```bash
> chcon -Rt httpd_sys_content_t /data/packages/
> ```

```bash
# 临时关闭（立即生效，重启失效）
setenforce 0

# 永久关闭（需重启）
sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config


```

> **说明**：SELinux 默认会拦截 Nginx 访问非标准目录的行为，关闭可避免出现 403 权限问题。生产环境中如需保留 SELinux，可改用 `chcon` 命令为目录赋予正确的安全上下文标签。

------

### 1.2 配置防火墙放行 HTTP/HTTPS

```bash
# 放行 80 端口（HTTP）
firewall-cmd --permanent --add-service=http

# 放行 443 端口（HTTPS，如需要）
firewall-cmd --permanent --add-service=https

# 重载防火墙规则
firewall-cmd --reload
```

> **说明**：CentOS 默认启用 `firewalld`，未放行的端口外部无法访问。`--permanent` 表示永久生效，`--reload` 使新规则立即激活，无需重启系统。

------

## 二、安装 Nginx

### 2.1 通过 EPEL 源安装（推荐）

```bash
# 安装 EPEL 扩展源 是由 Fedora 社区维护的第三方软件仓库，专门为 CentOS / RHEL 提供官方源里没有或版本太旧的软件包。
yum install -y epel-release

# 安装 Nginx
yum install -y nginx

# 启动并设置开机自启
systemctl start nginx
systemctl enable nginx

# 验证运行状态
systemctl status nginx
```

> **说明**：CentOS 默认源中 Nginx 版本较旧，EPEL 源提供更新的稳定版本。`systemctl enable` 会将服务注册为开机自启，避免服务器重启后需手动启动。

------

### 2.2 验证安装

```bash
nginx -v
# 预期输出示例：nginx version: nginx/1.20.1
```

------

## 三、创建文件存放目录

```bash
# 创建下载文件的根目录
mkdir -p /data/packages

# 将安装包上传或拷贝到该目录，例如：
# cp /tmp/jdk-17.tar.gz /data/packages/
# cp /tmp/mysql-8.0.rpm   /data/packages/

# 赋予 Nginx 运行用户读取权限
chown -R nginx:nginx /data/packages
chmod -R 755 /data/packages
```

> **说明**：
>
> - `/data/packages` 是自定义的文件存放路径，可按需修改。
> - `chown nginx:nginx` 将目录所有权交给 Nginx Worker 进程使用的系统用户（默认为 `nginx`），确保进程有权读取文件。
> - `755` 权限意味着所有者可读写执行，其他用户可读可执行（进入目录），满足 HTTP 文件分发的最低要求。

------

## 四、配置 Nginx

### 4.1 新建专用配置文件

推荐在 `/etc/nginx/conf.d/` 下新建独立配置，而非直接修改 `nginx.conf`，便于维护和扩展。

```bash
vim /etc/nginx/conf.d/file-server.conf
```

写入以下内容：

```nginx
server {
    listen       80;
    server_name  8.136.30.123;   # 客户访问IP，也就是服务器外网IP

    # 字符集，防止中文文件名乱码
    charset utf-8;

    # 访问日志与错误日志
    access_log  /var/log/nginx/file-server-access.log;
    error_log   /var/log/nginx/file-server-error.log;

    location /packages/ {
        # 映射到本地文件目录
        alias /data/packages/;

        # 开启目录列表浏览（核心配置）
        autoindex on;

        # 显示文件的真实大小（off 则显示人性化单位如 MB）
        autoindex_exact_size off;

        # 显示文件时间为服务器本地时间（默认为 GMT）
        autoindex_localtime on;

        # 单个连接限速，防止单用户占满带宽（按需开启）
        # limit_rate 5m;

        # 大文件断点续传支持
        add_header Accept-Ranges bytes;
    }
}
```

> **各配置项说明：**
>
> | 配置项                           | 作用                                                        |
> | -------------------------------- | ----------------------------------------------------------- |
> | `listen 80`                      | 监听 80 端口的 HTTP 请求                                    |
> | `server_name`                    | 绑定域名或 IP，多个用空格分隔                               |
> | `charset utf-8`                  | 设置响应字符集，避免文件名中文乱码                          |
> | `alias /data/packages/`          | 将 URL 路径 `/packages/` 映射到磁盘目录（注意末尾需有斜杠） |
> | `autoindex on`                   | 开启文件目录列表，客户端可浏览目录下所有文件                |
> | `autoindex_exact_size off`       | 关闭精确字节数显示，改为 KB/MB/GB 友好格式                  |
> | `autoindex_localtime on`         | 文件修改时间显示为服务器本地时区（默认 UTC）                |
> | `add_header Accept-Ranges bytes` | 告知客户端支持分片下载（Range 请求），wget/curl 可断点续传  |

------

### 4.2 检查配置语法

```bash
nginx -t
```

预期输出：

```bash
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

------

### 4.3 重载 Nginx

```bash
# 热重载，不中断现有连接
systemctl reload nginx
```

> **说明**：`reload` 会让 Nginx 在不停止服务的情况下重新读取配置，生产环境优先于 `restart`。

------

## 五、访问验证

### 5.1 浏览器访问

打开浏览器，访问：

```bash
http://8.136.30.123/packages/
```

正常情况下可以看到类似如下的目录列表：

```bash
Index of /packages/
../
jdk-17_linux-x64.tar.gz     2024-01-15 10:23    192M
mysql-8.0.36-1.el7.x86_64.rpm   2024-01-15 11:00    48M
```

点击文件名即可触发下载。

------

### 5.2 命令行下载（wget / curl）

```bash
# wget 下载（支持断点续传）
wget -c http://192.168.1.100/packages/jdk-17_linux-x64.tar.gz

# curl 下载
curl -O http://192.168.1.100/packages/jdk-17_linux-x64.tar.gz

# curl 断点续传
curl -C - -O http://192.168.1.100/packages/jdk-17_linux-x64.tar.gz
```

------

## 六、安全加固（可选但推荐）

### 6.1 添加 Basic Auth 访问认证

防止文件被公网匿名访问，限制只有有密码的用户才能下载。

```bash
# 安装 htpasswd 工具
yum install -y httpd-tools

# 创建认证文件，添加用户 admin（执行后输入密码）
htpasswd -c /etc/nginx/.htpasswd admin

# 追加更多用户（去掉 -c 参数）
htpasswd /etc/nginx/.htpasswd developer
```

在 `location` 块中加入：

```nginx
location /packages/ {
    alias /data/packages/;
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;

    # 开启 Basic 认证
    auth_basic "File Server - Please Login";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

> **说明**：`auth_basic` 后的字符串是浏览器弹出框显示的提示文字，`auth_basic_user_file` 指向存储用户名和加密密码的文件。

------

### 6.2 限制访问 IP 白名单

```nginx
location /packages/ {
    alias /data/packages/;
    autoindex on;

    # 只允许内网访问
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}
```

> **说明**：`allow` 和 `deny` 按从上到下顺序匹配，`deny all` 放在最后作为兜底规则，拒绝所有未被允许的 IP。

------

### 6.3 限制下载速度（防止带宽被单用户占满）

```nginx
location /packages/ {
    alias /data/packages/;
    autoindex on;

    # 每个连接限速 2MB/s
    limit_rate 2m;

    # 前 10MB 不限速，之后再限速（提升小文件体验）
    limit_rate_after 10m;
}
```

------

## 七、常见问题排查

| 现象           | 可能原因                       | 解决方法                            |
| -------------- | ------------------------------ | ----------------------------------- |
| 403 Forbidden  | SELinux 或目录权限问题         | `setenforce 0` 并检查 `chown/chmod` |
| 404 Not Found  | `alias` 路径错误或末尾缺少斜杠 | 检查 `alias` 末尾是否有 `/`         |
| 目录列表为空   | 文件不在对应目录               | `ls -la /data/packages/` 确认       |
| 中文文件名乱码 | 未设置字符集                   | 确认 `charset utf-8` 已添加         |
| 无法访问       | 防火墙未放行端口               | `firewall-cmd --list-all` 检查规则  |

------

## 八、完整配置文件参考

```nginx
server {
    listen       80;
    server_name  192.168.1.100;
    charset      utf-8;

    access_log  /var/log/nginx/file-server-access.log;
    error_log   /var/log/nginx/file-server-error.log;

    location /packages/ {
        alias               /data/packages/;
        autoindex           on;
        autoindex_exact_size off;
        autoindex_localtime on;
        add_header          Accept-Ranges bytes;

        # 按需开启以下安全配置
        # auth_basic          "File Server";
        # auth_basic_user_file /etc/nginx/.htpasswd;

        # allow 192.168.1.0/24;
        # deny all;

        # limit_rate      2m;
        # limit_rate_after 10m;
    }
}
```

------

> 至此，一个基于 Nginx 的安装包文件下载服务已完整搭建。根据实际需要选择是否启用认证和限速策略，内网分发场景可适当放宽，面向互联网则建议同时开启 Basic Auth + IP 白名单双重防护。