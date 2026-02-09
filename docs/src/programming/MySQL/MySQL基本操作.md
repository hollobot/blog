

# MySQL 基础

## MySQL 全核心语法整合基础模板

以下是**单 SELECT 语句**的 MySQL 全核心语法整合模板，浓缩了 `SELECT` 核心能力，覆盖条件筛选、联表、分组、聚合、CASE 条件、排序、限制等所有高频场景，无多余子查询 / CTE，仅保留最核心的单 SELECT 骨架，注释清晰且可直接复用：

```sql
select
  -- 1. 字段选择：基础字段/聚合函数/case条件/别名
  t1.id as 主键id,
  t1.name as 名称,
  t2.category as 分类,
  -- case条件判断（字段值替换/条件统计二合一）
  case 
    when t1.score >= 90 then '优秀'
    when t1.score >= 60 then '合格'
    else '不合格'
  end as 评分等级,
  count(distinct t1.user_id) as 去重统计数,  -- 去重聚合
  avg(t1.amount) as 平均值,                 -- 平均值聚合
  sum(case when t1.status = '有效' then 1 else 0 end) as 条件累加数  -- 条件聚合
from 主表 t1  -- 主表+别名（简化写法）
  -- 2. 联表查询（按需切换join类型）
  join 关联表 t2 on t1.关联字段 = t2.关联字段  -- 内连接（交集）
  left join 补充表 t3 on t1.关联字段 = t3.关联字段   -- 左连接（保留主表所有行）
  -- 3. 前置筛选（分组前过滤行）
where
  -- 日期范围筛选（推荐写法，利用索引）
  t1.create_time >= '2020-01-01' and t1.create_time < '2021-01-01'
  -- 基础条件筛选
  and t1.status in ('正常', '待处理')
  and t1.amount > 0
  -- 排除条件
  and t1.name not like '测试%'
-- 4. 分组（非聚合字段必须包含在group by中）
group by
  t1.id,
  t1.name,
  t2.category,
  评分等级  -- 可直接用字段别名（mysql 8.0+支持）
-- 5. 分组后筛选（仅针对聚合结果）
having
  平均值 >= 50  -- 聚合结果筛选
  and 条件累加数 > 0
-- 6. 排序（多字段+独立升降序）
order by
  平均值 desc,  -- 降序（核心排序）
  名称 asc,     -- 升序（兜底排序，asc可省略）
  主键id asc    -- 最终兜底（避免排序不稳定）
-- 7. 结果限制（分页/取前n条）
limit 10 offset 20;  -- 分页：跳过20条，取10条（也可简写 limit 20,10）
-- limit 5;  -- 简化：直接取前5条（无分页时用）
```



## 1. 数据表/库操作 

```sql
#语法结构
CREATE DATABASE [IF NOT EXISTS] database_name
  [CHARACTER SET charset_name]
  [COLLATE collation_name];

create database 数据库名; -- 创建数据库 

#实例
CREATE DATABASE mydatabase
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
  
# utf8mb4_unicode_ci：通用排序规则（推荐）。
# utf8mb4_general_ci：较旧的排序规则（性能稍快，但准确性稍差）。
# utf8mb4_bin：二进制排序（区分大小写）。

# 创建用户
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password'; # 只允许本地登录
CREATE USER 'hello'@'%' IDENTIFIED BY '123456'; # 任意IP

# 删除用户
DROP USER 'username'@'localhost';
DROP USER 'hello'@'%';

# 给普通用户授予权限
GRANT ALL PRIVILEGES ON dbname.* TO 'hello'@'%'; # 给某个数据库所有权限
GRANT SELECT, INSERT, UPDATE, DELETE ON dbname.* TO 'hello'@'%'; # 只授予读写权限
GRANT SELECT ON dbname.* TO 'hello'@'%'; # 只读权限

# 取消权限
REVOKE ALL PRIVILEGES ON dbname.* FROM 'hello'@'%'; # 取消全部权限（某个库）
REVOKE SELECT, INSERT, UPDATE, DELETE ON dbname.* FROM 'hello'@'%';

  
drop database 数据库名;  -- 删除数据库 

use 数据库名; -- 切换使用某个数据库 

show databases; -- 显示所有数据库 

select database(); -- 查看当前使用的数据库

# 表操作
create table 表名 ( 列名 数据类型 [约束], …… ); -- 创建表

drop table 表名; -- 删除表 

truncate table 表名; -- 清空表数据但保留表结构

show tables; -- 显示当前数据库中的所有表 

describe 表名; -- 查看表的结构 

show create table 表名; -- 查看表的创建语句 

select * from 表名; -- 查询表中所有数据
```

