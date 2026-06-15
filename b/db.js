// b/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к SQLite:', err.message);
    } else {
        console.log('✅ Подключено к SQLite базе данных');
        console.log('📁 Файл базы данных:', dbPath);
    }
});

// ✅ ПРАВИЛЬНАЯ промисификация для SQLite3
// Метод all - возвращает массив строк
db.allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Метод get - возвращает одну строку
db.getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Метод run - возвращает lastID и changes
// ⚠️ ВАЖНО: используем function(), а не стрелочную, чтобы this работал!
db.runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {  // ← function, НЕ () => {}
            if (err) reject(err);
            else resolve({ 
                lastID: this.lastID, 
                changes: this.changes 
            });
        });
    });
};

// Создаем таблицы
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS data_buffer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            object_category TEXT NOT NULL,
            properties TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_processed INTEGER DEFAULT 0
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    console.log('✅ Таблицы созданы/проверены');
});

module.exports = db;