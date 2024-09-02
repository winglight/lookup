# LLaMA Dictionary Chrome Extension

## 项目简介

LLaMA Dictionary 是一个创新的 Chrome 浏览器扩展，利用基于 Langflow 的 LLaMA 3.1 服务提供强大的单词查询和语言辅助功能。这个扩展旨在提高用户的阅读理解能力和学习效率，同时提供灵活的自定义选项。

## 特别说明

本代码90%来自AI（Claude3.5）的协助生成，另有文档说明整个过程：[AI助我写代码（4）：Chrome浏览器插件-Lookup（查单词）](https://www.broyustudio.com/2024/09/02/AI-Help-Lookup.html)


## 核心功能

1. 即时单词查询：选中网页上的单词即可查看定义
2. 弹出窗口查询：通过扩展图标打开查询界面
3. 上下文相关解释：根据网页内容提供更准确的解释
4. 自定义 LLaMA 模型：可配置使用不同版本的 LLaMA 模型
5. 多语言支持：支持多种语言的查询和翻译

## 技术实现

本扩展基于 Chrome Extensions Manifest V3 开发，主要组件包括：

- `manifest.json`：扩展配置文件
- `background.js`：后台服务脚本，处理与 Langflow LLaMA 服务的交互
- `content.js`：内容脚本，处理网页交互和显示查询结果
- `popup.html` 和 `popup.js`：弹出窗口界面及其逻辑

扩展通过 RESTful API 与基于 Langflow 的 LLaMA 3.1 服务进行通信，实现灵活、可定制的语言处理功能。

## 优势

1. 高度可定制：可以根据需求选择和配置 LLaMA 模型
2. 强大的语言理解：LLaMA 3.1 提供深度的语言理解能力
3. 灵活部署：可以选择本地部署或云端服务
4. 持续更新：受益于 Langflow 和 LLaMA 模型的持续改进
5. 开源友好：基于开源技术，方便社区贡献和改进

## 适用场景

- 学生阅读学习材料时快速查词
- 研究人员理解复杂的学术术语
- 多语言用户进行跨语言阅读和学习
- 内容创作者寻找精确用词和表达
- 需要深度语言分析的专业场景

## 安装指南

1. 下载本项目的 ZIP 文件并解压
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择解压后的项目文件夹
6. LLaMA Dictionary 扩展将出现在您的扩展列表中

## 使用指南

1. 选词查询：
   - 在任何网页上，选中想要查询的单词或短语
   - 扩展将自动显示一个包含定义和相关信息的悬浮窗口

2. 弹出窗口查询：
   - 点击 Chrome 工具栏中的扩展图标
   - 在弹出的窗口中输入要查询的单词或短语
   - 点击"查询"或按回车键获取结果

3. 设置：
   - 右键点击扩展图标，选择"选项"
   - 在设置页面中配置 LLaMA 模型版本、API 端点等

## 配置 Langflow LLaMA 服务

1. 安装 Langflow：
   ```
   pip install langflow
   ```
2. 在 Langflow 界面中创建使用 LLaMA 3.1 的工作流
   ```
   langflow run
   ```
3. 部署工作流并获取 API 端点

4. 在扩展设置中配置 API 端点

## 注意事项

- 使用此扩展需要有可用的 Langflow LLaMA 3.1 服务
- 根据您的设置，可能需要考虑 API 调用的频率限制和成本
- 确保您有使用 LLaMA 模型的适当许可

## 贡献

我们欢迎社区贡献！如果您有任何改进意见或遇到问题，请提交 Issue 或 Pull Request。

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

---

希望您喜欢使用 LLaMA Dictionary Chrome 扩展！如有任何问题或反馈，请随时与我们联系。