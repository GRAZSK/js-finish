document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dynamicForm');
    const container = document.getElementById('properties-container');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const messageBox = document.getElementById('formMessage');

    // 1. Динамическое создание элементов (DOM)
    addFieldBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'property-row';
        div.innerHTML = `
            <input type="text" name="propKey" placeholder="игры" required>
            <input type="text" name="propValue" placeholder="музыка" required>
            <button type="button" class="remove-btn" style="color:red;">✕</button>
        `;
        
        // Добавляем возможность удаления строки
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
        });
        
        container.appendChild(div);
    });

    // 2. Обработка отправки формы и валидация
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageBox.textContent = '';
        messageBox.className = 'message';

        const category = document.getElementById('category').value.trim();
        
 
        if (!/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]{2,}$/.test(category)) {
            showMessage('Категория должна содержать буквы (русские или английские), цифры, пробелы или дефисы. Минимум 2 символа.', 'error');
            return;
        }

        // Собираем динамические поля в объект
        const properties = {};
        const keys = document.getElementsByName('propKey');
        const values = document.getElementsByName('propValue');
        
        let isValid = true;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i].value.trim();
            const value = values[i].value.trim();
            
            if (!key || !value) {
                isValid = false;
                break;
            }

            const safeKey = key.replace(/[^a-zA-Zа-яА-ЯёЁ0-9_\s]/g, '_');
            properties[safeKey] = value;
        }

        if (!isValid || Object.keys(properties).length === 0) {
            showMessage('Заполните все поля характеристик корректно', 'error');
            return;
        }

        // 3. Fetch API для взаимодействия с сервером
        try {
            const response = await fetch('/api/dynamic-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, properties })
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Успешно! Структура БД обновлена, данные сохранены.', 'success');
                form.reset();

                container.innerHTML = '<h3>Характеристики:</h3><div class="property-row"><input type="text" name="propKey" placeholder="Свойство" required><input type="text" name="propValue" placeholder="Значение" required></div>';
            } else {
                showMessage('Ошибка сервера: ' + result.error, 'error');
            }
        } catch (error) {
            showMessage('Ошибка сети при отправке данных', 'error');
            console.error(error);
        }
    });

    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = `message ${type}`;
    }
});