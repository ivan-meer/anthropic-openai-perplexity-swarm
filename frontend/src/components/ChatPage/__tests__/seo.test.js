import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockMessages } from './__mocks__/mockData';

describe('ChatPage SEO', () => {
  describe('Meta Tags', () => {
    it('sets correct page title', () => {
      renderWithTheme(<ChatPage />);
      expect(document.title).toBe('Чат с AI-агентами | SWARM');
    });

    it('updates title on new messages', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(document.title).toContain('Новое сообщение');
      });
    });

    it('sets meta description', () => {
      renderWithTheme(<ChatPage />);
      const metaDescription = document.querySelector('meta[name="description"]');
      
      expect(metaDescription).toHaveAttribute(
        'content',
        expect.stringContaining('Интерактивный чат с AI-агентами')
      );
    });

    it('sets meta keywords', () => {
      renderWithTheme(<ChatPage />);
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      
      expect(metaKeywords).toHaveAttribute(
        'content',
        expect.stringContaining('чат, AI, агенты')
      );
    });
  });

  describe('Structured Data', () => {
    it('includes WebPage schema', () => {
      renderWithTheme(<ChatPage />);
      const schema = document.querySelector('script[type="application/ld+json"]');
      const schemaData = JSON.parse(schema.textContent);

      expect(schemaData['@type']).toBe('WebPage');
      expect(schemaData.name).toBe('Чат с AI-агентами');
    });

    it('includes SoftwareApplication schema', () => {
      renderWithTheme(<ChatPage />);
      const schema = document.querySelector('script[type="application/ld+json"]');
      const schemaData = JSON.parse(schema.textContent);

      expect(schemaData.application).toBeDefined();
      expect(schemaData.application['@type']).toBe('SoftwareApplication');
    });

    it('updates schema with conversation data', async () => {
      const { getByRole } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const schema = document.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(schema.textContent);
        expect(schemaData.interactionStatistic).toBeDefined();
      });
    });
  });

  describe('Semantic HTML', () => {
    it('uses semantic elements', () => {
      const { container } = renderWithTheme(<ChatPage />);

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('uses appropriate headings hierarchy', () => {
      const { container } = renderWithTheme(<ChatPage />);
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const levels = Array.from(headings).map(h => parseInt(h.tagName[1]));

      // Проверяем, что уровни заголовков идут последовательно
      levels.forEach((level, i) => {
        if (i > 0) {
          expect(level - levels[i - 1]).toBeLessThanOrEqual(1);
        }
      });
    });

    it('uses semantic roles', () => {
      const { getByRole } = renderWithTheme(<ChatPage />);

                content: 'summary_large_image'
              }
            }),
            expect.objectContaining({
              type: 'meta',
              props: {
                name: 'twitter:title',
                content: expect.any(String)
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Structured Data', () => {
    it('includes WebPage schema', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'script',
              props: {
                type: 'application/ld+json',
                children: expect.stringContaining('"@type":"WebPage"')
              }
            })
          ])
        }),
        {}
      );
    });

    it('includes SoftwareApplication schema', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'script',
              props: {
                type: 'application/ld+json',
                children: expect.stringContaining('"@type":"SoftwareApplication"')
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Dynamic Meta Updates', () => {
    it('updates title when agent changes', () => {
      const { rerender } = renderWithTheme(
        <ChatPage activeAgent={mockAgent} />
      );

      const newAgent = { ...mockAgent, name: 'New Agent' };
      rerender(<ChatPage activeAgent={newAgent} />);

      expect(Helmet).toHaveBeenLastCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'title',
              props: {
                children: expect.stringContaining('New Agent')
              }
            })
          ])
        }),
        {}
      );
    });

    it('updates description based on chat context', () => {
      const { rerender } = renderWithTheme(
        <ChatPage initialMessages={[]} />
      );

      rerender(<ChatPage initialMessages={mockMessages} />);

      expect(Helmet).toHaveBeenLastCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'meta',
              props: {
                name: 'description',
                content: expect.stringContaining(String(mockMessages.length))
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Canonical URLs', () => {
    it('includes canonical link tag', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'link',
              props: {
                rel: 'canonical',
                href: expect.any(String)
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Language Tags', () => {
    it('includes language meta tags', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'html',
              props: {
                lang: 'ru'
              }
            }),
            expect.objectContaining({
              type: 'meta',
              props: {
                property: 'og:locale',
                content: 'ru_RU'
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Robots Meta', () => {
    it('includes appropriate robots meta tags', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'meta',
              props: {
                name: 'robots',
                content: 'index, follow'
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Social Media Preview', () => {
    it('includes preview image meta tags', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'meta',
              props: {
                property: 'og:image',
                content: expect.any(String)
              }
            }),
            expect.objectContaining({
              type: 'meta',
              props: {
                name: 'twitter:image',
                content: expect.any(String)
              }
            })
          ])
        }),
        {}
      );
    });
  });

  describe('Mobile Meta', () => {
    it('includes mobile-specific meta tags', () => {
      renderWithTheme(<ChatPage />);

      expect(Helmet).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'meta',
              props: {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1'
              }
            }),
            expect.objectContaining({
              type: 'meta',
              props: {
                name: 'theme-color',
                content: expect.any(String)
              }
            })
          ])
        }),
        {}
      );
    });
  });
});
