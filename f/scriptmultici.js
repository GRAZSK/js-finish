// Элементы DOM
    const loginSection = document.getElementById('loginSection');
    const chatSection = document.getElementById('chatSection');
    const usernameInput = document.getElementById('username');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUserSpan = document.getElementById('currentUser');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    // Ключи для localStorage
    const STORAGE_KEY_USER = 'chatbox_user';
    const STORAGE_KEY_MESSAGES = 'chatbox_messages';

    // Загрузка сообщений из localStorage
    function loadMessages() {
        const messages = localStorage.getItem(STORAGE_KEY_MESSAGES);
        return messages ? JSON.parse(messages) : [];
    }

    // Сохранение сообщений в localStorage
    function saveMessages(messages) {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }

    // Отображение сообщений
    function renderMessages() {
        const messages = loadMessages();
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">Сообщений пока нет. Будьте первым!</div>';
            return;
        }

        messagesContainer.innerHTML = messages.map(msg => `
            <div class="message">
                <div class="message-header">
                    <span class="message-author">${escapeHtml(msg.author)}</span>
                    <span>${msg.date}</span>
                </div>
                <div class="message-text">${escapeHtml(msg.text)}</div>
            </div>
        `).join('');

        // Прокрутка вниз
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Экранирование HTML для безопасности
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Вход в чат
    function login() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            alert('Пожалуйста, введите имя!');
            return;
        }

        localStorage.setItem(STORAGE_KEY_USER, username);
        currentUserSpan.textContent = username;
        loginSection.style.display = 'none';
        chatSection.style.display = 'block';
        renderMessages();
    }

    // Выход из чата
    function logout() {
        localStorage.removeItem(STORAGE_KEY_USER);
        usernameInput.value = '';
        loginSection.style.display = 'block';
        chatSection.style.display = 'none';
    }

    // Отправка сообщения
    function sendMessage() {
        const text = messageInput.value.trim();
        
        if (!text) {
            alert('Пожалуйста, введите сообщение!');
            return;
        }

        const author = localStorage.getItem(STORAGE_KEY_USER);
        if (!author) {
            alert('Сначала войдите в систему!');
            return;
        }

        const newMessage = {
            author: author,
            text: text,
            date: new Date().toLocaleString('ru-RU')
        };

        const messages = loadMessages();
        messages.push(newMessage);
        saveMessages(messages);

        messageInput.value = '';
        renderMessages();
    }

    // Обработчики событий
    loginBtn.addEventListener('click', login);
    
    logoutBtn.addEventListener('click', logout);
    
    sendBtn.addEventListener('click', sendMessage);

    // Отправка по Enter (Shift+Enter для новой строки)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            login();
        }
    });

    // Проверка авторизации при загрузке страницы
    window.addEventListener('DOMContentLoaded', () => {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUser) {
            currentUserSpan.textContent = savedUser;
            loginSection.style.display = 'none';
            chatSection.style.display = 'block';
            renderMessages();
        }
    });