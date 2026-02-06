# OpenClaw Jina Plugin

Jina Reader API 集成的网页内容提取插件，为 OpenClaw 提供强大的网页访问和智能总结能力。

## 功能特性

✅ **网页访问**：通过 Jina Reader API 访问任意网页

✅ **内容提取**：自动提取网页文本内容，过滤广告和无关信息

✅ **智能总结**：支持定制化总结，根据访问目的提取关键信息

✅ **批量处理**：支持同时访问多个网页

✅ **多语言支持**：支持中文、英文等多语言网页

✅ **Skill 集成**：提供智能访问 skill，自动识别访问需求

✅ **免费额度**：无需 API Key 即可使用（有免费额度）

## 安装

安装 jina 插件：

```bash
openclaw plugins install https://github.com/fanzhidongyzby/openclaw-jina.git
```

重启 Gateway：

```bash
openclaw gateway restart
```

确认 jina 插件为 `loaded` 状态：

```
openclaw plugins list
```

## 配置

### 环境变量（可选）

Jina Reader API 提供免费额度，无需配置 API Key 即可使用。

如需更高配额，编辑 `~/.openclaw/.env`：

```bash
JINA_API_KEY=your-api-key-here
```

### 获取 API Key

访问 [https://jina.ai/reader](https://jina.ai/reader) 获取 API Key。

### 重启 Gateway

```bash
openclaw gateway restart
```

## 使用方式

### 工具调用

OpenClaw 会自动识别网页访问需求并调用工具：

**基础访问：**
```
你：访问这个文档：https://docs.openclaw.ai
AI：[自动调用 jina_visit，返回网页内容]
```

**定制总结：**
```
你：访问这个文档并总结技术要点：https://docs.openclaw.ai
AI：[自动调用 jina_visit，goal="总结技术要点"，返回定制化总结]
```

**批量访问：**
```
你：访问这些链接并总结：[url1, url2, url3]
AI：[自动调用 jina_visit，返回批量总结]
```

### Skill 场景

**visit skill 会在以下场景自动激活：**
- 🔗 **网页访问**："访问"、"打开"、"查看网页"
- 📄 **内容提取**："提取内容"、"获取信息"
- 📝 **网页总结**："总结网页"、"网页要点"
- 🔍 **信息获取**："看看这个网址"、"访问这个链接"
- 📚 **文档调研**："研究这篇文档"、"提取关键信息"
- 🎯 **定制目标**："总结技术要点"、"了解商业模式"、"分析产品功能"

## 参数说明

### jina_visit

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| url | array 或 string | ✅ | 待访问网页的 URL 数组，至少包含一个 URL |
| goal | string | ❌ | 访问网页的目的，用于指导总结方向 |

**goal 参数示例：**
- "总结技术要点"
- "了解产品功能"
- "提取商业信息"
- "分析商业模式"
- "总结新闻事件"

**返回字段：**
- `urls`：请求的 URL 数组
- `goal`：访问目的（如果提供）
- `results`：每个网页的提取结果
  - `url`：网页 URL
  - `content`：提取的内容/总结
  - `status`：状态（success 或 error）
- `count`：成功访问的网页数量

## 示例

### 基础访问

```javascript
// 访问单个网页
jina_visit({ url: "https://docs.openclaw.ai" })

// 提取内容
jina_visit({ url: "https://blog.example.com/article" })
```

### 定制总结

```javascript
// 技术文档总结
jina_visit({
  url: "https://docs.example.com/api",
  goal: "总结 API 使用方法和关键接口"
})

// 产品功能了解
jina_visit({
  url: "https://example.com/product",
  goal: "了解产品功能、价格和特点"
})

// 新闻事件总结
jina_visit({
  url: "https://news.example.com/tech-news",
  goal: "总结新闻事件的核心内容和影响"
})
```

### 批量访问

```javascript
// 批量处理技术文档
jina_visit({
  url: [
    "https://docs.example.com/api",
    "https://docs.example.com/guide",
    "https://docs.example.com/tutorial"
  ],
  goal: "总结这些文档的共同主题和最佳实践"
})

// 批量学术论文
jina_visit({
  url: [
    "https://arxiv.org/abs/1706.03762",
    "https://arxiv.org/abs/2101.00001"
  ],
  goal: "提取研究方法和结论"
})
```

## 目录结构

```
extensions/jina/
├── index.ts              # 插件入口，注册工具
├── openclaw.plugin.json  # 插件元数据
├── package.json          # npm 包配置
├── README.md             # 本文档
├── LICENSE               # MIT 许可证
├── .gitignore            # Git 忽略文件
└── skills/
    └── visit/
        └── SKILL.md      # 访问 skill 定义
```

## 工作原理

### Jina Reader API

**端点：** `https://r.jina.ai/{url}`

**请求方式：**
```javascript
headers: {
  'Accept': 'text/plain',
  'Authorization': 'Bearer {JINA_API_KEY}'  // 可选
}

GET https://r.jina.ai/https://example.com
```

**返回内容：**
- 网页的文本内容（Markdown 格式）
- 自动去除广告和无关信息
- 结构化的内容

### AI 智能总结

**总结流程：**
1. Jina Reader 提取网页内容
2. 根据 `goal` 参数指导
3. AI 模型提取关键信息
4. 生成定制化总结

## 开发与贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 相关链接

- [Jina Reader 官网](https://jina.ai/reader)
- [OpenClaw 文档](https://docs.openclaw.ai/)
- [ClawHub](https://clawhub.com/)

---

**Made with ❤️ for OpenClaw Community**
