import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для window.matchMedia
const mockMatchMedia = (matches) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('ChatPage Mobile', () => {
  describe('Responsive Layout', () => {
    it('adapts layout for mobile screens', () => {
      mockMatchMedia(true); // Мобильный размер экрана
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyle({
        padding: '8px',
        maxWidth: '100%'
      });
    });

    it('adjusts font sizes for mobile', () => {
      mockMatchMedia(true);
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const header = getByTestId('header');

      expect(header).toHaveStyle({
        fontSize: '18px'
      });
    });

    it('stacks elements vertically on mobile', () => {
      mockMatchMedia(true);
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const container = getByTestId('messages-container');

      expect(container).toHaveStyle({
        flexDirection: 'column'
      });
    });
  });

  describe('Touch Interactions', () => {
    it('handles touch events', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      fireEvent.touchStart(message);
      fireEvent.touchEnd(message);

      await waitFor(() => {
        expect(message).toHaveClass('message-touched');
      });
    });

    it('supports swipe gestures', async () => {
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      fireEvent.touchStart(message, { touches: [{ clientX: 0, clientY: 0 }] });
      fireEvent.touchMove(message, { touches: [{ clientX: -100, clientY: 0 }] });
      fireEvent.touchEnd(message);

      await waitFor(() => {
        expect(message).toHaveClass('message-swiped');
      });
    });

    it('implements pull-to-refresh', async () => {
      const onRefresh = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ChatPage onRefresh={onRefresh} />
      );
      const container = getByTestId('messages-container');

      fireEvent.touchStart(container, { touches: [{ clientY: 0 }] });
      fireEvent.touchMove(container, { touches: [{ clientY: 100 }] });
      fireEvent.touchEnd(container);

      await waitFor(() => {
        expect(onRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('Mobile Input', () => {
    it('expands input on focus', async () => {
      mockMatchMedia(true);
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.focus(input);

      await waitFor(() => {
        expect(input).toHaveStyle({
          height: 'auto'
        });
      });
    });

    it('shows mobile keyboard toolbar', async () => {
      mockMatchMedia(true);
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const toolbar = getByTestId('mobile-toolbar');

      expect(toolbar).toBeVisible();
      expect(toolbar).toHaveStyle({
        position: 'fixed',
        bottom: '0'
      });
    });

    it('handles emoji picker on mobile', async () => {
      mockMatchMedia(true);
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const emojiButton = getByTestId('emoji-button');
      const input = getByRole('textbox');

      fireEvent.click(emojiButton);
      const emojiPicker = getByTestId('emoji-picker');
      fireEvent.click(emojiPicker.querySelector('[data-emoji="👍"]'));

      expect(input.value).toContain('👍');
    });
  });

  describe('Mobile Navigation', () => {
    it('shows mobile menu button', () => {
      mockMatchMedia(true);
      const { getByRole } = renderWithTheme(<ChatPage />);
      const menuButton = getByRole('button', { name: /меню/i });

      expect(menuButton).toBeVisible();
    });

    it('opens mobile menu', async () => {
      mockMatchMedia(true);
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const menuButton = getByRole('button', { name: /меню/i });

      fireEvent.click(menuButton);

      await waitFor(() => {
        const menu = getByTestId('mobile-menu');
        expect(menu).toBeVisible();
      });
    });

    it('closes menu on backdrop click', async () => {
      mockMatchMedia(true);
      const { getByRole, getByTestId, queryByTestId } = renderWithTheme(<ChatPage />);
      const menuButton = getByRole('button', { name: /меню/i });

      fireEvent.click(menuButton);
      const backdrop = getByTestId('menu-backdrop');
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Mobile Performance', () => {
    it('implements mobile-specific optimizations', () => {
      mockMatchMedia(true);
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveAttribute('data-mobile-optimized', 'true');
    });

    it('lazy loads images on mobile', async () => {
      mockMatchMedia(true);
      const { getAllByRole } = renderWithTheme(
        <ChatPage initialMessages={[{
          ...mockMessages[0],
          image: 'test.jpg'
        }]} />
      );

      const images = getAllByRole('img');
      expect(images[0]).toHaveAttribute('loading', 'lazy');
    });

    it('reduces animations on low-end devices', async () => {
      // Симулируем низкопроизводительное устройство
      window.navigator.deviceMemory = 1;
      mockMatchMedia(true);

      const { container } = renderWithTheme(<ChatPage />);
      expect(container.firstChild).toHaveClass('reduced-motion');
    });
  });

  describe('Mobile Features', () => {
    it('supports offline mode', async () => {
      mockMatchMedia(true);
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем офлайн режим
      window.dispatchEvent(new Event('offline'));

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/сообщение будет отправлено/i)).toBeInTheDocument();
      });
    });

    it('shows mobile-specific tooltips', async () => {
      mockMatchMedia(true);
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const message = getAllByTestId('chat-message')[0];

      fireEvent.touchStart(message);
      fireEvent.touchEnd(message);

      await waitFor(() => {
        expect(document.querySelector('.mobile-tooltip')).toBeVisible();
      });
    });

    it('implements mobile share functionality', async () => {
      mockMatchMedia(true);
      const mockShare = jest.fn();
      window.navigator.share = mockShare;

      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const shareButton = getAllByTestId('share-button')[0];

      fireEvent.click(shareButton);

      expect(mockShare).toHaveBeenCalled();
    });
  });

  describe('Mobile Accessibility', () => {
    it('increases touch targets for mobile', () => {
      mockMatchMedia(true);
      const { getAllByRole } = renderWithTheme(<ChatPage />);
      const buttons = getAllByRole('button');

      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const height = parseInt(styles.height);
        expect(height).toBeGreaterThanOrEqual(44); // Минимальный размер для тач-таргетов
      });
    });

    it('supports mobile screen readers', () => {
      mockMatchMedia(true);
      const { getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const messages = getAllByTestId('chat-message');

      messages.forEach(message => {
        expect(message).toHaveAttribute('role', 'article');
        expect(message).toHaveAttribute('aria-label');
      });
    });
  });
});
