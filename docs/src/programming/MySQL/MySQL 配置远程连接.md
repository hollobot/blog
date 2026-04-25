# MySQL 配置远程连接

## 1. 登录 MySQL

> 运行

```bash
mysql -u root -p
```

输入你的密码登录。

## 2. 执行查看命令

```sql
use mysql;
select user,host from user;
```

## 3. 看结果（重点看 host 这一列）

如果看到 **root 对应的 host 是 %**

✅ 就代表 **允许任意 IP 远程连接**

示例：

```markdown
user    host
root    %      <—— 这个就是：所有IP都能连
root    localhost
```

------

## 一句话判断

**看到 root 那行 host = % → 支持任意 IP ✅**

------

### 如果你没看到 %，我帮你一键开启

```sql
update mysql.user set host='%' where user='root';
flush privileges;
```

再执行查看命令，就会变成 `%` 了。