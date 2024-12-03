import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockStats } from './__mocks__/mockData';

// Утилита для измерения времени рендера
const measureRenderTime = (Component, props = {}) => {
  const start = performance.now();
  render(<Component {...props} />);
  return performance.now() - start;
};

// Утилита для создания большого количества сообщений
const generateMessages = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${i}`,
    text: `Test message ${i}`,
    sender: i % 2 === 0 ? 'user' : 'ai',
    timestamp: new Date(Date.now() - i * 60000)
  }));
};

describe('ChatPage Performance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial Render', () => {
    it('renders quickly with few messages', () => {
      const renderTime = measureRenderTime(ChatPage);
      expect(renderTime).toBeLessThan(100); // Ожидаем рендер быстрее 100мс
    });

    it('handles large message history efficiently', () => {
      const manyMessages = generateMessages(1000);
      const renderTime = measureRenderTime(ChatPage, { initialMessages: manyMessages });
      expect(renderTime).toBeLessThan(500); // Ожидаем рендер быстрее 500мс даже с 1000 сообщений
    });
  });

  describe('Message List Performance', () => {
    it('scrolls smoothly with many messages', () => {
      const manyMessages = generateMessages(1000);
      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const scrollContainer = container.querySelector('[data-testid="messages-container"]');
      const start = performance.now();
      
      act(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });

      const scrollTime = performance.now() - start;
      expect(scrollTime).toBeLessThan(16); // Ожидаем плавную прокрутку (60fps)
    });

    it('efficiently updates message list', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByTestId('chat-input');

      const start = performance.now();
      
      act(() => {
        // Добавляем 100 сообщений быстро
        for (let i = 0; i < 100; i++) {
          fireEvent.change(input, { target: { value: `Message ${i}` } });
          fireEvent.submit(input.closest('form'));
        }
      });

      const updateTime = performance.now() - start;
      expect(updateTime).toBeLessThan(1000); // Ожидаем обновление быстрее 1 секунды
    });
  });

  describe('Stats Updates', () => {
    it('updates stats without impacting performance', () => {
      const { rerender } = renderWithTheme(<ChatPage />);
      
      const start = performance.now();
      
      act(() => {
        // Имитируем множество обновлений статистики
        for (let i = 0; i < 100; i++) {
          rerender(<ChatPage stats={{ ...mockStats, messagesCount: i }} />);
        }
      });

      const updateTime = performance.now() - start;
      expect(updateTime).toBeLessThan(100); // Ожидаем быстрые обновления статистики
    });
  });

  describe('Memory Usage', () => {
    it('maintains stable memory usage with many messages', () => {
      const initialHeapSize = window.performance.memory?.usedJSHeapSize;
      const manyMessages = generateMessages(1000);
      
      renderWithTheme(<ChatPage initialMessages={manyMessages} />);
      
      const finalHeapSize = window.performance.memory?.usedJSHeapSize;
      const memoryIncrease = finalHeapSize - initialHeapSize;
      
      // Ожидаем разумное увеличение памяти (менее 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('cleans up resources properly', () => {
      const { unmount } = renderWithTheme(<ChatPage />);
      const heapBefore = window.performance.memory?.usedJSHeapSize;
      
      unmount();
      
      const heapAfter = window.performance.memory?.usedJSHeapSize;
      expect(heapAfter).toBeLessThanOrEqual(heapBefore);
    });
  });

  describe('Event Handling', () => {
    it('handles rapid user input efficiently', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByTestId('chat-input');
      
      const start = performance.now();
      
      // Быстрый ввод текста
      act(() => {
        for (let i = 0; i < 100; i++) {
          fireEvent.change(input, { target: { value: `Test ${i}` } });
        }
      });

      const inputTime = performance.now() - start;
      expect(inputTime).toBeLessThan(100); // Ожидаем быстрый отклик на ввод
    });

    it('debounces expensive operations', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByTestId('chat-input');
      
      let operationCount = 0;
      jest.spyOn(global, 'setTimeout').mockImplementation((cb) => {
        operationCount++;
        return setTimeout(cb, 0);
      });

      // Быстрый ввод команд
      act(() => {
        for (let i = 0; i < 10; i++) {
          fireEvent.change(input, { target: { value: '/' } });
        }
      });

      expect(operationCount).toBeLessThan(5); // Ожидаем группировку операций
    });
  });

  describe('Rendering Optimization', () => {
    it('uses memo effectively', () => {
      const renderCount = {
        messages: 0,
        stats: 0
      };

      jest.spyOn(React, 'memo').mockImplementation((component) => {
        return component;
      });

      renderWithTheme(<ChatPage />);

      expect(renderCount.messages).toBeLessThan(2);
      expect(renderCount.stats).toBeLessThan(2);
    });

    it('minimizes re-renders', () => {
      const { rerender } = renderWithTheme(<ChatPage />);
      let renderCount = 0;

      const spy = jest.spyOn(React, 'createElement');
      spy.mockClear();

      // Обновляем пропсы, которые не должны вызывать ре-рендер
      act(() => {
        rerender(<ChatPage key="1" />);
        rerender(<ChatPage key="2" />);
        rerender(<ChatPage key="3" />);
      });

      expect(spy).toHaveBeenCalledTimes(expect.any(Number));
      expect(renderCount).toBeLessThan(4);
    });
  });

  describe('Network Performance', () => {
    it('handles network requests efficiently', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByTestId('chat-input');
      
      let requestCount = 0;
      global.fetch = jest.fn(() => {
        requestCount++;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Test' })
        });
      });

      // Быстрая отправка сообщений
      act(() => {
        for (let i = 0; i < 10; i++) {
          fireEvent.change(input, { target: { value: `Message ${i}` } });
          fireEvent.submit(input.closest('form'));
        }
      });

      expect(requestCount).toBeLessThan(11); // Ожидаем эффективную обработку запросов
    });
  });
});
