# MyBatis 面试题



## 1. Mybatis是什么？

MyBatis 是一款**持久层框架**，主要用于解决 Java 应用与数据库交互的问题，简化 SQL 操作和数据映射的代码开发。

核心作用是：

- 消除传统 JDBC 开发中的冗余代码（如连接创建、Statement 处理、结果集解析等）。
- 通过 XML 或注解的方式，将 SQL 语句与 Java 代码分离，方便管理和优化 SQL。
- 自动完成 Java 对象与数据库表记录之间的映射（如将查询结果封装成 Java 实体类，或将实体类数据转换为 SQL 参数）。

简单说，MyBatis 是 Java 程序操作数据库的 “中间层”，让开发者更专注于 SQL 逻辑本身，而非重复的数据库连接和数据转换工作。



## 2. 为什么使用Mybatis代替JDBC？

MyBatis 替代 JDBC 的核心优势，简化来说有四点：

1. **省去重复代码**自动搞定 JDBC 里加载驱动、连接管理、关闭资源等重复操作，不用手动写。
2. **数据自动映射**查询结果自动转成 Java 对象，保存时对象自动转成 SQL 参数，不用手动逐个字段处理。
3. **SQL 与代码分离，好维护**SQL 写在 XML 或注解里，改 SQL 不用动 Java 代码，分工更清晰。
4. **动态 SQL 方便，少出错**用`<if>` `<where>`等标签自动拼接条件（比如根据参数动态加查询条件），不用像 JDBC 那样手动拼字符串，避免格式错误。

总之，MyBatis 把繁琐工作自动化，让开发者更专注业务和 SQL，效率更高、更不容易出错。



## 3. ORM是什么？

ORM（Object-Relational Mapping，对象关系映射）是一种**编程技术**，核心是解决 “面向对象编程语言” 与 “关系型数据库” 之间的映射问题。

ORM 的作用就是**自动建立两者的映射关系**：

- 把数据库表的一行记录，自动转换成程序中的一个对象；
- 把程序中的对象，自动转换成数据库表的一行记录。

这样开发者就不用手动写 SQL 去操作数据库，而是直接通过操作对象（如`user.save()`）来完成增删改查，简化了数据操作的代码。

常见的 ORM 框架：MyBatis（半自动化，需写 SQL）、Hibernate（全自动化，无需手动写 SQL）、Python 的 SQLAlchemy 等。



## 4. Mybatis和Hibernate的区别？

MyBatis 和 Hibernate 都是 Java 领域的 ORM 框架，但设计理念和适用场景差异显著，核心区别如下：

#### **SQL 控制力度不同（最核心差异）**

- **MyBatis（半自动化 ORM）**：需开发者**手动编写 SQL**（或通过动态 SQL 标签拼接），框架仅负责 “SQL 执行 + 数据映射”。优点：能精准优化 SQL（如复杂查询、索引利用），适合对 SQL 性能有高要求的场景（如互联网高并发）。缺点：需手写 SQL，开发量略大。
- **Hibernate（全自动化 ORM）**：完全屏蔽 SQL，通过操作对象（如 `save()` `get()`）自动生成 SQL，开发者无需关注 SQL 细节。优点：开发速度快，无需写 SQL，适合快速迭代的简单业务。缺点：自动生成的 SQL 可能冗余（如多表关联时），复杂场景下优化困难。



## 5. MyBatis框架的优缺点及其适用的场合？

MyBatis 的核心特点、优劣势及适用场景可总结为：

#### 一、核心优点

1. **SQL 可控性强**：支持手动写 SQL 或动态拼接，能精准优化复杂查询，避免自动生成冗余 SQL；
2. **简化开发**：自动处理 JDBC 重复代码（连接、结果封装），实现对象与数据库字段自动映射；
3. **解耦易维护**：SQL 独立存于 XML / 注解，改 SQL 无需动 Java 代码，便于分工协作；
4. **灵活适配复杂业务**：支持动态 SQL、存储过程等，轻松应对多条件查询、批量操作；
5. **轻量易上手**：核心逻辑简单，懂 SQL + 基础映射规则即可用，学习成本低。

#### 二、主要缺点

1. **需手动写 SQL**：简单 CRUD 也需编写，开发效率低于全自动 ORM（如 Hibernate）；
2. **跨库移植差**：SQL 与数据库语法绑定（如 MySQL/Oracle 分页差异），切换数据库需改 SQL；
3. **缓存弱**：一级缓存默认开启，二级缓存配置复杂，复杂场景需依赖第三方缓存（如 Redis）。

