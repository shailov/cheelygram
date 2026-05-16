document.getElementById('admin-login-trigger').addEventListener('click', function() {
    const password = prompt("Введите пароль администратора:");
    if (password === "24452315Axa_") {
        document.getElementById('admin-panel').classList.add('active');
        enableTextEditing(true);
        alert("Доступ разрешен. Теперь вы можете редактировать текст прямо на сайте и управлять блоками в панели справа.");
    } else if (password !== null) {
        alert("Неверный пароль!");
    }
});

document.getElementById('admin-close').addEventListener('click', function() {
    document.getElementById('admin-panel').classList.remove('active');
    enableTextEditing(false);
});

// Включение/выключение редактирования текста на странице
function enableTextEditing(enable) {
    const editableElements = document.querySelectorAll('[data-edit-id], .feature-card h3, .feature-card p');
    editableElements.forEach(el => {
        el.contentEditable = enable;
        if (enable) {
            el.style.outline = "1px dashed #e50914";
        } else {
            el.style.outline = "none";
        }
    });
}

// Переключение видимости блоков
const blocks = {
    'toggle-about': 'about-section',
    'toggle-features': 'features-section',
    'toggle-download': 'download-section'
};

Object.keys(blocks).forEach(id => {
    document.getElementById(id).addEventListener('change', function(e) {
        const targetBlock = document.getElementById(blocks[id]);
        if (e.target.checked) {
            targetBlock.style.display = "block";
        } else {
            targetBlock.style.display = "none";
        }
    });
});

// Добавление новой карточки преимуществ
document.getElementById('add-feature-btn').addEventListener('click', function() {
    const title = document.getElementById('new-feature-title').value;
    const desc = document.getElementById('new-feature-desc').value;

    if (!title || !desc) {
        alert("Заполните заголовок и описание карточки!");
        return;
    }

    const container = document.getElementById('features-container');
    const newCard = document.createElement('div');
    newCard.className = "feature-card";
    newCard.innerHTML = `
        <div class="feature-icon"><i class="fa-solid fa-circle-plus"></i></div>
        <h3 contenteditable="true" style="outline: 1px dashed #e50914">${title}</h3>
        <p contenteditable="true" style="outline: 1px dashed #e50914">${desc}</p>
    `;
    container.appendChild(newCard);
    
    // Очищаем инпуты
    document.getElementById('new-feature-title').value = "";
    document.getElementById('new-feature-desc').value = "";
});

// Сохранение изменений в LocalStorage
document.getElementById('admin-save-all').addEventListener('click', function() {
    // Сохраняем обычный текст по ID
    const textsToSave = {};
    document.querySelectorAll('[data-edit-id]').forEach(el => {
        textsToSave[el.getAttribute('data-edit-id')] = el.innerHTML;
    });
    localStorage.setItem('cheelygram_texts', JSON.stringify(textsToSave));

    // Сохраняем состояние чекбоксов видимости блоков
    const visibility = {
        about: document.getElementById('toggle-about').checked,
        features: document.getElementById('toggle-features').checked,
        download: document.getElementById('toggle-download').checked
    };
    localStorage.setItem('cheelygram_visibility', JSON.stringify(visibility));

    // Сохраняем структуру карточек преимуществ
    const featuresContainer = document.getElementById('features-container').innerHTML;
    localStorage.setItem('cheelygram_features', featuresContainer);

    alert("Все изменения успешно сохранены локально!");
    location.reload(); // Перезагружаем страницу для применения чистого вида
});

// Загрузка сохраненных данных при старте страницы
window.addEventListener('DOMContentLoaded', () => {
    // Восстанавливаем тексты
    const savedTexts = JSON.parse(localStorage.getItem('cheelygram_texts'));
    if (savedTexts) {
        Object.keys(savedTexts).forEach(id => {
            const el = document.querySelector(`[data-edit-id="${id}"]`);
            if (el) el.innerHTML = savedTexts[id];
        });
    }

    // Восстанавливаем видимость блоков
    const savedVisibility = JSON.parse(localStorage.getItem('cheelygram_visibility'));
    if (savedVisibility) {
        document.getElementById('toggle-about').checked = savedVisibility.about;
        document.getElementById('about-section').style.display = savedVisibility.about ? "block" : "none";

        document.getElementById('toggle-features').checked = savedVisibility.features;
        document.getElementById('features-section').style.display = savedVisibility.features ? "block" : "none";

        document.getElementById('toggle-download').checked = savedVisibility.download;
        document.getElementById('download-section').style.display = savedVisibility.download ? "block" : "none";
    }

    // Восстанавливаем карточки
    const savedFeatures = localStorage.getItem('cheelygram_features');
    if (savedFeatures) {
        document.getElementById('features-container').innerHTML = savedFeatures;
    }
});
