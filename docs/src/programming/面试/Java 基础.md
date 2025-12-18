# Java基础常见面试题总结

## 1. Java是如何实现跨平台的？

java是通过jvm虚拟机实现跨平台的。

JVM可以理解成一个软件，不同的系统有对应的版本。java文件通过编译成 `.class` 文件（字节码文件）,字节码文件又被jvm翻译为对应平台的机器码。不同平台下的字节码文件是一样的，而机器码是不一样的。

只要在不同的平台安装对应的jvm，就可以翻译编译后的字节码文件，从而运行我们写的Java代码。



## 2. Java 与 C++ 的区别

- Java 是纯粹的面向对象语言，所有的对象都继承自 java.lang.Object，C++ 兼容 C ，不但支持面向对象也支持面向过程。
- Java 通过虚拟机从而实现跨平台特性， C++ 依赖于特定的平台。
- Java 没有指针，它的引用可以理解为安全指针，而 C++ 具有和 C 一样的指针。
- Java 支持自动垃圾回收，而 C++ 需要手动回收。
- Java 不支持多重继承，只能通过实现多个接口来达到相同目的，而 C++ 支持多重继承。



##  3. JDK/JRE/JVM三者的关系

#### **JVM**

所有的java程序会首先被编译为.class的类文件，这种类文件可以在虚拟机上执行。也就是说class文件并不直接与机器的操作系统交互，而是经过虚拟机间接与操作系统交互，由虚拟机将程序解释给本地系统执行。

![img](./assets/20220402230447.png)

#### **JRE**（Java Runtime Environment）

就是Java 运行时环境。我们编写的Java程序必须要在JRE才能运行。它主要包含两个部分，JVM 和 Java 核心类库。

jre是Java的运行环境，如果你只需要运行Java程序，那么你只需要安装jre即可

#### **JDK （Java Development Kit）**

 Java 开发工具包，JDK目录下有个JRE，也就是JDK中已经集成了 JRE，不用单独安装JRE。另外，JDK中还有一些好用的工具，如jinfo，jps，jstack等。

#### **最后，总结一下JDK/JRE/JVM，他们三者的关系**

**JRE = JVM + Java 核心类库**

**JDK = JRE + Java工具 + 编译器 + 调试器**



## 4. 面向对象和面向过程的区别？

面向对象和面向过程是一种软件开发思想。

- 面向过程就是分析出解决问题所需要的步骤，然后用函数按这些步骤实现，使用的时候依次调用就可以了。
- 面向对象是把构成问题事务分解成各个对象，分别设计这些对象，然后将他们组装成有完整功能的系统。面向过程只用函数实现，面向对象是用类实现各个功能模块。

以五子棋为例，面向过程的设计思路就是首先分析问题的步骤：

1、开始游戏，2、黑子先走，3、绘制画面，4、判断输赢，5、轮到白子，6、绘制画面，7、判断输赢，8、返回步骤2，9、输出最后结果。 把上面每个步骤用分别的函数来实现，问题就解决了。

而面向对象的设计则是从另外的思路来解决问题。整个五子棋可以分为：

1. 黑白双方
2. 棋盘系统，负责绘制画面
3. 规则系统，负责判定诸如犯规、输赢等。

黑白双方负责接受用户的输入，并告知棋盘系统棋子布局发生变化，棋盘系统接收到了棋子的变化的信息就负责在屏幕上面显示出这种变化，同时利用规则系统来对棋局进行判定。



## 5. 面向对象有哪些特性？

面向对象四大特性：封装，继承，多态，抽象

1、封装就是将类的信息隐藏在类内部，不允许外部程序直接访问，而是通过该类的方法实现对隐藏信息的操作和访问。 良好的封装能够减少耦合。

2、继承是从已有的类中派生出新的类，新的类继承父类的属性和行为，并能扩展新的能力，大大增加程序的重用性和易维护性。在Java中是单继承的，也就是说一个子类只有一个父类。

3、多态是同一个行为具有多个不同表现形式的能力。在不修改程序代码的情况下改变程序运行时绑定的代码。实现多态的三要素：继承、重写、父类引用指向子类对象。

- 静态多态性：通过重载实现，相同的方法有不同的參数列表，可以根据参数的不同，做出不同的处理。
- 动态多态性：在子类中重写父类的方法。运行期间判断所引用对象的实际类型，根据其实际类型调用相应的方法。

4、抽象。把客观事物用代码抽象出来。



## 6. 数组到底是不是对象？

先说说对象的概念。对象是根据某个类创建出来的一个实例，表示某类事物中一个具体的个体。

对象具有各种属性，并且具有一些特定的行为。站在计算机的角度，对象就是内存中的一个内存块，在这个内存块封装了一些数据，也就是类中定义的各个属性。

所以，对象是用来封装数据的。

java中的数组具有java中其他对象的一些基本特点。比如封装了一些数据，可以访问属性，也可以调用方法。

因此，可以说，数组是对象。

也可以通过代码验证数组是对象的事实。比如以下的代码，输出结果为java.lang.Object。

```java
Class clz = int[].class;
System.out.println(clz.getSuperclass().getName());
```

由此，可以看出，数组类的父类就是Object类，那么可以推断出数组就是对象。



## 7. Java的基本数据类型有哪些？

- byte，8bit
- char，16bit
- short，16bit
- int，32bit
- float，32bit
- long，64bit
- double，64bit
- boolean，只有两个值：true、false，可以使⽤用 1 bit 来存储

在Java规范中，没有明确指出boolean的大小。在《Java虚拟机规范》给出了单个boolean占4个字节，和boolean数组1个字节的定义，具体 **还要看虚拟机实现是否按照规范来**，因此boolean占用1个字节或者4个字节都是有可能的。



## 8. 为什么不能用浮点型表示金额？

由于计算机中保存的小数其实是十进制的小数的近似值，并不是准确值，所以，千万不要在代码中使用浮点数来表示金额等重要的指标。

建议使用BigDecimal或者Long来表示金额。



## 9. 什么是值传递和引用传递？

- 值传递是对基本型变量而言的，传递的是该变量的一个副本，改变副本不影响原变量。
- 引用传递一般是对于对象型变量而言的，传递的是该对象地址的一个副本，并不是原对象本身，两者指向同一片内存空间。所以对引用对象进行操作会同时改变原对象。

**java中不存在引用传递，只有值传递**。

- 基本类型的 “值” 是具体数据；
- 引用类型的 “值” 是对象的地址；



## 10. 了解Java的包装类型吗？为什么需要包装类？

Java 是一种面向对象语言，很多地方都需要使用对象而不是基本数据类型。比如，在集合类中，我们是无法将 int 、double 等类型放进去的。因为集合的容器要求元素是 Object 类型。

为了让基本类型也具有对象的特征，就出现了包装类型。相当于将基本类型包装起来，使得它具有了对象的性质，并且为其添加了属性和方法，丰富了基本类型的操作。



## 11. 自动装箱和拆箱

装箱：将基础类型转化为包装类型。

拆箱：将包装类型转化为基础类型。

当基础类型与它们的包装类有如下几种情况时，编译器会**自动**帮我们进行装箱或拆箱：

- 赋值操作（装箱或拆箱）
- 进行加减乘除混合运算 （拆箱）
- 进行>,<,==比较运算（拆箱）
- 调用equals进行比较（装箱）
- ArrayList、HashMap等集合类添加基础类型数据时（装箱）



##  12. 两个Integer 用 == 比较不相等的原因

下面看一道常见的面试题：

```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b); // true

Integer c = 200;
Integer d = 200;
System.out.println(c == d); // false
```

为什么第二个输出是false？看看 Integer 类的源码就知道啦。

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

`Integer c = 200;` 会调用`Integer.valueOf(200)`。而从Integer的valueOf()源码可以看到，这里的实现并不是简单的new Integer，而是用IntegerCache做一个cache。

```java
private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        // high value may be configured by property
        int h = 127;
        String integerCacheHighPropValue =
            sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                // Maximum array size is Integer.MAX_VALUE
                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
            } catch( NumberFormatException nfe) {
                // If the property cannot be parsed into an int, ignore it.
            }
        }
        high = h;
    }
    ...
}
```

这是IntegerCache静态代码块中的一段，默认Integer cache 的下限是-128，上限默认127。当赋值100给Integer时，刚好在这个范围内，所以从cache中取对应的Integer并返回，所以a和b返回的是同一个对象，所以`==`比较是相等的，当赋值200给Integer时，不在cache 的范围内，所以会new Integer并返回，当然`==`比较的结果是不相等的。



## 13. String 为什么不可变？

先看看什么是不可变的对象。

如果一个对象，在它创建完成之后，不能再改变它的状态，那么这个对象就是不可变的。不能改变状态的意思是，不能改变对象内的成员变量，包括基本数据类型的值不能改变，引用类型的变量不能指向其他的对象，引用类型指向的对象的状态也不能改变。

