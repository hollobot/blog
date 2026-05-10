## Linux 开机自启动 Java 服务

推荐使用 **systemd**（现代 Linux 标准方案），比 rc.local 更稳定可靠。

------

### 方法一：systemd 服务（推荐）

#### 第一步：创建服务文件

```bash
sudo nano /etc/systemd/system/chat-service.service
```

写入以下内容：

```ini
[Unit]
Description=Chat Service Java Application
After=network.target

[Service]
Type=forking
User=root
WorkingDirectory=/root/code/prod/chat

# 启动命令
ExecStart=/bin/bash -c 'nohup java -jar chat-service-0.0.1-SNAPSHOT.jar > logout.log 2> logerr.log &'

# 进程退出后自动重启
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

> ⚠️ **注意修改以下两项：**
>
> - `User=your_username` → 改为实际运行用户（如 `ubuntu`、`root`）
> - `WorkingDirectory=/path/to/your/jar` → 改为 jar 包所在的绝对路径

------

#### 第二步：启用并启动服务

```bash
# 重载 systemd 配置
sudo systemctl daemon-reload

# 设置开机自启
sudo systemctl enable chat-service

# 立即启动服务
sudo systemctl start chat-service

# 查看运行状态
sudo systemctl status chat-service
```

------

#### 常用管理命令

```bash
sudo systemctl stop chat-service      # 停止服务
sudo systemctl restart chat-service   # 重启服务
sudo systemctl disable chat-service   # 取消开机自启

journalctl -u chat-service -f         # 实时查看系统日志
```

#### 重启测试

```bash
sudo reboot
```

------

### 方法二：rc.local（简单但较旧）

适合老系统或快速测试：

```bash
sudo nano /etc/rc.local
```

在 `exit 0` 之前加入：

```bash
cd /path/to/your/jar
nohup java -jar chat-service-0.0.1-SNAPSHOT.jar > logout.log 2> logerr.log &
```

然后确保文件有执行权限：

```bash
sudo chmod +x /etc/rc.local
```

------

### 对比总结

| 特性     | systemd               | rc.local |
| -------- | --------------------- | -------- |
| 推荐程度 | ✅ 推荐                | 一般     |
| 自动重启 | ✅ 支持                | ❌ 不支持 |
| 日志管理 | ✅ journalctl          | ❌ 无     |
| 适用系统 | Ubuntu 16+, CentOS 7+ | 较老系统 |

**推荐使用 systemd 方案**，支持服务崩溃自动重启，运维更方便。