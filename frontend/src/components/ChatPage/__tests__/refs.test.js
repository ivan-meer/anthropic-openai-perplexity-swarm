import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage Refs', () => {
  describe('Input Refs', () => {
    it('maintains input focus', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });

    it('focuses input on keyboard shortcut', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.keyDown(document, { key: '/', ctrlKey: true });
      expect(document.activeElement).toBe(input);
    });

    it('restores input state after blur', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.blur(input);
      fireEvent.focus(input);

      expect(input).toHaveValue('Test message');
    });
  });

  describe('Message Container Refs', () => {
    it('scrolls to bottom on new message', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const container = getByTestId('messages-container');

      // Мокируем scrollIntoView
      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });

    it('maintains scroll position when loading history', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const container = getByTestId('messages-container');

      const initialScrollTop = 100;
      fireEvent.scroll(container, { target: { scrollTop: initialScrollTop } });

      // Загружаем историю
      fireEvent.scroll(container, { target: { scrollTop: 0 } });

      expect(container.scrollTop).toBe(initialScrollTop);
    });

    it('restores scroll position after rerender', () => {
      const { getByTestId, rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const container = getByTestId('messages-container');

      const scrollPosition = 100;
      fireEvent.scroll(container, { target: { scrollTop: scrollPosition } });

      rerender(<ChatPage initialMessages={mockMessages} />);

      expect(container.scrollTop).toBe(scrollPosition);
    });
  });

  describe('Modal Refs', () => {
    it('traps focus in modal', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const modal = getByTestId('settings-modal');
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // Проверяем, что фокус остается внутри модального окна
      fireEvent.keyDown(focusableElements[focusableElements.length - 1], {
        key: 'Tab'
      });
      expect(document.activeElement).toBe(focusableElements[0]);
    });

    it('returns focus after modal close', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const settingsButton = getByRole('button', { name: /настройки/i });
      
      fireEvent.click(settingsButton);
      fireEvent.click(getByRole('button', { name: /закрыть/i }));

      expect(document.activeElement).toBe(settingsButton);
    });
  });

  describe('Dropdown Refs', () => {
    it('manages command suggestions focus', async () => {
      const { getByRole, getAllByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });
      const suggestions = getAllByRole('option');

      // Проверяем навигацию по стрелкам
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(suggestions[0]);

      fireEvent.keyDown(suggestions[0], { key: 'ArrowDown' });
      expect(document.activeElement).toBe(suggestions[1]);
    });

    it('returns focus to input after selection', async () => {
      const { getByRole, getAllByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });
      const suggestions = getAllByRole('option');

      fireEvent.click(suggestions[0]);
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Forwarded Refs', () => {
    it('exposes message container ref', () => {
      const containerRef = React.createRef();
      renderWithTheme(<ChatPage messagesContainerRef={containerRef} />);

      expect(containerRef.current).toBeTruthy();
      expect(containerRef.current.getAttribute('data-testid')).toBe('messages-container');
    });

    it('exposes input ref', () => {
      const inputRef = React.createRef();
      renderWithTheme(<ChatPage inputRef={inputRef} />);

      expect(inputRef.current).toBeTruthy();
      expect(inputRef.current.tagName.toLowerCase()).toBe('input');
    });
  });

  describe('Callback Refs', () => {
    it('calls ref callback with message elements', () => {
      const messageRef = jest.fn();
      renderWithTheme(
        <ChatPage 
          initialMessages={mockMessages}
          messageRef={messageRef}
        />
      );

      expect(messageRef).toHaveBeenCalledTimes(mockMessages.length);
      messageRef.mock.calls.forEach(call => {
        expect(call[0]).toBeInstanceOf(HTMLElement);
      });
    });

    it('updates callback refs on message changes', async () => {
      const messageRef = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatPage messageRef={messageRef} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(messageRef).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Ref Cleanup', () => {
    it('cleans up refs on unmount', () => {
      const containerRef = React.createRef();
      const { unmount } = renderWithTheme(
        <ChatPage messagesContainerRef={containerRef} />
      );

      unmount();
      expect(containerRef.current).toBeNull();
    });

    it('removes event listeners from refs', () => {
      const containerRef = React.createRef();
      const { unmount } = renderWithTheme(
        <ChatPage messagesContainerRef={containerRef} />
      );

      const removeEventListener = jest.spyOn(
        containerRef.current,
        'removeEventListener'
      );

      unmount();
      expect(removeEventListener).toHaveBeenCalled();
    });
  });
});
