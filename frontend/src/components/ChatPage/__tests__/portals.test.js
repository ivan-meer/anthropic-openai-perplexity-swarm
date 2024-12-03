import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';
import { createPortal } from 'react-dom';

// Мок для react-dom createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn((element, node) => element)
}));

describe('ChatPage Portals', () => {
  describe('Modal Portals', () => {
    it('renders settings modal in portal', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));

      await waitFor(() => {
        expect(createPortal).toHaveBeenCalledWith(
          expect.any(Object),
          document.body
        );
        expect(getByTestId('settings-modal')).toBeInTheDocument();
      });
    });

    it('renders confirm dialog in portal', async () => {
      const { getAllByTestId, getByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const deleteButton = getAllByTestId('delete-message')[0];

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(createPortal).toHaveBeenCalledWith(
          expect.any(Object),
          document.body
        );
        expect(getByTestId('confirm-dialog')).toBeInTheDocument();
      });
    });

    it('renders toast notifications in portal', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(createPortal).toHaveBeenCalledWith(
          expect.any(Object),
          document.body
        );
        expect(getByTestId('toast')).toBeInTheDocument();
      });
    });
  });

  describe('Portal Cleanup', () => {
    it('removes modal portal on close', async () => {
      const { getByRole, queryByTestId } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const closeButton = getByRole('button', { name: /закрыть/i });
      
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(queryByTestId('settings-modal')).not.toBeInTheDocument();
      });
    });

    it('removes confirm dialog portal on cancel', async () => {
      const { getAllByTestId, getByRole, queryByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      const deleteButton = getAllByTestId('delete-message')[0];

      fireEvent.click(deleteButton);
      const cancelButton = getByRole('button', { name: /отмена/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(queryByTestId('confirm-dialog')).not.toBeInTheDocument();
      });
    });

    it('removes toast portal after timeout', async () => {
      jest.useFakeTimers();
      
      const { getByRole, queryByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(queryByTestId('toast')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Portal Stacking', () => {
    it('handles multiple portals', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      
      // Открываем настройки
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      
      // Открываем диалог подтверждения
      const deleteButton = getAllByTestId('delete-message')[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
      });
    });

    it('maintains correct z-index order', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(
        <ChatPage initialMessages={mockMessages} />
      );
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const deleteButton = getAllByTestId('delete-message')[0];
      fireEvent.click(deleteButton);

      const [settingsModal, confirmDialog] = document.querySelectorAll('[role="dialog"]');
      
      expect(Number(getComputedStyle(confirmDialog).zIndex))
        .toBeGreaterThan(Number(getComputedStyle(settingsModal).zIndex));
    });
  });

  describe('Portal Focus Management', () => {
    it('traps focus within modal portal', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const modal = getByRole('dialog');
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // Проверяем, что фокус остается внутри модального окна
      fireEvent.keyDown(focusableElements[focusableElements.length - 1], {
        key: 'Tab'
      });
      expect(document.activeElement).toBe(focusableElements[0]);
    });

    it('restores focus after portal closes', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const settingsButton = getByRole('button', { name: /настройки/i });
      
      fireEvent.click(settingsButton);
      const closeButton = getByRole('button', { name: /закрыть/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(document.activeElement).toBe(settingsButton);
      });
    });
  });

  describe('Portal Accessibility', () => {
    it('sets correct ARIA attributes on modal portal', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const modal = getByRole('dialog');

      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', expect.any(String));
    });

    it('handles escape key in portal', async () => {
      const { getByRole, queryByRole } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });

      await waitFor(() => {
        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Portal Events', () => {
    it('prevents event bubbling from portal', async () => {
      const handleClick = jest.fn();
      document.addEventListener('click', handleClick);

      const { getByRole } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      const modal = getByRole('dialog');
      fireEvent.click(modal);

      expect(handleClick).not.toHaveBeenCalled();

      document.removeEventListener('click', handleClick);
    });

    it('handles portal click outside', async () => {
      const { getByRole, queryByRole } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByRole('button', { name: /настройки/i }));
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
