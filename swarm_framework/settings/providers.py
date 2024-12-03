from typing import Any, Dict, List, Optional
from datetime import datetime
import uuid
from .interfaces import (
    ISettingsProvider, 
    IInstructionProvider, 
    IToolProvider
)
from .models import (
    Setting,
    SettingsProfile,
    InstructionTemplate,
    SettingType,
    SettingValidation,
    SettingOption
)
from .manager import SettingsManager

class EnhancedSettingsProvider(ISettingsProvider):
    """Расширенный провайдер настроек с поддержкой профилей"""
    
    def __init__(self, storage_dir: str = "settings"):
        self._manager = SettingsManager(storage_dir)
        self._initialize_default_settings()
        
    def _initialize_default_settings(self):
        """Инициализация настроек по умолчанию"""
        default_settings = [
            Setting(
                key="temperature",
                type=SettingType.SLIDER,
                label="Temperature",
                description="Контролирует креативность генерации",
                default_value=0.7,
                validation=SettingValidation(
                    required=True,
                    min_value=0.0,
                    max_value=1.0
                )
            ),
            Setting(
                key="max_tokens",
                type=SettingType.NUMBER,
                label="Max Tokens",
                description="Максимальное количество токенов",
                default_value=1000,
                validation=SettingValidation(
                    required=True,
                    min_value=1,
                    max_value=4096
                )
            ),
            Setting(
                key="model",
                type=SettingType.SELECT,
                label="Модель",
                description="Модель для генерации",
                default_value="gpt-4",
                options=[
                    SettingOption("gpt-4", "GPT-4", "Самая мощная модель"),
                    SettingOption("gpt-3.5-turbo", "GPT-3.5 Turbo", "Быстрая и эффективная модель"),
                    SettingOption("claude-2", "Claude 2", "Альтернативная модель от Anthropic")
                ]
            ),
            Setting(
                key="system_prompt",
                type=SettingType.MARKDOWN,
                label="Системный промпт",
                description="Базовые инструкции для модели",
                default_value="Вы - AI-ассистент, специализирующийся на выполнении различных задач.",
                validation=SettingValidation(
                    required=True,
                    min_length=10
                )
            ),
            Setting(
                key="tools",
                type=SettingType.MULTISELECT,
                label="Инструменты",
                description="Доступные инструменты",
                default_value=["search", "calculator"],
                options=[
                    SettingOption("search", "Поиск", "Поиск информации в интернете"),
                    SettingOption("calculator", "Калькулятор", "Выполнение математических вычислений"),
                    SettingOption("code", "Код", "Анализ и генерация кода"),
                    SettingOption("files", "Файлы", "Работа с файлами")
                ]
            )
        ]
        
        for setting in default_settings:
            try:
                self._manager.register_setting(setting)
            except KeyError:
                pass
                
        # Создание профиля по умолчанию
        try:
            default_profile = SettingsProfile(
                id="default",
                name="Default Profile",
                description="Профиль по умолчанию",
                is_default=True
            )
            self._manager.create_profile(default_profile)
        except KeyError:
            pass
            
    def get_settings(self) -> Dict[str, Setting]:
        """Получение всех настроек"""
        return self._manager.get_settings()
        
    def get_setting(self, key: str) -> Optional[Setting]:
        """Получение настройки по ключу"""
        return self._manager.get_setting(key)
        
    def update_setting(self, key: str, value: Any) -> None:
        """Обновление значения настройки"""
        self._manager.update_setting(key, value)
        
    def validate_setting(self, key: str, value: Any) -> bool:
        """Проверка значения настройки"""
        setting = self.get_setting(key)
        if not setting:
            return False
        is_valid, _ = self._manager._validator.validate(setting, value)
        return is_valid

