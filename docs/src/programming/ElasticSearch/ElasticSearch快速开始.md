# Elasticsearch 安装 + Spring Boot 整合完整教程

> **版本说明（2025年最新）**
>
> - Elasticsearch：**8.x**（当前最新稳定版 8.17.x）
> - Spring Boot：**3.x**
> - Spring Data Elasticsearch：**5.x**
> - Java：**17+**
> - 系统：**CentOS 7 / RHEL 7**


## 一、Linux (CentOS 7) 安装 Elasticsearch

### 第 1 步：安装 Elasticsearch

CentOS 7 使用 `yum` 命令安装： [Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/rpm.html)

> ⚠️ 注意：直接用 root 执行，不要加 sudo。加了 sudo 会导致代理环境变量失效。

如果服务器在国内需要代理访问境外源，先设置代理：

```bash
# 第 1 步：导入 GPG 密钥
sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

# 第 2 步：创建 YUM 仓库文件
sudo tee /etc/yum.repos.d/elasticsearch.repo <<EOF
[elasticsearch-8.x]
name=Elasticsearch repository for 8.x packages
baseurl=https://artifacts.elastic.co/packages/8.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
EOF

# 第 3 步：设置代理
export http_proxy=http://你的代理IP:端口
export https_proxy=http://你的代理IP:端口

# 第 4 步：安装
yum install elasticsearch -y
```

### 第 2 步：配置 Elasticsearch

**编辑主配置文件：**

```bash
vim /etc/elasticsearch/elasticsearch.yml
```

**关键配置项修改：**

```yaml
# 集群名称
cluster.name: my-application

# 节点名称
node.name: node-1

# 数据目录
path.data: /var/lib/elasticsearch

# 日志目录
path.logs: /var/log/elasticsearch

# 允许远程访问（开发环境）
network.host: 0.0.0.0

# 端口
http.port: 9200

# 单节点模式
discovery.type: single-node

# 关闭安全认证（开发环境）
xpack.security.enabled: false
xpack.security.http.ssl.enabled: false
```

> ⚠️ **注意**：ES 8.x 默认开启安全认证（SSL + 用户名密码）。开发环境可按上面配置关闭，**生产环境务必开启！**



### 第 3 步：创建目录并赋权（重要）

ES 启动时需要有权限读写数据目录和日志目录，否则会报 `Unable to create logs dir` 错误：

```bash
# 创建目录
mkdir -p /var/log/elasticsearch
mkdir -p /var/lib/elasticsearch

# 赋予 elasticsearch 用户权限
chown -R elasticsearch:elasticsearch /var/log/elasticsearch
chown -R elasticsearch:elasticsearch /var/lib/elasticsearch
```



### 第 4 步：系统内核参数调整

