# MinIO 对象存储系统

------

## 一、MinIO Linux 部署

### 1.1 环境要求

| 项目     | 要求                         |
| -------- | ---------------------------- |
| 操作系统 | CentOS 7+ / RHEL 8+          |
| 内存     | 建议 4GB+                    |
| 磁盘     | XFS 文件系统（推荐）         |
| 端口     | 9000（API）、9001（Console） |

------

### 1.2 配置国内镜像源（加速下载）

由于官方源在国内访问较慢，建议先切换为阿里云 yum 镜像源。

```bash
# 备份原有 repo 文件
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak

# CentOS 7 使用阿里云镜像
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 清理并重建缓存
yum clean all
yum makecache
```

> **其他可用镜像源：**
>
> - 腾讯云：`http://mirrors.cloud.tencent.com/repo/centos7_base.repo`
> - 华为云：`https://repo.huaweicloud.com/repository/conf/CentOS-7-reg.repo`

------

### 1.3 安装 MinIO

MinIO 官方未提供 yum 仓库，采用 **手动下载 RPM 包 + yum 本地安装** 的方式，既能用 yum 管理依赖，又能解决网络慢的问题。

#### 方法一：使用清华镜像站下载 RPM（推荐）（废弃了）

```bash
# 从清华大学镜像站下载 MinIO RPM 包
wget https://mirrors.tuna.tsinghua.edu.cn/minio/server/minio/release/linux-amd64/archive/minio-20240116160738.0.0.x86_64.rpm \
    -O /tmp/minio.rpm

# 使用 yum 本地安装（自动处理依赖）
yum localinstall -y /tmp/minio.rpm
```

> 如需选择其他版本，可在以下地址浏览： `https://mirrors.tuna.tsinghua.edu.cn/minio/server/minio/release/linux-amd64/archive/`

#### 方法二：官方地址下载（网络较好时）

```bash
# 配置代理
export http_proxy=http://192.168.30.1:7897
export https_proxy=http://192.168.30.1:7897
# 下载安装包
wget https://dl.min.io/server/minio/release/linux-amd64/minio.rpm -O /tmp/minio.rpm
# 安装
yum localinstall -y /tmp/minio.rpm
```

#### 验证安装

```bash
minio --version
# 输出示例：minio version RELEASE.2024-01-16T16-07-38Z
```

------

### 1.4 配置环境变量

```bash
# 创建配置目录
vim /etc/default/minio

# 复制配置数据
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin123"
MINIO_VOLUMES="/mnt/data"
MINIO_OPTS="--address :9000"
```

------

### 1.5 创建数据目录与专属用户

```bash
# 创建数据目录
mkdir -p /mnt/data

# 创建 minio 系统用户
groupadd -r minio-user
useradd -M -r -g minio-user minio-user
# 授权
chown -R minio-user:minio-user /mnt/data
chmod -R 755 /mnt/data
```

------

### 1.6 配置 MinIO 服务文件

编辑MinIO的服务文件： 

```bash
vim /usr/lib/systemd/system/minio.service
```

------

下载之后的服务文件是需要参照官方文档给出的模版进行配置的，这里对其做了中文注释

```bash
[Unit]
Description=MinIO
Documentation=https://min.io/docs/minio/linux/index.html
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio
[Service]
WorkingDirectory=/usr/local
User=minio-user
Group=minio-user
ProtectProc=invisible
EnvironmentFile=-/etc/default/minio
ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /etc/default/minio\"; exit 1; fi"
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
# MinIO 版本 RELEASE.2023-05-04T21-44-30Z 起支持 Type=notify 功能（参考 systemd.service 手册）
# 启用此选项可优化依赖 `After=minio.server` 的其他服务的 systemctl 配置
# 取消注释以下行以启用此功能
# Type=notify
# 允许 systemd 始终自动重启此服务
Restart=always
# 指定此进程可以打开的最大文件描述符数量
LimitNOFILE=65536
# 指定此进程可以创建的最大线程数
TasksMax=infinity
# 禁用停止超时逻辑，等待进程完全停止
TimeoutStopSec=infinity
SendSIGKILL=no
[Install]
WantedBy=multi-user.target
# Built for ${project.name}-${project.version} (${project.name})
```

