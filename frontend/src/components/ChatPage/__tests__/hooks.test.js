import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useMessages } from '../hooks/useMessages';
import { useAgent } from '../hooks/useAgent';
import { useSession } from '../hooks/useSession';
import { useSettings } from '../hooks/useSettings';
import { useCommands } from '../hooks/useCommands';
import { useNotifications } from '../hooks/useNotifications';
import { useWebSocket } from '../hooks/useWebSocket';
import { mockMessages, mockAgent } from './__mocks__/mockData';

describe('ChatPage Hooks', () => {
  describe('useMessages', () => {
    it('initializes with empty messages', () => {
      const { result } = renderHook(() => useMessages());
      expect(result.current.messages).toEqual([]);
    });

    it('adds new message', () => {
      const { result } = renderHook(() => useMessages());
      const newMessage = {
        text: 'Test message',
        sender: 'user',
        timestamp: new Date()
      };

      act(() => {
        result.current.addMessage(newMessage);
      });

      expect(result.current.messages).toContainEqual(newMessage);
    });

    it('deletes message', () => {
      const { result } = renderHook(() => useMessages({
        initialMessages: mockMessages
      }));
      const messageToDelete = mockMessages[0];

      act(() => {
        result.current.deleteMessage(messageToDelete.id);
      });

      expect(result.current.messages).not.toContainEqual(messageToDelete);
    });

    it('updates message', () => {
      const { result } = renderHook(() => useMessages({
        initialMessages: mockMessages
      }));
      const messageToUpdate = mockMessages[0];
      const updatedText = 'Updated message';

      act(() => {
        result.current.updateMessage(messageToUpdate.id, { text: updatedText });
      });

      expect(result.current.messages[0].text).toBe(updatedText);
    });
  });

  describe('useAgent', () => {
    it('initializes with default agent', () => {
      const { result } = renderHook(() => useAgent());
      expect(result.current.agent).toBeDefined();
    });

    it('updates agent settings', () => {
      const { result } = renderHook(() => useAgent({
        initialAgent: mockAgent
      }));
      const newName = 'Updated Agent';

      act(() => {
        result.current.updateAgent({ name: newName });
      });

      expect(result.current.agent.name).toBe(newName);
    });

    it('switches agent', () => {
      const { result } = renderHook(() => useAgent({
        initialAgent: mockAgent
      }));
      const newAgent = { ...mockAgent, id: '2', name: 'New Agent' };

      act(() => {
        result.current.switchAgent(newAgent);
      });

      expect(result.current.agent).toEqual(newAgent);
    });
  });

  describe('useSession', () => {
    it('creates new session', () => {
      const { result } = renderHook(() => useSession());
      expect(result.current.session.id).toBeDefined();
    });

    it('updates session stats', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.updateStats({
          messagesCount: 1,
          tokensUsed: 100
        });
      });

      expect(result.current.session.stats.messagesCount).toBe(1);
      expect(result.current.session.stats.tokensUsed).toBe(100);
    });

    it('saves session state', () => {
      const { result } = renderHook(() => useSession());

      act(() => {
        result.current.saveSession();
      });

      const savedSession = JSON.parse(sessionStorage.getItem('currentSession'));
      expect(savedSession.id).toBe(result.current.session.id);
    });
  });

  describe('useSettings', () => {
    it('loads saved settings', () => {
      localStorage.setItem('settings', JSON.stringify({
        theme: 'dark',
        notifications: true
      }));

      const { result } = renderHook(() => useSettings());
      expect(result.current.settings.theme).toBe('dark');
      expect(result.current.settings.notifications).toBe(true);
    });

    it('updates settings', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateSettings({
          theme: 'light',
          notifications: false
        });
      });

      expect(result.current.settings.theme).toBe('light');
      expect(result.current.settings.notifications).toBe(false);
    });
  });

  describe('useCommands', () => {
    it('registers custom command', () => {
      const { result } = renderHook(() => useCommands());
      const customCommand = {
        name: 'test',
        description: 'Test command',
        execute: jest.fn()
      };

      act(() => {
        result.current.registerCommand(customCommand);
      });

      expect(result.current.commands).toContainEqual(customCommand);
    });

    it('executes command', async () => {
      const execute = jest.fn();
      const { result } = renderHook(() => useCommands({
        initialCommands: [{
          name: 'test',
          description: 'Test command',
          execute
        }]
      }));

      await act(async () => {
        await result.current.executeCommand('test', ['arg1', 'arg2']);
      });

      expect(execute).toHaveBeenCalledWith(['arg1', 'arg2']);
    });
  });

  describe('useNotifications', () => {
    it('requests permission', async () => {
      const mockRequestPermission = jest.fn().mockResolvedValue('granted');
      global.Notification = {
        requestPermission: mockRequestPermission,
        permission: 'default'
      };

      const { result } = renderHook(() => useNotifications());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(mockRequestPermission).toHaveBeenCalled();
    });

    it('shows notification', () => {
      global.Notification = jest.fn();
      global.Notification.permission = 'granted';

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.showNotification('Test', 'Test message');
      });

      expect(global.Notification).toHaveBeenCalledWith(
        'Test',
        expect.objectContaining({
          body: 'Test message'
        })
      );
    });
  });

  describe('useWebSocket', () => {
    let mockWebSocket;

    beforeEach(() => {
      mockWebSocket = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };
      global.WebSocket = jest.fn(() => mockWebSocket);
    });

    it('connects to websocket', () => {
      const { result } = renderHook(() => useWebSocket('ws://test'));
      expect(global.WebSocket).toHaveBeenCalledWith('ws://test');
    });

    it('sends message', () => {
      const { result } = renderHook(() => useWebSocket('ws://test'));

      act(() => {
        result.current.sendMessage('Test message');
      });

      expect(mockWebSocket.send).toHaveBeenCalledWith('Test message');
    });

    it('handles reconnection', () => {
      const { result } = renderHook(() => useWebSocket('ws://test'));

      act(() => {
        mockWebSocket.onclose();
      });

      expect(global.WebSocket).toHaveBeenCalledTimes(2);
    });
  });
});
