# MySQL 常见函数

### 1. 聚合函数

聚合函数用于对一组数据执行计算，常用于 GROUP BY 语句来进行数据分组后的计算。例如常见的有，平均数，最大值，最小值和总和。

| 函数        | 描述             |
| ----------- | ---------------- |
| COUNT(*)    | 统计行数         |
| SUM(column) | 计算某列的总和   |
| AVG(column) | 计算某列的平均值 |
| MAX(column) | 计算某列的最大值 |
| MIN(column) | 计算某列的最小值 |

**使用示例**

```sql
select count(*) from emp where sal>2000;
select SUM(sal) from emp where sal>2000;
select AVG(sal) from emp where sal>2000;
select MAX(sal) from emp where sal>2000;
select MIN(sal) from emp where sal>2000;
```

### 2. **开窗函数**

开窗函数用于在查询结果的某一组数据上进行计算，但不会折叠行，即计算结果仍然返回到每一行。简单理解他是为了简化SQL开发的一种简单嵌套函数。

| 函数                                | 描述                         |
| ----------------------------------- | ---------------------------- |
| ROW_NUMBER()                        | 按指定顺序编号，无重复值     |
| RANK()                              | 按顺序编号，遇到相同值会跳号 |
| DENSE_RANK()                        | 按顺序编号，相同值不会跳号   |
| LAG(column, offset, default)        | 取前 offset 行的值           |
| LEAD(column, offset, default)       | 取后 offset 行的值           |
| SUM(column) OVER (PARTITION BY ...) | 按窗口计算总和               |
| AVG(column) OVER (PARTITION BY ...) | 按窗口计算均值               |

**使用示例**

```sql
#基本结构
函数名([参数]) OVER (
  [PARTITION BY 分组字段]
  [ORDER BY 排序字段]
  [ROWS/RANGE 窗口范围]
)
```



### 3. 数值函数 

用于处理数值类型的数据，如四舍五入、取整、取绝对值等。

| 函数        | 作用                  | 示例                     | 结果    |
| ----------- | --------------------- | ------------------------ | ------- |
| ABS(x)      | 取绝对值              | SELECT ABS(-10);         | 10      |
| CEIL(x)     | 向上取整              | SELECT CEIL(3.4);        | 4       |
| FLOOR(x)    | 向下取整              | SELECT FLOOR(3.8);       | 3       |
| ROUND(x, d) | 四舍五入              | SELECT ROUND(3.14159,2); | 3.14    |
| RAND()      | 生成 0~1 之间的随机数 | SELECT RAND();           | 0.78452 |
| MOD(x, y)   | 取模（余数）          | SELECT MOD(10,3);        | 1       |

### 4. 字符串函数 

用于处理字符串，如拼接、替换、提取子串等。

| 函数                        | 作用           | 示例                                           | 结果        |
| --------------------------- | -------------- | ---------------------------------------------- | ----------- |
| LENGTH(s)                   | 计算字符串长度 | SELECT LENGTH('Hello');                        | 5           |
| UPPER(s)                    | 转换为大写     | SELECT UPPER('hello');                         | HELLO       |
| LOWER(s)                    | 转换为小写     | SELECT LOWER('HELLO');                         | hello       |
| TRIM(s)                     | 去掉首尾空格   | SELECT TRIM(' abc ');                          | abc         |
| SUBSTRING(s, start, length) | 提取子串       | SELECT SUBSTRING('abcdef',2,3);                | bcd         |
| CONCAT(s1, s2, ...)         | 字符串拼接     | SELECT CONCAT('Hello',' ','World');            | Hello World |
| REPLACE(s, from, to)        | 替换子串       | SELECT REPLACE('Hello World', 'World', 'SQL'); | Hello SQL   |

### 5. 日期时间函数 

用于处理日期和时间，如计算日期差、格式化日期等。

