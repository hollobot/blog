# Redis 入门

Redis是一种键值型的NoSql数据库,

**Redis的常见命令**



## **连接 Redis**

```bash
# 本地连接
# 默认连接（localhost:6379）
redis-cli
# 指定主机和端口
redis-cli -h 127.0.0.1 -p 6379
# 连接带密码的Redis
redis-cli -h 127.0.0.1 -p 6379 -a password
# 选择特定数据库
redis-cli -h 127.0.0.1 -p 6379 -n 1

# 远程连接
# 连接远程Redis服务器
redis-cli -h 192.168.1.100 -p 6379 -a password
# 使用URL格式连接
redis-cli -u redis://username:password@hostname:port/database

# 选择数据库 redis 有16个数据库 DB 0-15
select 1
```



## Redis 通用命令

通用指令是部分数据类型的，都可以使用的指令，常见的有：

- KEYS：查看符合模板的所有key

  ```powershell
  # 查看所有key
  KEYS *
  # 查看以"user:"开头的所有key
  KEYS user:*
  ```

- DEL：删除一个指定的key

  ```powershell
  # 删除单个key
  DEL user:1001
  # 删除多个key
  DEL user:1001 user:1002 product:2001
  ```

- EXISTS：判断key是否存在

  ```powershell
  127.0.0.1:6379> SET username "admin"
  127.0.0.1:6379> EXISTS username
  (integer) 1  # 存在
  
  127.0.0.1:6379> EXISTS nonexistent
  (integer) 0  # 不存在
  ```

- EXPIRE：给一个key设置有效期，有效期到期时该key会被自动删除

  ```powershell
  127.0.0.1:6379> SET session:user001 "登录信息"
  127.0.0.1:6379> EXPIRE session:user001 300
  (integer) 1  # 设置成功
  
  127.0.0.1:6379> EXPIRE nonexistent 60
  (integer) 0  # key不存在，设置失败
  ```

- TTL：查看一个KEY的剩余有效期

  ```powershell
  127.0.0.1:6379> TTL permanent:data
  (integer) -1   # -1表示key存在但没有设置过期时间
  
  127.0.0.1:6379> TTL nonexistent
  (integer) -2   # -2表示key不存在
  ```

  



## **String 类型操作**

String类型，也就是字符串类型，是Redis中最简单的存储类型。

其value是字符串，不过根据字符串的格式不同，又可以分为3类：

- string：普通字符串
- int：整数类型，可以做自增、自减操作
- float：浮点类型，可以做自增、自减操作

不管是哪种格式，底层都是字节数组形式存储，只不过是编码方式不同。字符串类型的最大空间不能超过512m.

![image-20250826162432642](./assets/image-20250826162432642.png)

### **String的常见命令**

- **SET - 添加或修改String键值对**

  ```bash
  SET username "admin"
  SET age "25"
  ```

- **GET - 获取String值**

  ```bash
  GET username
  # 返回: "admin"
  ```

- **MSET - 批量设置多个键值对**

  ```bash
  MSET name "张三" age "30" city "北京"
  ```

- **MGET - 批量获取多个值**

  ```bash
  MGET name age city
  # 返回: 1) "张三" 2) "30" 3) "北京"
  ```

- **INCR - 整型自增1**

  ```bash
  SET counter "10"
  INCR counter
  # 返回: (integer) 11
  ```

- **INCRBY - 整型自增指定步长**

  ```bash
  INCRBY counter 5
  # 返回: (integer) 16
  ```

- **INCRBYFLOAT - 浮点数自增指定步长**

  ```bash
  SET price "10.5"
  INCRBYFLOAT price 2.3
  # 返回: "12.8"
  ```

- **SETNX - 仅当key不存在时设置**

  ```bash
  SETNX lock "process1"
  # 如果lock不存在返回: (integer) 1
  # 如果lock已存在返回: (integer) 0
  ```

- **SETEX - 设置键值对并指定过期时间(秒)**

  ```bash
  SETEX session:token 3600 "abc123xyz"
  # 设置token，3600秒后过期
  ```



### Key结构

Redis的key允许有多个单词形成层级结构，多个单词之间用':'隔开，格式如下：

```txt
项目名:业务名:类型:id
```

并且，在Redis的桌面客户端中，还会以相同前缀作为层级结构，让数据看起来层次分明，关系清晰：

![InWMfeD.png](./assets/InWMfeD.png)



## **List 类型操作**

```bash
# 从左边插入
LPUSH key value1 value2 value3
# 从右边插入
RPUSH key value1 value2 value3
# 在指定位置插入 piovot指定那个value位置点
LINSERT key BEFORE|AFTER pivot value

# 获取指定范围的元素
LRANGE key start stop
# 获取所有元素
LRANGE key 0 -1
# 获取指定索引的元素
LINDEX key index
# 获取列表长度
LLEN key

# 从左边弹出
LPOP key
# 从右边弹出
RPOP key
# 删除指定值
LREM key count value
# 保留指定范围内的元素
LTRIM key start stop
```



## **Set 类型操作**

```bash
# 添加成员
SADD key member1 member2 member3
# 删除成员
SREM key member1 member2
# 弹出随机成员
SPOP key

# 获取所有成员
SMEMBERS key
# 判断成员是否存在
SISMEMBER key member
# 获取集合大小
SCARD key
# 获取随机成员（不删除）
SRANDMEMBER key [count]
```



## Redis & Java

### redis 插入list类型数据

| 操作方式                                   | Redis 实际存储                   | 获取结果                                                     |
| :----------------------------------------- | :------------------------------- | :----------------------------------------------------------- |
| `expire(redisKey, time, TimeUnit.SECONDS)` |                                  | 设置储存时间                                                 |
| `rightPush(list)`                          | `["[id1,id2,id3]"]` (一个元素)   | 需要二次解析                                                 |
| `rightPushAll(list)`                       | `["id1","id2","id3"]` (三个元素) | 直接可用                                                     |
| `range(key,start,end)`                     | 查询所有数据start-end            | list.range(key,0,-1); 查询所有数据                           |
| `remove(list,count,target)`                | `["id1","id2","id3"]`            | count>0,从头开始查<br />count<0,从尾开始查<br />count=0,删除所有匹配的 |
