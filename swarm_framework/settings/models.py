from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from datetime import datetime
from enum import Enum

class SettingType(Enum):
    """Расширенные типы настроек"""
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    SELECT = "select"
    MULTISELECT = "multiselect"
    SLIDER = "slider"
    CODE = "code"
    MARKDOWN = "markdown"
    JSON = "json"
    TEMPLATE = "template"
    COLOR = "color"
    DATETIME = "datetime"
    FILE = "file"
    DIRECTORY = "directory"
    KEY_VALUE = "key_value"
    RICH_TEXT = "rich_text"

@dataclass
class SettingValidation:
    """Правила валидации настройки"""
    required: bool = False
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    pattern: Optional[str] = None
    allowed_types: Optional[List[str]] = None
    custom_validator: Optional[callable] = None
    error_message: Optional[str] = None

@dataclass
class SettingOption:
    """Расширенная опция настройки"""
    value: str
    label: str
    description: Optional[str] = None
    icon: Optional[str] = None
    disabled: bool = False
    group: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Setting:
    """Расширенный класс настройки"""
    key: str
    type: SettingType
    label: str
    description: Optional[str] = None
    default_value: Any = None
    options: Optional[List[SettingOption]] = None
    validation: Optional[SettingValidation] = None
    depends_on: Optional[Dict[str, Any]] = None
    affects: Optional[List[str]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    version: str = "1.0.0"
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

@dataclass
class SettingsProfile:
    """Профиль настроек"""
    id: str
    name: str
    description: Optional[str] = None
    settings: Dict[str, Any] = field(default_factory=dict)
    is_default: bool = False
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class InstructionTemplate:
    """Шаблон инструкции"""
    id: str
    name: str
    description: Optional[str] = None
    content: str
    variables: Dict[str, str] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)
    version: str = "1.0.0"
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)
