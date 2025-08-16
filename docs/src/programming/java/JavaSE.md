# Java SE 学习笔记

## Java基础概念

**Java特点**

- **跨平台性**：一次编写，到处运行（Write Once, Run Anywhere）
- **面向对象**：封装、继承、多态
- **自动内存管理**：垃圾回收机制
- **安全性**：字节码验证、安全管理器
- **多线程**：内置多线程支持

**Java程序运行过程**

```
.java源文件 → javac编译 → .class字节码文件 → JVM执行
```

## 基本语法

### 数据类型

**基本数据类型（8种）**

- **整型**：byte(1字节)、short(2字节)、int(4字节)、long(8字节)
- **浮点型**：float(4字节)、double(8字节)
- **字符型**：char(2字节)
- **布尔型**：boolean(1字节)

**引用数据类型**

- 类(Class)
- 接口(Interface)
- 数组(Array)

### 变量和常量

```java
// 变量声明
int age = 25;
String name = "张三";

// 常量声明
final int MAX_SIZE = 100;
static final String COMPANY_NAME = "ABC公司";
```

### 运算符

- **算术运算符**：+、-、*、/、%、++、--
- **关系运算符**：>、<、>=、<=、==、!=
- **逻辑运算符**：&&、||、!
- **位运算符**：&、|、^、~、<<、>>、>>>
- **赋值运算符**：=、+=、-=、*=、/=、%=



**基本位运算符**

```markdown
`|` **(按位或)**

- 对应位有一个为1时结果为1，都为0时为0
- 示例：`5 | 3` → `101 | 011` → `111` → 7
- 用途：设置特定位、合并标志位

`^` **(按位异或)**

- 对应位不同时结果为1，相同时为0
- 示例：`5 ^ 3` → `101 ^ 011` → `110` → 6
- 用途：数据加密、交换变量值、查找单独元素

`~` **(按位取反)**

- 将每一位取反，0变1，1变0
- 示例：`~5` → `~101` → `...11111010` (结果为-6，因为补码表示)
- 用途：生成掩码、位模式反转
```



**移位运算符**

```markdown
`<<` **(左移)**

- 将二进制位向左移动指定位数，右边补0
- 示例：5 << 2 → 101 → 10100 → 20
- 效果：相当于乘以2的n次方
- 用途：快速乘法运算、构造特定数值

`>>` **(有符号右移)**

- 将二进制位向右移动指定位数
- 正数左边补0，负数左边补1(保持符号)
- 示例：20 >> 2 → 10100 → 101 → 5
- 示例：-8 >> 2 → -2
- 效果：相当于除以2的n次方(向下取整)

`>>>` **(无符号右移)**

- 将二进制位向右移动指定位数，左边总是补0
- 不考虑符号位，将数值作为无符号整数处理
- 示例：-8 >>> 2 → 正数结果(具体值取决于语言的整数位数)
- 用途：处理无符号数值、避免符号扩展
```



## 流程控制

### 条件语句

```java
// if-else语句
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else {
    grade = "C";
}

// switch语句
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Other day");
}
```

### 循环语句

```java
// for循环
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// while循环
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// do-while循环
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 10);

// 增强for循环
int[] array = {1, 2, 3, 4, 5};
for (int num : array) {
    System.out.println(num);
}
```

## 面向对象编程

### 类和对象

```java
public class Person {
    // 属性
    private String name;
    private int age;
    
    // 构造方法
    public Person() {}
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 方法
    public void introduce() {
        System.out.println("我是" + name + "，今年" + age + "岁");
    }
    
    // getter和setter方法
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

### 三大特性

**封装**

- 将数据和方法封装在类中
- 使用private修饰符隐藏内部实现
- 提供public的getter/setter方法

**继承**

```java
public class Student extends Person {
    private String studentId;
    
    public Student(String name, int age, String studentId) {
        super(name, age);  // 调用父类构造方法
        this.studentId = studentId;
    }
    
    @Override
    public void introduce() {
        super.introduce();
        System.out.println("学号：" + studentId);
    }
}
```

**多态**

```java
Person person = new Student("李四", 20, "S001");
person.introduce();  // 调用Student的introduce方法
```

### 访问修饰符

- **public**：公共的，任何位置都可访问
- **protected**：受保护的，同包或子类可访问
- **default**：默认的，同包可访问
- **private**：私有的，仅本类可访问

## 常用类库

### String类

```java
String str1 = "Hello";
String str2 = new String("World");
String str3 = str1 + " " + str2;

// 常用方法
str.length()          // 获取字符串长度
str.charAt(index)     // 获取指定位置字符
str.substring(start)  // 截取子字符串
str.indexOf("ll")     // 查找子字符串位置
str.replace("l", "L") // 替换字符
str.split(" ")        // 分割字符串
```

### StringBuilder和StringBuffer

**StringBuffer**

- **线程安全**：所有方法都是同步的(synchronized)
- **性能**：由于同步开销，性能相对较低
- **适用场景**：多线程环境下需要修改字符串内容

**StringBuilder**

- **非线程安全**：没有同步方法
- **性能**：比StringBuffer更高
- **适用场景**：单线程环境下需要修改字符串内容

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString();
```

### 包装类

