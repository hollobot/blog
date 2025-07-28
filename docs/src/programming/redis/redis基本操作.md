## Redis 基本操作

#### **连接redis**

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

#### **String 类型操作**

```bash
# 设置值
SET key value

# 获取值
GET key

# 设置带过期时间的值（秒）
SETEX key seconds value

# 设置带过期时间的值（毫秒）
PSETEX key milliseconds value

# 只有key不存在时才设置
SETNX key value

# 批量设置
MSET key1 value1 key2 value2 key3 value3

# 批量获取
MGET key1 key2 key3
```

**List 类型操作**

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

#### **Set 类型操作**

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

#### redis 插入list类型数据

| 操作方式                                   | Redis 实际存储                   | 获取结果                                                     |
| :----------------------------------------- | :------------------------------- | :----------------------------------------------------------- |
| `expire(redisKey, time, TimeUnit.SECONDS)` |                                  | 设置储存时间                                                 |
| `rightPush(list)`                          | `["[id1,id2,id3]"]` (一个元素)   | 需要二次解析                                                 |
| `rightPushAll(list)`                       | `["id1","id2","id3"]` (三个元素) | 直接可用                                                     |
| `range(key,start,end)`                     | 查询所有数据start-end            | list.range(key,0,-1); 查询所有数据                           |
| `remove(list,count,target)`                | `["id1","id2","id3"]`            | count>0,从头开始查<br />count<0,从尾开始查<br />count=0,删除所有匹配的 |
