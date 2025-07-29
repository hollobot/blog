# Mybatis 分页

### 逻辑分页（内存操作）

逻辑分页是查询全部数据，然后在内存中进行分页处理。

**优点：**

- 实现简单
- 数据库无关

**缺点：**

- 性能差，内存占用大
- 不适合大数据量
- 网络传输量大

**实现原理**

```java
// 逻辑分页是指从数据库查询出所有数据，然后在应用程序内存中对结果集进行分页处理。
// 通过select * from table_name 查询所有数据，用list装入

    /**
     * 手动逻辑分页 直接通过后台代码操作查询的所有数据，相当于内存操作
     */
public PageResult<User> getUsersByLogicalPage(int pageNum, int pageSize) {
    // 1. 查询所有数据
    List<User> allUsers = userMapper.selectAllUsers();

    // 2. 计算分页参数
    int total = allUsers.size();
    int startIndex = (pageNum - 1) * pageSize;
    int endIndex = Math.min(startIndex + pageSize, total);

    // 3. 截取当前页数据
    List<User> pageData = new ArrayList<>();
    if (startIndex < total) {
        pageData = allUsers.subList(startIndex, endIndex);
    }

    // 4. 封装分页结果
    PageResult<User> result = new PageResult<>();
    result.setData(pageData);
    result.setTotal(total);
    result.setPageNum(pageNum);
    result.setPageSize(pageSize);
    result.setPages((total + pageSize - 1) / pageSize);
    result.setHasNext(pageNum < result.getPages());
    result.setHasPrev(pageNum > 1);

    return result;
}
```



### 物理分页（io/硬盘操作）

物理分页直接在数据库层面进行分页，只查询需要的数据。

**优点：**

- 性能好，内存占用少
- 适合大数据量场景
- 减少网络传输

**缺点：**

- 需要编写不同数据库的分页SQL
- 实现相对复杂

**实现原理**

```sql
SELECT * FROM user 
ORDER BY id 
LIMIT #{offset}, #{pageSize}
```

#### **PageHelper分页插件**

**1. 依赖pom.xml**

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.7</version> <!-- 或其他适用于你 Spring Boot 的版本 -->
</dependency>
```

**2. 配置分页插件**

**在 `application.yml` 中添加配置：**

```yml
pagehelper:
  helper-dialect: mysql         # 数据库方言（mysql, oracle, postgresql 等）
  reasonable: true              # 分页合理化（超出末页时返回末页）
  support-methods-arguments: true # 支持接口参数
  params: count=countSql        # 统计查询配置
  page-size-zero: true          # 允许 pageSize=0 返回全部结果
```

**3. 使用分页插件**

**在 Service 层使用分页：**

```java
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;

    public PageInfo<User> findUsers(int pageNum, int pageSize) {
        // 关键：在查询前设置分页参数
        PageHelper.startPage(pageNum, pageSize);
        
        // 紧跟着的第一个查询会被分页
        List<User> users = userMapper.selectAllUsers();
        
        // 用 PageInfo 包装结果（包含分页信息）
        return new PageInfo<>(users);
    }
}
```

**4. Controller 示例**

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public PageInfo<User> getUsers(
            @RequestParam(defaultValue = "1") int page, 
            @RequestParam(defaultValue = "10") int size) {
        return userService.findUsers(page, size);
    }
}
```

**5. 分页结果示例**

```java
// PageInfo 详解
public class PageInfo<T> {
    private int pageNum;        // 当前页
    private int pageSize;       // 每页的数量
    private int size;           // 当前页的数量
    private String orderBy;     // 排序
    private int startRow;       // 当前页面第一个元素在数据库中的行号
    private int endRow;         // 当前页面最后一个元素在数据库中的行号
    private long total;         // 总记录数
    private int pages;          // 总页数
    private List<T> list;       // 结果集
    private int prePage;        // 前一页
    private int nextPage;       // 下一页
    private boolean isFirstPage;// 是否为第一页
    private boolean isLastPage; // 是否为最后一页
    private boolean hasPreviousPage; // 是否有前一页
    private boolean hasNextPage;     // 是否有下一页
    private int navigatePages;       // 导航页码数
    private int[] navigatepageNums;  // 所有导航页号
    private int navigateFirstPage;   // 导航条上的第一页
    private int navigateLastPage;    // 导航条上的最后一页
}
```

