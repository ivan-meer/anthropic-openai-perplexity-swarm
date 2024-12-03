import React, { useState, useEffect } from 'react';

const SettingsMenu = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = async (key, value) => {
    try {
      await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      setSettings(prevSettings => ({
        ...prevSettings,
        [key]: value
      }));
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  return (
    <div className="settings-menu">
      <h2>Настройки</h2>
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="setting-item">
          <label>{key}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default SettingsMenu;