class EnhancedInstructionProvider(IInstructionProvider):
    """Расширенный провайдер инструкций с поддержкой шаблонов"""
    
    def __init__(self, storage_dir: str = "settings"):
        self._manager = SettingsManager(storage_dir)
        self._initialize_default_templates()
        
    def _initialize_default_templates(self):
        """Инициализация шаблонов по умолчанию"""
        default_templates = [
            InstructionTemplate(
                id="base_agent",
                name="Базовый агент",
                description="Шаблон для базового агента",
                content="""
                # Базовые инструкции
                Вы - AI-ассистент по имени {agent_name}, специализирующийся на {specialization}.
                
                ## Основные правила:
                1. {rules}
                2. Всегда следуйте указанным инструкциям
                3. При необходимости запрашивайте уточнения
                
                ## Доступные инструменты:
                {tools}
                
                ## Дополнительные параметры:
                - Температура: {temperature}
                - Максимальное количество токенов: {max_tokens}
                """,
                variables={
                    "agent_name": "Assistant",
                    "specialization": "выполнении различных задач",
                    "rules": "Быть полезным и информативным",
                    "tools": "- Поиск\n- Калькулятор",
                    "temperature": "0.7",
                    "max_tokens": "1000"
                }
            ),
            InstructionTemplate(
                id="content_creator",
                name="Контент-криэйтор",
                description="Шаблон для агента по созданию контента",
                content="""
                # Инструкции по созданию контента
                Вы - AI-ассистент, специализирующийся на создании {content_type}.
                
                ## Стиль и тон:
                {style_guide}
                
                ## SEO требования:
                {seo_requirements}
                
                ## Форматирование:
                {formatting_rules}
                """,
                variables={
                    "content_type": "текстового контента",
                    "style_guide": "- Профессиональный тон\n- Четкое изложение",
                    "seo_requirements": "- Использование ключевых слов\n- Оптимизация заголовков",
                    "formatting_rules": "- Структурированный текст\n- Подзаголовки и списки"
                }
            )
        ]
        
        for template in default_templates:
            try:
                self._manager.create_template(template)
            except KeyError:
                pass
                
    def get_instructions(self) -> Dict[str, str]:
        """Получение всех инструкций"""
        templates = self._manager.get_templates()
        return {tid: template.content for tid, template in templates.items()}
        
    def get_instruction(self, key: str) -> Optional[str]:
        """Получение инструкции по ключу"""
        template = self._manager.get_template(key)
        return template.content if template else None
        
    def update_instruction(self, key: str, value: str) -> None:
        """Обновление инструкции"""
        self._manager.update_template(key, value)
        
    def create_instruction(self, name: str, content: str, variables: Dict[str, str] = None) -> str:
        """Создание новой инструкции"""
        template_id = str(uuid.uuid4())
        template = InstructionTemplate(
            id=template_id,
            name=name,
            content=content,
            variables=variables or {}
        )
        self._manager.create_template(template)
        return template_id
        
    def render_instruction(self, key: str, variables: Dict[str, str] = None) -> Optional[str]:
        """Рендеринг инструкции с переменными"""
        try:
            return self._manager.render_template(key, variables)
        except KeyError:
            return None

class EnhancedToolProvider(IToolProvider):
    """Расширенный провайдер инструментов с валидацией"""
    
    def __init__(self):
        self._tools: Dict[str, Any] = {}
        self._initialize_default_tools()
        
    def _initialize_default_tools(self):
        """Инициализация инструментов по умолчанию"""
        # TODO: Добавить базовые инструменты
        pass
        
    def get_tools(self) -> Dict[str, Any]:
        """Получение всех инструментов"""
        return self._tools
        
    def get_tool(self, key: str) -> Optional[Any]:
        """Получение инструмента по ключу"""
        return self._tools.get(key)
        
    def register_tool(self, key: str, tool: Any) -> None:
        """Регистрация нового инструмента"""
        if not self.validate_tool(key, tool):
            raise ValueError(f"Invalid tool {key}")
            
        self._tools[key] = tool
        
    def validate_tool(self, key: str, tool: Any) -> bool:
        """Валидация инструмента"""
        # TODO: Реализовать валидацию инструментов
        return True
