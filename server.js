
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// На Render данные лучше хранить на примонтированном диске /data/
// Если диска нет, используем текущую директорию
const DATA_DIR = fs.existsSync('/data') ? '/data' : __dirname;
const DB_FILE = path.join(DATA_DIR, 'database.json');

app.use(express.json({ limit: '10mb' }));

// Раздача статики из папки dist (куда Vite собирает фронтенд)
app.use(express.static(path.join(__dirname, 'dist')));

// Инициализация БД
let db = {};
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error("Ошибка чтения БД:", e);
    db = {};
  }
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("Ошибка сохранения БД:", e);
  }
};

app.get('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const data = db[id] || { 
    tasks: [], 
    team: [
      { id: '1', name: 'Системный Администратор', role: 'Админ', email: 'matrix@1c.ru', avatar: 'https://picsum.photos/seed/admin/100/100' }
    ] 
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
  res.json({ status: 'online', db_path: DB_FILE });
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Приложение еще собирается... Пожалуйста, подождите 1-2 минуты и обновите страницу.");
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`База данных: ${DB_FILE}`);
});