接着来看Java8 String类的源码：

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];

    /** Cache the hash code for the string */
    private int hash; // Default to 0
}
```

从源码可以看出，String对象其实在内部就是一个个字符，存储在这个value数组里面的。value数组用final修饰，final 修饰的变量，值不能被修改。因此value不可以指向其他对象。

String类内部所有的字段都是私有的，也就是被private修饰。而且String没有对外提供修改内部状态的方法，因此value数组不能改变。所以，String是不可变的。

那为什么String要设计成不可变的？

主要有以下几点原因：

1. **线程安全**。同一个字符串实例可以被多个线程共享，因为字符串不可变，本身就是线程安全的。
2. **支持hash映射和缓存**。因为String的hash值经常会使用到，比如作为 Map 的键，不可变的特性使得 hash 值也不会变，不需要重新计算。
3. **出于安全考虑**。网络地址URL、文件路径path、密码通常情况下都是以String类型保存，假若String不是固定不变的，将会引起各种安全隐患。比如将密码用String的类型保存，那么它将一直留在内存中，直到垃圾收集器把它清除。假如String类不是固定不变的，那么这个密码可能会被改变，导致出现安全隐患。
4. **字符串常量池优化**。String对象创建之后，会缓存到字符串常量池中，下次需要创建同样的对象时，可以直接返回缓存的引用。既然我们的String是不可变的，它内部还有很多substring， replace， replaceAll这些操作的方法。这些方法好像会改变String对象？怎么解释呢？其实不是的，我们每次调用replace等方法，其实会在堆内存中创建了一个新的对象。然后其value数组引用指向不同的对象。



## 14. 为何JDK9要将String的底层实现由char[]改成byte[]?

主要是为了**节约String占用的内存**。

在大部分Java程序的堆内存中，String占用的空间最大，并且绝大多数String只有Latin-1字符，这些Latin-1字符只需要1个字节就够了。

每个字符用 **1 个字节（8 位）** 表示，总共有 256 个可能的字符值（0-255），覆盖了大多数西欧语言的需求，但不支持中文、日文等东亚语言（这些需要多字节编码）。

而在JDK9之前，JVM因为String使用char数组存储，每个char占2个字节，所以即使字符串只需要1字节，它也要按照2字节进行分配，浪费了一半的内存空间。

到了JDK9之后，对于每个字符串，会先判断它是不是只有Latin-1字符，如果是，就按照1字节的规格进行分配内存，如果不是，就按照2字节的规格进行分配，这样便提高了内存使用率，同时GC次数也会减少，提升效率。

不过Latin-1编码集支持的字符有限，比如不支持中文字符，因此对于中文字符串，用的是UTF16编码（两个字节），所以用byte[]和char[]实现没什么区别。



##  15. String, StringBuffer 和 StringBuilder区别

**1. 可变性**

- String 不可变
- StringBuffer 和 StringBuilder 可变

**2. 线程安全**

- String 不可变，因此是线程安全的
- StringBuilder 不是线程安全的
- StringBuffer 是线程安全的，内部使用 synchronized 进行同步



## 16. 什么是StringJoiner（字符串连接器）？

StringJoiner是 Java 8 新增的一个 API，它基于 StringBuilder 实现，用于实现对字符串之间通过分隔符拼接的场景。

StringJoiner 有两个构造方法，第一个构造要求依次传入分隔符、前缀和后缀。第二个构造则只要求传入分隔符即可（前缀和后缀默认为空字符串）。

```java
StringJoiner(CharSequence delimiter, CharSequence prefix, CharSequence suffix)
StringJoiner(CharSequence delimiter)
```

有些字符串拼接场景，使用 StringBuffer 或 StringBuilder 则显得比较繁琐。

比如下面的例子：

```java
List<Integer> values = Arrays.asList(1, 3, 5);
StringBuilder sb = new StringBuilder("(");

for (int i = 0; i < values.size(); i++) {
	sb.append(values.get(i));
	if (i != values.size() -1) {
		sb.append(",");
	}
}

sb.append(")");
```

而通过StringJoiner来实现拼接List的各个元素，代码看起来更加简洁。

```java
List<Integer> values = Arrays.asList(1, 3, 5);
StringJoiner sj = new StringJoiner(",", "(", ")");

for (Integer value : values) {
	sj.add(value.toString());
}
```



## 17. String 类的常用方法有哪些？

- indexOf()：返回指定字符的索引。
- charAt()：返回指定索引处的字符。
- replace()：字符串替换。
- trim()：去除字符串两端空白。
- split()：分割字符串，返回一个分割后的字符串数组。
- getBytes()：返回字符串的 byte 类型数组。
- length()：返回字符串长度。
- toLowerCase()：将字符串转成小写字母。
- toUpperCase()：将字符串转成大写字符。
- substring()：截取字符串。
- equals()：字符串比较。



## 18. new String("hello")会创建几个对象？

- 在 Java 中，`new String("hello")` 可能创建 **1 个或 2 个对象**，取决于字符串常量池中是否已存在 `"hello"`：
  - **情况 1**：常量池中不存在 `"hello"`会创建 **2 个对象**：
    1. 字符串常量池中的 `"hello"` 对象（由字面量 `"hello"` 触发）。
    2. 堆内存中通过 `new` 创建的 `String` 对象（该对象的值指向常量池中的 `"hello"`）。
  - **情况 2**：常量池中已存在 `"hello"`只会创建 **1 个对象**：仅在堆内存中通过 `new` 创建一个 `String` 对象（该对象的值会指向复用常量池中的 `"hello"`）。



## 19. 什么是字符串常量池？

字符串常量池（String Constant Pool）是 Java 堆内存中专门用于存储字符串字面量的**缓存区域**，其核心作用是**复用字符串对象，减少内存消耗**。

- **工作原理**：当 Java 代码中出现字符串字面量（如 `"dabin"`）时，JVM 会先检查常量池：
  - 若该字符串已存在，则直接返回其引用；
  - 若不存在，则在常量池中创建该字符串并返回引用。
- **设计目的**：字符串是程序中最常用的数据类型之一，通过常量池复用相同的字符串，可以避免重复创建相同内容的对象，提高内存利用率和运行效率。
- **相关特性**：
  - 常量池中的字符串对象是**不可变的**（`String` 类被 `final` 修饰），确保复用安全。
  - 可以通过 `intern()` 方法手动将堆中的字符串对象加入常量池（若不存在则创建，返回常量池引用）。



## 20. String最大长度是多少？

Java 中 `String` 的最大长度取决于两个限制：

- **编译期**：字符串字面量的长度不能超过 `65535`（`2^16 - 1`），这是由类文件格式（`CONSTANT_Utf8_info` 结构）规定的，超过会导致编译失败。
- **运行期**：`String` 内部用 `char[]` 存储字符（JDK 9 前），数组长度是 `int` 类型，因此最大长度为 `Integer.MAX_VALUE`（`2^31 - 1`）。但实际中受内存限制，几乎无法达到这个值。

#### 1. 达到最大长度需要多大内存？

以 JDK 8 为例（`String` 基于 `char[]` 实现，每个 `char` 占 2 字节）：

- 若字符串长度为 `Integer.MAX_VALUE`（约 21 亿字符），仅字符数组就需要 `21亿 × 2字节 ≈ 4GB` 内存。
- 加上 `String` 对象本身的头部信息（约 16 字节）和数组的头部信息（约 24 字节），总内存约 **4GB+**。这远超普通应用的内存配置，因此实际中不可能创建这么长的字符串。

#### 2. String 存储在 JVM 的哪块区域？

- **字符串常量池**：JDK 7 及以后，常量池移至 **堆内存** 中，存储字符串字面量和通过 `intern()` 方法加入的字符串引用。
- **堆内存**：通过 `new String(...)` 创建的字符串对象，以及字符串对应的 `char[]` 数组（JDK 8 及以前），都存储在堆中。
- **栈内存**：仅存储字符串变量的引用（指向堆或常量池中的对象），不存储字符串本身。

#### 3. 什么情况下字符串会存储在常量池？

- **字符串字面量**：如 `String s = "abc";`，字面量 `"abc"` 会被加入常量池（首次出现时）。
- **常量表达式拼接**：如 `String s = "a" + "b";`，编译期会优化为 `"ab"`，直接存储在常量池。
- **调用 `intern()` 方法**：如 `new String("abc").intern()`，若常量池中没有 `"abc"`，会将其引用加入常量池（JDK 7 及以后）。

#### 4. 常量池中的字符串最大长度是 2^31-1 吗？

**不是**。常量池中的字符串（字面量）受限于类文件格式，最大长度为 `65535`（`2^16 - 1`）。即使通过 `intern()` 方法将堆中更长的字符串加入常量池，其引用可以指向堆中长度为 `2^31 - 1` 的字符串，但常量池本身存储的只是引用，而非字符串数据本身。

因此，常量池直接存储的字符串字面量最大为 65535，而通过 `intern()` 关联的字符串最大长度仍受限于运行期的 `Integer.MAX_VALUE`。



## 21. Object常用方法有哪些？

Java 中的 `java.lang.Object` 类是所有类的根类，任何类都直接或间接继承自它。它定义了一些核心方法，以下是最常用的几个：

#### 1. `equals(Object obj)`

- **作用**：判断当前对象与参数对象是否 "相等"。
- **默认实现**：比较两个对象的内存地址（即 `this == obj`）。
- **注意**：通常需要重写该方法（如 String、Integer 等都重写了），以实现业务意义上的相等（例如比较对象的属性值）。

```java
// 示例：重写 equals 比较对象属性
class Person {
    String name;
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass()!= obj.getClass()) return false;
        Person person = (Person) obj;
        return Objects.equals(name, person.name);
    }
}
```

#### 2. `hashCode()`

- **作用**：返回对象的哈希码（一个 int 值），主要用于哈希表（如 HashMap、HashSet）中快速定位对象。
- **默认实现**：根据对象的内存地址计算哈希码。
- 重要约定
  - 若 `a.equals(b) == true`，则 `a.hashCode()` 必须等于 `b.hashCode()`。
  - 若重写 `equals()`，必须同时重写 `hashCode()`，否则会导致哈希表无法正常工作。

#### 3. `toString()`

- **作用**：返回对象的字符串表示形式，便于打印和调试。
- **默认实现**：返回 `类名@哈希码的十六进制`（如 `Person@1b6d3586`）。
- **常用场景**：重写该方法以返回对象的关键属性（如 `Person{name="张三"}`）。

#### 4. `getClass()`

- **作用**：返回对象的运行时类（`Class` 对象）。
- **特点**：返回的 `Class` 对象是反射机制的核心，可用于获取类的信息（如方法、属性、注解等）。

```java
String s = "hello";
Class<?> cls = s.getClass(); // 返回 String.class
System.out.println(cls.getName()); // 输出 "java.lang.String"
```

#### 5. `clone()`

- **作用**：创建并返回当前对象的 "副本"（浅拷贝）。
- 注意
  - 类必须实现 `Cloneable` 接口（标记接口，否则调用时会抛 `CloneNotSupportedException`）。
  - 默认是浅拷贝：对于引用类型属性，只复制引用地址，不复制对象本身。

#### 6. `wait()、notify()、notifyAll()`

- **作用**：用于多线程间的协作，实现线程的等待 / 唤醒机制。
- **使用场景**：结合 `synchronized` 锁，控制线程对共享资源的访问（如生产者 - 消费者模型）。
- **注意**：必须在同步代码块（或同步方法）中调用，否则会抛 `IllegalMonitorStateException`



## 22. 讲讲深拷贝和浅拷贝？

#### 一、深拷贝与浅拷贝：核心概念与区别

深拷贝（Deep Copy）和浅拷贝（Shallow Copy）是编程中复制数据的两种核心方式，**核心差异在于是否复制「引用类型的嵌套数据」**：

- 浅拷贝：仅复制数据的「表层结构」，嵌套的引用类型（如对象、数组）仍共享同一块内存；
- 深拷贝：复制数据的「所有层级结构」，嵌套的引用类型也会被全新创建，新旧数据完全独立，互不影响。

#### 二、先理解：值类型 vs 引用类型（基础前提）

两种拷贝的差异根源在于数据类型的存储方式：

| 类型     | 存储方式                         | 示例（JavaScript）              | 拷贝特点                       |
| -------- | -------------------------------- | ------------------------------- | ------------------------------ |
| 值类型   | 直接存储值（栈内存）             | Number、String、Boolean、Symbol | 拷贝即复制值，天然 “深”        |
| 引用类型 | 存储内存地址（栈），值存在堆内存 | Object、Array、Function、Map    | 拷贝默认复制地址，需显式深拷贝 |

#### 三、常见实现方式

**浅拷贝**

- 方式 1：实现`Cloneable`接口，重写`clone()`（默认浅拷贝）；
- 方式 2：拷贝构造器（嵌套引用类型直接赋值）。

```java
// 浅拷贝构造器示例
class User {
    String name;
    Address addr; // 嵌套引用类型
    // 浅拷贝构造器
    public User(User other) {
        this.name = other.name; // 值类型直接赋值
        this.addr = other.addr; // 引用类型共享地址
    }
}
```

**深拷贝**

- 方式 1：手动递归拷贝（嵌套对象也通过 clone / 拷贝构造器新建）；
- 方式 2：序列化 + 反序列化（实现`Serializable`，字节流重建对象）；

```java
// 深拷贝构造器示例
class User {
    String name;
    Address addr;
    // 深拷贝构造器
    public User(User other) {
        this.name = other.name;
        this.addr = new Address(other.addr); // 嵌套对象新建实例
    }
}
```

#### 四、浅拷贝vs引用

**只是引用赋值（根本没拷贝）**

```java
A a1 = new A();
A a2 = a1;
```

**浅拷贝构造器**

```java
class User {
    String name;
    Address addr;

