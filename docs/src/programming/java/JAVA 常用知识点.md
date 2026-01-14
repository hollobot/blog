# JAVA 常用知识点



## 1、自定义对象多维度排序

```java
list.sort((a,b) -> a.x - b.x); // 按x升序
list.sort((a,b) -> {
    if (a.x != b.x) return a.x - b.x;
    return a.y - b.y;
});
```



```java
import java.util.*;

class Student {
    String name;
    int age;
    String school;

    public Student(String name, int age, String school) {
        this.name = name;
        this.age = age;
        this.school = school;
    }
}

public class Main {
    public static void main(String[] args) {
        List<Student> list = Arrays.asList(
                new Student("Alice", 22, "B中学"),
                new Student("Bob", 20, "A中学"),
                new Student("Charlie", 21, "A中学"),
                new Student("David", 19, "C中学"),
                new Student("Eve", 21, "B中学")
        );

        // 多字段排序：先学校，再姓名，再年龄
        list.sort(new Comparator<Student>() {
            @Override
            public int compare(Student s1, Student s2) {
                // ① 按学校升序
                int result = s1.school.compareTo(s2.school);
                if (result != 0) return result;

                // ② 若学校相同，按姓名升序
                result = s1.name.compareTo(s2.name);
                if (result != 0) return result;

                // ③ 若姓名也相同，按年龄升序
                return Integer.compare(s1.age, s2.age);
            }
        });

        System.out.println(list);
    }
}
```



## 2、scanner（算法比赛优化耗时）

```java
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine(); // 读取整行输入
        StringTokenizer st = new StringTokenizer(br.readLine());
        String s1 = st.nextToken(); // 读取第一个数据
        System.out.println(s);
        System.out.println(s1);
    }
}
```



## 3、Stream流

#### 通用操作 1：过滤（filter）

**核心**：按条件保留元素，仅展示过滤语法本身

```java
// 保留nums中大于5的元素
List<Integer> filterNums = nums.stream()
        .filter(n -> n > 5) // 过滤条件：n>5
        .collect(Collectors.toList());
System.out.println("过滤（>5）：" + filterNums); // [6,7,8,9,10]

// 保留strs中非null且长度=1的元素
List<String> filterStrs = strs.stream()
        .filter(s -> s != null && s.length() == 1) // 通用空值+长度过滤
        .collect(Collectors.toList());
System.out.println("过滤（非null+长度1）：" + filterStrs); // [a,b,a,c,d]
```

#### 通用操作 2：映射（map）

**核心**：转换元素类型 / 值，仅展示映射语法本身

```java
// 将nums中元素乘以2
List<Integer> mapNums = nums.stream()
        .map(n -> n * 2) // 数值转换
        .collect(Collectors.toList());
System.out.println("映射（×2）：" + mapNums); // [2,4,6,8,10,12,14,16,18,20]

// 将strs中字符串转大写（先过滤null）
List<String> mapStrs = strs.stream()
        .filter(s -> s != null)
        .map(String::toUpperCase) // 字符串转换（方法引用）
        .collect(Collectors.toList());
System.out.println("映射（转大写）：" + mapStrs); // [A,B,A,C,D]
```

#### 通用操作 3：去重（distinct）

**核心**：去除重复元素，通用去重逻辑

```java
// nums去重（本例无重复，仅展示语法）
List<Integer> distinctNums = nums.stream()
        .distinct()
        .collect(Collectors.toList());
System.out.println("去重（nums）：" + distinctNums); // [1,2,3,4,5,6,7,8,9,10]

// strs去重（先过滤null）
List<String> distinctStrs = strs.stream()
        .filter(s -> s != null)
        .distinct()
        .collect(Collectors.toList());
System.out.println("去重（strs）：" + distinctStrs); // [a,b,c,d]
```

#### 通用操作 4：排序（sorted）

**核心**：自然排序 / 自定义排序，通用排序逻辑

