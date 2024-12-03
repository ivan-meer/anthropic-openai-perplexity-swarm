from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class SettingType(Enum):
    """Типы настроек"""
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    SELECT = "select"
    MULTISELECT = "multiselect"
    SLIDER = "slider"
    CODE = "code"
    MARKDOWN = "markdown"

@dataclass
class SettingOption:
    """Опция для настроек типа SELECT и MULTISELECT"""
    value: str
    label: str
    description: Optional[str] = None

@dataclass
class Setting:
    """Базовый класс для настроек"""
    key: str
    type: SettingType
    label: str
    description: Optional[str] = None
    default_value: Any = None
    required: bool = False
    options: Optional[List[SettingOption]] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    step: Optional[float] = None

class ISettingsProvider(ABC):
    """Интерфейс для провайдера настроек"""
    
    @abstractmethod
    def get_settings(self) -> Dict[str, Setting]:
        """Получить все доступные настройки"""
        pass
        
    @abstractmethod
    def get_setting(self, key: str) -> Optional[Setting]:
        """Получить настройку по ключу"""
        pass
        
    @abstractmethod
    def update_setting(self, key: str, value: Any) -> None:
        """Обновить значение настройки"""
        pass
        
    @abstractmethod
    def validate_setting(self, key: str, value: Any) -> bool:
        """Проверить значение настройки"""
        pass

class IInstructionProvider(ABC):
    """Интерфейс для провайдера инструкций"""
    
    @abstractmethod
    def get_instructions(self) -> Dict[str, str]:
        """Получить все доступные инструкции"""
        pass
        
    @abstractmethod
    def get_instruction(self, key: str) -> Optional[str]:
        """Получить инструкцию по ключу"""
        pass
        
    @abstractmethod
    def update_instruction(self, key: str, value: str) -> None:
        """Обновить инструкцию"""
        pass

class IToolProvider(ABC):
    """Интерфейс для провайдера инструментов"""
    
    @abstractmethod
    def get_tools(self) -> Dict[str, Any]:
        """Получить все доступные инструменты"""
        pass
        
    @abstractmethod
    def get_tool(self, key: str) -> Optional[Any]:
        """Получить инструмент по ключу"""
        pass
        
    @abstractmethod
    def register_tool(self, key: str, tool: Any) -> None:
        """Зарегистрировать новый инструмент"""
        pass
        
    @abstractmethod
    def validate_tool(self, key: str, tool: Any) -> bool:
        """Проверить инструмент"""
        pass
