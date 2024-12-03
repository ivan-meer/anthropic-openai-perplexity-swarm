import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для requestAnimationFrame
const mockRequestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 1;
};

// Мок для getComputedStyle
const mockGetComputedStyle = (element) => ({
  ...window.getComputedStyle(element),
  animationName: 'test-animation',
  animationDuration: '0.3s',
  transition: 'all 0.3s ease'
});

describe('ChatPage Animations', () => {
  beforeAll(() => {
    window.requestAnimationFrame = mockRequestAnimationFrame;
    window.getComputedStyle = mockGetComputedStyle;
  });

  describe('Message Animations', () => {
    it('animates new messages', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const message = await waitFor(() => getByTestId('chat-message'));
      expect(message).toHaveStyle({
        animation: expect.stringContaining('fadeIn')
      });
    });

    it('animates message deletion', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];
      const deleteButton = message.querySelector('[aria-label="delete"]');

      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(message).toHaveStyle({
          animation: expect.stringContaining('fadeOut')
        });
      });
    });

    it('animates typing indicator', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const indicator = await waitFor(() => getByTestId('typing-indicator'));
      expect(indicator).toHaveStyle({
        animation: expect.stringContaining('pulse')
      });
    });
  });

  describe('Modal Animations', () => {
    it('animates settings modal', async () => {
      const { getByText, getByRole } = renderWithTheme(<ChatPage />);
      const settingsButton = getByText(/настройки/i);

      fireEvent.click(settingsButton);
      const modal = await waitFor(() => getByRole('dialog'));

      expect(modal).toHaveStyle({
        animation: expect.stringContaining('slideIn')
      });
    });

    it('animates modal close', async () => {
      const { getByText, getByRole } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText(/настройки/i));
      const modal = await waitFor(() => getByRole('dialog'));
      const closeButton = getByText(/закрыть/i);

      fireEvent.click(closeButton);
      await waitFor(() => {
        expect(modal).toHaveStyle({
          animation: expect.stringContaining('slideOut')
        });
      });
    });
  });

  describe('Transition Effects', () => {
    it('applies hover transitions', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      fireEvent.mouseEnter(message);
      expect(message).toHaveStyle({
        transition: expect.stringContaining('all')
      });
    });

    it('applies focus transitions', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.focus(input);
      expect(input).toHaveStyle({
        transition: expect.stringContaining('all')
      });
    });
  });

  describe('Scroll Animations', () => {
    it('animates scroll to bottom', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const container = getByTestId('messages-container');

      fireEvent.scroll(container);
      expect(container).toHaveStyle({
        scrollBehavior: 'smooth'
      });
    });

    it('animates scroll button', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const scrollButton = getByTestId('scroll-button');

      fireEvent.mouseEnter(scrollButton);
      expect(scrollButton).toHaveStyle({
        transform: expect.stringContaining('scale')
      });
    });
  });

  describe('Loading Animations', () => {
    it('animates loading spinner', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const spinner = await waitFor(() => getByTestId('loading-spinner'));
      expect(spinner).toHaveStyle({
        animation: expect.stringContaining('spin')
      });
    });

    it('animates progress bar', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const progressBar = await waitFor(() => getByTestId('progress-bar'));
      expect(progressBar).toHaveStyle({
        animation: expect.stringContaining('progress')
      });
    });
  });

  describe('Button Animations', () => {
    it('animates button hover', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const button = getByRole('button', { name: /отправить/i });

      fireEvent.mouseEnter(button);
      expect(button).toHaveStyle({
        transform: expect.stringContaining('scale')
      });
    });

    it('animates button click', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const button = getByRole('button', { name: /отправить/i });

      fireEvent.mouseDown(button);
      expect(button).toHaveStyle({
        transform: expect.stringContaining('scale(0.95)')
      });
    });
  });

  describe('Toast Animations', () => {
    it('animates toast appearance', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      const toast = await waitFor(() => getByTestId('toast'));
      expect(toast).toHaveStyle({
        animation: expect.stringContaining('slideIn')
      });
    });

    it('animates toast disappearance', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      const toast = await waitFor(() => getByTestId('toast'));
      await waitFor(() => {
        expect(toast).toHaveStyle({
          animation: expect.stringContaining('slideOut')
        });
      }, { timeout: 3000 });
    });
  });

  describe('Reduced Motion', () => {
    it('respects reduced motion preferences', async () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      Object.defineProperty(mediaQuery, 'matches', { value: true });

      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      const message = await waitFor(() => getByTestId('chat-message'));
      expect(message).not.toHaveStyle({
        animation: expect.any(String)
      });
    });
  });
});
