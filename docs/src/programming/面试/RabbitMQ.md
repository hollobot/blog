# RabbitMQ常见面试题总结



## 1. 什么是RabbitMQ？

**基于 AMQP 的开源消息中间件，Erlang 开发，核心作用是异步解耦、削峰填谷**；

**AMQP 是什么？**

- AMQP 的全称是 **Advanced Message Queuing Protocol（高级消息队列协议）**，是一个**开放、标准化的应用层协议**，专门为分布式系统中的**异步消息通信**设计，核心目标是**定义消息的格式和传递规则**，让不同语言、不同平台的应用程序，都能基于这个协议和消息中间件（如 RabbitMQ）进行统一的消息交互，实现 “跨语言、跨平台的消息通信标准化”。
- 简单来说：AMQP 是**消息通信的 “通用语言”** —— 就像全世界的人交流用英语，不同技术栈的系统和 MQ 交互就用 AMQP。

**异步解耦、削峰填谷 是什么？**

- 异步解耦
  - **异步**：相对**同步**而言，指生产者发送消息后，**无需等待消费者处理完成**，直接返回结果，后续业务由消费者异步执行；
  - **解耦**：指将原本耦合的多个系统 / 模块，通过 MQ 作为中间层，**解除直接的代码调用依赖**，每个系统只和 MQ 交互，互不直接关联。
  - 简单说：**异步是解决 “等待耗时” 问题，解耦是解决 “代码依赖” 问题**，RabbitMQ 把两个问题一起解决了。

- 削峰填谷
  - **削峰**：指将**突发的高并发请求 / 消息**，通过 MQ 暂存起来，避免直接冲击下游的数据库 / 业务系统，把 “尖峰” 的流量削平；
  - **填谷**：指下游系统按照**自身的处理能力**，匀速地从 MQ 中拉取消息进行处理，把削平的流量 “平稳填充” 到后续的处理流程中。
  - 核心解决的问题：**下游系统处理能力有限，无法承接突发的高流量**（比如秒杀、双十一、活动推广），本质是**流量的 “削峰” 和 “错峰**



## 2. RabbitMQ的组件有哪些？

**核心流转**：生产者→Channel→Exchange→Binding→Queue→Channel→消费者

**核心组件（按流转 + 核心属性，附核心作用）**

1. **生产者 / 消费者**：发 / 收消息，生产端只对接 Exchange，消费端只监听 Queue
2. **Connection**：客户端与 MQ 的 TCP 长连接，重量级，不频繁创建 / 销毁
3. **Channel**：Connection 上的轻量级虚拟连接，所有操作（发消息 / 声明队列）的实际载体，**线程不安全，单线程用一个**
4. **Exchange（交换机）**：消息路由中心，**不存储消息**，按路由键 + 绑定规则转发，核心是指定类型
5. **Binding（绑定）**：连接 Exchange 和 Queue，携带路由键，定义路由规则
6. **Queue（队列）**：MQ**唯一存储消息**的组件，支持持久化 / 限流 / 死信，消费者从这里取消息
7. **Routing Key（路由键）**：消息路由标识，匹配规则由交换机类型决定
8. **VHost（虚拟主机）**：逻辑隔离单元，实现多租户，不同业务独立分配，有专属组件 / 权限

**高频必记考点**

- Channel：复用 Connection 降低 TCP 资源消耗，**面试最高频追问**
- Exchange：无匹配队列则默认丢消息，不存储
- Queue：持久化是消息不丢失的基础，唯一存储组件
- VHost：生产环境一个业务 / 微服务对应一个

**速答话术（面试直接说）**

RabbitMQ 核心组件有生产者、消费者、Connection/Channel、Exchange、Binding、Queue、VHost 和路由键。核心是 Channel 做轻量级通信，Exchange 负责路由不存消息，Queue 是唯一存消息的地方，VHost 做多租户隔离，消息从生产者经 Channel 到 Exchange，按路由键和绑定规则转发到 Queue，最后消费者从 Queue 取消息。



## 3. 什么时候用 MQ？

核心围绕**异步解耦、削峰填谷、发布订阅**3 大核心场景，每个场景都做**无 MQ 的痛点**+**用 MQ 的优化**+**核心差异**，案例贴合电商 / 日志 / 秒杀等面试高频业务，细节足够落地，答面试直接套用即可。

#### 一、异步解耦场景｜电商下单业务（最经典，面试必举）

**业务背景**

电商下单核心流程：订单创建→扣减库存→新增用户积分→推送下单短信→创建物流单，5 个步骤联动。

**🔴 无 MQ（同步耦合）**

- 执行逻辑：订单系统**同步串行调用**库存、积分、短信、物流系统的接口，**所有接口调用成功，才返回用户 “下单成功”**。
- 核心痛点：
  1. 耗时久：每个接口调用耗时 50ms，总耗时 = 50*4=200ms + 订单创建耗时，用户等待久、体验差；
  2. 强耦合：订单系统代码硬编码其他 4 个系统的接口地址，积分系统改接口、物流系统升级，订单系统必须**改代码 + 重新部署**；
  3. 一损俱损：短信系统接口超时 / 故障，整个下单流程直接失败，用户下单失败，影响转化；
  4. 资源浪费：订单系统线程需等待下游接口响应，大量线程阻塞，服务器资源利用率低。

**🟢 用 RabbitMQ（异步解耦）**

