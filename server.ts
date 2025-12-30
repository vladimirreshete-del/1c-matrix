
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.json({ limit: '10mb' }) as any);
app.use(express.static(path.join(__dirname, 'dist')) as any);

// Инициализация БД из файла
let db: Record<string, any> = {};
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error("Ошибка чтения БД, создаем новую");
    db = {};
  }
}

// Сохранение БД в файл
const saveDb = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// API: Получение данных
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

// API: Сохранение данных
app.post('/api/data/:id', (req, res) => {
  const { id } = req.params;
  db[id] = req.body;
  saveDb(); // Записываем на диск
  res.json({ success: true });
});

// Хелсчек для Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Все остальные запросы отдают фронтенд
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Приложение собирается или билд отсутствует. Запустите npm run build.");
  }
});

app.listen(PORT, () => {
  console.log(`1C Matrix Server: http://localhost:${PORT}`);
});