```java
// 自动装箱和拆箱
Integer num1 = 100;      // 装箱
int num2 = num1;         // 拆箱

// 常用方法
Integer.parseInt("123")   // 字符串转整数
Integer.toString(123)     // 整数转字符串
Integer.valueOf(123)      // 创建Integer对象
```

## 数组

### 一维数组

```java
// 数组声明和初始化
int[] arr1 = new int[5];
int[] arr2 = {1, 2, 3, 4, 5};
int[] arr3 = new int[]{1, 2, 3, 4, 5};

// 数组遍历
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

for (int num : arr) {
    System.out.println(num);
}
```

### 二维数组

```java
int[][] matrix = new int[3][4];
int[][] data = {{1, 2}, {3, 4}, {5, 6}};

// 遍历二维数组
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
```

## 异常处理

### 异常体系

```
Throwable
├── Error (系统错误，不需要处理)
└── Exception
    ├── RuntimeException (运行时异常，可以不处理)
    └── 其他Exception (编译时异常，必须处理)
```

### 异常处理语法

```java
try {
    // 可能出现异常的代码
    int result = 10 / 0;
} catch (ArithmeticException e) {
    // 处理算术异常
    System.out.println("除零错误：" + e.getMessage());
} catch (Exception e) {
    // 处理其他异常
    System.out.println("发生异常：" + e.getMessage());
} finally {
    // 无论是否发生异常都会执行
    System.out.println("清理资源");
}
```

### 抛出异常

```java
public void divide(int a, int b) throws ArithmeticException {
    if (b == 0) {
        throw new ArithmeticException("除数不能为零");
    }
    System.out.println(a / b);
}
```

## 集合框架

### Collection接口体系

```
Collection
├── List (有序，可重复)
│   ├── ArrayList
│   ├── LinkedList
│   └── Vector
├── Set (无序，不可重复)
│   ├── HashSet
│   ├── LinkedHashSet
│   └── TreeSet
└── Queue (队列)
    ├── PriorityQueue
    ├── ArrayDeque
    └── LinkedList
```

### List接口

**ArrayList**

```java
List<String> arrayList = new ArrayList<>();
arrayList.add("apple");           // 添加元素
arrayList.add(0, "banana");       // 在指定位置添加
arrayList.get(0);                 // 获取元素
arrayList.set(0, "orange");       // 修改元素
arrayList.remove(0);              // 删除元素
arrayList.size();                 // 获取大小
arrayList.isEmpty();              // 判断是否为空
arrayList.contains("apple");      // 判断是否包含元素
arrayList.indexOf("apple");       // 获取元素索引
arrayList.clear();                // 清空集合

// 批量操作
List<String> list2 = Arrays.asList("grape", "cherry");
arrayList.addAll(list2);          // 添加所有元素
arrayList.removeAll(list2);       // 删除所有指定元素
arrayList.retainAll(list2);       // 保留交集元素

// 转换为数组
String[] array = arrayList.toArray(new String[0]);
```

**LinkedList**

```java
LinkedList<Integer> linkedList = new LinkedList<>();
linkedList.addFirst(1);           // 在头部添加
linkedList.addLast(2);            // 在尾部添加
linkedList.getFirst();            // 获取第一个元素
linkedList.getLast();             // 获取最后一个元素
linkedList.removeFirst();         // 删除第一个元素
linkedList.removeLast();          // 删除最后一个元素

// 作为栈使用
linkedList.push(3);               // 入栈
linkedList.pop();                 // 出栈

// 作为队列使用
linkedList.offer(4);              // 入队
linkedList.poll();                // 出队
```

**Vector**

```java
Vector<String> vector = new Vector<>();
vector.add("element");
vector.elementAt(0);              // 获取元素（Vector特有）
vector.setElementAt("new", 0);    // 设置元素（Vector特有）
// Vector是线程安全的，但性能较差
```

### Set接口

**HashSet**

```java
HashSet<String> set = new HashSet<>();

// 添加单个元素
boolean result1 = set.add("apple");     // 返回true，添加成功
boolean result2 = set.add("banana");    // 返回true，添加成功
boolean result3 = set.add("apple");     // 返回false，元素已存在

// 删除存在的元素
boolean removed1 = set.remove("b");     // 返回true
boolean removed2 = set.remove("x");     // 返回false，元素不存在

set.contains("apple") // 检查是否包含元素

// 集合操作
Set<String> set2 = new HashSet<>(Arrays.asList("java", "c++"));
set.retainAll(set2);          // 交集
set.removeAll(set2);          // 差集

// removeAll() - 删除指定集合中的所有元素
HashSet<Integer> set = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5, 6));
List<Integer> toRemove = Arrays.asList(2, 4, 6, 8); // 8不存在
boolean changed = set.removeAll(toRemove); // 返回true
System.out.println("After removeAll: " + set); // [1, 3, 5]
```

