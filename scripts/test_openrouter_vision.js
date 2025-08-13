/*
Direct OpenRouter vision test via Node.js.
Reads API key from config.js (window.APP_CONFIG) or env OPENROUTER_API_KEY.
Encodes public/rose.jpeg as data URL and calls chat/completions with image.
*/

// Use only Node built-ins
const fs = require('fs');
const path = require('path');

function readApiKeyFromConfig(configPath) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const m = raw.match(/OPENROUTER_API_KEY\s*:\s*"([^"]+)"/);
    if (m && m[1] && !m[1].includes('REPLACE_WITH')) return m[1].trim();
  } catch (_) {}
  return null;
}

async function fileToDataUrl(absPath) {
  const buf = fs.readFileSync(absPath);
  const base64 = buf.toString('base64');
  const ext = path.extname(absPath).toLowerCase().replace('.', '') || 'jpeg';
  return `data:image/${ext};base64,${base64}`;
}

async function main() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'config.js');
  const imgPath = fs.existsSync(path.join(cwd, 'public', 'rose.jpeg'))
    ? path.join(cwd, 'public', 'rose.jpeg')
    : path.join(cwd, 'rose.jpeg');

  const keyFromConfig = readApiKeyFromConfig(configPath);
  const API_KEY = process.env.OPENROUTER_API_KEY || keyFromConfig || '';
  const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';
  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  if (!API_KEY) {
    console.error('Missing OPENROUTER_API_KEY. Set env or edit config.js');
    process.exit(1);
  }
  if (!fs.existsSync(imgPath)) {
    console.error('Image not found:', imgPath);
    process.exit(1);
  }

  const dataUrl = await fileToDataUrl(imgPath);

  const payload = {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          '你是植物识别专家，请严格返回 JSON：{"name":"中英文名或中文名","confidence":0-1,"reason":"分析要点"}。只输出 JSON。',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: '识别这张植物图片，给出名称、置信度与理由（只返回JSON）。' },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    max_tokens: 300,
    temperature: 0.1,
  };

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    // Optional identification headers (use simple values for server-side call)
    'HTTP-Referer': 'http://localhost',
    'X-Title': 'Plant Companion Vision Test',
  };

  console.log('[request] POST', API_URL);
  try {
    const resp = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(payload) });
    const text = await resp.text();
    let json = null;
    try { json = JSON.parse(text); } catch (_) {}

    console.log('\n=== HTTP', resp.status, resp.statusText, '===');
    console.log('\n-- Raw Response --');
    console.log(text);

    if (json && json.choices && json.choices[0] && json.choices[0].message) {
      const content = json.choices[0].message.content || '';
      console.log('\n-- Parsed content --');
      try {
        const parsed = JSON.parse(content);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (_) {
        console.log(content);
      }
    }

    if (resp.status === 401) {
      console.error('\n[Hint] 401 未授权：通常是 API Key 无效或未携带 Authorization 头。');
      console.error('请检查：');
      console.error('- OPENROUTER_API_KEY 是否正确、未过期');
      console.error('- 是否包含前缀 "sk-or-"');
    }
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
}

main();