- 执行逻辑：订单系统完成**核心业务（创建订单 + 扣减库存）**后，将订单信息封装成消息，发送到 RabbitMQ 的 Topic 交换机，然后立即返回用户 “下单成功”；库存 / 积分 / 短信 / 物流系统作为消费者，各自监听交换机绑定的队列，异步并行消费消息完成自身业务。
- 核心优化：
  1. 耗时极短：用户仅等待 “订单创建 + 扣减库存” 的耗时（约 60ms），大幅提升体验；
  2. 完全解耦：订单系统仅和 MQ 交互，无需关注下游系统的实现、部署状态，下游系统修改 / 升级 / 下线，订单系统**无任何改动**；
  3. 故障隔离：短信系统故障，消息暂存 MQ，待恢复后继续消费，不影响核心下单流程，避免 “非核心服务故障导致核心服务不可用”；
  4. 并行处理：积分、短信、物流系统同时消费消息，业务处理效率提升 3-4 倍。



#### 二、削峰填谷场景｜电商秒杀 / 618 大促（高频考点）

**业务背景**

秒杀活动：瞬间涌入**10 万次下单请求**，但订单系统的数据库每秒仅能处理**1000 次写请求**，属于典型的 “突发高流量 VS 下游处理能力不足”。

**🔴 无 MQ（直面高流量）**

- 执行逻辑：所有秒杀请求直接打到订单系统，订单系统直接操作数据库完成下单。
- 核心痛点：
  1. 数据库被压垮：10 万请求瞬间涌入，数据库连接池打满、磁盘 IO 飙升，直接宕机，甚至导致整个系统瘫痪；
  2. 服务雪崩：数据库宕机后，订单系统大量请求超时，引发上游网关、前端的重试风暴，进一步压垮整个分布式链路；
  3. 体验极差：用户点击秒杀后，页面长时间加载、提示 “系统繁忙”，甚至直接报错。

**🟢 用 RabbitMQ（缓冲流量）**

- 执行逻辑：所有秒杀请求**先进入 RabbitMQ 队列**，MQ 快速承接 10 万条请求消息并持久化；订单系统作为消费者，通过`basic.qos`设置**每秒仅拉取 1000 条消息**，按数据库的处理能力**匀速消费**并写入数据库，超出处理能力的请求暂存 MQ 队列。
- 核心优化：
  1. 保护下游：MQ 作为 “流量缓冲池”，将突发的尖峰流量削平，数据库始终按自身能力处理请求，不会被压垮；
  2. 服务稳定：即使请求堆积，也仅在 MQ 中，核心的订单、数据库服务保持可用，避免服务雪崩；
  3. 有序处理：消息按请求顺序入队、消费，避免请求乱序导致的库存超卖、重复下单问题。



#### 三、发布订阅场景｜系统日志收集（易理解，面试易答）

**业务背景**

后端系统产生运行日志（如错误日志、访问日志），需要完成 3 个动作：实时监控告警（出现错误日志立即发告警）、日志持久化存储（存到 Elasticsearch 供查询）、日志统计分析（统计访问量 / 错误率）。

**🔴 无 MQ（单生产者多同步调用）**

- 执行逻辑：日志系统**同步调用**监控系统、存储系统、分析系统的接口，同一份日志数据分 3 次发送。
- 核心痛点：
  1. 日志发送效率低：串行调用 3 个接口，日志产生后无法立即完成多端同步，监控告警有延迟；
  2. 代码冗余：日志系统需要编写 3 套接口调用代码，后续新增日志处理端（如审计系统），需再次改代码、部署；
  3. 资源重复消耗：同一份日志数据在网络中传输 3 次，占用带宽和服务器资源。

**🟢 用 RabbitMQ（广播式发布订阅）**

- 执行逻辑：日志系统将日志消息发送到 RabbitMQ 的**Fanout 交换机（广播交换机）**，监控、存储、分析系统各自创建队列并绑定到该交换机，**交换机将消息广播到所有绑定的队列**，三个系统同时获取同一份日志消息，各自处理。
- 核心优化：
  1. 效率提升：日志系统仅发送 1 次消息，多端同时接收，无延迟，监控告警实时性拉满；
  2. 易扩展：新增审计系统时，仅需创建队列并绑定到 Fanout 交换机，**日志系统无任何改动**，实现 “无侵入式扩展”；
  3. 节省资源：同一份日志仅传输 1 次，大幅降低网络和服务器资源消耗。



## 4. RabbitMQ 优缺点？

#### 一、核心优点（RabbitMQ 的核心竞争力，适配电商 / 金融等场景）

1. **可靠性极强**：支持**消息 / 队列 / 交换机的持久化**、消息确认机制；
2. **功能灵活、路由强大**：4 种交换机类型（Direct/Fanout/Topic/Headers）+ 自定义路由键，支持精准路由、广播、通配符匹配，能满足异步解耦、发布订阅等几乎所有分布式消息通信场景；
3. **轻量易部署、跨语言**：Erlang 开发，资源占用低，部署 / 运维简单，支持 Java/Python/Go 等所有主流语言，多技术栈系统适配性拉满；
4. **高可用 & 轻量集群**：支持主从、镜像队列、集群部署，单节点故障可无缝切换，集群搭建成本低，适合中小规模分布式系统快速落地。

#### 二、核心缺点（明确适用边界，面试高频考点）

1. **高吞吐场景性能一般**：相比 Kafka，RabbitMQ 的消息收发性能较低（万级 / 秒），因为要保证可靠性做了大量持久化、确认机制的开销，无法承接百万级 / 秒的超高吞吐；

2. **消息堆积处理能力弱**：队列存储基于内存 + 磁盘，大量消息堆积时，性能会快速下降，甚至引发 MQ 宕机，需提前扩容或限流，不如 Kafka 的磁盘顺序写高效

3. **Erlang 语言门槛**：底层由 Erlang 开发，若生产环境出现 MQ 内核问题，非 Erlang 开发人员难以定位和定制化修改，二次开发成本高；

   

