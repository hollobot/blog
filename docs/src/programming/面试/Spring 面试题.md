# Spring 面试题



## 1. Spring的优点

Spring 核心优点可简化为 5 点，核心是降低开发复杂度、提升系统可维护性：

1. **依赖注入（DI）**：自动管理对象依赖，不用手动创建，减少代码耦合；
2. **面向切面（AOP）**：将日志、事务等通用功能抽离出来，不侵入业务代码，实现通用逻辑与业务代码解耦，既减少重复编码，又降低后续维护成本；
3. **容器管理**：通过 IoC 容器统一管理对象生命周期，简化对象创建、销毁流程；
4. **生态丰富**：无缝集成 MyBatis、Redis 等工具，还提供 Spring Boot、Cloud 等扩展，满足不同场景需求；
5. **事务支持**：声明式事务，不用手动写事务控制代码，降低操作数据库的出错风险。



## 2. Spring 用到了哪些设计模式？

Spring 框架广泛使用了多种设计模式，核心常用的有以下几类：

1. **工厂模式**
   - 核心：`BeanFactory` 和 `ApplicationContext` 作为工厂，负责创建和管理 Bean 对象，隐藏对象创建细节。
2. **单例模式**
   - Spring 中 Bean 默认是单例（`scope="singleton"`），通过容器保证一个类只有一个实例，减少资源消耗。
3. **代理模式**
   - AOP 核心实现：对目标方法增强时，通过 JDK 动态代理（接口）或 CGLIB 代理（类）生成代理对象，织入通知（如日志、事务）。
4. **模板方法模式**
   - 如 `JdbcTemplate`、`RestTemplate`，定义固定流程（如数据库连接 - 执行 - 关闭），将可变步骤留给子类实现，减少重复代码。
5. **观察者模式**
   - 事件驱动模型：`ApplicationEvent`（事件）、`ApplicationListener`（监听器），实现组件间解耦通信（如容器启动事件）。
6. **适配器模式**
   - 如 `HandlerAdapter` 适配不同的 `Controller`（如 `@Controller`、`HttpRequestHandler`），统一请求处理接口。
7. **装饰器模式**
   - 对 Bean 进行包装增强，如 `BeanWrapper` 对对象属性访问的扩展。



## 3. 什么是AOP？

AOP 即面向切面编程，核心是将日志、事务等通用功能抽离出来成为独立切面，然后通过 Spring 自动织入目标方法（目标方法前后进行织入），实现通用逻辑与业务代码解耦，既减少重复编码，又降低后续维护成本。



## 4. AOP有哪些实现方式？

AOP有两种实现方式：静态代理和动态代理。

#### 1. Spring 原生实现（基于动态代理，常用）

- 原理：运行时通过动态代理织入切面逻辑。
  - 若目标类有实现接口：用 **JDK 动态代理**，生成接口代理类，代理类中嵌入切面代码（如日志、事务）。
  - 若目标类无实现接口：用 **CGLIB 代理**，生成目标类的子类，重写方法并嵌入切面逻辑。
- **步骤**：定义切面（@Aspect）、切入点（@Pointcut）和通知（@Before 等），Spring 容器自动创建代理对象，调用时先执行切面逻辑再执行目标方法。
- **特点**：无需额外工具，集成 Spring 开箱即用，适合大多数场景，有轻微代理开销。

#### 2. AspectJ 实现（基于字节码编织，性能更优）（静态代理）

- **原理**：直接修改目标类的字节码，在编译期或类加载期将切面逻辑嵌入目标类。
- **步骤**：用 AspectJ 语法定义切面，通过专用编译器（编译期）或类加载器（加载期）处理，生成包含切面逻辑的目标类字节码。
- **特点**：无代理开销，性能更好，支持更复杂的切入点，但需额外配置工具（如编译器插件）。

总结：日常开发用 Spring 代理实现（简单），追求性能用 AspectJ 字节码编织（高效）。



## 5. Spring AOP的实现原理

Spring AOP 的实现核心基于 **动态代理** 和 **IoC 容器**，通过运行时生成代理对象，将切面逻辑（如日志、事务）织入目标方法，实现通用功能与业务代码的解耦。具体原理可拆解为 3 步：

#### 1. 解析切面信息（启动时）

Spring 启动时，通过 `@EnableAspectJAutoProxy` 开启 AOP 功能，会扫描并解析所有 `@Aspect` 注解的切面类：

- 识别 **切入点（@Pointcut）**：确定哪些目标方法需要被增强（如 `execution(* com.service.*.*(..))` 匹配特定包下的方法）。
- 识别 **通知（@Before/@After 等）**：确定增强逻辑（如日志打印）及执行时机（方法前 / 后）。

#### 2. 生成代理对象（创建 Bean 时）

当 IoC 容器创建目标 Bean（被增强的业务类）时，不会直接返回原对象，而是生成 **代理对象**：

