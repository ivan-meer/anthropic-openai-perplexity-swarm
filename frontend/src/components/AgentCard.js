import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import AgentSettings from './AgentSettings';
import AgentLogs from './AgentLogs';
import { useToast } from '../contexts/ToastContext';

const glow = keyframes`
  from {
    box-shadow: 0 0 5px ${props => props.theme.colors.primary},
                0 0 10px ${props => props.theme.colors.primary},
                0 0 15px ${props => props.theme.colors.primary};
  }
  to {
    box-shadow: 0 0 10px ${props => props.theme.colors.primary},
                0 0 20px ${props => props.theme.colors.primary},
                0 0 30px ${props => props.theme.colors.primary};
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBg};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borders.radius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.spacing.xl};
  transition: ${props => props.theme.effects.transitions.default};
  animation: ${props => props.theme.effects.animations.fadeIn};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.effects.shadows.card};
    border-color: ${props => props.theme.colors.primaryLight};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.h3};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryLight} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borders.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.effects.transitions.default};
  color: ${props => props.theme.colors.light};

  &:hover {
    background: ${props => props.theme.colors.primary};
    transform: scale(1.1);
    box-shadow: ${props => props.theme.effects.shadows.button};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledLink = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borders.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.effects.transitions.default};
  color: ${props => props.theme.colors.light};

  &:hover {
    background: ${props => props.theme.colors.primary};
    transform: scale(1.1);
    box-shadow: ${props => props.theme.effects.shadows.button};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Platform = styled.p`
  color: ${props => props.theme.colors.light};
  opacity: 0.8;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Functions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FunctionBadge = styled.span`
  background: ${props => props.theme.colors.badgeBg};
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: ${props => props.theme.components.badge.padding};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.fontSize.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.primaryLight};
  transition: ${props => props.theme.effects.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.effects.shadows.button};
    background: rgba(37, 99, 235, 0.2);
  }
`;

const StatusIndicator = styled.div`
  width: ${props => props.theme.components.status.size};
  height: ${props => props.theme.components.status.size};
  border-radius: ${props => props.theme.borders.radius.full};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'initialized': return theme.colors.primary;
      case 'running': return theme.colors.success;
      case 'error': return theme.colors.danger;
      default: return theme.colors.secondary;
    }
  }};
  animation: ${({ status }) => status === 'initialized' ? glow : 'none'} 1.5s ease-in-out infinite alternate;
`;

const TaskInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.md};
  color: ${props => props.theme.colors.light};
  transition: ${props => props.theme.effects.transitions.default};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.effects.shadows.status};
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryLight} 100%);
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.effects.transitions.default};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.effects.shadows.button};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borders.radius.md};
  padding: ${props => props.theme.spacing.md};
  overflow: hidden;

  pre {
    margin: 0;
    font-family: ${props => props.theme.typography.fontFamily.mono};
    font-size: ${props => props.theme.typography.fontSize.small};
    color: ${props => props.theme.colors.light};
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

function AgentCard({ agent, onRemove }) {
  const [isRunning, setIsRunning] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [result, setResult] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const toast = useToast();

  const runTask = async () => {
    if (!taskInput.trim()) return;

    try {
      setIsRunning(true);
      const response = await fetch(`/api/v1/agents/${agent.name}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'generate',
          prompt: taskInput
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run task');
      }

      const data = await response.json();
      setResult(data);
      toast.showSuccess('Задача успешно выполнена');
    } catch (err) {
      console.error('Error running task:', err);
      toast.showError('Не удалось выполнить задачу');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSettingsSave = async (settings) => {
    try {
      const response = await fetch(`/api/v1/agents/${agent.name}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.showSuccess('Настройки успешно сохранены');
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.showError('Не удалось сохранить настройки');
    }
  };

  const handleRemove = () => {
    try {
      onRemove();
      toast.showSuccess('Агент успешно удален');
    } catch (err) {
      toast.showError('Не удалось удалить агента');
    }
  };

  return (
    <Card>
      <CardHeader>
        <Title>{agent.name}</Title>
        <Controls>
          <StyledLink to={`/agents/${agent.name}/logs`} title="Логи">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </StyledLink>
          <IconButton 
            onClick={() => setShowSettings(true)} 
            title="Редактировать"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </IconButton>
          <IconButton 
            onClick={handleRemove} 
            disabled={isRunning} 
            title="Удалить"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </IconButton>
          <StatusIndicator status={agent.status.status} />
        </Controls>
      </CardHeader>

      <Platform>{agent.platform}</Platform>

      <Functions>
        {agent.functions.map((func) => (
          <FunctionBadge key={func}>
            {func}
          </FunctionBadge>
        ))}
      </Functions>

      <TaskInput>
        <Input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Введите задачу..."
          disabled={isRunning}
        />
        <Button 
          onClick={runTask} 
          disabled={isRunning || !taskInput.trim()}
        >
          {isRunning ? 'Выполняется...' : 'Выполнить'}
        </Button>
      </TaskInput>

      {result && (
        <ResultContainer>
          <pre>
            {JSON.stringify(result, null, 2)}
          </pre>
        </ResultContainer>
      )}

      {showSettings && (
        <AgentSettings
          agent={agent}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
    </Card>
  );
}

export default AgentCard;
