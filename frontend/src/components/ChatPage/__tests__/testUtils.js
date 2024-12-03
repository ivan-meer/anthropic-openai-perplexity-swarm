import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { mockTheme } from './__mocks__/mockData';

/**
 * Рендерит компонент с темой и необходимыми провайдерами
 * @param {React.ReactElement} ui - Компонент для рендера
 * @param {Object} options - Дополнительные опции рендера
 * @returns {Object} - Результат рендера
 */
export const renderWithTheme = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={mockTheme}>
      {children}
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Создает моковый ResizeObserver для тестов
 */
export const mockResizeObserver = () => {
  const mockObserver = jest.fn();
  mockObserver.mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
  window.ResizeObserver = mockObserver;
  return mockObserver;
};

/**
 * Создает моковый IntersectionObserver для тестов
 */
export const mockIntersectionObserver = () => {
  const mockObserver = jest.fn();
  mockObserver.mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
  window.IntersectionObserver = mockObserver;
  return mockObserver;
};

/**
 * Мокирует fetch для тестов
 * @param {Object} response - Ответ, который должен вернуть fetch
 * @returns {Function} - Моковая функция fetch
 */
export const mockFetch = (response) => {
  const mockFn = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response)
    })
  );
  global.fetch = mockFn;
  return mockFn;
};

/**
 * Мокирует clipboard API для тестов
 */
export const mockClipboard = () => {
  const mockWriteText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: mockWriteText },
    writable: true
  });
  return mockWriteText;
};

/**
 * Мокирует URL API для тестов
 */
export const mockURL = () => {
  const mockCreateObjectURL = jest.fn();
  const mockRevokeObjectURL = jest.fn();
  
  const originalURL = global.URL;
  global.URL = {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL
  };

  return {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
    restore: () => {
      global.URL = originalURL;
    }
  };
};

/**
 * Мокирует DOM API для тестов
 */
export const mockDOM = () => {
  const mockElement = {
    href: '',
    download: '',
    click: jest.fn(),
    remove: jest.fn()
  };

  const mockCreateElement = jest.fn(() => mockElement);
  const mockAppendChild = jest.fn();
  const mockRemoveChild = jest.fn();

  const original = {
    createElement: document.createElement,
    appendChild: document.body.appendChild,
    removeChild: document.body.removeChild
  };

  document.createElement = mockCreateElement;
  document.body.appendChild = mockAppendChild;
  document.body.removeChild = mockRemoveChild;

  return {
    element: mockElement,
    createElement: mockCreateElement,
    appendChild: mockAppendChild,
    removeChild: mockRemoveChild,
    restore: () => {
      document.createElement = original.createElement;
      document.body.appendChild = original.appendChild;
      document.body.removeChild = original.removeChild;
    }
  };
};

/**
 * Мокирует localStorage для тестов
 */
export const mockLocalStorage = () => {
  const store = {};
  const mockStorage = {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); })
  };

  const originalStorage = global.localStorage;
  Object.defineProperty(global, 'localStorage', {
    value: mockStorage,
    writable: true
  });

  return {
    storage: mockStorage,
    store,
    restore: () => {
      Object.defineProperty(global, 'localStorage', {
        value: originalStorage,
        writable: true
      });
    }
  };
};

/**
 * Мокирует window.confirm для тестов
 * @param {boolean} returnValue - Значение, которое должен вернуть confirm
 * @returns {Function} - Моковая функция confirm
 */
export const mockConfirm = (returnValue = true) => {
  const mockFn = jest.fn(() => returnValue);
  const original = window.confirm;
  window.confirm = mockFn;
  return {
    confirm: mockFn,
    restore: () => {
      window.confirm = original;
    }
  };
};

/**
 * Мокирует window.alert для тестов
 */
export const mockAlert = () => {
  const mockFn = jest.fn();
  const original = window.alert;
  window.alert = mockFn;
  return {
    alert: mockFn,
    restore: () => {
      window.alert = original;
    }
  };
};

/**
 * Мокирует console.log и console.error для тестов
 */
export const mockConsole = () => {
  const mockLog = jest.fn();
  const mockError = jest.fn();
  const originalLog = console.log;
  const originalError = console.error;

  console.log = mockLog;
  console.error = mockError;

  return {
    log: mockLog,
    error: mockError,
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
    }
  };
};

/**
 * Ожидает завершения всех асинхронных операций
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/**
 * Создает событие изменения для input
 * @param {string} value - Новое значение input
 * @returns {Object} - Объект события
 */
export const createChangeEvent = (value) => ({
  target: { value }
});

/**
 * Создает событие нажатия клавиши
 * @param {string} key - Код клавиши
 * @param {Object} options - Дополнительные опции события
 * @returns {Object} - Объект события
 */
export const createKeyboardEvent = (key, options = {}) => ({
  key,
  preventDefault: jest.fn(),
  ...options
});