- 若目标类 **实现了接口**：使用 **JDK 动态代理**，通过 `Proxy.newProxyInstance()` 生成接口的代理类，代理类持有目标对象和切面通知。
- 若目标类 **未实现接口**：使用 **CGLIB 代理**，通过 `Enhancer` 生成目标类的子类（代理类），重写目标方法并嵌入切面逻辑。

#### 3. 执行增强逻辑（运行时）

当调用代理对象的业务方法时，代理对象会先执行切面的通知逻辑，再调用目标对象的原方法，完成增强：

#### 总结：

Spring AOP 本质是 **“运行时动态代理 + 切面逻辑织入”**，通过代理对象在目标方法执行前后嵌入通用逻辑，既不侵入业务代码，又能统一管理增强功能。



## 6. JDK动态代理和CGLIB动态代理的区别

JDK 动态代理和 CGLIB 动态代理是 Spring AOP 中生成代理对象的两种核心方式，核心区别体现在**底层依赖、代理目标、实现原理**和**性能**上：

| 维度                | JDK 动态代理                                                 | CGLIB 动态代理                                               |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **代理目标要求**    | 必须实现接口（只能代理接口中的方法）                         | 无需实现接口（可代理类及子类的方法）                         |
| **底层原理**        | 通过 `java.lang.reflect.Proxy` 类生成接口的代理实例，代理类实现目标接口，通过 InvocationHandler 调用目标方法并增强。 | 通过 ASM 字节码框架生成目标类的子类，重写目标方法并增强（继承方式）。 |
| **对 final 的支持** | 不影响（代理接口，与类是否 final 无关）                      | 无法代理 final 类或 final 方法（子类无法继承重写）。         |
| **性能特点**        | 生成代理对象速度快，运行时调用略慢（需反射）。               | 生成代理对象速度慢（需修改字节码），但运行时调用更快（直接调用子类方法）。 |
| **Spring 选择逻辑** | 目标类有接口时默认使用。                                     | 目标类无接口时使用（可通过配置强制使用）。                   |

简单总结：JDK 代理依赖接口，轻量但受限于接口；CGLIB 代理基于继承，更灵活但不支持 final，生成代理稍慢但运行更快。Spring 会根据目标类是否有接口自动选择，也可手动指定。



## 7. Spring AOP相关术语

按 “做什么、对谁做、怎么生效” 梳理，共 7 个关键概念，简单易懂：

#### 1. 切面（Aspect）

「增强逻辑 + 作用范围」的组合，比如 “对所有服务方法打印日志”，是 AOP 的核心单元。

#### 2. 通知（Advice）

切面里的 “具体增强代码”+“执行时机”，比如 “方法执行前打印参数”（前置通知）、“执行后记录结果”（后置通知）。

#### 3. 目标对象（Target Object）

被增强的业务对象（如`UserService`实例），AOP 会给它生成代理对象来承载增强逻辑。

#### 4. 连接点（Join Point）

所有可能被增强的 “候选方法”，比如`UserService`里的`getUser`、`updateUser`方法。

#### 5. 切入点（Pointcut）

从连接点里 “筛选出要增强的方法”，比如 “只增强`com.service`包下的方法”，靠表达式精准定位。

#### 6. 织入（Weaving）

把切面逻辑 “嵌入” 目标对象、生成代理的过程，Spring 默认在**运行时**动态完成（无需额外工具）。

#### 7. 引入（Introduction）

给现有类**动态加新方法 / 属性**，比如给`UserService`加`logInfo()`方法，不用改源码。

一句话串起来：用「切面」把「通知」（增强逻辑），通过「织入」作用到「目标对象」中、符合「切入点」的「连接点」上，还能通过「引入」给类加新功能。



## 8. Spring通知有哪些类型？

Spring AOP 中的通知（Advice）指切面的具体执行逻辑 + 执行时机，核心分 5 种类型，覆盖方法执行的全生命周期：

1. **前置通知（@Before）**：在目标方法执行**之前**触发，可做参数校验、日志打印等（如记录接口入参），无法阻止方法执行。
2. **后置通知（@After）**：在目标方法**无论成功或抛异常**后都触发，可做资源清理（如关闭流），不关心方法执行结果。
3. **返回通知（@AfterReturning）**：仅在目标方法**成功执行并返回结果后**触发，可获取方法返回值（如记录接口响应）。
4. **异常通知（@AfterThrowing）**：仅在目标方法**抛异常时**触发，可捕获异常信息（如记录错误日志、做异常兜底）。
5. **环绕通知（@Around）**：包裹目标方法的**整个执行过程**（前 + 中 + 后），可控制方法是否执行、修改参数 / 返回值，功能最强（需手动调用 `proceed()` 执行目标方法）。

一句话总结：前 4 种是 “单一时机通知”，环绕通知是 “全流程控制通知”，可根据需求选择对应类型。



