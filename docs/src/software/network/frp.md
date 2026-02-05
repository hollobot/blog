# FRP 内网穿透

> FRP 是一款开源的内网穿透工具，可将内网服务通过公网服务器暴露给外网访问，支持 TCP/UDP/HTTP/HTTPS 等协议。

------

## 一、文件组成说明

你的 FRP 工具目录里有以下 **5 个文件**：

```shell
frps.toml     # 服务端配置信息
frpc.toml     # 客户端配置信息
frps          # 服务端程序（Linux 可执行）
frpc          # 客户端程序
LICENSE       # 开源许可文件
```

| 文件名      | 作用                                               |
| ----------- | -------------------------------------------------- |
| `frps`      | FRP 服务端可执行程序（运行在有公网 IP 的服务器上） |
| `frpc`      | FRP 客户端可执行程序（运行在内网机器上）           |
| `frps.toml` | 服务端配置文件，用来设定监听端口、认证、转发规则等 |
| `frpc.toml` | 客户端配置文件，用来指定要穿透的服务、服务器地址等 |
| `LICENSE`   | 开源许可，不影响运行                               |

------

## 二、Linux 服务器（服务端）配置

### 📌 1) 修改 `frps.toml`

这是在你 **公网服务器**上运行的配置文件。

下面是一个基础示例（把解释写在注释里）：

```shell
# ------------------ FRP 服务端（frps） 配置 ------------------

# 绑定监听地址（默认 `0.0.0.0` 代表监听所有 IP）(可以不写默认 `0.0.0.0`)
bindAddr = "0.0.0.0"
# 服务监听的端口（客户端连接到这个端口）
bindPort = 15253
# frps 只允许 使用 15266～15267 之间的端口，如果start == end 那么就是锁定为一个端口
allowPorts = [
  { start = 15266, end = 15267 }
]

# 如果你要让 Dashboard 可通过浏览器访问，取消下面配置
[webServer]
# Dashboard 监听地址（0.0.0.0 表示所有网络接口可访问）
addr = "0.0.0.0"
# Dashboard 端口（用于查看运行信息）
port = 7500
# （可选）登录 Dashboard 的账号密码
# user = "admin"
# password = "admin"

# 身份验证（要求客户端和服务端 token 必须匹配）
[auth]
method = "token"
token = "412983"
```

📌 **解释：**

- `bindPort`: FRPS 和 FRPC 之间建立隧道的端口。客户端用它来连接服务器。
- `allowPorts`：frps **只允许** 使用 15266～15267之间的端口，客户端 `remote_port` **必须落在这个范围内**，超出范围 → 代理启动失败。
- `webServer.addr/port`: 可选的 Web 控制台（Dashboard），可以在浏览器查看连接状态。
- `auth.method/token`: 客户端连接时需要使用的认证令牌，应在服务端和客户端一致。

------

### 🚀 2) 在服务器上启动 FRP 服务端

进入你放置 `frps` 和 `frps.toml` 的文件夹，然后运行：

```shell
# 在当前 shell 里启动
./frps -c ./frps.toml
```

📌 如果想让它后台运行，可用 `nohup 命令 &`：

```shell
nohup ./frps -c ./frps.toml &
```

**作用说明：**

- `-c ./frps.toml`：告诉服务端使用你写好的配置文件。
- `&`：让程序在断开 SSH 后仍然运行。

------

### 🔍 3) 验证服务端是否启动成功

在服务器执行：

```shell
ss -tunlp | grep frps
```

如果看到监听在你 `bindPort` 和 Dashboard 端口（如 7000、7500），说明启动正常。

------

## 三、Windows 或 内网机器（客户端）配置

### 📌 1) 修改 `frpc.toml`

这是客户端的配置文件，用来告诉 FRP 需要把哪些服务穿透到公网：

```shell
# ------------------ FRP 客户端（frpc）配置 ------------------

# 服务端 主机 IP 或域名 和绑定端口
serverAddr = "8.148.83.45"
serverPort = 15253

# 连接协议（默认 TCP）
[transport]
protocol = "tcp"

# 应和服务端一致的认证 token
[auth]
method = "token"
token = "412983"

# 穿透内网的 Minecraft 服务器
[[proxies]]
name = "minecraft"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
# 必须在 frps allowPorts 范围内
remotePort = 15266
```

📌 **解释：**

| 配置项                     | 作用                                    |
| -------------------------- | --------------------------------------- |
| `serverAddr`, `serverPort` | FRPC 连接到 FRPS 所在服务器的地址和端口 |
| `[transport].protocol`     | 使用的协议（一般是 tcp）                |
| `auth.method/token`        | 认证令牌，需与服务端一致                |
| `[[proxies]]`              | 一个代理配置段，代表一个要穿透的服务    |

针对 `[[proxies]]`：

- `name`: 该代理的名称，用于区分多个穿透规则。
- `type`: 穿透类型，常见 `http`, `tcp`。
- `local_addr/local_port`: 内网服务的地址和端口（如你自己的 Web 服务是 80 端口）。
- `remote_port`: 公网服务器分配给这个代理的端口，别人通过这个端口访问。

------

### 🚀 2) 在客户端启动 FRP 客户端

进入客户端文件夹，运行：

```shell
# Windows 命令行
frpc.exe -c frpc.toml
```

或

```shell
# Linux / macOS 客户端
./frpc -c ./frpc.toml
```

**作用说明：**

- `-c frpc.toml`: 指定客户端配置文件。

------

## 四、测试是否启动成功

### ✅ 1) 检查连接状态

在客户端终端看到类似：

```shell
[I] [client/service.go:...] try to connect to server...
[I] [client/control.go:...] login to server success
[I] [proxy/proxy_manager.go:...] start proxy success
```

说明客户端成功连接到了服务端。

------

### ✅ 2) 测试端口访问

假设你配置了：

- 客户端内网 HTTP 服务监听本地 80
- remote_port = 8080

那么在浏览器访问：

```shell
http://你的服务器公网IP:8080
```

如果打开了内网服务网页，说明穿透成功。

------

## 五、注意事项

✔ FRPS 和 FRPC 的 `token` 必须完全一致，否则无法连接。 

✔ `remote_port` 不能和服务器上其它服务冲突。

✔ 如果服务器有防火墙，确保开放 `bindPort` 和 Client 访问的 `remote_port`。

✔ 如果要长期运行可结合 systemd / service 管理。 