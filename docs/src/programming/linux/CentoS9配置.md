# CentoS9 虚拟机配置



## 一、物理机远程虚拟机

#### 第一步，虚拟机查看IP：

```sh
ip addr
```

找到 `ens33` 的 IP，比如 `192.168.x.x`

#### 第二步，确保SSH服务启动：

```sh
systemctl start sshd
systemctl enable sshd
```

#### 第三步，物理机直接SSH连接：

```sh
# 可以使用远程工具连接
ssh root@192.168.x.x
```

**如果连不上，检查防火墙：** **NAT模式**，物理机可以直接SSH虚拟机，不需要改网络模式。

```sh
# 临时关闭防火墙测试
systemctl stop firewalld

# 或者只开放22端口
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload
```



## 二、基本配置

### **1. 更换镜像源**

 CentOS 9 默认源是国外的，国内访问**很慢甚至失败**，建议换成阿里云或腾讯云：

**备份**

```bash
# 备份 centos.repo
sudo mv /etc/yum.repos.d/centos.repo /etc/yum.repos.d/centos.repo.backup
# 备份 centos-addons.repo
sudo mv /etc/yum.repos.d/centos-addons.repo /etc/yum.repos.d/centos-addons.repo.backup
```

**centos.repo文件内容**

```bash
[baseos]
name=CentOS Stream $releasever - BaseOS
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/BaseOS/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[baseos-debug]
name=CentOS Stream $releasever - BaseOS - Debug
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/BaseOS/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[baseos-source]
name=CentOS Stream $releasever - BaseOS - Source
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/BaseOS/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[appstream]
name=CentOS Stream $releasever - AppStream
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/AppStream/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[appstream-debug]
name=CentOS Stream $releasever - AppStream - Debug
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/AppStream/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[appstream-source]
name=CentOS Stream $releasever - AppStream - Source
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/AppStream/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[crb]
name=CentOS Stream $releasever - CRB
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/CRB/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[crb-debug]
name=CentOS Stream $releasever - CRB - Debug
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/CRB/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[crb-source]
name=CentOS Stream $releasever - CRB - Source
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/CRB/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0
```

**centos-addons.repo文件内容**

```bash
[highavailability]
name=CentOS Stream $releasever - HighAvailability
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/HighAvailability/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[highavailability-debug]
name=CentOS Stream $releasever - HighAvailability - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/HighAvailability/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[highavailability-source]
name=CentOS Stream $releasever - HighAvailability - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/HighAvailability/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[nfv]
name=CentOS Stream $releasever - NFV
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/NFV/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[nfv-debug]
name=CentOS Stream $releasever - NFV - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/NFV/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[nfv-source]
name=CentOS Stream $releasever - NFV - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/NFV/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[rt]
name=CentOS Stream $releasever - RT
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/RT/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[rt-debug]
name=CentOS Stream $releasever - RT - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/RT/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[rt-source]
name=CentOS Stream $releasever - RT - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/RT/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[resilientstorage]
name=CentOS Stream $releasever - ResilientStorage
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/ResilientStorage/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[resilientstorage-debug]
name=CentOS Stream $releasever - ResilientStorage - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/ResilientStorage/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[resilientstorage-source]
name=CentOS Stream $releasever - ResilientStorage - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/ResilientStorage/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[extras-common]
name=CentOS Stream $releasever - Extras packages
baseurl=http://mirrors.aliyun.com/centos-stream/SIGs/$stream/extras/$basearch/extras-common/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Extras-SHA512
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[extras-common-source]
name=CentOS Stream $releasever - Extras packages - Source
baseurl=http://mirrors.aliyun.com/centos-stream/SIGs/$stream/extras/source/extras-common/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Extras-SHA512
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

```

**yum源生效**

```bash
yum clean all
yum makecache
sudo yum update
```



### **2. 安装常用工具**

```bash
yum install -y wget curl git vim net-tools lsof unzip
```

------

### **3. 配置静态IP（防止IP变动SSH断连）**（Centos 9）

