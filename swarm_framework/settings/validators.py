from typing import Any, Dict, List, Optional
from datetime import datetime
import re
import json
from .models import Setting, SettingType, SettingValidation

class SettingValidator:
    """Валидатор настроек"""
    
    @staticmethod
    def validate(setting: Setting, value: Any) -> tuple[bool, Optional[str]]:
        """Валидация значения настройки"""
        if setting.validation is None:
            return True, None
            
        # Проверка обязательности
        if setting.validation.required and value is None:
            return False, "Значение обязательно"
            
        # Валидация в зависимости от типа
        if value is not None:
            validator_method = getattr(
                SettingValidator, 
                f"_validate_{setting.type.value}", 
                SettingValidator._validate_default
            )
            return validator_method(value, setting.validation)
            
        return True, None
    
    @staticmethod
    def _validate_number(value: Any, validation: SettingValidation) -> tuple[bool, Optional[str]]:
        """Валидация числового значения"""
        if not isinstance(value, (int, float)):
            return False, "Значение должно быть числом"
            
        if validation.min_value is not None and value < validation.min_value:
            return False, f"Значение должно быть не меньше {validation.min_value}"
            
        if validation.max_value is not None and value > validation.max_value:
            return False, f"Значение должно быть не больше {validation.max_value}"
            
        return True, None
        
    @staticmethod
    def _validate_string(value: Any, validation: SettingValidation) -> tuple[bool, Optional[str]]:
        """Валидация строкового значения"""
        if not isinstance(value, str):
            return False, "Значение должно быть строкой"
            
        if validation.min_length is not None and len(value) < validation.min_length:
            return False, f"Длина должна быть не меньше {validation.min_length}"
            
        if validation.max_length is not None and len(value) > validation.max_length:
            return False, f"Длина должна быть не больше {validation.max_length}"
            
        if validation.pattern is not None and not re.match(validation.pattern, value):
            return False, "Значение не соответствует шаблону"
            
        return True, None
        
    @staticmethod
    def _validate_json(value: Any, validation: SettingValidation) -> tuple[bool, Optional[str]]:
        """Валидация JSON значения"""
        try:
            if isinstance(value, str):
                json.loads(value)
            elif not isinstance(value, (dict, list)):
                return False, "Значение должно быть JSON объектом или массивом"
        except json.JSONDecodeError:
            return False, "Некорректный JSON формат"
            
        return True, None
        
    @staticmethod
    def _validate_datetime(value: Any, validation: SettingValidation) -> tuple[bool, Optional[str]]:
        """Валидация значения даты/времени"""
        if not isinstance(value, (datetime, str)):
            return False, "Значение должно быть датой/временем"
            
        if isinstance(value, str):
            try:
                datetime.fromisoformat(value)
            except ValueError:
                return False, "Некорректный формат даты/времени"
                
        return True, None
        
    @staticmethod
    def _validate_default(value: Any, validation: SettingValidation) -> tuple[bool, Optional[str]]:
        """Валидация по умолчанию"""
        if validation.custom_validator is not None:
            try:
                result = validation.custom_validator(value)
                if isinstance(result, tuple):
                    return result
                return result, None
            except Exception as e:
                return False, str(e)
                
        return True, None