## 9. 什么是IOC？

IOC（控制反转）是 Spring 核心，简单说就是**对象的创建、依赖管理，从业务代码交给 Spring 容器统一管**。

不用手动 new 对象、维护依赖，只需在代码里用 @Autowired 声明需要的对象，容器会自动 “送” 过来；开发者不用管对象怎么来，专心写业务逻辑，还能降低代码耦合，方便维护。



## 10. IOC的好处？

IOC 的核心好处是**降低代码耦合、简化开发、提升系统可维护性**，具体可拆为 3 点：

1. **解耦**：业务代码不用手动创建依赖对象（比如不用写 `new UserService()`），也不用维护依赖关系（比如不用管 `UserService` 依赖的 `UserDao` 怎么来），对象的创建和组装全交给容器，代码间关联更弱。
2. **简化开发**：省去重复的对象创建、初始化代码，开发者只需通过 `@Autowired` 等方式 “要” 对象，专注写核心业务逻辑，减少冗余代码。
3. **易维护易扩展**：要替换依赖的实现（比如把 `UserServiceImpl` 换成 `UserServiceMock`），只需改配置或注解，不用修改所有业务代码；新增依赖时，容器自动管理，不用手动调整依赖链。



## 11. 什么是依赖注入？

依赖注入（DI）是 Spring 实现 IOC 的核心手段，即容器自动将对象依赖的其他对象注入进来。

#### 三种实现方式及代码：

**1. 构造器注入（适合强制依赖）**

通过构造方法参数注入，**单构造方法时无需注解**。

```java
@Service
public class OrderService {
    // 依赖的对象
    private final UserService userService;

    // 构造器注入：容器自动传入 UserService 实例
    public OrderService(UserService userService) { 
        this.userService = userService;
    }

    public void createOrder() {
        userService.queryUser(); // 直接使用注入的对象
    }
}
```

**2. Setter 注入（适合可选依赖）**

通过 setter 方法注入，**必须加 @Autowired**。

```java
@Service
public class OrderService {
    private LogService logService;

    // Setter 注入：@Autowired 标记注入方法
    @Autowired
    public void setLogService(LogService logService) {
        this.logService = logService;
    }

    public void createOrder() {
        logService.recordLog(); // 使用注入的对象
    }
}
```

**3. 字段注入（最简洁，直接在字段上标注）**

```java
@Service
public class OrderService {
    // 字段注入：@Autowired 直接标记依赖
    @Autowired
    private PaymentService paymentService;

    public void createOrder() {
        paymentService.pay(); // 直接使用
    }
}
```

核心：不用手动 `new` 依赖对象，容器通过以上三种方式自动 “喂” 给你，直接用即可。



## 12. IOC容器初始化过程？

Spring IOC 容器初始化可简化为 3 步核心流程：

1. **读配置**：容器启动时，加载配置信息（比如`@Configuration`注解类、XML 配置文件，或`@ComponentScan`指定的扫描路径），确定要扫描的类和规则。
2. **记定义**：容器扫描指定路径，识别带`@Component`/`@Bean`/`@Service`等注解的类，封装成 “Bean 定义（BeanDefinition）” 并注册到容器的注册表中。
3. **创对象**：容器根据注册表中的 “Bean 定义”，通过反射创建 Bean 实例；自动注入依赖，完成初始化后放入缓存（单例 Bean），供后续使用。



## 13. Bean的生命周期

核心结论：Spring Bean 的生命周期是从 IoC 容器初始化 Bean 到最终销毁的完整过程，核心围绕 “实例化 → 初始化 → 使用 → 销毁” 四阶段，全程由容器管理并允许自定义干预。

#### 完整生命周期流程（核心步骤）

1. **实例化（Instantiation）**：容器通过反射获取构造器创建 Bean 实例（内存中分配空间，仅完成对象创建，未初始化属性）。
2. **属性注入（Populate）**：容器将配置的属性值（如 @Autowired 注入的依赖、XML 配置的属性）赋值给 Bean 的成员变量。
3. **初始化（Initialization）**：Bean 实例化 + 属性注入后，执行初始化逻辑，顺序为：
   - 执行 BeanNameAware、BeanFactoryAware 等 **Aware 接口方法**（获取容器相关信息，如 Bean 名称、容器对象）。
   - 执行 BeanPostProcessor 的 **postProcessBeforeInitialization 方法**（初始化前增强，容器级通用处理）。
   - 执行自定义初始化方法（如 @PostConstruct 注解方法、XML 配置的 init-method 属性指定方法）。
   - 执行 BeanPostProcessor 的 **postProcessAfterInitialization 方法**（初始化后增强，AOP 动态代理生成在此阶段）。