#### 启动并设置开机自启

```bash
# 配置完成之后，重新加载 systemd 服务配置文件
systemctl daemon-reload

#关闭防火墙
systemctl stop firewalld
#关闭开机启动防火墙
systemctl disable firewalld

#启动 MinIO 服务
systemctl start minio
#设置 MinIO 服务开机自启
systemctl enable minio

#停止 MinIO 服务
systemctl stop minio

# 检查 MinIO 服务状态：
systemctl status minio

# 实时日志
journalctl -u minio.service -f
```

------

### 1.7 防火墙配置

```bash
# 开放 API 和控制台端口
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload

# 验证
firewall-cmd --list-ports
```

------

### 1.8 卸载 MinIO(如果需要)

```sh
sudo yum remove minio
sudo rm -rf /mnt/data
sudo rm -rf /etc/default/minio
sudo rm -rf /etc/yum.repos.d/minio.repo
```



## 二、Spring Boot 整合 MinIO

### 2.1 Maven 依赖

在 `pom.xml` 中添加：

```xml
<dependencies>
    <!-- MinIO Java SDK -->
    <dependency>
        <groupId>io.minio</groupId>
        <artifactId>minio</artifactId>
        <version>8.5.7</version>
    </dependency>

    <!-- OkHttp（MinIO SDK 依赖） -->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
        <version>4.11.0</version>
    </dependency>
    
    <!-- 测试：Swagger/OpenAPI 3（Spring Boot 3+） -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
</dependencies>
```

------

### 2.2 application.yml 配置

```yaml
minio:
  endpoint: http://localhost:9000      # MinIO 服务地址
  access-key: minioadmin               # 账号
  secret-key: minioadmin123            # 密码
  bucket-name: my-bucket               # 默认 Bucket

spring:
  servlet:
    multipart:
      max-file-size: 500MB             # 单文件最大限制
      max-request-size: 500MB          # 请求最大限制
```

------

### 2.3 配置类

```java
import io.minio.MinioClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "minio")
public class MinioConfig {

    private String endpoint;
    private String accessKey;
    private String secretKey;
    private String bucketName;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
```

------

### 2.4 MinioService 封装