| 方法类型 | 方法名                                  | 功能                     | 返回值      |
| -------- | --------------------------------------- | ------------------------ | ----------- |
| **添加** | `add(E e)`                              | 添加元素                 | boolean     |
|          | `addAll(Collection<? extends E> c)`     | 添加集合中所有元素       | boolean     |
| **删除** | `remove(Object o)`                      | 删除指定元素             | boolean     |
|          | `removeAll(Collection<?> c)`            | 删除指定集合中的所有元素 | boolean     |
|          | `removeIf(Predicate<? super E> filter)` | 按条件删除               | boolean     |
|          | `retainAll(Collection<?> c)`            | 只保留交集               | boolean     |
|          | `clear()`                               | 清空集合                 | void        |
| **查询** | `contains(Object o)`                    | 是否包含元素             | boolean     |
|          | `containsAll(Collection<?> c)`          | 是否包含集合中所有元素   | boolean     |
|          | `isEmpty()`                             | 是否为空                 | boolean     |
|          | `size()`                                | 元素个数                 | int         |
| **遍历** | `iterator()`                            | 获取迭代器               | Iterator<E> |
|          | `forEach(Consumer<? super E> action)`   | Lambda遍历               | void        |
| **转换** | `toArray()`                             | 转为数组                 | Object[]    |
|          | `toArray(T[] a)`                        | 转为指定类型数组         | T[]         |
|          | `stream()`                              | 获取流                   | Stream<E>   |
| **复制** | `clone()`                               | 浅复制                   | Object      |

**LinkedHashSet**

```java
Set<String> linkedHashSet = new LinkedHashSet<>();
linkedHashSet.add("first");
linkedHashSet.add("second");
// 保持插入顺序
```

**TreeSet**

```java
Set<Integer> treeSet = new TreeSet<>();
treeSet.add(3);
treeSet.add(1);
treeSet.add(2);
// 自动排序：[1, 2, 3]

// 自定义排序
Set<String> sortedSet = new TreeSet<>((s1, s2) -> s2.compareTo(s1));
sortedSet.add("banana");
sortedSet.add("apple");
// 降序排列
```

### Queue接口

**PriorityQueue**

```java
Queue<Integer> priorityQueue = new PriorityQueue<>();
priorityQueue.offer(3);
priorityQueue.offer(1);
priorityQueue.offer(2);
System.out.println(priorityQueue.poll()); // 输出1（最小值）

// 自定义优先级
Queue<String> pq = new PriorityQueue<>((s1, s2) -> s2.length() - s1.length());
pq.offer("apple");
pq.offer("pie");
System.out.println(pq.poll()); // 输出"apple"（长度最大）
```

**ArrayDeque**

```java
Deque<String> deque = new ArrayDeque<>();
deque.addFirst("first");
deque.addLast("last");
deque.removeFirst();
deque.removeLast();

// 作为栈使用
deque.push("element");
deque.pop();

// 作为队列使用
deque.offer("element");
deque.poll();
```

### Map接口

**HashMap**

```java
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("apple", 5);
hashMap.put("banana", 3);
hashMap.get("apple");             // 获取值
hashMap.getOrDefault("orange", 0); // 获取值或默认值
hashMap.containsKey("apple");     // 判断是否包含键
hashMap.containsValue(5);         // 判断是否包含值
hashMap.remove("apple");          // 删除键值对
hashMap.size();                   // 获取大小
hashMap.isEmpty();                // 判断是否为空

// Java 8 新方法
hashMap.putIfAbsent("grape", 8);  // 如果不存在则添加
hashMap.merge("apple", 2, Integer::sum); // 合并值
hashMap.compute("banana", (k, v) -> v * 2); // 计算新值
hashMap.computeIfAbsent("orange", k -> 0); // 如果不存在则计算新值

// 比较 put、putIfAbsent、computeIfAbsent
Map<String,List<String>> map = new HashMap();
List<String> list1 = map.putIfAbsent("234", new ArrayList<>()); // null 存在返回存在的value，不存在返回null，与 put()方法返回一致
List<String> list2 = map.computeIfAbsent("234", v -> new ArrayList<>());  // [] 存在返回存在的value，不存在返回自己计算的属性
```

**LinkedHashMap**

```java
Map<String, Integer> linkedHashMap = new LinkedHashMap<>();
linkedHashMap.put("first", 1);
linkedHashMap.put("second", 2);
// 保持插入顺序

// 创建LRU缓存
Map<String, String> lruCache = new LinkedHashMap<String, String>(16, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
        return size() > 10; // 最多保存10个元素
    }
};
```

**TreeMap**

```java
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put("banana", 2);
treeMap.put("apple", 1);
// 按键自动排序

// 范围操作
NavigableMap<String, Integer> navMap = new TreeMap<>();
navMap.put("a", 1);
navMap.put("c", 3);
navMap.put("e", 5);
navMap.subMap("b", "d");          // 子映射
navMap.headMap("c");              // 头映射
navMap.tailMap("c");              // 尾映射
```

### 集合遍历方式

```java
List<String> list = Arrays.asList("a", "b", "c");

// 1. 传统for循环
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}

// 2. 增强for循环
for (String item : list) {
    System.out.println(item);
}

// 3. Iterator迭代器
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}

// 4. Stream API (Java 8+)
list.stream().forEach(System.out::println);

// Map遍历
Map<String, Integer> map = new HashMap<>();
// 遍历键值对
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
// 遍历键
for (String key : map.keySet()) {
    System.out.println(key);
}
// 遍历值
for (Integer value : map.values()) {
    System.out.println(value);
}
```

### Collections工具类

