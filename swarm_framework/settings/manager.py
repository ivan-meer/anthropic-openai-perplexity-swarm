from typing import Any, Dict, List, Optional
from datetime import datetime
import json
from pathlib import Path
from .models import (
    Setting,
    SettingsProfile,
    InstructionTemplate,
    SettingType,
    SettingValidation,
    SettingOption
)
from .validators import SettingValidator

class SettingsManager:
    """Менеджер настроек"""
    
    def __init__(self, storage_dir: str = "settings"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._settings: Dict[str, Setting] = {}
        self._profiles: Dict[str, SettingsProfile] = {}
        self._templates: Dict[str, InstructionTemplate] = {}
        self._load_settings()
        
    def _load_settings(self):
        """Загрузка настроек из хранилища"""
        settings_file = self.storage_dir / "settings.json"
        profiles_file = self.storage_dir / "profiles.json"
        templates_file = self.storage_dir / "templates.json"
        
        if settings_file.exists():
            with open(settings_file) as f:
                data = json.load(f)
                for item in data:
                    setting = Setting(**item)
                    self._settings[setting.key] = setting
                    
        if profiles_file.exists():
            with open(profiles_file) as f:
                data = json.load(f)
                for item in data:
                    profile = SettingsProfile(**item)
                    self._profiles[profile.id] = profile
                    
        if templates_file.exists():
            with open(templates_file) as f:
                data = json.load(f)
                for item in data:
                    template = InstructionTemplate(**item)
                    self._templates[template.id] = template
                    
    def _save_settings(self):
        """Сохранение настроек в хранилище"""
        settings_file = self.storage_dir / "settings.json"
        profiles_file = self.storage_dir / "profiles.json"
        templates_file = self.storage_dir / "templates.json"
        
        with open(settings_file, "w") as f:
            json.dump([setting.__dict__ for setting in self._settings.values()], f, indent=2)
            
        with open(profiles_file, "w") as f:
            json.dump([profile.__dict__ for profile in self._profiles.values()], f, indent=2)
            
        with open(templates_file, "w") as f:
            json.dump([template.__dict__ for template in self._templates.values()], f, indent=2)
            
    def register_setting(self, setting: Setting) -> None:
        """Регистрация новой настройки"""
        if setting.key in self._settings:
            raise KeyError(f"Setting {setting.key} already exists")
            
        self._settings[setting.key] = setting
        self._save_settings()
        
    def update_setting(self, key: str, value: Any) -> None:
        """Обновление значения настройки"""
        if key not in self._settings:
            raise KeyError(f"Setting {key} not found")
            
        setting = self._settings[key]
        is_valid, error = SettingValidator.validate(setting, value)
        
        if not is_valid:
            raise ValueError(error or f"Invalid value for setting {key}")
            
        setting.default_value = value
        setting.updated_at = datetime.now()
        self._save_settings()
        
    def get_setting(self, key: str) -> Optional[Setting]:
        """Получение настройки по ключу"""
        return self._settings.get(key)
        
    def get_settings(self) -> Dict[str, Setting]:
        """Получение всех настроек"""
        return self._settings
        
    def create_profile(self, profile: SettingsProfile) -> None:
        """Создание нового профиля настроек"""
        if profile.id in self._profiles:
            raise KeyError(f"Profile {profile.id} already exists")
            
        self._profiles[profile.id] = profile
        self._save_settings()
        
    def update_profile(self, profile_id: str, settings: Dict[str, Any]) -> None:
        """Обновление настроек профиля"""
        if profile_id not in self._profiles:
            raise KeyError(f"Profile {profile_id} not found")
            
        profile = self._profiles[profile_id]
        
        # Валидация всех настроек перед обновлением
        for key, value in settings.items():
            setting = self.get_setting(key)
            if setting:
                is_valid, error = SettingValidator.validate(setting, value)
                if not is_valid:
                    raise ValueError(f"Invalid value for setting {key}: {error}")
                    
        profile.settings.update(settings)
        profile.updated_at = datetime.now()
        self._save_settings()
        
    def get_profile(self, profile_id: str) -> Optional[SettingsProfile]:
        """Получение профиля по ID"""
        return self._profiles.get(profile_id)
        
    def get_profiles(self) -> Dict[str, SettingsProfile]:
        """Получение всех профилей"""
        return self._profiles
        
    def create_template(self, template: InstructionTemplate) -> None:
        """Создание нового шаблона инструкций"""
        if template.id in self._templates:
            raise KeyError(f"Template {template.id} already exists")
            
        self._templates[template.id] = template
        self._save_settings()
        
    def update_template(self, template_id: str, content: str, variables: Dict[str, str] = None) -> None:
        """Обновление шаблона инструкций"""
        if template_id not in self._templates:
            raise KeyError(f"Template {template_id} not found")
            
        template = self._templates[template_id]
        template.content = content
        if variables:
            template.variables.update(variables)
        template.updated_at = datetime.now()
        self._save_settings()
        
    def get_template(self, template_id: str) -> Optional[InstructionTemplate]:
        """Получение шаблона по ID"""
        return self._templates.get(template_id)
        
    def get_templates(self) -> Dict[str, InstructionTemplate]:
        """Получение всех шаблонов"""
        return self._templates
        
    def render_template(self, template_id: str, variables: Dict[str, str] = None) -> str:
        """Рендеринг шаблона с переменными"""
        template = self.get_template(template_id)
        if not template:
            raise KeyError(f"Template {template_id} not found")
            
        content = template.content
        if variables:
            for key, value in variables.items():
                content = content.replace(f"{{{key}}}", value)
                
        return content
