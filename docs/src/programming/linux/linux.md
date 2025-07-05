

```sh
ps -ef | grep nginx

kill PID
```



```sh
nohup java -jar myapp.jar > logout.log 2> logerr.log &

# nohup：防止进程因终端关闭而终止。
# > logout.log：标准输出（stdout）写入 logout.log。
# 2> logerr.log：标准错误（stderr）写入 logerr.log。
# &：让命令在后台运行。
```