4. **使用（In Use）**：Bean 进入可用状态，容器持有 Bean 实例，供程序通过 getBean () 调用或自动注入使用。
5. **销毁（Destruction）**：容器关闭时触发，顺序为：
   - 执行自定义销毁方法（如 @PreDestroy 注解方法、XML 配置的 destroy-method 属性指定方法）。
   - 释放 Bean 占用的资源（如数据库连接、线程池），Bean 实例被垃圾回收。

#### 关键核心点

- 生命周期的核心是 “容器主导”，从创建到销毁的每个阶段都由 IoC 容器触发和管理。
- 初始化和销毁阶段支持自定义干预，满足个性化资源处理需求。
- AOP 代理对象在初始化后期（postProcessAfterInitialization）生成，确保代理对象包含完整的 Bean 状态。



## 14. BeanFactory 和 FactoryBean的区别？

BeanFactory 和 FactoryBean 核心区别就两点，记清角色和功能就行：

1. **BeanFactory**：是 Spring 的 “容器顶层接口”，相当于 “大管家”，负责管理所有 Bean 的生命周期（创建、注入、销毁），日常用的 `ApplicationContext` 就是它的实现类。
2. **FactoryBean**：是 “创建 Bean 的工厂类”，相当于 “专属工匠”，是一种特殊 Bean，专门用来自定义复杂 Bean 的创建逻辑（比如 MyBatis 的 `SqlSessionFactory`），容器会通过它生成其他 Bean。

简单说：**BeanFactory 管所有 Bean，FactoryBean 造特定 Bean**。



## 15. BeanFactory和ApplicationContext有什么区别？

BeanFactory 和 ApplicationContext 的核心区别可简化为两点：

1. **功能**：
   - BeanFactory 是 “基础容器”，只提供最核心的 Bean 管理（获取、判断状态等）。
   - ApplicationContext 是 “增强容器”，继承了 BeanFactory 的所有功能，还多了国际化、事件监听、自动处理处理器等企业级特性。
2. **初始化**：
   - BeanFactory 是 “懒加载”，用的时候才创建 Bean（可能晚发现错误）。
   - ApplicationContext 是 “预加载”，启动时就创建所有非懒加载单例 Bean（提前暴露问题）。

日常开发**几乎都用 ApplicationContext**，功能全、更实用；BeanFactory 仅用于极轻量场景。



## 16. Bean注入容器有哪些方式？

Spring 中把 Bean 注入容器（即让容器管理 Bean）的方式主要有以下 5 种，日常开发中根据场景选择：

#### 1. 注解扫描（最常用）

通过 `@Component` 及其派生注解（`@Service`、`@Controller`、`@Repository`）标记类，配合 `@ComponentScan` 扫描指定包，自动将类注册为容器中的 Bean。

- 示例：

  ```java
  // 标注 @Service（属于 @Component 派生注解）
  @Service // 容器会自动创建 UserService 实例并管理
  public class UserService { ... }
  
  // 配置类中指定扫描路径
  @Configuration
  @ComponentScan("com.example.service") // 扫描该包下的注解类
  public class SpringConfig { ... }
  ```

- 适用场景：自己编写的业务类（Service、Controller 等）。

#### 2. `@Bean` 注解（第三方类或配置类）

在配置类的方法上标注 `@Bean`，方法返回值会被注册为容器中的 Bean，常用于将第三方类（如 `DataSource`、`RestTemplate`）或复杂配置的类注入容器。

- 示例：

  ```java
  @Configuration
  public class Config {
      // 方法返回 RestTemplate 实例，@Bean 使其成为容器管理的 Bean
      @Bean
      public RestTemplate restTemplate() {
          return new RestTemplate();
      }
  }
  ```

- 适用场景：第三方库的类、需要自定义初始化逻辑的类。

#### 3. 注解 + 导入（`@Import`）

通过 `@Import` 注解直接导入类，无需额外标注，容器会自动将其注册为 Bean，常用于快速导入配置类或第三方组件。

```java
// 普通类（无需任何注解）
public class PayService { ... }

// 配置类中用 @Import 导入
@Configuration
@Import(PayService.class) // 直接将 PayService 注入容器
public class Config { ... }
```

#### 4. XML 配置（传统方式，现在少用）



## 17. Bean的作用域

Spring Bean 作用域就是 “Bean 实例的创建和复用规则”，核心 5 种，记常用的即可：

1. **单例（默认）**：容器里只存一个实例，所有人用同一个，适合无状态（如 Service）。
2. **原型**：每次要的时候都新创建一个，适合有状态（如请求数据对象 `pojo`）。
3. **请求（Web）**：每个 HTTP 请求一个实例，请求结束就销毁。
4. **会话（Web）**：每个用户会话一个实例，会话过期销毁。
5. **应用（Web）**：整个 Web 应用一个实例，全局共享。

简单说：单例 “共用一个”，原型 “每次新的”，Web 场景按请求 / 会话区分。



## 18. Spring自动装配的方式有哪些？

