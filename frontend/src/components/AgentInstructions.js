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

const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const EditorContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.light};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.light};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  resize: vertical;
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

const defaultInstructions = {
  system: `Вы - AI-ассистент, специализирующийся на создании контента.
При создании контента следуйте следующим правилам:
1. Используйте ясный и понятный язык
2. Соблюдайте SEO-оптимизацию
3. Форматируйте текст для удобства чтения`,
  content: `При создании контента:
- Исследуйте тему
- Структурируйте информацию
- Добавляйте примеры
- Проверяйте факты`,
  seo: `SEO-требования:
- Используйте ключевые слова
- Оптимизируйте заголовки
- Добавляйте мета-описания
- Структурируйте контент`,
  formatting: `Правила форматирования:
- Используйте заголовки
- Разбивайте текст на абзацы
- Добавляйте списки
- Выделяйте важное`
};

function AgentInstructions({ onSave }) {
  const [activeTab, setActiveTab] = useState('system');
  const [instructions, setInstructions] = useState(defaultInstructions);

  const handleSave = () => {
    onSave(instructions);
  };

  return (
    <Container>
      <Title>Системные инструкции</Title>
      
      <TabList>
        <Tab 
          active={activeTab === 'system'} 
          onClick={() => setActiveTab('system')}
        >
          Системный промпт
        </Tab>
        <Tab 
          active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          Создание контента
        </Tab>
        <Tab 
          active={activeTab === 'seo'} 
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </Tab>
        <Tab 
          active={activeTab === 'formatting'} 
          onClick={() => setActiveTab('formatting')}
        >
          Форматирование
        </Tab>
      </TabList>

      <EditorContainer>
        <Label>Инструкции</Label>
        <TextArea
          value={instructions[activeTab]}
          onChange={(e) => setInstructions({
            ...instructions,
            [activeTab]: e.target.value
          })}
          placeholder="Введите инструкции..."
        />
      </EditorContainer>

      <ButtonGroup>
        <Button onClick={() => setInstructions(defaultInstructions)}>
          Сбросить
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </ButtonGroup>
    </Container>
  );
}

export default AgentInstructions;
