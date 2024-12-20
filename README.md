# Документация проекта

## Описание проекта

**SWARM AI FRAMEWORK** - это интеллектуальная система управления туристическим контентом для сайта Phuket.guru. Проект использует распределенную сеть специализированных AI-агентов для автоматизации создания, обновления и оптимизации контента.

## Структура проекта

Проект разделен на два основных компонента: фронтенд и бэкенд.

### Фронтенд

Фронтенд построен с использованием React и находится в директории frontend. Основные части фронтенда:

- **Компоненты**: находятся в 

components

.

  - 

App

: основной компонент приложения, содержит маршрутизацию и навигацию.
  - 

HomePage

: главная страница с обзором агентов.
  - 

AgentCard

: карточка отдельного агента с возможностью взаимодействия.
  - 

AddAgentModal

: модальное окно для добавления нового агента.
  - 

AgentSettings

: настройки выбранного агента.
  - 

AgentInstructions

: управление инструкциями агента.
  - 

AgentTools

: управление инструментами агента.
  - 

DocsPage

: страница документации проекта.

- **Стилизация**: осуществляется с помощью `styled-components` и темы, определенной в файле 

theme.js

.

- **Контексты**: глобальные состояния и уведомления реализованы в 

ToastContext

.

### Бэкенд

Бэкенд написан на Python с использованием FastAPI и включает в себя:

- **Агенты**: находятся в директории 

agents

.

  - 

BaseAgent

: базовый класс агента.
  - 

ContentCreator

: агент для генерации контента.

- **API**: эндпоинты для взаимодействия с фронтендом расположены в 

api

.

  - 

agents.py

: эндпоинты для управления агентами.
  - 

base.py

: базовые настройки API.

- **Ядро системы**: ключевые механизмы работы находятся в 

core

.

  - 

Engine

: основной движок системы.

- **Настройки**: конфигурации и провайдеры инструкций в 

settings

.

  - 

Providers

: провайдеры системных инструкций.

## Запуск проекта

### Установка зависимостей

Фронтенд:

```sh
cd frontend
npm install
```

Бэкенд:

```sh
pip install -r requirements.txt
```

### Запуск приложения

Фронтенд:

```sh
npm start
```

Бэкенд:

```sh
python app.py
```

## Использование приложения

- **Главная страница**: отображает список агентов и их статус. Файл: 

HomePage

.

- **Добавление агента**: кликните "Добавить агента" и заполните форму. Компонент: 

AddAgentModal

.

- **Настройка агента**: нажмите на иконку настроек на карточке агента. Компонент: 

AgentSettings

.

- **Управление инструкциями**: в настройках агента перейдите на вкладку "Инструкции". Компонент: 

AgentInstructions

.

- **Управление инструментами**: во вкладке "Инструменты" настройте доступные агенту функции. Компонент: 

AgentTools

.

## Дополнительная информация

- **Документация**: доступна на странице 

DocsPage

 или в файле 

README.md

.

- **Тема и стилизация**: все стили описаны в файле темы 

theme.js

.

- **Уведомления**: реализованы с помощью контекста 

ToastContext

.

## Контакты

По вопросам и предложениям обращайтесь:

- **Техническая поддержка**: tech@phuket.guru
- **Общие вопросы**: info@phuket.guru

---

*Проект активно развивается командой Phuket.guru для улучшения качества туристического контента.*