Spring 自动装配（自动注入依赖）的核心方式，按常用程度简化：

1. **@Autowired**：最常用，默认按类型匹配，多实例时用 `@Qualifier("名称")` 选。可标在字段、setter、构造方法上。
2. **构造方法注入**：类中只有一个构造方法时，不用注解，容器自动按参数类型匹配注入（推荐，更清晰）。
3. **@Resource**：JDK 自带，默认按名称匹配，不匹配再按类型，可标在字段、setter 上。

简单说：优先用 `@Autowired` 或构造方法，`@Resource` 作为替代，都是让容器自动 “喂” 给 Bean 所需的依赖。



## 19. @Autowired和@Resource的区别？

@Autowired 和 @Resource 的核心区别：

1. **来源**：
   - @Autowired 是 Spring 自带注解；
   - @Resource 是 JDK 自带（属于 Java 规范）。
2. **匹配方式**：
   - @Autowired 默认按**类型**匹配，多实例时需配合 @Qualifier 指定名称；
   - @Resource 默认按**名称**匹配，不匹配再按类型，可直接用 name 属性指定。
3. **适用位置**：
   - @Autowired 支持字段、setter、构造方法；
   - @Resource 不支持构造方法，只支持字段、setter。

简单记：@Autowired 靠类型，@Resource 靠名称（JDK 自带）。



## 20. @Qualifier 注解有什么作用

@Qualifier 注解的核心作用是**在自动装配时 “精确指定要注入的 Bean”**，解决 “多个同类型 Bean 存在时，容器不知道选哪个” 的问题。

比如：

```java
// 存在两个同类型的 Bean
@Bean("userDaoA")
public UserDao userDaoA() { ... }

@Bean("userDaoB")
public UserDao userDaoB() { ... }

// 注入时，@Autowired 按类型匹配会冲突，用 @Qualifier 指定名称
@Service
public class UserService {
    @Autowired
    @Qualifier("userDaoA") // 明确指定注入名为 "userDaoA" 的 Bean
    private UserDao userDao;
}
```

简单说：**@Qualifier 配合 @Autowired 使用，通过 Bean 名称 “精准挑豆”**，避免同类型 Bean 的注入冲突。



## 21. @Bean和@Component有什么区别？

@Bean 和 @Component 都是 Spring 注册 Bean 的方式，核心区别在**使用场景和作用对象**：

1. **@Component**：标注在**类上**，让 Spring 自动扫描并创建该类的实例（适用于自己写的类）。例：`@Service`（@Component 的派生）标注在 UserService 类上，容器自动注册 UserService 实例。
2. **@Bean**：标注在**方法上**（通常在配置类里），手动定义返回的对象为 Bean（适用于第三方类或需要自定义创建逻辑的类）。例：在配置类中用 `@Bean` 标注 `restTemplate()` 方法，返回 RestTemplate 实例并注册为 Bean。

简单说：@Component 是 “自动注册自己写的类”，@Bean 是 “手动注册第三方类或自定义对象”。



## 22. @Component、@Controller、@Repository和@Service 的区别？

@Component、@Controller、@Repository、@Service 都是 Spring 用于标识 “Bean” 的注解，**核心功能一致（都是让类被容器扫描并管理）**，区别仅在于 **“语义化标识”**—— 通过注解明确类的 “角色和用途”，便于代码理解和框架特殊处理。

具体区别：

1. **@Component**：通用注解，标注 “任意被容器管理的类”，是其他三个注解的父类（它们本质都是 @Component 的特殊形式）。
2. **@Controller**：仅用于 **Web 层的控制器类**（如 Spring MVC 的 Controller），告诉框架 “这是处理请求的类”，框架会自动适配 Web 相关功能（如参数绑定）。
3. **@Service**：仅用于 **业务逻辑层的服务类**（如 XXXService），标识 “这是处理业务逻辑的类”。
4. **@Repository**：仅用于 **数据访问层的持久化类**（如 DAO 或 Mapper），框架会对其做特殊处理（如自动转换数据库操作异常）。

简单说：功能一样，只是 “贴标签”—— 用 @Controller 标控制器，@Service 标服务，@Repository 标数据访问，其他类用 @Component。



## 23. Spring 事务实现方式有哪些？

Spring 事务实现方式主要有两种，核心区别在于 “是否通过注解”：

#### 1. 声明式事务（推荐，最常用）

通过注解或 XML 配置声明事务规则，无需手动编写事务控制代码，由 Spring 自动管理（开启、提交、回滚）。

- 注解方式（@Transactional）：直接在类或方法上标注，指定事务属性（如隔离级别、传播行为）。

  ```java
  @Service
  public class OrderService {
      @Transactional // 该方法受事务管理，异常时自动回滚
      public void createOrder() {
          // 业务逻辑（如扣库存、创建订单）
      }
  }
  ```

