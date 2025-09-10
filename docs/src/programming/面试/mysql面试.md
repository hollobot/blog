# MySQL 面经

## JOIN类型详解

### 1. INNER JOIN（内连接）

**定义**：只返回两个表中都有匹配记录的行 **特点**：交集，最严格的连接方式

```sql
-- 查询有班级的学生信息
SELECT s.StudentName, c.ClassName 
FROM students s
INNER JOIN classes c ON s.ClassID = c.ClassID;
```

**结果**：

- 小明 - 计算机科学
- 小红 - 物理学
- 小刚 - 化学
- 小张 - 物理学

**说明**：小李因为ClassID为NULL，没有匹配的班级，所以不会出现在结果中

### 2. LEFT JOIN（左连接）

**定义**：返回左表的所有记录，右表没有匹配的用NULL填充 **特点**：以左表为主，保留左表所有数据

```sql
-- 查询所有学生信息，包括没有班级的学生
SELECT s.StudentName, c.ClassName 
FROM students s
LEFT JOIN classes c ON s.ClassID = c.ClassID;
```

**结果**：

- 小明 - 计算机科学
- 小红 - 物理学
- 小刚 - 化学
- 小李 - NULL（没有班级）
- 小张 - 物理学

**说明**：所有学生都显示，小李的班级显示为NULL

### 3. RIGHT JOIN（右连接）

**定义**：返回右表的所有记录，左表没有匹配的用NULL填充 **特点**：以右表为主，保留右表所有数据

```sql
-- 查询所有班级信息，包括没有学生的班级
SELECT s.StudentName, c.ClassName 
FROM students s
RIGHT JOIN classes c ON s.ClassID = c.ClassID;
```

**结果**：

- 小明 - 计算机科学
- 小红 - 物理学
- 小刚 - 化学
- 小张 - 物理学

**说明**：显示所有班级，如果某个班级没有学生，StudentName会显示为NULL

### 4. FULL OUTER JOIN（全外连接）

**定义**：返回两个表的所有记录，没有匹配的用NULL填充 **特点**：并集，最宽松的连接方式 **注意**：MySQL不直接支持FULL OUTER JOIN，需要用UNION实现

```sql
-- MySQL中用UNION模拟全外连接  
SELECT s.StudentName, c.ClassName 
FROM students s LEFT JOIN classes c ON s.ClassID = c.ClassID
UNION
SELECT s.StudentName, c.ClassName 
FROM students s RIGHT JOIN classes c ON s.ClassID = c.ClassID;
```

### 🔑 核心区别总结

| JOIN类型            | 返回数据            | 使用场景           |
| ------------------- | ------------------- | ------------------ |
| **INNER JOIN**      | 只要匹配的记录      | 需要完整关联数据时 |
| **LEFT JOIN**       | 左表全部 + 右表匹配 | 主表数据必须保留时 |
| **RIGHT JOIN**      | 右表全部 + 左表匹配 | 从表数据必须保留时 |
| **FULL OUTER JOIN** | 两表全部数据        | 需要所有数据时     |

#### 💡 实际应用建议

1. **最常用**：LEFT JOIN（约80%的场景）
2. **性能考虑**：INNER JOIN通常最快
3. **可读性**：尽量避免RIGHT JOIN，用LEFT JOIN替代
4. **数据完整性**：需要保留某表全部数据时用LEFT/RIGHT JOIN

#### 🎯 记忆技巧

- **LEFT JOIN**：以**左**表为准，**左**表数据全保留
- **RIGHT JOIN**：以**右**表为准，**右**表数据全保留
- **INNER JOIN**：两表都要有，**内部**交集
- **FULL OUTER JOIN**：什么都要，**外部**并集

希望这个解释能帮您理解不同JOIN的区别！



##  UNION详解

**UNION** 是用来合并两个或多个SELECT语句结果集的操作符。

### 🔑 UNION的两种类型

**1. UNION（去重）**

```sql
-- 合并结果并去除重复行
SELECT column1, column2 FROM table1
UNION
SELECT column1, column2 FROM table2;
```

**2. UNION ALL（保留重复）**

```sql
-- 合并结果并保留所有重复行
SELECT column1, column2 FROM table1
UNION ALL
SELECT column1, column2 FROM table2;
```