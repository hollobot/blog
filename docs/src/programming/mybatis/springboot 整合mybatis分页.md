# springboot 整合mybatis分页

**借助MyBatis提供的第三方PageHelper分页插件2**

**1. 依赖pom.xml**

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.7</version> <!-- 或其他适用于你 Spring Boot 的版本 -->
</dependency>
```

#### 2. 配置分页插件

**在 `application.yml` 中添加配置：**

```yml
pagehelper:
  helper-dialect: mysql         # 数据库方言（mysql, oracle, postgresql 等）
  reasonable: true              # 分页合理化（超出末页时返回末页）
  support-methods-arguments: true # 支持接口参数
  params: count=countSql        # 统计查询配置
  page-size-zero: true          # 允许 pageSize=0 返回全部结果
```

#### 3. 使用分页插件

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

#### 4. Controller 示例

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

#### 5. 分页结果示例

```json
{
  "total": 100,       // 总记录数
  "pageNum": 1,       // 当前页码
  "pageSize": 10,     // 每页数量
  "pages": 10,        // 总页数
  "list": [ ... ],    // 当前页数据
  // 其他分页信息...
}
```

#### 6.注意 

```sql
# 不能加;结束符
select *
from user_info
where user_id like CONCAT('%', #{userId}, '%')
  and nick_name like CONCAT('%', #{nickName}, '%')
```



