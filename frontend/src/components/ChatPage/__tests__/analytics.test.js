import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

// Мок для Google Analytics
const mockGa = jest.fn();
window.ga = mockGa;

// Мок для Performance API
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(),
  getEntriesByName: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn()
};
window.performance = mockPerformance;

describe('ChatPage Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Load Analytics', () => {
    it('tracks initial page load', () => {
      renderWithTheme(<ChatPage />);

      expect(mockGa).toHaveBeenCalledWith('send', 'pageview', {
        page: '/chat',
        title: 'Чат с AI-агентами'
      });
    });

    it('measures time to first render', () => {
      renderWithTheme(<ChatPage />);

      expect(mockPerformance.mark).toHaveBeenCalledWith('chat-page-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('chat-page-end');
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'chat-page-render',
        'chat-page-start',
        'chat-page-end'
      );
    });

    it('tracks time to interactive', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      
      await waitFor(() => {
        expect(mockPerformance.mark).toHaveBeenCalledWith('chat-page-interactive');
      });

      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(mockGa).toHaveBeenCalledWith('send', 'timing', {
        timingCategory: 'Chat Page',
        timingVar: 'Time to Interactive',
        timingValue: expect.any(Number)
      });
    });
  });

  describe('User Interaction Analytics', () => {
    it('tracks message sends', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Chat',
        eventAction: 'send_message',
        eventLabel: 'user'
      });
    });

    it('tracks command usage', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Chat',
        eventAction: 'use_command',
        eventLabel: 'help'
      });
    });

    it('tracks settings changes', async () => {
      const { getByText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText('Настройки'));
      
      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Settings',
        eventAction: 'open_settings'
      });
    });
  });

  describe('Performance Metrics', () => {
    it('tracks message response times', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockPerformance.measure).toHaveBeenCalledWith(
          'message-response-time',
          expect.any(String),
          expect.any(String)
        );
      });
    });

    it('tracks rendering performance', async () => {
      const { rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      // Добавляем много сообщений для тестирования производительности
      const manyMessages = Array.from({ length: 100 }, (_, i) => ({
        ...mockMessages[0],
        id: i,
        text: `Message ${i}`
      }));

      rerender(<ChatPage initialMessages={manyMessages} />);

      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'messages-render-time',
        expect.any(String),
        expect.any(String)
      );
    });

    it('tracks memory usage', () => {
      const { rerender } = renderWithTheme(<ChatPage />);

      // Имитируем несколько обновлений
      for (let i = 0; i < 10; i++) {
        rerender(<ChatPage key={i} />);
      }

      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Performance',
        eventAction: 'memory_usage',
        eventValue: expect.any(Number)
      });
    });
  });

  describe('Error Tracking', () => {
    it('tracks API errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockGa).toHaveBeenCalledWith('send', 'exception', {
          exDescription: 'API Error',
          exFatal: false
        });
      });
    });

    it('tracks render errors', () => {
      const ErrorComponent = () => {
        throw new Error('Render Error');
      };

      const { container } = renderWithTheme(
        <ChatPage>
          <ErrorComponent />
        </ChatPage>
      );

      expect(mockGa).toHaveBeenCalledWith('send', 'exception', {
        exDescription: 'Render Error',
        exFatal: true
      });
    });
  });

  describe('User Behavior Analytics', () => {
    it('tracks session duration', () => {
      jest.useFakeTimers();
      
      renderWithTheme(<ChatPage />);
      
      jest.advanceTimersByTime(5000);

      expect(mockGa).toHaveBeenCalledWith('send', 'timing', {
        timingCategory: 'Chat Page',
        timingVar: 'Session Duration',
        timingValue: 5000
      });

      jest.useRealTimers();
    });

    it('tracks scroll behavior', () => {
      const { container } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      fireEvent.scroll(container.querySelector('[data-testid="messages-container"]'));

      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'User Behavior',
        eventAction: 'scroll',
        eventLabel: 'messages'
      });
    });

    it('tracks feature usage', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const message = getAllByTestId('chat-message')[0];
      fireEvent.click(message);

      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Feature Usage',
        eventAction: 'message_action',
        eventLabel: expect.any(String)
      });
    });
  });

  describe('Custom Metrics', () => {
    it('tracks message quality metrics', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(mockGa).toHaveBeenCalledWith('send', 'event', {
          eventCategory: 'Message Quality',
          eventAction: 'message_length',
          eventValue: 12
        });
      });
    });

    it('tracks agent performance metrics', async () => {
      renderWithTheme(<ChatPage activeAgent={mockAgent} />);

      expect(mockGa).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Agent Performance',
        eventAction: 'response_quality',
        eventValue: expect.any(Number)
      });
    });
  });
});