```java
List<Integer> list = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5));

Collections.sort(list);           // 排序
Collections.reverse(list);        // 反转
Collections.shuffle(list);        // 随机打乱
Collections.max(list);            // 最大值
Collections.min(list);            // 最小值
Collections.frequency(list, 1);   // 统计频次
Collections.binarySearch(list, 3); // 二分查找

// 创建不可变集合
List<String> immutableList = Collections.unmodifiableList(list);
Set<String> immutableSet = Collections.unmodifiableSet(set);
Map<String, Integer> immutableMap = Collections.unmodifiableMap(map);

// 创建同步集合
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```

## IO流

### IO流概述

**流的分类**

- **按数据流向**：输入流（InputStream/Reader）、输出流（OutputStream/Writer）
- **按数据类型**：字节流（Stream）、字符流（Reader/Writer）
- **按功能**：节点流（直接操作数据源）、处理流（包装其他流）

**流的层次结构**

```
字节流：
InputStream
├── FileInputStream
├── ByteArrayInputStream
├── ObjectInputStream
├── BufferedInputStream
└── DataInputStream

OutputStream
├── FileOutputStream
├── ByteArrayOutputStream
├── ObjectOutputStream
├── BufferedOutputStream
└── DataOutputStream

字符流：
Reader
├── FileReader
├── StringReader
├── CharArrayReader
├── BufferedReader
└── InputStreamReader

Writer
├── FileWriter
├── StringWriter
├── CharArrayWriter
├── BufferedWriter
└── OutputStreamWriter
```

### 字节流

**FileInputStream和FileOutputStream**

```java
// 文件字节读取
try (FileInputStream fis = new FileInputStream("input.txt")) {
    int data;
    while ((data = fis.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 批量读取
try (FileInputStream fis = new FileInputStream("input.txt")) {
    byte[] buffer = new byte[1024];
    int bytesRead;
    while ((bytesRead = fis.read(buffer)) != -1) {
        System.out.print(new String(buffer, 0, bytesRead));
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 文件字节写入
try (FileOutputStream fos = new FileOutputStream("output.txt")) {
    String content = "Hello World";
    fos.write(content.getBytes());
    fos.flush(); // 刷新缓冲区
} catch (IOException e) {
    e.printStackTrace();
}

// 追加模式写入
try (FileOutputStream fos = new FileOutputStream("output.txt", true)) {
    fos.write("\nAppended content".getBytes());
} catch (IOException e) {
    e.printStackTrace();
}
```

**BufferedInputStream和BufferedOutputStream**

```java
// 带缓冲的字节流读取
try (FileInputStream fis = new FileInputStream("large_file.txt");
     BufferedInputStream bis = new BufferedInputStream(fis)) {
    int data;
    while ((data = bis.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 带缓冲的字节流写入
try (FileOutputStream fos = new FileOutputStream("output.txt");
     BufferedOutputStream bos = new BufferedOutputStream(fos)) {
    String content = "Buffered content";
    bos.write(content.getBytes());
    // 注意：BufferedOutputStream需要flush或close才能确保数据写入
} catch (IOException e) {
    e.printStackTrace();
}
```

**DataInputStream和DataOutputStream**

```java
// 写入基本数据类型
try (FileOutputStream fos = new FileOutputStream("data.dat");
     DataOutputStream dos = new DataOutputStream(fos)) {
    dos.writeInt(123);
    dos.writeDouble(45.6);
    dos.writeUTF("Hello");
    dos.writeBoolean(true);
} catch (IOException e) {
    e.printStackTrace();
}

// 读取基本数据类型
try (FileInputStream fis = new FileInputStream("data.dat");
     DataInputStream dis = new DataInputStream(fis)) {
    int intValue = dis.readInt();
    double doubleValue = dis.readDouble();
    String stringValue = dis.readUTF();
    boolean booleanValue = dis.readBoolean();
    System.out.println(intValue + ", " + doubleValue + ", " + stringValue + ", " + booleanValue);
} catch (IOException e) {
    e.printStackTrace();
}
```

### 字符流

**FileReader和FileWriter**

```java
// 文件字符读取
try (FileReader reader = new FileReader("input.txt")) {
    int character;
    while ((character = reader.read()) != -1) {
        System.out.print((char) character);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 批量字符读取
try (FileReader reader = new FileReader("input.txt")) {
    char[] buffer = new char[1024];
    int charsRead;
    while ((charsRead = reader.read(buffer)) != -1) {
        System.out.print(new String(buffer, 0, charsRead));
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 文件字符写入
try (FileWriter writer = new FileWriter("output.txt")) {
    writer.write("Hello World");
    writer.write('\n');
    writer.write("Java IO");
} catch (IOException e) {
    e.printStackTrace();
}
```

**BufferedReader和BufferedWriter**

```java
// 带缓冲的字符流读取
try (FileReader reader = new FileReader("input.txt");
     BufferedReader bufferedReader = new BufferedReader(reader)) {
    String line;
    while ((line = bufferedReader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 带缓冲的字符流写入
try (FileWriter writer = new FileWriter("output.txt");
     BufferedWriter bufferedWriter = new BufferedWriter(writer)) {
    bufferedWriter.write("First line");
    bufferedWriter.newLine(); // 跨平台的换行
    bufferedWriter.write("Second line");
} catch (IOException e) {
    e.printStackTrace();
}
```

