# Spring Boot 整合 LangChain4j 快速开始

## 快速开始

### 一、概述

LangChain4j 是 Java 版本的 LangChain，提供与大语言模型（LLM）交互、RAG、Agent、Tools 等能力。与 Spring Boot 整合后，可通过自动配置和声明式 AI Services 极速构建 AI 应用。

### 二、项目依赖

使用 Maven，在 `pom.xml` 中添加以下依赖：

```xml
<properties>
    <java.version>17</java.version>
    <langchain4j.version>0.36.2</langchain4j.version>
</properties>

<dependencies>
   
    <!-- LangChain4j 核心 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j</artifactId>
        <version>${langchain4j.version}</version>
    </dependency>

    
    <!-- 模型实现（按需选择，这里以 OpenAI + 智谱AI 为例） -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-open-ai</artifactId>
        <version>${langchain4j.version}</version>
    </dependency>

    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-community-zhipu-ai</artifactId>
        <version>1.0.0-alpha1</version>
    </dependency>

    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-ollama</artifactId>
        <version>${langchain4j.version}</version>
    </dependency>
    
    <!-- Spring Boot WebFlux（流式输出必须用响应式，不能用普通 Web） -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
</dependencies>
```

> 如使用其他模型（如 Ollama、Azure OpenAI、通义千问等参考文档 [Comparison Table of all supported Language Models | LangChain4j](https://docs.langchain4j.dev/integrations/language-models/)）



### 三、配置模型

```java
@Configuration
public class LLMConfig {

    @Value("${openai.api-key}")
    private String openaiKey;
    
    @Value("${zhipu.api-key}")
    private String zhipuKey;

    // OpenAI 流式模型
    @Bean(name = "openAiStreamingModel")
    public StreamingChatLanguageModel openAiStreamingModel() {
        return OpenAiStreamingChatModel.builder()
            .apiKey(openaiKey)
            .modelName("gpt-3.5-turbo")
            .temperature(0.7)
            .logRequests(true)
            .logResponses(true)
            .build();
    }

    // 智谱AI 流式模型
    @Bean(name = "zhipuStreamingModel")
    public StreamingChatLanguageModel zhipuStreamingModel() {
        return ZhipuAiStreamingChatModel.builder()
            .apiKey(zhipuKey)
            .model(ChatCompletionModel.GLM_4_FLASH)
            .temperature(0.6)
            .maxToken(99999)
            .callTimeout(Duration.ofSeconds(60))
            .connectTimeout(Duration.ofSeconds(60))
            .writeTimeout(Duration.ofSeconds(60))
            .readTimeout(Duration.ofSeconds(60))
            .logRequests(true)
            .logResponses(true)
            .build();
    }

    static String MODEL_NAME = "deepseek-r1:1.5b"; // 本地模型名称通过 ollama list 查看
    static String BASE_URL = "http://192.168.30.130:11434"; // 访问 ollama IP地址

    @Bean(name = "ollamaStreamingModel")
    public StreamingChatLanguageModel OllamaStreamingModel() {
        return OllamaStreamingChatModel.builder()
            .baseUrl(BASE_URL)
            .modelName(MODEL_NAME)
            .temperature(0.0)
            .logRequests(true)
            .logResponses(true)
            .build();
    }

```



### 四、流式接口实现

#### 1. 实现 Service  

```java
@Service
public class StreamingChatService {

    @Qualifier("openAiStreamingModel")
    @Autowired
    private StreamingChatLanguageModel openAiStreamingModel;

    @Qualifier("zhipuStreamingModel")
    @Autowired
    private StreamingChatLanguageModel zhipuStreamingModel;

    @Qualifier("ollamaStreamingModel")
    @Autowired
    private StreamingChatLanguageModel ollamaStreamingModel;

    public Flux<String> streamWithOpenAi(String prompt) {
        return buildFlux(openAiStreamingModel, prompt);
    }

    public Flux<String> streamWithZhipu(String prompt) {
        return buildFlux(zhipuStreamingModel, prompt);
    }

    public Flux<String> streamWithOllama(String prompt) {
        return buildFlux(ollamaStreamingModel, prompt);
    }

    private Flux<String> buildFlux(StreamingChatLanguageModel model, String prompt) {
        // Sinks 是 WebFlux 的响应式"管道"，把回调转成 Flux
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();

        model.generate(prompt, new StreamingResponseHandler<AiMessage>() {
            @Override
            public void onNext(String token) {
                // 每来一个 token，往管道里推一个
                sink.tryEmitNext(token);
            }

            @Override
            public void onComplete(Response<AiMessage> response) {
                // 生成完毕，关闭管道
                sink.tryEmitComplete();
            }

            @Override
            public void onError(Throwable error) {
                // 发生错误，向管道发送错误信号
                sink.tryEmitError(error);
            }
        });

        return sink.asFlux();
    }
}
```



#### 2. 注入并使用

```java
@Tag(name = "AI 对话", description = "多模型对话接口")
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final StreamingChatService streamingChatService;

    @Operation(summary = "OpenAI 对话", description = "使用 OpenAI 模型进行对话")
    @GetMapping(value = "/openAi",produces = "text/plain;charset=UTF-8")
    public Flux<String> openAiChat(
        @Parameter(description = "用户输入的消息", example = "你是谁？")
        @RequestParam(defaultValue = "你是谁？") String message) {
        return streamingChatService.streamWithOpenAi(message);
    }

    @Operation(summary = "质谱 对话", description = "使用 质谱 模型进行对话")
    @GetMapping(value = "/glm", produces = "text/plain;charset=UTF-8")
    public Flux<String> glmChat(
        @Parameter(description = "用户输入的消息", example = "你是谁？") @RequestParam(defaultValue = "你是谁？") String message) {
        return streamingChatService.streamWithZhipu(message);
    }

    @Operation(summary = "ollama 对话", description = "ollama 本地模型进行对话")
    @GetMapping(value = "/ollama", produces = "text/plain;charset=UTF-8")
    public Flux<String> ollamaChat(
        @Parameter(description = "用户输入的消息", example = "你是谁？") @RequestParam(defaultValue = "你是谁？") String message) {
        return streamingChatService.streamWithOllama(message);
    }
}
```