# Portal Web Application

这是一个基于 Spring Boot 的 Web 应用程序，用于管理和展示未投递报告相关的数据。

## 功能特点

- 账户维护
- 原因维护
- 数据导入
- 报表打印
- 数据导出

## 技术栈

- Spring Boot 2.x
- PostgreSQL
- MyBatis
- Thymeleaf
- AdminLTE 3
- jQuery + DataTables

## 开发环境要求

- JDK 1.8+
- Maven 3.6+
- PostgreSQL 12+

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/yourusername/portalweb.git
```

2. 创建数据库
```sql
CREATE DATABASE demo;
```

3. 修改数据库配置
编辑 `src/main/resources/application.yml`，设置数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/demo
    username: your_username
    password: your_password
```

4. 运行应用
```bash
mvn spring-boot:run
```

5. 访问应用
打开浏览器访问：http://localhost:8080

## 项目结构

```
src/main/
├── java/
│   └── com/example/demo/
│       ├── annotation/    # 注解类
│       ├── aspect/        # AOP 切面
│       ├── controller/    # 控制器
│       ├── dto/           # 数据传输对象
│       ├── mapper/        # MyBatis Mapper
│       └── service/       # 业务逻辑
└── resources/
    ├── mapper/           # MyBatis XML
    ├── static/          # 静态资源
    └── templates/       # Thymeleaf 模板
```

## 主要功能模块

### 账户维护
- 保证金账户管理
- 账户状态维护
- 历史记录查询

### 原因维护
- 未投递原因管理
- 原因代码维护

### 数据导入
- Excel 文件导入
- 数据验证
- 导入历史记录

### 报表打印
- 未投递客户报表
- 无用户账户报表
- 数据导出 Excel

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE) 