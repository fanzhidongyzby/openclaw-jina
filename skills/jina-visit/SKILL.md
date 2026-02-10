---
name: jina-visit
description: 使用 Jina Reader API 访问网页并提取内容，提供简洁的网页总结和关键信息提取。可根据访问目的（goal）定制化总结。当用户说"访问"、"打开"、"查看"、"提取内容"、"获取信息"、"总结网页"、"网页总结"时使用。
---

# Jina Reader Tool

基于 Jina Reader API 的网页内容提取工具，能够访问网页、提取内容、生成定制化总结。

## When to Activate

当用户提到以下内容时自动激活：

### 网页访问关键词
- "访问"、"打开"、"查看"
- "提取内容"、"获取信息"
- "总结网页"、"网页总结"
- "访问这个链接"、"去看看这个网址"
- "了解这篇文档"、"研究这个页面"

### 特定场景
- 需要查看网页内容
- 需要提取网页关键信息
- 需要获取网页文字内容
- 需要总结长篇文章
- 需要批量访问多个网页
- 需要了解特定方面的信息（如技术要点、商业信息、新闻事件）

### 示例问题
- "访问这个网页并总结：https://example.com/article"
- "访问这个文档，告诉我技术要点：https://docs.example.com"
- "访问这篇新闻并总结事件：https://news.example.com/tech"
- "访问这些链接并总结关键信息：[url1, url2, url3]"
- "访问这个网页，了解商业模式：https://example.com/company"

## Tools

### jina-visit

**用途：** 访问网页并提取内容，可根据 goal 定制化总结

**参数：**
- `url` (必选，array 或 string)：待访问网页的 URL 数组
  - 可以是单个 URL（字符串）
  - 也可以是多个 URL（数组）
  - 至少需要包含一个 URL
- `goal` (可选，string)：访问网页的目的，用于指导总结方向

**返回字段：**
- `urls`：请求的 URL 数组
- `goal`：访问目的（如果提供）
- `results`：每个网页的提取结果
  - `url`：网页 URL
  - `content`：提取的内容/总结
  - `status`：状态（success 或 error）
- `count`：成功访问的网页数量

**goal 参数说明：**
- `goal` 是可选的，用于指导 AI 模型如何总结网页内容
- 示例值：
  - "总结技术要点"
  - "提取商业信息"
  - "了解产品功能"
  - "总结新闻事件"
  - "分析技术架构"
- 模型会根据 goal 从返回的内容中提取相关信息并进行总结

## Best Practices

### 1. goal 参数使用

**技术文档：**
```javascript
jina-visit({
  url: "https://docs.example.com/api",
  goal: "总结 API 使用方法和关键接口"
})
```

**新闻资讯：**
```javascript
jina-visit({
  url: "https://news.example.com/tech-news",
  goal: "总结新闻事件的核心内容和影响"
})
```

**产品页面：**
```javascript
jina-visit({
  url: "https://example.com/product",
  goal: "了解产品功能、价格和特点"
})
```

### 2. URL 传递方式

**单个 URL：**
```javascript
jina-visit({ url: "https://example.com" })
```

**多个 URL：**
```javascript
jina-visit({
  url: [
    "https://example.com/article1",
    "https://example.com/article2"
  ],
  goal: "总结这几篇文章的共同主题"
})
```

### 3. 网站选择

**适合的网站类型：**
- ✅ 博客文章
- ✅ 技术文档
- ✅ 新闻报道
- ✅ 资讯页面
- ✅ 论文摘要
- ✅ 产品页面
- ❌ 需要登录的网站
- ❌ 动态加载内容的网站

### 4. 内容利用

**Jina Reader 返回的是：**
- 网页的文本内容（去除广告、导航等）
- 结构化的内容
- Markdown 格式

**模型总结流程：**
1. 获取网页内容
2. 根据 goal 提取关键信息
3. 生成定制化总结

### 5. 数量控制

**建议：**
- 单次访问 1-3 个网页为佳
- 避免同时访问太多网页（可能超时）
- 对于大量 URL，分批处理

### 6. 错误处理

**常见错误：**
- 网站无法访问（404、500 等）
- 网站加载超时
- 网站需要登录
- URL 格式错误

**处理建议：**
- 检查 URL 是否正确
- 确认网站是否可访问
- 尝试访问网站的镜像或缓存

## Example Scenarios

### 场景 1：技术文档总结

**用户提问：** "访问这个 OpenClaw 文档并总结技术要点：https://docs.openclaw.ai"

**AI 行为：**
```javascript
jina-visit({
  url: "https://docs.openclaw.ai",
  goal: "总结 OpenClaw 的技术特点、功能和优势"
})
```