## 5. RabbitMQ 核心角色有哪些?

**核心 5 角色（职责一句话讲清）**

1. **生产者**：发消息，仅对接交换机，指定路由键
2. **消费者**：收 / 处理消息，仅监听队列
3. **交换机**：路由消息，不存储，按类型匹配规则转发
4. **队列**：唯一存储消息的角色，支持持久化 / 限流
5. **Broker**：RabbitMQ 服务端（单节点 / 集群），所有角色的运行载体

**扩展加分角色**

**VHost**：Broker 内的逻辑隔离单元，实现多租户，业务独立分配

**核心流转**

生产者→交换机（路由）→队列（存储）→消费者，所有操作基于 Broker，VHost 做隔离

**面试速答话术**

RabbitMQ 核心角色有生产者、消费者、交换机、队列和 Broker（服务端），交换机负责路由、队列唯一存消息，消息从生产者经交换机路由到队列，再由消费者消费；VHost 是扩展的多租户隔离角色。



## 6. Exchange（交换机）有哪些？

1. **Direct（直连）**：精准匹配路由键（一对一），比如订单 ID 路由到指定处理队列；
2. **Fanout（扇出 / 广播）**：无视路由键，消息广播到所有绑定队列，比如日志收集、发布订阅；
3. **Topic（主题）**：通配符匹配路由键（* 匹配一个词，# 匹配多个词），最灵活，比如电商按地区路由订单（order.#.shanghai）；
4. **Headers**：按消息头匹配（非路由键），几乎不用，面试可略提。



## 7. 说一说MQ消息丢失？

**1. 生产者端丢失（消息没发到 MQ）**

- 原因：网络故障、MQ 宕机，生产者发送后无确认
- 解决：**开启生产者 确认机制（Confirm）**（同步 / 异步），确保消息成功投递到 Exchange；失败则重试 / 记录。

**2. MQ 端丢失（消息到 MQ 后宕机丢失）**

- 原因：Exchange/Queue/ 消息未持久化，MQ 宕机后数据丢失
- 解决：**三重持久化**—— 交换机持久化、队列持久化、消息持久化（发送时指定 deliveryMode=2）。

**3. 消费者端丢失（消费中宕机，消息未处理完）**

- 原因：消费者自动 Ack，拿到消息后未处理完就宕机，MQ 判定消费成功删除消息
- 解决：**关闭自动 Ack，开启手动 Ack**，处理完业务再手动确认（basicAck）；处理失败则重入队（basicNack）/ 死信



## 8. 说说生产者确认机制？

#### **核心配置（application.yml 关键项）**

```yaml
spring:
  rabbitmq:
    # 仅保留生产者确认相关核心配置，基础连接信息（host/port等）面试可略
    publisher-confirm-type: correlated  # 异步确认（生产环境首选）
    publisher-returns: true             # 开启Return机制（处理路由失败）
    template:
      mandatory: true                   # 路由失败强制触发Return回调
```

**核心说明**：

- `publisher-confirm-type: correlated`：开启异步确认模式，MQ 收到消息后异步回调生产者；
- `publisher-returns + mandatory`：兜底处理 “MQ 收到但路由到队列失败” 的消息，避免无声丢失。

#### **关键代码（仅核心回调 + 发送逻辑）**

```java
@Component
public class Producer implements RabbitTemplate.ConfirmCallback, RabbitTemplate.ReturnsCallback {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    // 初始化绑定回调（核心）
    @PostConstruct
    public void init() {
        rabbitTemplate.setConfirmCallback(this);      // 绑定确认回调
        rabbitTemplate.setReturnsCallback(this);      // 绑定Return回调
    }

    // 发送消息（核心：带唯一ID用于回调匹配）
    public void sendMsg(String msg) {
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        rabbitTemplate.convertAndSend("exchange", "routingKey", msg, correlationData);
    }

    // 1. 确认回调：判断消息是否到达MQ的Exchange
    @Override
    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
        if (ack) {
            // 消息成功到达MQ，无需处理
        } else {
            // 消息未到达MQ，触发重试/落地本地消息表（核心兜底逻辑）
            String msgId = correlationData.getId();
            System.err.println("消息[" + msgId + "]发送失败：" + cause);
        }
    }

    // 2. Return回调：消息到Exchange但路由到Queue失败
    @Override
    public void returnedMessage(ReturnedMessage returned) {
        // 路由失败处理：重试/转发死信（核心兜底逻辑）
        String msg = new String(returned.getMessage().getBody());
        System.err.println("消息[" + msg + "]路由失败：" + returned.getReplyText());
    }
}
```

#### 总结

1. 核心配置仅需开启`correlated`异步确认和`Return`机制，是生产者防丢失的关键；
2. 代码核心是实现两个回调：`ConfirmCallback`确认消息是否到 MQ，`ReturnsCallback`处理路由失败；
3. `CorrelationData`绑定消息 ID，是精准定位丢失消息、实现重试的核心。



## 9. 消费者手动消息确认

#### 核心配置（application.yml 关键项）

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: manual  # 关闭自动Ack，开启手动确认（核心）
        # 可选：消费限流（削峰补充，面试加分）
        prefetch: 1  # 每次只拉取1条消息，处理完再拉取下一条
```

**核心说明**：

- `acknowledge-mode: manual`：是手动确认的核心开关，关闭自动确认，由代码控制消息是否确认；
- `prefetch: 1`：消费限流，避免一次性拉取大量消息导致处理中宕机丢失，面试提一下更加分。

#### 关键代码（仅核心消费 + 手动确认逻辑）

```java
@Component
public class MsgConsumer {