```java
// nums倒序排序（自定义排序）
List<Integer> sortedNums = nums.stream()
        .sorted((a, b) -> b - a) // 倒序
        .collect(Collectors.toList());
System.out.println("排序（倒序）：" + sortedNums); // [10,9,8,7,6,5,4,3,2,1]

// strs自然排序（字母序，先过滤null）
List<String> sortedStrs = strs.stream()
        .filter(s -> s != null)
        .sorted() // 自然排序
        .collect(Collectors.toList());
System.out.println("排序（自然序）：" + sortedStrs); // [a,a,b,c,d]
```

#### 通用操作 5：限制 / 跳过（limit/skip）

**核心**：截取 / 跳过元素，通用截取逻辑

```java
// nums取前3个元素
List<Integer> limitNums = nums.stream()
        .limit(3)
        .collect(Collectors.toList());
System.out.println("限制（前3）：" + limitNums); // [1,2,3]

// nums跳过前5个元素
List<Integer> skipNums = nums.stream()
        .skip(5)
        .collect(Collectors.toList());
System.out.println("跳过（前5）：" + skipNums); // [6,7,8,9,10]
```

#### 通用操作 6：聚合计算（count/max/min/sum）

**核心**：通用统计计算，无业务含义

```java
// 统计nums元素总数
long count = nums.stream().count();
System.out.println("计数：" + count); // 10

// 找nums最大值
Optional<Integer> max = nums.stream().max(Integer::compare);
max.ifPresent(m -> System.out.println("最大值：" + m)); // 10

// 找nums最小值
Optional<Integer> min = nums.stream().min(Integer::compare);
min.ifPresent(m -> System.out.println("最小值：" + m)); // 1

// 计算nums总和
int sum = nums.stream().mapToInt(Integer::intValue).sum();
System.out.println("求和：" + sum); // 55
```

#### 通用操作 7：转集合（collect）

**核心**：转为 List/Set/Map，通用集合转换

```java
// 转为List（基础）
List<Integer> toList = nums.stream().collect(Collectors.toList());

// 转为Set（自动去重）
Set<String> toSet = strs.stream()
        .filter(s -> s != null)
        .collect(Collectors.toSet());
System.out.println("转Set：" + toSet); // [a,b,c,d]

// 转为Map（key=元素，value=元素长度/数值，通用映射）
Map<String, Integer> toMap = strs.stream()
        .filter(s -> s != null)
        .collect(Collectors.toMap(
                s -> s, // key=字符串本身
                String::length, // value=字符串长度
                (oldV, newV) -> oldV // 重复key保留旧值
        ));
System.out.println("转Map：" + toMap); // {a=1, b=1, c=1, d=1}
```

#### 通用操作 8：遍历（forEach）

**核心**：通用遍历，无业务处理，仅展示遍历语法

```java
// 遍历nums并打印
System.out.print("遍历nums：");
nums.stream().forEach(n -> System.out.print(n + " ")); // 1 2 3 4 5 6 7 8 9 10
System.out.println();

// 遍历strs（过滤null）并打印
System.out.print("遍历strs：");
strs.stream().filter(s -> s != null).forEach(System.out::print); // abacd
System.out.println();
```



## 4、BigDecimal

#### 一、为什么要用 BigDecimal？

`double/float` 是浮点型，存在精度丢失问题（比如 `0.1 + 0.2 ≠ 0.3`），而 `BigDecimal` 基于整数实现，能精确表示和计算小数，是金融 / 财务场景的首选。

#### 二、基础准备：创建 BigDecimal

先掌握正确的创建方式（避免用 `double` 入参的构造器，会引入精度问题）：

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;

public class BigDecimalDemo {
    public static void main(String[] args) {
        // 推荐：用字符串创建（精确）
        BigDecimal bd1 = new BigDecimal("0.1");
        BigDecimal bd2 = new BigDecimal("0.2");
        BigDecimal bd3 = new BigDecimal("10");
        BigDecimal bd4 = new BigDecimal("3");

        // 不推荐：用double创建（会有精度丢失）
        // BigDecimal badBd = new BigDecimal(0.1); // 实际存储的是近似值

        // 便捷创建：静态方法（整数/字符串）
        BigDecimal bd5 = BigDecimal.valueOf(100); // 整数转BigDecimal
        BigDecimal bd6 = BigDecimal.valueOf(0.3); // double转BigDecimal（内部优化，比构造器好）
    }
}
```

#### 三、核心计算操作（加减乘除）

`BigDecimal` 是不可变对象，所有计算操作都会返回**新的 BigDecimal 对象**，原对象不会被修改。

```java
// 1. 加法（add）
BigDecimal addResult = bd1.add(bd2);
System.out.println("0.1 + 0.2 = " + addResult); // 输出：0.3（精确）

