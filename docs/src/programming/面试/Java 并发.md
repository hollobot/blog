# Java并发常见面试题总结



## 1. 什么是线程池，如何使用？为什么要使用线程池？

线程池就是事先将多个线程对象放到一个容器中，使用的时候就不用new线程而是直接去池中拿线程即可，节省了开辟子线程的时间，提高了代码执行效率。



## 2. 为什么平时都是使用线程池创建线程，直接new一个线程不好吗？

在实际开发中，我们更倾向于使用线程池创建线程，而非直接 `new Thread()`，核心原因是**线程池能更高效地管理线程资源，避免频繁创建 / 销毁线程带来的性能损耗，同时提供更灵活的控制能力**。



## 3. 为什么使用线程池？

**降低资源消耗**。通过重复利用已创建的线程降低线程创建和销毁造成的消耗。

**提高响应速度**。当任务到达时，可以不需要等到线程创建就能立即执行。

**提高线程的可管理性**。统一管理线程，避免系统创建大量同类线程而导致消耗完内存。



## 4. 线程池大小怎么设置？

如果线程池线程数量太小，当有大量请求需要处理，系统响应比较慢，会影响用户体验，甚至会出现任务队列大量堆积任务导致OOM。

如果线程池线程数量过大，大量线程可能会同时抢占 CPU 资源，这样会导致大量的上下文切换，从而增加线程的执行时间，影响了执行效率。

**CPU 密集型任务(N+1)**： 这种任务消耗的主要是 CPU 资源，可以将线程数设置为` N（CPU 核心数）+1`，多出来的一个线程是为了防止某些原因导致的线程阻塞（如IO操作，线程sleep，等待锁）而带来的影响。一旦某个线程被阻塞，释放了CPU资源，而在这种情况下多出来的一个线程就可以充分利用 CPU 的空闲时间。

**I/O 密集型任务(2N)**： 系统的大部分时间都在处理 IO 操作，此时线程可能会被阻塞，释放CPU资源，这时就可以将 CPU 交出给其它线程使用。因此在 IO 密集型任务的应用中，可以多配置一些线程，具体的计算方法：`最佳线程数 = CPU核心数 * (1/CPU利用率) = CPU核心数 * (1 + (IO耗时/CPU耗时))`，一般可设置为2N。



## 5. execute和submit的区别

在 Java 线程池中，`execute()` 和 `submit()` 都是提交任务的方法，但它们在使用场景、返回值、异常处理等方面有显著区别，具体如下：

#### 1. **方法定义与所属接口**

- `execute(Runnable command)`：定义在 `Executor` 接口中，是线程池提交任务的最基础方法，仅支持提交 `Runnable` 类型的任务。
- `submit(...)`：定义在 `ExecutorService` 接口中（`ThreadPoolExecutor` 实现了该接口），有多个重载版本：
  - `submit(Runnable task)`：提交 `Runnable` 任务。
  - `submit(Runnable task, T result)`：提交 `Runnable` 任务，并指定返回结果。
  - `submit(Callable<T> task)`：提交 `Callable` 任务（`Callable` 可返回结果并抛出受检异常）。

#### 2. **返回值**

- `execute()`：**无返回值（void）**。无法获取任务的执行结果或判断任务是否完成。
- `submit()`：**返回 `Future<T>` 对象**。`Future` 是一个 “未来结果” 的持有者，通过它可以：
  - 调用 `get()` 方法获取任务执行结果（`Callable` 的返回值或 `Runnable` 关联的 `result`），若任务未完成，`get()` 会阻塞直到结果返回；
  - 调用 `isDone()` 判断任务是否执行完毕；
  - 调用 `cancel()` 取消未执行的任务。

#### 3. **异常处理**

- `execute()`：任务执行过程中抛出的 **未捕获异常（包括运行时异常）会直接抛出**（可能被线程池的 `UncaughtExceptionHandler` 捕获，若未设置则默认打印到控制台），且会导致当前线程被销毁并创建新线程（核心线程除外）。
- `submit()`：任务执行过程中抛出的异常（包括 `Callable` 的受检异常）会被 **封装到 `Future` 对象中**，不会直接抛出。只有当调用 `Future.get()` 时，异常才会以 `ExecutionException` 的形式被抛出（需要手动捕获处理）。

#### 4. **适用场景**

- `execute()`：适合提交 “只需要执行，无需关注结果或异常” 的任务（如日志打印、消息推送等），更轻量。
- `submit()`：适合需要获取任务执行结果、判断任务状态或处理异常的场景（如计算任务、数据查询等），功能更丰富但有一定开销（`Future` 对象的管理）。

#### 总结对比表

| 特性         | `execute()`        | `submit()`                                  |
| ------------ | ------------------ | ------------------------------------------- |
| 支持任务类型 | 仅 `Runnable`      | `Runnable` 或 `Callable`                    |
| 返回值       | 无（void）         | `Future<T>` 对象（可获取结果）              |
| 异常处理     | 直接抛出未捕获异常 | 异常封装在 `Future` 中，调用 `get()` 时抛出 |
| 适用场景     | 无需结果的任务     | 需要结果、状态或处理异常的任务              |

```java
ExecutorService executor = Executors.newFixedThreadPool(1);

// execute()：无返回值，异常直接抛出
executor.execute(() -> {
    System.out.println("execute task");
    throw new RuntimeException("execute exception"); // 直接打印异常
});

// submit()：返回Future，异常在get()时抛出
Future<String> future = executor.submit(() -> {
    System.out.println("submit task");
    return "result";
});
try {
    String result = future.get(); // 获取结果，若任务抛异常则此处抛出ExecutionException
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}

executor.shutdown();
```



## 6. 进程线程

进程是指一个内存中运行的应用程序，每个进程都有自己独立的一块内存空间。

线程是比进程更小的执行单位，它是在一个进程中独立的控制流，一个进程可以启动多个线程，每条线程并行执行不同的任务。



## 7. 线程的生命周期

在 Java 中，线程的生命周期由 **`Thread.State` 枚举类**表示，一共有 **6 种状态**：

**1.NEW（新建）** 线程对象被创建，但还没有调用 `start()` 方法。

```java
Thread t = new Thread(() -> {
    System.out.println("Hello Thread");
});
System.out.println(t.getState()); // NEW
```

**2.RUNNABLE（就绪/可运行）**

调用 `start()` 后进入该状态，等待 CPU 调度。

注意：**就绪状态不代表一定在运行**，只表示有资格被调度。

```java
t.start();
System.out.println(t.getState()); // RUNNABLE
```

**3.RUNNING（运行）**

实际上 Java **没有单独的 RUNNING 状态**，在 `Thread.State` 中它被包含在 **RUNNABLE（就绪/可运行）**。

一旦 CPU 调度该线程，它就处于运行状态

注意：线程只能从 RUNNABLE（就绪/可运行） → RUNNING（运行），由 CPU 决定。

**4.BLOCKED（阻塞）**

线程在等待 **获取某个对象锁** 时进入此状态。

特点：**没有超时机制，必须等到锁释放。**

```java
synchronized(obj) {  // 一个线程已经持有 obj 锁
    // 其他线程进入时会进入 BLOCKED
}
```

**5.WAITING（无限期等待）**

线程进入等待状态，**必须被其他线程显式唤醒**（`notify()` / `notifyAll()`）。

不会自动返回，就像“沉睡”一样。

```java
synchronized(obj) {
    obj.wait(); // WAITING
}
```

**6.TIMED_WAITING（限时等待）**

和 WAITING 类似，但可以在 **超时后自动返回**。

常见方法：`sleep(long millis)`、`join(long millis)`、`wait(long millis)`、`parkNanos()` / `parkUntil()`（JUC 里的 LockSupport）

```java
Thread.sleep(1000); // TIMED_WAITING
```

**7.TERMINATED（终止）**

线程执行完 `run()` 方法后，进入终止状态。

```java
t.join(); 
System.out.println(t.getState()); // TERMINATED
```

