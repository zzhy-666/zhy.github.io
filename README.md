# AI 智赋 本地代理与集成说明

1) 安全注意
- 请不要将你的密钥直接提交到仓库或公开渠道。你刚粘贴的密钥应立即撤回并在 OpenAI 控制台中轮换（rotate）。

2) 快速在本地运行（Node.js >= 18）

```bash
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY
npm install
npm start
```

3) 说明
- 启动后，服务器在 `POST /api/aichat` 接受 JSON {"message":"..."}，返回 {"reply":"..."}。
- 前端 `assets/ai.js` 已更新为优先调用该接口；若接口不可用则回退到本地关键词模拟回答。

4) 故障排查
- 如果页面仍然返回演示版简答（本地关键词），说明前端无法成功调用本地代理或代理返回错误。请按下列步骤检查：
	- 确认你已在项目根目录创建 `.env` 并设置 `OPENAI_API_KEY`（不要把密钥贴到聊天或提交仓库）。
	- 在 Windows 命令行（项目根目录）运行：
		```powershell
		npm install
		npm start
		```
	- 启动后在命令行中查看日志（`AI proxy server listening` 与每次 `POST /api/aichat` 的记录）。
	- 在浏览器打开开发者工具（F12），切换到 Network 面板，提交问题后检查是否有对 `/api/aichat` 的请求以及返回状态。若返回非 200，请查看返回体中的 `error` 或 `detail` 字段。
	- 也可以用 curl 直接测试（在 PowerShell）：
		```powershell
		curl -X POST http://localhost:3000/api/aichat -H "Content-Type: application/json" -d '{"message":"你好"}'
		```
	- 常见问题：
		- 忘记设置 `OPENAI_API_KEY`（服务会返回 500 并在控制台提示）。
		- 防火墙或端口占用导致服务器未能启动。
		- 本地网络或 DNS 问题导致无法访问 OpenAI 上游 API。

如果你愿意，我可以帮你检查本地日志的关键错误信息（你可以把服务器启动时控制台的错误粘贴过来），但请不要把任何密钥文本发到聊天里。