#### 三、适用场景

适合**对 SQL 性能敏感、业务复杂**的场景，尤其互联网行业：

- 高并发业务（电商、支付）：需精细优化 SQL，避免慢查询；
- 复杂业务逻辑：多条件筛选、动态排序等，动态 SQL 能简化代码；
- 单一数据库长期使用：无需跨库移植，可充分发挥 SQL 调优优势；
- 团队有专业 DBA：可分工协作（Java 开发者写业务，DBA 优化 SQL）。



## 6. Mybatis的工作原理？

MyBatis 的工作原理可简化为 “**配置解析→会话创建→SQL 执行→结果映射**” 四个核心步骤，具体流程如下：

#### 1. 初始化：解析配置文件

- 加载核心配置文件（`mybatis-config.xml`）和映射文件（`XXXMapper.xml`），或注解定义的 SQL。
- 解析内容包括：数据库连接信息、事务管理器、类型别名、Mapper 映射关系（SQL 语句、参数与结果的映射规则）等。
- 将解析结果封装为`Configuration`对象，作为 MyBatis 的全局配置中心。

#### 2. 创建会话：获取操作入口

- 通过`SqlSessionFactory`（由`Configuration`构建）创建`SqlSession`（会话对象）。
- `SqlSession`是开发者与数据库交互的直接入口，封装了执行 SQL、管理事务的方法（如`selectOne()`、`update()`、`commit()`）。

#### 3. 执行 SQL：找到并执行目标语句

- 开发者调用`SqlSession`的方法时（如`sqlSession.selectList("UserMapper.findById", 1)`），MyBatis 根据`namespace+id`（如`UserMapper.findById`）从`Configuration`中找到对应的 SQL 语句。
- 解析 SQL 中的参数（如`#{id}`），通过`ParameterHandler`将 Java 参数转换为 SQL 参数，生成`PreparedStatement`。
- 执行 SQL 并获取结果集（`ResultSet`）。

#### 4. 结果映射：转换为 Java 对象

- 通过`ResultSetHandler`将结果集按照映射规则（如`resultType`、`resultMap`）自动转换为 Java 对象（或集合）。
- 将转换后的结果返回给开发者。

#### 5. 收尾：关闭会话

- 操作完成后，关闭`SqlSession`，释放资源（底层通过连接池管理数据库连接）。

**核心逻辑**：MyBatis 通过解析配置建立 “SQL 与 Java 方法” 的映射关系，在执行时自动完成参数转换、SQL 执行、结果封装，本质是对 JDBC 的一层封装，简化了数据库操作的全流程。



## 7. Mybatis都有哪些Executor执行器？它们之间的区别是什么？

MyBatis 有三种核心 `Executor` 执行器，分别是 **SimpleExecutor、ReuseExecutor、BatchExecutor**，它们的区别主要体现在 **SQL 语句的执行方式和连接复用策略** 上：

#### 1. SimpleExecutor（默认执行器）

- **特点**：每次执行 SQL 都会创建一个新的 `PreparedStatement`，执行完毕后关闭。
- **适用场景**：大多数普通场景，尤其是 SQL 执行频率低、语句不重复的情况。
- **示例**：两次执行相同的 `select * from user where id=?` 会生成两个不同的 `PreparedStatement`。

#### 2. ReuseExecutor（复用执行器）

- **特点**：对相同 SQL 语句（字符串完全一致）会复用已创建的 `PreparedStatement`，避免重复编译。
- **适用场景**：需要频繁执行相同 SQL（如多次查询同一表的固定条件）的场景，可减少 SQL 编译开销。
- **注意**：仅复用相同 SQL 的 `PreparedStatement`，不同参数不影响复用（如 `id=1` 和 `id=2` 可复用同一 SQL 的 `PreparedStatement`）。

#### 3. BatchExecutor（批量执行器）

- **特点**：将多个相同类型的 SQL（如批量插入、更新）缓存起来，调用 `SqlSession.commit()` 时一次性批量执行，减少与数据库的交互次数。
- **适用场景**：批量操作（如批量插入 1000 条数据），大幅提升效率（尤其避免多次网络往返）。
- 注意
  - 只支持 `INSERT`、`UPDATE`、`DELETE` 语句，不支持 `SELECT`（查询需立即返回结果，无法批量）。
  - 需手动调用 `commit()` 才会执行批量操作，未提交前数据暂存在内存。



