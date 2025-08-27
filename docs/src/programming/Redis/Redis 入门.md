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

  



## **String 类型**

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



## **Hash 类型**

Hash类型，也叫散列，其value是一个无序字典，类似于Java中的HashMap结构。

Hash结构可以将对象中的每个字段独立存储，可以针对单个字段做CRUD：

![image-20250827132020998](./assets/image-20250827132020998.png)



**Hash的常见命令有：**

```sh
# 1. HSET key field value：添加或修改 field 的值
HSET user:1 name "Tom"

# 2. HGET key field：获取某个 field 的值
HGET user:1 name

# 3. HMSET：批量添加多个 field
HMSET user:1 age 20 gender "male"

# 4. HMGET：批量获取多个 field 的值
HMGET user:1 name age gender

# 5. HGETALL：获取所有 field 和 value
HGETALL user:1

# 6. HKEYS：获取所有 field
HKEYS user:1

# 7. HINCRBY：让某个字段值自增（指定步长）
HINCRBY user:1 age 2

# 8. HSETNX：仅当 field 不存在时设置值
HSETNX user:1 email "tom@example.com"
```



## **List 类型操作**

Redis中的List类型与Java中的LinkedList类似，可以看做是一个双向链表结构。既可以支持正向检索和也可以支持反向检索。

特征也与LinkedList类似：

- 有序
- 元素可以重复
- 插入和删除快
- 查询速度一般

常用来存储一个有序数据，例如：朋友圈点赞列表，评论列表等。



**List的常见命令有：**

```sh
# 1. LPUSH key element ... ：向列表左侧插入一个或多个元素
LPUSH mylist "a" "b" "c"       # 列表变成 c b a

# 2. LPOP key：移除并返回列表左侧第一个元素
LPOP mylist                     # 返回 "c"，列表变成 b a

# 3. RPUSH key element ... ：向列表右侧插入一个或多个元素
RPUSH mylist "x" "y" "z"       # 列表变成 b a x y z

# 4. RPOP key：移除并返回列表右侧第一个元素
RPOP mylist                     # 返回 "z"，列表变成 b a x y

# 5. LRANGE key start end：返回指定范围内的元素
LRANGE mylist 0 -1              # 返回整个列表 ["b", "a", "x", "y"]

# 6. BLPOP：阻塞式左弹出（等待 5 秒）
BLPOP mylist 5                  # 如果 mylist 空，会等待 5 秒再返回

# 7. BRPOP：阻塞式右弹出（等待 5 秒）
BRPOP mylist 5                  # 如果 mylist 空，会等待 5 秒再返回
```



## **Set 类型**

Redis的Set结构与Java中的HashSet类似，可以看做是一个value为null的HashMap。因为也是一个hash表，因此具备与HashSet类似的特征：

- 无序

- 元素不可重复

- 查找快

- 支持交集、并集、差集等功能



**Set的常见命令有：**

```sh
# 1. SADD key member ... ：向 set 中添加一个或多个元素
SADD myset "a" "b" "c"          # myset = {a, b, c}

# 2. SREM key member ... ：移除 set 中的指定元素
SREM myset "b"     	             # myset = {a, c}

# 3. SCARD key：返回 set 中元素的个数
SCARD myset                     # 返回 2

# 4. SISMEMBER key member：判断一个元素是否存在于 set 中
SISMEMBER myset "a"             # 返回 1 (存在)
SISMEMBER myset "b"             # 返回 0 (不存在)

# 5. SMEMBERS key：获取 set 中的所有元素
SMEMBERS myset                  # 返回 {a, c}

SADD set1 "x" "y" "z"
SADD set2 "y" "z" "w"
# 6. SINTER key1 key2 ... ：求多个 set 的交集
SINTER set1 set2                # 返回 {y, z}

# 7. SDIFF key1 key2 ... ：求第一个key1 的差值
SDIFF  set1 set2                # 返回 {x}

# 8. sunion key1 key2 ... ：求多个 set 的并集
sunion set1 set2
```



## SortedSet 类型

