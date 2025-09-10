# MyBatis 组件



## foreach

当使用 `foreach` 遍历集合时，MyBatis 默认使用以下参数名：

单参数且是集合/数组：`collection` 或 `list`

多参数：`arg0, arg1...` 或 `param1, param2...`

**方法1：使用 `@Param` 注解（推荐）**	

```java
@Mapper
void batchInsert(@Param("chatSessionUsers") List<ChatSessionUser> users);
```

```xml
<insert id="batchInsert">
  INSERT INTO chat_session_user 
  VALUES
  <foreach item="item" collection="chatSessionUsers" separator=",">
    (#{item.userId}, #{item.sessionId}, #{item.contactId})
  </foreach>
</insert>
```

**方法2：使用默认参数名**

```java
void batchInsert(List<ChatSessionUser> chatSessionUsers); // 不添加@Param
```

```sql
<foreach item="item" collection="list" separator=",">
  (#{item.userId}, #{item.sessionId}, #{item.contactId})
</foreach>
```

