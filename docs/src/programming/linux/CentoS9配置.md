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

------

### **7. 安装 MySQL（如需）**

```bash
yum install -y mysql-server
systemctl enable mysqld
systemctl start mysqld
mysql_secure_installation
```

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
yum install -y redis
systemctl enable redis
systemctl start redis
```



