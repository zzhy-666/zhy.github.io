const express = require('express');
const fetch = global.fetch || require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 简单静态托管（在同一仓库内运行时可用）
app.use(express.static(path.join(__dirname)));

app.post('/api/aichat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
  }

  const { message } = req.body || {};
  console.log('[api/aichat] incoming message:', message ? (message.length>200? message.slice(0,200)+'...': message) : '<empty>');
  if (!message) return res.status(400).json({ error: 'Missing message in request body' });

  try {
    const payload = {
      model,
      messages: [
        { role: 'system', content: '你是一个友好且实用的职业与技能咨询助手，回答尽量简洁，给出可执行建议。' },
        { role: 'user', content: message }
      ],
      temperature: 0.2,
      max_tokens: 800
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('[api/aichat] upstream error', r.status, r.statusText, text);
      return res.status(502).json({ error: 'Upstream API error', detail: text });
    }

    const data = await r.json();
    const assistant = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    console.log('[api/aichat] reply length:', assistant.length);
    return res.json({ reply: assistant });
  } catch (err) {
    console.error('[api/aichat] server error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Server error', detail: String(err && err.message ? err.message : err) });
  }
});

app.listen(port, () => {
  console.log(`AI proxy server listening on http://localhost:${port}`);
});
