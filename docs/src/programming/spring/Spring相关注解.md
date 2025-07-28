### 一、组件相关注解

#### **@Component**

@Component 是一个基础且通用的组件注解，用于标识一个普通的 Spring Bean 组件。当 Spring 容器在扫描组件时，会将被 @Component 标注的类实例化为一个 Bean，并纳入 Spring 的管理范围。

```java
@Component
public class CommonComponent {
    public void commonMethod() {
        System.out.println("这是一个通用组件的方法");
    }
}
```

#### **@`Service`**

`@Service` 注解通常用于标注业务逻辑层的组件，其本质上也是 `@Component` 的一种特殊形式，用于更明确地强调该类是一个提供业务服务的类。

```java
@Service
public class UserService {
    public User getUserById(Long id) {
        // 从数据库或其他数据源获取用户信息
        return new User();
    }
}
```

#### **@`Repository`**

`@Repository` 注解主要用于标注数据访问层（DAO）的组件，例如与数据库进行交互的类。它的使用有助于区分数据访问相关的逻辑

```java
@Repository
public class UserRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public User findUserById(Long id) {
        String sql = "SELECT * FROM users WHERE id =?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) -> {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setName(rs.getString("name"));
            return user;
        });
    }
}

```

#### **@`Controller`**

`@Controller` 注解用于标注控制层的组件，主要处理用户的请求并返回相应的响应。

```java
@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping("/user")
    public ModelAndView getUser() {
        User user = userService.getUserById(1L);
        ModelAndView modelAndView = new ModelAndView("user");
        modelAndView.addObject("user", user);
        return modelAndView;
    }
}

```

### 二、依赖注入相关注解

#### `@Autowired`

`@Autowired` 注解用于按照类型自动装配依赖的对象。Spring 容器会根据类型在容器中查找匹配的 Bean 并进行注入。

```java
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public void createOrder(Order order) {
        orderRepository.save(order);
    }
}

```

#### **@`Resource`**

`@Resource` 注解也用于依赖注入，它既可以通过名称也可以通过类型来查找要注入的 Bean。

```java
@Service
public class UserService {
    @Resource(name = "userRepository")
    private UserRepository userRepository;

    public void updateUser(User user) {
        userRepository.update(user);
    }
}

```

### 三、配置相关注解

#### `@Configuration`

`@Configuration` 注解用于标识一个类是配置类，Spring 会将该类中的配置信息进行处理和应用。

```java
@Configuration
public class AppConfig {
    @Bean
    public DataSource dataSource() {
        // 配置数据源
        return new DriverManagerDataSource();
    }
}
```

#### `@Bean`

`@Bean` 注解在配置类中用于定义一个 Bean，通过方法的返回值来创建和配置 Bean。

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService() {
        return new UserServiceImpl();
    }
}

```

#### `@Bean`

`@Configuration` 注解用于标识一个类是配置类，Spring 会将该类中的配置信息进行处理和应用。

```java
@Configuration
public class AppConfig {
    @Bean
    public DataSource dataSource() {
        // 配置数据源
        return new DriverManagerDataSource();
    }
}
```

### 四、切面编程（AOP）相关注解

#### `@Aspect`

`@Aspect` 注解用于标识一个类是切面类，该类中可以定义各种切面逻辑。

```java
@Aspect
public class LoggingAspect {
    // 切面逻辑
}
```

#### `@Before`

`@Before` 注解用于定义在目标方法执行前执行的切面逻辑。

```java
@Before("execution(* com.example.service.*.*(..))")
public void beforeMethod(JoinPoint joinPoint) {
    System.out.println("在方法执行前：" + joinPoint.getSignature().getName());
}
```

#### `@After`

`@After` 注解用于定义在目标方法执行后执行的切面逻辑。

```java
@After("execution(* com.example.service.*.*(..))")
public void afterMethod(JoinPoint joinPoint) {
    System.out.println("在方法执行后：" + joinPoint.getSignature().getName());
}
```

#### `@Around`

`@Around` 注解用于定义环绕目标方法执行的切面逻辑，可以灵活地控制目标方法的执行过程。

```java
@Around("execution(* com.example.service.*.*(..))")
public Object aroundMethod(ProceedingJoinPoint joinPoint) throws Throwable {
    System.out.println("环绕前");
    Object result = joinPoint.proceed();
    System.out.println("环绕后");
    return result;
}
```

### 五、事务管理相关注解

#### `@Transactional`

`@Transactional` 注解用于标识一个方法是事务性的，确保方法内的数据库操作要么全部成功提交，要么全部回滚。

```java
@Service
public class UserServiceImpl implements UserService {

    @Transactional
    public void updateUser(User user) {
        // 更新用户信息
        // 如果在此过程中出现异常，事务将自动回滚
    }
}
```

### 六、其他注解

#### validation

1. `@NotNull：对象不能为 null。`
2. `@NotBlank：字符串不能为空（忽略空格）只能用于字符串类型(String)，不能用于 Integer 或其他数值类型。。`
3. `@NotEmpty：集合、数组、字符串等不能为空。不支持 Integer`
4. `@Size：字符串、集合、数组等的长度或大小必须在指定范围内。`
5. `@Min：数值的最小值。`
6. `@Max：数值的最大值。`
7. `@Email：字符串必须是有效的电子邮件格式。`
8. `@Pattern：字符串必须匹配指定的正则表达式。`

```java
import javax.validation.constraints.*;

public class User {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Min(value = 18, message = "Age must be at least 18")
    private int age;

    @Email(message = "Email should be valid")
    private String email;
    
    @NotNull(message = "Join Type cannot be null")  // 确保 joinType 不能为空
    @Min(value = 1, message = "Join Type must be at least 1")  // 最小值为 1
    @Max(value = 3, message = "Join Type must be less than or equal to 3")  // 最大值为 3
    private Integer joinType;  // 加入类型

    @NotNull(message = "Sex cannot be null")  // 确保 sex 不能为空
    @Min(value = 1, message = "Sex must be either 1 (male) or 2 (female)")  // 最小值为 1
    @Max(value = 2, message = "Sex must be either 1 (male) or 2 (female)")  // 最大值为 2
    private Integer sex;  // 性别
    
    @Size(min = 11, max = 11, message = "手机号必须是11位")
    private String phone;

    // Getters and Setters
}
```