    // 监听队列，核心：ackMode="MANUAL" 显式指定手动确认
    @RabbitListener(queues = "test.queue", ackMode = "MANUAL")
    public void consumeMsg(Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag(); // 获取消息唯一标识
        try {
            // 1. 核心业务逻辑：处理消息（如扣库存、更新订单）
            String msg = new String(message.getBody());
            System.out.println("处理消息：" + msg);

            // 2. 业务处理成功，手动确认（核心）：multiple=false表示只确认当前这条消息
            channel.basicAck(deliveryTag, false);
        } catch (Exception e) {
            // 3. 业务处理失败，根据场景选择处理方式（二选一）
            // 方式1：重新入队（重试）：requeue=true
            channel.basicNack(deliveryTag, false, true);
            // 方式2：拒绝并丢弃（或转发死信）：requeue=false （basicReject 不支持批量确认操作）
            // channel.basicReject(deliveryTag, false);
            System.err.println("消息处理失败：" + e.getMessage());
        }
    }
}
```

#### 总结

1. 核心配置仅需设置`acknowledge-mode: manual`，关闭自动确认；
2. 代码核心是通过`Channel`的`basicAck`（成功确认）、`basicNack/basicReject`（失败处理）控制消息确认；
3. `deliveryTag`是消息的唯一标识，用于精准确认单条消息，是手动确认的核心参数。



## 10. MQ持久化

RabbitMQ 持久化核心是保障**MQ 服务端消息不丢失**，需完成「交换机持久化 + 队列持久化 + 消息持久化」三重配置，以下仅保留核心内容，基础连接配置省略。

#### 核心配置（无额外 yml 开关，持久化通过声明组件时指定参数实现）

注：MQ 持久化无需在 application.yml 中单独加开关，核心是声明交换机 / 队列时指定 “持久化参数”，发送消息时指定 “持久化模式”。

#### 关键代码

**交换机 + 队列持久化（核心：声明时指定 durable=true）**

```java
@Configuration
public class RabbitMqPersistentConfig {
    // 1. 声明持久化直连交换机（durable=true 是核心）
    @Bean
    public DirectExchange persistentExchange() {
        // 参数：交换机名、是否持久化、是否自动删除
        return new DirectExchange("persistent.exchange", true, false);
    }

    // 2. 声明持久化队列（durable=true 是核心）
    @Bean
    public Queue persistentQueue() {
        // 参数：队列名、是否持久化、是否排他、是否自动删除
        return new Queue("persistent.queue", true, false, false);
    }

    // 3. 绑定交换机和队列（无持久化相关，仅路由规则）
    @Bean
    public Binding persistentBinding() {
        return BindingBuilder.bind(persistentQueue())
                .to(persistentExchange())
                .with("persistent.key");
    }
}
```

**消息持久化（核心：发送时指定 deliveryMode=2 投递模式设置为2）**

```java
@Component
public class PersistentMsgProducer {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendPersistentMsg(String msg) {
        // 构建消息，指定持久化模式（deliveryMode=2 是核心） deliveryMode：投递模式设置为2
        Message message = MessageBuilder
                .withBody(msg.getBytes(StandardCharsets.UTF_8))
                .setDeliveryMode(MessageDeliveryMode.PERSISTENT) // 等价于deliveryMode=2
                .build();
        
