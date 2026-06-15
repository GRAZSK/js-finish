const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../f')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../f/indexmain.html'));
});

// ==================== API МАРШРУТЫ ====================

// GET - Получить все динамические данные
app.get('/api/dynamic-data', async (req, res) => {
    try {
        const rows = await db.allAsync(
            'SELECT * FROM data_buffer ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения данных' });
    }
});

// 2. POST - Добавить товар
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        
        const result = await db.runAsync(
            'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
            [name, price, description]
        );
        
        res.json({ id: result.lastID, name, price, description });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при добавлении' });
    }
});

// 3. PUT - Обновить товар
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, price } = req.body;
        const { id } = req.params;
        
        await db.runAsync(
            'UPDATE products SET name = ?, price = ? WHERE id = ?',
            [name, price, id]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка обновления' });
    }
});

// 4. DELETE - Удалить товар
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления' });
    }
});

// 5. POST - Динамические данные (ФИНАЛОЧКА)
app.post('/api/dynamic-data', async (req, res) => {
    try {
        const { category, properties } = req.body;
        
        if (!category || !properties) {
            return res.status(400).json({ error: 'Некорректные данные' });
        }

        // SQLite не поддерживает JSONB, поэтому храним как строку
        const result = await db.runAsync(
            'INSERT INTO data_buffer (object_category, properties) VALUES (?, ?)',
            [category, JSON.stringify(properties)]
        );
        
        res.json({ 
            success: true, 
            message: 'Данные сохранены!',
            id: result.lastID 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(` Сервер запущен: http://localhost:${PORT}`);
});