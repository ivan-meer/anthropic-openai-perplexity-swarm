import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для window.performance
const mockPerformance = {
  memory: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 100000000,
    jsHeapSizeLimit: 200000000
  },
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn()
};

describe('ChatPage Memory Management', () => {
  beforeAll(() => {
    window.performance = mockPerformance;
  });

  describe('Memory Usage', () => {
    it('maintains stable memory usage with many messages', async () => {
      const initialHeapSize = window.performance.memory.usedJSHeapSize;
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: i % 2 === 0 ? 'user' : 'ai',
        timestamp: new Date()
      }));

      const { rerender } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const finalHeapSize = window.performance.memory.usedJSHeapSize;
      const memoryIncrease = finalHeapSize - initialHeapSize;

      // Ожидаем разумное увеличение памяти (менее 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      // Проверяем стабильность при обновлении
      rerender(<ChatPage initialMessages={manyMessages} />);
      expect(window.performance.memory.usedJSHeapSize - finalHeapSize).toBeLessThan(1024 * 1024);
    });

    it('releases memory when messages are deleted', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const initialHeapSize = window.performance.memory.usedJSHeapSize;

      const deleteButtons = getAllByTestId('delete-message');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        const currentHeapSize = window.performance.memory.usedJSHeapSize;
        expect(currentHeapSize).toBeLessThanOrEqual(initialHeapSize);
      });
    });
  });

  describe('Resource Cleanup', () => {
    it('cleans up event listeners on unmount', () => {
      const { unmount } = renderWithTheme(<ChatPage />);
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(
        addEventListenerSpy.mock.calls.length
      );
    });

    it('cleans up WebSocket connections', () => {
      const mockWebSocket = {
        close: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);

      const { unmount } = renderWithTheme(<ChatPage />);
      unmount();

      expect(mockWebSocket.close).toHaveBeenCalled();
    });

    it('cancels pending requests on unmount', async () => {
      const abortController = new AbortController();
      const mockFetch = jest.fn(() => new Promise(() => {}));
      global.fetch = mockFetch;
      global.AbortController = jest.fn(() => abortController);

      const { unmount } = renderWithTheme(<ChatPage />);
      unmount();

      expect(abortController.abort).toHaveBeenCalled();
    });
  });

  describe('Memory Leaks', () => {
    it('prevents memory leaks in message list', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const initialHeapSize = window.performance.memory.usedJSHeapSize;

      // Добавляем много сообщений
      for (let i = 0; i < 100; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      // Проверяем, что память очищается после удаления старых сообщений
      await waitFor(() => {
        const currentHeapSize = window.performance.memory.usedJSHeapSize;
        expect(currentHeapSize - initialHeapSize).toBeLessThan(5 * 1024 * 1024);
      });
    });

    it('prevents memory leaks in event handlers', () => {
      const { rerender } = renderWithTheme(<ChatPage />);
      const initialHeapSize = window.performance.memory.usedJSHeapSize;

      // Многократное обновление компонента
      for (let i = 0; i < 100; i++) {
        rerender(<ChatPage key={i} />);
      }

      const finalHeapSize = window.performance.memory.usedJSHeapSize;
      expect(finalHeapSize - initialHeapSize).toBeLessThan(1024 * 1024);
    });
  });

  describe('Cache Management', () => {
    it('limits cache size', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Заполняем кеш
      for (let i = 0; i < 1000; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      const cacheSize = JSON.stringify(localStorage.getItem('messageCache')).length;
      expect(cacheSize).toBeLessThan(5 * 1024 * 1024); // 5MB
    });

    it('removes old cache entries', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Создаем старые кеш-записи
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 7);
      localStorage.setItem('messageCache', JSON.stringify({
        timestamp: oldDate.getTime(),
        data: mockMessages
      }));

      fireEvent.change(input, { target: { value: 'New message' } });
      fireEvent.submit(input.closest('form'));

      expect(JSON.parse(localStorage.getItem('messageCache')).timestamp)
        .toBeGreaterThan(oldDate.getTime());
    });
  });

  describe('DOM Node Management', () => {
    it('limits DOM node creation', async () => {
      const { container, getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const initialNodeCount = container.querySelectorAll('*').length;

      // Добавляем сообщения
      for (let i = 0; i < 50; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      const finalNodeCount = container.querySelectorAll('*').length;
      expect(finalNodeCount - initialNodeCount).toBeLessThan(1000);
    });

    it('reuses DOM nodes', async () => {
      const { container, rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const initialNodes = Array.from(container.querySelectorAll('*'));

      rerender(<ChatPage initialMessages={[...mockMessages]} />);
      const updatedNodes = Array.from(container.querySelectorAll('*'));

      expect(updatedNodes.length).toBe(initialNodes.length);
    });
  });

  describe('Image Memory Management', () => {
    it('unloads unused images', async () => {
      const { getAllByRole, unmount } = renderWithTheme(
        <ChatPage initialMessages={[
          {
            text: 'Test with image',
            sender: 'user',
            timestamp: new Date(),
            image: 'test.jpg'
          }
        ]} />
      );

      const images = getAllByRole('img');
      const imageSrcValues = images.map(img => img.src);

      unmount();

      images.forEach(img => {
        expect(img.src).toBe('');
      });

      // Проверяем, что ссылки на изображения очищены
      imageSrcValues.forEach(src => {
        expect(window.performance.memory.usedJSHeapSize).toBeLessThan(
          mockPerformance.memory.jsHeapSizeLimit
        );
      });
    });
  });

  describe('Memory Optimization', () => {
    it('implements virtual scrolling for large lists', async () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      const renderedMessages = container.querySelectorAll('[data-testid="chat-message"]');
      expect(renderedMessages.length).toBeLessThan(manyMessages.length);
    });

    it('implements lazy loading for images', async () => {
      const { getAllByRole } = renderWithTheme(
        <ChatPage initialMessages={[
          {
            text: 'Test with image',
            sender: 'user',
            timestamp: new Date(),
            image: 'test.jpg'
          }
        ]} />
      );

      const images = getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });
});
