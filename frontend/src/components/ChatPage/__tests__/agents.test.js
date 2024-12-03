import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from './testUtils';
import ChatPage from '../index';
import { mockAgent, mockMessages } from './__mocks__/mockData';

describe('ChatPage Agents', () => {
  describe('Agent Initialization', () => {
    it('initializes with default agent', () => {
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const agentInfo = getByTestId('agent-info');

      expect(agentInfo).toHaveTextContent(/GPT Assistant/);
      expect(agentInfo).toHaveTextContent(/General Purpose AI/);
    });

    it('accepts custom initial agent', () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );
      const agentInfo = getByTestId('agent-info');

      expect(agentInfo).toHaveTextContent(mockAgent.name);
      expect(agentInfo).toHaveTextContent(mockAgent.role);
    });

    it('loads agent settings from storage', () => {
      localStorage.setItem('agentSettings', JSON.stringify(mockAgent));
      
      const { getByTestId } = renderWithTheme(<ChatPage />);
      const agentInfo = getByTestId('agent-info');

      expect(agentInfo).toHaveTextContent(mockAgent.name);
    });
  });

  describe('Agent Settings', () => {
    it('updates agent settings', async () => {
      const { getByText, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText(/настройки/i));
      
      const nameInput = getByLabelText(/имя агента/i);
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      
      fireEvent.click(getByText(/сохранить/i));

      await waitFor(() => {
        expect(getByText('New Name')).toBeInTheDocument();
      });
    });

    it('validates agent settings', async () => {
      const { getByText, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText(/настройки/i));
      
      const nameInput = getByLabelText(/имя агента/i);
      fireEvent.change(nameInput, { target: { value: '' } });
      
      fireEvent.click(getByText(/сохранить/i));

      await waitFor(() => {
        expect(getByText(/имя агента обязательно/i)).toBeInTheDocument();
      });
    });

    it('persists agent settings', async () => {
      const { getByText, getByLabelText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByText(/настройки/i));
      
      const nameInput = getByLabelText(/имя агента/i);
      fireEvent.change(nameInput, { target: { value: 'Persistent Name' } });
      
      fireEvent.click(getByText(/сохранить/i));

      await waitFor(() => {
        const savedSettings = JSON.parse(localStorage.getItem('agentSettings'));
        expect(savedSettings.name).toBe('Persistent Name');
      });
    });
  });

  describe('Agent Switching', () => {
    it('switches between agents', async () => {
      const agents = [
        { id: '1', name: 'Agent 1', role: 'Role 1' },
        { id: '2', name: 'Agent 2', role: 'Role 2' }
      ];

      const { getByText, getByTestId } = renderWithTheme(
        <ChatPage availableAgents={agents} />
      );
      
      fireEvent.click(getByTestId('agent-selector'));
      fireEvent.click(getByText('Agent 2'));

      await waitFor(() => {
        expect(getByTestId('agent-info')).toHaveTextContent('Agent 2');
      });
    });

    it('maintains conversation context when switching', async () => {
      const agents = [
        { id: '1', name: 'Agent 1', role: 'Role 1' },
        { id: '2', name: 'Agent 2', role: 'Role 2' }
      ];

      const { getByTestId, getAllByTestId } = renderWithTheme(
        <ChatPage 
          availableAgents={agents}
          initialMessages={mockMessages}
        />
      );

      const initialMessageCount = getAllByTestId('chat-message').length;
      
      fireEvent.click(getByTestId('agent-selector'));
      fireEvent.click(getByTestId('agent-option-2'));

      expect(getAllByTestId('chat-message')).toHaveLength(initialMessageCount);
    });

    it('shows agent switching confirmation', async () => {
      const agents = [
        { id: '1', name: 'Agent 1', role: 'Role 1' },
        { id: '2', name: 'Agent 2', role: 'Role 2' }
      ];

      const { getByTestId, getByText } = renderWithTheme(
        <ChatPage availableAgents={agents} />
      );
      
      fireEvent.click(getByTestId('agent-selector'));
      fireEvent.click(getByText('Agent 2'));

      await waitFor(() => {
        expect(getByText(/сменить агента/i)).toBeInTheDocument();
        expect(getByText(/текущий диалог будет сохранен/i)).toBeInTheDocument();
      });
    });
  });

  describe('Agent Capabilities', () => {
    it('shows agent capabilities', async () => {
      const agent = {
        ...mockAgent,
        capabilities: ['translation', 'code-review', 'writing']
      };

      const { getByTestId, getAllByTestId } = renderWithTheme(
        <ChatPage initialAgent={agent} />
      );
      
      fireEvent.click(getByTestId('show-capabilities'));

      const capabilities = getAllByTestId('agent-capability');
      expect(capabilities).toHaveLength(3);
    });

    it('filters commands by agent capabilities', async () => {
      const agent = {
        ...mockAgent,
        capabilities: ['translation']
      };

      const { getByRole, queryByText } = renderWithTheme(
        <ChatPage initialAgent={agent} />
      );
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/' } });

      await waitFor(() => {
        expect(queryByText('/code-review')).toBeNull();
      });
    });
  });

  describe('Agent Performance', () => {
    it('tracks agent response times', async () => {
      const { getByRole, getByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const stats = getByTestId('agent-stats');
        expect(stats).toHaveTextContent(/среднее время ответа/i);
      });
    });

    it('shows agent performance metrics', async () => {
      const { getByTestId } = renderWithTheme(
        <ChatPage initialAgent={mockAgent} />
      );
      
      fireEvent.click(getByTestId('show-metrics'));

      await waitFor(() => {
        expect(getByTestId('performance-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Agent Instructions', () => {
    it('shows agent instructions', async () => {
      const agent = {
        ...mockAgent,
        instructions: 'Custom instructions for testing'
      };

      const { getByTestId } = renderWithTheme(
        <ChatPage initialAgent={agent} />
      );
      
      fireEvent.click(getByTestId('show-instructions'));

      await waitFor(() => {
        expect(getByTestId('agent-instructions')).toHaveTextContent(agent.instructions);
      });
    });

    it('updates agent instructions', async () => {
      const { getByTestId, getByLabelText, getByText } = renderWithTheme(<ChatPage />);
      
      fireEvent.click(getByTestId('show-instructions'));
      fireEvent.click(getByText(/редактировать/i));

      const input = getByLabelText(/инструкции/i);
      fireEvent.change(input, { target: { value: 'New instructions' } });
      fireEvent.click(getByText(/сохранить/i));

      await waitFor(() => {
        expect(getByTestId('agent-instructions')).toHaveTextContent('New instructions');
      });
    });
  });

  describe('Agent Memory', () => {
    it('maintains conversation memory', async () => {
      const { getByRole, getAllByTestId } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Отправляем сообщение с контекстом
      fireEvent.change(input, { target: { value: 'My name is Test User' } });
      fireEvent.submit(input.closest('form'));

      // Отправляем сообщение с отсылкой к предыдущему контексту
      fireEvent.change(input, { target: { value: 'What is my name?' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        const messages = getAllByTestId('chat-message');
        expect(messages[messages.length - 1]).toHaveTextContent(/Test User/i);
      });
    });

    it('clears agent memory', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: '/clear-memory' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/память агента очищена/i)).toBeInTheDocument();
      });
    });
  });

  describe('Agent Error Handling', () => {
    it('handles agent initialization errors', async () => {
      const invalidAgent = {
        ...mockAgent,
        id: 'invalid-id'
      };

      const { getByText } = renderWithTheme(
        <ChatPage initialAgent={invalidAgent} />
      );

      await waitFor(() => {
        expect(getByText(/ошибка инициализации агента/i)).toBeInTheDocument();
      });
    });

    it('handles agent response errors', async () => {
      const { getByRole, getByText } = renderWithTheme(<ChatPage />);
      const input = getByRole('textbox');

      // Симулируем ошибку ответа агента
      global.fetch = jest.fn(() => Promise.reject(new Error('Agent error')));

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(getByText(/ошибка получения ответа/i)).toBeInTheDocument();
      });
    });
  });
});
