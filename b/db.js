// db.js
const mysql = require('mysql2/promise');

// Создаем пул подключений напрямую
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',             // Ваш пользователь MySQL
    password: 'Vere24!V1',             // Ваш пароль MySQL (часто пустой на локалке)
    database: 'js_finish_db', // Имя вашей базы данных
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;