    public User(User other) {
        this.name = other.name;
        this.addr = other.addr;
    }
}
```

**最本质的区别**

| 对比点                 | `a2 = a1` | 浅拷贝构造器 |
| ---------------------- | --------- | ------------ |
| 是否 new 新对象        | ❌         | ✅            |
| 堆中 User 对象数量     | 1 个      | 2 个         |
| 引用字段是否共享       | 是        | 是           |
| 修改引用字段影响原对象 | 会        | 会           |



## 23. 两个对象的hashCode()相同，则 equals()是否也一定为 true？

**不一定。**

在 Java 中，`hashCode()` 和 `equals()` 的约定是：

1. 如果两个对象的 `equals()` 返回 `true`，则它们的 `hashCode()` 必须相等；
2. 但反过来，**两个对象的 `hashCode()` 相等时，`equals()` 不一定返回 `true`**。

这种情况称为 “哈希冲突”（Hash Collision）—— 不同的对象可能计算出相同的哈希码。

```java
String str1 = "Aa";
String str2 = "BB";

System.out.println(str1.hashCode()); // 输出 2112
System.out.println(str2.hashCode()); // 输出 2112（与str1相同）
System.out.println(str1.equals(str2)); // 输出 false（显然不是同一个对象）
```

这里 `str1` 和 `str2` 的哈希码相同，但 `equals()` 返回 `false`，因为它们的实际内容不同。

这也是为什么在哈希表（如 `HashMap`）中：

- 首先通过 `hashCode()` 定位对象可能存在的桶位置；
- 然后必须通过 `equals()` 进一步判断对象是否真正相等（避免哈希冲突导致的误判）。

因此，**`hashCode()` 相同只是 `equals()` 为 `true` 的必要条件，而非充分条件**。



## 24. 为什么重写 equals 时一定要重写 hashCode？

在 Java 中，重写 `equals()` 时必须同时重写 `hashCode()`，这是由两者的**约定规则**和**哈希表的工作原理**共同决定的，否则会导致程序逻辑错误（尤其是在使用哈希集合 / 映射时）。

**核心原因：遵守约定，保证哈希表正确性**

Java 规范对 `equals()` 和 `hashCode()` 有明确约定：

1. **若 `a.equals(b) == true`，则 `a.hashCode()` 必须等于 `b.hashCode()`**；
2. 若 `a.hashCode()` 不等于 `b.hashCode()`，则 `a.equals(b)` 必须为 `false`。

如果只重写 `equals()` 而不重写 `hashCode()`，会**违反这个约定**，导致依赖哈希码的集合（如 `HashMap`、`HashSet`）出现逻辑错误。

**具体问题场景**

以 `HashSet` 为例（其核心是通过哈希码判断对象是否重复）：

- `HashSet` 添加元素时，先通过 `hashCode()` 计算存储位置，再用 `equals()` 检查是否存在重复对象。

假设存在两个对象 `a` 和 `b`：

- `a.equals(b) == true`（逻辑上是同一个对象）；
- 但未重写 `hashCode()`，导致 `a.hashCode()!= b.hashCode()`（`默认按内存地址计算`）。

此时，`HashSet` 会认为 `a` 和 `b` 是不同对象，允许同时存入，违反了 `HashSet` 去重的特性。



## 25. equals和==有什么区别？

在 Java 中，`equals` 和 `==` 都用于比较，但两者的比较逻辑和适用场景有本质区别：

#### 1. `==`：比较 “值” 本身

- **作用**：直接比较两个变量存储的 “值” 是否相同。

- **具体表现**：

  - 对于 **基本类型变量**（如 `int`、`char` 等）：比较的是变量存储的**实际数据值**（如 `10`、`'a'`）。
  - 对于 **引用类型变量**（如对象、数组）：比较的是变量存储的**内存地址**（即两个变量是否指向堆内存中的同一个对象）。

- 示例：

  ```java
  // 基本类型比较
  int a = 10;
  int b = 10;
  System.out.println(a == b); // true（值相同）
  
  // 引用类型比较
  String s1 = new String("abc");
  String s2 = new String("abc");
  System.out.println(s1 == s2); // false（内存地址不同，指向不同对象）
  String s3 = s1;
  System.out.println(s1 == s3); // true（指向同一个对象）
  ```

#### 2. `equals`：对象的 “逻辑相等” 比较

- **作用**：是 `Object` 类定义的方法，用于判断两个对象**在业务逻辑上是否相等**（而非地址是否相同）。
- **默认实现**：`Object` 类的 `equals` 方法本质上是 `return this == obj;`，即和 `==` 效果一致（比较地址）。
- **实际用途**：大多数类会**重写 `equals` 方法**，定义自己的 “相等” 逻辑（通常基于对象的属性）。例如：
  - `String` 类的 `equals` 比较字符串的**内容是否相同**；
  - `Integer` 类的 `equals` 比较**数值是否相同**。



## 26. final, finally, finalize 的区别

`final`、`finally`、`finalize` 是 Java 中名称相似但含义和用途完全不同的三个概念，主要区别如下：

#### 1. `final`（关键字）

- **功能**：用于修饰类、方法或变量，限制其可变性。

- 具体用法

  ```java
  final class MyClass {} // 无法被其他类继承
  
  class Parent {
      final void method() {} // 子类无法重写此方法
  }
  
  final int num = 10; 
  num = 20; // 编译错误：无法修改final变量
  ```

- **核心作用**：保证不可变性，提高安全性和稳定性（如线程安全场景）。

#### 2. `finally`（关键字）

- **功能**：用于异常处理机制，定义**必须执行的代码块**。

- 使用场景

  ```java
  try {
      // 可能发生异常的代码
      int result = 10 / 0;
  } catch (ArithmeticException e) {
      System.out.println("捕获异常");
  } finally {
      System.out.println("无论是否异常，我都会执行"); // 一定会执行
  }
  ```

- **核心作用**：释放资源（如关闭文件、网络连接等），确保清理操作不被遗漏。

#### 3. `finalize`（方法）

- **功能**：是 `Object` 类的一个实例方法，用于对象被垃圾回收前的 “清理工作”。

- 特点

  - 由 JVM 自动调用，程序员无法主动触发（只能通过 `System.gc()` 建议垃圾回收，但不确定执行时机）。

  - 已被标记为过时（@Deprecated），因为其执行时机不可控，可能导致资源泄漏或程序性能问题。

    ```java
    class MyObject {
        @Override
        protected void finalize() throws Throwable {
            // 资源清理逻辑（不推荐使用）
            System.out.println("对象即将被回收");
        }
    }
    ```

- **替代方案**：推荐使用 `try-with-resources` 或手动调用关闭方法（如 `close()`）释放资源。

#### 总结对比

| 类型       | 本质              | 用途                         | 特点                        |
| ---------- | ----------------- | ---------------------------- | --------------------------- |
| `final`    | 关键字            | 限制类、方法、变量的可变性   | 编译期生效，主动控制不可变  |
| `finally`  | 关键字            | 异常处理中定义必须执行的代码 | 运行期生效，确保资源释放    |
| `finalize` | `Object` 类的方法 | 对象回收前的清理（已过时）   | 由 JVM 被动调用，时机不确定 |

三者仅名称相似，实际功能和使用场景毫无关联，需注意区分。



## 27. Java中的finally一定会被执行吗？

#### 一、`finally` 一定会执行的常规场景

在标准的异常处理流程中，无论 `try` 块是否发生异常、`catch` 块是否捕获异常，甚至 `try`/`catch` 中是否有 `return` 语句，`finally` 块都会执行。

```java
public static int test() {
    try {
        System.out.println("try 块");
        return 1; // 执行到此处后，会先执行 finally 再返回
    } catch (Exception e) {
        System.out.println("catch 块");
        return 2;
    } finally {
        System.out.println("finally 块"); // 一定会执行
    }
}
```

#### 二、`finally` 不会执行的特殊情况

- **JVM 提前终止：** 如果在 `try`/`catch` 块中调用了 `System.exit(0)`（强制终止 JVM），则 `finally` 块不会执行。
- **线程被中断：** 如果当前线程在执行 `try`/`catch` 块时被强制中断（如其他线程调用 `Thread.stop()`，该方法已过时但理论上存在），`finally` 块可能无法执行。
- **硬件 / 系统级异常：** 若发生硬件故障（如断电）、操作系统崩溃等极端情况，JVM 终止运行，`finally` 自然无法执行。



## 28. 方法重载和重写的区别？

方法重载（Overload）和方法重写（Override）是 Java 中两个重要的多态相关概念，主要区别如下：

#### 1. 方法重载（Overload）

- **定义**：在**同一个类中**，多个方法具有**相同的方法名**，但**参数列表不同**（参数类型、个数、顺序不同），则称为重载。
- 特点
  - 必须在同一个类中。
  - 方法名相同，参数列表不同（与返回值类型、修饰符无关）。
  - 是编译期多态（编译器根据参数自动选择调用的方法）。

```java
class Calculator {
    // 重载：参数个数不同
    int add(int a, int b) { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
    
    // 重载：参数类型不同
    double add(double a, double b) { return a + b; }
    
    // 重载：参数顺序不同（不推荐，可读性差）
    String connect(String a, int b) { return a + b; }
    String connect(int a, String b) { return a + b; }
}
```

#### 2. 方法重写（Override）

- **定义**：在**继承关系中**，子类定义了与父类**方法名相同、参数列表相同、返回值类型兼容**的方法，则称为重写（覆盖）。
- 特点
  - 必须存在继承关系（子类重写父类方法）。
  - 方法名、参数列表、返回值类型（或其子类）必须完全一致（协变返回类型）。
  - 子类方法的访问权限不能严于父类（如父类是 `public`，子类不能是 `private`）。
  - 父类的 `final` 方法不能被重写；`static` 方法属于类，不存在重写（只能隐藏）。
  - 是运行期多态（运行时根据对象实际类型决定调用的方法）。

```java
class Animal {
    void sound() {
        System.out.println("动物发出声音");
    }
}

class Dog extends Animal {
    // 重写父类方法
    @Override // 注解可校验重写是否正确
    void sound() {
        System.out.println("狗汪汪叫");
    }
}

// 测试
Animal animal = new Dog();
animal.sound(); // 输出"狗汪汪叫"（运行时多态）
```

#### 核心区别总结

| 维度       | 方法重载（Overload）       | 方法重写（Override）           |
| ---------- | -------------------------- | ------------------------------ |
| 存在范围   | 同一个类中                 | 父子类之间                     |
| 方法名     | 相同                       | 相同                           |
| 参数列表   | 必须不同                   | 必须相同                       |
| 返回值类型 | 可不同（与重载无关）       | 必须相同或为其子类（协变返回） |
| 访问修饰符 | 无限制                     | 子类不能严于父类               |
| 多态类型   | 编译期多态（静态多态）     | 运行期多态（动态多态）         |
| 目的       | 方便调用同一功能的不同实现 | 子类定制父类的行为             |

简单说：重载是 “同名不同参”，解决同一类中功能相似的方法调用问题；重写是 “父子类同名同参”，实现子类对父类行为的个性化定制。



## 29. 接口与抽象类区别？

接口（Interface）和抽象类（Abstract Class）是 Java 中实现抽象和多态的两种重要机制，它们的核心区别如下：

#### 1. 定义与结构

**抽象类**

- 用 `abstract class` 定义，可包含**抽象方法**（无实现）和**具体方法**（有实现）。
- 可声明**成员变量**（可被继承或访问）、**构造器**（用于子类初始化）。

```java
abstract class Animal {
    // 成员变量
    String name;
    
