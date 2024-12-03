import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage Metrics', () => {
  describe('Performance Metrics', () => {
    beforeEach(() => {
      jest.spyOn(performance, 'mark');
      jest.spyOn(performance, 'measure');
      jest.spyOn(performance, 'clearMarks');
      jest.spyOn(performance, 'clearMeasures');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('tracks initial render time', () => {
      renderWithTheme(<ChatPage />);

      expect(performance.mark).toHaveBeenCalledWith('chatPageRenderStart');
      expect(performance.mark).toHaveBeenCalledWith('chatPageRenderEnd');
      expect(performance.measure).toHaveBeenCalledWith(
        'chatPageRenderTime',
        'chatPageRenderStart',
        'chatPageRenderEnd'
      );
    });

    it('tracks message processing time', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(performance.mark).toHaveBeenCalledWith('messageProcessStart');
      await waitFor(() => {
        expect(performance.mark).toHaveBeenCalledWith('messageProcessEnd');
        expect(performance.measure).toHaveBeenCalledWith(
          'messageProcessTime',
          'messageProcessStart',
          'messageProcessEnd'
        );
      });
    });

    it('tracks API response time', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(performance.mark).toHaveBeenCalledWith('apiRequestStart');
      await waitFor(() => {
        expect(performance.mark).toHaveBeenCalledWith('apiRequestEnd');
        expect(performance.measure).toHaveBeenCalledWith(
          'apiResponseTime',
          'apiRequestStart',
          'apiRequestEnd'
        );
      });
    });
  });

  describe('Usage Metrics', () => {
    it('tracks message count', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('chat-stats');
        expect(stats).toHaveTextContent(/сообщений: 1/i);
      });
    });

    it('tracks token usage', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('chat-stats');
        expect(stats).toHaveTextContent(/токенов:/i);
      });
    });

    it('tracks session duration', async () => {
      jest.useFakeTimers();
      const { getByTestId } = renderWithTheme(<ChatPage />);

      jest.advanceTimersByTime(60000); // 1 минута

      const stats = getByTestId('chat-stats');
      expect(stats).toHaveTextContent(/длительность: 1 мин/i);

      jest.useRealTimers();
    });
  });

  describe('Error Metrics', () => {
    it('tracks API errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const errorStats = getByTestId('error-stats');
        expect(errorStats).toHaveTextContent(/ошибок: 1/i);
      });
    });

    it('tracks error recovery time', async () => {
      global.fetch = jest.fn()
        .mockImplementationOnce(() => Promise.reject(new Error('API Error')))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Success' })
        }));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const retryButton = await waitFor(() => getByText(/повторить/i));
      fireEvent.click(retryButton);

      expect(performance.measure).toHaveBeenCalledWith(
        'errorRecoveryTime',
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe('User Interaction Metrics', () => {
    it('tracks input time', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'T' } });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.submit(input.closest('form'));

      expect(performance.measure).toHaveBeenCalledWith(
        'userInputTime',
        expect.any(String),
        expect.any(String)
      );
    });

    it('tracks command usage', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/help' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('command-stats');
        expect(stats).toHaveTextContent(/команд: 1/i);
      });
    });
  });

  describe('Memory Metrics', () => {
    it('tracks memory usage', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      await waitFor(() => {
        const stats = getByTestId('memory-stats');
        expect(stats).toHaveTextContent(/память:/i);
      });
    });

    it('tracks memory cleanup', async () => {
      const { unmount, getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const initialMemoryStats = getByTestId('memory-stats').textContent;
      unmount();

      const { getByTestId: getByTestIdAfterRemount } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const finalMemoryStats = getByTestIdAfterRemount('memory-stats').textContent;
      expect(finalMemoryStats).toBe(initialMemoryStats);
    });
  });

  describe('Network Metrics', () => {
    it('tracks request size', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('network-stats');
        expect(stats).toHaveTextContent(/отправлено:/i);
      });
    });

    it('tracks response size', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('network-stats');
        expect(stats).toHaveTextContent(/получено:/i);
      });
    });
  });

  describe('Custom Metrics', () => {
    it('tracks custom events', async () => {
      const customMetrics = {
        trackEvent: jest.fn()
      };

      const { getByRole } = renderWithTheme(
        <ChatPage metrics={customMetrics} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(customMetrics.trackEvent).toHaveBeenCalledWith(
        'message_sent',
        expect.any(Object)
      );
    });

    it('supports custom performance marks', async () => {
      const { getByRole } = renderWithTheme(
        <ChatPage performanceMarks={['customStart', 'customEnd']} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      expect(performance.mark).toHaveBeenCalledWith('customStart');
      await waitFor(() => {
        expect(performance.mark).toHaveBeenCalledWith('customEnd');
      });
    });
  });
});