```java
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    // ==================== Bucket 操作 ====================

    /**
     * 创建 Bucket（不存在时才创建）
     */
    public void createBucketIfAbsent(String bucketName) throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucketName).build());
        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    // ==================== 文件上传 ====================

    /**
     * 上传 MultipartFile，返回文件在 MinIO 中的 objectName
     */
    public String upload(MultipartFile file, String directory) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String ext = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        // 生成唯一文件名，避免覆盖
        String objectName = directory + "/" + UUID.randomUUID() + ext;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());

        return objectName;
    }

    /**
     * 上传输入流
     */
    public void uploadStream(String objectName, InputStream inputStream,
                              long size, String contentType) throws Exception {
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .stream(inputStream, size, -1)
                        .contentType(contentType)
                        .build());
    }

    // ==================== 文件下载 ====================

    /**
     * 获取文件输入流（供下载使用）
     */
    public InputStream download(String objectName) throws Exception {
        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .build());
    }

    // ==================== 预签名 URL ====================

    /**
     * 生成预签名下载 URL
     */
    public String getPresignedUrl(String objectName, int expireDays) throws Exception {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .expiry(expireDays, TimeUnit.DAYS)
                        .build());
    }

    // ==================== 文件删除 ====================

    /**
     * 删除单个文件
     */
    public void delete(String objectName) throws Exception {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .build());
    }

    // ==================== 文件查询 ====================

    /**
     * 列出指定前缀下的所有文件名
     */
    public List<String> listObjects(String prefix) throws Exception {
        List<String> names = new ArrayList<>();
        Iterable<Result<Item>> results = minioClient.listObjects(
                ListObjectsArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .prefix(prefix)
                        .recursive(true)
                        .build());
        for (Result<Item> result : results) {
            names.add(result.get().objectName());
        }
        return names;
    }

    /**
     * 判断文件是否存在
     */
    public boolean exists(String objectName) {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(objectName)
                            .build());
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

------

### 2.5 Controller 示例

```java
@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final MinioService minioService;

    /**
     * 上传文件
     * POST /api/file/upload?dir=avatar
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "dir", defaultValue = "uploads") String dir) throws Exception {

        String objectName = minioService.upload(file, dir);
        String url = minioService.getPresignedUrl(objectName, 7);

        Map<String, String> result = new HashMap<>();
        result.put("objectName", objectName);
        result.put("url", url);
        return ResponseEntity.ok(result);
    }

    /**
     * 下载文件
     * GET /api/file/download?objectName=uploads/xxx.jpg
     */
    @GetMapping("/download")
    public void download(@RequestParam("objectName") String objectName,
        HttpServletResponse response) throws Exception {
        try (InputStream is = minioService.download(objectName)) {
            String filename = objectName.substring(objectName.lastIndexOf("/") + 1);
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Disposition", "attachment; filename=" + filename);
            is.transferTo(response.getOutputStream());
        }
    }

    /**
     * 删除文件
     * DELETE /api/file/delete?objectName=uploads/xxx.jpg
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestParam("objectName") String objectName) throws Exception {
        minioService.delete(objectName);
        return ResponseEntity.ok("删除成功");
    }

    /**
     * 获取预签名访问 URL
     * GET /api/file/presigned-url?objectName=uploads/xxx.jpg&days=7
     */
    @GetMapping("/presigned-url")
    public ResponseEntity<String> presignedUrl(
        @RequestParam("objectName") String objectName,
        @RequestParam(value = "days", defaultValue = "7") int days) throws Exception {
        return ResponseEntity.ok(minioService.getPresignedUrl(objectName, days));
    }
}
```

------

### 2.6 Bucket 公开读策略（可选）

如果希望 Bucket 内文件可直接通过 URL 访问（无需预签名），在 `MinioService` 中添加初始化方法：

```java
import jakarta.annotation.PostConstruct;
import io.minio.SetBucketPolicyArgs;

@PostConstruct
public void initBucket() throws Exception {
    // 自动创建 Bucket
    createBucketIfAbsent(minioConfig.getBucketName());

    // 设置公开读策略
    String policy = String.format("""
        {
          "Version": "2012-10-17",
          "Statement": [{
            "Effect": "Allow",
            "Principal": {"AWS": ["*"]},
            "Action": ["s3:GetObject"],
            "Resource": ["arn:aws:s3:::%s/*"]
          }]
        }
        """, minioConfig.getBucketName());

    minioClient.setBucketPolicy(
            SetBucketPolicyArgs.builder()
                    .bucket(minioConfig.getBucketName())
                    .config(policy)
                    .build());
}
```

公开读后，文件可通过以下 URL 直接访问：

```
http://<MinIO地址>:9000/<bucket-name>/<objectName>
```

------

## 三、常见问题

### Q1：上传大文件超时

在 `MinioConfig` 中注入自定义 OkHttp 客户端：

```java
import okhttp3.OkHttpClient;
import java.util.concurrent.TimeUnit;

@Bean
public MinioClient minioClient() {
    OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(300, TimeUnit.SECONDS)
            .readTimeout(300, TimeUnit.SECONDS)
            .build();

    return MinioClient.builder()
            .endpoint(endpoint)
            .credentials(accessKey, secretKey)
            .httpClient(httpClient)
            .build();
}
```

------

### Q2：MinIO 服务无法启动

```bash
# 检查端口占用
ss -tlnp | grep 9000
ss -tlnp | grep 9001

# 检查数据目录权限
ls -la /data/minio
chown -R minio-user:minio-user /data/minio

# 查看详细错误日志
journalctl -u minio -n 50 --no-pager
```

------

### Q3：文件 objectName 命名规范建议

```
格式：{业务模块}/{yyyy-MM-dd}/{UUID}.{扩展名}
示例：avatar/2024-12-01/550e8400-e29b-41d4-a716-446655440000.jpg
      document/2024-12-01/contract-abc123.pdf
```