    // 构造器
    public Animal(String name) {
        this.name = name;
    }
    
    // 抽象方法（无实现）
    abstract void sound();
    
    // 具体方法（有实现）
    void eat() {
        System.out.println(name + "在吃东西");
    }
}
```

**接口**

- 用 `interface` 定义，JDK 8 前只能包含**抽象方法**（默认 `public abstract`）；JDK 8 及以后可包含**默认方法**（`default`，有实现）和**静态方法**（`static`）。
- 成员变量默认是 `public static final`（常量），不能有构造器。

```java
interface Flyable {
    // 常量（默认public static final）
    int MAX_HEIGHT = 1000;
    
    // 抽象方法（默认public abstract）
    void fly();
    
    // 默认方法（JDK 8+）
    default void land() {
        System.out.println("降落");
    }
}
```

#### 2. 继承 / 实现规则

- **抽象类**
  - 子类通过 `extends` 继承抽象类，**只能单继承**（Java 不支持多继承）。
  - 子类必须重写抽象类中**所有抽象方法**（除非子类也是抽象类）。
- **接口**
  - 类通过 `implements` 实现接口，**可同时实现多个接口**（弥补单继承限制）。
  - 实现类必须重写接口中**所有抽象方法**（除非实现类是抽象类）。

#### 3.核心区别总结

| 维度            | 抽象类（Abstract Class）        | 接口（Interface）                              |
| --------------- | ------------------------------- | ---------------------------------------------- |
| 关键字          | `abstract class`                | `interface`                                    |
| 方法类型        | 可包含抽象方法和具体方法        | JDK 8+ 可包含抽象方法、默认方法、静态方法      |
| 成员变量        | 可定义任意变量（非 final）      | 只能是 `public static final` 常量              |
| 构造器          | 有构造器（用于子类初始化）      | 无构造器                                       |
| 继承 / 实现方式 | 子类 `extends` 继承，**单继承** | 类 `implements` 实现，**多实现**               |
| 访问修饰符      | 可使用 `public`、`protected` 等 | 方法和变量默认 `public`（JDK 9+ 支持私有方法） |
| 设计意义        | 体现继承关系，抽取共性代码      | 定义行为规范，实现多态扩展                     |



## 30. 常见的Exception有哪些？

**常见的RuntimeException：**

1. `ClassCastException` //类型转换异常
2. `IndexOutOfBoundsException` //数组越界异常
3. `NullPointerException` //空指针
4. `ArrayStoreException` //数组存储异常
5. `NumberFormatException` //数字格式化异常
6. `ArithmeticException` //数学运算异常

**checked Exception：**

1. `NoSuchFieldException` //反射异常，没有对应的字段
2. `ClassNotFoundException` //类没有找到异常
3. `IllegalAccessException` //安全权限异常，可能是反射时调用了private方法



## 31. Error和Exception的区别？

**Error**：JVM 无法解决的严重问题，如栈溢出`StackOverflowError`、内存溢出`OOM`等。程序无法处理的错误。

**Exception**：其它因编程错误或偶然的外在因素导致的一般性问题。可以在代码中进行处理。如：空指针异常、数组下标越界等。



## 32. 运行时异常和非运行时异常（checked）的区别？

`unchecked exception`包括`RuntimeException`和`Error`类，其他所有异常称为检查（checked）异常。

1. `RuntimeException`由程序错误导致，应该修正程序避免这类异常发生。
2. `checked Exception`由具体的环境（读取的文件不存在或文件为空或sql异常）导致的异常。必须进行处理，不然编译不通过，可以catch或者throws。



## 33. throw和throws的区别？

在 Java 中，`throw` 和 `throws` 都用于异常处理，但用途和用法有明显区别：

#### 1. `throw`：手动抛出异常对象

- **作用**：在方法内部**主动抛出一个具体的异常对象**（触发异常）。
- **使用场景**：当程序满足某种错误条件时，手动创建异常对象并抛出，中断当前流程。
- **语法**：`throw new 异常类(异常信息);`（后面通常接 `;` 或控制语句）。

#### 2. `throws`：声明方法可能抛出的异常

- **作用**：在方法声明处**声明该方法可能抛出的异常类型**，告知调用者需要处理这些异常。
- **使用场景**：当方法内部可能产生 checked 异常（受检异常），且不打算在当前方法中处理时，用 `throws` 声明，由调用者处理。

- **语法**：`方法返回值 方法名(参数) throws 异常类型1, 异常类型2... { ... }`。



## 34. BIO/NIO/AIO区别的区别？

BIO、NIO、AIO 是 Java 中三种不同的 I/O 模型，主要区别体现在处理 I/O 操作的方式和效率上，尤其在高并发场景下表现差异显著：

#### 1. BIO（Blocking I/O，阻塞式 I/O）

- **核心特点**：同步阻塞，即 I/O 操作（如读写）会阻塞线程，直到操作完成。
- 工作方式
  - 每个连接对应一个线程，线程在等待 I/O 操作（如网络读取、文件写入）时会被阻塞，无法处理其他任务。
  - 例如：`Socket`、`ServerSocket` 就是典型的 BIO 实现。
- 优缺点
  - 优点：模型简单，编程容易理解。
  - 缺点：高并发下线程数量激增，内存占用大，线程切换成本高，性能瓶颈明显。
- **适用场景**：连接数少且固定的场景（如早期的简单服务）。

#### 2. NIO（Non-blocking I/O，非阻塞式 I/O）

- **核心特点**：同步非阻塞，通过**通道（Channel）**、**缓冲区（Buffer）** 和**选择器（Selector）** 实现多路复用。
- 工作方式
  - **通道（Channel）**：双向操作（可读可写），替代 BIO 中的流（单向）。
  - **缓冲区（Buffer）**：数据读写的容器，所有 I/O 操作都通过缓冲区进行。
  - **选择器（Selector）**：一个线程可管理多个通道，通过轮询监听通道的 I/O 事件（如连接就绪、数据可读），仅在事件发生时才处理，避免线程阻塞。
- 优缺点
  - 优点：单线程可处理多个连接，减少线程数量，降低资源消耗，适合高并发。
  - 缺点：需要手动处理缓冲区和事件，编程复杂度高；仍需主动轮询事件（同步特性）。
- **适用场景**：高并发、连接数多但数据量小的场景（如聊天服务器、RPC 框架），典型实现如 `Java NIO` 包。

#### 3. AIO（Asynchronous I/O，异步 I/O）

- **核心特点**：异步非阻塞，I/O 操作完全由操作系统完成后通知应用程序，程序无需主动等待。
- 工作方式
  - 发起 I/O 操作后，线程立即返回继续执行其他任务，无需阻塞。
  - 当 I/O 操作完成（成功或失败），操作系统通过回调函数或事件通知应用程序处理结果。
- 优缺点
  - 优点：完全异步，资源利用率最高，编程模型更简洁（无需轮询）。
  - 缺点：依赖操作系统底层支持（如 Windows 的 IOCP、Linux 的 epoll），Java 中的 AIO 实现不够成熟，实际应用较少。
- **适用场景**：连接数多且数据量大的场景（如文件服务器），Java 中通过 `java.nio.channels.AsynchronousSocketChannel` 等类实现。

#### 核心区别总结

| 维度           | BIO（同步阻塞）    | NIO（同步非阻塞）              | AIO（异步非阻塞）              |
| -------------- | ------------------ | ------------------------------ | ------------------------------ |
| 阻塞性         | I/O 操作阻塞线程   | I/O 操作不阻塞线程，需轮询事件 | I/O 操作不阻塞线程，由系统通知 |
| 线程模型       | 一个连接一个线程   | 单线程管理多个连接（多路复用） | 线程仅处理完成的 I/O 事件      |
| 核心组件       | 流（Stream）       | 通道、缓冲区、选择器           | 异步通道、回调 / Future        |
| 编程复杂度     | 简单               | 较高                           | 中（依赖回调）                 |
| 性能（高并发） | 差（线程资源耗尽） | 好（减少线程开销）             | 更好（完全异步）               |
| 典型应用       | 早期简单服务       | Netty 框架、高并发服务器       | 大型文件传输（应用较少）       |

#### 一句话概括

- **BIO**：我等你做完（阻塞），一个人陪一个客户。
- **NIO**：我不等你，但会时不时看你好了没（轮询），一个人陪多个客户。
- **AIO**：你做完了告诉我（回调），我先忙别的，客户好了再处理。



## 35. 守护线程是什么？

守护线程（Daemon Thread）是 Java 中一种特殊线程，主要用于为其他线程（用户线程）提供服务，如垃圾回收线程（GC）就是典型的守护线程。

- **特点**：当所有用户线程结束时，守护线程会自动终止（无论是否执行完毕），不会阻止 JVM 退出。
- **设置方式**：通过 `thread.setDaemon(true)` 标记，且必须在 `start()` 前设置。
- **用途**：适合执行后台任务（如日志记录、内存监控），不能用于处理核心业务逻辑（可能被强制终止）。



##  36. Java 支持多继承吗？

**不支持类的多继承**，但支持接口的多实现，以此间接实现类似多继承的功能：

- **类的单继承**：Java 中一个类只能直接继承一个父类（`extends` 关键字），避免多继承带来的 “菱形问题”（方法冲突）
- **接口的多实现**：一个类可以同时实现多个接口（`implements` 关键字），通过实现接口中的方法扩展功能。

**Java不支持多继承的原因：**

- 出于安全性的考虑，如果子类继承的多个父类里面有相同的方法或者属性，子类将不知道具体要继承哪个。
- Java提供了接口和内部类以达到实现多继承功能，弥补单继承的缺陷。



## 37. 如何实现对象克隆？

对象克隆（复制）分为浅拷贝和深拷贝，实现方式如下：

**浅拷贝**：

1. 类实现 `Cloneable` 接口（标记接口，无方法）。
2. 重写 `Object` 类的 `clone()` 方法，调用 `super.clone()`。

```java
class Person implements Cloneable {
    String name;
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // 浅拷贝
    }
}
```

**深拷贝**：

1. 方式 1：对引用类型成员递归调用 `clone()`（需所有引用类型都实现 `Cloneable`）。
2. 方式 2：通过序列化（如 `ObjectInputStream`/`ObjectOutputStream`）将对象写入流再读出，实现完全独立的复制。



## 38. 同步和异步的区别？

核心区别在于**调用方是否需要等待操作完成**：

- **同步（Synchronous）**：调用方发起操作后，必须等待操作执行完毕才能继续执行后续代码（如同步方法调用、BIO 读写）。例：打电话时，需等待对方回应才能继续交流。
- **异步（Asynchronous）**：调用方发起操作后，无需等待，可立即执行后续代码；操作完成后通过回调、事件等方式通知调用方（如 AIO、消息队列）。例：发邮件时，发送后无需等待对方查看，可直接做其他事。



## 39. 阻塞和非阻塞的区别？

核心结论：阻塞是调用操作后需等待结果返回才继续执行，非阻塞是调用后立即返回，无需等待可继续处理其他任务。

#### 核心区别

- 阻塞：操作未完成时，当前线程 / 进程会暂停，直到结果返回才恢复执行，期间无法做其他事。
- 非阻塞：操作发起后立即返回状态（成功 / 未完成），即便结果未出，也能继续执行后续代码，需主动轮询或通过回调获取最终结果。

#### 关键场景对比

- 阻塞：如普通文件读取、同步网络请求，代码逻辑线性且简单，但资源利用率低。
- 非阻塞：如异步 IO、并发编程，资源利用率高，能处理更多任务，但代码复杂度更高（需处理状态同步）



## 40. Java8的新特性有哪些？

Lambda 表达式：Lambda允许把函数作为一个方法的参数

Stream API ：新添加的Stream API（java.util.stream） 把真正的函数式编程风格引入到Java中

默认方法：默认方法就是一个在接口里面有了一个实现的方法。

Optional 类 ：Optional 类已经成为 Java 8 类库的一部分，用来解决空指针异常。

Date Time API ：加强对日期与时间的处理。



## 41. 序列化和反序列化

序列化（Serialization）和反序列化（Deserialization）是 Java 中用于处理对象持久化和网络传输的重要机制，核心是将对象的状态转换为可存储或传输的形式，以及将其恢复为对象。

#### 1. 基本概念

- **序列化**：将内存中的**对象状态**（属性值）转换为**字节序列**（如二进制数据），以便存储到文件、数据库，或通过网络传输到其他系统。
- **反序列化**：将序列化生成的**字节序列**恢复为内存中的**对象**，还原其状态。

#### 2. 实现方式（Java 标准）

Java 通过 `java.io.Serializable` 接口和相关流类实现序列化：

**（1）让类支持序列化**

- 类需实现 `Serializable` 接口（标记接口，无方法，仅用于标识该类可序列化）。
- 若类有引用类型成员，该成员也需支持序列化（除非用 `transient` 修饰）。

```java
import java.io.Serializable;

