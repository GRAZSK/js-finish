const express = require('express');
const path = require('path');
const pool = require('./db');
// Проверка подключения к БД
pool.getConnection()
    .then(connection => {
        console.log('✅ База данных подключена успешно!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к БД:', err.message);
    });
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../f')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../f/indexmain.html'));
});

// ✅ Маршрут для динамических данных (ФИНАЛОЧКА)
app.post('/api/dynamic-data', async (req, res) => {
    try {
        const { category, properties } = req.body;
        
        if (!category || !properties) {
            return res.status(400).json({ error: 'Некорректные данные' });
        }

        // Используем уникальное имя переменной
        const insertQuery = `INSERT INTO data_buffer (object_category, properties) VALUES (?, ?)`;
        await pool.query(insertQuery, [category, JSON.stringify(properties)]);
        
        res.status(201).json({ 
            success: true, 
            message: 'Данные успешно сохранены!' 
        });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
});

// Другие маршруты API (если есть)
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
    console.log(` Сервер запущен: http://localhost:${PORT}`);
});