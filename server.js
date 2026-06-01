import { createServer } from 'http';
import { mkdir, readFile, writeFile, access } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = `${__dirname}/data`;
const DATA_FILE = `${DATA_DIR}/server-state.json`;
const PORT = process.env.PORT || 3000;
const clients = new Set();

async function ensureDataFile() {
  try {
    await access(DATA_FILE);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
}

async function loadData() {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, 'utf8');
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

async function saveData(data) {
  await ensureDataFile();
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, body, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

function sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (pathname === '/api/state' && req.method === 'GET') {
    const data = await loadData();
    const key = url.searchParams.get('key');
    if (key) {
      return sendJson(res, { key, value: data[key] ?? null });
    }
    return sendJson(res, data);
  }

  if (pathname === '/api/state' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    try {
      const payload = JSON.parse(body);
      console.log('[POST /api/state] Received:', payload.key, '=', JSON.stringify(payload.value).substring(0, 100));
      if (!payload?.key) {
        return sendJson(res, { error: 'Missing key' }, 400);
      }
      const data = await loadData();
      data[payload.key] = payload.value;
      await saveData(data);
      console.log('[POST /api/state] Saved. Broadcasting to', clients.size, 'clients');
      const update = { key: payload.key, value: payload.value };
      for (const client of clients) {
        sendSSE(client, update);
      }
      return sendJson(res, { ok: true });
    } catch (error) {
      console.error('[POST /api/state] Error:', error.message);
      return sendJson(res, { error: 'Invalid JSON' }, 400);
    }
  }

  if (pathname === '/api/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    sendSSE(res, { message: 'connected' });
    clients.add(res);
    req.on('close', () => {
      clients.delete(res);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Server persistence running on http://localhost:${PORT}`);
});