// 实现Serializable接口，支持序列化
class User implements Serializable {
    private String name;
    private int age;
    // transient修饰的成员不会被序列化
    private transient String password; 

    // 构造器、getter/setter省略
}
```

**（2）序列化操作（ObjectOutputStream）**

使用 `ObjectOutputStream` 的 `writeObject()` 方法将对象写入输出流（如文件、网络流）。

```java
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

public class SerializeDemo {
    public static void main(String[] args) throws Exception {
        User user = new User("张三", 20, "123456");
        
        // 创建输出流，将对象序列化到文件
        try (ObjectOutputStream oos = new ObjectOutputStream(
             new FileOutputStream("user.ser"))) {
            oos.writeObject(user); // 序列化对象
            System.out.println("序列化完成");
        }
    }
}
```

**（3）反序列化操作（ObjectInputStream）**

```java
import java.io.FileInputStream;
import java.io.ObjectInputStream;

public class DeserializeDemo {
    public static void main(String[] args) throws Exception {
        // 从文件读取字节序列，反序列化为对象
        try (ObjectInputStream ois = new ObjectInputStream(
             new FileInputStream("user.ser"))) {
            User user = (User) ois.readObject(); // 反序列化
            System.out.println("反序列化结果：" + user.getName() + ", " + user.getAge());
            System.out.println("password（transient）：" + user.getPassword()); // 输出null
        }
    }
}
```

#### 3. 关键细节

- **transient 关键字**：修饰的成员变量不会被序列化，反序列化后会恢复为默认值（如 `null`、`0`）。
- **serialVersionUID**：序列化时会生成一个版本号（`serialVersionUID`），反序列化时会校验该版本号是否与类当前版本一致，不一致则抛出 `InvalidClassException`。

建议显式声明以避免类结构变化导致反序列化失败：

```java
class User implements Serializable {
    private static final long serialVersionUID = 1L; // 显式声明版本号
    //...
}
```



## 42. 实现序列化和反序列化为什么要实现 Serializable 接口?

在 Java 中，实现 `Serializable` 接口是对象支持序列化和反序列化的**必要条件**，这与 Java 序列化机制的设计逻辑密切相关：

#### 核心原因：`Serializable` 是 “可序列化” 的标记接口

`Serializable` 接口是一个**标记接口（Marker Interface）**—— 它没有定义任何方法，仅作为一种 “标识”，告诉 JVM：“这个类的对象允许被序列化”。

`Serializable` 接口是 Java 序列化机制的 “准入证”：

- 它通过标记机制告诉 JVM “该类对象可被序列化”。
- 未实现此接口的类，其对象无法被序列化 / 反序列化（会抛异常）。
- 这一设计确保了序列化操作的可控性，避免意外处理不适合序列化的对象。



## 43. 实现 Serializable 接口之后，为什么还要显示指定 serialVersionUID 的值?

在实现 `Serializable` 接口后，显式指定 `serialVersionUID` 的值主要是为了**保证序列化和反序列化的版本兼容性**，避免类结构发生微小变化时导致反序列化失败。

#### 1. `serialVersionUID` 的作用

`serialVersionUID` 是一个 `static final long` 类型的常量，用于标识类的**序列化版本**。其核心作用是：

- 序列化时，JVM 会将当前类的 `serialVersionUID` 写入字节序列中；

- 反序列化时，JVM 会将字节序列中存储的 `serialVersionUID` 与当前类的 `serialVersionUID` 进行比对：
  - 若一致：认为版本兼容，反序列化正常进行；
  - 若不一致：抛出 `InvalidClassException`，反序列化失败。

#### 2. 为什么需要 “显式指定”？

如果不显式声明 `serialVersionUID`，JVM 会**在编译时自动生成一个**，生成规则依赖于类的结构（如类名、属性、方法、修饰符等）。

这种自动生成的方式存在严重问题：**类的结构发生微小变化（即使是无关紧要的修改），都会导致自动生成的 `serialVersionUID` 改变**。

例如：

- 给类新增一个无关的属性；
- 给方法增加一个注释；
- 调整属性的访问修饰符（如从 `private` 改为 `protected`）

这些修改本应不影响反序列化（旧版本序列化的对象仍可被新版本类正确解析），但由于自动生成的 `serialVersionUID` 改变，会导致反序列化失败



## 44. static 属性为什么不会被序列化?

因为序列化是针对对象而言的，而 static 属性优先于对象存在，随着类的加载而加载，所以不会被序列化.

看到这个结论，是不是有人会问，serialVersionUID 也被 static 修饰，为什么 serialVersionUID 会被序列化? 其实 serialVersionUID 属性并没有被序列化，JVM 在序列化对象时会自动生成一个 serialVersionUID，然后将我们显示指定的 serialVersionUID 属性值赋给自动生成的 serialVersionUID.



##  45. transient关键字的作用？

在 Java 中，`transient` 关键字用于修饰类的成员变量，其核心作用是**阻止该变量被序列化**，即当对象进行序列化操作时，被 `transient` 修饰的变量会被忽略，不写入字节序列中。

#### 具体特性：

**1.序列化时被忽略**

当对象通过 `ObjectOutputStream` 序列化时，`transient` 变量的值不会被保存到字节序列中。例如：

```java
class User implements Serializable {
    private String name;
    private transient String password; // 被transient修饰
    
