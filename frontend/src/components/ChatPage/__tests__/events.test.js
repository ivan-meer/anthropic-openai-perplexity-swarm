import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage Events', () => {
  describe('User Input Events', () => {
    it('handles text input events', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      expect(input).toHaveValue('Test message');
    });

    it('handles paste events', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      const pasteData = new DataTransfer();
      pasteData.setData('text/plain', 'Pasted text');

      fireEvent.paste(input, {
        clipboardData: pasteData
      });

      expect(input).toHaveValue('Pasted text');
    });

    it('handles key events', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Enter для отправки
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      // Shift + Enter для новой строки
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });
      // Escape для отмены
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      expect(input).toHaveValue('');
    });
  });

  describe('Form Events', () => {
    it('handles form submission', async () => {
      const onSubmit = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatPage onMessageSubmit={onSubmit} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'Test message'
          })
        );
      });
    });

    it('prevents default form submission', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const form = input.closest('form');

      const submitEvent = new Event('submit');
      const preventDefault = jest.spyOn(submitEvent, 'preventDefault');

      fireEvent(form, submitEvent);
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('Mouse Events', () => {
    it('handles message click events', async () => {
      const onClick = jest.fn();
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} onMessageClick={onClick} />
      );
      const messages = getAllByTestId('chat-message');

      fireEvent.click(messages[0]);
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({
          text: mockMessages[0].text
        })
      );
    });

    it('handles message hover events', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messages = getAllByTestId('chat-message');

      fireEvent.mouseEnter(messages[0]);
      await waitFor(() => {
        expect(messages[0]).toHaveStyle({
          backgroundColor: expect.any(String)
        });
      });

      fireEvent.mouseLeave(messages[0]);
      await waitFor(() => {
        expect(messages[0]).not.toHaveStyle({
          backgroundColor: expect.any(String)
        });
      });
    });
  });

  describe('Focus Events', () => {
    it('handles input focus events', () => {
      const onFocus = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatPage onInputFocus={onFocus} />
      );
      const input = getByRole('textbox');

      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('handles input blur events', () => {
      const onBlur = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatPage onInputBlur={onBlur} />
      );
      const input = getByRole('textbox');

      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('Scroll Events', () => {
    it('handles scroll events', async () => {
      const onScroll = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} onScroll={onScroll} />
      );
      const container = getByTestId('messages-container');

      fireEvent.scroll(container, { target: { scrollTop: 100 } });
      expect(onScroll).toHaveBeenCalled();
    });

    it('loads more messages on scroll to top', async () => {
      const loadMore = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} onLoadMore={loadMore} />
      );
      const container = getByTestId('messages-container');

      fireEvent.scroll(container, { target: { scrollTop: 0 } });
      await waitFor(() => {
        expect(loadMore).toHaveBeenCalled();
      });
    });
  });

  describe('Window Events', () => {
    it('handles window resize events', async () => {
      const { container } = renderWithTheme(<ChatPage />);

      fireEvent(window, new Event('resize'));
      await waitFor(() => {
        expect(container.firstChild).toHaveStyle({
          height: expect.any(String)
        });
      });
    });

    it('handles window focus events', async () => {
      const onWindowFocus = jest.fn();
      renderWithTheme(<ChatPage onWindowFocus={onWindowFocus} />);

      fireEvent(window, new Event('focus'));
      expect(onWindowFocus).toHaveBeenCalled();
    });
  });

  describe('Custom Events', () => {
    it('handles custom message events', async () => {
      const onCustomEvent = jest.fn();
      const { getAllByTestId } = renderWithTheme(
        <ChatPage 
          initialMessages={mockMessages}
          onCustomMessageEvent={onCustomEvent}
        />
      );
      const messages = getAllByTestId('chat-message');

      const customEvent = new CustomEvent('custom', { detail: { data: 'test' } });
      fireEvent(messages[0], customEvent);

      expect(onCustomEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { data: 'test' }
        })
      );
    });

    it('handles custom command events', async () => {
      const onCommand = jest.fn();
      const { getByRole } = renderWithTheme(
        <ChatPage onCommand={onCommand} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/custom test' } });
      fireEvent.submit(input.closest('form'));

      expect(onCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          command: 'custom',
          args: ['test']
        })
      );
    });
  });

  describe('Event Bubbling', () => {
    it('stops event propagation when needed', () => {
      const onClick = jest.fn();
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messages = getAllByTestId('chat-message');

      const event = new MouseEvent('click', { bubbles: true });
      document.addEventListener('click', onClick);

      fireEvent(messages[0].querySelector('[data-testid="message-action"]'), event);
      expect(onClick).not.toHaveBeenCalled();

      document.removeEventListener('click', onClick);
    });
  });

  describe('Event Delegation', () => {
    it('uses event delegation for message actions', async () => {
      const onAction = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} onMessageAction={onAction} />
      );
      const container = getByTestId('messages-container');

      const messages = container.querySelectorAll('[data-testid="chat-message"]');
      fireEvent.click(messages[0].querySelector('[data-testid="message-action"]'));

      expect(onAction).toHaveBeenCalled();
    });
  });

  describe('Event Timing', () => {
    it('debounces rapid events', async () => {
      jest.useFakeTimers();
      const onScroll = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ChatPage onScroll={onScroll} />
      );
      const container = getByTestId('messages-container');

      // Быстрая прокрутка
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(container);
      }

      jest.runAllTimers();
      expect(onScroll).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it('throttles continuous events', async () => {
      jest.useFakeTimers();
      const onResize = jest.fn();
      renderWithTheme(<ChatPage onResize={onResize} />);

      // Быстрое изменение размера
      for (let i = 0; i < 10; i++) {
        fireEvent(window, new Event('resize'));
        jest.advanceTimersByTime(50);
      }

      expect(onResize.mock.calls.length).toBeLessThan(10);
      jest.useRealTimers();
    });
  });
});
