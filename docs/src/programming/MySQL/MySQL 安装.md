# MySQL 安装



## docker 安装



#### **1. 拉取指定版本的 MySQL 镜像：**

```bash
docker pull mysql:8.0
```

#### **2. 创建数据卷（推荐）：**

**问题**：如果不使用数据卷，MySQL 的数据存储在容器内部，当容器被删除时，所有数据都会丢失

**解决**：数据卷将数据存储在宿主机上，即使容器被删除，数据仍然保留

```bash
docker volume create mysql-data
```



#### **3. 运行配置完整的容器：**

```bash
docker run --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=mypassword \
  -e MYSQL_DATABASE=mydatabase \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=myuserpassword \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  -d mysql:8.0
  
docker run --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=root \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  -d mysql:8.0
```



#### 常用环境变量说明

- `MYSQL_ROOT_PASSWORD`: root 用户密码（必需）
- `MYSQL_DATABASE`: 创建的数据库名
- `MYSQL_USER`: 创建的用户名
- `MYSQL_PASSWORD`: 用户密码
- `MYSQL_ALLOW_EMPTY_PASSWORD`: 允许空密码（不推荐）



#### 连接到 MySQL

**进入容器内连接：**

```bash
docker exec -it mysql-container mysql -u root -p
```

**从外部连接：**

```bash
mysql -h localhost -P 3306 -u root -p
```