const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('database.db');

// Middleware для обработки JSON
app.use(bodyParser.json());

// Создание таблицы в базе данных
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
    )
`);

// Обработка POST-запроса
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;

    db.run(
        'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        function (err) {
            if (err) {
                return res.status(500).send('Ошибка при сохранении данных');
            }
            res.send('Данные успешно сохранены!');
        }
    );
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});