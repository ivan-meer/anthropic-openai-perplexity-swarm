import React, { useState } from 'react';
import styled from 'styled-components';
import AgentInstructions from './AgentInstructions';
import AgentTools from './AgentTools';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.light};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }
`;

const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.light};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  cursor: pointer;
  position: relative;
  opacity: ${({ active }) => active ? 1 : 0.7};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
    transition: ${({ theme }) => theme.effects.transitions.default};
  }

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.light};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.light};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.shadows.input};
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.light};
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.shadows.input};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button`
  background: ${({ variant, theme }) => 
    variant === 'primary' 
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${({ theme }) => theme.colors.light};
  border: none;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.effects.shadows.button};
  }
`;

function AgentSettings({ agent, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    name: agent.name,
    platform: agent.platform,
    temperature: 0.7,
    maxTokens: 1000,
    model: 'gpt-4',
    instructions: {},
    tools: []
  });

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleInstructionsSave = (instructions) => {
    setSettings({
      ...settings,
      instructions
    });
  };

  const handleToolsSave = (tools) => {
    setSettings({
      ...settings,
      tools
    });
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Настройки агента: {agent.name}</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        <TabList>
          <Tab 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
          >
            Общие
          </Tab>
          <Tab 
            active={activeTab === 'instructions'} 
            onClick={() => setActiveTab('instructions')}
          >
            Инструкции
          </Tab>
          <Tab 
            active={activeTab === 'tools'} 
            onClick={() => setActiveTab('tools')}
          >
            Инструменты
          </Tab>
        </TabList>

        {activeTab === 'general' && (
          <>
            <FormGroup>
              <Label>Название</Label>
              <Input
                type="text"
                value={settings.name}
                onChange={e => setSettings({ ...settings, name: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Платформа</Label>
              <Select
                value={settings.platform}
                onChange={e => setSettings({ ...settings, platform: e.target.value })}
              >
                <option value="OpenAI + Claude">OpenAI + Claude</option>
                <option value="Perplexity AI">Perplexity AI</option>
                <option value="Gemini">Gemini</option>
                <option value="Crew AI">Crew AI</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Модель</Label>
              <Select
                value={settings.model}
                onChange={e => setSettings({ ...settings, model: e.target.value })}
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-2">Claude 2</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Temperature ({settings.temperature})</Label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={settings.maxTokens}
                onChange={e => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                min="1"
                max="4096"
              />
            </FormGroup>
          </>
        )}

        {activeTab === 'instructions' && (
          <AgentInstructions onSave={handleInstructionsSave} />
        )}

        {activeTab === 'tools' && (
          <AgentTools onSave={handleToolsSave} />
        )}

        <ButtonGroup>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="primary" onClick={handleSave}>Сохранить</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}

export default AgentSettings;