**流程图**

![image-20250823133521217.BL3vqDnW](./assets/image-20250823133521217.BL3vqDnW-1761293153439-3.png)

**面试常考点**

**NEW 和 RUNNABLE 的区别？**

- NEW：对象创建还未 start()
- RUNNABLE：调用了 start()，进入就绪队列等待 CPU 调度

**WAITING 和 TIMED_WAITING 区别？**

- WAITING：无限期等待，必须 notify/notifyAll 唤醒
- TIMED_WAITING：有超时时间，到期自动恢复 RUNNABLE

**BLOCKED 和 WAITING 区别？**

- BLOCKED：等待 **获取锁**

WAITING：等待 **被唤醒（notify/notifyAll）**





## 8. 讲讲线程中断？

线程中断是 Java 中一种协作式的线程终止机制，它并非直接强制终止线程，而是通过设置线程的中断状态（一个 boolean 标志），让线程自行判断是否需要停止执行，从而实现安全、可控的线程退出。

#### 1. **核心概念：中断状态**

每个线程都有一个内部的 **中断状态（interrupt status）**（默认值为 `false`），用于标识线程是否被请求中断。中断操作的本质是**修改这个状态**，而非立即终止线程。

#### 2. **中断相关的核心方法**

Java 中通过 `Thread` 类的三个方法操作中断：

| 方法                           | 作用                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| `void interrupt()`             | 给目标线程发送中断请求，设置其中断状态为 `true`（若线程阻塞，会触发异常）。 |
| `boolean isInterrupted()`      | 判断当前线程的中断状态（**不会清除状态**）。                 |
| `static boolean interrupted()` | 判断当前线程的中断状态（**会清除状态**，将其重置为 `false`）。 |

#### 3. **线程中断的工作机制**

线程中断是**协作式**的，即：

- 当线程 A 调用线程 B 的 `interrupt()` 方法时，只是 “通知” B 线程 “你可以中断了”，但 B 线程是否中断由自己决定。
- 线程 B 需要主动检测自己的中断状态（通过 `isInterrupted()` 或 `interrupted()`），并在合适的时机停止执行。

#### 4. **特殊场景：中断阻塞状态的线程**

如果线程处于 **阻塞状态**（如 `sleep()`、`wait()`、`join()` 等），此时调用 `interrupt()` 会：

1. 立即清除线程的中断状态（重置为 `false`）。
2. 抛出 `InterruptedException` 异常，使线程退出阻塞状态。

**示例**：

```java
Thread t = new Thread(() -> {
    try {
        // 线程进入阻塞状态（休眠）
        Thread.sleep(10000); 
    } catch (InterruptedException e) {
        // 捕获中断异常，此时中断状态已被清除（isInterrupted() 为 false）
        System.out.println("线程被中断，退出阻塞");
        // 可在此处决定是否终止线程
        return; 
    }
});
t.start();

// 主线程 1 秒后中断 t 线程
Thread.sleep(1000);
t.interrupt(); // t 线程会抛出 InterruptedException
```

#### 5. **如何正确响应中断**

线程若需要支持中断，应在执行过程中**主动检测中断状态**，并在收到中断请求后优雅退出：

**在循环中检测中断状态**：

```java
Thread t = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) { // 检测中断状态
        // 执行任务逻辑
        System.out.println("执行任务...");
        try {
            Thread.sleep(500); // 可能抛出 InterruptedException
        } catch (InterruptedException e) {
            // 捕获异常后，需手动再次设置中断状态（因为异常会清除状态）
            Thread.currentThread().interrupt(); 
            break; // 退出循环，终止线程
        }
    }
    System.out.println("线程已终止");
});
t.start();

// 中断线程
t.interrupt();
```



## 9. 创建线程有哪几种方式？

在 Java 中，创建线程的方式可分为**直接创建**和**通过线程池间接创建**两大类，共 4 种具体实现方式。以下是完整总结及代码示例：

#### 一、创建线程的 4 种方式

1. 继承 `Thread` 类并重写 `run()` 方法
2. 实现 `Runnable` 接口并重写 `run()` 方法
3. 实现 `Callable<T>` 接口并重写 `call()` 方法（配合 `FutureTask`）
4. 通过线程池（`ExecutorService`）提交任务（间接创建）

#### 二、代码实现

**1. 继承 `Thread` 类**

```java
// 1. 定义Thread子类，重写run()
class ThreadDemo extends Thread {
    @Override
    public void run() {
        System.out.println("方式1：继承Thread，线程名：" + Thread.currentThread().getName());
    }
}

public class ThreadCreation {
    public static void main(String[] args) {
        // 2. 创建线程实例并启动
        Thread thread = new ThreadDemo();
        thread.start(); // 启动线程（底层调用run()）
    }
}
```

**2. 实现 `Runnable` 接口**

```java
// 1. 实现Runnable接口，重写run()
class RunnableDemo implements Runnable {
    @Override
    public void run() {
        System.out.println("方式2：实现Runnable，线程名：" + Thread.currentThread().getName());
    }
}

public class ThreadCreation {
    public static void main(String[] args) {
        // 2. 创建Runnable实例，作为参数传入Thread
        Runnable task = new RunnableDemo();
        Thread thread = new Thread(task);
        thread.start(); // 启动线程
    }
}
```

**3. 实现 `Callable<T>` 接口（配合 `FutureTask`）**

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

// 1. 实现Callable接口，指定返回值类型
class CallableDemo implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        System.out.println("方式3：实现Callable，线程名：" + Thread.currentThread().getName());
        return 100; // 返回结果
    }
}

public class ThreadCreation {
    public static void main(String[] args) throws Exception {
        // 2. 包装Callable到FutureTask（兼具Runnable和Future功能）
        Callable<Integer> task = new CallableDemo();
        FutureTask<Integer> futureTask = new FutureTask<>(task);
        
        // 3. 启动线程
        new Thread(futureTask).start();
        
        // 4. 获取任务结果（阻塞等待）
        System.out.println("Callable返回结果：" + futureTask.get());
    }
}
```

**4. 通过线程池（`ExecutorService`）**

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ThreadCreation {
    public static void main(String[] args) throws Exception {
        // 1. 创建线程池（此处用固定大小线程池）
        ExecutorService executor = Executors.newFixedThreadPool(2);
        
        // 2. 提交Runnable任务（无返回值）
        executor.execute(() -> {
            System.out.println("方式4-1：线程池执行Runnable，线程名：" + Thread.currentThread().getName());
        });
        
        // 3. 提交Callable任务（有返回值）
        Future<String> future = executor.submit(() -> {
            System.out.println("方式4-2：线程池执行Callable，线程名：" + Thread.currentThread().getName());
            return "线程池任务完成";
        });
        
        // 4. 获取Callable结果
        System.out.println("线程池任务返回：" + future.get());
        
        // 5. 关闭线程池
        executor.shutdown();
    }
}
```



## 10. 什么是线程死锁？

线程死锁是多线程并发编程中一种常见的致命问题，指**两个或多个线程相互持有对方所需的资源（如锁），且彼此都在等待对方释放资源，导致所有线程永远阻塞，无法继续执行**的状态。

#### 死锁的核心特征

- **相互等待**：线程 A 持有资源 X，等待线程 B 释放资源 Y；同时线程 B 持有资源 Y，等待线程 A 释放资源 X。
- **无限阻塞**：没有外力干预时，这些线程会永远僵持，既不释放自己的资源，也无法获取所需资源。
- **资源独占**：引发死锁的资源通常是 “互斥资源”（如 `synchronized` 锁、`ReentrantLock` 等），即同一时间只能被一个线程持有。