## 2. **修改表操作** 

```sql
alter table 表名 add 列名 数据类型 [约束];       -- 添加列

alter table 表名 drop column 列名;                  -- 删除列

alter table 表名 modify 列名 新数据类型;          -- 修改列数据类型

alter table 表名 change 旧列名 新列名 数据类型; -- 修改列名和数据类型

rename table 旧表名 to 新表名;                         -- 重命名表
```

## 3. **创建表操作** 

```sql
create table 表名 (
    列名 数据类型 [约束],
    列名 数据类型 [约束],
    ...
);  
-- 创建表

-- 示例
create table users (
    id int primary key auto_increment,
    name varchar(50) not null,
    email varchar(100) unique,
    created_at datetime default current_timestamp
);

-- 常见约束
（auto_increment）自动递增
PRIMARY KEY 用于标识表中每行数据的唯一标识符，列值必须唯一且不能为空。 id int primary key
NOT NULL 指定列值不能为空。  name varchar(50) not null
DEFAULT  为列设置默认值。    created_at datetime default current_timestamp
CHECK    限制列值必须满足的条件（从 MySQL 8.0 开始支持）。    age int check (age >= 18)
FOREIGN KEY 指定列为外键，引用其他表的主键，实现表与表之间的关联。
user_id int,
foreign key (user_id) references users(id)

-- 常见数据格式
INT (INTEGER)：4字节，范围：-2,147,483,648 到 2,147,483,647。
BIGINT：8字节，范围：极大数值范围，常用于主键。
FLOAT / DOUBLE：浮点数，适用于科学计算，但有精度问题。

CHAR(n)：固定长度字符串，最多255字符，未填满时右侧补空格。
VARCHAR(n)：可变长度字符串，最多65535字符（受限于行大小）。
TEXT：大文本字段，最大65,535字符（4字节存储）。
BLOB：二进制大对象，用于存储二进制数据（如图片、文件）。

DATE：日期，格式 YYYY-MM-DD。
DATETIME：日期和时间，格式 YYYY-MM-DD HH:MM:SS。
TIMESTAMP：时间戳，格式与 DATETIME 类似，但受系统时区影响。
TIME：时间，格式 HH:MM:SS。
YEAR：年，格式 YYYY。

BOOLEAN：实际上是 TINYINT 的别名，0 表示 FALSE，1 表示 TRUE。
JSON：用于存储 JSON 格式数据（MySQL 5.7 及以上版本支持）。
```

## 4. 修改表结构 

```sql
alter table 表名 add 列名 数据类型 [约束];       -- 添加列
alter table 表名 drop column 列名;              -- 删除列
alter table 表名 modify 列名 新数据类型;        -- 修改列数据类型
alter table 表名 change 旧列名 新列名 数据类型; -- 修改列名和数据类型
rename table 旧表名 to 新表名;                  -- 重命名表
```

## 5. 插入数据

**语法结构**

```sql
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
```

**如果你要插入所有列的数据，可以省略列名：**

```sql
INSERT INTO users
VALUES (NULL,'test', 'test@runoob.com', '1990-01-01', true);
```

**多条插入**

```sql
INSERT INTO users (username, email, birthdate, is_active)
VALUES
    ('test1', 'test1@runoob.com', '1985-07-10', true),
    ('test2', 'test2@runoob.com', '1988-11-25', false),
    ('test3', 'test3@runoob.com', '1993-05-03', true);
```

## 6. 删除数据

**基本语法结构**

```sql
DELETE FROM table_name
WHERE condition;
```

**子查询删除**

```sql
DELETE FROM customers
WHERE customer_id IN (
    SELECT customer_id
    FROM orders
    WHERE order_date < '2023-01-01'
);
```

## 7. 修改数据

**基本语法结构**

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**使用表达式跟新**