**6.注意** 

```sql
# 不能加;结束符
select *
from user_info
where user_id like CONCAT('%', #{userId}, '%')
  and nick_name like CONCAT('%', #{nickName}, '%')
```

### 分页性能优化

**1、索引优化**

```sql
-- 为排序字段添加索引
CREATE INDEX idx_user_create_time ON user(create_time);

-- 复合索引优化
CREATE INDEX idx_user_status_time ON user(status, create_time);
```

**2、 避免深分页问题**

```sql
-- 问题：  当offset很大时，性能急剧下降
SELECT * FROM user ORDER BY id LIMIT 1000000, 10;
```

```sql
-- 使用游标分页
-- 记录上次查询的最后一个ID
SELECT * FROM user WHERE id > #{lastId} ORDER BY id LIMIT 10;
```

```sql
-- 延迟关联
-- 先查询ID，再关联查询详细信息
SELECT u.* FROM user u 
INNER JOIN (
    SELECT id FROM user ORDER BY id LIMIT 1000000, 10
) t ON u.id = t.id;
```

**3、count 查询优化**

```sql
-- 问题：
-- 直接使用 PageHelper 插件代理查询，由于直接在原始复杂的业务sql最外层套上 count(*),
-- 由于业务本身的sql复杂这样相当于这样复杂的sql查询了两次。前者的count(*)比后者还要耗时大些。
select count(*) from (`原始业务sql`)

-- count(*)在大表上很慢
SELECT COUNT(*) FROM user;
```

```java
// 不直接使用 PageHelper 查询的计数，根据自己的业务逻辑自己自定义一个count sql
PageHelper.startPage(pageNum, pageSize,false); // false 关闭计数 ，默认是true

// 自定义计算count
Integer count = userGroupInfoMapper.selectCountByGroupIdAndType(groupNumber, associateType, goodsType);
// 封装数据
PageInfo<OpUserGroupInfoDomain> pageInfo = new PageInfo<>(userInfoDTOList);
// 设置 total
pageInfo.setTotal(count);
```

### PageHelper 分页的 `count` 原理

核心原理：动态方法查找 + AOP 拦截

```sql
# count 计数 pageHelper会内部构造一个 查询方法名_COUNT的 mapper，然后在原始查询sql上面套上一层
select count(*) from (`原始sql`) 
# 这个如果开发者自己写了一个后缀为_COUNT 的 mappe接口 那么PageHelper插件会直接用个ampper进行计算count。
```

**1、PageHelper 的拦截机制**

```java
// PageHelper 是基于 MyBatis 的 Interceptor（拦截器） 实现的：
@Intercepts({@Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class,ResultHandler.class})
})
public class PageInterceptor implements Interceptor {
// 拦截所有查询操作
}
```

**2、执行流程**

```java
// 1. PageHelper.startPage() 设置分页参数到 ThreadLocal 开启分页
PageHelper.startPage(1, 10);

// 2. 执行查询时被拦截器捕获
List<User> list = mapper.getOpUserGroupinfo(params);
```

**3、拦截器内部处理**

```java
public Object intercept(Invocation invocation) {
    // 获取原始的 MappedStatement
    MappedStatement ms = (MappedStatement) invocation.getArgs()[0];
    String originalId = ms.getId(); // 例如：com.demo.UserMapper.getOpUserGroupinfo
    
    // 1. 构造 count 方法 ID
    String countId = originalId + "_COUNT"; // com.demo.UserMapper.getOpUserGroupinfo_COUNT
    
    // 2. 查找是否存在自定义 count 方法
    Configuration configuration = ms.getConfiguration();
    MappedStatement countMs = null;
    
    try {
        countMs = configuration.getMappedStatement(countId);
        // 找到了！使用自定义 count
    } catch (Exception e) {
        // 没找到，使用默认 count 生成逻辑
        countMs = generateDefaultCount(ms);
    }
    
    // 3. 执行 count 查询
    long total = executeCount(countMs, invocation.getArgs()[1]);
    
    // 4. 执行原始分页查询
    return executePageQuery(invocation, total);
}
```