    // 构造器、getter/setter省略
}

// 序列化
User user = new User("张三", "123456");
// 序列化后，字节序列中仅包含name的值，password被忽略
```

**2.反序列化时恢复默认值**

反序列化时，被 `transient` 修饰的变量不会从字节序列中恢复，而是被赋予该类型的默认值（如 `null` 对象、`0` 数值类型）：

```java
// 反序列化
User deserializedUser = (User) ois.readObject();
System.out.println(deserializedUser.getName()); // "张三"（正常恢复）
System.out.println(deserializedUser.getPassword()); // null（默认值）
```

#### 适用场景：

- **敏感数据**：如密码、令牌等，避免序列化到文件或网络传输中导致泄露。
- **临时数据**：仅在内存中临时使用、无需持久化的变量（如缓存的中间结果）。
- **不可序列化的成员**：若对象的引用类型成员未实现 `Serializable`，可通过 `transient` 修饰避免序列化时抛出异常。



## 46. 什么是反射？

在 Java 中，反射（Reflection）是指程序在**运行时**可以访问、检测和修改自身结构及行为的能力。简单来说，就是 Java 程序可以在运行时 “看透” 自身的类、方法、字段等信息，并动态操作它们，而无需在编译期就确定这些信息。

#### 反射的核心作用

1. **动态获取类信息**：运行时获取类的名称、父类、接口、字段、方法、注解等元数据。
2. **动态创建对象**：无需在编译期知道类名，运行时通过类的全限定名创建实例。
3. **动态调用方法**：运行时调用任意类的任意方法（包括私有方法）。
4. **动态操作字段**：运行时访问或修改任意类的字段（包括私有字段）。

#### 反射的实现基础

反射的功能主要依赖于 Java 的`java.lang.reflect`包，核心类包括：

- `Class`：代表类的字节码对象，是反射的入口（所有类的实例都可以通过`getClass()`方法获取对应的`Class`对象）。
- `Constructor`：代表类的构造方法，用于创建对象。
- `Method`：代表类的方法，用于调用方法。
- `Field`：代表类的字段，用于访问或修改字段值。

#### 反射的简单示例

```java
import java.lang.reflect.Method;

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        // 1. 获取目标类的Class对象（三种方式）
        Class<?> clazz = Class.forName("java.lang.String"); // 方式1：通过全类名
        // Class<?> clazz = String.class; // 方式2：通过类名.class
        // Class<?> clazz = "hello".getClass(); // 方式3：通过实例.getClassName()

        // 2. 动态创建对象（调用无参构造）
        Object strObj = clazz.newInstance();

        // 3. 动态获取并调用方法（例如String的concat方法）
        Method concatMethod = clazz.getMethod("concat", String.class); // 参数：方法名 + 参数类型
        Object result = concatMethod.invoke(strObj, " world"); // 调用方法：实例 + 实际参数

        System.out.println(result); // 输出：" world"（因为strObj是新创建的空字符串，拼接后为" world"）
    }
}
```

#### 反射的优缺点

- **优点**

  灵活性高，适合编写通用框架（如 Spring 的 IOC 容器、MyBatis 的 ORM 映射），这些框架需要在运行时根据配置动态处理类和对象。

- **缺点**

  1. 破坏封装性：可以访问私有成员，可能违反类的设计初衷。
  2. 性能开销：反射操作需要解析字节码，比直接调用（编译期确定）慢。
  3. 可读性差：动态代码不如直接调用直观，增加维护成本。

#### 常见应用场景

- 框架开发（如 Spring、Hibernate）：通过反射实现依赖注入、对象实例化等。
- 注解处理：运行时解析注解并执行相应逻辑（如 JUnit 的`@Test`注解）。
- 序列化 / 反序列化：动态读取和设置对象字段（如 JSON 工具 Jackson、Gson）。
- JDBC连接数据库时使用`Class.forName()`通过反射加载数据库的驱动程序。
- Eclispe、IDEA等开发工具利用反射动态解析对象的类型与结构，动态提示对象的属性和方法。



## 47. 讲讲什么是泛型？

Java泛型是JDK 5中引⼊的⼀个新特性， 允许在定义类和接口的时候使⽤类型参数。声明的类型参数在使⽤时⽤具体的类型来替换。

泛型最⼤的好处是可以提⾼代码的复⽤性。以List接口为例，我们可以将String、 Integer等类型放⼊List中， 如不⽤泛型， 存放String类型要写⼀个List接口， 存放Integer要写另外⼀个List接口， 泛型可以很好的解决这个问题。



## 48. 如何停止一个正在运行的线程？

在 Java 中，停止一个正在运行的线程需要谨慎处理，因为直接强制终止线程可能导致资源未释放、数据不一致等问题。Java 提供了多种安全的线程终止方式，以下是常见的实现方式及原理：

#### 一、不推荐的方式（已废弃或不安全）

1. **`stop()` 方法（已废弃）**
   - 原理：直接强制终止线程，释放所有锁。
   - 问题：线程可能在执行关键操作（如文件写入、数据更新）时被强制中断，导致资源未释放（如文件句柄未关闭）、数据损坏（如只更新了部分数据），因此已被 Java 官方标记为`@Deprecated`，严禁使用。
2. **`suspend()` 和 `resume()`（已废弃）**
   - 原理：`suspend()` 挂起线程，`resume()` 恢复线程。
   - 问题：挂起时线程会持有锁，可能导致死锁（其他线程等待该锁时无法继续），同样已被废弃。

#### 二、推荐的安全方式

核心思想：**让线程自行判断是否需要终止，通过 “协作式” 方式退出**，而非强制中断。

**1. 使用 `volatile` 标记位（最常用）**

- 原理：定义一个 `volatile` 修饰的布尔变量（如 `isInterrupted`），线程运行时不断检查该变量，当变量为 `true` 时主动退出。
- 适用场景：线程执行循环任务（如定时任务、轮询），可在循环中检查标记位。

```java
public class StopThreadByFlag {
    //  volatile保证多线程间的可见性
    private static volatile boolean isStop = false;

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            int i = 0;
            // 循环中检查标记位
            while (!isStop) {
                System.out.println("线程运行中：" + i++);
                try {
                    Thread.sleep(500); // 模拟业务操作
                } catch (InterruptedException e) {
                    // 若线程在sleep时被中断，会抛出异常，此处可处理（如退出或继续）
                    System.out.println("线程被中断");
                    // 可选择在此处手动设置isStop=true，确保线程退出
                    // isStop = true;
                }
            }
            System.out.println("线程已停止");
        });

        thread.start();
        // 主线程休眠2秒后，设置标记位为true，通知子线程停止
        Thread.sleep(2000);
        isStop = true;
    }
}
```



## 49. 什么是跨域？

在 Web 开发中，**跨域（Cross-Origin）** 指的是浏览器从一个域名的网页去请求另一个域名的资源时，由于浏览器的**同源策略（Same-Origin Policy）** 限制而产生的限制行为。

#### 1. 同源策略：跨域的根源

同源策略是浏览器的一种安全机制，目的是防止恶意网站窃取其他网站的敏感数据。它要求 “同源” 的网页才能自由交互，否则会被限制。

**“同源” 的定义**：两个 URL 必须满足以下三个条件：

- **协议相同**（如都是 `http` 或 `https`）；
- **域名相同**（如都是 `example.com`，`a.example.com` 和 `b.example.com` 不同源）；
- **端口相同**（如都是 `80` 或 `443`，默认端口可省略）。

#### 2. 跨域的常见表现

当浏览器检测到跨域请求时，会根据请求类型（简单请求 / 复杂请求）进行限制，常见表现：

- **AJAX 请求失败**：控制台报错（如 `Access to XMLHttpRequest at 'xxx' from origin 'xxx' has been blocked by CORS policy`）；
- **Cookie、LocalStorage 无法读取**：跨域页面无法访问对方域名下的存储数据；
- **DOM 无法操作**：跨域的 iframe 页面无法互相操作 DOM。

#### 3. 跨域的解决方案

**（1）后端设置 CORS（跨域资源共享，推荐）**

CORS（Cross-Origin Resource Sharing）是 W3C 标准，通过后端在响应头中添加特定字段，允许指定域名的跨域请求。

**实现方式**：后端在响应中添加 `Access-Control-Allow-*` 系列头：

- `Access-Control-Allow-Origin: <允许的域名>`（如 `*` 表示允许所有域名，或具体域名 `http://www.example.com`）；
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`（允许的 HTTP 方法）；
- `Access-Control-Allow-Headers: Content-Type`（允许的请求头）；
- 若涉及 Cookie 传递，需额外设置 `Access-Control-Allow-Credentials: true`，且 `Access-Control-Allow-Origin` 不能为 `*`。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 所有接口
                .allowedOrigins("http://localhost:8080") // 允许的前端域名
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true) // 允许携带Cookie
                .maxAge(3600); // 预检请求的缓存时间（秒）
    }
}
```

**（2）前端代理（开发环境常用）**

在前端工程（如 Vue、React）的开发环境中，通过配置代理服务器，将跨域请求转发为同源请求（绕开浏览器限制）。