```sql
UPDATE products
SET price = price * 1.1
WHERE category = 'Electronics';
```

**子查询跟新**

```sql
UPDATE customers
SET total_purchases = (
    SELECT SUM(amount)
    FROM orders
    WHERE orders.customer_id = customers.customer_id
)
WHERE customer_type = 'Premium';
```

## 8. 联表查询

**基本查询结构**

```sql
SELECT 列名1, 列名2, ... 
FROM 表名 
[WHERE 条件]        -- 筛选条件
[JOIN 表名 ON 条件] -- 关联表
[GROUP BY 列名]     -- 分组
[HAVING 条件]       -- 分组后的筛选条件
[ORDER BY 列名 ASC|DESC] -- 排序
[LIMIT 偏移量, 数量]; -- 分页
```

**基本查询指令**

```sql
-- 查询指定的列或所有列：
SELECT * FROM 表名;
SELECT 列名1, 列名2 FROM 表名;

-- 用于筛选记录：
SELECT * FROM 表名 WHERE 条件;

-- JOIN 和 ON
用于关联多张表：
SELECT * FROM 表1 JOIN 表2 ON 表1.列 = 表2.列;

-- LIKE用于模糊匹配：
-- 开头匹配： 'J%' ,'--J--' ,'J%','%J%'
SELECT * FROM 表名 WHERE 列 LIKE '匹配模式';

-- GROUP BY 和 HAVING分组查询：
SELECT 列, 聚合函数 FROM 表名 GROUP BY 列 [HAVING 条件];

-- ORDER BY 排序：
SELECT * FROM 表名 ORDER BY 列名 ASC|DESC;

-- LIMIT分页或限制返回记录数量：
SELECT * FROM 表名 LIMIT 偏移量, 数量;
```



## 9. CASE 条件判断语法

`CASE` 是 MySQL 中实现 “多条件分支” 的核心，分「简单 CASE」和「搜索 CASE」，后者更灵活。

模板 1：简单 CASE（匹配固定字段值）

```sql
SELECT 
  字段名,
  CASE 匹配字段
    WHEN 匹配值1 THEN 结果1
    WHEN 匹配值2 THEN 结果2
    ELSE 默认结果  -- 可选，无匹配时返回NULL
  END AS 别名
FROM 表名;
```

模板 2：搜索 CASE（自定义条件，推荐）

```sql
SELECT 
  字段名,
  CASE 
    WHEN 条件1 THEN 结果1
    WHEN 条件2 THEN 结果2
    ELSE 默认结果  -- 可选
  END AS 别名
FROM 表名;
```

#### **常用场景示例**

场景 1：字段值替换（比如评分分级）

```sql
-- 将评分转为等级：≥4→高分，3→中等，≤2→低分
SELECT 
  movie_id,
  rating,
  CASE 
    WHEN rating >= 4 THEN '高分'
    WHEN rating = 3 THEN '中等'
    ELSE '低分'
  END AS rating_level
FROM MovieRating;
```

场景 2：条件累加（统计）

```sql
-- 统计2020年2月每部电影的高分（≥4）、低分（≤2）次数
SELECT 
  m.title,
  SUM(CASE WHEN mr.rating >=4 AND mr.created_at BETWEEN '2020-02-01' AND '2020-02-29' THEN 1 ELSE 0 END) AS high_score_count,
  SUM(CASE WHEN mr.rating <=2 AND mr.created_at BETWEEN '2020-02-01' AND '2020-02-29' THEN 1 ELSE 0 END) AS low_score_count
FROM MovieRating mr
JOIN Movies m ON mr.movie_id = m.movie_id
GROUP BY m.movie_id, m.title;
```



## 10. WITH 语法（CTE 公用表表达式，MySQL 8.0+ 支持）

`WITH` 用于定义临时结果集（CTE），简化复杂查询（替代子查询嵌套），可理解为 “临时表”，仅在当前查询中有效。

模板 1：单 CTE

```sql
WITH cte_name AS (
  -- 子查询：定义CTE的内容
  SELECT 字段1, 字段2 FROM 表名 WHERE 条件
)
-- 主查询：使用CTE
SELECT * FROM cte_name;
```