        // 发送持久化消息到持久化交换机/队列
        rabbitTemplate.send("persistent.exchange", "persistent.key", message);
    }
}
```

**核心说明**

1. **交换机 / 队列持久化**：`durable=true` 表示 MQ 宕机重启后，交换机 / 队列的元数据不会丢失；若为 false，重启后交换机 / 队列会被删除；
2. **消息持久化**：`deliveryMode=2`（或`MessageDeliveryMode.PERSISTENT`）表示消息会被持久化到磁盘，而非仅存于内存，MQ 宕机后消息不丢失；
3. 三重持久化需**同时开启**，缺一不可：仅交换机 / 队列持久化，消息仍存内存；仅消息持久化，交换机 / 队列重启后丢失，消息也无法路由。

#### 总结

1. MQ 持久化核心是「交换机 + 队列 + 消息」三重持久化，核心参数为`durable=true`（交换机 / 队列）、`deliveryMode=2`（消息）；
2. 持久化会增加磁盘 IO 开销，需在可靠性和性能间平衡；
3. 即使开启持久化，若 MQ 宕机时消息还未刷盘，仍可能丢失（可搭配镜像队列进一步提升可靠性）。



## 11. 镜像队列

镜像队列是 RabbitMQ 集群下保障**队列高可用**的核心方案，核心是将主队列同步到集群多个节点，主节点宕机后从节点自动接管，以下仅保留核心配置 / 代码，集群搭建、基础连接等内容省略。

#### 一、核心配置

**1. 命令行配置镜像策略（生产环境首选）**

```bash
# 配置镜像策略：匹配ha.开头的队列，同步到集群所有节点
rabbitmqctl set_policy ha_policy "^ha\." '{"ha-mode":"all"}' --apply-to queues
```

**核心参数说明**：

- `ha_policy`：策略名称（自定义）；
- `^ha\.`：正则匹配队列名，仅对以`ha.`开头的队列生效；
- `{"ha-mode":"all"}`：镜像模式为 “同步到集群所有节点”（常用）；
- `--apply-to queues`：策略仅作用于队列（镜像队列核心）。

**2. 控制台配置（可视化操作，面试提即可）**

- 进入 RabbitMQ 控制台 → Admin → Policies → Add / Update a policy；
- Name：自定义策略名（如 ha_policy）；
- Pattern：队列匹配正则（如`^ha\.`）；
- Apply to：选择`Queues`；
- Definition：添加键值对`ha-mode=all`。

#### 二、关键代码（仅队列声明，无需额外配置）

```java
@Configuration
public class MirrorQueueConfig {
    // 声明队列：名称以ha.开头（匹配镜像策略）+ 开启持久化（核心）
    @Bean
    public Queue mirrorQueue() {
        // 参数：队列名（ha.开头）、是否持久化、是否排他、是否自动删除
        return new Queue("ha.order.queue", true, false, false);
    }
}
```

**核心说明**：

- 队列名需匹配镜像策略的正则（如`ha.order.queue`），才能被自动设置为镜像队列；
- 必须开启队列持久化（`durable=true`），否则镜像同步无意义（节点重启队列丢失）。

#### 总结

1. 镜像队列核心是通过「集群策略」实现队列多节点同步，配置关键是设置`ha-mode`（常用`all`）和队列名匹配规则；
2. 代码仅需声明匹配规则的持久化队列，无需额外逻辑；
3. 镜像队列需搭配队列 / 消息持久化使用，解决集群下主节点宕机的队列高可用问题。



## 12.  消息重复消费怎么处理？

- **生产端消息重复**
  - 生产者发送消息到 MQ 后，因网络波动未收到 MQ 的确认回执，生产者触发重试机制重新发送，导致 MQ 接收到重复消息。

- **消费端消息重复**
  - 消费者处理完消息后，向 MQ 发送确认（Ack）时出现网络波动，MQ 未收到确认，会判定消息未消费成功，重新将该消息投递到消费者，导致消费者接收到重复消息。

**核心解决思路**：

重复消息无法从根源避免，核心解决方案是**让消费逻辑满足幂等性**（多次执行结果与一次执行一致），关键是为每条消息分配**全局唯一 ID**，消费时通过该 ID 校验消息是否已被处理。

**具体实现方案**：

1. 消费者获取到消息后先根据id去查询redis/db是否存在该消息
2. 如果不存在，则正常消费，消费完毕后写入redis/db
3. 如果存在，则证明消息被消费过，直接丢弃



## 13. RabbitMQ 消费端怎么进行限流？

消费端限流是为了避免 MQ 瞬间推送大量消息压垮消费者（如数据库连接耗尽、服务器 CPU / 内存打满），核心是控制 MQ 每次推送给消费者的消息数量，消费者处理完一批再推送下一批。

#### **核心原理**

通过设置`prefetch`（预取数）参数，指定 MQ 最多给每个消费者推送`N`条未确认的消息，只有当消费者确认了`N`条消息中的部分 / 全部后，MQ 才会补充推送新消息，实现 “处理一批、拉取一批” 的限流效果。

#### **配置层面（application.yml 核心项）**

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: manual  # 限流必须配合手动确认（核心前提）
        prefetch: 10              # 核心：每次最多预取10条未确认消息
        # 可选：批量确认（进一步控制频率）
        batch-size: 5             # 每确认5条消息再批量反馈给MQ
```

**关键说明**：

- `acknowledge-mode: manual`：限流必须开启手动确认，否则 MQ 会一次性推送所有消息，限流失效；
- `prefetch: 10`：表示每个消费者最多持有 10 条未确认的消息，处理完部分后 MQ 才会补新消息；值越小，限流越严格（如设为 1 则 “处理一条、拉取一条”）。

#### 代码层面（仅核心消费逻辑）

