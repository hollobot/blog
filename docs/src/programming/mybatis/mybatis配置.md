# mybatis配置

### 配置日志

```yaml
# application.yml 配置方式

# MyBatis 配置
mybatis:
  configuration:
    # 打印SQL语句
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    
    
# 日志配置
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
logging.level.com.zhilehuo.shiqu.crm.mapper=DEBUG
```

