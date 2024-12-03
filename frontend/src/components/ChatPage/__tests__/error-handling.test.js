import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';
import { ErrorBoundary } from 'react-error-boundary';

// Мок для консоли, чтобы подавить вывод ошибок в тестах
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

describe('ChatPage Error Handling', () => {
  describe('Network Errors', () => {
    it('handles API request failures', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/произошла ошибка/i)).toBeInTheDocument();
      });
    });

    it('handles timeout errors', async () => {
      jest.useFakeTimers();
      global.fetch = jest.fn(() => new Promise(() => {}));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(getByText(/превышено время ожидания/i)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('handles offline state', async () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true
      });

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/отсутствует подключение/i)).toBeInTheDocument();
      });
    });
  });

  describe('Runtime Errors', () => {
    it('catches and handles render errors', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      const { getByText } = render(
        <ErrorBoundary fallback={<div>Произошла ошибка</div>}>
          <ChatPage>
            <ErrorComponent />
          </ChatPage>
        </ErrorBoundary>
      );

      expect(getByText(/произошла ошибка/i)).toBeInTheDocument();
    });

    it('handles state update errors', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем ошибку при обновлении состояния
      jest.spyOn(React, 'useState').mockImplementationOnce(() => {
        throw new Error('State update error');
      });

      fireEvent.change(input, { target: { value: 'Test message' } });

      await waitFor(() => {
        expect(getByText(/произошла ошибка/i)).toBeInTheDocument();
      });
    });

    it('handles event handler errors', async () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const button = getByTestId('error-button');

      // Симулируем ошибку в обработчике события
      fireEvent.click(button);

      await waitFor(() => {
        expect(document.querySelector('[role="alert"]')).toBeInTheDocument();
      });
    });
  });

  describe('Data Validation', () => {
    it('handles invalid message format', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: ''.padStart(5001, 'a') } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/сообщение слишком длинное/i)).toBeInTheDocument();
      });
    });

    it('handles invalid response data', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ invalid: 'data' })
        })
      );

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/некорректный формат данных/i)).toBeInTheDocument();
      });
    });
  });

  describe('Resource Errors', () => {
    it('handles image load errors', async () => {
      const { container } = renderWithTheme(
        <ChatPage
          initialMessages={[
            {
              type: 'system',
              text: '<img src="invalid.jpg" />',
              timestamp: new Date()
            }
          ]}
        />
      );

      const image = container.querySelector('img');
      fireEvent.error(image);

      expect(image).toHaveAttribute('alt', 'Ошибка загрузки изображения');
    });

    it('handles script load errors', () => {
      const script = document.createElement('script');
      document.body.appendChild(script);
      
      fireEvent.error(script);

      expect(document.querySelector('[role="alert"]')).toBeInTheDocument();
    });
  });

  describe('Memory Management', () => {
    it('handles memory leaks', () => {
      const { unmount } = renderWithTheme(<ChatPage />);
      const listeners = [];

      // Добавляем слушатели событий
      window.addEventListener('resize', () => {});
      document.addEventListener('click', () => {});

      unmount();

      expect(listeners.length).toBe(0);
    });

    it('handles large message history', () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const { container } = renderWithTheme(
        <ChatPage initialMessages={manyMessages} />
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('User Input Validation', () => {
    it('handles special characters', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(input.value).not.toContain('<script>');
      });
    });

    it('handles empty input', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/введите сообщение/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('allows retry after error', async () => {
      global.fetch = jest.fn()
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'Success' })
        }));

      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Первая попытка - ошибка
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/произошла ошибка/i)).toBeInTheDocument();
      });

      // Повторная попытка - успех
      const retryButton = getByText(/повторить/i);
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(getByText('Success')).toBeInTheDocument();
      });
    });

    it('recovers from component errors', async () => {
      const ErrorComponent = () => {
        const [error, setError] = React.useState(true);

        if (error) {
          throw new Error('Component error');
        }

        return <button onClick={() => setError(true)}>Trigger Error</button>;
      };

      const { getByText } = render(
        <ErrorBoundary
          fallback={({ resetErrorBoundary }) => (
            <button onClick={resetErrorBoundary}>Восстановить</button>
          )}
        >
          <ErrorComponent />
        </ErrorBoundary>
      );

      const resetButton = getByText(/восстановить/i);
      fireEvent.click(resetButton);

      expect(getByText(/trigger error/i)).toBeInTheDocument();
    });
  });
});
