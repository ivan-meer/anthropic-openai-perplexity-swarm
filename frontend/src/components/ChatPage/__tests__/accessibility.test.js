import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

expect.extend(toHaveNoViolations);

describe('ChatPage Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ARIA Roles and Labels', () => {
    it('has correct ARIA roles', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);

      expect(getByRole('main')).toBeInTheDocument();
      expect(getByRole('complementary')).toBeInTheDocument();
      expect(getByRole('textbox')).toBeInTheDocument();
      expect(getByRole('button', { name: /отправить/i })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);

      const mainHeading = getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Чат с AI-агентами');

      const subHeadings = document.querySelectorAll('h2, h3, h4, h5, h6');
      subHeadings.forEach(heading => {
        expect(heading).toBeVisible();
      });
    });

    it('has proper form labeling', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);

      const input = getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Сообщение');
      expect(input).toHaveAttribute('placeholder', 'Введите сообщение... (/ для команд)');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation', () => {
      const { getByRole, getAllByRole } = renderWithTheme(<ChatPage />);

      const focusableElements = getAllByRole('button');
      const input = getByRole('textbox');

      // Проверяем порядок фокуса
      focusableElements.forEach((element, index) => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });

      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it('handles Enter key for form submission', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

      expect(input).toHaveValue('');
    });

    it('supports Escape key to close modals', () => {
      const { getByRole, queryByRole } = renderWithTheme(<ChatPage />);

      const settingsButton = getByRole('button', { name: /настройки/i });
      fireEvent.click(settingsButton);

      const modal = getByRole('dialog');
      fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('maintains focus after message send', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });

    it('traps focus in modals', () => {
      const { getByRole, getAllByRole } = renderWithTheme(<ChatPage />);

      const settingsButton = getByRole('button', { name: /настройки/i });
      fireEvent.click(settingsButton);

      const modal = getByRole('dialog');
      const focusableElements = getAllByRole('button', { hidden: true });

      // Проверяем, что фокус остается внутри модального окна
      focusableElements[focusableElements.length - 1].focus();
      fireEvent.keyDown(modal, { key: 'Tab' });
      expect(document.activeElement).toBe(focusableElements[0]);
    });
  });

  describe('Screen Reader Support', () => {
    it('provides status updates for screen readers', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const status = document.querySelector('[role="status"]');
        expect(status).toHaveTextContent(/сообщение отправлено/i);
      });
    });

    it('announces new messages', () => {
      const { getByText } = renderWithTheme(<ChatPage initialMessages={mockMessages} />);

      mockMessages.forEach(message => {
        const messageElement = getByText(message.text);
        expect(messageElement).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Color Contrast', () => {
    it('has sufficient color contrast', async () => {
      const { container } = renderWithTheme(<ChatPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Responsive Design', () => {
    it('maintains accessibility at different viewport sizes', () => {
      const { container, rerender } = renderWithTheme(<ChatPage />);

      // Мобильный размер
      window.innerWidth = 375;
      window.innerHeight = 667;
      fireEvent(window, new Event('resize'));
      rerender(<ChatPage />);
      expect(container.querySelector('[role="main"]')).toBeVisible();

      // Планшетный размер
      window.innerWidth = 768;
      window.innerHeight = 1024;
      fireEvent(window, new Event('resize'));
      rerender(<ChatPage />);
      expect(container.querySelector('[role="main"]')).toBeVisible();

      // Десктопный размер
      window.innerWidth = 1440;
      window.innerHeight = 900;
      fireEvent(window, new Event('resize'));
      rerender(<ChatPage />);
      expect(container.querySelector('[role="main"]')).toBeVisible();
    });
  });

  describe('Error Handling', () => {
    it('announces errors to screen readers', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем ошибку сети
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const error = document.querySelector('[role="alert"]');
        expect(error).toHaveTextContent(/ошибка/i);
      });
    });
  });

  describe('Motion and Animation', () => {
    it('respects reduced motion preferences', () => {
      const mockMatchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addListener: jest.fn(),
        removeListener: jest.fn()
      }));
      window.matchMedia = mockMatchMedia;

      const { container } = renderWithTheme(<ChatPage />);
      const animatedElements = container.querySelectorAll('[class*="animate"]');

      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.animation).toBe('none');
      });
    });
  });

  describe('Form Validation', () => {
    it('provides accessible validation feedback', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
        const error = document.querySelector('[role="alert"]');
        expect(error).toHaveTextContent(/введите сообщение/i);
      });
    });
  });
});