```java
public class DeadlockDemo {
    // 定义两个互斥资源（锁）
    private static final Object LOCK_A = new Object();
    private static final Object LOCK_B = new Object();

    public static void main(String[] args) {
        // 线程1：先获取LOCK_A，再尝试获取LOCK_B
        Thread thread1 = new Thread(() -> {
            synchronized (LOCK_A) {
                System.out.println("线程1持有LOCK_A，等待LOCK_B...");
                try {
                    Thread.sleep(100); // 模拟业务操作，让线程2有机会获取LOCK_B
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (LOCK_B) { // 尝试获取LOCK_B，但此时已被线程2持有
                    System.out.println("线程1获取LOCK_B，执行完成");
                }
            }
        });

        // 线程2：先获取LOCK_B，再尝试获取LOCK_A
        Thread thread2 = new Thread(() -> {
            synchronized (LOCK_B) {
                System.out.println("线程2持有LOCK_B，等待LOCK_A...");
                try {
                    Thread.sleep(100); // 模拟业务操作，让线程1有机会获取LOCK_A
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (LOCK_A) { // 尝试获取LOCK_A，但此时已被线程1持有
                    System.out.println("线程2获取LOCK_A，执行完成");
                }
            }
        });

        thread1.start();
        thread2.start();
    }
}
```



## 11. 证明避免死锁的？

- 一次性申请所有的资源，避免线程占有资源而且在等待其他资源
- 占有部分资源的线程进一步申请其他资源时，如果申请不到，主动释放它占有的资源
- 按序申请资源



## 12. 线程run()和start()的区别？

当程序调用 `start()` 方法，将会创建一个新线程去执行`run()`方法中的代码。`run()`就像一个普通方法一样，直接调用`run()`的话，不会创建新线程。

一个线程的 `start()` 方法只能调用一次，多次调用会抛出 java.lang.IllegalThreadStateException 异常。`run()` 方法则没有限制。



## 13. 线程都有哪些方法？

Java 中 `Thread` 类提供了一系列方法用于线程的创建、启动、状态控制、中断等操作。这些方法可分为**线程生命周期控制**、**线程状态查询**、**中断相关**、**线程同步辅助**等类别，以下是核心方法的详细说明：

#### 一、线程创建与启动

| 方法                      | 作用                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `Thread()`                | 无参构造方法，创建线程对象（需重写 `run()` 或传入 `Runnable`）。 |
| `Thread(Runnable target)` | 传入 `Runnable` 任务创建线程，线程执行 `target.run()`。      |
| `Thread(String name)`     | 指定线程名称创建线程（便于调试）。                           |
| `start()`                 | 启动线程，使线程进入就绪状态（由 JVM 调用 `run()` 方法，**不可重复调用**）。 |
| `run()`                   | 线程执行体（`Thread` 子类需重写，或由 `Runnable` 提供），直接调用仅为普通方法。 |

#### 二、线程状态控制（阻塞 / 唤醒）

| 方法                    | 作用                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `sleep(long millis)`    | 让当前线程休眠指定毫秒数（进入**超时等待状态**），**不释放锁**，时间到后自动唤醒。 |
| `join()`                | 等待调用此方法的线程执行完毕（如 `t.join()` 表示当前线程等待 `t` 线程结束）。 |
| `join(long millis)`     | 限时等待线程结束，超时后当前线程继续执行。                   |
| `yield()`               | 当前线程主动让出 CPU 时间片，回到就绪状态，允许其他同优先级线程执行（**不释放锁**，仅为 “礼让”）。 |
| `setDaemon(boolean on)` | 将线程标记为守护线程（如 GC 线程），当所有非守护线程结束时，守护线程自动终止（需在 `start()` 前调用）。 |

#### 三、中断相关方法

| 方法                           | 作用                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| `void interrupt()`             | 给线程发送中断请求，设置其中断状态为 `true`；若线程处于阻塞状态（如 `sleep`/`wait`），会抛出 `InterruptedException` 并清除中断状态。 |
| `boolean isInterrupted()`      | 判断当前线程的中断状态（**不清除状态**，多次调用结果一致，直到状态被修改）。 |
| `static boolean interrupted()` | 判断当前线程的中断状态（**会清除状态**，将其重置为 `false`，连续调用可能返回不同结果）。 |

#### 四、线程属性与查询

| 方法                                | 作用                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| `String getName()`                  | 获取线程名称。                                               |
| `void setName(String name)`         | 设置线程名称（建议在启动前设置，便于日志和调试）。           |
| `int getPriority()`                 | 获取线程优先级（1-10，默认 5，优先级高的线程更可能被调度，但不保证）。 |
| `void setPriority(int newPriority)` | 设置线程优先级（需在 `start()` 前，范围 1-10，超出会抛 `IllegalArgumentException`）。 |
| `Thread.State getState()`           | 获取线程当前状态（`New`/`Runnable`/`Blocked`/`Waiting`/`Timed Waiting`/`Terminated`）。 |
| `static Thread currentThread()`     | 返回当前正在执行的线程对象（如主线程中调用返回 `main` 线程）。 |
| `boolean isAlive()`                 | 判断线程是否存活（已启动且未终止）。                         |

#### 五、过时 / 不推荐使用的方法（存在安全风险）

| 方法                     | 问题                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `stop()`                 | 强制终止线程，可能导致资源未释放（如锁未释放），已废弃。     |
| `suspend()` / `resume()` | 暂停 / 恢复线程，容易导致死锁（暂停时持有锁，其他线程无法获取），已废弃。 |

#### 示例代码

```java
public class ThreadMethodsDemo {
    public static void main(String[] args) throws InterruptedException {
        // 创建线程（传入Runnable，指定名称）
        Thread thread = new Thread(() -> {
            System.out.println("子线程名称：" + Thread.currentThread().getName());
            System.out.println("子线程优先级：" + Thread.currentThread().getPriority());
            
            try {
                Thread.sleep(1000); // 休眠1秒（超时等待）
            } catch (InterruptedException e) {
                System.out.println("子线程被中断：" + Thread.currentThread().isInterrupted());
            }
        }, "MyThread"); // 线程名称
        
        // 设置优先级（5-10，提高调度概率）
        thread.setPriority(Thread.NORM_PRIORITY + 1);
        
        // 启动线程
        thread.start();
        System.out.println("子线程状态（启动后）：" + thread.getState());
        
        // 主线程等待子线程执行完毕（join）
        thread.join(500); // 限时等待500ms
        System.out.println("主线程继续执行，子线程是否存活：" + thread.isAlive());
        
        // 中断子线程（此时子线程可能仍在休眠）thread 线程直接抛出异常
        thread.interrupt();
    }
}
```



## 14. 如何停止一个正在运行的线程？

1. 使用共享变量的方式。共享变量可以被多个执行相同任务的线程用来作为是否停止的信号，通知停止线程的执行。
2. 使用interrupt方法终止线程。当一个线程被阻塞，处于不可运行状态时，即使主程序中将该线程的共享变量设置为true，但该线程此时根本无法检查循环标志，当然也就无法立即中断。这时候可以使用Thread提供的interrupt()方法，因为该方法虽然不会中断一个正在运行的线程，但是它可以使一个被阻塞的线程抛出一个中断异常，从而使线程提前结束阻塞状态。



## 15. 线程安全的三个问题：可见性、原子性、有序性

在多线程并发编程中，“线程安全” 的核心是确保多个线程对共享资源的操作不会导致**数据不一致**或**逻辑异常**。而线程安全的三大核心问题 ——**可见性**、**原子性**、**有序性**，本质是 CPU、内存、编译器的底层优化（如缓存、指令重排）与多线程协作之间的矛盾。以下是对三者的详细解析：

#### 一、可见性（Visibility）：一个线程的修改，其他线程能 “看到” 吗？

##### **1. 定义**

可见性指：**当一个线程修改了共享变量的值后，其他线程能立即感知到这个修改**。若缺乏可见性，线程会基于 “过期的缓存数据” 执行操作，导致数据不一致。

##### **2. 问题根源：CPU 缓存与内存的异步**

现代 CPU 为提升性能，会将频繁访问的共享变量加载到**CPU 高速缓存**（L1/L2/L3）中，而非直接操作内存。当线程修改缓存中的变量时，修改会先存在缓存中，并非立即同步到内存；其他线程读取该变量时，会从自己的 CPU 缓存中读取（而非内存），从而无法感知到修改。

