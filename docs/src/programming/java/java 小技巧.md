# JAVA 小技巧



## 自定义对象多维度排序

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



## scanner

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

