# 安装 Java



## docker 安装



#### 官方 OpenJDK 镜像

```sh
# 拉取最新版本
docker pull openjdk:latest

# 拉取指定版本
docker pull openjdk:8
docker pull openjdk:11
docker pull openjdk:17
docker pull openjdk:21
```



#### Eclipse Temurin（推荐）

```sh
docker pull eclipse-temurin:8
docker pull eclipse-temurin:11
docker pull eclipse-temurin:17
docker pull eclipse-temurin:21
```



####  jar 包后台运行



```sh
# 后台运行 jar 包（假设 jar 包在当前目录）
docker run -d \
  --name my-java-app \
  -p 7777:7777 \
  -v $(pwd):/app \
  -w /app \
  openjdk:8 \
  java -jar your-app.jar
  

docker run -d \
  --name java-app \
  --restart unless-stopped \
  -p 7777:7777 \
  -v $(pwd):/app \
  -v $(pwd)/logs:/app/logs \
  -w /app \
  -e JAVA_OPTS="-Xmx1g -Xms512m" \
  -e TZ=Asia/Shanghai \
  openjdk:8 \
  java $JAVA_OPTS -jar app.jar
```



#### 参数说明：

- `-d`：后台运行
- `--name java-app`：容器名称
- `--restart unless-stopped`：自动重启（除非手动停止）
- `-p 8080:8080`：端口映射
- `-v $(pwd):/app`：挂载当前目录到容器的 /app
- `-v $(pwd)/logs:/app/logs`：挂载日志目录
- `-w /app`：设置工作目录
- `-e JAVA_OPTS`：JVM 参数
- `-e TZ`：设置时区



#### 前台运行（实时查看日志）

```sh
# 前台运行，直接在终端查看日志
docker run --rm \
  -p 7777:7777 \
  -v $(pwd):/app \
  -w /app \
  openjdk:8 \
  java -jar app.jar
```