##### **3. 示例：可见性问题导致的逻辑错误**

```java
// 共享变量（初始值false）
private static boolean flag = false;

public static void main(String[] args) throws InterruptedException {
    // 线程1：修改flag为true
    new Thread(() -> {
        try {
            Thread.sleep(100); // 确保线程2先启动
        } catch (InterruptedException e) {}
        flag = true; // 修改共享变量
        System.out.println("线程1已将flag设为true");
    }).start();

    // 线程2：循环读取flag，直到为true才退出
    new Thread(() -> {
        while (!flag) { // 线程2可能永远看不到flag的修改，陷入死循环
        }
        System.out.println("线程2感知到flag为true，退出");
    }).start();
}
```

**问题现象**：线程 1 修改`flag`为`true`后，线程 2 可能永远卡在`while`循环中 —— 因为线程 2 的 CPU 缓存中，`flag`始终是初始的`false`，未同步内存中的新值。

##### 4. 解决方案

通过**内存屏障**强制刷新缓存 / 内存，确保修改的可见性：

- 使用 `volatile` 关键字：修饰共享变量，确保线程对变量的修改会立即同步到内存，且其他线程读取时会直接从内存加载（跳过缓存）。
- 使用 `synchronized` 或 `Lock`：同步块执行时，会清空线程的 CPU 缓存，读取变量时从内存加载；执行完后，会将修改同步到内存。

#### 二、原子性（Atomicity）：一个操作，能 “完整执行” 吗？

##### 1. 定义

原子性指：**一个操作（或一组操作）在多线程环境下，要么 “全部执行完”，要么 “完全不执行”，中间不会被其他线程打断**。若缺乏原子性，多个线程对共享变量的 “拆分操作” 会交叉执行，导致数据错误。

##### 2. 问题根源：操作的 “拆分性”

看似简单的代码（如`i++`），在底层会被拆分为**3 个 CPU 指令**：

1. 从内存读取`i`的值到 CPU 缓存（load）；
2. 在 CPU 中对`i`进行加 1（add）；
3. 将加 1 后的值写回内存（store）。

多线程环境下，这 3 个指令会被 “交叉执行”，例如：

- 线程 A 执行 “load i=0” → 线程 B 执行 “load i=0”；
- 线程 A 执行 “add i=1” → 线程 A 执行 “store i=1”；
- 线程 B 执行 “add i=1” → 线程 B 执行 “store i=1”；
- 最终`i`的值为 1（而非预期的 2）。

##### 3. 示例：原子性问题导致的计数错误

```java
// 共享计数器（初始值0）
private static int count = 0;

public static void main(String[] args) throws InterruptedException {
    // 1000个线程，每个线程对count加1000次
    ExecutorService executor = Executors.newFixedThreadPool(1000);
    for (int i = 0; i < 1000; i++) {
        executor.submit(() -> {
            for (int j = 0; j < 1000; j++) {
                count++; // 非原子操作，会交叉执行
            }
        });
    }
    executor.shutdown();
    executor.awaitTermination(1, TimeUnit.SECONDS);
    
    System.out.println("预期count=1000000，实际count=" + count); // 实际值远小于1000000
}
```

**问题现象**：最终`count`的值远小于预期的 1000000，因为多个线程的`count++`操作被拆分后交叉执行，导致 “写覆盖”。

##### 4. 解决方案

确保操作的 “不可拆分性”：

- 使用 `synchronized` 或 `Lock`：通过锁将操作包裹为 “同步块”，同一时间只有一个线程能执行，确保原子性。

- 使用原子类（`java.util.concurrent.atomic`）：如 `AtomicInteger`、`AtomicLong`，底层通过 **CAS****（Compare and Swap）** 指令实现原子操作（CPU 级别的原子性）。

  ```java
  private static AtomicInteger count = new AtomicInteger(0);
  // 替换count++为原子操作
  count.incrementAndGet(); 
  ```

  

#### 三、有序性（Ordering）：代码的执行顺序，会 “打乱” 吗？

##### 1. 定义

有序性指：**程序的执行顺序与代码的编写顺序一致**。若缺乏有序性，编译器或 CPU 为优化性能会对 “无依赖的指令” 进行**指令重排**，导致多线程环境下逻辑异常。

##### 2. 问题根源：编译器 / CPU 的指令重排

为提升执行效率，编译器或 CPU 会对指令的执行顺序进行调整（前提是不影响 “单线程” 的执行结果）。例如：

```java
// 共享变量
private static int a = 0;
private static boolean flag = false;

// 线程1执行
public static void write() {
    a = 1;          // 操作1
    flag = true;    // 操作2
}

// 线程2执行
public static void read() {
    if (flag) {     // 操作3
        System.out.println(a); // 操作4，预期输出1，实际可能输出0
    }
}
```

单线程中，`write()` 的操作 1 和操作 2 顺序固定；但多线程中，编译器可能将操作 1 和操作 2 重排为：

1. `flag = true`（操作 2）；
2. `a = 1`（操作 1）；

此时若线程 2 在 “操作 2 执行后、操作 1 执行前” 读取`flag`，会进入`if`块并打印`a=0`（而非预期的 1）。

##### **3. 解决方法**

禁止关键指令的重排：

- 使用 `volatile` 关键字：修饰共享变量，禁止编译器 / CPU 对 “变量相关的指令” 进行重排（通过内存屏障实现）。
- 使用 `synchronized` 或 `Lock`：同步块内的指令会被视为 “整体”，禁止重排到同步块外。

#### 总结：三大问题与解决方案对比

| 问题   | 核心矛盾              | 典型场景                   | 解决方案                              |
| ------ | --------------------- | -------------------------- | ------------------------------------- |
| 可见性 | CPU 缓存与内存异步    | 线程修改后，其他线程读不到 | `volatile`、`synchronized`、`Lock`    |
| 原子性 | 操作被拆分为多步指令  | `i++`、多线程计数          | 原子类（CAS）、`synchronized`、`Lock` |
| 有序性 | 编译器 / CPU 指令重排 | 单例模式、依赖指令重排     | `volatile`、`synchronized`、`Lock`    |

**关键结论**：

- `volatile` 能解决**可见性和有序性**，但无法解决**原子性**（如`volatile int i; i++`仍非原子）。
- `synchronized`/`Lock` 能同时解决**可见性、原子性、有序性**（但性能开销高于`volatile`）。
- 原子类（如`AtomicInteger`）仅解决**原子性**，需结合`volatile`（部分原子类已内置可见性保证）。



## 16. volatile作用

#### 一、volatile 的核心作用

1. **保证可见性**当一个线程修改了 `volatile` 修饰的变量，其他线程能**立即看到**该修改。
   - 原理：通过内存屏障强制将修改同步到主内存，并使其他线程的本地缓存失效，迫使它们从主内存重新加载最新值（避免 CPU 缓存导致的 “数据过期”）。
2. **保证有序性**禁止编译器和 CPU 对 `volatile` 变量相关的指令进行**指令重排**，确保代码执行顺序与编写顺序一致。
   - 原理：通过内存屏障（如 `StoreStore`、`LoadLoad` 等）阻止指令跨屏障重排，避免多线程下因重排导致的逻辑混乱（如单例模式中的空指针问题）。

#### 二、volatile 的局限性

- **不保证原子性**：例如 `volatile int i; i++` 仍可能线程不安全（`i++` 拆分为读、改、写三步，可能被其他线程打断）。
- 不能替代锁：复杂操作（如多步修改共享变量）仍需 `synchronized` 或 `Lock` 保证原子性。



## 17. synchronized的用法有哪些?

- **修饰普通方法**：作用于当前对象实例，进入同步代码前要获得当前对象实例的锁
- **修饰静态方法**：作用于当前类，进入同步代码前要获得当前类对象的锁，synchronized关键字加到static 静态方法和 synchronized(class)代码块上都是是给 Class 类上锁
- **修饰代码块**：指定加锁对象，对给定对象加锁，进入同步代码库前要获得给定对象的锁