```java
@Component
public class LimitConsumer {
    @Autowired
    private StringRedisTemplate redisTemplate;

    // 监听队列，配合配置实现限流
    @RabbitListener(queues = "business.queue")
    public void consumeMsg(Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            // 1. 处理单条消息业务逻辑
            String content = new String(message.getBody());
            processBusiness(content);

            // 2. 手动确认（确认后MQ才会补新消息）
            // 批量确认：channel.basicAck(deliveryTag, true);（确认当前及之前所有消息）
            // 单条确认：channel.basicAck(deliveryTag, false);
            channel.basicAck(deliveryTag, false);
            //举例：假设 MQ 推给你 3 条消息，编号是 1、2、3，你处理完 2 号消息后调用上面这个方法，仅 2 号消息被确认，MQ 只会把 2 号从 “未确认列表” 移除，1、3 仍保留。
        } catch (Exception e) {
            // 处理失败，重新入队或拒绝
            channel.basicNack(deliveryTag, false, true);
        }
    }

    // 业务处理逻辑（模拟耗时操作）
    private void processBusiness(String content) {
        // 如：数据库写入、接口调用等，耗时操作更需限流
        try {
            Thread.sleep(100); // 模拟业务处理耗时
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

#### 进阶补充（面试加分）

1. **全局限流**：若需对整个队列限流（所有消费者合计），可结合 MQ 的`x-max-length`（队列最大消息数）或自定义限流逻辑（如基于 Redis 计数）；
2. **动态调整**：生产环境可通过 RabbitMQ 控制台 / API 动态修改`prefetch`值，无需重启服务，prefetch 是针对客户端的设置；
3. **注意事项**：`prefetch`值需根据消费者处理能力调整（如处理单条消息耗时 100ms，prefetch 设为 10 则每秒处理约 10条），避免过小导致消费速度慢，过大导致限流失效。`prefetch: N` 的核心是：**MQ 给每个消费者最多保留 N 条 “未确认的消息”**，消费者确认一条，MQ 才会补一条新的，形成 “消费 - 确认 - 补消息” 的循环。

#### 总结

1. 消费端限流核心是`手动确认 + prefetch参数`，控制 MQ 单次推送的未确认消息数；
2. 限流的前提是开启手动确认，否则 prefetch 参数无效；
3. 核心目标是平衡消费速度和消费者资源占用，避免消费者被海量消息压垮。



## 14. 什么是死信队列？

#### **先明确：死信队列（Dead Letter Queue，DLQ）是什么**

死信队列并不是 RabbitMQ 的一种特殊队列类型，而是**普通队列的 “特殊用途”**—— 专门用来接收 “死信消息” 的普通队列。

所谓**死信消息**，是指在正常队列中满足某些条件，无法被正常消费，被 RabbitMQ “淘汰” 并转发到指定队列（即死信队列）的消息。

**消息成为死信的 3 个核心条件**：

1. 消息被消费者**拒绝确认（basic.reject/basic.nack）**，且设置`requeue=false`（不重新入队）。
2. 消息在队列中**过期（TTL）**（队列设置了整体过期时间，或消息本身设置了单独过期时间）。
3. 正常队列达到**最大长度（max-length）**，无法再接收新消息，淘汰最早的消息。

#### 关键配置（核心，无基础冗余配置）

1. 正常业务队列需要添加 2 个核心参数（声明队列时配置）：

   - `x-dead-letter-exchange`：指定死信交换机（DLX）的名称（必须提前声明该交换机）。
   - `x-dead-letter-routing-key`：指定死信消息路由到死信队列的路由键（可选，若不指定，使用消息原有的路由键）。

   

2. 可选补充（触发死信的常见配置）：

   - `x-message-ttl`：队列中消息的默认过期时间（毫秒），超过该时间未被消费的消息成为死信。

   - `x-max-length`：队列的最大消息长度，超过后淘汰旧消息成为死信。

   - 也可以给消息单独设置过期时间，遵循「**最短过期时间优先**」

     

**关键代码（以 Java 的 Spring AMQP 为例，最常用生产环境方案）**

Spring AMQP 已经封装了 RabbitMQ 的操作，核心是通过队列的`arguments`配置死信相关参数，以下是核心代码片段（省略基础的连接配置、交换机 / 队列绑定的冗余代码）。

**配置类（核心：正常队列的死信参数配置）**

```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DlxQueueConfig {

    // 1. 声明 死信交换机（普通的direct交换机即可，并非特殊类型）
    @Bean
    public DirectExchange dlxExchange() {
        // 持久化、不自动删除
        return new DirectExchange("DLX_EXCHANGE", true, false);
    }

    // 2. 声明 死信队列（普通队列，专门接收死信消息）
    @Bean
    public Queue dlxQueue() {
        return QueueBuilder.durable("DLX_QUEUE") // 持久化死信队列，避免消息丢失
                .build();
    }

    // 3. 绑定 死信交换机与死信队列（指定路由键：DLX_ROUTING_KEY）
    @Bean
    public Binding dlxBinding() {
        return BindingBuilder.bind(dlxQueue())
                .to(dlxExchange())
                .with("DLX_ROUTING_KEY");
    }

    // 4. 声明 正常业务队列（核心：配置死信相关参数）
    @Bean
    public Queue businessQueue() {
        // 封装死信相关配置参数
        Map<String, Object> arguments = new HashMap<>(4);
        // 关键配置1：指定死信交换机
        arguments.put("x-dead-letter-exchange", "DLX_EXCHANGE");
        // 关键配置2：指定死信路由键（对应死信交换机与死信队列的绑定键）
        arguments.put("x-dead-letter-routing-key", "DLX_ROUTING_KEY");
        // 可选配置：消息过期时间（60秒），触发死信条件2
        arguments.put("x-message-ttl", 60000);
        // 可选配置：队列最大长度（1000条），触发死信条件3
        arguments.put("x-max-length", 1000);

        // 声明正常队列，传入死信配置参数
        return QueueBuilder.durable("BUSINESS_QUEUE")
                .withArguments(arguments) // 核心：注入死信相关配置
                .build();
    }

    // 5. 声明 业务交换机（普通direct交换机，用于发送正常业务消息）
    @Bean
    public DirectExchange businessExchange() {
        return new DirectExchange("BUSINESS_EXCHANGE", true, false);
    }

    // 6. 绑定 业务交换机与业务队列
    @Bean
    public Binding businessBinding() {
        return BindingBuilder.bind(businessQueue())
                .to(businessExchange())
                .with("BUSINESS_ROUTING_KEY");
    }
}
```

**消费者代码（核心：拒绝消息并设置 requeue=false，触发死信条件 1）**

这是触发死信的最常见主动操作，消费者处理消息失败时，拒绝该消息且不重新入队，消息会被转发到死信队列。

```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BusinessConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    // 监听正常业务队列
    @RabbitListener(queues = "BUSINESS_QUEUE")
    public void consumeBusinessMessage(String message) {
        try {
            // 模拟业务处理失败
            int a = 1 / 0;
            // 正常处理，手动发送ack，不批量确认
            channel.basicAck(deliveryTag, false);
        } catch (Exception e) {
            System.out.println("业务处理失败，手动发送nack");
            // 手动发送nack，不批量确认，requeue=false：不重新入队。触发死信条件
            channel.basicNack(deliveryTag, false, false);
        }
    }

    // 监听死信队列，处理死信消息（可做重试、归档、告警等操作）
    @RabbitListener(queues = "DLX_QUEUE")
    public void consumeDlxMessage(String message) {
        System.out.println("处理死信消息：" + message);
        // 此处可实现：消息归档到数据库、发送告警通知、定时重试等逻辑
    }
}
```

**关键代码讲解（极简）**

1. 死信交换机 / 队列和普通组件无区别，只是用途专属。
2. 业务队列的`args`参数是核心，告诉 RabbitMQ 死信要转发到哪里。
3. 消费者抛出异常且不重试（默认配置），等价于`requeue=false`，触发死信转发。

#### 总结

1. 死信队列是接收异常消息的普通队列，依赖死信交换机转发。
2. 核心配置是业务队列的`x-dead-letter-exchange`和`x-dead-letter-routing-key`。
3. 核心操作是消费者拒绝消息且`requeue=false`，触发消息进入死信队列。





## 15. 说说pull模式

RabbitMQ 的 Pull 模式，是**消费者主动向 RabbitMQ 服务器 “请求拉取” 消息**的消费模式 —— 消费者需要主动调用 API（如`basic.get`），每次调用要么获取到一条消息（若队列中有消息），要么获取到空（若队列中无消息），完全由消费者控制拉取的时机、频率和数量。

与之相对的是我们之前一直聊的**Push 模式（推送模式）**（`basic.consume`），即 RabbitMQ 服务器主动将消息推送给已订阅队列的消费者，推送规则受`prefetch`预取数控制。

#### **Pull 模式 关键特点**

- **主动可控**：消费节奏完全由消费者掌控，想什么时候拉取、拉取多少次，都由消费者决定，服务器不会主动推送。
- **无长连接订阅**：Pull 模式不需要消费者持续订阅队列，调用`basic.get`时建立短暂交互，获取消息后即可断开（也可保持连接）。
- **单条拉取**：RabbitMQ 的`basic.get` API**每次只能拉取一条消息**，不支持批量拉取（若需批量，需循环调用）。
- **无自动推送优化**：没有`prefetch`预取数的优化，无法像 Push 模式那样批量预取提升吞吐量，高并发场景下效率较低。
- **确认机制**：拉取到消息后，同样需要手动确认（`basic.ack`）或否定确认（`basic.nack`/`basic.reject`），否则消息会保持 “未确认” 状态。

#### **Pull 模式 关键代码（Java AMQP 原生 API，最简实现）**

Spring AMQP 对 Pull 模式支持较弱（更推荐 Push 模式），因此展示原生 API 的核心代码，更易理解本质：

```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.GetResponse;