需要设置内核和 ulimit 参数，确保 ES 正常运行： [Youstable](https://www.youstable.com/blog/install-elasticsearch-on-linux)

```bash
# 设置虚拟内存
sudo sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf

# 设置文件描述符限制
sudo tee -a /etc/security/limits.conf <<EOF
elasticsearch  soft  nofile  65536
elasticsearch  hard  nofile  65536
elasticsearch  soft  nproc   4096
elasticsearch  hard  nproc   4096
EOF
```

### 第 5 步：启动并设置开机自启

```bash
# 加载配置
sudo systemctl daemon-reload

# 开机自启动
sudo systemctl enable elasticsearch

# 禁用自启动
sudo systemctl disable elasticsearch

# 启动之前可能出现：ES 的 keystore（密钥库）里存了 SSL 密码，但你在配置文件里关闭了 SSL，两者冲突了。
# 删除 transport ssl 的 keystore 密码
/usr/share/elasticsearch/bin/elasticsearch-keystore remove xpack.security.transport.ssl.keystore.secure_password
# 删除 transport ssl 的 truststore 密码
/usr/share/elasticsearch/bin/elasticsearch-keystore remove xpack.security.transport.ssl.truststore.secure_password

# 启动
sudo systemctl start elasticsearch

# 查看服务状态
sudo systemctl status elasticsearch

# 浏览器访问地址
http://192.168.30.129:9200/
```

### 第 6 步：给 ES 设置用户名密码（可选）

**首先要在 `elasticsearch.yml` 里开启安全认证：**

```bash
vim /etc/elasticsearch/elasticsearch.yml
```

**修改这几行：**

```bash
# 开启安全认证
xpack.security.enabled: true

# 如果不需要 SSL，只开启认证不加密（开发环境）
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false
```

**设置密码 `-i` 表示交互模式，可以自己输入密码。**

```bash
/usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic -i
```

**重启 ES：**

```bash
systemctl restart elasticsearch
```

### 第 7 步：卸载 Elasticsearch

**第一步：停止服务**

```bash
systemctl stop elasticsearch
systemctl disable elasticsearch
```

**第二步：卸载软件包**

```bash
yum remove elasticsearch -y
```

**第三步：删除残留文件**（yum remove 不会自动删这些）

```bash
# 删除配置文件
rm -rf /etc/elasticsearch

# 删除数据文件
rm -rf /var/lib/elasticsearch

# 删除日志文件
rm -rf /var/log/elasticsearch

# 删除安装目录
rm -rf /usr/share/elasticsearch

# 删除 systemd 服务文件（如果残留）
rm -f /etc/systemd/system/elasticsearch.service
rm -f /usr/lib/systemd/system/elasticsearch.service

# 删除 yum 仓库文件
rm -f /etc/yum.repos.d/elasticsearch.repo
```

**第四步：重新加载 systemd**

```bash
systemctl daemon-reload
```

**第五步：确认是否删干净**

```bash
# 确认软件包已卸载
rpm -qa | grep elasticsearch

# 确认目录已删除
ls /etc/elasticsearch 2>/dev/null || echo "已删除"
ls /var/lib/elasticsearch 2>/dev/null || echo "已删除"
```

------

## 二、Spring Boot 3.x 整合 Elasticsearch

### 第 1 步：pom.xml 添加依赖

```xml
<dependencies>
    <!-- Spring Data Elasticsearch -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
    </dependency>
    <!-- 接口测试 地址：http://127.0.0.1:8080/doc.html-->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
            <version>4.4.0</version>
        </dependency>
</dependencies>
```

> Spring Boot 3.x 自动引入 Spring Data Elasticsearch 5.x，无需手动指定版本。

### 第 2 步：application.yml 配置

```yaml
spring:
  elasticsearch:
    uris: http://localhost:9200
    # 若开启了安全认证，填写用户名密码
    username: elastic
    password: 1+1=2yes
    connection-timeout: 5s
    socket-timeout: 30s
```

### 第 3 步：创建实体类（Document）

Spring Data Elasticsearch 使用 POJO 映射到 ES 中的 JSON 文档，通过 `@Document` 注解标识： [Medium](https://medium.com/@truongbui95/exploring-elasticsearch-8-utilizing-spring-boot-3-and-spring-data-elasticsearch-5-495650115197)

```java
@Data
@Schema(description = "商品实体")
@Document(indexName = "products")
public class Product {

    @Id
    @Schema(description = "商品ID")
    private String id;

    @Schema(description = "商品名称")
    @Field(type = FieldType.Text, analyzer = "ik_max_word") // 中文分词器（需安装IK）
    private String name;

    @Schema(description = "商品描述")
    @Field(type = FieldType.Text)
    private String description;

    @Schema(description = "商品价格")
    @Field(type = FieldType.Double)
    private Double price;

    @Schema(description = "商品分类")
    @Field(type = FieldType.Keyword)
    private String category;
}
```

### 第 4 步：创建 Repository

```java
// 不需要用@Repository继承ElasticsearchRepository，Spring Data 会自动扫描并注入。
public interface ProductRepository extends ElasticsearchRepository<Product, String> {

    // 按名称模糊搜索（Spring Data 自动实现）
    // findByNameContaining 查询name  Containing-包含
    List<Product> findByNameContaining(String name);

    // 按分类查询
    List<Product> findByCategory(String category);

    // 按价格范围
    List<Product> findByPriceBetween(Double min, Double max);
}
```

### 第 5 步：Service 层（含高级查询）

```java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    // 新增 / 修改
    public Product save(Product product) {
        return productRepository.save(product);
    }

    // 批量新增
    public List<Product> batchSave(List<Product> products) {
        Iterable<Product> all = productRepository.saveAll(products);
        List<Product> list = new ArrayList<>();
        all.forEach(list::add);
        return list;
    }

    // 根据 ID 查询
    public Product getById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    // 查询全部
    public List<Product> getAll() {
        Iterable<Product> all = productRepository.findAll();
        List<Product> list = new ArrayList<>();
        all.forEach(list::add);
        return list;
    }

    // 按名称模糊搜索
    public List<Product> searchByName(String keyword) {
        return productRepository.findByNameContaining(keyword);
    }

    // 按分类查询
    public List<Product> searchByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // 按价格范围查询
    public List<Product> searchByPriceRange(Double min, Double max) {
        return productRepository.findByPriceBetween(min, max);
    }

    // 多字段全文搜索
    public List<Product> fullTextSearch(String keyword) {
        /**
         * | 字段 | 权重 | 含义 |
         * |---|---|---|
         * | `name^3` | 3 | 商品名称匹配到，得分 × 3 |
         */
        Query multiMatchQuery = Query.of(q -> q.multiMatch(mm -> mm.query(keyword).fields("name^3", "description^1")));
        NativeQuery nativeQuery = NativeQuery.builder().withQuery(multiMatchQuery).build();
        return elasticsearchOperations.search(nativeQuery, Product.class).stream().map(SearchHit::getContent).collect(Collectors.toList());
    }

    // 删除
    public void delete(String id) {
        productRepository.deleteById(id);
    }
}
```

> ⚠️ **重要**：Spring Data Elasticsearch 5.x 中，旧版的 `NativeSearchQuery` 已被 `NativeQuery` 替代，`QueryBuilders` 的使用方式也发生了较大变化，需使用新的 Builder 风格 API。 [Sergiiblog](https://sergiiblog.com/how-to-work-with-elasticsearch-8-using-spring-boot-3-x-and-spring-data-elasticsearch-5-x/)

### 第 6 步：Controller 层

```java
@Tag(name = "商品搜索", description = "Elasticsearch 商品管理接口")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "新增商品")
    @PostMapping("/save")
    public Result<Product> save(@RequestBody Product product) {
        return Result.success(productService.save(product));
    }

    @Operation(summary = "批量新增")
    @PostMapping("/batchSave")
    public Result<List<Product>> batchSave(@RequestBody List<Product> products) {
        return Result.success(productService.batchSave(products));
    }

    @Operation(summary = "根据ID查询商品")
    @GetMapping("/{id}")
    public Result<Product> getById(@Parameter(description = "商品ID") @PathVariable String id) {
        return Result.success(productService.getById(id));
    }

    @Operation(summary = "查询全部商品")
    @GetMapping
    public Result<List<Product>> getAll() {
        return Result.success(productService.getAll());
    }

    @Operation(summary = "关键词全文搜索（多字段）")
    @GetMapping("/search")
    public Result<List<Product>> search(@Parameter(description = "搜索关键词") @RequestParam String keyword) {
        return Result.success(productService.fullTextSearch(keyword));
    }

    @Operation(summary = "按名称模糊搜索")
    @GetMapping("/search/name")
    public Result<List<Product>> searchByName(@Parameter(description = "商品名称关键词") @RequestParam String keyword) {
        return Result.success(productService.searchByName(keyword));
    }

    @Operation(summary = "按分类查询")
    @GetMapping("/search/category")
    public Result<List<Product>> searchByCategory(@Parameter(description = "商品分类") @RequestParam String category) {
        return Result.success(productService.searchByCategory(category));
    }

    @Operation(summary = "按价格范围查询")
    @GetMapping("/search/price")
    public Result<List<Product>> searchByPrice(@Parameter(description = "最低价格") @RequestParam Double min,
        @Parameter(description = "最高价格") @RequestParam Double max) {
        return Result.success(productService.searchByPriceRange(min, max));
    }

    @Operation(summary = "删除商品")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@Parameter(description = "商品ID") @PathVariable String id) {
        productService.delete(id);
        return Result.success();
    }
}
```

------

## 三、中文分词（IK 插件，推荐）

ES 默认不支持中文分词，需安装 IK 分词器：

```bash
# 替换版本号为你安装的 ES 版本
sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install \
  https://get.infini.cloud/elasticsearch/analysis-ik/8.19.13
# 重启 ES
sudo systemctl restart elasticsearch
```

实体字段使用 `analyzer = "ik_max_word"` 即可启用中文分词。

------

## 四、版本对应关系速查

| Spring Boot | Spring Data ES | Elasticsearch |
| ----------- | -------------- | ------------- |
| 3.3.x       | 5.3.x          | 8.x           |
| 3.2.x       | 5.2.x          | 8.x           |
| 3.1.x       | 5.1.x          | 8.x           |
| 2.7.x       | 4.4.x          | 7.x           |

------

## 五、常见问题

**1. CentOS 7 系统太旧，ES 8 无法安装？** 可以改装 ES 7.17.x（长期支持版），配置文件和 Spring Boot 2.7.x 搭配即可，安全机制默认不开启更易上手。

**2. 连接报 SSL 错误？** 确认 `elasticsearch.yml` 中 `xpack.security.http.ssl.enabled: false`，或在 Spring 配置中正确传入证书路径。

**3. `vm.max_map_count` 不够导致 ES 启动失败？** 执行 `sudo sysctl -w vm.max_map_count=262144` 后重启 ES。