## 8. MyBatis中接口绑定有几种实现方式?

MyBatis 接口绑定有两种方式：

1. **XML 映射文件：** 写 XML 文件，用`namespace`对应接口全类名，SQL 的`id`对应接口方法名，适合复杂 SQL。
2. **注解：** 直接在接口方法上用`@Select`等注解写 SQL，无需 XML，适合简单 SQL。



## 9. Mybatis 是如何进行分页的？

MyBatis 分页主要两种方式：

1. **原生 SQL 分页：** 手动在 SQL 里加数据库分页语法（如 MySQL 的`LIMIT`），传页码和每页条数，需自己算起始位置（`(页码-1)*每页条数`）。适合简单场景，缺点是换数据库要改 SQL。
2. **PageHelper 插件：** 引入插件后，查询前用`PageHelper.startPage(页码, 每页条数)`，自动帮你加分页条件，还能返回总条数等信息，不用手动处理，支持多数据库，更方便。

推荐用 PageHelper，简单高效。



## 10. 分页插件的基本原理是什么？

分页插件（以主流的 PageHelper 为例）的基本原理是**通过 MyBatis 的拦截器机制，在 SQL 执行前自动拦截并改写 SQL，添加分页条件，同时查询总条数**，核心流程如下：

1. **拦截查询请求：** 当调用 Mapper 接口的查询方法前，插件通过 MyBatis 的 `Interceptor` 接口，拦截 SQL 执行的核心流程（如 `StatementHandler` 的 `prepare` 方法）。
2. **解析并改写 SQL**
   - 插件获取原始 SQL（如 `SELECT * FROM user`）后，会同时生成两个 SQL：
     - 一个是 “查询总条数” 的 SQL（如 `SELECT COUNT(*) FROM (原始SQL)`），用于计算总记录数和总页数；
     - 另一个是改写后的分页 SQL（如 MySQL 加 `LIMIT ?`，Oracle 嵌套 `ROWNUM` 子查询），用于获取当前页数据。

3. **执行分页查询**
   - **先执行总条数 SQL**，得到总记录数（这一步是为了确定分页的边界，比如总页数、是否越界等）；
   - **再执行改写后的分页 SQL**，根据总条数计算出的分页参数（如起始位置、每页条数），获取当前页的数据。
4. **封装分页结果：** 将查询到的 “当前页数据” 和 “总条数、总页数、当前页码” 等信息封装到分页对象（如 `PageInfo`）中返回。

简单说：分页插件本质是**自动帮你完成 “改写 SQL 加分页条件” 和 “查询总条数” 这两步手动操作**，通过拦截器机制无缝集成到 MyBatis 流程中，简化分页代码。



## 11. Mybatis 是否支持延迟加载（懒加载）？

MyBatis 支持延迟加载（懒加载），主要用于优化关联查询（如一对一、一对多关系），核心是 “**按需加载数据**”—— 即只有在真正使用关联对象时，才会触发数据库查询，避免避免不必要的性能消耗。核心特点：

1. **默认不开启**：需在 MyBatis 核心配置文件中手动开启：

   ```yaml
   mybatis:
     configuration:
       # 开启延迟加载（默认 false）
       lazy-loading-enabled: true
       # 关闭"积极加载"（即按需加载，默认 false，可省略）
       aggressive-lazy-loading: false
   ```

2. **仅适用于关联查询**：针对 `association`（一对一）或 `collection`（一对多）标签定义的关联关系，例如：

   ```xml
   <!-- 一对多关联：查询用户时，默认不加载订单列表，直到调用 user.getOrders() 才查询 -->
   <resultMap id="UserMap" type="User">
     <id property="id" column="id"/>
     <collection property="orders" column="id" 
                 select="com.mapper.OrderMapper.selectByUserId" 
                 fetchType="lazy"/>  <!-- 指定懒加载（默认受全局配置控制） -->
   </resultMap>
   ```

3. **`fetchType` 控制粒度**：可在关联标签中用 `fetchType="lazy"`（懒加载）或 `fetchType="eager"`（立即加载）覆盖全局配置，更灵活。

#### 优势：

减少不必要的关联查询（如只查用户基本信息，不查其订单），降低数据库压力，提升查询效率。

总结：MyBatis 支持延迟加载，需手动开启，主要优化关联查询场景，实现 “用的时候再查”。