- **XML 配置方式**（少用）：在 XML 中定义事务通知和切入点，指定哪些方法需要事务。

#### 2. 编程式事务（手动控制）

通过代码手动编写事务逻辑（如 `TransactionTemplate` 或 `PlatformTransactionManager`），灵活性高但代码侵入性强。

- 示例（TransactionTemplate）：

  ```java
  @Service
  public class PayService {
      @Autowired
      private TransactionTemplate transactionTemplate;
  
      public void doPay() {
          // 手动控制事务
          transactionTemplate.execute(status -> {
              try {
                  // 业务逻辑
                  return true;
              } catch (Exception e) {
                  status.setRollbackOnly(); // 异常时手动回滚
                  return false;
              }
          });
      }
  }
  ```

**总结**：日常开发优先用 **@Transactional 声明式事务**（简洁、低侵入），特殊场景（如复杂事务逻辑）才用编程式事务。



## 24. 有哪些事务传播行为？

Spring 事务传播行为定义了**当一个事务方法调用另一个事务方法时，两个事务如何协同工作**（如是否共用一个事务、是否新建事务等），核心有 7 种，常用的是前 4 种：

1. **REQUIRED（默认）**
   - 若当前有事务，就加入该事务；若没有，就新建一个事务。
   - 例：ServiceA.methodA（有事务）调用 ServiceB.methodB（REQUIRED），两者共用同一个事务，一方失败全回滚。
2. **REQUIRES_NEW**
   - 无论当前是否有事务，都新建一个独立事务，原事务暂停，新事务完成后再继续原事务。
   - 例：methodA（事务）调用 methodB（REQUIRES_NEW），methodB 失败仅自身回滚，不影响 methodA。
3. **SUPPORTS**
   - 若当前有事务，就加入；若没有，就以非事务方式执行（不开启事务）。
4. **MANDATORY**
   - 必须在已有事务中执行，若当前无事务，则直接抛异常（强制依赖外部事务）。
5. **NOT_SUPPORTED**
   - 以非事务方式执行，若当前有事务，则暂停原事务。
6. **NEVER**
   - 必须以非事务方式执行，若当前有事务，则抛异常（禁止在事务中运行）。
7. **NESTED**
   - 若当前有事务，就在嵌套事务中执行（子事务依赖父事务，父事务回滚子事务必回滚，但子事务回滚不影响父事务）；若没有，就新建事务。

**总结**：默认用 REQUIRED（共用事务），需要独立事务用 REQUIRES_NEW，其他按场景选择。传播行为通过 `@Transactional(propagation = ...)` 配置



##  25. Spring事务在什么情况下会失效？

Spring 事务失效的核心原因是 **`事务切面未正常拦截方法调用`**，导致 Spring 无法自动管理事务（开启、提交、回滚）。常见场景有以下 7 种：

1. **方法不是 public 修饰：** Spring 事务默认只对 public 方法生效，非 public（如 private、protected）方法的 `@Transactional` 会被忽略。

2. **自身调用（类内部方法调用）：** 同一类中，非事务方法 A 调用事务方法 B（如 `this.methodB()`），因未经过 Spring 代理，事务失效。例：

   ```java
   @Service
   public class OrderService {
       public void methodA() {
           this.methodB(); // 自身调用，methodB 的事务失效
       }
       @Transactional
       public void methodB() { ... }
   }
   ```

3. **异常被手动捕获且未抛出：** 事务方法中若用 `try-catch` 捕获异常却不抛出，Spring 无法感知异常，不会触发回滚。例：

   ```java
   @Transactional
   public void createOrder() {
       try {
           // 业务逻辑（出错）
       } catch (Exception e) {
           // 未抛异常，事务不回滚
       }
   }
   ```

4. **抛出的异常类型不匹配：** Spring 事务默认只对 `RuntimeException` 和 `Error` 回滚，若抛出**受检异常**（如 `IOException`、`SQLException`）且未指定 `rollbackFor`，则不回滚。例：

   ```java
   @Transactional // 默认不处理 IOException（受检异常）
   public void save() throws IOException {
       throw new IOException(); // 事务不回滚
   }
   ```

5. **数据源未配置事务管理器：** 若未配置 `DataSourceTransactionManager`（或对应数据源的事务管理器），Spring 无事务管理能力，`@Transactional` 无效。

6. **事务传播行为配置错误：** 如配置 `NOT_SUPPORTED`（不支持事务）、`NEVER`（禁止事务）等，会导致事务不生效。

7. **Bean 未被 Spring 管理：** 若类未用 `@Service` 等注解注册为 Spring Bean，`@Transactional` 自然无效。

**总结**：事务失效的本质是 “Spring 代理未介入” 或 “异常未被正确感知”，避免上述场景即可保证事务正常工作。



## 26. Spring怎么解决循环依赖的问题？