**InputStreamReader和OutputStreamWriter**

```java
// 字节流转字符流
try (FileInputStream fis = new FileInputStream("input.txt");
     InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
     BufferedReader br = new BufferedReader(isr)) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 字符流转字节流
try (FileOutputStream fos = new FileOutputStream("output.txt");
     OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
     BufferedWriter bw = new BufferedWriter(osw)) {
    bw.write("中文内容");
    bw.newLine();
    bw.write("UTF-8编码");
} catch (IOException e) {
    e.printStackTrace();
}
```

### 对象序列化

**Serializable接口**

```java
// 可序列化的类
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String name;
    private int age;
    private transient String password; // transient字段不会被序列化
    
    // 构造方法和getter/setter...
}

// 序列化对象
try (FileOutputStream fos = new FileOutputStream("person.ser");
     ObjectOutputStream oos = new ObjectOutputStream(fos)) {
    Person person = new Person("张三", 25);
    oos.writeObject(person);
} catch (IOException e) {
    e.printStackTrace();
}

// 反序列化对象
try (FileInputStream fis = new FileInputStream("person.ser");
     ObjectInputStream ois = new ObjectInputStream(fis)) {
    Person person = (Person) ois.readObject();
    System.out.println(person.getName() + ", " + person.getAge());
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

### NIO (New IO)

**Path和Paths**

```java
// 创建Path对象
Path path1 = Paths.get("file.txt");
Path path2 = Paths.get("/home/user", "documents", "file.txt");
Path path3 = Paths.get(URI.create("file:///home/user/file.txt"));

// Path操作
System.out.println(path1.getFileName());     // 文件名
System.out.println(path1.getParent());       // 父目录
System.out.println(path1.getRoot());         // 根目录
System.out.println(path1.isAbsolute());      // 是否绝对路径
System.out.println(path1.toAbsolutePath());  // 转为绝对路径
```

**Files类**

```java
Path sourcePath = Paths.get("source.txt");
Path targetPath = Paths.get("target.txt");

// 文件操作
Files.exists(sourcePath);                    // 检查文件是否存在
Files.createFile(sourcePath);                // 创建文件
Files.createDirectories(Paths.get("dir/subdir")); // 创建目录
Files.delete(sourcePath);                    // 删除文件
Files.deleteIfExists(sourcePath);            // 如果存在则删除

// 文件复制和移动
Files.copy(sourcePath, targetPath);          // 复制文件
Files.move(sourcePath, targetPath);          // 移动文件

// 文件读写
List<String> lines = Files.readAllLines(sourcePath, StandardCharsets.UTF_8);
Files.write(targetPath, lines, StandardCharsets.UTF_8);