```java
class Main{
    public synchronized void method() {} // 以 this 为锁对象
    public static synchronized void method() {} // 以类对象为锁对象
    synchronized (this) {} // 以 this 为锁对象，等同于同步实例方法的锁
    synchronized (Main.class) {} // 以类对象为锁对象，（等同于同步静态方法的锁）
}
```



## 18. synchronized的作用有哪些？

**原子性**：确保线程互斥的访问同步代码；

**可见性**：保证共享变量的修改能够及时可见；

**有序性**：有效解决重排序问题；



## 19. volatile和synchronized的区别是什么？

- volatile 只能使用在**变量**上；而 synchronized 可以在**方法、代码块**上。
- volatile 保证**可见性和有序性**；synchronized 保证**原子性、可见性和有序性**。
- volatile**禁用**指令重排序；synchronized**也会禁用**（通过内存屏障保证同步块内外指令不交叉重排）。
- volatile**不会**造成阻塞；synchronized**可能**造成阻塞（多线程竞争锁时，未获取锁的线程会阻塞）。



## 20. ReentrantLock和synchronized区别

| 特性             | `synchronized`                      | `ReentrantLock`                               |
| ---------------- | ----------------------------------- | --------------------------------------------- |
| 实现方式         | JVM 内置关键字（隐式锁）            | AQS 框架实现（显式锁）                        |
| 锁获取 / 释放    | 自动                                | 手动（`lock()`/`unlock()`）                   |
| 公平性           | 仅支持非公平锁                      | 支持公平 / 非公平锁（构造器指定）             |
| 高级功能         | 无（不可中断、无超时、单条件）      | 支持中断、超时、多条件变量                    |
| 性能（JDK 1.6+） | 与 `ReentrantLock` 接近，优化更深入 | 略逊于 `synchronized`（非公平锁场景差异极小） |
| 可重入性         | 支持                                | 支持                                          |
| 代码简洁性       | 高（无需手动管理锁）                | 低（需手动释放，否则易死锁）                  |



## 21. 什么是公平锁和非公平锁？

公平锁和非公平锁是针对多线程竞争锁时的**分配规则**而言的，核心区别在于：**是否按照线程请求锁的顺序来分配锁**。

| 特性     | 公平锁                               | 非公平锁                               |
| -------- | ------------------------------------ | -------------------------------------- |
| 分配规则 | 严格按请求顺序（先到先得）           | 允许新线程插队，不保证顺序             |
| 饥饿问题 | 无（所有线程最终都会获得锁）         | 可能存在（等待久的线程可能一直抢不到） |
| 性能     | 较低（频繁切换队列头部线程，开销大） | 较高（减少线程切换，直接抢占更高效）   |
| 适用场景 | 对公平性要求高的场景（如资源调度）   | 追求吞吐量的场景（如普通业务逻辑）     |



## 22. wait()和sleep()的异同点？

`wait()` 和 `sleep()` 都是 Java 中用于暂停线程执行的方法，但两者的设计目的、使用场景和底层机制有显著区别。以下是它们的异同点分析：

#### **一、相同点**

1. **都能暂停线程执行**：两者都会使当前线程进入阻塞状态，暂时让出 CPU 资源。
2. **都可响应中断**：若线程在 `wait()` 或 `sleep()` 期间被其他线程中断（调用 `interrupt()`），都会抛出 `InterruptedException` 异常。

#### **二、不同点（核心区别）**

| 对比维度       | `wait()`                                                     | `sleep(long millis)`                                   |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| **所属类**     | 定义在 `Object` 类中（所有对象都可调用）                     | 定义在 `Thread` 类中（静态方法）                       |
| **使用前提**   | 必须在 **同步块 / 同步方法** 中使用（需持有锁对象的锁），否则抛 `IllegalMonitorStateException`。 | 无需持有锁，可在任意地方调用。                         |
| **释放锁资源** | 会**主动释放当前持有的锁**，让其他线程有机会获取锁。         | **不会释放锁**（若持有锁，其他线程仍无法获取）。       |
| **唤醒方式**   | 需通过其他线程调用**同一锁对象**的 `notify()` 或 `notifyAll()` 唤醒；或等待超时后自动唤醒。 | 仅能通过 **超时时间到** 自动唤醒；或被中断唤醒。       |
| **用途**       | 用于**线程间协作**（如生产者 - 消费者模型），等待某个条件满足后再继续执行。 | 用于**暂停线程指定时间**（如模拟延迟、控制执行节奏）。 |
| **参数**       | 可指定超时时间（毫秒），也可无参（无限等待，直到被唤醒）。   | 必须指定超时时间（毫秒），时间到后自动恢复。           |
| **进入的状态** | 使线程进入 **WAITING**（无参）或 **TIMED_WAITING**（有参）状态。 | 使线程进入 **TIMED_WAITING** 状态。                    |



## 23. notify、notifyAll 区别？

`notify()` 和 `notifyAll()` 都是 `Object` 类中用于唤醒唤醒等待线程 ** 的方法，必须在同步块 / 同步方法中使用（需持有锁对象的锁），核心区别在于唤醒线程的范围及线程状态流转不同。以下是包含线程状态的详细对比：

#### 1. `notify()`

- **作用**：从当前锁对象的**等待队列**中，**随机唤醒一个正在等待（调用 `wait()` 后处于 `WAITING` 或 `TIMED_WAITING` 状态）的线程**。

- **线程状态流转**：被唤醒的线程从 `WAITING`/`TIMED_WAITING` 状态转变为 `BLOCKED` 状态（因为需要等待当前线程释放锁）。

  当当前线程释放锁后，该线程会与其他可能竞争锁的线程（处于 `BLOCKED` 状态）共同竞争锁：

  - 若竞争成功，进入 `RUNNABLE` 状态，继续执行 `wait()` 之后的代码；
  - 若竞争失败，保持 `BLOCKED` 状态，等待下一次锁释放。

- **特点**：仅唤醒一个线程，具体唤醒哪一个由 JVM 调度策略决定（通常是等待队列中优先级较高或等待时间较长的线程，但不做明确保证）。

#### 2. `notifyAll()`

- **作用**：唤醒当前锁对象的**等待队列中所有正在等待（调用 `wait()` 后处于 `WAITING` 或 `TIMED_WAITING` 状态）的线程**。
- **线程状态流转**：所有被唤醒的线程从 `WAITING`/`TIMED_WAITING` 状态转变为 `BLOCKED` 状态（等待当前线程释放锁）。当当前线程释放锁后，所有被唤醒的线程会共同竞争这把锁：
  - 其中一个线程竞争成功，进入 `RUNNABLE` 状态，继续执行 `wait()` 之后的代码；
  - 其余未竞争到锁的线程，保持 `BLOCKED` 状态，等待下一次锁释放。
- **特点**：唤醒所有等待线程，触发批量状态转换，最终只有一个线程能获取锁执行，其余继续阻塞。



## 24. Runnable和Callable有什么区别？

- Callable接口方法是`call()`，Runnable的方法是`run()`；
- Callable接口call方法有返回值，支持泛型，Runnable接口run方法无返回值。
- Callable接口`call()`方法允许抛出异常；而Runnable接口`run()`方法不能继续上抛异常。



## 25. 线程执行顺序怎么控制？

在多线程编程中，默认情况下线程的执行顺序由 CPU 调度算法决定，是不确定的。但可以通过特定机制**主动控制线程的执行顺序**，常用方法如下：

#### 一、使用 `join()` 方法（等待线程完成）

`Thread.join()` 可以让当前线程**等待目标线程执行完毕后再继续执行**，本质是通过 `wait()` 实现线程间的等待通知机制。

