from typing import Dict, Any
from .models import (
    Setting,
    SettingsProfile,
    InstructionTemplate,
    SettingType,
    SettingValidation,
    SettingOption
)
from .providers import (
    EnhancedSettingsProvider,
    EnhancedInstructionProvider,
    EnhancedToolProvider
)

def example_settings_usage():
    """Пример использования системы настроек"""
    
    # Инициализация провайдеров
    settings_provider = EnhancedSettingsProvider()
    instruction_provider = EnhancedInstructionProvider()
    tool_provider = EnhancedToolProvider()
    
    # Пример работы с настройками
    settings = settings_provider.get_settings()
    print("Доступные настройки:", list(settings.keys()))
    
    # Обновление настройки
    settings_provider.update_setting("temperature", 0.8)
    
    # Получение конкретной настройки
    model_setting = settings_provider.get_setting("model")
    print(f"Текущая модель: {model_setting.default_value}")
    
    # Пример работы с инструкциями
    instructions = instruction_provider.get_instructions()
    print("Доступные шаблоны инструкций:", list(instructions.keys()))
    
    # Создание новой инструкции
    custom_instruction_id = instruction_provider.create_instruction(
        name="Custom Agent",
        content="""
        # Пользовательский агент
        Вы - специализированный AI-ассистент для {task_type}.
        
        ## Основные обязанности:
        {responsibilities}
        
        ## Ограничения:
        {limitations}
        """,
        variables={
            "task_type": "анализа данных",
            "responsibilities": "- Обработка данных\n- Визуализация\n- Отчетность",
            "limitations": "- Конфиденциальность\n- Точность результатов"
        }
    )
    
    # Рендеринг инструкции с переменными
    rendered_instruction = instruction_provider.render_instruction(
        custom_instruction_id,
        {
            "task_type": "машинного обучения",
            "responsibilities": "- Обучение моделей\n- Оценка качества\n- Деплой",
            "limitations": "- Ресурсы GPU\n- Время обучения"
        }
    )
    print("\nОтрендеренная инструкция:", rendered_instruction)
    
    # Пример создания профиля настроек для конкретного агента
    agent_settings: Dict[str, Any] = {
        "temperature": 0.9,
        "max_tokens": 2000,
        "model": "gpt-4",
        "system_prompt": "Вы - специализированный агент для анализа данных.",
        "tools": ["search", "calculator", "code"]
    }
    
    # Валидация настроек перед использованием
    for key, value in agent_settings.items():
        if not settings_provider.validate_setting(key, value):
            print(f"Ошибка: некорректное значение для настройки {key}")
            
    # Пример использования провайдера инструментов
    tool_provider.register_tool(
        "data_analyzer",
        {
            "name": "Data Analyzer",
            "description": "Инструмент для анализа данных",
            "version": "1.0.0",
            "functions": {
                "analyze": lambda data: {"mean": sum(data)/len(data)},
                "visualize": lambda data: "Chart visualization"
            }
        }
    )
    
    analyzer_tool = tool_provider.get_tool("data_analyzer")
    if analyzer_tool:
        result = analyzer_tool["functions"]["analyze"]([1, 2, 3, 4, 5])
        print("\nРезультат анализа:", result)

def main():
    """Запуск примеров использования"""
    print("=== Демонстрация системы управления настройками ===\n")
    example_settings_usage()

if __name__ == "__main__":
    main()