模板 2：多 CTE（逗号分隔）

```sql
WITH 
cte1 AS (SELECT 字段 FROM 表1 WHERE 条件),
cte2 AS (SELECT 字段 FROM 表2 WHERE 条件)
-- 关联多个CTE查询
SELECT * FROM cte1 JOIN cte2 ON cte1.字段 = cte2.字段;
```

#### 常用场景示例

场景 1：简化嵌套查询（比如先统计用户评论数，再查最活跃用户）

```sql
-- 步骤1：定义CTE统计每个用户的评论数
WITH user_comment_count AS (
  SELECT 
    user_id,
    COUNT(*) AS comment_num
  FROM MovieRating
  GROUP BY user_id
)
-- 步骤2：关联用户表，查评论数最多的用户
SELECT u.name, ucc.comment_num
FROM user_comment_count ucc
JOIN Users u ON ucc.user_id = u.user_id
ORDER BY ucc.comment_num DESC
LIMIT 1;
```

场景 2：递归 CTE（查询层级数据，比如部门树）

```sql
-- 示例：部门表（id:部门ID，name:部门名，parent_id:上级部门ID）
WITH RECURSIVE dept_tree AS (
  -- 初始层：顶级部门（parent_id=0）
  SELECT id, name, parent_id, 1 AS level
  FROM dept
  WHERE parent_id = 0
  UNION ALL
  -- 递归层：关联子部门
  SELECT d.id, d.name, d.parent_id, dt.level + 1 AS level
  FROM dept d
  JOIN dept_tree dt ON d.parent_id = dt.id
)
-- 查询所有部门及层级
SELECT * FROM dept_tree;
```



## 11. UNION / UNION ALL 专属语法模板

`UNION` 用于纵向拼接多个查询结果，核心要求：**拼接的查询结果列数一致、列类型兼容**，以下是模板：

```sql
-- 规则：
-- 1. UNION：自动去重（性能低，需比对所有行）
-- 2. UNION ALL：保留所有行（无去重，性能高，推荐优先用）
-- 3. 每个子查询必须用括号包裹（尤其是带ORDER BY/LIMIT时）

(
  -- 子查询1：第一个结果集
  SELECT 
    字段1, 字段2, 字段3  -- 列数/类型需与子查询2一致
  FROM 表A
  WHERE 表A.条件
)
UNION ALL  -- 替换为UNION则去重
(
  -- 子查询2：第二个结果集
  SELECT 
    字段A, 字段B, 字段C  -- 列数必须=子查询1，类型需兼容（如字符串/数值）
  FROM 表B
  WHERE 表B.条件
);
```



## 12. IF 函数的核心语法

`IF`函数是 MySQL 特有的简化条件判断函数（替代复杂的`CASE`），语法非常简洁：

```sql
IF(条件表达式, 满足条件时的返回值, 不满足条件时的返回值)
```

示例 1：替代 CASE 实现价格符号调整（核心需求）

```sql
select 
    stock_name,
    sum(
        -- IF语法：判断是否为Buy，是则-price，否则price（默认Sell）
        IF(operation = 'Buy', -price, price)
    ) as total_profit  -- 总盈亏
from Stocks
group by stock_name;
```



## 13. MySQL 正则

### 一、regexp 基本规则

以下模板均基于 `REGEXP` 关键字使用，格式为：`字段名 REGEXP '正则模板'`，匹配成功返回 1，失败返回 0。

**一、基础字符类型校验（核心模板）**

|         校验需求          |          正则模板          |            示例（匹配 / 不匹配）             |
| :-----------------------: | :------------------------: | :------------------------------------------: |
|    纯数字（至少 1 位）    |         `^[0-9]+$`         |  匹配：`123`、`0`；不匹配：`12a`、`12.3`、   |
|     纯整数（含正负）      |      `^[+-]?[0-9]+$`       | 匹配：`123`、`-456`、`+789`；不匹配：`12.3`  |
|     纯小数（含正负）      | `^[+-]?[0-9]+(\.[0-9]+)?$` | 匹配：`12.3`、`-45.67`；不匹配：`12.`、`abc` |
|     纯字母（大小写）      |       `^[a-zA-Z]+$`        |   匹配：`Abc`、`XYZ`；不匹配：`123`、`a1b`   |
|        纯小写字母         |         `^[a-z]+$`         |      匹配：`abc`；不匹配：`Abc`、`123`       |
|        纯大写字母         |         `^[A-Z]+$`         |      匹配：`ABC`；不匹配：`Abc`、`123`       |
| 字母 + 数字组合（无其他） |      `^[a-zA-Z0-9]+$`      |  匹配：`abc123`、`A89B`；不匹配：`abc!123`   |
|   字母 + 数字 + 下划线    |     `^[a-zA-Z0-9_]+$`      |  匹配：`abc_123`、`A_89`；不匹配：`abc-123`  |