Spring 解决循环依赖（如 A 依赖 B，B 又依赖 A）的核心原理是 **“三级缓存机制”**，通过提前暴露未完全初始化的 Bean 实例，打破相互等待的死锁。

#### 核心思路

循环依赖的问题：A 创建时需要 B，而 B 创建时又需要 A，若都等对方完全创建好再注入，会陷入死锁。Spring 的解决方式：**在 Bean 还未完全初始化时，就提前暴露其 “早期引用”（未设置属性的半成品），让依赖方先拿到引用，避免等待**。

#### 三级缓存（关键机制）

Spring 维护三个缓存（Map），按顺序使用：

1. **一级缓存（singletonObjects）**：存放 **完全初始化好的单例 Bean**（最终可用的实例）。
2. **二级缓存（earlySingletonObjects）**：存放 **提前暴露的 “早期引用”**（已实例化但未设置属性和初始化的半成品）。
3. **三级缓存（singletonFactories）**：存放 **生成早期引用的工厂对象**（用于在需要时创建早期引用，支持 AOP 代理场景）。

#### 解决流程（以 A 依赖 B，B 依赖 A 为例）

1. A 开始创建：实例化 A（调用构造方法），将 A 的 “工厂对象” 放入三级缓存，此时 A 是半成品。
2. A 需要注入 B：发现 B 未创建，转去创建 B。
3. B 开始创建：实例化 B，将 B 的 “工厂对象” 放入三级缓存，此时 B 是半成品。
4. B 需要注入 A：从三级缓存获取 A 的工厂，生成 A 的 “早期引用”，放入二级缓存，然后注入 B 中。
5. B 完成初始化：设置属性、执行初始化方法，放入一级缓存。
6. A 注入 B：从一级缓存获取完全初始化的 B，注入 A 中。
7. A 完成初始化：放入一级缓存，循环依赖解决。

#### 关键点

- 仅支持 **单例 Bean** 的循环依赖（原型 Bean 每次创建新实例，无法缓存）。
- 若 Bean 有构造方法循环依赖（如 A 的构造器需要 B，B 的构造器需要 A），三级缓存无法解决，会抛异常（需避免构造器注入循环依赖）。

简单说：Spring 用三级缓存 “提前曝光” 半成品 Bean，让依赖方先拿到引用，从而打破循环等待。



## 27. Spring启动过程？

Spring 启动过程可简化为 3 步：

1. **创建容器**：初始化`ApplicationContext`核心容器，搭好基础框架。
2. **读取配置**：加载 XML / 注解配置，解析成 Bean 定义（类似 “蓝图”），存到容器的注册表。
3. **创建bean对象**：按 “蓝图” 用反射创建 Bean，自动注入依赖，执行初始化，最终放入容器缓存供使用。

Spring 启动时先解析配置（XML / 注解），把这些信息转化成`BeanDefinition`（蓝图），后续创建 Bean 时，就完全按照这个蓝图来执行，确保创建出的 Bean 符合预期。

核心：从 “空容器” 到 “装满可用 Bean”，完成依赖自动组装。



## 28. Spring 的单例 Bean 是否有并发安全问题？

Spring 的单例 Bean **可能存在并发安全问题，具体取决于 Bean 的实现方式**。

**无状态bean和有状态bean**

- 有实例变量的bean，可以保存数据，是非线程安全的。
- 没有实例变量的bean，不能保存数据，是线程安全的。

核心原因：单例 Bean 在容器中只有一个实例，多线程会共享这个实例。如果 Bean 中包含**可变状态**（比如成员变量），且多线程对这些状态进行**写操作**（修改），就可能出现线程安全问题（如数据错乱、脏读等）。

#### 举例说明：

```java
@Service
public class UserService {
    // 可变成员变量（状态）
    private int count = 0;

    // 多线程调用此方法时，可能出现并发问题
    public void increment() {
        count++; // 非原子操作，多线程同时修改会导致结果错误
    }
}
```

- 单例的 `UserService` 被多线程共享，`count` 是共享的可变状态。
- 多线程同时调用 `increment()` 时，`count++` 操作（读取→修改→写入）可能被打断，导致最终结果不正确。

#### 哪些情况不会有并发安全问题？

如果单例 Bean 是**无状态的**（没有成员变量，或成员变量是不可变的，如 `final` 修饰），则不存在并发安全问题。例如：

```java
@Service
public class UserService {
    // 无状态：仅包含方法，不维护成员变量
    public String getUserName(Long id) {
        // 仅通过参数和局部变量处理逻辑，无共享状态
        return "user_" + id;
    }
}
```

无状态的 Bean 中，多线程的操作不会影响彼此（局部变量在栈中，线程私有），因此安全。





## 29. 如何解决单例 Bean 的并发安全问题？

