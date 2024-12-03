import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Props', () => {
  describe('Required Props', () => {
    it('renders with minimal required props', () => {
      const { container } = renderWithTheme(<ChatPage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('validates required props', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<ChatPage initialMessages={null} />);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed prop type')
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Optional Props', () => {
    it('accepts custom className', () => {
      const { container } = renderWithTheme(
        <ChatPage className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('accepts custom style', () => {
      const { container } = renderWithTheme(
        <ChatPage style={{ backgroundColor: 'red' }} />
      );
      expect(container.firstChild).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts data attributes', () => {
      const { container } = renderWithTheme(
        <ChatPage data-testid="custom-testid" />
      );
      expect(container.firstChild).toHaveAttribute('data-testid', 'custom-testid');
    });
  });

  describe('Callback Props', () => {
    it('calls onMessageSend callback', async () => {
      const onMessageSend = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatPage onMessageSend={onMessageSend} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(onMessageSend).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'Test message'
          })
        );
      });
    });

    it('calls onError callback', async () => {
      const onError = jest.fn();
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

      const { getByRole } = renderWithTheme(
        <ChatPage onError={onError} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.any(Error)
        );
      });
    });

    it('calls onSettingsChange callback', async () => {
      const onSettingsChange = jest.fn();
      const { getByRole, getByLabelText } = renderWithTheme(
        <ChatPage onSettingsChange={onSettingsChange} />
      );

      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const themeSelect = getByLabelText(/тема/i);
      fireEvent.change(themeSelect, { target: { value: 'dark' } });

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'dark'
        })
      );
    });
  });

  describe('Render Props', () => {
    it('uses custom message renderer', () => {
      const messageRenderer = jest.fn(() => <div>Custom Message</div>);
      renderWithTheme(
        <ChatPage 
          initialMessages={mockMessages}
          renderMessage={messageRenderer}
        />
      );

      expect(messageRenderer).toHaveBeenCalledTimes(mockMessages.length);
    });

    it('uses custom input renderer', () => {
      const inputRenderer = jest.fn(() => <input type="text" />);
      renderWithTheme(
        <ChatPage renderInput={inputRenderer} />
      );

      expect(inputRenderer).toHaveBeenCalled();
    });

    it('uses custom header renderer', () => {
      const headerRenderer = jest.fn(() => <header>Custom Header</header>);
      const { getByText } = renderWithTheme(
        <ChatPage renderHeader={headerRenderer} />
      );

      expect(headerRenderer).toHaveBeenCalled();
      expect(getByText('Custom Header')).toBeInTheDocument();
    });
  });

  describe('State Props', () => {
    it('accepts initial messages', () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messages = getAllByTestId('chat-message');
      expect(messages).toHaveLength(mockMessages.length);
    });

    it('accepts initial agent', () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );
      const agentInfo = getByTestId('agent-info');
      expect(agentInfo).toHaveTextContent(mockAgent.name);
    });

    it('accepts initial settings', () => {
      const initialSettings = { theme: 'dark', notifications: true };
      const { container } = renderWithTheme(
        <ChatPage initialSettings={initialSettings} />
      );
      expect(container.firstChild).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('Ref Props', () => {
    it('forwards container ref', () => {
      const containerRef = React.createRef();
      renderWithTheme(<ChatPage ref={containerRef} />);
      expect(containerRef.current).toBeTruthy();
    });

    it('forwards input ref', () => {
      const inputRef = React.createRef();
      renderWithTheme(<ChatPage inputRef={inputRef} />);
      expect(inputRef.current).toBeTruthy();
    });

    it('forwards messages container ref', () => {
      const messagesRef = React.createRef();
      renderWithTheme(<ChatPage messagesContainerRef={messagesRef} />);
      expect(messagesRef.current).toBeTruthy();
    });
  });

  describe('Feature Props', () => {
    it('enables/disables features', () => {
      const { queryByTestId } = renderWithTheme(
        <ChatPage 
          showCommands={false}
          showStats={false}
          showSettings={false}
        />
      );

      expect(queryByTestId('commands-container')).toBeNull();
      expect(queryByTestId('stats-container')).toBeNull();
      expect(queryByTestId('settings-button')).toBeNull();
    });

    it('accepts custom commands', () => {
      const customCommands = [
        { name: 'custom', description: 'Custom command' }
      ];
      const { getByRole, getByText } = renderWithTheme(
        <ChatPage customCommands={customCommands} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });
      expect(getByText('Custom command')).toBeInTheDocument();
    });

    it('accepts custom message actions', () => {
      const customActions = [
        { name: 'custom', label: 'Custom Action' }
      ];
      const { getAllByTestId, getByText } = renderWithTheme(
        <ChatPage 
          initialMessages={mockMessages}
          messageActions={customActions}
        />
      );

      fireEvent.mouseOver(getAllByTestId('chat-message')[0]);
      expect(getByText('Custom Action')).toBeInTheDocument();
    });
  });

  describe('Style Props', () => {
    it('accepts theme variant', () => {
      const { container } = renderWithTheme(
        <ChatPage variant="compact" />
      );
      expect(container.firstChild).toHaveClass('variant-compact');
    });

    it('accepts color scheme', () => {
      const { container } = renderWithTheme(
        <ChatPage colorScheme="primary" />
      );
      expect(container.firstChild).toHaveClass('color-scheme-primary');
    });

    it('accepts custom colors', () => {
      const customColors = {
        background: '#custom-bg',
        text: '#custom-text'
      };
      const { container } = renderWithTheme(
        <ChatPage customColors={customColors} />
      );
      expect(container.firstChild).toHaveStyle({
        backgroundColor: '#custom-bg',
        color: '#custom-text'
      });
    });
  });

  describe('Prop Changes', () => {
    it('updates on prop changes', async () => {
      const { rerender, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const newMessages = [...mockMessages, {
        text: 'New message',
        sender: 'user',
        timestamp: new Date()
      }];

      rerender(<ChatPage initialMessages={newMessages} />);

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages).toHaveLength(newMessages.length);
      });
    });

    it('handles prop removal', () => {
      const { rerender, queryByTestId } = renderWithTheme(
        <ChatPage showStats={true} />
      );

      rerender(<ChatPage showStats={false} />);
      expect(queryByTestId('stats-container')).toBeNull();
    });
  });
});
