import {
  MESSAGE_TYPES,
  COMMAND_PREFIXES,
  ERROR_CODES,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  WEBSOCKET_EVENTS,
  UI_CONSTANTS,
  ANIMATION_TIMINGS,
  THEME_CONSTANTS,
  BREAKPOINTS,
  VALIDATION_RULES,
  KEYBOARD_SHORTCUTS,
  TIME_CONSTANTS,
  METRICS_CONSTANTS
} from '../constants';

describe('ChatPage Constants', () => {
  describe('MESSAGE_TYPES', () => {
    it('defines correct message types', () => {
      expect(MESSAGE_TYPES).toEqual({
        USER: 'user',
        AI: 'ai',
        SYSTEM: 'system',
        ERROR: 'error',
        INFO: 'info'
      });
    });

    it('has unique values', () => {
      const values = Object.values(MESSAGE_TYPES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('COMMAND_PREFIXES', () => {
    it('defines correct command prefixes', () => {
      expect(COMMAND_PREFIXES).toEqual({
        STANDARD: '/',
        SYSTEM: '!',
        DEBUG: '#'
      });
    });

    it('has unique values', () => {
      const values = Object.values(COMMAND_PREFIXES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('ERROR_CODES', () => {
    it('defines error codes with descriptions', () => {
      expect(ERROR_CODES).toEqual({
        NETWORK_ERROR: { code: 'E001', message: 'Ошибка сети' },
        API_ERROR: { code: 'E002', message: 'Ошибка API' },
        VALIDATION_ERROR: { code: 'E003', message: 'Ошибка валидации' },
        AUTH_ERROR: { code: 'E004', message: 'Ошибка авторизации' },
        RATE_LIMIT_ERROR: { code: 'E005', message: 'Превышен лимит запросов' }
      });
    });

    it('has unique error codes', () => {
      const codes = Object.values(ERROR_CODES).map(error => error.code);
      const uniqueCodes = new Set(codes);
      expect(codes.length).toBe(uniqueCodes.size);
    });
  });

  describe('NOTIFICATION_TYPES', () => {
    it('defines notification types', () => {
      expect(NOTIFICATION_TYPES).toEqual({
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
      });
    });

    it('has unique values', () => {
      const values = Object.values(NOTIFICATION_TYPES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('defines storage keys', () => {
      expect(STORAGE_KEYS).toEqual({
        MESSAGES: 'chatMessages',
        SETTINGS: 'chatSettings',
        SESSION: 'currentSession',
        THEME: 'selectedTheme',
        AGENT: 'selectedAgent'
      });
    });

    it('has unique values', () => {
      const values = Object.values(STORAGE_KEYS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('API_ENDPOINTS', () => {
    it('defines API endpoints', () => {
      expect(API_ENDPOINTS).toEqual({
        MESSAGES: '/api/messages',
        AGENTS: '/api/agents',
        SETTINGS: '/api/settings',
        STATS: '/api/stats'
      });
    });

    it('starts with forward slash', () => {
      Object.values(API_ENDPOINTS).forEach(endpoint => {
        expect(endpoint.startsWith('/')).toBe(true);
      });
    });
  });

  describe('WEBSOCKET_EVENTS', () => {
    it('defines WebSocket events', () => {
      expect(WEBSOCKET_EVENTS).toEqual({
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        MESSAGE: 'message',
        ERROR: 'error',
        TYPING: 'typing'
      });
    });

    it('has unique values', () => {
      const values = Object.values(WEBSOCKET_EVENTS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('UI_CONSTANTS', () => {
    it('defines UI constants', () => {
      expect(UI_CONSTANTS).toEqual({
        MAX_MESSAGE_LENGTH: 5000,
        MAX_VISIBLE_MESSAGES: 50,
        TYPING_INDICATOR_TIMEOUT: 3000,
        TOAST_DURATION: 3000,
        SCROLL_THRESHOLD: 100
      });
    });

    it('has positive numeric values', () => {
      Object.values(UI_CONSTANTS).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('ANIMATION_TIMINGS', () => {
    it('defines animation timings', () => {
      expect(ANIMATION_TIMINGS).toEqual({
        FADE: 300,
        SLIDE: 200,
        SCALE: 150,
        BOUNCE: 500
      });
    });

    it('has positive numeric values', () => {
      Object.values(ANIMATION_TIMINGS).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('THEME_CONSTANTS', () => {
    it('defines theme constants', () => {
      expect(THEME_CONSTANTS).toEqual({
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
      });
    });

    it('has unique values', () => {
      const values = Object.values(THEME_CONSTANTS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('BREAKPOINTS', () => {
    it('defines breakpoints', () => {
      expect(BREAKPOINTS).toEqual({
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024,
        LARGE: 1440
      });
    });

    it('has ascending values', () => {
      const values = Object.values(BREAKPOINTS);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });

  describe('VALIDATION_RULES', () => {
    it('defines validation rules', () => {
      expect(VALIDATION_RULES).toEqual({
        MIN_MESSAGE_LENGTH: 1,
        MAX_MESSAGE_LENGTH: 5000,
        MAX_COMMAND_LENGTH: 100,
        MAX_USERNAME_LENGTH: 50
      });
    });

    it('has valid ranges', () => {
      expect(VALIDATION_RULES.MIN_MESSAGE_LENGTH)
        .toBeLessThan(VALIDATION_RULES.MAX_MESSAGE_LENGTH);
    });
  });

  describe('KEYBOARD_SHORTCUTS', () => {
    it('defines keyboard shortcuts', () => {
      expect(KEYBOARD_SHORTCUTS).toEqual({
        SEND: { key: 'Enter', modifier: null },
        NEW_LINE: { key: 'Enter', modifier: 'Shift' },
        COMMAND: { key: '/', modifier: 'Control' },
        CLEAR: { key: 'Escape', modifier: null }
      });
    });

    it('has valid key combinations', () => {
      Object.values(KEYBOARD_SHORTCUTS).forEach(shortcut => {
        expect(shortcut).toHaveProperty('key');
        expect(typeof shortcut.key).toBe('string');
      });
    });
  });

  describe('TIME_CONSTANTS', () => {
    it('defines time constants', () => {
      expect(TIME_CONSTANTS).toEqual({
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 500,
        AUTO_SAVE_INTERVAL: 60000,
        SESSION_TIMEOUT: 1800000
      });
    });

    it('has positive numeric values', () => {
      Object.values(TIME_CONSTANTS).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('METRICS_CONSTANTS', () => {
    it('defines metrics constants', () => {
      expect(METRICS_CONSTANTS).toEqual({
        MAX_RESPONSE_TIME: 5000,
        MAX_TOKEN_COUNT: 4096,
        PERFORMANCE_THRESHOLD: 100,
        MEMORY_THRESHOLD: 50 * 1024 * 1024
      });
    });

    it('has positive numeric values', () => {
      Object.values(METRICS_CONSTANTS).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});
