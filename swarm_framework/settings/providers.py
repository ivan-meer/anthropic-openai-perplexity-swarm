from typing import Any, Dict, List, Optional
from .interfaces import (
    ISettingsProvider, 
    IInstructionProvider, 
    IToolProvider,
    Setting,
    SettingType,
    SettingOption
)

class BaseSettingsProvider(ISettingsProvider):
    """Базовый провайдер настроек"""
    
    def __init__(self):
        self._settings: Dict[str, Setting] = {}
        self._values: Dict[str, Any] = {}
        self._initialize_settings()
        
    def _initialize_settings(self):
        """Инициализация настроек по умолчанию"""
        self._settings = {
            "temperature": Setting(
                key="temperature",
                type=SettingType.SLIDER,
                label="Temperature",
                description="Контролирует креативность генерации",
                default_value=0.7,
                min_value=0.0,
                max_value=1.0,
                step=0.1
            ),
            "max_tokens": Setting(
                key="max_tokens",
                type=SettingType.NUMBER,
                label="Max Tokens",
                description="Максимальное количество токенов",
                default_value=1000,
                min_value=1,
                max_value=4096
            ),
            "model": Setting(
                key="model",
                type=SettingType.SELECT,
                label="Модель",
                description="Модель для генерации",
                default_value="gpt-4",
                options=[
                    SettingOption("gpt-4", "GPT-4"),
                    SettingOption("gpt-3.5-turbo", "GPT-3.5 Turbo"),
                    SettingOption("claude-2", "Claude 2")
                ]
            )
        }
        
        # Инициализация значений по умолчанию
        for key, setting in self._settings.items():
            self._values[key] = setting.default_value
            
    def get_settings(self) -> Dict[str, Setting]:
        return self._settings
        
    def get_setting(self, key: str) -> Optional[Setting]:
        return self._settings.get(key)
        
    def update_setting(self, key: str, value: Any) -> None:
        if key not in self._settings:
            raise KeyError(f"Setting {key} not found")
            
        if not self.validate_setting(key, value):
            raise ValueError(f"Invalid value for setting {key}")
            
        self._values[key] = value
        
    def validate_setting(self, key: str, value: Any) -> bool:
        setting = self._settings.get(key)
        if not setting:
            return False
            
        if setting.type == SettingType.NUMBER or setting.type == SettingType.SLIDER:
            if not isinstance(value, (int, float)):
                return False
            if setting.min_value is not None and value < setting.min_value:
                return False
            if setting.max_value is not None and value > setting.max_value:
                return False
                
        elif setting.type == SettingType.SELECT:
            if not setting.options:
                return False
            if value not in [opt.value for opt in setting.options]:
                return False
                
        return True

class BaseInstructionProvider(IInstructionProvider):
    """Базовый провайдер инструкций"""
    
    def __init__(self):
        self._instructions: Dict[str, str] = {}
        self._initialize_instructions()
        
    def _initialize_instructions(self):
        """Инициализация инструкций по умолчанию"""
        self._instructions = {
            "system": "Вы - AI-ассистент, специализирующийся на создании контента.",
            "content_creation": "При создании контента следуйте следующим правилам:\n1. ...",
            "seo": "При SEO-оптимизации учитывайте:\n1. ...",
            "formatting": "Правила форматирования контента:\n1. ..."
        }
        
    def get_instructions(self) -> Dict[str, str]:
        return self._instructions
        
    def get_instruction(self, key: str) -> Optional[str]:
        return self._instructions.get(key)
        
    def update_instruction(self, key: str, value: str) -> None:
        self._instructions[key] = value

class BaseToolProvider(IToolProvider):
    """Базовый провайдер инструментов"""
    
    def __init__(self):
        self._tools: Dict[str, Any] = {}
        self._initialize_tools()
        
    def _initialize_tools(self):
        """Инициализация инструментов по умолчанию"""
        # TODO: Добавить базовые инструменты
        pass
        
    def get_tools(self) -> Dict[str, Any]:
        return self._tools
        
    def get_tool(self, key: str) -> Optional[Any]:
        return self._tools.get(key)
        
    def register_tool(self, key: str, tool: Any) -> None:
        if not self.validate_tool(key, tool):
            raise ValueError(f"Invalid tool {key}")
            
        self._tools[key] = tool
        
    def validate_tool(self, key: str, tool: Any) -> bool:
        # TODO: Добавить валидацию инструментов
        return True