```js
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': { // 匹配所有以/api开头的请求
        target: 'http://backend.example.com', // 后端真实接口域名
        changeOrigin: true, // 开启代理，模拟同源请求
        pathRewrite: { '^/api': '' } // 去掉请求路径中的/api前缀
      }
    }
  }
};
```



##  50. 设计接口要注意什么?

1. **接口参数校验**。接口必须校验参数，比如入参是否允许为空，入参长度是否符合预期。
2. 设计接口时，充分考虑接口的**可扩展性**。思考接口是否可以复用，怎样保持接口的可扩展性。
3. **串行调用考虑改并行调用**。比如设计一个商城首页接口，需要查商品信息、营销信息、用户信息等等。如果是串行一个一个查，那耗时就比较大了。这种场景是可以改为并行调用的，降低接口耗时。
4. 接口是否需要**防重**处理。涉及到数据库修改的，要考虑防重处理，可以使用数据库防重表，以唯一流水号作为唯一索引。
5. **日志打印全面**，入参出参，接口耗时，记录好日志，方便甩锅。
6. 修改旧接口时，注意**兼容性设计**。
7. **异常处理得当**。使用finally关闭流资源、使用log打印而不是e.printStackTrace()、不要吞异常等等
8. 是否需要考虑**限流**。限流为了保护系统，防止流量洪峰超过系统的承载能力。



## 51. 过滤器和拦截器有什么区别？

在 Java Web 开发中，过滤器（Filter）和拦截器（Interceptor）都是用于处理请求的组件，但它们的底层实现、作用范围和使用场景有显著区别。以下是两者的核心区别及对比：

#### 一、底层实现与技术体系

- **过滤器（Filter）：** 基于 **Servlet 规范** 实现，属于 **Java EE 标准**，由 Servlet 容器（如 Tomcat）管理。它依赖于 Servlet 容器的生命周期，只能在 Web 应用中使用。
- **拦截器（Interceptor）：** 基于 **Spring 框架** 实现，属于 Spring 的 **AOP（面向切面编程）** 机制的一部分，由 Spring 容器管理。它不依赖 Servlet 容器，可在非 Web 环境（如 Spring 普通应用）中使用。

#### 二、作用范围与执行时机

**1. 作用范围**

- **过滤器**：作用于 **所有请求**（包括 Servlet、JSP、静态资源如 CSS/JS 等），只要符合过滤规则（`url-pattern`），都会被拦截。
- **拦截器**：仅作用于 **Spring MVC 的控制器（Controller）方法**，对静态资源、非 Spring 管理的 Servlet 等不生效。

**2. 执行时机（请求处理流程）**

- **过滤器**：在请求进入 **Servlet 容器后、DispatcherServlet 之前** 执行，且在响应返回客户端前执行后置处理。
- **拦截器**：在请求进入 **DispatcherServlet 后、Controller 方法执行前后** 执行，更贴近业务逻辑层。

#### 三、核心方法与执行顺序

**1. 过滤器（Filter）**

核心方法在 `javax.servlet.Filter` 接口中定义：

```java
public interface Filter {
    // 初始化：容器启动时执行（仅一次）
    void init(FilterConfig filterConfig) throws ServletException;

    // 过滤逻辑：请求经过时执行（核心）
    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
        throws IOException, ServletException;

    // 销毁：容器关闭时执行（仅一次）
    void destroy();
}
```

- 多个过滤器的执行顺序由 `web.xml` 中 `<filter-mapping>` 的声明顺序或 `@WebFilter` 的 `order` 属性决定（值越小越先执行）。
- 通过 `FilterChain.doFilter(request, response)` 调用下一个过滤器或目标资源，若不调用则请求被拦截。

**2. 拦截器（Interceptor）**

核心方法在 `org.springframework.web.servlet.HandlerInterceptor` 接口中定义：

```java
public interface HandlerInterceptor {
    // 前置处理：Controller 方法执行前调用（返回 true 则继续，false 则拦截）
    boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception;

    // 后置处理：Controller 方法执行后、视图渲染前调用
    void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                   ModelAndView modelAndView) throws Exception;

    // 完成处理：视图渲染后调用（常用于资源清理）
    void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
                       Exception ex) throws Exception;
}
```

- 多个拦截器的执行顺序由 Spring 配置的 `order` 属性决定（值越小越先执行）。
- `preHandle` 按顺序执行，`postHandle` 和 `afterCompletion` 按 **逆序** 执行（类似栈的先进后出）。



## 52. 对接第三方接口要考虑什么？

1. 确认接口对接的**网络协议**，是https/http或者自定义的私有协议等。
2. 约定好**数据传参、响应格式**（如application/json），弱类型对接强类型语言时要特别注意
3. **接口安全**方面，要确定身份校验方式，使用token、证书校验等
4. 确认是否需要接口调用失败后的**重试**机制，保证数据传输的最终一致性。
5. **日志记录要全面**。接口出入参数，以及解析之后的参数值，都要用日志记录下来，方便定位问题（甩锅）。



## 53. 后端接口性能优化有哪些方法？

1. **优化索引**。给where条件的关键字段，或者`order by`后面的排序字段，加索引。
2. **优化sql语句**。比如避免使用select *、批量操作、避免深分页、提升group by的效率等
3. **避免大事务**。使用@Transactional注解这种声明式事务的方式提供事务功能，容易造成大事务，引发其他的问题。应该避免在事务中一次性处理太多数据，将一些跟事务无关的逻辑放到事务外面执行。
4. **异步处理**。剥离主逻辑和副逻辑，副逻辑可以异步执行，异步写库。比如用户购买的商品发货了，需要发短信通知，短信通知是副流程，可以异步执行，以免影响主流程的执行。
5. **降低锁粒度**。在并发场景下，多个线程同时修改数据，造成数据不一致的情况。这种情况下，一般会加锁解决。但如果锁加得不好，导致锁的粒度太粗，也会非常影响接口性能。
6. **加缓存**。如果表数据量非常大的话，直接从数据库查询数据，性能会非常差。可以使用Redis`和`memcached提升查询性能，从而提高接口性能。
7. **分库分表**。当系统发展到一定的阶段，用户并发量大，会有大量的数据库请求，需要占用大量的数据库连接，同时会带来磁盘IO的性能瓶颈问题。或者数据库表数据非常大，SQL查询即使走了索引，也很耗时。这时，可以通过分库分表解决。分库用于解决数据库连接资源不足问题，和磁盘IO的性能瓶颈问题。分表用于解决单表数据量太大，sql语句查询数据时，即使走了索引也非常耗时问题。
8. **避免在循环中查询数据库**。循环查询数据库，非常耗时，最好能在一次查询中获取所有需要的数据。



## 54. 为什么在阿里巴巴Java开发手册中强制要求使用包装类型定义属性呢？

嗯，以布尔字段为例，当我们没有设置对象的字段的值的时候，Boolean类型的变量会设置默认值为`null`，而boolean类型的变量会设置默认值为`false`。

也就是说，包装类型的默认值都是null，而基本数据类型的默认值是一个固定值，如boolean是false，byte、short、int、long是0，float是0.0f等。

举一个例子，比如有一个扣费系统，扣费时需要从外部的定价系统中读取一个费率的值，我们预期该接口的返回值中会包含一个浮点型的费率字段。当我们取到这个值得时候就使用公式：金额*费率=费用 进行计算，计算结果进行划扣。

如果由于计费系统异常，他可能会返回个默认值，如果这个字段是Double类型的话，该默认值为null，如果该字段是double类型的话，该默认值为0.0。

如果扣费系统对于该费率返回值没做特殊处理的话，拿到null值进行计算会直接报错，阻断程序。拿到0.0可能就直接进行计算，得出接口为0后进行扣费了。这种异常情况就无法被感知。

**那我可以对0.0做特殊判断，如果是0就阻断报错，这样是否可以呢？**

不对，这时候就会产生一个问题，如果允许费率是0的场景又怎么处理呢？

使用基本数据类型只会让方案越来越复杂，坑越来越多。

这种使用包装类型定义变量的方式，通过异常来阻断程序，进而可以被识别到这种线上问题。如果使用基本数据类型的话，系统可能不会报错，进而认为无异常。

因此，建议在POJO和RPC的返回值中使用包装类型。



## 55. 接口性能提升

**池化思想**

如果你每次需要用到线程，都去创建，就会有增加一定的耗时，而线程池可以重复利用线程，避免不必要的耗时。

比如`TCP`三次握手，它为了减少性能损耗，引入了`Keep-Alive长连接`，避免频繁的创建和销毁连接。

**拒绝阻塞等待**

如果你调用一个系统`B`的接口，但是它处理业务逻辑，耗时需要`10s`甚至更多。然后你是一直**阻塞等待，直到系统B的下游接口返回**，再继续你的下一步操作吗？这样**显然不合理**。

参考**IO多路复用模型**。即我们不用阻塞等待系统`B`的接口，而是先去做别的操作。等系统`B`的接口处理完，通过**事件回调**通知，我们接口收到通知再进行对应的业务操作即可。

**远程调用由串行改为并行**

比如设计一个商城首页接口，需要查商品信息、营销信息、用户信息等等。如果是串行一个一个查，那耗时就比较大了。这种场景是可以改为并行调用的，降低接口耗时。

**锁粒度避免过粗**

在高并发场景，为了防止**超卖等情况**，我们经常需要**加锁来保护共享资源**。但是，如果加锁的粒度过粗，是很影响接口性能的。

不管你是`synchronized`加锁还是`redis`分布式锁，只需要在共享临界资源加锁即可，不涉及共享资源的，就不必要加锁。

**耗时操作，考虑放到异步执行**

耗时操作，考虑用**异步处理**，这样可以降低接口耗时。比如用户注册成功后，短信邮件通知，是可以异步处理的。

**使用缓存**

把要查的数据，提前放好到缓存里面，需要时，**直接查缓存，而避免去查数据库或者计算的过程**。

**提前初始化到缓存**

预取思想很容易理解，就是**提前把要计算查询的数据，初始化到缓存**。如果你在未来某个时间需要用到某个经过复杂计算的数据，**才实时去计算的话，可能耗时比较大**。这时候，我们可以采取预取思想，**提前把将来可能需要的数据计算好，放到缓存中**，等需要的时候，去缓存取就行。这将大幅度提高接口性能。

**压缩传输内容**

