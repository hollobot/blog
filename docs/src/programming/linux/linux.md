# 基本指令



## Linux 常用指令（带详细注释，按模块）

### 1. 系统信息

```sh
uname -a                    # 查看内核、操作系统全部信息
hostname                    # 查看主机名
cat /etc/os-release         # 查看系统发行版本（CentOS/Ubuntu）
whoami                      # 输出当前登录用户名
date                        # 查看系统时间
uptime                      # 开机时长、系统1/5/15分钟负载
w                           # 查看登录用户以及系统负载
```

### 2.CPU/ 内存性能

```sh
top                         # 实时进程资源监控，cpu内存负载
htop                        # top增强版，彩色交互
free -h                     # 以人类可读单位查看内存、swap交换分区
vmstat 1                    # 每秒输出一次系统整体状态(cpu/内存/io)
mpstat -P ALL 1             # 查看每一个CPU核的运行状态，每秒刷新
dmesg -T                    # 内核日志，排查OOM、硬件报错、系统崩溃
```

### 3. 磁盘与文件系统

```sh
df -h                       # 查看磁盘分区空间使用率
df -i                       # 查看inode占用情况，inode耗尽磁盘也会报满
du -sh *                    # 统计当前目录下各个文件夹大小
iostat -x 1                 # 磁盘IO详细统计，每秒输出一次
lsblk                       # 列出块设备，硬盘分区信息
mount                       # 查看已经挂载的设备
umount /data                # 卸载挂载点/data
```

### 4. 文件 & 目录操作

```sh
ls -lh                      # 列出文件，带大小、权限、时间
pwd                         # 打印当前所在路径
cd                          # 切换目录
mkdir -p a/b/c              # 递归创建多级目录
rm -rf dir                  # 强制递归删除目录，慎用
cp -r src dst               # 递归复制文件夹
mv old new                  # 移动/重命名文件文件夹
ln -s 源文件 软链接名        # 创建软链接
chmod 755 file              # 修改文件权限
chown app:app file          # 修改文件所属用户和用户组
```

### 5. 文件查找 & 文本处理

```sh
find / -name "*.log" 2>/dev/null          # 全盘查找log文件，屏蔽错误输出
find ./ -size +100M                       # 查找当前目录大于100M的文件

cat file                                   # 一次性输出全部文件内容
less file                                  # 分页查看大文件，适合日志
tail -f file.log                           # 实时跟踪日志输出
tail -n 200 file.log                       # 查看日志最后200行
head -n 100 file.log                       # 查看文件前100行

grep -rn "Exception" ./                    # 递归搜索目录下包含Exception的行
grep -c "error" app.log                    # 统计匹配error的行数

sed                                        # 流编辑器，文本替换、删除行
awk                                        # 文本列处理，日志统计、格式化输出
```

### 6. 进程管理

```sh
ps aux                      # 列出所有进程完整信息（BSD格式）
ps -ef                      # 列出所有进程完整信息（标准格式）
pgrep -fl java              # 查找java进程，输出pid+进程名
kill PID                    # 正常信号终止进程
kill -9 PID                 # 强制杀死进程，尽量少用
pkill -f "java"             # 根据进程字符串匹配杀死进程

nohup ./run.sh >out.log 2>&1 &   # 后台运行程序，nohup脱离终端
jobs                             # 查看当前shell后台任务
fg %1                            # 将后台任务切回前台运行
bg %1                            # 将暂停任务放到后台继续运行
```

### 7. 网络模块

```sh
ss -tulnp                   # 查看监听端口，推荐替代netstat
netstat -tulnp              # 查看端口监听
lsof -i :8080               # 根据端口号查找占用该端口的进程

curl -v http://ip:port      # 访问http接口，输出完整请求响应详情
telnet ip port              # 测试端口是否连通
ping ip                     # 测试网络连通性
tcpdump -i eth0 port 8080  # 在eth0网卡抓取8080端口数据包

ss -s                       # 统计系统全部tcp连接数量
iptables -L -n              # 查看防火墙规则列表
```

### 8.Systemd 服务管理（线上重点）

```sh
systemctl status nginx                 # 查看nginx服务运行状态
systemctl start/stop/restart nginx     # 启动、停止、重启服务
systemctl enable nginx                 # 设置开机自启
systemctl disable nginx                # 取消开机自启
systemctl list-unit-files              # 列出所有systemd服务单元

journalctl -u nginx -f                 # 实时查看nginx服务日志
journalctl -u nginx --since "2026-08-12 10:00:00"  # 指定时间查看日志
```

### 9. 用户 & 权限

```sh
useradd app                 # 创建app用户
passwd app                  # 设置用户密码
userdel -r app              # 删除用户同时删除家目录
su - app                    # 切换用户，加载用户环境变量
sudo su -                   # sudo切换到root
visudo                      # 编辑sudo权限配置文件
id                          # 查看当前用户uid、gid、所属组
```

### 10. 压缩解压

```sh
tar -zcvf test.tar.gz dir/  # 将dir文件夹压缩为test.tar.gz
tar -zxvf test.tar.gz       # 解压tar.gz压缩包

zip -r out.zip ./dir        # zip压缩文件夹
unzip out.zip               # 解压zip文件
```

### 11. 资源限制

```sh
ulimit -n                   # 查看当前进程最大打开文件句柄数
#永久修改配置文件 /etc/security/limits.conf
```

### 12. 远程传输

```sh
scp file root@ip:/data      # 将本地文件复制到远程服务器
rsync -av src/ root@ip:/data/ #增量同步，适合大量文件传输
ssh root@ip                 # ssh远程登录服务器
```

### 13. 定时任务 crontab

```sh
crontab -l                  # 查看当前用户定时任务
crontab -e                  # 编辑当前用户定时任务
cat /etc/crontab            # 系统级定时任务配置
```

### 故障排查常用

```sh
top                         # 定位CPU高负载进程pid
jstack pid                  # java堆栈打印，排查线程死锁CPU飙升
dmesg -T                    # 查看内核OOM杀死进程日志
> xxx.log                   # 清空被进程占用的日志文件，不要rm
iostat -x 1                 # 定位磁盘IO高
iotop                       # 看哪个进程产生大量IO
```

## 代理

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



## 管道查询

```sh
ps -ef | grep nginx

# 杀死进程
kill PID
# 如果杀不掉，用强制杀死：
kill -9 PID
```



## 启动jar包

```sh
nohup java -jar myapp.jar > logout.log 2> logerr.log &

# nohup：防止进程因终端关闭而终止。
# > logout.log：标准输出（stdout）写入 logout.log。
# 2> logerr.log：标准错误（stderr）写入 logerr.log。
# &：让命令在后台运行。
```

