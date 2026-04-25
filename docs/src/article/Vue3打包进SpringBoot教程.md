# Vue3 前端打包进 Spring Boot 单 JAR 部署教程

> **适用场景**：`clothesRecycle-admin`（Vue3）+ `clothesRecycle-client`（Vue3）+ `clothesRecycle-server`（Spring Boot）三个项目，最终打包成一个 JAR 文件直接运行。

---

## 一、整体架构说明

```
访问 http://your-domain/admin/**  →  管理端 (clothesRecycle-admin)
访问 http://your-domain/**        →  客户端 (clothesRecycle-client)
访问 http://your-domain/api/**    →  后端接口 (Spring Boot)
```

打包后的 JAR 内部结构如下：

```
clothesRecycle-server.jar
└── BOOT-INF/classes/
    └── static/
        ├── index.html          ← client 首页
        ├── assets/             ← client 静态资源
        └── admin/
            ├── index.html      ← admin 首页
            └── assets/         ← admin 静态资源
```

---

## 二、配置 clothesRecycle-client（客户端 Vue3）

### 2.1 修改 `vite.config.ts`

```typescript
// clothesRecycle-client/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  base: '/',
  // ↑ client 部署在根路径，base 保持默认 '/' 即可

  build: {
    // 打包输出目录：直接输出到 server 项目的 static 根目录
    outDir: '../clothesRecycle-server/src/main/resources/static',

    // 每次构建前清空输出目录
    // 注意：设为 false，避免误删 admin 目录！
    emptyOutDir: false,
  }
})
```

> **为什么 `emptyOutDir: false`？**
> 因为 `static/` 目录同时存放了 admin 和 client 两套资源，如果开启清空，每次构建 client 时会把 admin 的文件删掉。

### 2.2 配置 Vue Router（history 模式）

```typescript
// clothesRecycle-client/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// import.meta.env.BASE_URL 读取 vite.config.js base: '/'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

### 2.3配置 `.env.production`  

**新建文件：`.env.production`**  

```js
# 生产环境后端地址（部署时必须替换为真实地址，例如 https://api.example.com）。
VITE_API_BASE_URL= http://8.136.30.123:8080
```

> **admin 同理配置**



---

## 三、配置 clothesRecycle-admin（管理端 Vue3）

### 3.1 修改 `vite.config.ts`

```typescript
// clothesRecycle-admin/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // admin 部署在 /admin/ 子路径下，必须配置 base
  base: '/admin/',

  build: {
    // 打包输出到 server 项目的 static/admin/ 目录
    outDir: '../clothesRecycle-server/src/main/resources/static/admin',

    // 同样不要清空，防止删除其他文件
    emptyOutDir: false,
  }
})
```

> **`base: '/admin/'` 的作用**：
> Vite 构建时，所有静态资源的引用路径都会加上 `/admin/` 前缀。
> 例如：`<script src="/admin/assets/index-abc123.js">` ，这样浏览器才能正确加载资源。

### 3.2 配置 Vue Router（history 模式）

```typescript
// clothesRecycle-admin/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // base 必须与 vite.config.ts 中的 base 一致
  history: createWebHistory('/admin/'),
  routes: [
    // 你的路由配置...
  ]
})

export default router
```

---

## 四、配置 clothesRecycle-server（Spring Boot）

### 4.1 配置拦截器

  拦截器判断规则（SpaInterceptor.preHandle）：
  - path 含 .（如 .js .css .ico）→ 放行，由 Spring Boot 默认静态资源处理器响应
  - path 以 /api/ 开头 → 放行，走 REST 控制器
  - path 以 /admin 开头 → 转发到 /admin/index.html，返回 false
  - 其余 → 转发到 /index.html，返回 false

```java
/**
 * SPA 路由拦截器。
 * 无文件后缀的路径视为前端路由，转发到对应的 index.html；
 * 有后缀的路径（JS/CSS/图片等）直接放行，由静态资源处理器响应。
 */
@Component
public class SpaInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getServletPath();

        // API 请求或静态文件（含后缀）直接放行
        if (path.startsWith("/api/") || path.contains(".")) {
            return true;
        }

        if (path.startsWith("/admin")) {
            request.getRequestDispatcher("/admin/index.html").forward(request, response);
        } else {
            request.getRequestDispatcher("/index.html").forward(request, response);
        }
        return false;
    }
}
```

### 4.2 API 接口统一加 `/api` 前缀（推荐）

> **推荐做法**：直接在每个 `@RestController` 上添加 `@RequestMapping("/api/xxx")`，不要修改全局 context-path，否则静态资源路径也会受影响。

或者在 `application.yml` 中使用 context-path：

```yaml
spring:
  mvc:
    servlet:
      # 方式一：整个应用加前缀（不推荐，会影响静态资源访问）
      # path: /api

