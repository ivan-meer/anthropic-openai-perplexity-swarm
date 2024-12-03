import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Lifecycle', () => {
  describe('Mounting', () => {
    it('initializes state correctly', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      
      expect(getByTestId('messages-container')).toBeInTheDocument();
      expect(getByTestId('input-container')).toBeInTheDocument();
    });

    it('loads initial data', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      await waitFor(() => {
        const messagesContainer = getByTestId('messages-container');
        expect(messagesContainer.children).toHaveLength(mockMessages.length);
      });
    });

    it('sets up event listeners', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      renderWithTheme(<ChatPage />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
    });

    it('initializes WebSocket connection', () => {
      const mockWebSocket = {
        addEventListener: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);

      renderWithTheme(<ChatPage />);

      expect(global.WebSocket).toHaveBeenCalled();
      expect(mockWebSocket.addEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );
    });
  });

  describe('Updating', () => {
    it('updates on prop changes', async () => {
      const { rerender, getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const newMessages = [...mockMessages, {
        text: 'New message',
        sender: 'user',
        timestamp: new Date()
      }];

      rerender(<ChatPage initialMessages={newMessages} />);

      await waitFor(() => {
        const messagesContainer = getByTestId('messages-container');
        expect(messagesContainer.children).toHaveLength(newMessages.length);
      });
    });

    it('updates on state changes', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messagesContainer = getByTestId('messages-container');
        expect(messagesContainer.children).toHaveLength(1);
      });
    });

    it('handles agent updates', async () => {
      const { rerender, getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );

      const updatedAgent = { ...mockAgent, name: 'Updated Agent' };
      rerender(<ChatPage initialAgent={updatedAgent} />);

      const agentInfo = getByTestId('agent-info');
      expect(agentInfo).toHaveTextContent('Updated Agent');
    });
  });

  describe('Unmounting', () => {
    it('cleans up event listeners', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = renderWithTheme(<ChatPage />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
    });

    it('closes WebSocket connection', () => {
      const mockWebSocket = {
        addEventListener: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);

      const { unmount } = renderWithTheme(<ChatPage />);
      unmount();

      expect(mockWebSocket.close).toHaveBeenCalled();
    });

    it('cancels pending requests', async () => {
      const abortController = new AbortController();
      const abortSpy = jest.spyOn(abortController, 'abort');
      global.AbortController = jest.fn(() => abortController);

      const { unmount } = renderWithTheme(<ChatPage />);
      unmount();

      expect(abortSpy).toHaveBeenCalled();
    });

    it('saves state before unmounting', () => {
      const { getByRole, unmount } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      unmount();

      const savedState = JSON.parse(localStorage.getItem('chatState'));
      expect(savedState.messages).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('handles mounting errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Mounting error');
      
      jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {
        throw error;
      });

      const { container } = renderWithTheme(<ChatPage />);
      
      expect(container).toHaveTextContent(/произошла ошибка/i);
      errorSpy.mockRestore();
    });

    it('handles update errors', async () => {
      const { rerender } = renderWithTheme(<ChatPage />);

      const error = new Error('Update error');
      jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {
        throw error;
      });

      rerender(<ChatPage key="new" />);

      await waitFor(() => {
        expect(document.body).toHaveTextContent(/произошла ошибка/i);
      });
    });

    it('handles unmounting errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockWebSocket = {
        addEventListener: jest.fn(),
        send: jest.fn(),
        close: jest.fn(() => { throw new Error('Close error'); })
      };
      global.WebSocket = jest.fn(() => mockWebSocket);

      const { unmount } = renderWithTheme(<ChatPage />);
      unmount();

      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('prevents unnecessary re-renders', async () => {
      const renderSpy = jest.spyOn(React, 'createElement');
      const { rerender } = renderWithTheme(<ChatPage />);

      const initialRenderCount = renderSpy.mock.calls.length;
      rerender(<ChatPage key="same" />);

      expect(renderSpy.mock.calls.length - initialRenderCount).toBeLessThan(5);
    });

    it('optimizes effect dependencies', async () => {
      const effectSpy = jest.spyOn(React, 'useEffect');
      renderWithTheme(<ChatPage />);

      expect(effectSpy).toHaveBeenCalledWith(
        expect.any(Function),
        expect.arrayContaining([])
      );
    });
  });

  describe('State Recovery', () => {
    it('recovers from saved state', () => {
      localStorage.setItem('chatState', JSON.stringify({
        messages: mockMessages,
        agent: mockAgent
      }));

      const { getByTestId } = renderWithTheme(<ChatPage />);
      const messagesContainer = getByTestId('messages-container');

      expect(messagesContainer.children).toHaveLength(mockMessages.length);
    });

    it('handles corrupted saved state', () => {
      localStorage.setItem('chatState', 'invalid json');

      const { getByTestId } = renderWithTheme(<ChatPage />);
      const messagesContainer = getByTestId('messages-container');

      expect(messagesContainer.children).toHaveLength(0);
    });
  });
});
