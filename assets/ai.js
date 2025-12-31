document.addEventListener('DOMContentLoaded', function () {
    const messagesEl = document.getElementById('messages');
    const inputEl = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    function appendMessage(role, text) {
        const li = document.createElement('li');
        li.className = role === 'user' ? 'text-sm text-right' : 'text-sm text-left';
        const bubble = document.createElement('div');
        bubble.className = (role === 'user') ? 'inline-block bg-blue-600 text-white px-3 py-2 rounded-lg max-w-[80%]' : 'inline-block bg-white border border-slate-200 px-3 py-2 rounded-lg max-w-[80%]';
        bubble.innerHTML = text;
        li.appendChild(bubble);
        messagesEl.appendChild(li);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function simulateReply(userText) {
        appendMessage('assistant', '<i>思考中…</i>');
        setTimeout(() => {
            // 移除思考占位
            if (messagesEl.lastChild && messagesEl.lastChild.innerText.includes('思考中')) {
                messagesEl.removeChild(messagesEl.lastChild);
            }
            const reply = getResponse(userText);
            appendMessage('assistant', reply);
        }, 700 + Math.random() * 800);
    }

    function getResponse(text) {
        const t = text.toLowerCase();
        if (!t.trim()) return '请先输入问题。';

        // 关键词匹配（演示用）
        if (t.includes('简历') || t.includes('resume')) {
            return '简历建议：1) 用简洁标题和联系方式；2) 用项目/成果展示能力；3) 用量化数据支持成就；4) 针对岗位调整关键词。需要我帮你根据目标岗位生成一段简历描述吗？';
        }
        if (t.includes('面试') || t.includes('面试技巧')) {
            return '面试建议：1) 梳理项目 STAR（情境·任务·行动·结果）；2) 准备自我介绍与常见问题；3) 练习行为型问题回答；4) 对岗位职责做具体匹配示例。想要模拟一段常见面试问答吗？';
        }
        if (t.includes('技能') || t.includes('技能清单') || t.includes('需要学')) {
            return '技能建议：不同岗位侧重点不同。示例 — 数据分析：SQL、Python、Pandas、可视化；前端：HTML/CSS、JavaScript、React；产品：需求分析、原型、数据解读。告诉我目标岗位，我给出具体学习路径。';
        }
        if (t.includes('岗位') || t.includes('职位') || t.includes('适合我')) {
            return '岗位建议：请描述你的专业、项目经验和兴趣（例如：计算机/数据/设计），我会给出适合的岗位类型与入门路径。也可以直接查看「职位库」获得实时岗位信息。';
        }
        if (t.includes('薪资') || t.includes('工资') || t.includes('待遇')) {
            return '薪资参考：同一岗位薪资受城市、公司规模与经验影响。建议在职位库中筛选目标城市与岗位了解更精确的薪资范围。需要我帮你查询典型技能对应的市场价吗（演示为建议）？';
        }

        // 默认回答与引导
        return '这是演示版智能回复：我可以帮你：写简历、准备面试、推荐技能学习路径或匹配岗位。请更具体地描述你的背景与问题，例如“我学的是金融，想做数据分析，该如何入门？”';
    }

    async function sendToServer(text) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
            const resp = await fetch('/api/aichat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!resp.ok) {
                const detail = await resp.text().catch(() => '无法读取错误详情');
                return { ok: false, error: `后端返回错误: ${resp.status} ${resp.statusText} - ${detail}` };
            }
            const data = await resp.json();
            return { ok: true, reply: data.reply };
        } catch (e) {
            clearTimeout(timeout);
            return { ok: false, error: `请求失败：${e.message}` };
        }
    }

    sendBtn.addEventListener('click', async () => {
        const text = inputEl.value.trim();
        if (!text) return;
        appendMessage('user', text);
        inputEl.value = '';
        sendBtn.disabled = true;
        appendMessage('assistant', '<i>思考中…</i>');

        // 优先调用后端代理；失败则回退到本地模拟
        const serverResp = await sendToServer(text);
        // 移除思考占位
        if (messagesEl.lastChild && messagesEl.lastChild.innerText.includes('思考中')) {
            messagesEl.removeChild(messagesEl.lastChild);
        }
        if (serverResp && serverResp.ok) {
            appendMessage('assistant', serverResp.reply);
        } else {
            // 如果有后端错误信息，展示并回退
            if (serverResp && serverResp.error) {
                appendMessage('assistant', `（后端错误：${serverResp.error}，已使用本地响应作为回退）`);
            }
            simulateReply(text);
        }
        sendBtn.disabled = false;
    });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // 示例开场
    appendMessage('assistant', '你好，我是 AI智赋。可以问我关于简历、面试、岗位匹配和技能建议的问题。');
});
