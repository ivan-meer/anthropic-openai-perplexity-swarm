import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const ToolsList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ToolItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ToolIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borders.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ToolInfo = styled.div``;

const ToolName = styled.div`
  color: ${({ theme }) => theme.colors.light};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ToolDescription = styled.div`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.7;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const defaultTools = [
  {
    id: 'execute_command',
    name: 'Execute Command',
    description: 'Выполнение команд в терминале',
    icon: '⌘',
    enabled: true
  },
  {
    id: 'read_file',
    name: 'Read File',
    description: 'Чтение содержимого файлов',
    icon: '📄',
    enabled: true
  },
  {
    id: 'write_file',
    name: 'Write File',
    description: 'Запись в файлы',
    icon: '✏️',
    enabled: true
  },
  {
    id: 'search_files',
    name: 'Search Files',
    description: 'Поиск по файлам',
    icon: '🔍',
    enabled: true
  },
  {
    id: 'browser_action',
    name: 'Browser Action',
    description: 'Управление браузером',
    icon: '🌐',
    enabled: true
  }
];

function AgentTools({ onSave }) {
  const [tools, setTools] = useState(defaultTools);

  const handleToggle = (toolId) => {
    setTools(tools.map(tool => 
      tool.id === toolId 
        ? { ...tool, enabled: !tool.enabled }
        : tool
    ));
  };

  const handleSave = () => {
    onSave(tools);
  };

  return (
    <Container>
      <Title>Инструменты агента</Title>
      <ToolsList>
        {tools.map(tool => (
          <ToolItem key={tool.id}>
            <ToolIcon>{tool.icon}</ToolIcon>
            <ToolInfo>
              <ToolName>{tool.name}</ToolName>
              <ToolDescription>{tool.description}</ToolDescription>
            </ToolInfo>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={tool.enabled}
                onChange={() => handleToggle(tool.id)}
              />
              <Slider />
            </Switch>
          </ToolItem>
        ))}
      </ToolsList>
    </Container>
  );
}

export default AgentTools;
