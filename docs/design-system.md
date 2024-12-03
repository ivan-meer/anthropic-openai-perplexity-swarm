# SWARM AI FRAMEWORK - Дизайн-система

## 🎨 Цветовая палитра

### Основные цвета
```css
--primary: #2563eb;      /* Основной синий */
--primary-light: #3b82f6; /* Светлый синий */
--secondary: #10b981;    /* Зеленый */
--dark: #1f2937;        /* Темный */
--light: #f3f4f6;       /* Светлый */
```

### Статусы
```css
--danger: #ef4444;      /* Красный - ошибки */
--warning: #f59e0b;     /* Оранжевый - предупреждения */
--success: #10b981;     /* Зеленый - успех */
```

## 📝 Типографика

### Шрифты
- Основной: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- Моноширинный: `'JetBrains Mono', monospace` (для кода)

### Размеры
```css
/* Заголовки */
h1: 2.25rem (36px)
h2: 1.875rem (30px)
h3: 1.5rem (24px)
h4: 1.25rem (20px)

/* Текст */
Основной: 1rem (16px)
Маленький: 0.875rem (14px)
```

## 🎭 Эффекты

### Тени
```css
/* Карточки */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

/* Кнопки */
box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);

/* Статус */
box-shadow: 0 0 10px var(--primary);
```

### Градиенты
```css
/* Фон */
background: linear-gradient(135deg, #1f2937 0%, #111827 100%);

/* Кнопки */
background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
```

### Анимации
```css
/* Появление */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Пульсация */
@keyframes glow {
    from {
        box-shadow: 0 0 5px var(--primary),
                    0 0 10px var(--primary),
                    0 0 15px var(--primary);
    }
    to {
        box-shadow: 0 0 10px var(--primary),
                    0 0 20px var(--primary),
                    0 0 30px var(--primary);
    }
}
```

## 🧩 Компоненты

### Карточка агента
- Фон: `rgba(255, 255, 255, 0.05)`
- Размытие: `backdrop-filter: blur(10px)`
- Скругление: `border-radius: 1rem`
- Анимация появления: `fadeIn 0.5s ease-out`

### Бейджи функций
- Фон: `rgba(37, 99, 235, 0.1)`
- Обводка: `1px solid rgba(37, 99, 235, 0.2)`
- Скругление: `border-radius: 2rem`
- Анимация при наведении: `transform: translateY(-2px)`

### Кнопки
- Основная: градиент + тень
- Иконка: круглая с прозрачным фоном
- Анимация при наведении: `transform: scale(1.1)`

### Индикатор статуса
- Размер: `12px`
- Форма: круглая
- Анимация: пульсация с свечением

## 🎯 Состояния

### Интерактивные элементы
```css
/* Наведение */
transition: all 0.3s ease;
transform: translateY(-2px) или scale(1.1);

/* Отключено */
opacity: 0.5;
cursor: not-allowed;

/* Фокус */
outline: none;
border-color: var(--primary);
box-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
```

### Статусы агента
```css
/* Initialized */
background: var(--primary);
animation: glow 1.5s infinite;

/* Running */
background: var(--success);

/* Error */
background: var(--danger);

/* Completed */
background: var(--secondary);
```

## 📱 Адаптивность

### Сетка агентов
```css
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 2rem;
padding: 2rem;
max-width: 1400px;
```

### Медиа-запросы
```css
/* Мобильные */
@media (max-width: 640px) {
    /* Уменьшенные отступы */
    padding: 1rem;
    
    /* Одна колонка */
    grid-template-columns: 1fr;
}

/* Планшеты */
@media (max-width: 1024px) {
    /* Две колонки */
    grid-template-columns: repeat(2, 1fr);
}