|             函数             | 作用               | 示例                                             | 结果                |
| :--------------------------: | ------------------ | ------------------------------------------------ | ------------------- |
|            NOW()             | 获取当前时间       | SELECT NOW();                                    | 2025-02-25 12:30:45 |
|          CURDATE()           | 获取当前日期       | SELECT CURDATE();                                | 2025-02-25          |
|          CURTIME()           | 获取当前时间       | SELECT CURTIME();                                | 12:30:45            |
|           YEAR(d)            | 提取年份           | SELECT YEAR('2025-02-25');                       | 2025                |
|           MONTH(d)           | 提取月份           | SELECT MONTH('2025-02-25');                      | 2                   |
|            DAY(d)            | 提取日             | SELECT DAY('2025-02-25');                        | 25                  |
|       DATEDIFF(d1, d2)       | 计算日期间隔（天） | SELECT DATEDIFF('2025-03-01', '2025-02-25');     | 4                   |
|       TIMEDIFF(t1, t2)       | 计算时间差         | SELECT TIMEDIFF('12:30:45', '11:25:30');         | 01:05:15            |
| DATE_ADD(d, INTERVAL n unit) | 日期加法           | SELECT DATE_ADD('2025-02-25', INTERVAL 10 DAY);  | 2025-03-07          |
| DATE_SUB(d, INTERVAL n unit) | 日期减法           | SELECT DATE_SUB('2025-02-25', INTERVAL 1 MONTH); | 2025-01-25          |

### 6. 条件判断函数 

用于逻辑判断，比如 CASE、IFNULL 等。

| 函数                                   | 作用               | 示例                                  | 结果    |
| -------------------------------------- | ------------------ | ------------------------------------- | ------- |
| IF(condition, true_value, false_value) | 条件判断           | SELECT IF(10 > 5, 'Yes', 'No');       | Yes     |
| IFNULL(expr, value)                    | 为空时替换值       | SELECT IFNULL(NULL, 'default');       | default |
| COALESCE(a, b, c, ...)                 | 取第一个非 NULL 值 | SELECT COALESCE(NULL, NULL, 'Hello'); | Hello   |
| CASE WHEN ... THEN ... ELSE ... END    | 多条件判断         | 见示例                                |         |

条件逻辑函数案例

```sql
SELECT 
    account,
    gender,
    CASE 
        WHEN gender = 'M' THEN 'Male'
        WHEN gender = 'F' THEN 'Female'
        ELSE 'Unknown'
    END AS gender_desc
FROM dim_user;
```



### 7.案例和练习 

下面给出一个简单的案例，包含两个表的创建、插入样例数据以及一个基本的 JOIN 查询，适合新手练习 SQL。最后还附带三个个简单的练习题。	

```sql
# 创建数据库并使用
CREATE DATABASE IF NOT EXISTS test;
USE test;

# 事件日志表
CREATE TABLE ods_app_event_log (
  account VARCHAR(50) COMMENT '用户账号',
  eventId VARCHAR(50) COMMENT '事件类型',
  ts BIGINT COMMENT '事件时间戳',
  PRIMARY KEY (account, ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='APP用户事件日志表';

# 用户维度表
CREATE TABLE dim_user (
  account VARCHAR(50) COMMENT '用户账号',
  user_name VARCHAR(100) COMMENT '用户名',
  gender VARCHAR(10) COMMENT '性别',
  PRIMARY KEY (account)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户维度表';

# 插入样例数据
-- 插入事件日志数据
INSERT INTO ods_app_event_log (account, eventId, ts) VALUES
('user1', 'login', 1650000000),
('user1', 'search', 1650003600),
('user2', 'login', 1650007200),
('user3', 'purchase', 1650010800),
('user2', 'search', 1650014400);

-- 插入用户维度数据
INSERT INTO dim_user (account, user_name, gender) VALUES
('user1', 'Alice', 'F'),
('user2', 'Bob', 'M'),
('user3', 'Charlie', 'M');
```

- 练习题1：写一个 SQL 查询，将事件日志表和用户维度表通过 account 字段连接，显示每条事件记录中用户的账号、用户名和事件类型。

```sql
SELECT e.account, u.user_name, e.eventId
FROM ods_app_event_log e
JOIN dim_user u ON e.account = u.account;
```

- 练习题2：统计每个用户在事件日志表中的总事件数，并显示账号、用户名和事件总数。

```sql
SELECT u.account, u.user_name, COUNT(e.eventId) AS event_count
FROM ods_app_event_log e
JOIN dim_user u ON e.account = u.account
GROUP BY u.account, u.user_name;
```

- 练习题3：根据用户性别统计所有用户的总事件数，显示性别以及对应的事件总数。

```sql
SELECT u.gender, COUNT(e.eventId) AS total_events
FROM ods_app_event_log e
JOIN dim_user u ON e.account = u.account
GROUP BY u.gender;
```

**示例：计算每个用户的事件数** 

```sql
SELECT account, COUNT(eventId) AS event_count
FROM ods_app_event_log
GROUP BY account;
```