```java
public class ThreadOrderWithJoin {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> System.out.println("线程1执行"), "t1");
        Thread t2 = new Thread(() -> System.out.println("线程2执行"), "t2");
        Thread t3 = new Thread(() -> System.out.println("线程3执行"), "t3");

        // 控制顺序：t1 → t2 → t3
        t1.start();
        t1.join(); // 主线程等待t1执行完毕

        t2.start();
        t2.join(); // 主线程等待t2执行完毕

        t3.start();
        t3.join();
    }
}
```

#### 二、使用 `synchronized` + 标志位（基于锁的顺序控制）

通过共享锁对象和标志位，让线程按预设条件依次获取锁执行。

**示例：按顺序打印 A→B→C**

```java
public class ThreadOrderWithLock {
    // 共享锁对象
    private static final Object lock = new Object();
    // 标志位：控制当前该哪个线程执行（1: t1，2: t2，3: t3）
    private static int flag = 1;

    public static void main(String[] args) {
        // 线程1：打印A，完成后将标志位设为2
        Thread t1 = new Thread(() -> {
            synchronized (lock) {
                try {
                    // 若标志位不是1，等待
                    while (flag != 1) {
                        lock.wait();
                    }
                    System.out.println("A");
                    flag = 2; // 切换到线程2
                    lock.notifyAll(); // 唤醒其他等待线程
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        // 线程2：打印B，完成后将标志位设为3
        Thread t2 = new Thread(() -> {
            synchronized (lock) {
                try {
                    while (flag != 2) {
                        lock.wait();
                    }
                    System.out.println("B");
                    flag = 3; // 切换到线程3
                    lock.notifyAll();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        // 线程3：打印C，完成后将标志位设为1（可选）
        Thread t3 = new Thread(() -> {
            synchronized (lock) {
                try {
                    while (flag != 3) {
                        lock.wait();
                    }
                    System.out.println("C");
                    lock.notifyAll();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        // 启动顺序不影响执行顺序（由标志位控制）
        t3.start();
        t1.start();
        t2.start();
    }
}
```

**原理**：线程启动后先检查标志位，不满足则 `wait()` 释放锁；满足条件则执行，完成后更新标志位并 `notifyAll()` 唤醒其他线程，实现顺序控制。

#### 三、使用 `Lock` + `Condition`（更灵活的条件等待）

`ReentrantLock` 配合 `Condition` 可以实现更精细的线程间通信，每个条件对应一个等待队列，避免 `notifyAll()` 导致的无效唤醒。

