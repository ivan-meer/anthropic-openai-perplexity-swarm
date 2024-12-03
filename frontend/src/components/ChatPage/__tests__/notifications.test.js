import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для Notification API
const mockNotification = {
  requestPermission: jest.fn(),
  permission: 'default'
};

describe('ChatPage Notifications', () => {
  beforeAll(() => {
    global.Notification = mockNotification;
  });

  beforeEach(() => {
    mockNotification.requestPermission.mockClear();
    localStorage.clear();
  });

  describe('Notification Permissions', () => {
    it('requests notification permission on first visit', async () => {
      mockNotification.requestPermission.mockResolvedValue('granted');
      
      renderWithTheme(<ChatPage />);

      await waitFor(() => {
        expect(mockNotification.requestPermission).toHaveBeenCalled();
      });
    });

    it('remembers notification preference', async () => {
      mockNotification.requestPermission.mockResolvedValue('granted');
      localStorage.setItem('notificationPermission', 'granted');
      
      renderWithTheme(<ChatPage />);

      expect(mockNotification.requestPermission).not.toHaveBeenCalled();
    });

    it('handles permission denial', async () => {
      mockNotification.requestPermission.mockResolvedValue('denied');
      
      const { getByText } = renderWithTheme(<ChatPage />);

      await waitFor(() => {
        expect(getByText(/уведомления отключены/i)).toBeInTheDocument();
      });
    });
  });

  describe('Notification Display', () => {
    beforeEach(() => {
      mockNotification.permission = 'granted';
    });

    it('shows notification for new messages', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем потерю фокуса окном
      fireEvent.blur(window);

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledWith(
          'Новое сообщение',
          expect.objectContaining({
            body: expect.any(String)
          })
        );
      });
    });

    it('shows notification for mentions', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '@user Test mention' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledWith(
          'Упоминание',
          expect.objectContaining({
            body: expect.stringContaining('@user')
          })
        );
      });
    });

    it('shows notification for errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledWith(
          'Ошибка',
          expect.objectContaining({
            body: expect.stringContaining('ошибка')
          })
        );
      });
    });
  });

  describe('Notification Settings', () => {
    it('allows toggling notifications', async () => {
      const { getByRole, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const toggle = getByLabelText(/уведомления/i);
      
      fireEvent.click(toggle);

      await waitFor(() => {
        expect(localStorage.getItem('notificationsEnabled')).toBe('false');
      });
    });

    it('allows customizing notification sounds', async () => {
      const { getByRole, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const soundSelect = getByLabelText(/звук уведомлений/i);
      
      fireEvent.change(soundSelect, { target: { value: 'bell' } });

      await waitFor(() => {
        expect(localStorage.getItem('notificationSound')).toBe('bell');
      });
    });

    it('respects do not disturb schedule', async () => {
      const { getByRole, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      
      const startTime = getByLabelText(/начало тихого режима/i);
      const endTime = getByLabelText(/конец тихого режима/i);
      
      fireEvent.change(startTime, { target: { value: '22:00' } });
      fireEvent.change(endTime, { target: { value: '08:00' } });

      // Устанавливаем текущее время в период тихого режима
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(23);

      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(global.Notification).not.toHaveBeenCalled();
    });
  });

  describe('Notification Grouping', () => {
    it('groups multiple notifications', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Отправляем несколько сообщений быстро
      for (let i = 0; i < 3; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledWith(
          'Новые сообщения (3)',
          expect.any(Object)
        );
      });
    });

    it('resets notification group after delay', async () => {
      jest.useFakeTimers();
      
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Отправляем сообщение
      fireEvent.change(input, { target: { value: 'First message' } });
      fireEvent.submit(input.closest('form'));

      // Ждем
      jest.advanceTimersByTime(5000);

      // Отправляем еще одно сообщение
      fireEvent.change(input, { target: { value: 'Second message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });
  });

  describe('Notification Actions', () => {
    it('focuses window on notification click', async () => {
      const mockFocus = jest.fn();
      window.focus = mockFocus;

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const notification = global.Notification.mock.instances[0];
        notification.onclick();
        expect(mockFocus).toHaveBeenCalled();
      });
    });

    it('scrolls to message on notification click', async () => {
      const { getByRole, getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const input = getByRole('textbox');
      const messagesContainer = getByTestId('messages-container');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const notification = global.Notification.mock.instances[0];
        notification.onclick();
        expect(messagesContainer.scrollTop).toBe(messagesContainer.scrollHeight);
      });
    });
  });

  describe('Notification Queue', () => {
    it('queues notifications when tab is inactive', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем неактивную вкладку
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      // Отправляем несколько сообщений
      for (let i = 0; i < 3; i++) {
        fireEvent.change(input, { target: { value: `Message ${i}` } });
        fireEvent.submit(input.closest('form'));
      }

      // Симулируем активацию вкладки
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledWith(
          'Пропущенные сообщения (3)',
          expect.any(Object)
        );
      });
    });

    it('clears notification queue on tab focus', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем неактивную вкладку
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      // Отправляем сообщение
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      // Симулируем активацию вкладки
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      // Отправляем еще одно сообщение
      fireEvent.change(input, { target: { value: 'Another message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(global.Notification).toHaveBeenCalledTimes(2);
      });
    });
  });
});
