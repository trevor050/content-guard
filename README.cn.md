# ContentGuard v0.1.2

**面向现代应用的专业内容审核与垃圾信息检测。**

ContentGuard 对文本进行垃圾信息、骚扰和恶意模式的分析。它结合强大的规则引擎与可选的机器学习插件，能够快速、精准地处理多语言内容。

## 安装

```bash
npm install content-guard
```

## 快速上手

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('moderate');
const result = await guard.analyze('你好，世界');
console.log(result.isSpam);
```

## 主要特性

- 多种预设，覆盖 **宽松** 到 **严格**
- 结合自然语言处理的上下文检测
- 模块化规则引擎：键盘垃圾、情感和骚扰过滤
- 可选 ML 插件：表情情感、跨文化检查、毒性分析等
- Unicode 同形字符归一化，防止文本混淆
- 提供批量处理和脚本化的 CLI
- 轻量快速，适合无服务器环境
- 附带 TypeScript 类型定义

## v4.5 版本变体

ContentGuard v4.5 提供四种调优变体，便于在速度与精度间取舍：

| 变体              | 准确率 | 平均时间 | 适用场景                     |
|-------------------|------:|--------:|-----------------------------|
| **v4.5-turbo**    | ~91%  | 0.02ms  | 实时聊天和大规模流式场景     |
| **v4.5-fast**     | ~90%  | 0.06ms  | API 网关与微服务            |
| **v4.5-balanced** | ~93%  | 0.25ms  | 一般生产环境（默认）         |
| **v4.5-large**    | ~94%  | 1.32ms  | 企业和关键审核场景           |

实例化或在 CLI 中可选择相应的变体。

## 插件与使用场景

ContentGuard 采用模块化插件系统，可按需启用：

| 插件              | 说明及典型场景                               |
|-------------------|----------------------------------------------|
| **Obscenity**     | 侦测冒犯性语言，用于社区规则                 |
| **Sentiment**     | 评估文本语气，适合聊天分析                   |
| **Harassment**    | 标记欺凌或仇恨语句，社交平台必备             |
| **Social Engineering** | 识别钓鱼或诈骗行为，用于邮件过滤         |
| **Keyboard Spam** | 捕获随机敲键，适合表单提交                   |
| **Emoji Sentiment** | 解读表情符号情感，丰富情感分析             |
| **Cross‑Cultural** | 检查跨文化敏感词，适合全球化部署             |
| **ML Toxicity**   | 基于机器学习的毒性评分，更高精度             |
| **Confusables**   | 归一化相似 Unicode 字符，防止文字混淆         |

## CLI 使用

```bash
npx content-guard "一些文本" --preset strict --variant fast
```

更多集成示例请参见 `examples/` 目录。

## 配置

每个预设都可自定义。查看 `lib/presets`，根据需要调整插件权重、阈值和预处理选项。

## 许可证

ContentGuard 以 MIT 许可证发布。

---

**其他语言：** [English](README.md) | [Español](README.es.md) | [Français](README.fr.md)
