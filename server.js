
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Render монтирует диск в /data, если он есть
const DATA_DIR = fs.existsSync('/data') ? '/data' : __dirname;
const DB_FILE = path.join(DATA_DIR, 'database.json');
const DIST_PATH = path.join(__dirname, 'dist');

app.use(express.json({ limit: '10mb' }));

// Статические файлы из папки dist (собирается Vite)
app.use(express.static(DIST_PATH));

let db = {};
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error("DB Error:", e);
    db = {};
  }
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("Save Error:", e);
  }
};

app.get('/api/data/:id', (req, res) => {
  const { id } = req.params;
  // Возвращаем пустые массивы, чтобы фронтенд сам наполнил их данными из Telegram WebApp
  const data = db[id] || { 
    tasks: [], 
    team: [] 
  };
  res.json(data);
});

app.post('/api/data/:id', (req, res) => {
  const { id } = req.params;
  db[id] = req.body;
  saveDb();
  res.json({ success: true });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    dist: fs.existsSync(DIST_PATH),
    db: DB_FILE
  });
});

// Для всех остальных путей отдаем index.html (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <body style="background:#0F172A;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">
        <div style="text-align:center">
          <h2>1C MATRIX</h2>
          <p>Сборка приложения... Подождите 30 секунд и обновите.</p>
          <button onclick="location.reload()" style="background:#0055BB;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer">ОБНОВИТЬ</button>
        </div>
      </body>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
