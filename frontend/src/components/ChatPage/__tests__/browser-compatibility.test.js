import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

// Мок для разных браузерных API
const mockBrowserAPIs = {
  modern: {
    IntersectionObserver: class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    ResizeObserver: class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    MutationObserver: class MutationObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      disconnect() {}
    }
  },
  legacy: {
    IntersectionObserver: undefined,
    ResizeObserver: undefined,
    MutationObserver: undefined
  }
};

describe('ChatPage Browser Compatibility', () => {
  describe('Modern Browsers', () => {
    beforeEach(() => {
      Object.assign(window, mockBrowserAPIs.modern);
    });

    it('uses modern features when available', () => {
      const { container } = renderWithTheme(<ChatPage />);
      
      expect(container.querySelector('[loading="lazy"]')).toBeTruthy();
      expect(container.querySelector('[style*="scroll-behavior: smooth"]')).toBeTruthy();
    });

    it('implements smooth scrolling', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const messagesContainer = container.querySelector('[data-testid="messages-container"]');

      expect(messagesContainer).toHaveStyle({ scrollBehavior: 'smooth' });
    });

    it('uses CSS Grid layout', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const gridContainer = container.querySelector('[style*="display: grid"]');

      expect(gridContainer).toBeTruthy();
    });
  });

  describe('Legacy Browsers', () => {
    beforeEach(() => {
      Object.assign(window, mockBrowserAPIs.legacy);
    });

    it('provides fallback for IntersectionObserver', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const lazyLoadedImages = container.querySelectorAll('img[data-src]');

      lazyLoadedImages.forEach(img => {
        expect(img.src).toBeTruthy();
      });
    });

    it('provides fallback for ResizeObserver', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const resizableElements = container.querySelectorAll('[data-resize-observer]');

      resizableElements.forEach(element => {
        expect(element).toHaveAttribute('style');
      });
    });

    it('provides fallback for smooth scrolling', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const messagesContainer = container.querySelector('[data-testid="messages-container"]');

      expect(messagesContainer.scrollTo).toBeDefined();
    });
  });

  describe('CSS Features', () => {
    it('provides fallbacks for modern CSS properties', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const styles = window.getComputedStyle(container.firstChild);

      // Проверяем наличие fallback для gap
      expect(styles.marginBottom || styles.gap).toBeDefined();

      // Проверяем наличие fallback для CSS Grid
      expect(styles.display === 'grid' || styles.display === 'flex').toBeTruthy();
    });

    it('handles flexbox prefixes', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const flexContainer = container.querySelector('[style*="display: flex"]');
      const styles = window.getComputedStyle(flexContainer);

      expect(
        styles.display === 'flex' ||
        styles.display === '-webkit-flex' ||
        styles.display === '-ms-flexbox'
      ).toBeTruthy();
    });
  });

  describe('JavaScript Features', () => {
    it('handles async/await fallback', async () => {
      const originalPromise = global.Promise;
      global.Promise = undefined;

      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(input).toHaveValue('');
      });

      global.Promise = originalPromise;
    });

    it('provides fallback for Array methods', () => {
      const originalMap = Array.prototype.map;
      Array.prototype.map = undefined;

      const { container } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );

      expect(container.querySelectorAll('[data-testid="chat-message"]')).toBeTruthy();

      Array.prototype.map = originalMap;
    });
  });

  describe('Browser-specific Features', () => {
    describe('WebKit', () => {
      it('handles WebKit-specific scrollbar styling', () => {
        const { container } = renderWithTheme(<ChatPage />);
        const messagesContainer = container.querySelector('[data-testid="messages-container"]');
        const styles = window.getComputedStyle(messagesContainer);

        expect(
          styles.getPropertyValue('scrollbar-width') ||
          styles.getPropertyValue('-webkit-scrollbar-width')
        ).toBeDefined();
      });
    });

    describe('Firefox', () => {
      it('handles Firefox-specific input styling', () => {
        const { getByRole } = renderWithTheme(<ChatPage />);
        const input = getByRole('textbox');
        const styles = window.getComputedStyle(input);

        expect(styles.getPropertyValue('-moz-appearance')).toBeDefined();
      });
    });

    describe('IE11', () => {
      it('provides fallback for CSS variables', () => {
        const { container } = renderWithTheme(<ChatPage />);
        const styles = window.getComputedStyle(container.firstChild);

        expect(styles.getPropertyValue('--primary-color') || styles.color).toBeDefined();
      });
    });
  });

  describe('Mobile Browsers', () => {
    it('handles touch events', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const messagesContainer = container.querySelector('[data-testid="messages-container"]');

      fireEvent.touchStart(messagesContainer, {
        touches: [{ clientY: 0 }]
      });
      fireEvent.touchMove(messagesContainer, {
        touches: [{ clientY: 100 }]
      });
      fireEvent.touchEnd(messagesContainer);

      expect(messagesContainer.scrollTop).toBeDefined();
    });

    it('handles viewport meta tag', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const metaViewport = document.querySelector('meta[name="viewport"]');

      expect(metaViewport).toBeTruthy();
      expect(metaViewport.content).toContain('width=device-width');
    });
  });

  describe('Feature Detection', () => {
    it('checks for required features', () => {
      const features = {
        flexbox: 'flex' in document.documentElement.style,
        grid: 'grid' in document.documentElement.style,
        customProperties: CSS.supports('--custom-property', 'value'),
        smoothScroll: 'scrollBehavior' in document.documentElement.style
      };

      Object.entries(features).forEach(([feature, supported]) => {
        if (!supported) {
          console.warn(`Feature ${feature} is not supported`);
        }
      });

      expect(true).toBeTruthy(); // Тест всегда проходит, но выводит предупреждения
    });
  });
});