**示例：按顺序执行线程**

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ThreadOrderWithCondition {
    private static final ReentrantLock lock = new ReentrantLock();
    // 三个条件对象，分别对应三个线程的等待队列
    private static final Condition c1 = lock.newCondition();
    private static final Condition c2 = lock.newCondition();
    private static final Condition c3 = lock.newCondition();
    private static int flag = 1;

    public static void main(String[] args) {
        // 线程1：执行后唤醒线程2
        Thread t1 = new Thread(() -> {
            lock.lock();
            try {
                while (flag != 1) {
                    c1.await(); // 线程1在c1条件队列等待
                }
                System.out.println("线程1执行");
                flag = 2;
                c2.signal(); // 唤醒线程2（在c2条件队列）
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        });

        // 线程2：执行后唤醒线程3
        Thread t2 = new Thread(() -> {
            lock.lock();
            try {
                while (flag != 2) {
                    c2.await(); // 线程2在c2条件队列等待
                }
                System.out.println("线程2执行");
                flag = 3;
                c3.signal(); // 唤醒线程3
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        });

        // 线程3：执行后结束
        Thread t3 = new Thread(() -> {
            lock.lock();
            try {
                while (flag != 3) {
                    c3.await(); // 线程3在c3条件队列等待
                }
                System.out.println("线程3执行");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        });

        t1.start();
        t2.start();
        t3.start();
    }
}
```

**原理**：每个线程在自己的 `Condition` 队列中等待，执行完成后通过 `signal()` 精准唤醒下一个线程的条件队列，效率高于 `synchronized` + `notifyAll()`。



## 26. 守护线程是什么？

在多线程编程中，守护线程（Daemon Thread）是一种特殊类型的线程，其主要作用是为其他线程（通常称为 “用户线程”）提供服务支持，比如垃圾回收线程、日志记录线程等。

守护线程的核心特性如下：

1. **生命周期依赖于用户线程**：当所有用户线程执行完毕后，无论守护线程是否还在运行，JVM 都会自动终止守护线程并退出程序。反之，只要还有用户线程在运行，守护线程就会一直工作。
2. **默认非守护线程**：线程创建时默认是用户线程（非守护线程），需通过 `setDaemon(true)` 方法将其设置为守护线程（注意：该方法必须在线程启动 `start()` 前调用，否则会抛出异常）。
3. **服务性角色**：通常用于执行后台任务，如监控、清理资源等，不适合执行关键业务逻辑（因为可能被强制终止，导致任务未完成）。



## 27. 线程间通信方式？

#### 1. **共享内存（Shared Memory）**

多个线程通过访问**共享变量**实现通信，这是最基础的方式，但需要同步机制避免数据竞争。

- **实现**：线程读写同一个全局变量或共享对象的属性。
- **注意**：必须配合锁（如`synchronized`、`Lock`）或原子类（如`AtomicInteger`）保证线程安全。

```java
class SharedData {
    int count = 0;
    synchronized void increment() { count++; } // 同步方法保证原子性
}
// 线程1和线程2共享同一个SharedData实例，通过count变量通信
```

也可以使用 **volatile** 关键字。基于volatile关键字实现线程间相互通信，其底层使用了共享内存。简单来说，就是多个线程同时监听一个变量，当这个变量发生变化的时候 ，线程能够感知并执行相应的业务。（不保证原子性）

#### 2. **等待 / 通知机制（Wait/Notify）**

基于**对象监视器（Monitor）** 实现线程间的协作，常用于线程间的 “条件触发”（如生产者 - 消费者模型）。

- **核心方法**（Java 中`Object`类的方法）：
  - `wait()`：让当前线程释放锁并进入等待状态，直到被其他线程通知。
  - `notify()`/`notifyAll()`：唤醒当前对象上等待的一个或所有线程。

- **特点**：必须在`synchronized`代码块中使用，确保线程安全。
- **示例场景**：生产者生产数据后通知消费者，消费者消费完再通知生产者。



## 28. ThreadLocal是什么

`ThreadLocal` 是 Java 中的一个线程本地存储工具类，它的核心作用是**为每个线程提供独立的变量副本**，从而避免多线程对共享变量的竞争，实现线程间的数据隔离。

#### 核心原理

`ThreadLocal` 内部维护了一个与线程绑定的映射关系：每个线程（`Thread` 对象）都有一个专属的 `ThreadLocalMap`（类似哈希表），其中的键是 `ThreadLocal` 实例，值是该线程对应的变量副本。

- 当线程通过 `ThreadLocal.set(value)` 存值时，实际上是向当前线程的 `ThreadLocalMap` 中添加一条记录（键为当前 `ThreadLocal`，值为目标变量）。
- 当线程通过 `ThreadLocal.get()` 取值时，是从当前线程的 `ThreadLocalMap` 中获取对应的值。
- 因此，不同线程操作同一个 `ThreadLocal` 时，操作的是各自线程内的变量副本，互不干扰。

#### 典型用法

```java
// 定义 ThreadLocal 实例（通常为 static 变量）
private static ThreadLocal<Integer> threadLocal = new ThreadLocal<>();

public static void main(String[] args) {
    // 线程1设置并获取值
    new Thread(() -> {
        threadLocal.set(100);
        System.out.println(Thread.currentThread().getName() + ": " + threadLocal.get()); // 100
    }, "线程1").start();

    // 线程2设置并获取值
    new Thread(() -> {
        threadLocal.set(200);
        System.out.println(Thread.currentThread().getName() + ": " + threadLocal.get()); // 200
    }, "线程2").start();
}
```



## 29. 为什么要使用ThreadLocal？

使用 `ThreadLocal` 的核心目的是**实现线程间的数据隔离**，从而简化多线程编程中的数据管理，解决特定场景下的线程安全问题或代码冗余问题。具体来说，它的价值体现在以下几个方面：

#### 1. **避免线程安全问题，替代同步锁**

对于**非线程安全的工具类**（如 `SimpleDateFormat`、`Random`），多线程共享时需要加锁（如 `synchronized`）才能保证安全，但锁会导致性能损耗（线程阻塞）。`ThreadLocal` 为每个线程分配独立的实例，线程间无需竞争，既保证了安全，又避免了锁的开销。

```Java
// 非线程安全的 SimpleDateFormat，直接共享会出问题
// 使用 ThreadLocal 为每个线程分配独立实例
private static ThreadLocal<SimpleDateFormat> sdf = ThreadLocal.withInitial(
    () -> new SimpleDateFormat("yyyy-MM-dd")
);

// 线程中直接使用，无需同步
String date = sdf.get().format(new Date());
```

#### 2. **简化线程上下文传递**

在多层调用（如 Web 开发的 Controller→Service→DAO 调用链）中，若需要传递上下文信息（如用户登录信息、日志追踪 ID、数据库事务连接），传统方式是通过**方法参数层层传递**，代码冗余且易出错。`ThreadLocal` 可将上下文数据绑定到当前线程，在调用链的任意位置直接获取，无需显式传递参数。



## 30. Thread和ThreadLocal有什么联系呢？

`Thread` 和 `ThreadLocal` 是 Java 多线程编程中紧密关联的两个类，它们的联系体现在 **`ThreadLocal` 依赖 `Thread` 的内部结构实现线程本地存储**，具体可以从以下几个角度理解：

#### 1. **`Thread` 是 `ThreadLocal` 的 “载体”**

`Thread` 类内部维护了一个名为 `threadLocals` 的成员变量（类型为 `ThreadLocal.ThreadLocalMap`），这是一个类似哈希表的数据结构，专门用于存储当前线程通过 `ThreadLocal` 设置的**线程私有变量副本**。

```java
public class Thread implements Runnable {
    // 每个线程独有的 ThreadLocalMap，用于存储 ThreadLocal 变量
    ThreadLocal.ThreadLocalMap threadLocals = null;
    // ... 其他代码
}
```

- 当我们通过 `ThreadLocal.set(value)` 存值时，本质是向当前线程（`Thread.currentThread()`）的 `threadLocals` 中添加一条记录（键为当前 `ThreadLocal` 实例，值为变量副本）。
- 当通过 `ThreadLocal.get()` 取值时，是从当前线程的 `threadLocals` 中查询对应的值。

#### 2. **`ThreadLocal` 是操作 `Thread` 内部变量的 “工具”**

`ThreadLocal` 本身并不存储数据，它更像一个 “工具类”，提供了操作线程内部 `threadLocals` 的方法（`set`、`get`、`remove` 等）。

- `ThreadLocal.set(value)`：获取当前线程的 `threadLocals`，若为 `null` 则初始化，然后以当前 `ThreadLocal` 为键，`value` 为值存入 `threadLocals`。
- `ThreadLocal.get()`：获取当前线程的 `threadLocals`，以当前 `ThreadLocal` 为键查询对应的值，若不存在则通过 `initialValue()` 初始化。
- `ThreadLocal.remove()`：从当前线程的 `threadLocals` 中移除当前 `ThreadLocal` 对应的键值对。

#### 3. **二者配合实现 “线程隔离”**

`Thread` 的 `threadLocals` 是线程私有的（每个线程有独立的 `threadLocals`），而 `ThreadLocal` 提供了统一的接口来操作这个私有变量，因此：

- 不同线程操作同一个 `ThreadLocal` 实例时，实际操作的是各自线程的 `threadLocals`，互不干扰。
- 线程结束后，其 `threadLocals` 会被回收（若线程正常销毁），避免内存泄漏（但线程池中的线程复用可能导致残留，需手动 `remove`）。

#### 总结关系

- **`Thread` 提供存储容器**：每个线程的 `threadLocals` 是线程本地变量的 “仓库”。
- **`ThreadLocal` 提供操作接口**：通过 `ThreadLocal` 的方法，线程可以安全地向自己的 “仓库” 中存 / 取数据。
- **核心目标**：二者配合实现 “线程私有变量” 的存储和访问，本质是 `ThreadLocal` 利用 `Thread` 的内部结构完成线程隔离。

简单说：`Thread` 是 “容器”，`ThreadLocal` 是 “钥匙”，每个线程用自己的 “钥匙” 操作自己的 “容器”，实现数据隔离。



## 31. ThreadLocal使用场景有哪些？

#### **线程上下文存储**

- **场景描述**：在多层调用（如分布式系统、多层服务调用）中，需要传递上下文信息（如用户身份、请求 ID、日志追踪 ID 等），但不想通过方法参数逐层传递。
- 示例
  - 日志追踪：将全局唯一的 `traceId` 存入 ThreadLocal，在整个请求链路的日志中统一打印，便于问题排查。
  - 用户身份信息：在用户登录后，将用户信息存入 ThreadLocal，后续各层代码可直接获取，无需每层方法显式传参。



## 32. ReentrantLock 是如何实现可重入性的?

ReentrantLock 的可重入性（即同一线程可以多次获取同一把锁而不会产生死锁）

ReentrantLock 的可重入性本质是：

- 通过 `state` 记录同一线程的重入次数，每次重入递增 `state`，每次释放递减 `state`。
- 通过 `exclusiveOwnerThread` 确保只有当前持有锁的线程才能重入，避免其他线程干扰。

当 `state` 减为 0 时，锁才真正被释放，其他线程可尝试获取。这种机制既保证了重入性，又避免了同一线程重复获取锁时的死锁问题。



## 33. `共享式`与`独占式`锁？

在 Java 并发编程中，共享式锁（Shared Lock）和独占式锁（Exclusive Lock）是两种基于 AQS（AbstractQueuedSynchronizer）实现的同步模式，核心区别在于**同一时刻是否允许多个线程持有锁**。

#### 独占式锁（Exclusive Lock）

- **定义**：同一时刻**只允许一个线程**获取锁，其他线程必须等待该线程释放锁后才能尝试获取。

- **核心特征**：
  - 锁的持有具有排他性，线程间竞争锁时 “互斥”。
  - 典型实现：`ReentrantLock`（默认独占模式）、`Synchronized` 隐式锁。

#### 共享式锁（Shared Lock）

- **定义**：同一时刻**允许多个线程**同时持有锁（具体数量由同步逻辑决定），线程间不互斥。
- **核心特征**：
  - 锁可被多个线程共享，适用于 “读多写少” 等场景（如允许多个读线程同时访问，仅限制写线程）。
  - 典型实现：`Semaphore`（信号量，允许指定数量的线程同时获取许可）、`CountDownLatch`（倒计时器，等待所有线程完成后唤醒）、`ReentrantReadWriteLock.ReadLock`（读锁，共享模式）。

#### 混合模式的典型案例

- **读锁（ReadLock）**：共享模式，多个读线程可同时持有，不阻塞其他读线程。
- **写锁（WriteLock）**：独占模式，仅允许一个写线程持有，且会阻塞所有读线程和其他写线程。



## 34. 悲观锁与乐观锁

悲观锁（Pessimistic Lock）和乐观锁（Optimistic Lock）是并发编程中两种对立的锁设计思想，核心区别在于**对 “并发冲突” 的假设和处理方式**。

#### 1. 悲观锁（Pessimistic Lock）

- **核心思想**：认为并发场景中冲突一定会发生，因此在操作共享资源前，必须先获取锁，确保同一时刻只有一个线程能操作资源，从根源上避免冲突。

- **实现方式**
  - 数据库层面：如 MySQL 的 `SELECT ... FOR UPDATE`（行锁）、`LOCK TABLES`（表锁）。
  - Java 层面：`synchronized` 关键字、`ReentrantLock` 等独占锁。

#### 2. 乐观锁（Optimistic Lock）

- **核心思想**：认为并发场景中冲突很少发生，因此操作资源时不预先加锁，而是在提交修改时检查资源是否被其他线程修改过，若未被修改则成功提交，否则重试或放弃。

- **实现方式**
  - **版本号机制**：为数据添加版本字段（如 `version`），更新时检查版本号是否匹配（如 `UPDATE ... WHERE id = ? AND version = ?`），成功则递增版本号。
  - **CAS 操作**：Java 中的 `AtomicInteger` 等原子类，通过 CPU 指令（如 `cmpxchg`）实现 “比较并交换”，原子性地完成值的更新。

#### 3. 核心区别对比

| **维度**   | **悲观锁**                          | **乐观锁**               |
| ---------- | ----------------------------------- | ------------------------ |
| 冲突假设   | 认为冲突一定会发生                  | 认为冲突很少发生         |
| 实现方式   | 加锁阻塞（如 `synchronized`、行锁） | 版本号 / CAS（无锁阻塞） |
| 并发效率   | 低（阻塞开销大）                    | 高（无锁竞争）           |
| 适用场景   | 写操作多、冲突频繁                  | 读操作多、冲突少         |
| 一致性保证 | 强（直接阻止冲突）                  | 最终一致（冲突时重试）   |



## 35. 乐观锁有什么问题?

乐观锁虽然在并发效率上有优势，但也存在一些固有的问题和局限性，主要体现在以下几个方面：

#### 1. **ABA 问题**

- **问题描述**：当一个线程读取数据后，另一个线程将数据从 `A` 改为 `B`，随后又改回 `A`。此时第一个线程使用 CAS 检查时，会认为数据未被修改（仍为 `A`），从而错误地执行更新。
- **举例**：线程 1 读取值为 `10`，线程 2 将其改为 `20` 后又改回 `10`，线程 1 的 CAS 操作会误认为值未变而成功更新，但若中间的 `20` 状态对业务有影响（如金额变动），则会导致逻辑错误。
- **解决方案**：引入**版本号**（如在 CAS 中同时检查值和版本号）或**时间戳**，确保数据的修改轨迹可追溯，避免仅通过值判断是否被修改。

#### 2. **自旋开销问题**（循环重试）

- **问题描述**：乐观锁（如 CAS）在冲突发生时，通常会通过 “自旋”（循环重试）等待资源可用。若并发冲突频繁，线程会持续自旋而不释放 CPU，导致大量 CPU 资源浪费，甚至可能引发 “活锁”（线程反复重试却始终失败）。
- **举例**：高并发场景下，大量线程同时竞争一个 CAS 变量，大部分线程会在循环中不断检查和重试，导致 CPU 使用率飙升。
- 解决方案
  - 限制自旋次数（如 JUC 中的 `LockSupport.parkNanos` 让线程短暂休眠）。
  - 结合阻塞机制（如 AQS 中的队列，冲突时进入队列等待而非自旋）。



## 36. 什么是CAS？

CAS（Compare And Swap，比较并交换）是一种**无锁原子操作**，是乐观锁的核心实现机制，用于在多线程环境下保证对共享变量操作的原子性。

#### CAS 的核心逻辑

CAS 操作包含三个关键参数：

- **内存地址（V）**：存储共享变量的内存位置。
- **预期值（A）**：线程读取到的变量当前值（操作前的旧值）。
- **新值（B）**：线程希望将变量更新为的新值。

#### **执行逻辑**：

当且仅当内存地址 `V` 中的实际值等于预期值 `A` 时，才将 `V` 中的值更新为 `B`；否则不做任何操作。整个过程是**原子性**的（由 CPU 指令保证，不可中断）。



## 37. CAS 三大问题？

1. **ABA问题**。CAS需要在操作值的时候检查内存值是否发生变化，没有发生变化才会更新内存值。但是如果内存值原来是A，后来变成了B，然后又变成了A，那么CAS进行检查时会发现值没有发生变化，但是实际上是有变化的。ABA问题的解决思路就是在变量前面添加版本号，每次变量更新的时候都把版本号加一，这样变化过程就从`A－B－A`变成了`1A－2B－3A`。

   JDK从1.5开始提供了AtomicStampedReference类来解决ABA问题，原子更新带有版本号的引用类型。

2. **循环时间长开销大**。CAS操作如果长时间不成功，会导致其一直自旋（重试），给CPU带来非常大的开销。

3. **只能保证一个共享变量的原子操作**。对一个共享变量执行操作时，CAS能够保证原子操作，但是对多个共享变量操作时，CAS是无法保证操作的原子性的



## 38. 什么是Future？

在 Java 并发编程中，`Future` 是一个接口（位于 `java.util.concurrent` 包下），用于**表示异步计算的结果**。它提供了一种在任务完成后获取结果、取消任务、判断任务状态的机制，是处理 “异步任务” 的核心工具之一。

#### 为什么需要 Future？

在多线程场景中，若一个线程需要等待另一个线程的计算结果，传统方式（如 `Thread.join()`）会导致当前线程阻塞，无法执行其他任务。而 `Future` 允许线程发起异步任务后继续执行其他操作，待需要结果时再获取，从而提高并发效率。

#### Future 的核心作用

- **获取异步结果**：任务完成后，通过 `get()` 方法获取计算结果。
- **判断任务状态**：通过 `isDone()` 判断任务是否已完成，`isCancelled()` 判断任务是否被取消。
- **取消任务**：通过 `cancel(boolean mayInterruptIfRunning)` 尝试取消任务（若任务未开始则取消，若已运行则根据参数决定是否中断）。



## 39. 什么是死锁、活锁、饥饿、无锁、自旋锁？

| 概念   | 核心状态 / 机制                        | 典型场景 / 问题                                              |
| ------ | -------------------------------------- | ------------------------------------------------------------ |
| 死锁   | 线程相互持有对方所需资源，永久阻塞     | 多线程按不同顺序获取多把锁（如 A 持锁 1 等锁 2，B 持锁 2 等锁 1） |
| 活锁   | 线程未阻塞，持续重试却陷入无效循环     | 过度 “谦让” 导致同步冲突（如两线程拿锁后发现缺锁，释放重试反复循环） |
| 饥饿   | 线程长期无法获取资源，始终无法执行     | 高优先级线程持续抢占资源，低优先级线程永无执行机会           |
| 无锁   | 基于 CAS 等原子操作，无锁竞争、无阻塞  | 低冲突场景的高效并发（如 AtomicInteger 自增、并发队列）      |
| 自旋锁 | 拿不到锁时循环等待，不阻塞（仅占 CPU） | 锁持有时间短的场景（如 JUC 锁的非公平模式自旋）              |



## 40. Java 中用到了什么线程调度算法?

Java 中的线程调度算法主要依赖于**操作系统的线程调度机制**,但 Java 虚拟机(JVM)也提供了一些线程管理特性。

#### 主要调度算法

- **抢占式调度(Preemptive Scheduling)**
  - **优先级调度**:Java 线程有优先级(1-10),理论上高优先级线程优先获得 CPU 时间
  - **时间片轮转**:同优先级的线程通过时间片轮转来分配 CPU
  - 操作系统可以在任何时候中断正在运行的线程,切换到其他线程
- **协同式调度(Cooperative Scheduling)**
  - 早期的一些 JVM 实现使用过
  - 线程需要主动让出 CPU(通过 `yield()` 等)
  - 现代 Java 已不再使用这种方式作为主要调度机制



## 41. 为什么 wait/notify/notifyAll这些方法不在thread类里面?

`wait()/notify()/notifyAll()` 是 **“基于对象锁的线程协作机制”**，必须与具体的锁对象绑定。由于 Java 中 “锁属于对象”，因此这些方法自然应该定义在 `Object` 类中，让每个对象都能作为线程间通信的 “信号量”。

简单说：锁属于对象，所以操作锁的方法也属于对象。