**二、长度限制类校验（结合字符类型）**

|      校验需求       |       正则模板        |                       说明                       |
| :-----------------: | :-------------------: | :----------------------------------------------: |
|  纯数字（4-6 位）   |    `^[0-9]{4,6}$`     | 匹配：`1234`、`123456`；不匹配：`123`、`1234567` |
| 纯字母（至少 2 位） |   `^[a-zA-Z]{2,}$`    |       匹配：`ab`、`ABC`；不匹配：`a`、`12`       |
| 字母数字（6-18 位） | `^[a-zA-Z0-9]{6,18}$` |              常用作账号 / 密码校验               |

**三、特殊场景校验**

|             校验需求             |           正则模板            |             示例（匹配 / 不匹配）              |
| :------------------------------: | :---------------------------: | :--------------------------------------------: |
|        包含至少 1 个数字         |            `[0-9]`            |      匹配：`abc1`、`123`；不匹配：`abc`、      |
|        包含至少 1 个字母         |          `[a-zA-Z]`           |   匹配：`123a`、`ABC`；不匹配：`123`、`!!!`    |
| 不包含特殊字符（仅字母数字中文） | `^[a-zA-Z0-9\u4e00-\u9fa5]+$` | 匹配：`张三123`、`abc中文`；不匹配：`张三!123` |
|        首尾为字母 / 数字         | `^[a-zA-Z0-9].*[a-zA-Z0-9]$`  | 匹配：`a123b`、`1234`；不匹配：`!123`、`123!`  |

**查询字段匹配**

```sql
-- 1. 校验手机号（11位纯数字，以1开头）
SELECT '13800138000' REGEXP '^1[0-9]{10}$' AS is_mobile; -- 返回1
SELECT '1234567890' REGEXP '^1[0-9]{10}$' AS is_mobile; -- 返回0

-- 2. 校验6-18位字母数字组合的密码
SELECT 'Abc123456' REGEXP '^[a-zA-Z0-9]{6,18}$' AS is_valid_pwd; -- 返回1
SELECT '12345' REGEXP '^[a-zA-Z0-9]{6,18}$' AS is_valid_pwd; -- 返回0

-- 3. 校验是否包含特殊字符（非字母数字）
SELECT 'abc123!' REGEXP '[^a-zA-Z0-9]' AS has_special_char; -- 返回1
SELECT 'abc123' REGEXP '[^a-zA-Z0-9]' AS has_special_char; -- 返回0
```

**`where` 条件筛选 （无法区分大小写）** 

```sql
SELECT *
FROM Users
-- 修正点：{0,+} → {0,}，并添加 $ 结尾锁定域名 不区分大小写：winston@leetcode.COM
WHERE mail REGEXP '^[a-zA-Z][a-zA-Z0-9_.-]{0,}@leetcode.com$';
```

### 二、REGEXP_LIKE 使用

`REGEXP_LIKE` 是 MySQL 8.0+ 支持的**正则匹配函数**，作用和 `REGEXP`/`RLIKE` 关键字等价，但语法更规范（符合 SQL 标准），且支持**匹配模式参数**（解决大小写、字符集冲突的关键）。

```
REGEXP_LIKE(待匹配字符串, 正则表达式, 匹配模式)
```

| 匹配模式 | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| `'c'`    | Case-sensitive：区分大小写（替代之前的 `BINARY`，无字符集冲突） |
| `'i'`    | Case-insensitive：不区分大小写（默认）                       |
| `'m'`    | 多行模式，`^`/`$` 匹配每行的开头 / 结尾（默认单行）          |
| `'n'`    | 允许 `.` 匹配换行符                                          |
| `'u'`    | 启用 Unicode 匹配                                            |

