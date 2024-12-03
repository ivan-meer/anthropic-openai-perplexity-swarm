import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockTheme } from './__mocks__/mockData';
import 'jest-styled-components';

describe('ChatPage Theming', () => {
  describe('Theme Application', () => {
    it('applies default theme correctly', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const chatContainer = container.firstChild;

      expect(chatContainer).toHaveStyleRule('background-color', mockTheme.colors.background);
      expect(chatContainer).toHaveStyleRule('color', mockTheme.colors.text);
      expect(chatContainer).toHaveStyleRule('font-family', mockTheme.typography.fontFamily.base);
    });

    it('applies custom theme', () => {
      const customTheme = {
        ...mockTheme,
        colors: {
          ...mockTheme.colors,
          background: '#custom-bg',
          text: '#custom-text'
        }
      };

      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <ChatPage />
        </ThemeProvider>
      );
      const chatContainer = container.firstChild;

      expect(chatContainer).toHaveStyleRule('background-color', '#custom-bg');
      expect(chatContainer).toHaveStyleRule('color', '#custom-text');
    });

    it('applies theme variants', () => {
      const { container } = renderWithTheme(
        <ChatPage variant="compact" />
      );
      const chatContainer = container.firstChild;

      expect(chatContainer).toHaveStyleRule('padding', mockTheme.spacing.sm);
      expect(chatContainer).toHaveStyleRule('gap', mockTheme.spacing.xs);
    });
  });

  describe('Dark Mode', () => {
    it('switches to dark mode', async () => {
      const { getByRole, container } = renderWithTheme(<ChatPage />);
      const themeToggle = getByRole('switch', { name: /dark mode/i });

      fireEvent.click(themeToggle);

      await waitFor(() => {
        expect(container.firstChild).toHaveStyleRule(
          'background-color',
          mockTheme.colors.darkMode.background
        );
      });
    });

    it('persists theme preference', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const themeToggle = getByRole('switch', { name: /dark mode/i });

      fireEvent.click(themeToggle);

      expect(localStorage.getItem('themePreference')).toBe('dark');
    });

    it('respects system preference', () => {
      // Мокируем системные настройки темной темы
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        addListener: jest.fn(),
        removeListener: jest.fn()
      }));

      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        mockTheme.colors.darkMode.background
      );
    });
  });

  describe('Color Schemes', () => {
    it('applies primary color scheme', () => {
      const { container } = renderWithTheme(
        <ChatPage colorScheme="primary" />
      );

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        mockTheme.colors.primary.background
      );
    });

    it('applies accent colors', () => {
      const { container } = renderWithTheme(
        <ChatPage accent="success" />
      );

      expect(container.firstChild).toHaveStyleRule(
        'border-color',
        mockTheme.colors.success.border
      );
    });

    it('handles custom color schemes', () => {
      const customColors = {
        background: '#custom-bg',
        text: '#custom-text',
        border: '#custom-border'
      };

      const { container } = renderWithTheme(
        <ChatPage customColors={customColors} />
      );

      expect(container.firstChild).toHaveStyleRule('background-color', '#custom-bg');
      expect(container.firstChild).toHaveStyleRule('color', '#custom-text');
      expect(container.firstChild).toHaveStyleRule('border-color', '#custom-border');
    });
  });

  describe('Typography', () => {
    it('applies font settings', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule(
        'font-family',
        mockTheme.typography.fontFamily.base
      );
      expect(container.firstChild).toHaveStyleRule(
        'font-size',
        mockTheme.typography.fontSize.base
      );
    });

    it('applies heading styles', () => {
      const { getByText } = renderWithTheme(<ChatPage />);
      const heading = getByText(/чат с ai-агентами/i);

      expect(heading).toHaveStyleRule('font-size', mockTheme.typography.fontSize.h1);
      expect(heading).toHaveStyleRule('font-weight', mockTheme.typography.fontWeight.bold);
    });

    it('supports custom fonts', () => {
      const customTheme = {
        ...mockTheme,
        typography: {
          ...mockTheme.typography,
          fontFamily: {
            base: 'CustomFont, sans-serif'
          }
        }
      };

      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <ChatPage />
        </ThemeProvider>
      );

      expect(container.firstChild).toHaveStyleRule(
        'font-family',
        'CustomFont, sans-serif'
      );
    });
  });

  describe('Spacing', () => {
    it('applies spacing system', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule('padding', mockTheme.spacing.lg);
      expect(container.firstChild).toHaveStyleRule('gap', mockTheme.spacing.md);
    });

    it('supports custom spacing', () => {
      const customTheme = {
        ...mockTheme,
        spacing: {
          ...mockTheme.spacing,
          custom: '42px'
        }
      };

      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <ChatPage spacing="custom" />
        </ThemeProvider>
      );

      expect(container.firstChild).toHaveStyleRule('padding', '42px');
    });
  });

  describe('Borders & Shadows', () => {
    it('applies border styles', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule(
        'border-radius',
        mockTheme.borders.radius.lg
      );
    });

    it('applies shadow styles', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule(
        'box-shadow',
        mockTheme.effects.shadows.card
      );
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive styles', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule(
        'padding',
        mockTheme.spacing.sm,
        {
          media: '(max-width: 768px)'
        }
      );
    });

    it('adjusts font sizes responsively', () => {
      const { getByText } = renderWithTheme(<ChatPage />);
      const heading = getByText(/чат с ai-агентами/i);

      expect(heading).toHaveStyleRule(
        'font-size',
        mockTheme.typography.fontSize.h2,
        {
          media: '(max-width: 768px)'
        }
      );
    });
  });

  describe('Animations & Transitions', () => {
    it('applies transition effects', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.firstChild).toHaveStyleRule(
        'transition',
        mockTheme.effects.transitions.default
      );
    });

    it('applies animation styles', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const messageContainer = container.querySelector('[data-testid="messages-container"]');

      expect(messageContainer).toHaveStyleRule(
        'animation',
        expect.stringContaining('fadeIn')
      );
    });
  });

  describe('Theme Switching', () => {
    it('handles theme switching without flickering', async () => {
      const { getByRole, container } = renderWithTheme(<ChatPage />);
      const themeToggle = getByRole('switch', { name: /dark mode/i });

      // Записываем начальный цвет фона
      const initialBgColor = window.getComputedStyle(container.firstChild).backgroundColor;

      fireEvent.click(themeToggle);

      // Проверяем, что новый цвет фона отличается от начального
      await waitFor(() => {
        const newBgColor = window.getComputedStyle(container.firstChild).backgroundColor;
        expect(newBgColor).not.toBe(initialBgColor);
      });
    });

    it('maintains theme during rerenders', () => {
      const { rerender, container } = renderWithTheme(<ChatPage />);
      const initialStyles = window.getComputedStyle(container.firstChild);

      rerender(<ChatPage key="rerender" />);

      const newStyles = window.getComputedStyle(container.firstChild);
      expect(newStyles.backgroundColor).toBe(initialStyles.backgroundColor);
    });
  });
});