Redis的SortedSet是一个可排序的set集合，与Java中的TreeSet有些类似，但底层数据结构却差别很大。SortedSet中的每一个元素都带有一个score属性，可以基于score属性对元素排序，底层的实现是一个跳表（SkipList）加 hash表。

SortedSet具备下列特性：

- 可排序
- 元素不重复
- 查询速度快

因为SortedSet的可排序特性，经常被用来实现排行榜这样的功能。



**SortedSet的常见命令有：**

```sh
# 1. zadd key score member：添加一个或多个元素
zadd myzset 10 "a"
zadd myzset 20 "b" 30 "c"     # myzset = {a:10, b:20, c:30}

# 2. zrem key member：删除一个元素
zrem myzset "b"               # myzset = {a:10, c:30}

# 3. zscore key member：获取某个元素的 score
zscore myzset "a"             # 返回 10

# 4. zrank key member：获取元素的排名（从 0 开始，按 score 升序）
zrank myzset "c"              # 返回 1

# 5. zcard key：获取元素个数
zcard myzset                  # 返回 2

# 6. zcount key min max：统计 score 范围内的元素个数
zcount myzset 5 25            # 返回 1 (只有 a 的 score=10 在范围内)

# 7. zincrby key increment member：让元素的 score 自增
zincrby myzset 5 "a"          # a 的 score = 15

# 8. zrange key start stop：按照 score 升序，获取指定排名范围内的元素
zrange myzset 0 -1            # 返回 ["a", "c"]

# 9. zrangebyscore key min max：获取指定 score 范围内的元素
zrangebyscore myzset 10 30    # 返回 ["a", "c"]

# 10. zdiff numkeys key [key ...]：差集
zadd z1 1 "a" 2 "b" 3 "c"
zadd z2 2 "b" 3 "c" 4 "d"
zdiff 2 z1 z2                 # 返回 {"a"}

# 11. zinter numkeys key [key ...]：交集
zinter 2 z1 z2                # 返回 {"b","c"} (score 默认求和)

# 12. zunion numkeys key [key ...]：并集
zunion 2 z1 z2                # 返回 {"a","b","c","d"} (score 默认求和)
```



## Redis 客户端

![image-20250827145040785](./assets/image-20250827145040785.png)



标记为*的就是推荐使用的java客户端，包括：

- Jedis和Lettuce：这两个主要是提供了Redis命令对应的API，方便我们操作Redis，而SpringDataRedis又对这两种做了抽象和封装，因此我们后期会直接以SpringDataRedis来学习。
- Redisson：是在Redis基础上实现了分布式的可伸缩的java数据结构，例如Map、Queue等，而且支持跨进程的同步机制：Lock、Semaphore等待，比较适合用来实现特殊的功能需求。



## Jedis 客户端

Jedis的官网地址： https://github.com/redis/jedis

### 快速入门

**1. 引入依赖：**

```xml
<!--jedis-->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
<!--单元测试-->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.7.0</version>
    <scope>test</scope>
</dependency>
```



**2. 建立连接**

新建一个单元测试类，内容如下：

```java
private Jedis jedis;

@BeforeEach
void setUp() {
    // 1.建立连接
    // jedis = new Jedis("192.168.150.101", 6379);
    jedis = JedisConnectionFactory.getJedis();
    // 2.设置密码
    jedis.auth("123321");
    // 3.选择库
    jedis.select(0);
}
```



**3. 测试：**

```java
@Test
void testString() {
    // 存入数据
    String result = jedis.set("name", "虎哥");
    System.out.println("result = " + result);
    // 获取数据
    String name = jedis.get("name");
    System.out.println("name = " + name);
}

@Test
void testHash() {
    // 插入hash数据
    jedis.hset("user:1", "name", "Jack");
    jedis.hset("user:1", "age", "21");

    // 获取
    Map<String, String> map = jedis.hgetAll("user:1");
    System.out.println(map);
}
```



**4. 释放资源**

```java
@AfterEach
void tearDown() {
    if (jedis != null) {
        jedis.close();
    }
}
```



### 连接池

Jedis本身是线程不安全的，并且频繁的创建和销毁连接会有性能损耗，因此我们推荐大家使用Jedis连接池代替Jedis的直连方式。