1. **避免可变状态**：尽量设计无状态的 Bean（推荐，符合 Spring 设计理念）。
2. **使用线程安全的数据结构**：如用 `AtomicInteger` 替代 `int`，或 `ConcurrentHashMap` 替代 `HashMap`。
3. **加锁**：通过 `synchronized` 或 `Lock` 控制共享资源的访问（可能影响性能）。
4. **ThreadLocal**：将可变状态存入 `ThreadLocal`，使每个线程拥有独立副本（适用于状态需线程隔离的场景，如事务上下文）。
5. **单例变原型**：这种方式实现起来非常简单，但是很大程度上增大了 Bean 创建实例化销毁的服务器资源开销。

总结：单例 Bean 的并发安全问题**不是单例模式本身导致的，而是由 Bean 内部的可变状态和多线程写操作共同引起的**。无状态单例是安全的，有状态单例需额外处理线程安全。



## 30. @Async注解的原理

`@Async` 是 Spring 提供的用于实现**异步方法调用**的注解，标记在方法上后，该方法会在独立的线程中执行，不会阻塞当前线程。其核心原理是**通过 AOP 动态代理拦截目标方法，将方法执行提交到线程池异步处理**。

#### 具体实现步骤：

1. **注解扫描与代理创建**Spring 启动时，会扫描带有 `@Async` 注解的方法。对于包含该注解的 Bean，Spring 会通过 AOP 为其创建**动态代理对象**（默认是 JDK 动态代理或 CGLIB 代理，取决于 Bean 是否实现接口）。
2. **拦截方法调用**当调用被 `@Async` 标记的方法时，实际执行的是代理对象的方法。代理会拦截这次调用，不直接执行目标方法，而是将方法的执行逻辑封装成一个 `Runnable` 或 `Callable` 任务。
3. **提交任务到线程池**代理将封装好的任务提交到**指定的线程池**（默认线程池由 Spring 管理，也可通过 `@Async("自定义线程池名称")` 指定）。线程池中的工作线程会异步执行该任务，此时原调用线程不会等待，直接返回。
4. **异步执行与结果处理**任务在独立线程中执行目标方法。如果方法有返回值，会封装成 `Future` 类型（如 `CompletableFuture`），调用方可通过 `Future` 获取异步执行的结果。

#### 关键依赖：

- **AOP 机制**：通过代理实现方法拦截，是 `@Async` 实现的基础。
- **线程池**：负责管理异步执行的线程，避免频繁创建销毁线程带来的性能开销。Spring 默认线程池为 `SimpleAsyncTaskExecutor`（但不推荐生产使用，通常建议自定义线程池）。

#### 注意点：

- `@Async` 注解的方法**不能是 private 或 final**，否则 AOP 无法创建代理，注解会失效。
- 异步方法的调用**不能在同一个类内部直接调用**（类内调用不会经过代理），需通过 Bean 注入的方式跨类调用。
- 需在配置类上添加 `@EnableAsync` 注解，开启 Spring 对异步方法的支持。

总结：`@Async` 的本质是**利用 AOP 代理 + 线程池，将同步方法调用转为异步执行**，简化了多线程编程的复杂度



## 31. 为什么 Spring和IDEA 都不推荐使用 @Autowired 注解？

Spring 和 IDEA 不推荐使用 `@Autowired` 注解（更准确地说，是不推荐**用 `@Autowired` 进行字段注入**），核心原因是字段注入存在设计缺陷和潜在风险，具体如下：

1. **隐藏依赖关系，可读性差**字段注入通过反射直接给私有字段赋值，无需显式构造器或 setter 方法，导致从类的定义中无法直观看出该类依赖哪些 Bean，必须查看内部字段才能知晓，降低了代码的可读性和可维护性。
2. **易引发初始化时的空指针异常**字段注入在对象构造完成后才通过反射注入依赖。若在构造器中使用依赖字段，此时依赖尚未注入，会直接抛出空指针异常，导致 Spring 容器初始化失败。
3. **不利于单元测试**字段注入的依赖由 Spring 容器管理，单元测试时（不启动容器）需通过反射强行设置**私有字段**的值，操作繁琐且不优雅。如果是通过**构造器注入**就直接在**实例化对象时传入即可**。
4. **可能掩盖循环依赖的设计问题**Spring 能处理字段注入的循环依赖（如 A 依赖 B，B 依赖 A），但这本质上掩盖了代码设计的不合理性。而构造器注入会在启动时直接报错，强制开发者解决循环依赖，更利于代码设计优化。
5. **类型匹配易冲突**`@Autowired` 默认按类型（ByType）注入，若容器中存在多个同类型的 Bean，会导致装配失败，需要额外配合 `@Qualifier` 指定名称，增加复杂度。

相比之下，**构造器注入**能显式声明依赖、确保依赖在对象创建时初始化、便于测试且能暴露循环依赖问题，因此被推荐为更优的注入方式。IDEA 的警告本质是引导开发者遵循更规范的依赖注入设计原则。