public class RabbitMQPullConsumer {
    // 队列名称
    private static final String QUEUE_NAME = "SIMPLE_BUSINESS_QUEUE";

    public static void main(String[] args) throws Exception {
        // 1. 创建连接工厂并配置
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setUsername("guest");
        factory.setPassword("guest");

        // 2. 建立连接和通道
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            // 3. 核心：主动拉取消息（Pull模式核心API：basic.get()）
            while (true) {
                // 调用basic.get()拉取单条消息，两个参数：
                // 参数1：队列名称
                // 参数2：autoAck（是否自动确认，此处设为false，手动确认）
                GetResponse response = channel.basicGet(QUEUE_NAME, false);

                if (response != null) {
                    // 4. 成功拉取到消息，处理消息
                    String message = new String(response.getBody(), "UTF-8");
                    System.out.println("拉取到消息：" + message);

                    // 5. 手动确认消息（处理成功后，告知服务器删除消息）
                    channel.basicAck(response.getEnvelope().getDeliveryTag(), false);
                } else {
                    // 6. 队列中无消息，暂停一段时间再拉取（避免空循环占用CPU）
                    System.out.println("队列中暂无消息，5秒后重试...");
                    Thread.sleep(5000);
                }
            }
        }
    }
}
```

#### Pull 模式 适用场景

Pull 模式不是主流消费模式，仅在特定场景下使用：

1. **定时任务消费**：比如每天凌晨 3 点定时拉取队列中的统计消息，处理数据报表。
2. **按需查询消费**：比如后台管理系统中，管理员手动点击 “拉取未处理消息” 按钮，才获取并处理消息。
3. **低频率、低吞吐量场景**：队列消息产生频率极低（比如几小时一条），无需消费者持续监听，主动拉取更节省资源。

#### 总结

1. Pull 模式是消费者主动调用`basic.get()`拉取消息的模式，消费节奏完全由消费者掌控。
2. 核心特点是主动可控，但吞吐量较低，不支持批量拉取，非生产环境主流。
3. 关键代码的核心是`basic.get()` API，且需处理空消息场景避免 CPU 浪费。
4. 适用低频率、按需消费场景，高并发核心业务优先使用 Push 模式（配合`prefetch`优化）。





## 16. 怎么单独设置消息的过期时间？

在生产端发送消息的时候可以给消息设置过期时间，单位为毫秒(ms)。遵循「**最短过期时间优先**」

```java
@Component
public class SendExpiredMessage {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendMessageWithExpiration(String content) {
        MessageProperties props = new MessageProperties();
        // 核心：给单个消息设置过期时间（10秒，字符串类型的毫秒数）
        props.setExpiration("10000"); 
        
        // 封装消息内容和过期属性
        Message message = new Message(content.getBytes(), props);
        
        // 发送到业务队列
        rabbitTemplate.send("SIMPLE_BUSINESS_QUEUE", message);
    }
    