**模型总结：**
```
✅ 访问成功！根据 goal 总结如下：

**技术特点：**
- 自托管架构，数据完全私有
- 支持多渠道集成（飞书、WhatsApp、Telegram 等）
- 强大的工具调用和扩展系统
- 支持 GPU 加速推理

**核心功能：**
- 自动任务执行（清收件箱、发邮件等）
- 智能对话和理解
- 多智能体协作
- 插件系统

**优势：**
- 完全自主控制，不依赖第三方服务
- 高度可定制化
- 开源社区支持
```

### 场景 2：新闻事件总结

**用户提问：** "访问这篇技术新闻并总结事件：https://news.example.com/ai-launch"

**AI 行为：**
```javascript
jina-visit({
  url: "https://news.example.com/ai-launch",
  goal: "总结新闻事件的核心内容、时间、影响"
})
```

**模型总结：**
```
✅ 访问成功！根据 goal 总结如下：

**事件核心：**
某公司发布了新的 AI 产品，提升工作效率

**时间：**
2026年2月6日

**影响：**
- 提高工作效率 50%
- 减少人工成本
- 改善用户体验
```

### 场景 3：产品功能了解

**用户提问：** "访问这个产品页面，了解功能特点：https://example.com/product"

**AI 行为：**
```javascript
jina-visit({
  url: "https://example.com/product",
  goal: "了解产品功能、价格、技术规格"
})
```

**模型总结：**
```
✅ 访问成功！根据 goal 总结如下：

**产品功能：**
- 功能1：描述
- 功能2：描述
- 功能3：描述

**价格：**
- 基础版：$XX
- 专业版：$XX
- 企业版：$XX

**技术规格：**
- 性能指标
- 硬件要求
- 兼容性
```

### 场景 4：批量文档调研

**用户提问：** "访问这些技术文档并总结共同主题：[doc1, doc2, doc3]"

**AI 行为：**
```javascript
jina-visit({
  url: [
    "https://docs.example.com/api",
    "https://docs.example.com/guide",
    "https://docs.example.com/tutorial"
  ],
  goal: "总结这些文档的共同主题和最佳实践"
})
```

**模型总结：**
```
✅ 访问成功！已访问 3 个文档

**共同主题：**
- API 设计模式
- 错误处理策略
- 认证与授权

**最佳实践：**
- 使用 RESTful 设计
- 实现优雅降级
- 提供完整文档
```

### 场景 5：学术论文提取

**用户提问：** "访问这篇论文，提取研究方法和结论：https://arxiv.org/abs/xxx"

**AI 行为：**
```javascript
jina-visit({
  url: "https://arxiv.org/abs/xxx",
  goal: "提取研究方法、实验结果、主要结论"
})
```

**模型总结：**
```
✅ 访问成功！根据 goal 总结如下：

**研究方法：**
- 使用了 Transformer 架构
- 数据集：XXX
- 训练方法：XXX

**实验结果：**
- 准确率：XX%
- 性能提升：XX%

**主要结论：**
- 结论1
- 结论2
- 结论3
```

## Limitations

- **网站限制**：某些网站可能无法访问（需要登录、防爬虫等）
- **内容类型**：主要提取文本内容，图片、视频、表格可能不完整
- **超时限制**：长网页或加载慢的网页可能超时
- **动态内容**：JavaScript 动态生成的内容可能无法提取
- **API 限制**：Jina API 有速率限制，避免频繁大量请求
- **总结依赖**：定制化总结依赖 AI 模型理解，复杂任务可能效果有限

## Configuration

### 环境变量配置

编辑 `~/.openclaw/.env`：

```bash
# Jina API Key（可选，免费额度无需配置）
JINA_API_KEY=your-api-key-here
```

### 获取 API Key

Jina Reader API 提供免费额度，无需配置 API Key 即可使用。

如需更高配额，访问 [https://jina.ai/reader](https://jina.ai/reader) 获取 API Key。

## Related Tools

- **web_fetch：** 获取单个网页的详细内容（备用方案）
- **serper_search：** 搜索网页，获取链接列表

## Tips

- **验证 URL**：访问前确认 URL 格式正确
- **明确 goal**：提供清晰的访问目的，获得更好的总结效果
- **批量处理**：多个 URL 时，考虑分批处理
- **内容质量**：Jina Reader 会自动过滤广告和无关内容
- **失败重试**：如果某个网页访问失败，可以尝试重新访问
- **结合搜索**：先用 serper_search 找到相关链接，再用 jina-visit 提取内容

## Version History

- **v1.1** (2026-02-06)：添加 goal 参数，支持定制化总结
  - 新增 goal 参数用于指导总结方向
  - AI 模型根据 goal 生成定制化总结
  - 优化文档和示例

- **v1.0** (2026-02-06)：初始版本，基础网页访问功能
  - 支持 Jina Reader API
  - 单个和批量 URL 访问
  - 集成 OpenClaw Skill 系统

---

**💡 提示：** Jina Reader 适合快速获取网页内容的总结和关键信息，配合 goal 参数可以更精准地提取所需信息。