# 推荐方式：每个 Controller 自行加 /api 前缀
```

---

## 五、使用 Maven 自动化构建（一键打包）

手动先构建前端、再构建后端太麻烦。使用 `frontend-maven-plugin` 可以让 `mvn package` 自动完成所有步骤。

### 5.1 修改 `clothesRecycle-server/pom.xml`

```xml
<project>
    <!-- ... 其他配置 ... -->

    <build>
        <plugins>

            <!-- ① frontend-maven-plugin：自动构建 client 前端 -->
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>1.15.0</version>

                <!-- 指定前端项目的根目录 -->
                <configuration>
                    <workingDirectory>../clothesRecycle-client</workingDirectory>
                    <!-- 插件自动下载 Node.js 到此目录，不影响系统环境 -->
                    <installDirectory>target</installDirectory>
                </configuration>

                <executions>
                    <!-- 第一步：安装 Node.js 和 npm（首次执行会下载） -->
                    <execution>
                        <id>install-node-for-client</id>
                        <goals>
                            <goal>install-node-and-npm</goal>
                        </goals>
                        <configuration>
                            <nodeVersion>v20.11.0</nodeVersion>
                            <npmVersion>10.2.4</npmVersion>
                        </configuration>
                    </execution>

                    <!-- 第二步：安装依赖 -->
                    <execution>
                        <id>npm-install-client</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>install</arguments>
                        </configuration>
                    </execution>

                    <!-- 第三步：构建 client -->
                    <execution>
                        <id>npm-build-client</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <phase>generate-resources</phase>
                        <configuration>
                            <arguments>run build</arguments>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!-- ② frontend-maven-plugin：自动构建 admin 前端 -->
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>1.15.0</version>

                <configuration>
                    <workingDirectory>../clothesRecycle-admin</workingDirectory>
                    <installDirectory>target</installDirectory>
                </configuration>

                <executions>
                    <execution>
                        <id>install-node-for-admin</id>
                        <goals>
                            <goal>install-node-and-npm</goal>
                        </goals>
                        <configuration>
                            <nodeVersion>v20.11.0</nodeVersion>
                            <npmVersion>10.2.4</npmVersion>
                        </configuration>
                    </execution>

                    <execution>
                        <id>npm-install-admin</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>install</arguments>
                        </configuration>
                    </execution>

                    <execution>
                        <id>npm-build-admin</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <phase>generate-resources</phase>
                        <configuration>
                            <arguments>run build</arguments>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!-- ③ Spring Boot Maven 插件：打成可执行 JAR -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

        </plugins>
    </build>

</project>
```

---

## 六、构建与运行

### 6.1 方式一：全自动（Maven 驱动，推荐 CI/CD）

```bash
# 进入 server 项目目录
cd clothesRecycle-server

# 一条命令完成：安装 Node → 构建 client → 构建 admin → 打 JAR
mvn clean package -DskipTests

# 运行
java -jar target/clothesRecycle-server-1.0.0.jar
```

### 6.2 方式二：手动构建前端 + Maven 打包（开发调试推荐）

```bash
# 1. 构建 client
cd clothesRecycle-client
npm install
npm run build

# 2. 构建 admin
cd ../clothesRecycle-admin
npm install
npm run build

# 3. 打包 Spring Boot
cd ../clothesRecycle-server
mvn clean package -DskipTests

# 4. 运行
java -jar target/clothesRecycle-server-1.0.0.jar
```

### 6.3 验证结果

```
# 构建完成后，检查静态资源是否正确生成
clothesRecycle-server/src/main/resources/static/
├── index.html              ✅ client 首页
├── assets/
│   ├── index-xxxxxx.js     ✅ client JS
│   └── index-xxxxxx.css    ✅ client CSS
└── admin/
    ├── index.html          ✅ admin 首页
    └── assets/
        ├── index-xxxxxx.js ✅ admin JS
        └── index-xxxxxx.css✅ admin CSS
```

启动后访问：
- 客户端：`http://localhost:8080/`
- 管理端：`http://localhost:8080/admin/`
- 接口示例：`http://localhost:8080/api/xxx`

---

## 七、常见问题排查

### Q1：刷新页面出现 404

**原因**：Vue Router history 模式下，刷新时浏览器向服务器请求该路径，服务器找不到对应文件。

**解决**：确认 `SpaController.java` 已正确添加，且路由正则没有误拦截静态资源路径。

---

### Q2：admin 页面加载后资源 404（JS/CSS 加载失败）

**原因**：`vite.config.ts` 中 `base` 未配置或配置错误。

**解决**：确认 admin 项目的 `base: '/admin/'`，重新执行 `npm run build`。

---

### Q3：接口请求被 SpaController 拦截，返回 HTML 而不是 JSON

**原因**：接口路径未排除在 SpaController 之外。

**解决**：确认所有接口都以 `/api/` 开头，且 SpaController 的正则中已排除 `api`：
```java
"/{path:^(?!api|admin|actuator).*$}"
```

---

### Q4：Maven 构建时报错找不到 Node

**原因**：`frontend-maven-plugin` 首次运行需要下载 Node.js，网络问题导致失败。

**解决**：
```xml
<!-- 在 plugin configuration 中指定国内镜像 -->
<configuration>
    <nodeDownloadRoot>https://npmmirror.com/mirrors/node/</nodeDownloadRoot>
    <npmDownloadRoot>https://registry.npmmirror.com/npm/-/</npmDownloadRoot>
</configuration>
```

---

### Q5：本地开发时前端请求后端接口跨域

**原因**：开发时前端跑在 `localhost:5173`，后端跑在 `localhost:8080`，端口不同产生跨域。

**解决**：在各前端项目的 `vite.config.ts` 中配置代理（仅开发环境生效，打包后不需要）：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 八、目录结构总览

```
workspace/
├── clothesRecycle-client/          # 客户端 Vue3
│   ├── src/
│   ├── vite.config.ts              # base: '/', outDir: '../server/static'
│   └── package.json
│
├── clothesRecycle-admin/           # 管理端 Vue3
│   ├── src/
│   ├── vite.config.ts              # base: '/admin/', outDir: '../server/static/admin'
│   └── package.json
│
└── clothesRecycle-server/          # Spring Boot
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── controller/
    │       │       └── SpaController.java   # SPA 路由转发
    │       └── resources/
    │           ├── static/                  # 前端构建产物（自动生成）
    │           └── application.yml
    └── pom.xml                             # 含 frontend-maven-plugin
```
