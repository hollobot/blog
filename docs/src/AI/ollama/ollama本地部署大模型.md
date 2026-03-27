# CentOS 9 本地安装 Ollama 部署 大模型





## CentOS 9 本地安装 Ollama

- CentOS 9 系统
- root 权限或具有 sudo 权限的账户
- 建议配置：16 GB 内存、12 GB 以上存储空间、4 核 CPU

------

> \# 启动服务（安装后通常自动运行） ollama serve

### 第一步：安装 zstd 依赖

```bash
# 解压缩工具
yum install -y zstd
```

------

### 第二步：执行官方安装脚本

```bash
# 国内环境需要设置代理
export http_proxy=http://192.168.30.1:7897
export https_proxy=http://192.168.30.1:7897

# 安装
curl -fsSL https://ollama.com/install.sh | sh
```

脚本会自动完成以下工作：

- 下载 Ollama 二进制文件到 `/usr/local`
- 创建 `ollama` 系统用户
- 配置 systemd 服务并设置开机自启

------

### 第三步：启动服务并设置开机自启

```bash
# 开机自启动
systemctl enable ollama
#手动启动ollama
systemctl start ollama
```

------

### 第四步：验证安装

```bash
# 查看版本
ollama --version

# 查看服务状态
systemctl status ollama

# 测试 API 是否正常响应
curl http://localhost:11434
```

返回 `Ollama is running` 即表示安装成功。

------

### 可选：允许外部访问

默认 Ollama 仅监听 `127.0.0.1:11434`，如需远程访问，执行以下步骤：

**修改服务配置：**

```bash
systemctl edit ollama
```

在文件中添加：

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

**重载并重启服务：**

```bash
systemctl daemon-reload
systemctl restart ollama
```

**开放防火墙端口：**

```bash
firewall-cmd --permanent --add-port=11434/tcp
firewall-cmd --reload
```

> ⚠️ 注意：开放外部访问后 API 无认证保护，建议配合防火墙规则限制来源 IP。



### 卸载Ollama

```sh
# 停止并禁用服务
systemctl stop ollama 2>/dev/null
systemctl disable ollama 2>/dev/null

# 删除二进制、库文件、服务文件、模型数据
rm -rf /usr/local/bin/ollama \
       /usr/local/lib/ollama \
       /usr/share/ollama \
       /etc/systemd/system/ollama.service \
       /root/.ollama \
       /home/*/.ollama

# 删除 ollama 用户和用户组
userdel ollama 2>/dev/null
groupdel ollama 2>/dev/null

# 重载 systemd 配置
systemctl daemon-reload
```



## Ollama 基本使用



### 一、基本指令

```sh
# 启动服务（安装后通常自动运行）
ollama serve

# 下载模型
ollama pull qwen3:1.7b
ollama pull qwen3.5:2b
ollama pull deepseek-r1:1.5b

# 下载并直接运行（没有会自动下载）
ollama run qwen3:1.7b

# 查看已安装的模型
ollama list

# 查看模型详情
ollama show qwen3:1.7b

# 查看当前运行中的模型
ollama ps

# 删除模型
ollama rm qwen3:1.7b

# 复制模型
ollama cp qwen3:1.7b qwen3:1.7b-backup
```

### 二、自定义模型（重要）

一条一条回车执行，`/save` 之后永久生效

```sh
# 启动模型
ollama run qwen3.5:2b

# 设置上下文窗口
/set parameter num_ctx 16384

# 设置温度
/set parameter temperature 0.7

# 设置采样范围
/set parameter top_p 0.9

# 保存为新模型 （一定要save）
/save qwen3.5:2b

# 退出
/bye
```

#### temperature（温度）

控制回答的**随机性/创意度**：

| 值     | 表现                                      |
| ------ | ----------------------------------------- |
| `0.0`  | 每次回答几乎一样，非常确定，适合做题/计算 |
| `0.7`  | 平衡，有一定灵活性但不乱，适合编码        |
| `1.0`  | 比较随机，适合写作/头脑风暴               |
| `1.5+` | 很混乱，一般不用                          |

简单理解：**越低越严谨，越高越发散**。

------

#### top_p（采样范围）

控制模型**每次从多大的词汇范围里选下一个词**：

| 值    | 表现                           |
| ----- | ------------------------------ |
| `0.5` | 只从最可能的一小撮词里选，保守 |
| `0.9` | 从概率前 90% 的词里选，平衡 ✅  |
| `1.0` | 所有词都可能被选到             |

简单理解：**越低越保守，越高选词范围越大**。

------

#### 两者关系

- `temperature` 控制**选词的随机程度**
- `top_p` 控制**候选词的范围**

编码场景用默认推荐值就好，一般不需要调：

```
temperature 0.7
top_p 0.9
```