```bash
nmcli connection show  # 先查看网卡名称

# 设置静态IP地址   /24：子网掩码，等于 255.255.255.0
nmcli connection modify ens33 ipv4.addresses 192.168.30.130/24
# 设置网关 根据VMware → 虚拟网络编辑器 → VMnet8 → 点击右边 NAT 设置(S)...
nmcli connection modify ens33 ipv4.gateway 192.168.30.2
# 设置DNS DNS用于域名解析，8.8.8.8 是谷歌的公共DNS，国内可换 114.114.114.114
nmcli connection modify ens33 ipv4.dns "114.114.114.114 8.8.8.8"
# 切换为手动模式 默认是 auto（DHCP动态分配），改成 manual 才会使用上面设置的静态IP
nmcli connection modify ens33 ipv4.method manual
# 重启网卡使配置生效
nmcli connection up ens33
```

------



### **4. 配置SSH**

```bash
systemctl enable sshd
systemctl start sshd

# 可选：禁止root直接登录（更安全）
# vim /etc/ssh/sshd_config
# PermitRootLogin no
```

------

### 5. 安装 nvm + Node 24

```bash
# 下载并安装 nvm：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash # github
curl -o- https://gitee.com/mirrors/nvm/raw/v0.40.3/install.sh | bash # gitee

# 代替重启 shell
\. "$HOME/.nvm/nvm.sh"

# 下载并安装 Node.js：
nvm install 24

# 验证 Node.js 版本：
node -v # Should print "v24.14.0".

# 验证 npm 版本：
npm -v # Should print "11.9.0".

# 换成淘宝镜像
npm config set registry https://registry.npmmirror.com

```

------

### **6. 安装 Java（如需）**

```bash
yum install -y java-17-openjdk java-17-openjdk-devel
java -version
```

### 6.1 多个Java版本配置管理

**同时安装多个java版本**

```bash
yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel
yum install -y java-17-openjdk java-17-openjdk-devel
```

**让系统识别两个 Java 版本，后面的数字代表优先级（越大越高）**

```bash
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-17-openjdk-17.0.18.0.8-2.el9.x86_64/bin/java 1700
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.482.b08-3.el9.x86_64/jre/bin/java 800
sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-17-openjdk-17.0.18.0.8-2.el9.x86_64/bin/javac 1700
sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.482.b08-3.el9.x86_64/bin/javac 800
```

**现在再查看版本（就能看到两个了）**

```bash
update-alternatives --list java
```

 **一键切换版本**

```bash
update-alternatives --config java
```

```markdown
# 会出现：
选择    命令
-----------------------------------------------
   1           java-17-openjdk
   2           java-1.8.0-openjdk
   
# 输入数字 1 或 2 回车即可切换！
```

**验证**

```bash
java -version
```



------

### **7. 安装 MySQL（如需）**

```bash
yum install -y mysql-server
systemctl enable mysqld
systemctl start mysqld
mysql_secure_installation
```

**安装** → `yum install -y mysql-server`

**开机自启** → `systemctl enable mysqld`

**启动服务** → `systemctl start mysqld`

**安全初始化 + 设置密码** → `mysql_secure_installation`



------

### **8. 关闭 SELinux（开发环境建议关闭）**

SELinux 是安全模块，开发环境下经常拦截正常操作，导致各种奇怪报错，建议直接关闭。

```bash
setenforce 0   # 临时关闭

# 永久关闭
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

------

### **9. 配置防火墙常用端口**

```bash
firewall-cmd --permanent --add-port=8080/tcp   # 应用端口
firewall-cmd --permanent --add-port=3306/tcp   # MySQL
firewall-cmd --permanent --add-port=6379/tcp   # Redis
firewall-cmd --reload


# 停止防火墙
systemctl stop firewalld

# 禁止开机自启
systemctl disable firewalld

# 验证状态
systemctl status firewalld
```

------

### **10. 安装 Redis（如需）**

```bash
# 安装 Redis 数据库
yum install -y redis
# 设置 Redis 开机自启动
systemctl enable redis
# 开启
systemctl start redis

# 重启 Redis 让配置生效
systemctl restart redis
```

#### **默认没有密码，可以手动配置**

```sh
vi /etc/redis/redis.conf
```

```bash
# 允许远程连接
bind 0.0.0.0

# 关闭保护模式 （是 Redis 自带安全机制：1.只允许本机 127.0.0.1 连接，2.如果没设密码 + 外网 IP 访问 → 直接拒绝连接）
protected-mode no

# 设置 Redis 密码
requirepass 123456
```

#### 覆盖官方配置

```bash
cat > /etc/redis/redis.conf <<EOF
bind 0.0.0.0
port 6379
protected-mode no
requirepass 123456
daemonize yes
save ""
maxmemory 1G
maxmemory-policy allkeys-lru
EOF
```

