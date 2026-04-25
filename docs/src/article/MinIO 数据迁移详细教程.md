# MinIO 完整数据迁移详细教程

包含：环境准备、`mc` 安装配置、**同集群 / 跨集群迁移**、全量 / 增量同步、数据校验、常见问题，指令附带通俗解释，全程可直接落地。

## 一、核心迁移方案说明

|          方式           |           适用场景           |                  特点                  |
| :---------------------: | :--------------------------: | :------------------------------------: |
| `mc mirror`（官方推荐） | 跨服务器、跨集群、不停机迁移 | 支持增量、断点续传、双向同步、生产首选 |
|         `mc cp`         |   小数据量、一次性简单复制   |     命令简单，无增量，适合测试环境     |
|      底层目录拷贝       |      单机同盘、允许停机      |  直接复制文件，速度最快，仅限单机部署  |

> 生产环境统一使用：**mc mirror**

------

## 二、环境准备

### 2.1 安装 MinIO 客户端 mc

`mc` 是 MinIO 官方命令行工具，用于对象存储管理、数据迁移。

```bash
# 1. 下载 mc 二进制文件
wget https://dl.min.io/client/mc/release/linux-amd64/mc

# 国内镜像 ARM 服务器用 | 查看系统架构:uname -m
wget https://dl.minio.org.cn/client/mc/release/linux-arm64/mc
# 国内镜像 X86 服务器用
wget https://dl.minio.org.cn/client/mc/release/linux-amd64/mc

# 2. 赋予执行权限
chmod +x mc

# 3. 移动到系统全局命令目录，任意位置可执行
mv mc /usr/local/bin/

# 4. 验证安装
mc --version
```

指令解释：

- `wget`：从 MinIO 官方下载客户端程序
- `chmod +x`：添加可执行权限，否则无法运行
- `mv`：将程序移入系统环境变量，全局调用

### 2.2 配置源 MinIO、目标 MinIO 别名

别名作用：给两台 MinIO 服务起简称，后续迁移不用重复写 IP + 端口。

```bash
# 语法：mc alias set 别名 服务地址 账号 密码
# 1. 配置【源 MinIO】（要迁移的旧服务）
mc alias set minio-src http://192.168.30.129:9000 账号 密码

# 2. 配置【目标 MinIO】（接收数据的新服务）
mc alias set minio-dst http://目标IP:9000 账号 密码

# 3. 测试连通性，查看所有桶
mc ls minio-src
mc ls minio-dst
```

------

## 三、方案一：mc mirror 企业级迁移（推荐）

### 3.1 迁移全部桶 + 全部数据（全量初始化）

```bash
# 全量同步源所有数据到目标，覆盖重复文件
mc mirror --overwrite minio-src/ minio-dst/
```

参数解释：

- `mirror`：镜像同步，保持两端数据一致
- `--overwrite`：目标存在同名文件时，强制覆盖
- 末尾 `/`：代表同步桶内所有对象、目录

### 3.2 只迁移指定单个桶

```bash
# 仅同步 bucket01 这个桶
mc mirror --overwrite minio-src/bucket01 minio-dst/bucket01
```

### 3.3 增量实时同步（不停机业务迁移）

第一次全量同步后，持续监听源端新增 / 修改 / 删除文件，无缝迁移。

```bash
# 实时监听 + 增量同步 + 删除目标冗余文件
mc mirror --overwrite --remove --watch minio-src/ minio-dst/
```

参数补充：

- `--remove`：删除目标端多余文件，严格一致
- `--watch`：常驻后台，实时增量同步

### 3.4 显示迁移进度

大文件迁移时，查看实时进度：

```bash
mc mirror --overwrite --progress minio-src/ minio-dst/
```

------

## 四、方案二：mc cp 简单复制（测试 / 小数据）

### 4.1 手动创建目标桶

MinIO 不允许直接复制到不存在的桶，需要提前创建：

```bash
# 在目标端新建桶
mc mb minio-dst/bucket01
```

### 4.2 递归复制桶内所有文件

```bash
# -r 递归复制文件夹/所有对象
mc cp -r minio-src/bucket01/ minio-dst/bucket01/
```

------

## 五、方案三：底层目录拷贝（单机停机迁移）

适用于：两台服务器内网传输、允许短暂停机、超大文件。

1. 停止新旧 MinIO 服务
2. 找到 MinIO 数据存储目录（默认 `/data`）
3. 使用 `rsync` 远程拷贝

```bash
# 增量远程拷贝，断点续传，保留文件权限
rsync -avz /data/ 目标服务器IP:/data/
```

指令解释：

- `-a`：归档模式，保留权限、时间、目录结构
- `-v`：显示详细日志
- `-z`：传输压缩，节省带宽

------

## 六、迁移后数据校验（必做）

### 6.1 对比两端文件差异

```bash
# 自动比对源、目标所有文件，列出差异
mc diff minio-src/ minio-dst/
```

### 6.2 统计文件数量 & 容量

```bash
# 查看源端总占用空间
mc du -h minio-src/

# 查看目标端总占用空间
mc du -h minio-dst/

# 统计文件总数
mc ls -r minio-src/ | wc -l
mc ls -r minio-dst/ | wc -l
```

### 6.3 校验单个文件哈希

防止文件损坏、传输丢失：

```bash
mc sha256 minio-src/bucket01/test.txt
mc sha256 minio-dst/bucket01/test.txt
```

------

## 七、常用运维指令

```bash
# 查看所有配置的 MinIO 别名
mc alias list

# 删除无效别名
mc alias remove 别名

# 强制中断迁移：直接 Ctrl + C
```

------

## 八、常见报错解决

1. **Invalid Login**

- 原因：账号密码错误、服务器时间不同步
- 解决：核对 `mc alias` 账号密码，统一服务器系统时间

1. **Permission denied**

- 原因：MinIO 数据目录权限不足
- 解决：`chmod -R 755 /data` 赋予目录权限

1. **连接超时**

- 原因：防火墙 / 端口未放行
- 解决：放行 `9000`（API 端口）、`9001`（控制台端口）

------

## 补充：反向迁移（回滚方案）

如果迁移后需要切回旧 MinIO，反向执行同步即可：

```bash
mc mirror --overwrite minio-dst/ minio-src/
```