之前用 `REGEXP` 无法区分大小写，改用 `REGEXP_LIKE` + `'c'` 模式即可完美解决，且能精准筛选合法邮箱：

```sql
select *
from Users
where regexp_like(mail,'^[a-zA-Z][a-zA-Z0-9._-]{0,}@leetcode\\.com$','c')
```

注意点：

- `[a-zA-Z0-9._-]` 内部不需要转义特殊符号，不过 `-` 需要注意不能放在符号中间，不然就是范围匹配了。
- `@leetcode\\.com` 需要 `\\` 转义特殊字符 `'.'`
- 匹配模式 `'c'` 区分大小写字母

**筛选出 `DIAB1` 开头的比如**： `DIAB100 MYOP` `ACNE DIAB100`

```sql
select *
from Patients
where regexp_like(conditions,'^(DIAB1|.* DIAB1).*$','c')
```



## 14. 常用函数语法用例

#### 一、数值处理函数

**1. 保留指定小数位数（round）**

- **语法模板**：`round(数值, 保留小数位数)`

- ```sql
  select round(3.14159, 2);  -- 输出 3.14
  ```

**2. 强制保留指定小数位数（format，转字符串）**

- **语法模板**：`format(数值, 保留小数位数)`

- ```sql
  select format(1234.567, 2);  -- 输出 '1,234.57'（带千分位）
  ```

**3. 向上 / 向下取整**

- **语法模板**：`ceil(数值)`（向上）、`floor(数值)`（向下）

- ```sql
  select ceil(3.2);   -- 输出 4
  select floor(3.9);  -- 输出 3
  ```

#### 二、字符串处理函数

**1. 字符串切割（substring/substr）**

- **语法模板**：`substring(字符串, 起始位置, 长度)`（起始位置从 1 开始，左闭右开）

- ```sql
  select substring('mysql函数', 1, 5);  -- 输出 'mysql'
  ```

**2. 按分隔符切割（substring_index）**

- **语法模板**：`substring_index(字符串, 分隔符, 截取次数)`（正从左数，负从右数）

- ```sql
  select substring_index('a,b,c,d', ',', 2);  -- 输出 'a,b'
  select substring_index('a,b,c,d', ',', -2); -- 输出 'c,d'
  ```

**3. 大小写转换**

- **语法模板**：`upper(字符串)`（转大写）、`lower(字符串)`（转小写）

- ```sql
  select upper('mysql');  -- 输出 'MYSQL'
  select lower('MYSQL');  -- 输出 'mysql'
  ```

**4. 字符串长度**

- **语法模板**：`length(字符串)`（字节长度）、`char_length(字符串)`（字符长度）

- ```sql
  select length('mysql');         -- 输出 5（字节）
  select char_length('mysql函数'); -- 输出 7（字符）
  ```

**5. 字符串拼接**

- **语法模板**：`concat(字符串1, 字符串2, ...)`

- ```sql
  select concat('hello', ' ', 'mysql');  -- 输出 'hello mysql'
  ```

#### 三、日期处理函数

**1. 获取当前时间**

- **语法模板**：`now()`（日期 + 时间）、`curdate()`（仅日期）、`curtime()`（仅时间）

- ```sql
  select now();      -- 输出 2026-02-09 10:00:00（示例）
  select curdate();  -- 输出 2026-02-09
  select curtime();  -- 输出 10:00:00（示例）
  ```

**2. 日期格式化**

- **语法模板**：`date_format(日期, 格式符)`

- ```sql
  select date_format(now(), '%Y-%m-%d %H:%i:%s');  -- 输出 2026-02-09 10:00:00
  ```

#### 四、其他常用函数

**1. 空值处理（ifnull）**

- **语法模板**：`ifnull(字段/值, 替代值)`（为空返回替代值，否则返回原值）

- ```sql
  select ifnull(null, '空值');  -- 输出 '空值'
  ```

**2. 去重计数**

- **语法模板**：`count(distinct 字段)`

- ```sql
  select count(distinct user_id) from user;  -- 统计不重复的用户数
  ```

  
