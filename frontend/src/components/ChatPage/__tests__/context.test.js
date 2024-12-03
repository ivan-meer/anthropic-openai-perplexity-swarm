import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { ToastContext } from '../../../contexts/ToastContext';
import { ThemeContext } from 'styled-components';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Context', () => {
  describe('Toast Context', () => {
    it('uses toast context for notifications', async () => {
      const showToast = jest.fn();
      const { getByRole } = render(
        <ToastContext.Provider value={{ showToast }}>
          <ChatPage />
        </ToastContext.Provider>
      );

      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.any(String),
            type: 'success'
          })
        );
      });
    });

    it('shows error toasts', async () => {
      const showToast = jest.fn();
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      const { getByRole } = render(
        <ToastContext.Provider value={{ showToast }}>
          <ChatPage />
        </ToastContext.Provider>
      );

      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('ошибка'),
            type: 'error'
          })
        );
      });
    });
  });

  describe('Theme Context', () => {
    it('accesses theme from context', () => {
      const theme = {
        colors: {
          primary: '#test',
          background: '#test-bg'
        }
      };

      const { container } = render(
        <ThemeContext.Provider value={theme}>
          <ChatPage />
        </ThemeContext.Provider>
      );

      expect(container.firstChild).toHaveStyle({
        backgroundColor: '#test-bg'
      });
    });

    it('updates with theme changes', () => {
      const initialTheme = {
        colors: {
          primary: '#initial',
          background: '#initial-bg'
        }
      };

      const updatedTheme = {
        colors: {
          primary: '#updated',
          background: '#updated-bg'
        }
      };

      const { container, rerender } = render(
        <ThemeContext.Provider value={initialTheme}>
          <ChatPage />
        </ThemeContext.Provider>
      );

      rerender(
        <ThemeContext.Provider value={updatedTheme}>
          <ChatPage />
        </ThemeContext.Provider>
      );

      expect(container.firstChild).toHaveStyle({
        backgroundColor: '#updated-bg'
      });
    });
  });

  describe('Agent Context', () => {
    const AgentContext = React.createContext();

    it('shares agent state through context', async () => {
      const setActiveAgent = jest.fn();
      const { getByTestId } = render(
        <AgentContext.Provider value={{ activeAgent: mockAgent, setActiveAgent }}>
          <ChatPage />
        </AgentContext.Provider>
      );

      const agentInfo = getByTestId('agent-info');
      expect(agentInfo).toHaveTextContent(mockAgent.name);
    });

    it('updates agent context', async () => {
      const setActiveAgent = jest.fn();
      const { getByRole } = render(
        <AgentContext.Provider value={{ activeAgent: mockAgent, setActiveAgent }}>
          <ChatPage />
        </AgentContext.Provider>
      );

      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const nameInput = getByRole('textbox', { name: /имя агента/i });
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      fireEvent.click(getByRole('button', { name: /сохранить/i }));

      expect(setActiveAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Name'
        })
      );
    });
  });

  describe('Session Context', () => {
    const SessionContext = React.createContext();

    it('shares session data through context', () => {
      const session = {
        id: 'test-session',
        startTime: Date.now(),
        messages: mockMessages
      };

      const { getByTestId } = render(
        <SessionContext.Provider value={{ session }}>
          <ChatPage />
        </SessionContext.Provider>
      );

      const sessionInfo = getByTestId('session-info');
      expect(sessionInfo).toHaveTextContent(session.id);
    });

    it('updates session context', async () => {
      const updateSession = jest.fn();
      const { getByRole } = render(
        <SessionContext.Provider value={{ updateSession }}>
          <ChatPage />
        </SessionContext.Provider>
      );

      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(updateSession).toHaveBeenCalledWith(
          expect.objectContaining({
            messages: expect.any(Array)
          })
        );
      });
    });
  });

  describe('Settings Context', () => {
    const SettingsContext = React.createContext();

    it('shares settings through context', () => {
      const settings = {
        theme: 'dark',
        notifications: true,
        language: 'ru'
      };

      const { container } = render(
        <SettingsContext.Provider value={{ settings }}>
          <ChatPage />
        </SettingsContext.Provider>
      );

      expect(container.firstChild).toHaveAttribute('data-theme', 'dark');
    });

    it('updates settings context', async () => {
      const updateSettings = jest.fn();
      const { getByRole } = render(
        <SettingsContext.Provider value={{ updateSettings }}>
          <ChatPage />
        </SettingsContext.Provider>
      );

      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const themeSelect = getByRole('combobox', { name: /тема/i });
      fireEvent.change(themeSelect, { target: { value: 'light' } });

      expect(updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'light'
        })
      );
    });
  });

  describe('Multiple Contexts', () => {
    it('combines multiple contexts', async () => {
      const showToast = jest.fn();
      const setActiveAgent = jest.fn();
      const updateSession = jest.fn();

      const { getByRole } = render(
        <ToastContext.Provider value={{ showToast }}>
          <AgentContext.Provider value={{ setActiveAgent }}>
            <SessionContext.Provider value={{ updateSession }}>
              <ChatPage />
            </SessionContext.Provider>
          </AgentContext.Provider>
        </ToastContext.Provider>
      );

      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(showToast).toHaveBeenCalled();
        expect(updateSession).toHaveBeenCalled();
      });
    });

    it('handles context updates correctly', async () => {
      const showToast = jest.fn();
      const setActiveAgent = jest.fn();
      const updateSession = jest.fn();

      const { getByRole, rerender } = render(
        <ToastContext.Provider value={{ showToast }}>
          <AgentContext.Provider value={{ setActiveAgent }}>
            <SessionContext.Provider value={{ updateSession }}>
              <ChatPage />
            </SessionContext.Provider>
          </AgentContext.Provider>
        </ToastContext.Provider>
      );

      // Обновляем контексты
      rerender(
        <ToastContext.Provider value={{ showToast }}>
          <AgentContext.Provider value={{ setActiveAgent, activeAgent: { ...mockAgent, name: 'Updated' } }}>
            <SessionContext.Provider value={{ updateSession, messages: [...mockMessages, { text: 'New message' }] }}>
              <ChatPage />
            </SessionContext.Provider>
          </AgentContext.Provider>
        </ToastContext.Provider>
      );

      await waitFor(() => {
        expect(getByRole('heading')).toHaveTextContent('Updated');
      });
    });
  });
});
