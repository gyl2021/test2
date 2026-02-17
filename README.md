# Dify Agent 微信小程序（对话框 + 引用文件信息）

该示例提供一个最小可用的微信小程序源码，使用对话框模式对接 Dify Agent API，并展示引用文件信息。

## 功能
- 对话框式聊天界面
- 调用 Dify `/chat-messages` API
- 解析并展示引用文件信息（文件名、页码、链接）

## 使用说明
1. 在微信开发者工具中导入本项目目录。
2. 配置 `utils/config.js`：
   - `apiBaseUrl`：默认 `https://api.dify.ai/v1`
   - `apiKey`：替换为你的 Dify API Key
   - `user`：用于标识调用用户
   - `showDebug`：是否显示原始响应调试信息
3. 运行并在聊天框输入问题。

## 引用信息显示逻辑
Dify 返回的引用字段可能在不同位置，本示例会优先从以下字段读取：
- `payload.references`
- `payload.metadata.references`
- `payload.metadata.sources`
- `payload.metadata.refs`
- `payload.metadata["retriever resources"]`
- `payload.metadata.retriever_resources`

如果返回了引用信息，会在助手回复下方展示“引用文件信息”。
若未返回引用信息，会展示“暂无引用文件信息”，并可开启调试查看原始响应。


## 网络错误排查（`request:fail Network Error`）
若出现该报错，通常不是 Dify 业务报错，而是小程序网络层拦截或连通性问题：
- 在微信开发者工具 / 小程序后台将 `https://api.dify.ai` 加入 **request 合法域名**。
- 确认 `utils/config.js` 中 `apiBaseUrl` 使用 HTTPS，且地址可直接访问。
- 检查设备网络状态，切换 Wi-Fi/蜂窝网络后重试。
- 若公司网络有代理/防火墙限制，建议通过你自己的后端中转调用 Dify。

## 注意事项
- 这是阻塞式请求（`response_mode: blocking`），适合快速集成测试。
- 若需流式输出可调整为 `streaming` 并改写前端渲染逻辑。