## 12. #{}和${}的区别是什么？

`#{} `和 `${}` 的核心区别：

- **`#{} `**：会把参数当 “值” 处理，自动加引号，通过预编译（`?`占位）防止 SQL 注入，安全。例：`where id=#{id}` 传入 1 → 实际是 `where id=?`（参数替换为 1）。日常用这个，安全优先。
- **`${}`**：直接拼字符串，参数当 SQL 片段，不加引号，有注入风险。例：`where id=${id}` 传入 1 → 实际是 `where id=1`。仅用于动态表名、排序字段等必须拼 SQL 的场景，需自己保证参数安全。

**记住**：优先用`#{} `，`${}` 慎用。



## 13. Mybatis的预编译是什么？

MyBatis 的预编译是一种 SQL 执行优化机制，核心是**提前编译 SQL 模板，多次执行时仅替换参数**，具体流程和作用如下：

#### 原理：

1. **SQL 模板化**：用 `#{} `标记参数位置（如 `select * from user where id = #{id}`），MyBatis 会将其转换为带 `?` 占位符的 SQL 模板（如 `select * from user where id = ?`）。
2. **提前编译**：数据库会对这个模板进行一次编译（语法解析、执行计划生成等），并缓存编译结果。
3. **参数替换**：后续执行时，只需将实际参数（如 `id=1`）替换到 `?` 位置，直接复用之前的编译结果，无需重新编译。

#### 优势：

1. **性能提升**：避免重复编译 SQL，尤其适合频繁执行的相同 SQL（如多次查询不同 ID 的用户）。
2. **防 SQL 注入**：参数作为 “值” 被传入，而非 SQL 片段，数据库会自动处理特殊字符（如单引号），从根本上避免注入风险（这也是 `#{} `比 `${}` 安全的原因）。

简单说：预编译就是 “SQL 模板只编译一次，参数多次复用”，既快又安全，是 `#{} `方式的核心特性。



## 14. 一级缓存和二级缓存？

MyBatis 的缓存分为**一级缓存**和**二级缓存**，核心作用是减少数据库查询次数，提升性能，两者的范围和机制不同：

#### **1. 一级缓存（SqlSession 级别，默认开启）**

- **范围**：仅限当前 `SqlSession`（会话）内有效，不同 `SqlSession` 之间不共享。

- **原理：**当通过 `SqlSession` 执行查询时，结果会被缓存到 `SqlSession` 内部的缓存区（`HashMap`）。若**同一会话内**再次执行**相同的 SQL（相同的 `namespace+id+参数`）**，会直接从缓存中取结果，不查数据库。

- **失效场景**：

  - 执行 `update`/`insert`/`delete` 操作（会自动清空一级缓存，保证数据一致性）。

  - 手动调用 `sqlSession.clearCache()` 清空缓存。

  - 关闭 `SqlSession` 后，缓存失效。

#### **2. 二级缓存（Mapper 级别，默认关闭）**

- **范围**：针对整个 `Mapper`（即同一个 `namespace`），所有 `SqlSession` 共享该缓存。

- **开启方式**：

  1. 全局配置中开启（默认 `true`，可省略）：

     ```yaml
     mybatis:
       configuration:
         # 全局开关：开启二级缓存（默认 true，可省略，但显式配置更清晰）
         cache-enabled: true
         # 一级缓存无需额外配置（默认开启，SqlSession 级别）
     
     # 注意：二级缓存还需在对应的 Mapper XML 中添加 <cache/> 标签（或使用 @CacheNamespace 注解）才会生效，例如：
     # 在 UserMapper.xml 中添加 <cache/> 表示该 Mapper 启用二级缓存
     ```

  2. 在 Mapper XML 中添加 `<cache/>` 标签（或注解），声明当前 Mapper 启用二级缓存：

     ```xml
     <mapper namespace="com.mapper.UserMapper">
       <cache/> <!-- 开启二级缓存 -->
     </mapper>
     ```

- **原理：** 当 `SqlSession` 执行查询并提交 / 关闭后，结果会从一级缓存同步到二级缓存。其他 `SqlSession` 执行相同 SQL 时，会先查二级缓存，再查一级缓存，最后查数据库。

- **注意**：

  - 缓存的对象需实现 `Serializable` 接口（二级缓存可能涉及序列化存储）。

  - 执行 `update`/`insert`/`delete` 时，会清空当前 Mapper 的二级缓存，以及对应的一级缓存。