压缩传输内容，传输报文变得更小，因此传输会更快。



## 56. Stream流原理？

**本质**：一套基于 “流水线” 的声明式数据处理框架，用类似 SQL 的逻辑处理集合，兼顾简洁性与并行能力。

#### 1. 三阶段流程

- **创建流**：从集合、数组等数据源 “引水”（如 `list.stream()`），流本身不存数据，仅作为处理通道。
- **中间操作**：在管道上 “装阀门”（如 `filter` 过滤、`map` 转换），仅记录规则不执行，形成操作链。
- **终止操作**：打开 “出水口”（如 `collect` 收集、`forEach` 输出），触发整个管道运行，处理后流失效。

#### 2. 核心执行逻辑

- **惰性求值**：中间操作 “只记不做”，直到终止操作才一次性执行，避免无效计算。
- **内部迭代**：框架自动控制遍历（替代手动 `for` 循环），通过 `Spliterator` 拆分 / 遍历数据。
- **融合优化**：多个中间操作合并为一次遍历（如先过滤再转换，只走一遍数据），提升效率。

#### 3. 并行流关键

- 基于 `ForkJoinPool` 自动拆分数据到多线程，处理后合并结果，适合 “大数据量 + 多核 CPU” 场景。

  ```java
  import java.util.Arrays;
  import java.util.List;
  
  public class ParallelStreamDemo {
      public static void main(String[] args) {
          // 数据源：1-10的整数列表
          List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
  
          // 并行流处理：计算每个数的平方并打印（注意线程执行顺序不确定）
          System.out.println("并行流处理结果（顺序可能打乱）：");
          numbers.parallelStream()
                 .map(num -> num * num)  // 计算平方（中间操作）
                 .forEach(System.out::println);  // 终端操作（触发执行）
      }
  }
  ```

#### 4. 底层支撑

- 核心类：`AbstractPipeline`（管道链）、`Spliterator`（数据拆分）、`Sink`（操作节点）。
- 依赖函数式接口（`Predicate`/`Function` 等），通过 Lambda 简化逻辑定义。

**一句话概括**：Stream 是 “先记操作、最后执行” 的流水线，靠内部迭代和自动并行，让集合处理更优雅高效。



## 57. 为什么开发都用Stream流？

一套基于 “流水线” 的声明式数据处理框架，旨在简化集合（或其他数据源）的处理逻辑，兼顾代码简洁性、功能灵活性和并行处理能力。

#### **核心优势（开发广泛使用的原因）**

1. **代码更简洁，可读性强：** 用 “声明式” 语法描述 “要做什么”（如过滤、转换），而非 “怎么做”（如手动循环），摆脱模板代码，业务逻辑一目了然。
2. **复杂操作链式组合：** 中间操作（`filter`/`map`/`sorted` 等）可链式调用，轻松实现多步处理（如过滤→去重→排序→分组），无需嵌套循环或临时变量。
3. **并行处理简单高效：** 只需调用 `parallelStream()`，底层自动通过 `Fork/Join` 框架实现多线程拆分处理，无需手动管理线程，大数据量场景性能优势明显。
4. **减少安全风险：** 设计上鼓励 “只读” 处理，避免遍历中修改集合导致的 `ConcurrentModificationException`，配合 `collect` 收集结果更安全。
5. **契合函数式编程：** 基于 Lambda 表达式和函数式接口，逻辑与遍历解耦，便于复用和测试。



## 59. 类加载与初始化顺序

在 Java 开发中，类的加载与初始化流程（静态块、构造器、父子类继承执行顺序）是绕不开的基础，也是面试高频考点。本文结合多组实战案例，带你穿透 “类加载阶段” 与 “对象创建阶段” 的执行逻辑，彻底掌握核心规则！

#### 核心概念：类加载与初始化的两大阶段

Java 中，一个类从 “被程序引用” 到 “真正可用”，需经历**类加载**和**对象创建**两大阶段，每个阶段对应不同的代码执行逻辑：

#### 1. 类加载阶段（触发时机）

当程序首次使用类的静态资源时触发（如访问静态变量、调用静态方法、通过 `new` 创建对象等）。

- **执行内容**：
  - 初始化类的静态变量（如 `static int count;`）；
  - 执行静态代码块（`static {}`）。
- **核心特点**：全局仅执行一次。无论后续创建多少个对象，类加载过程仅在首次使用时触发一次，静态资源由此完成 “类级别的初始化”。

#### 2. 对象创建阶段（触发时机）

当通过 `new 类名()` 显式创建对象时触发。

- **执行内容**：
  - 先执行非静态属性初始化（按代码中定义的顺序）；
  - 再执行非静态代码块（`{}，又称实例代码块`）；
  - 最后执行构造器（`类名()`）。
  
- **核心特点**：每次创建对象时都会执行。非静态代码块和构造器与对象实例绑定，负责完成 “对象级别的初始化”，因此每 `new` 一次，就会重复执行一次。

#### 3. 父子类继承的 “叠加规则”

若存在继承关系（子类 `extends` 父类），执行顺序会严格遵循 “先父类、后子类” 的层级逻辑，形成 “叠加执行” 的效果：

- **类加载阶段**：先加载父类 → 执行父类静态代码块 → 再加载子类 → 执行子类静态代码块。
- **对象创建阶段**：先执行父类非静态代码块 → 父类构造器 → 再执行子类非静态代码块 → 子类构造器。

通过明确这两大阶段的触发条件、执行内容及继承关系下的叠加规则，就能清晰梳理类加载与初始化的全流程，轻松应对各类场景及面试问题。

| 阶段         | 触发时机                                                     | 核心执行内容                     | 执行次数        | 继承关系下的执行顺序                                     |
| ------------ | ------------------------------------------------------------ | -------------------------------- | --------------- | -------------------------------------------------------- |
| 类加载阶段   | 首次使用类的静态资源（访问静态变量、调用静态方法、new 对象等） | `静态属性` 和 `静态代码块`       | 全局仅 1 次     | （属性和代码块按照声明顺序执行）先父类静态  → 再子类静态 |
| 对象创建阶段 | 执行 `new 类名()` 显式创建对象                               | 非静态属性、非静态代码块、构造器 | 每次 new 均执行 | （属性和代码块按照声明顺序执行→ 构造器）先父类  → 再子类 |



## 60. java 修饰符的范围

在 Java 中，访问修饰符用于控制类、方法、字段等成员的访问范围，共有 4 种核心修饰符，按访问权限从大到小排序为：`public` > `protected` > 缺省（默认，无修饰符）> `private`。

以下是它们的访问范围表格说明：

| 修饰符         | 同一类 | 同一包 | 子类（同包） | 子类（不同包） | 不同包的非子类中 |
| -------------- | ------ | ------ | ------------ | -------------- | ---------------- |
| public         | ✔️      | ✔️      | ✔️            | ✔️              | ✔️                |
| protected      | ✔️      | ✔️      | ✔️            | ✔️              | ❌                |
| 默认（无修饰） | ✔️      | ✔️      | ✔️            | ❌              | ❌                |
| private        | ✔️      | ❌      | ❌            | ❌              | ❌                |

#### 总结：

1. **`public`**：所有场景（同一类、同包、不同包子类 / 非子类）都可以访问
2. **`protected`**：同包下所有类可访问，不同包仅子类可访问
3. **缺省（默认）**：仅同包下的类可访问
4. **`private`**：只能在当前类内部访问

#### 适用场景：

- 对外暴露的 API、工具类方法通常用 `public`。
- 父类中需要被子类复用但不希望被外部随意访问的成员用 `protected`。
- 仅包内复用的工具类或成员用缺省修饰符。
- 类内部的实现细节（如辅助变量、私有方法）用 `private`，体现封装性。



## 61. 如何把一个对象对象转JSON字符串

#### 一、最推荐方案：**Jackson（事实标准）**

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.1</version>
</dependency>
```

```java
String json = mapper.writeValueAsString(user);
System.out.println(json);
```

#### 二、toString() 模拟 JSON（硬编码）

```java
class User {
    String name;
    Address addr;

    @Override
    public String toString() {
        return "{"
                + "\"name\":\"" + name + "\","
                + "\"addr\":" + addr
                + "}";
    }
}
```

#### 三、通过反射反射获取所有字段（通用）

```java
import java.lang.reflect.Field;

public class SimpleJsonPrinter {

    public static String toJson(Object obj) {
        if (obj == null) {
            return "null";
        }

        Class<?> clazz = obj.getClass(); // 获取目标对象的类对象

        // String
        if (clazz == String.class) {
            return "\"" + obj + "\"";
        }

        // 基本类型 & 包装类 直接打印
        if (clazz.isPrimitive() || Number.class.isAssignableFrom(clazz) || clazz == Boolean.class) {
            return obj.toString();
        }

        // 普通对象
        StringBuilder sb = new StringBuilder();
        sb.append("{");

        Field[] fields = clazz.getDeclaredFields(); // 获取对象所有字段（不包括父类字段）
        for (int i = 0; i < fields.length; i++) {
            Field f = fields[i];
            f.setAccessible(true); // 破除 private 限制

            if (f.isSynthetic()) { // 跳过  synthetic 字段 如 this$0字段
                continue;
            }

            try {
                Object value = f.get(obj);
                sb.append("\"").append(f.getName()).append("\":");
                sb.append(toJson(value));
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }

            if (i < fields.length - 1) {
                sb.append(",");
            }
        }

        sb.append("}");
        return sb.toString();
    }
}
```



## 62、怎么把一个1-100的整数数组随机打乱

```java
import java.util.Random;

public class ShuffleDemo {
    public static void main(String[] args) {
        int[] arr = new int[100];

        // 1. 初始化 1~100
        for (int i = 0; i < 100; i++) {
            arr[i] = i + 1;
        }

        // 2. Fisher–Yates 洗牌
        Random random = new Random();
        for (int i = arr.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1); // [0, i]
            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }

        // 打印
        for (int n : arr) {
            System.out.print(n + " ");
        }
    }
}

```



## 注

本文 Java 基础面试题内容参考自网络资料，具体参考来源：《Java 基础常见面试题总结》（作者：大彬）

原文链接：https://topjavaer.cn/java/java-basic.html。

若涉及版权问题，请联系 邮箱[2380983020@qq.com]，将立即处理。