// 文件属性
BasicFileAttributes attrs = Files.readAttributes(sourcePath, BasicFileAttributes.class);
System.out.println("Creation time: " + attrs.creationTime());
System.out.println("Size: " + attrs.size());
```

**Channel和Buffer**

```java
// 使用FileChannel读取文件
try (RandomAccessFile file = new RandomAccessFile("data.txt", "r");
     FileChannel channel = file.getChannel()) {
    
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    int bytesRead = channel.read(buffer);
    
    while (bytesRead != -1) {
        buffer.flip(); // 切换到读模式
        
        while (buffer.hasRemaining()) {
            System.out.print((char) buffer.get());
        }
        
        buffer.clear(); // 清空缓冲区
        bytesRead = channel.read(buffer);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 使用FileChannel写入文件
try (RandomAccessFile file = new RandomAccessFile("output.txt", "rw");
     FileChannel channel = file.getChannel()) {
    
    String data = "Hello NIO";
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    buffer.put(data.getBytes());
    buffer.flip();
    
    channel.write(buffer);
} catch (IOException e) {
    e.printStackTrace();
}
```

### File类

```java
File file = new File("example.txt");
File directory = new File("myDirectory");

// 文件信息
System.out.println("Name: " + file.getName());
System.out.println("Path: " + file.getPath());
System.out.println("Absolute path: " + file.getAbsolutePath());
System.out.println("Parent: " + file.getParent());
System.out.println("Exists: " + file.exists());
System.out.println("Is file: " + file.isFile());
System.out.println("Is directory: " + file.isDirectory());
System.out.println("Can read: " + file.canRead());
System.out.println("Can write: " + file.canWrite());
System.out.println("Length: " + file.length());
System.out.println("Last modified: " + new Date(file.lastModified()));

// 文件操作
file.createNewFile();                         // 创建文件
directory.mkdir();                            // 创建目录
directory.mkdirs();                           // 创建多级目录
file.delete();                                // 删除文件
file.renameTo(new File("newName.txt"));       // 重命名

// 目录遍历
File dir = new File(".");
String[] fileNames = dir.list();             // 获取文件名数组
File[] files = dir.listFiles();              // 获取File对象数组

// 文件过滤
File[] txtFiles = dir.listFiles(new FilenameFilter() {
    @Override
    public boolean accept(File dir, String name) {
        return name.endsWith(".txt");
    }
});

// 使用Lambda表达式
File[] javaFiles = dir.listFiles((dir1, name) -> name.endsWith(".java"));
```

### IO流最佳实践

**资源管理**

```java
// Java 7之前的写法
FileInputStream fis = null;
try {
    fis = new FileInputStream("file.txt");
    // 读取文件
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

// Java 7+ try-with-resources写法（推荐）
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // 读取文件
} catch (IOException e) {
    e.printStackTrace();
}

// 多个资源的管理
try (FileInputStream fis = new FileInputStream("input.txt");
     FileOutputStream fos = new FileOutputStream("output.txt");
     BufferedInputStream bis = new BufferedInputStream(fis);
     BufferedOutputStream bos = new BufferedOutputStream(fos)) {
    // 处理文件
} catch (IOException e) {
    e.printStackTrace();
}
```

**文件复制示例**

```java
// 字节流复制
public static void copyFileWithByteStream(String source, String target) {
    try (FileInputStream fis = new FileInputStream(source);
         FileOutputStream fos = new FileOutputStream(target);
         BufferedInputStream bis = new BufferedInputStream(fis);
         BufferedOutputStream bos = new BufferedOutputStream(fos)) {
        
        byte[] buffer = new byte[8192];
        int bytesRead;
        while ((bytesRead = bis.read(buffer)) != -1) {
            bos.write(buffer, 0, bytesRead);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}

// NIO方式复制
public static void copyFileWithNIO(String source, String target) {
    try {
        Path sourcePath = Paths.get(source);
        Path targetPath = Paths.get(target);
        Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
        e.printStackTrace();
    }
}

// Channel复制（大文件推荐）
public static void copyFileWithChannel(String source, String target) {
    try (FileInputStream fis = new FileInputStream(source);
         FileOutputStream fos = new FileOutputStream(target);
         FileChannel sourceChannel = fis.getChannel();
         FileChannel targetChannel = fos.getChannel()) {
        
        targetChannel.transferFrom(sourceChannel, 0, sourceChannel.size());
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

## 多线程

### 创建线程

**继承Thread类**

```java
class MyThread extends Thread {
    private String threadName;
    
    public MyThread(String name) {
        this.threadName = name;
    }
    
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(threadName + " - " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

// 使用
MyThread t1 = new MyThread("Thread-1");
MyThread t2 = new MyThread("Thread-2");
t1.start();
t2.start();
```

**实现Runnable接口**

```java
class MyRunnable implements Runnable {
    private String threadName;
    
    public MyRunnable(String name) {
        this.threadName = name;
    }
    
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(threadName + " - " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

// 使用
Thread t1 = new Thread(new MyRunnable("Thread-1"));
Thread t2 = new Thread(new MyRunnable("Thread-2"));
t1.start();
t2.start();

// Lambda表达式方式
Thread t3 = new Thread(() -> {
    System.out.println("Lambda线程运行中...");
});
t3.start();
```

**实现Callable接口**

```java
import java.util.concurrent.*;

class MyCallable implements Callable<String> {
    private String taskName;
    
    public MyCallable(String name) {
        this.taskName = name;
    }
    
    @Override
    public String call() throws Exception {
        Thread.sleep(2000);
        return "任务 " + taskName + " 完成";
    }
}

// 使用
ExecutorService executor = Executors.newFixedThreadPool(2);
Future<String> future1 = executor.submit(new MyCallable("Task-1"));
Future<String> future2 = executor.submit(new MyCallable("Task-2"));

try {
    String result1 = future1.get(); // 阻塞等待结果
    String result2 = future2.get();
    System.out.println(result1);
    System.out.println(result2);
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
} finally {
    executor.shutdown();
}
```

### 线程同步

**synchronized关键字**

```java
public class Counter {
    private int count = 0;
    
    // 同步方法
    public synchronized void increment() {
        count++;
    }
    
    // 同步代码块
    public void decrement() {
        synchronized(this) {
            count--;
        }
    }
    
    // 静态同步方法（类锁）
    public static synchronized void staticMethod() {
        // 静态方法同步
    }
    
    public int getCount() {
        return count;
    }
}
```

**Lock接口**

```java
import java.util.concurrent.locks.*;

public class LockCounter {
    private int count = 0;
    private Lock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // 必须在finally中释放锁
        }
    }
    
    public void decrement() {
        if (lock.tryLock()) { // 尝试获取锁
            try {
                count--;
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("无法获取锁");
        }
    }
    
    public int getCount() {
        return count;
    }
}
```

**ReadWriteLock**

```java
import java.util.concurrent.locks.*;

public class ReadWriteCounter {
    private int count = 0;
    private ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private Lock readLock = rwLock.readLock();
    private Lock writeLock = rwLock.writeLock();
    
    public void increment() {
        writeLock.lock();
        try {
            count++;
        } finally {
            writeLock.unlock();
        }
    }
    
    public int getCount() {
        readLock.lock();
        try {
            return count;
        } finally {
            readLock.unlock();
        }
    }
}
```

### 线程通信

**wait()和notify()**

```java
public class ProducerConsumer {
    private int data = 0;
    private boolean hasData = false;
    
    public synchronized void produce(int value) {
        while (hasData) {
            try {
                wait(); // 等待消费者消费
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        data = value;
        hasData = true;
        System.out.println("生产了：" + value);
        notify(); // 通知消费者
    }
    
    public synchronized int consume() {
        while (!hasData) {
            try {
                wait(); // 等待生产者生产
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        int result = data;
        hasData = false;
        System.out.println("消费了：" + result);
        notify(); // 通知生产者
        return result;
    }
}
```

**Condition**

```java
import java.util.concurrent.locks.*;

public class ConditionExample {
    private Lock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();
    private boolean ready = false;
    
    public void waitForCondition() {
        lock.lock();
        try {
            while (!ready) {
                condition.await(); // 等待条件
            }
            System.out.println("条件满足，继续执行");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    
    public void signalCondition() {
        lock.lock();
        try {
            ready = true;
            condition.signal(); // 唤醒等待的线程
        } finally {
            lock.unlock();
        }
    }
}
```

### 线程池

**ExecutorService**

```java
import java.util.concurrent.*;

// 固定大小线程池
ExecutorService fixedPool = Executors.newFixedThreadPool(5);

// 缓存线程池
ExecutorService cachedPool = Executors.newCachedThreadPool();

// 单线程池
ExecutorService singlePool = Executors.newSingleThreadExecutor();

// 调度线程池
ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(3);

// 提交任务
fixedPool.submit(() -> {
    System.out.println("执行任务：" + Thread.currentThread().getName());
});

// 调度任务
scheduledPool.schedule(() -> {
    System.out.println("延迟执行");
}, 2, TimeUnit.SECONDS);

scheduledPool.scheduleAtFixedRate(() -> {
    System.out.println("定期执行");
}, 0, 1, TimeUnit.SECONDS);

// 关闭线程池
fixedPool.shutdown();
try {
    if (!fixedPool.awaitTermination(60, TimeUnit.SECONDS)) {
        fixedPool.shutdownNow();
    }
} catch (InterruptedException e) {
    fixedPool.shutdownNow();
}
```

**ThreadPoolExecutor**

```java
// 自定义线程池
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    2,                      // 核心线程数
    4,                      // 最大线程数
    60L,                    // 空闲线程存活时间
    TimeUnit.SECONDS,       // 时间单位
    new ArrayBlockingQueue<>(10), // 工作队列
    Executors.defaultThreadFactory(), // 线程工厂
    new ThreadPoolExecutor.AbortPolicy() // 拒绝策略
);

// 监控线程池状态
System.out.println("活跃线程数：" + executor.getActiveCount());
System.out.println("完成任务数：" + executor.getCompletedTaskCount());
System.out.println("队列大小：" + executor.getQueue().size());
```

### 并发工具类

**CountDownLatch**

```java
import java.util.concurrent.CountDownLatch;

CountDownLatch latch = new CountDownLatch(3);

// 工作线程
for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println("工作线程完成");
        latch.countDown(); // 计数减1
    }).start();
}

// 主线程等待
try {
    latch.await(); // 等待计数变为0
    System.out.println("所有工作完成");
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

**CyclicBarrier**

```java
import java.util.concurrent.CyclicBarrier;

CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("所有线程都到达屏障");
});

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        try {
            System.out.println("线程到达屏障");
            barrier.await(); // 等待其他线程
            System.out.println("继续执行");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();
}
```

**Semaphore**

```java
import java.util.concurrent.Semaphore;

Semaphore semaphore = new Semaphore(2); // 允许2个线程同时访问

for (int i = 0; i < 5; i++) {
    new Thread(() -> {
        try {
            semaphore.acquire(); // 获取许可
            System.out.println("线程获得许可");
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release(); // 释放许可
        }
    }).start();
}
```

## 常用设计模式

### 单例模式

**饿汉式**

```java
public class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    private EagerSingleton() {}
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

**懒汉式**

```java
public class LazySingleton {
    private static LazySingleton instance;
    
    private LazySingleton() {}
    
    public static synchronized LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}
```

**双重检查锁**

```java
public class DoubleCheckSingleton {
    private static volatile DoubleCheckSingleton instance;
    
    private DoubleCheckSingleton() {}
    
    public static DoubleCheckSingleton getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckSingleton.class) {
                if (instance == null) {
                    instance = new DoubleCheckSingleton();
                }
            }
        }
        return instance;
    }
}
```

### 工厂模式

**简单工厂**

```java
interface Product {
    void use();
}

class ConcreteProductA implements Product {
    public void use() {
        System.out.println("使用产品A");
    }
}

class ConcreteProductB implements Product {
    public void use() {
        System.out.println("使用产品B");
    }
}

class SimpleFactory {
    public static Product createProduct(String type) {
        switch (type) {
            case "A": return new ConcreteProductA();
            case "B": return new ConcreteProductB();
            default: throw new IllegalArgumentException("未知产品类型");
        }
    }
}
```

**工厂方法**

```java
abstract class Factory {
    public abstract Product createProduct();
}

class ConcreteFactoryA extends Factory {
    public Product createProduct() {
        return new ConcreteProductA();
    }
}

class ConcreteFactoryB extends Factory {
    public Product createProduct() {
        return new ConcreteProductB();
    }
}
```

### 观察者模式

```java
import java.util.*;

// 观察者接口
interface Observer {
    void update(String message);
}

// 被观察者
class Subject {
    private List<Observer> observers = new ArrayList<>();
    
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers(String message) {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
}

// 具体观察者
class ConcreteObserver implements Observer {
    private String name;
    
    public ConcreteObserver(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println(name + " 收到消息：" + message);
    }
}
```

### 装饰器模式

```java
// 组件接口
interface Component {
    void operation();
}

// 具体组件
class ConcreteComponent implements Component {
    @Override
    public void operation() {
        System.out.println("基本操作");
    }
}

// 装饰器基类
abstract class Decorator implements Component {
    protected Component component;
    
    public Decorator(Component component) {
        this.component = component;
    }
    
    @Override
    public void operation() {
        component.operation();
    }
}

// 具体装饰器
class ConcreteDecorator extends Decorator {
    public ConcreteDecorator(Component component) {
        super(component);
    }
    
    @Override
    public void operation() {
        super.operation();
        System.out.println("额外操作");
    }
}
```

## 重要概念总结

### 关键字详解

**static关键字**

- **静态变量**：属于类，所有实例共享
- **静态方法**：可以直接通过类名调用，不能访问非静态成员
- **静态代码块**：类加载时执行，用于初始化静态变量
- **静态内部类**：不依赖外部类实例

```java
public class StaticExample {
    static int count = 0;           // 静态变量
    
    static {                        // 静态代码块
        System.out.println("类加载");
    }
    
    public static void method() {   // 静态方法
        System.out.println("静态方法");
    }
    
    static class StaticInner {      // 静态内部类
        void method() {
            System.out.println("静态内部类方法");
        }
    }
}
```

**final关键字**

- **final变量**：常量，只能赋值一次
- **final方法**：不能被重写
- **final类**：不能被继承
- **final参数**：方法参数不能被修改

```java
public final class FinalExample {
    private final int value = 10;
    
    public final void finalMethod() {
        System.out.println("不能被重写的方法");
    }
    
    public void method(final int param) {
        // param = 20; // 编译错误
    }
}
```

**abstract关键字**

```java
abstract class AbstractClass {
    // 抽象方法
    public abstract void abstractMethod();
    
    // 普通方法
    public void concreteMethod() {
        System.out.println("具体方法");
    }
}

class ConcreteClass extends AbstractClass {
    @Override
    public void abstractMethod() {
        System.out.println("实现抽象方法");
    }
}
```

### 内存管理

**JVM内存区域**

- **程序计数器**：记录当前线程执行的字节码行号
- **虚拟机栈**：存储局部变量表、操作数栈等
- **本地方法栈**：为native方法服务
- **堆内存**：存储对象实例，分为新生代和老年代
- **方法区**：存储类信息、常量池、静态变量

**垃圾回收**

判断对象是否可回收

- **引用计数法**：统计对象被引用次数（有循环引用问题）
- **可达性分析**：从GC Roots开始，标记可达对象

**垃圾回收算法**

- **标记-清除**：标记垃圾对象后清除，会产生内存碎片
- **复制算法**：将存活对象复制到另一区域，适合新生代
- **标记-整理**：标记后整理内存，适合老年代
- **分代收集**：根据对象存活时间采用不同策略

**常见垃圾收集器**

```java
// JVM参数示例
-Xms512m          // 初始堆大小
-Xmx1024m         // 最大堆大小
-XX:NewRatio=2    // 老年代与新生代比例
-XX:SurvivorRatio=8  // Eden与Survivor比例
-XX:+UseG1GC      // 使用G1垃圾收集器
```

### 异常处理最佳实践

```java
// 好的异常处理示例
public class ExceptionBestPractice {
    
    // 方法应该声明可能抛出的异常
    public void readFile(String filename) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
            // 读取文件
        } // 自动关闭资源
    }
    
    // 捕获具体的异常类型
    public void processData() {
        try {
            // 可能出错的代码
        } catch (NumberFormatException e) {
            // 处理数字格式异常
            log.error("数字格式错误", e);
        } catch (IOException e) {
            // 处理IO异常
            log.error("文件操作失败", e);
        } catch (Exception e) {
            // 处理其他异常
            log.error("未知错误", e);
            throw new RuntimeException("处理失败", e);
        }
    }
    
    // 自定义异常
    public class BusinessException extends Exception {
        public BusinessException(String message) {
            super(message);
        }
        
        public BusinessException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
```

## 学习建议

### 学习路径

1. **基础语法掌握**：数据类型、流程控制、面向对象
2. **核心API熟悉**：String、集合、IO、多线程
3. **进阶特性学习**：泛型、反射、注解、Lambda表达式
4. **框架学习**：Spring、MyBatis等主流框架
5. **项目实战**：通过实际项目巩固知识

### 实践建议

1. **多动手编码**：理论学习与实践相结合
2. **阅读优秀源码**：学习设计思想和编程技巧
3. **参与开源项目**：提升代码质量和协作能力
4. **持续学习新特性**：跟上Java版本更新
5. **关注性能优化**：学习JVM调优和代码优化技巧

### 常用开发工具

- **IDE**：IntelliJ IDEA、Eclipse
- **构建工具**：Maven、Gradle
- **版本控制**：Git
- **调试工具**：JConsole、VisualVM、JProfiler
- **文档工具**：JavaDoc