// 2. 减法（subtract）
BigDecimal subResult = bd3.subtract(bd1);
System.out.println("10 - 0.1 = " + subResult); // 输出：9.9

// 3. 乘法（multiply）
BigDecimal mulResult = bd1.multiply(bd3);
System.out.println("0.1 × 10 = " + mulResult); // 输出：1.0

// 4. 除法（divide） 除法必须指定**舍入模式**（避免除不尽时抛出 `ArithmeticException`），这是最容易踩坑的点：
// 10 ÷ 3，保留2位小数，四舍五入 
BigDecimal divResult = bd3.divide(bd4, 2, RoundingMode.HALF_UP);
System.out.println("10 ÷ 3 = " + divResult); // 输出：3.33

// 常用舍入模式说明：
// RoundingMode.HALF_UP：四舍五入（最常用）
// RoundingMode.DOWN：直接舍弃多余小数（截断）
// RoundingMode.UP：向上取整（进1）
// RoundingMode.HALF_EVEN：银行家舍入法（四舍六入五取偶）
```

#### 四、常用辅助操作

##### 1. 比较大小（compareTo）

**绝对不要用 `equals()`**（会比较精度，比如 `1.0` 和 `1` 不相等），要用 `compareTo`：

```java
BigDecimal bd7 = new BigDecimal("1.0");
BigDecimal bd8 = new BigDecimal("1");

// compareTo返回值：
// 0：相等；>0：当前值大；<0：当前值小
int compareResult = bd7.compareTo(bd8);
System.out.println("1.0 和 1 比较：" + compareResult); // 输出：0（相等）

// 常用判断：
boolean isBigger = bd3.compareTo(bd4) > 0; // 10 > 3 → true
boolean isEqual = bd1.add(bd2).compareTo(new BigDecimal("0.3")) == 0; // true
```

##### 2. 设置小数位数（setScale）

统一格式化小数位数，需指定舍入模式：

```java
BigDecimal bd9 = new BigDecimal("123.456789");
// 保留2位小数，四舍五入
BigDecimal scaled = bd9.setScale(2, RoundingMode.HALF_UP);
System.out.println("保留2位小数：" + scaled); // 输出：123.46

// 保留0位小数，截断
BigDecimal scaled2 = bd9.setScale(0, RoundingMode.DOWN);
System.out.println("保留0位小数（截断）：" + scaled2); // 输出：123
```

##### 3. 转基本类型（int/double/long）

```java
BigDecimal bd10 = new BigDecimal("123.45");
int intVal = bd10.intValue(); // 转int（直接舍弃小数）→ 123
double doubleVal = bd10.doubleValue(); // 转double → 123.45
long longVal = bd10.longValue(); // 转long → 123

// 安全转换（避免溢出）
int safeIntVal = bd10.intValueExact(); // 若有小数或溢出，抛异常
```

##### 4. 聚合计算（结合 Stream）

通用的 Stream 聚合（求和、最大值、最小值）：

```java
List<BigDecimal> bdList = Arrays.asList(
    new BigDecimal("1.1"),
    new BigDecimal("2.2"),
    new BigDecimal("3.3")
);

// 求和
BigDecimal sum = bdList.stream()
    .reduce(BigDecimal.ZERO, BigDecimal::add);
System.out.println("列表求和：" + sum); // 输出：6.6

// 最大值
BigDecimal max = bdList.stream()
    .max(BigDecimal::compareTo)
    .orElse(BigDecimal.ZERO);
System.out.println("列表最大值：" + max); // 输出：3.3

// 最小值
BigDecimal min = bdList.stream()
    .min(BigDecimal::compareTo)
    .orElse(BigDecimal.ZERO);
System.out.println("列表最小值：" + min); // 输出：1.1
```
