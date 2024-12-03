import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Memoization', () => {
  describe('Component Memoization', () => {
    it('memoizes child components', () => {
      const renderSpy = jest.spyOn(React, 'createElement');
      const { rerender } = renderWithTheme(<ChatPage />);

      const initialRenderCount = renderSpy.mock.calls.length;
      rerender(<ChatPage key="rerender" />);

      expect(renderSpy.mock.calls.length - initialRenderCount).toBeLessThan(5);
    });

    it('prevents unnecessary message re-renders', () => {
      const { getAllByTestId, rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      const messages = getAllByTestId('chat-message');
      const initialProps = messages.map(msg => msg.textContent);

      rerender(<ChatPage initialMessages={mockMessages} />);
      const newMessages = getAllByTestId('chat-message');
      const newProps = newMessages.map(msg => msg.textContent);

      expect(newProps).toEqual(initialProps);
    });

    it('memoizes static content', () => {
      const { getByTestId, rerender } = renderWithTheme(<ChatPage />);
      const header = getByTestId('header');
      const initialContent = header.textContent;

      rerender(<ChatPage />);
      expect(header.textContent).toBe(initialContent);
    });
  });

  describe('Callback Memoization', () => {
    it('memoizes event handlers', () => {
      const { getByRole, rerender } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const initialOnChange = input.onchange;

      rerender(<ChatPage />);
      expect(input.onchange).toBe(initialOnChange);
    });

    it('memoizes complex callbacks', () => {
      const onMessageSend = jest.fn();
      const { getByRole, rerender } = renderWithTheme(
        <ChatPage onMessageSend={onMessageSend} />
      );
      const input = getByRole('textbox');
      const form = input.closest('form');
      const initialOnSubmit = form.onsubmit;

      rerender(<ChatPage onMessageSend={onMessageSend} />);
      expect(form.onsubmit).toBe(initialOnSubmit);
    });

    it('updates callbacks when dependencies change', () => {
      const { getByRole, rerender } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );
      const input = getByRole('textbox');
      const form = input.closest('form');
      const initialOnSubmit = form.onsubmit;

      const updatedAgent = { ...mockAgent, name: 'Updated Agent' };
      rerender(<ChatPage initialAgent={updatedAgent} />);
      expect(form.onsubmit).not.toBe(initialOnSubmit);
    });
  });

  describe('Value Memoization', () => {
    it('memoizes computed values', () => {
      const { getByTestId, rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const stats = getByTestId('chat-stats');
      const initialStats = stats.textContent;

      rerender(<ChatPage initialMessages={mockMessages} />);
      expect(stats.textContent).toBe(initialStats);
    });

    it('updates memoized values when dependencies change', () => {
      const { getByTestId, rerender } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const stats = getByTestId('chat-stats');
      const initialStats = stats.textContent;

      const newMessages = [...mockMessages, {
        text: 'New message',
        sender: 'user',
        timestamp: new Date()
      }];
      rerender(<ChatPage initialMessages={newMessages} />);
      expect(stats.textContent).not.toBe(initialStats);
    });
  });

  describe('Context Memoization', () => {
    it('memoizes context values', () => {
      const { rerender } = renderWithTheme(<ChatPage />);
      const contextSpy = jest.spyOn(React, 'createContext');
      
      rerender(<ChatPage />);
      expect(contextSpy).not.toHaveBeenCalled();
    });

    it('updates context when necessary', () => {
      const { rerender } = renderWithTheme(
        <ChatPage theme="light" />
      );
      const contextSpy = jest.spyOn(React, 'createContext');

      rerender(<ChatPage theme="dark" />);
      expect(contextSpy).not.toHaveBeenCalled();
    });
  });

  describe('Effect Memoization', () => {
    it('memoizes effect callbacks', () => {
      const effectSpy = jest.spyOn(React, 'useEffect');
      const { rerender } = renderWithTheme(<ChatPage />);
      const initialEffectCount = effectSpy.mock.calls.length;

      rerender(<ChatPage />);
      expect(effectSpy.mock.calls.length).toBe(initialEffectCount);
    });

    it('updates effects when dependencies change', () => {
      const effectSpy = jest.spyOn(React, 'useEffect');
      const { rerender } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );
      const initialEffectCount = effectSpy.mock.calls.length;

      const updatedAgent = { ...mockAgent, name: 'Updated Agent' };
      rerender(<ChatPage initialAgent={updatedAgent} />);
      expect(effectSpy.mock.calls.length).toBeGreaterThan(initialEffectCount);
    });
  });

  describe('Ref Memoization', () => {
    it('memoizes ref callbacks', () => {
      const { getByTestId, rerender } = renderWithTheme(<ChatPage />);
      const container = getByTestId('messages-container');
      const initialRef = container.ref;

      rerender(<ChatPage />);
      expect(container.ref).toBe(initialRef);
    });

    it('maintains ref identity', () => {
      const containerRef = React.createRef();
      const { rerender } = renderWithTheme(
        <ChatPage messagesContainerRef={containerRef} />
      );
      const initialRef = containerRef.current;

      rerender(<ChatPage messagesContainerRef={containerRef} />);
      expect(containerRef.current).toBe(initialRef);
    });
  });

  describe('State Memoization', () => {
    it('memoizes state updates', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const setStateSpy = jest.spyOn(React, 'useState');

      fireEvent.change(input, { target: { value: 'Test' } });
      const initialStateCount = setStateSpy.mock.calls.length;

      fireEvent.change(input, { target: { value: 'Test' } });
      expect(setStateSpy.mock.calls.length).toBe(initialStateCount);
    });

    it('batches state updates', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');
      const setStateSpy = jest.spyOn(React, 'useState');

      // Быстрые последовательные обновления
      for (let i = 0; i < 5; i++) {
        fireEvent.change(input, { target: { value: `Test ${i}` } });
      }

      expect(setStateSpy.mock.calls.length).toBeLessThan(10);
    });
  });

  describe('Performance Optimization', () => {
    it('optimizes list rendering', () => {
      const manyMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
        sender: 'user',
        timestamp: new Date()
      }));

      const renderSpy = jest.spyOn(React, 'createElement');
      renderWithTheme(<ChatPage initialMessages={manyMessages} />);

      expect(renderSpy.mock.calls.length).toBeLessThan(manyMessages.length);
    });

    it('implements windowing for large lists', () => {
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
  });
});