```java
package com.heima.jedis.util;

import redis.clients.jedis.*;

public class JedisConnectionFactory {

    private static JedisPool jedisPool;

    static {
        // 配置连接池
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(8); // 最大连接数
        poolConfig.setMaxIdle(8); // 最大空闲连接
        poolConfig.setMinIdle(0); // 最小空闲连接
        poolConfig.setMaxWaitMillis(1000); // 如果没有空闲连接，等待超时。
        // 创建连接池对象，参数：连接池配置、服务端ip、服务端端口、超时时间、密码
        jedisPool = new JedisPool(poolConfig, "192.168.150.101", 6379, 1000, "123321");
    }

    public static Jedis getJedis(){
        return jedisPool.getResource();
    }
}
```



## SpringDataRedis 客户端

SpringBoot已经提供了对SpringDataRedis的支持，使用非常简单。



### 快速入门

**1. 引入依赖**

```xml
<!--redis依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--common-pool-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```



**2. 配置 Redis**

```yaml
spring:
  redis:
    host: 192.168.150.101
    port: 6379
    password: 123321
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: 100ms
```



**3. 注入RedisTemplate**

因为有了SpringBoot的自动装配，我们可以拿来就用：

```java
@SpringBootTest
class RedisStringTests {

    @Autowired
    private RedisTemplate redisTemplate;
}
```



**4. 编写测试**

```java
@SpringBootTest
class RedisStringTests {

    @Autowired
    private RedisTemplate edisTemplate;

    @Test
    void testString() {
        // 写入一条String数据
        redisTemplate.opsForValue().set("name", "虎哥");
        // 获取string数据
        Object name = stringRedisTemplate.opsForValue().get("name");
        System.out.println("name = " + name);
    }
}
```





### 自定义序列化

RedisTemplate可以接收任意Object作为值写入Redis：

![image-20250827143658068](./assets/image-20250827143658068.png)



只不过写入前会把Object序列化为字节形式，默认是采用JDK序列化，得到的结果是这样的：

![image-20250827143706266](./assets/image-20250827143706266.png)

**缺点：**

- 可读性差
- 内存占用较大



**我们可以自定义RedisTemplate的序列化方式，代码如下：**

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory){
        // 创建RedisTemplate对象
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 设置连接工厂
        template.setConnectionFactory(connectionFactory);
        // 创建JSON序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        // 设置Key的序列化 (StringRedisSerializer)
        template.setKeySerializer(RedisSerializer.string());
        template.setHashKeySerializer(RedisSerializer.string());
        // 设置Value的序列化(GenericJackson2JsonRedisSerializer)
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);
        // 返回
        return template;
    }
}
```

这里采用了JSON序列化来代替默认的JDK序列化方式。最终结果如图：

![image-20250827144718120](./assets/image-20250827144718120.png)

整体可读性有了很大提升，并且能将Java对象自动的序列化为JSON字符串，并且查询时能自动把JSON反序列化为Java对象。不过，其中记录了序列化时对应的class名称，目的是为了查询时实现自动反序列化。这会带来额外的内存开销。



### StringRedisTemplate

为了节省内存空间，我们可以不使用JSON序列化器来处理value，而是统一使用String序列化器，要求只能存储String类型的key和value。当需要存储Java对象时，手动完成对象的序列化和反序列化。

![image-20250827144754540](./assets/image-20250827144754540.png)

因此SpringDataRedis就提供了RedisTemplate的子类：StringRedisTemplate，它的key和value的序列化方式默认就是String方式。

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;
// JSON序列化工具
private static final ObjectMapper mapper = new ObjectMapper();

@Test
void testSaveUser() throws JsonProcessingException {
    // 创建对象
    User user = new User("虎哥", 21);
    // 手动序列化
    String json = mapper.writeValueAsString(user);
    // 写入数据
    stringRedisTemplate.opsForValue().set("user:200", json);

    // 获取数据
    String jsonUser = stringRedisTemplate.opsForValue().get("user:200");
    // 手动反序列化
    User user1 = mapper.readValue(jsonUser, User.class);
    System.out.println("user1 = " + user1);
}
```

