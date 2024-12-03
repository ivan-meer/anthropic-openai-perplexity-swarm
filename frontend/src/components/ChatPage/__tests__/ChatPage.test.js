import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../styles/theme';
import ChatPage from '../index';
import {
  useMessages,
  useSession,
  useStats,
  useAgent,
  useSendMessage,
  useCommands,
  useSettings
} from '../hooks';
import { SYSTEM_MESSAGES, MESSAGE_TYPES, SENDERS } from '../constants';

// Mock хуков
jest.mock('../hooks', () => ({
  useMessages: jest.fn(),
  useSession: jest.fn(),
  useStats: jest.fn(),
  useAgent: jest.fn(),
  useSendMessage: jest.fn(),
  useCommands: jest.fn(),
  useSettings: jest.fn()
}));

// Mock компонентов
jest.mock('../../ActiveAgentInfo', () => ({ agent, onSettingsClick }) => (
  <div data-testid="active-agent-info">
    {agent.name}
    <button onClick={onSettingsClick}>Settings</button>
  </div>
));

jest.mock('../../ChatStats', () => (props) => (
  <div data-testid="chat-stats">
    Messages: {props.messagesCount}
    Tokens: {props.tokensUsed}
  </div>
));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ChatPage', () => {
  const mockMessages = [
    {
      type: SENDERS.SYSTEM,
      text: SYSTEM_MESSAGES.WELCOME('Test Agent'),
      timestamp: new Date(),
      messageType: MESSAGE_TYPES.INFO
    }
  ];

  const mockSession = {
    id: 'test-session',
    startTime: Date.now(),
    tokensUsed: 0,
    responseTimes: []
  };

  const mockStats = {
    messagesCount: 0,
    tokensUsed: 0,
    averageResponseTime: 0,
    sessionDuration: 0,
    trends: {
      messages: 0,
      tokens: 0,
      responseTime: 0
    }
  };

  const mockAgent = {
    name: 'Test Agent',
    role: 'Test Role',
    status: 'active'
  };

  beforeEach(() => {
    useMessages.mockReturnValue({
      messages: mockMessages,
      setMessages: jest.fn(),
      addMessage: jest.fn(),
      addSystemMessage: jest.fn()
    });

    useSession.mockReturnValue({
      session: mockSession,
      updateSession: jest.fn(),
      resetSession: jest.fn()
    });

    useStats.mockReturnValue({
      stats: mockStats
    });

    useAgent.mockReturnValue({
      activeAgent: mockAgent,
      updateAgent: jest.fn()
    });

    useSendMessage.mockReturnValue({
      isLoading: false,
      sendMessage: jest.fn()
    });

    useCommands.mockReturnValue({
      showCommands: false,
      toggleCommands: jest.fn()
    });

    useSettings.mockReturnValue({
      showSettings: false,
      toggleSettings: jest.fn()
    });
  });

  it('renders without crashing', () => {
    renderWithTheme(<ChatPage />);
    expect(screen.getByText('Чат с AI-агентами')).toBeInTheDocument();
  });

  it('displays active agent info', () => {
    renderWithTheme(<ChatPage />);
    expect(screen.getByTestId('active-agent-info')).toBeInTheDocument();
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });

  it('displays chat stats', () => {
    renderWithTheme(<ChatPage />);
    expect(screen.getByTestId('chat-stats')).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    renderWithTheme(<ChatPage />);
    expect(screen.getByText(SYSTEM_MESSAGES.WELCOME('Test Agent'))).toBeInTheDocument();
  });

  it('handles message input', async () => {
    const mockSendMessage = jest.fn();
    useSendMessage.mockReturnValue({
      isLoading: false,
      sendMessage: mockSendMessage
    });

    renderWithTheme(<ChatPage />);
    
    const input = screen.getByPlaceholderText('Введите сообщение... (/ для команд)');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('handles command input', () => {
    const mockToggleCommands = jest.fn();
    useCommands.mockReturnValue({
      showCommands: true,
      toggleCommands: mockToggleCommands
    });

    renderWithTheme(<ChatPage />);
    
    const input = screen.getByPlaceholderText('Введите сообщение... (/ для команд)');
    fireEvent.change(input, { target: { value: '/help' } });

    expect(mockToggleCommands).toHaveBeenCalledWith(true);
  });

  it('handles settings toggle', () => {
    const mockToggleSettings = jest.fn();
    useSettings.mockReturnValue({
      showSettings: false,
      toggleSettings: mockToggleSettings
    });

    renderWithTheme(<ChatPage />);
    
    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    expect(mockToggleSettings).toHaveBeenCalledWith(true);
  });
});

describe('ChatPage Hooks', () => {
  it('useMessages initializes with welcome message', () => {
    const { result } = renderHook(() => useMessages({ name: 'Test Agent' }));
    expect(result.current.messages[0].text).toBe(SYSTEM_MESSAGES.WELCOME('Test Agent'));
  });

  it('useSession initializes with new session', () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.session.id).toBeDefined();
    expect(result.current.session.startTime).toBeDefined();
  });

  it('useStats updates stats periodically', () => {
    const mockMessages = [
      { sender: SENDERS.USER, text: 'test', timestamp: new Date() }
    ];
    const mockSession = {
      tokensUsed: 10,
      responseTimes: [1, 2, 3],
      startTime: Date.now() - 60000
    };

    const { result } = renderHook(() => useStats(mockMessages, mockSession));
    expect(result.current.stats.messagesCount).toBe(1);
    expect(result.current.stats.tokensUsed).toBe(10);
  });

  it('useSendMessage handles message sending', async () => {
    const mockUpdateSession = jest.fn();
    const mockAddMessage = jest.fn();

    const { result } = renderHook(() => useSendMessage(
      { id: 'test', tokensUsed: 0, responseTimes: [] },
      { id: 'agent' },
      mockUpdateSession,
      mockAddMessage
    ));

    await act(async () => {
      await result.current.sendMessage('test message');
    });

    expect(mockAddMessage).toHaveBeenCalled();
    expect(mockUpdateSession).toHaveBeenCalled();
  });
});
