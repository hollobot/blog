

# MySQL 基础

## **1. 数据库、表** 

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

## 8. 数据库查询 

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

