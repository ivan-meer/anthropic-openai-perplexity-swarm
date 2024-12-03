import React from 'react';
import styled from 'styled-components';

const CommandPalette = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.effects.shadows.card};
  max-height: 200px;
  overflow-y: auto;
  display: ${({ show }) => show ? 'block' : 'none'};
  z-index: ${({ theme }) => theme.zIndices.dropdown};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.borders.radius.full};
  }
`;

const CommandItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.light};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  span:first-child {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    min-width: 24px;
  }

  span:last-child {
    margin-left: auto;
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const defaultCommands = [
  { icon: '🔄', text: '/reset', description: 'Очистить историю чата' },
  { icon: '⚙️', text: '/settings', description: 'Открыть настройки агента' },
  { icon: '📝', text: '/help', description: 'Показать справку' },
  { icon: '💾', text: '/export', description: 'Экспортировать историю чата' },
  { icon: '🔄', text: '/newsession', description: 'Начать новую сессию' },
  { icon: '📊', text: '/stats', description: 'Показать статистику' }
];

function ChatCommands({ 
  show, 
  inputValue, 
  commands = defaultCommands,
  onCommandSelect 
}) {
  const filteredCommands = commands.filter(cmd => 
    cmd.text.startsWith(inputValue.toLowerCase())
  );

  return (
    <CommandPalette show={show}>
      {filteredCommands.map((cmd, index) => (
        <CommandItem 
          key={index}
          onClick={() => onCommandSelect(cmd.text)}
        >
          <span>{cmd.icon}</span>
          <span>{cmd.text}</span>
          <span style={{ opacity: 0.7 }}>- {cmd.description}</span>
        </CommandItem>
      ))}
    </CommandPalette>
  );
}

export { ChatCommands, defaultCommands };
