import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';
import {
  ChatContainer,
  Header,
  Title,
  MessagesContainer,
  StatsContainer
} from '../styles';
import { mockTheme } from './__mocks__/mockData';
import { renderWithTheme } from './testUtils';

describe('ChatPage Styles', () => {
  describe('ChatContainer', () => {
    it('renders with correct styles', () => {
      const { container } = renderWithTheme(<ChatContainer />);
      const element = container.firstChild;

      expect(element).toHaveStyleRule('display', 'flex');
      expect(element).toHaveStyleRule('flex-direction', 'column');
      expect(element).toHaveStyleRule('height', `calc(100vh - ${mockTheme.spacing['2xl']})`);
      expect(element).toHaveStyleRule('padding', mockTheme.spacing.xl);
      expect(element).toHaveStyleRule('background', mockTheme.colors.background);
      expect(element).toHaveStyleRule('gap', mockTheme.spacing.md);
    });
  });

  describe('Header', () => {
    it('renders with correct styles', () => {
      const { container } = renderWithTheme(<Header />);
      const element = container.firstChild;

      expect(element).toHaveStyleRule('display', 'flex');
      expect(element).toHaveStyleRule('align-items', 'center');
      expect(element).toHaveStyleRule('justify-content', 'space-between');
      expect(element).toHaveStyleRule('padding', mockTheme.spacing.md);
      expect(element).toHaveStyleRule('background', mockTheme.colors.cardBg);
      expect(element).toHaveStyleRule('border-radius', mockTheme.borders.radius.lg);
      expect(element).toHaveStyleRule('box-shadow', mockTheme.effects.shadows.card);
    });
  });

  describe('Title', () => {
    it('renders with correct styles', () => {
      const { container } = renderWithTheme(<Title />);
      const element = container.firstChild;

      expect(element).toHaveStyleRule('color', mockTheme.colors.light);
      expect(element).toHaveStyleRule('font-size', mockTheme.typography.fontSize.h2);
      expect(element).toHaveStyleRule('font-weight', mockTheme.typography.fontWeight.bold);
      expect(element).toHaveStyleRule('margin', '0');
      expect(element).toHaveStyleRule(
        'background',
        `linear-gradient(135deg, ${mockTheme.colors.primary}, ${mockTheme.colors.primaryLight})`
      );
      expect(element).toHaveStyleRule('-webkit-background-clip', 'text');
      expect(element).toHaveStyleRule('-webkit-text-fill-color', 'transparent');
      expect(element).toHaveStyleRule('text-shadow', mockTheme.effects.shadows.text);
    });
  });

  describe('MessagesContainer', () => {
    it('renders with correct styles', () => {
      const { container } = renderWithTheme(<MessagesContainer />);
      const element = container.firstChild;

      expect(element).toHaveStyleRule('flex', '1');
      expect(element).toHaveStyleRule('overflow-y', 'auto');
      expect(element).toHaveStyleRule('padding', mockTheme.spacing.md);
      expect(element).toHaveStyleRule('background', mockTheme.colors.cardBg);
      expect(element).toHaveStyleRule('border-radius', mockTheme.borders.radius.lg);
      expect(element).toHaveStyleRule('box-shadow', mockTheme.effects.shadows.card);
      expect(element).toHaveStyleRule('display', 'flex');
      expect(element).toHaveStyleRule('flex-direction', 'column');
      expect(element).toHaveStyleRule('gap', mockTheme.spacing.sm);
    });

    it('renders scrollbar with correct styles', () => {
      const { container } = renderWithTheme(<MessagesContainer />);
      const element = container.firstChild;

      expect(element).toHaveStyleRule('width', '8px', {
        modifier: '::-webkit-scrollbar'
      });

      expect(element).toHaveStyleRule('background', 'rgba(255, 255, 255, 0.1)', {
        modifier: '::-webkit-scrollbar-track'
      });

      expect(element).toHaveStyleRule('background', mockTheme.colors.primaryLight, {
        modifier: '::-webkit-scrollbar-thumb'
      });

      expect(element).toHaveStyleRule('background', mockTheme.colors.primary, {
        modifier: '::-webkit-scrollbar-thumb:hover'
      });
    });
  });

  describe('StatsContainer', () => {
    it('renders with correct styles', () => {
      const { container } = renderWithTheme(<StatsContainer />);
      const element = container.firstChild;

      expect(element).toHaveStyleRule('display', 'flex');
      expect(element).toHaveStyleRule('gap', mockTheme.spacing.md);
      expect(element).toHaveStyleRule('flex-wrap', 'wrap');
    });
  });

  describe('Responsive styles', () => {
    it('ChatContainer adjusts height on different screen sizes', () => {
      const { container, rerender } = renderWithTheme(<ChatContainer />);
      
      // Мокируем разные размеры экрана
      global.innerHeight = 1080;
      rerender(<ChatContainer />);
      expect(container.firstChild).toHaveStyleRule('height', `calc(100vh - ${mockTheme.spacing['2xl']})`);

      global.innerHeight = 720;
      rerender(<ChatContainer />);
      expect(container.firstChild).toHaveStyleRule('height', `calc(100vh - ${mockTheme.spacing['2xl']})`);
    });

    it('MessagesContainer maintains scrollability', () => {
      const { container } = renderWithTheme(<MessagesContainer />);
      expect(container.firstChild).toHaveStyleRule('overflow-y', 'auto');
    });

    it('StatsContainer wraps items on small screens', () => {
      const { container } = renderWithTheme(<StatsContainer />);
      expect(container.firstChild).toHaveStyleRule('flex-wrap', 'wrap');
    });
  });

  describe('Theme integration', () => {
    it('applies theme colors correctly', () => {
      const customTheme = {
        ...mockTheme,
        colors: {
          ...mockTheme.colors,
          primary: '#custom-primary',
          cardBg: '#custom-card-bg'
        }
      };

      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <Header />
        </ThemeProvider>
      );

      expect(container.firstChild).toHaveStyleRule('background', '#custom-card-bg');
    });

    it('applies theme spacing correctly', () => {
      const customTheme = {
        ...mockTheme,
        spacing: {
          ...mockTheme.spacing,
          md: '20px'
        }
      };

      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <StatsContainer />
        </ThemeProvider>
      );

      expect(container.firstChild).toHaveStyleRule('gap', '20px');
    });

    it('applies theme typography correctly', () => {
      const customTheme = {
        ...mockTheme,
        typography: {
          ...mockTheme.typography,
          fontSize: {
            ...mockTheme.typography.fontSize,
            h2: '24px'
          }
        }
      };

      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <Title />
        </ThemeProvider>
      );

      expect(container.firstChild).toHaveStyleRule('font-size', '24px');
    });
  });
});
