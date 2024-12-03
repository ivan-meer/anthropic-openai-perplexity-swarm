from flask import Blueprint, jsonify, request
from swarm_framework.settings.manager import SettingsManager

settings_api = Blueprint('settings_api', __name__)
settings_manager = SettingsManager()

@settings_api.route('/settings', methods=['GET'])
def get_settings():
    settings = settings_manager.get_settings()
    return jsonify({key: setting.default_value for key, setting in settings.items()})

@settings_api.route('/settings/<key>', methods=['PUT'])
def update_setting(key):
    value = request.json.get('value')
    settings_manager.update_setting(key, value)
    return jsonify(success=True)
