import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: calc(${({ theme }) => theme.spacing['2xl']} + 80px);
  right: ${({ theme }) => theme.spacing.xl};
  width: 300px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  box-shadow: ${({ theme }) => theme.effects.shadows.card};
  overflow: hidden;
  transition: ${({ theme }) => theme.effects.transitions.default};
  transform: translateX(${({ isVisible }) => isVisible ? '0' : 'calc(100% + 20px)'});
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  opacity: 0.7;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    opacity: 1;
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const HintsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HintItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.8;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    opacity: 1;
  }
`;

const HintIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const ToggleButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xl};
  bottom: calc(${({ theme }) => theme.spacing['2xl']} + 90px);
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.light};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};
  box-shadow: ${({ theme }) => theme.effects.shadows.button};
  transform: translateX(${({ isVisible }) => isVisible ? '-320px' : '0'});

  &:hover {
    transform: translateX(${({ isVisible }) => isVisible ? '-320px' : '0'}) scale(1.1);
  }
`;

const hints = [
  {
    icon: '💬',
    text: 'Используйте Enter для отправки сообщения, Shift+Enter для переноса строки'
  },
  {
    icon: '⚡',
    text: 'Для быстрого доступа к настройкам агента нажмите на его аватар'
  },
  {
    icon: '📝',
    text: 'Агент может помочь с различными задачами: анализом, написанием текста, кода и др.'
  },
  {
    icon: '🔄',
    text: 'Если ответ не полный или требует уточнения, просто спросите агента об этом'
  },
  {
    icon: '⚙️',
    text: 'В настройках можно изменить параметры агента под ваши задачи'
  }
];

function ChatHints() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Container isVisible={isVisible}>
        <Header>
          <Title>Подсказки</Title>
          <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
        </Header>
        <Content>
          <HintsList>
            {hints.map((hint, index) => (
              <HintItem key={index}>
                <HintIcon>{hint.icon}</HintIcon>
                {hint.text}
              </HintItem>
            ))}
          </HintsList>
        </Content>
      </Container>
      <ToggleButton 
        isVisible={isVisible}
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Скрыть подсказки' : 'Показать подсказки'}
      >
        {isVisible ? '📝' : '❔'}
      </ToggleButton>
    </>
  );
}

export default ChatHints;