    // 或者
    public void sendMessageWithExpiration(String content) {
       	Message message = new Message("tyson".getBytes(), mp);
        
		message.getMessageProperties().setExpiration("10000");
        
        // 发送到业务队列
        rabbitTemplate.send("SIMPLE_BUSINESS_QUEUE", message);
    }
}
```



## 17. 延时队列怎么实现？

RabbitMQ 延时队列的实现方案，首先**RabbitMQ 没有提供原生的 “延时队列” 类型**，实际开发中主要通过两种方案实现，其中「死信队列 + TTL」是最常用、最成熟的方案，另一种是借助 RabbitMQ 的`rabbitmq_delayed_message_exchange`插件实现。

延时队列的核心需求：**消息发送后，不立即被消费者消费，而是等待指定的延迟时间后，才被消费处理**（比如订单 30 分钟未支付自动关闭、超时任务提醒）。

#### 方案一：死信队列 + TTL（推荐，无需额外插件，兼容性好）

这是生产环境的首选方案，核心思路是：**利用 “消息 / 队列 TTL（过期时间）+ 死信队列”，让消息在 “延时队列”（实际是普通队列，仅用于存放延时消息）中过期，过期后转为死信，被转发到真正的业务队列，消费者监听业务队列实现延时消费**。

**实现逻辑（4 步极简）**

1. 声明「延时队列」（无消费者监听，仅用于存放消息，让消息在这里过期），配置 TTL 和死信交换机。
2. 声明「死信交换机」和「目标业务队列」（消费者监听该队列），绑定两者。
3. 发送消息到「延时队列」，消息在该队列中等待 TTL 过期。
4. 消息过期后转为死信，通过死信交换机转发到「目标业务队列」，消费者消费该消息，实现延时效果。

**配置类（核心：延时队列的 TTL + 死信配置）**

```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DelayQueueByDlxConfig {

    // 1. 死信交换机（用于转发过期的延时消息）
    @Bean
    public DirectExchange delayDlxExchange() {
        return new DirectExchange("DELAY_DLX_EXCHANGE", true, false);
    }

    // 2. 目标业务队列（消费者监听，最终处理延时消息）
    @Bean
    public Queue delayTargetQueue() {
        return QueueBuilder.durable("DELAY_TARGET_QUEUE").build();
    }

    // 3. 绑定死信交换机与目标业务队列
    @Bean
    public Binding delayDlxBinding() {
        return BindingBuilder.bind(delayTargetQueue())
                .to(delayDlxExchange())
                .with("DELAY_DLX_KEY");
    }

    // 4. 延时队列（核心：配置TTL+死信参数，无消费者监听）
    @Bean
    public Queue delayQueue() {
        Map<String, Object> args = new HashMap<>();
        // 关键1：配置队列级TTL（所有消息默认延时时间，单位：毫秒，此处30秒）
        args.put("x-message-ttl", 30000);
        // 关键2：指定死信交换机（转发过期消息）
        args.put("x-dead-letter-exchange", "DELAY_DLX_EXCHANGE");
        // 关键3：指定死信路由键（对应死信交换机与目标队列的绑定键）
        args.put("x-dead-letter-routing-key", "DELAY_DLX_KEY");

        // 声明延时队列，持久化
        return QueueBuilder.durable("DELAY_QUEUE").withArguments(args).build();
    }

    // 5. 延时交换机（用于发送消息到延时队列，普通Direct交换机）
    @Bean
    public DirectExchange delayExchange() {
        return new DirectExchange("DELAY_EXCHANGE", true, false);
    }

    // 6. 绑定延时交换机与延时队列
    @Bean
    public Binding delayBinding() {
        return BindingBuilder.bind(delayQueue())
                .to(delayExchange())
                .with("DELAY_KEY");
    }
}
```

**方案一关键细节**

1. **TTL 的两种配置方式**（和之前死信队列的 TTL 一致）：遵循「**最短过期时间优先**」
   - 队列级 TTL（`x-message-ttl`）：所有消息默认延时时间，配置在延时队列上，优点是统一管理，缺点是无法单独设置不同消息的延时时间。
   - 消息级 TTL（`expiration`）：发送消息时单独设置，优点是灵活，不同消息可设置不同延时，缺点是只有消息到队列头部才会检查过期，存在 “队头阻塞” 问题。
2. **延时队列无消费者**：这是核心！如果给延时队列配置消费者，消息会被立即消费，无法实现延时效果。
3. **优点与缺点**：
   - 优点：无需额外安装插件，兼容性好，实现简单，符合 RabbitMQ 原生逻辑。
   - 缺点：如果使用队列级 TTL，消息延时时间固定；如果使用消息级 TTL，存在 “队头阻塞” 问题（前面的消息未过期，后面的消息即使过期也无法被转发）。



#### 方案二：`rabbitmq_delayed_message_exchange` 插件（灵活，无队头阻塞）

这是 RabbitMQ 官方推荐的延时队列方案，需要安装额外插件，核心思路是：**声明一个特殊的 “延时交换机”（类型为`x-delayed-message`），消息发送到该交换机后，不会立即转发到队列，而是由交换机缓存，等待指定延时时间后，再转发到目标队列**。

**实现步骤（核心 3 步）**

1. 安装`rabbitmq_delayed_message_exchange`插件。
2. 声明延时交换机（类型为`x-delayed-message`）和目标队列，绑定两者。
3. 发送消息时，通过消息头`x-delay`指定延时时间，消息会在交换机中延时后转发到队列。



## 18. 队列级 TTL 和消息级 TTL 核心区别？

队列级 TTL 和消息级 TTL 核心区别：

1. 生效范围：队列级是整个队列所有消息统一过期，消息级仅单条生效、每条可独立配不同时间；
2. 过期处理：队列级批量主动过期，无队头阻塞；消息级仅在消息到队头时懒检查，有队头阻塞问题；
3. 精准性：队列级到期就转死信，延时精准度高；消息级易被头部慢过期消息卡住，精准度低；
4. 灵活性：队列级声明队列时配置，全局固定不灵活；消息级发送消息时配置，单条可调灵活性高；
5. 生效规则：队列级是过期时间上限，消息级只能缩短过期时间，比队列级长则无效。

适用场景一句话：

队列级适合所有消息延时一致、要求精准的场景；消息级适合单条需不同延时的低消息量场景。