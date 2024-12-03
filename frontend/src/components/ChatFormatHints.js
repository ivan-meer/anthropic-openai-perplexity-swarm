import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: calc(100% + ${({ theme }) => theme.spacing.md});
  right: 0;
  width: 300px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  box-shadow: ${({ theme }) => theme.effects.shadows.card};
  overflow: hidden;
  transform: translateY(${({ show }) => show ? '0' : '10px'});
  opacity: ${({ show }) => show ? '1' : '0'};
  visibility: ${({ show }) => show ? 'visible' : 'hidden'};
  transition: ${({ theme }) => theme.effects.transitions.default};
  z-index: ${({ theme }) => theme.zIndices.tooltip};
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

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const FormatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormatItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const Syntax = styled.code`
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  background: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  white-space: nowrap;
`;

const Description = styled.span`
  opacity: 0.8;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xl};
  bottom: calc(100% + ${({ theme }) => theme.spacing.sm});
  background: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.light};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};
  opacity: 0.7;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const formatHints = [
  {
    syntax: '*текст*',
    description: 'Курсив',
    example: '*важно*'
  },
  {
    syntax: '**текст**',
    description: 'Жирный текст',
    example: '**очень важно**'
  },
  {
    syntax: '```код```',
    description: 'Блок кода',
    example: '```console.log("Hello")```'
  },
  {
    syntax: '`код`',
    description: 'Строка кода',
    example: '`const x = 1`'
  },
  {
    syntax: '> текст',
    description: 'Цитата',
    example: '> Интересная мысль'
  },
  {
    syntax: '- текст',
    description: 'Список',
    example: '- пункт списка'
  }
];

function ChatFormatHints() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Container show={show}>
        <Header>
          <Title>Форматирование</Title>
        </Header>
        <Content>
          <FormatList>
            {formatHints.map((hint, index) => (
              <FormatItem key={index}>
                <Syntax>{hint.syntax}</Syntax>
                <div>
                  <Description>{hint.description}</Description>
                  <div style={{ opacity: 0.6, marginTop: '2px' }}>
                    Пример: {hint.example}
                  </div>
                </div>
              </FormatItem>
            ))}
          </FormatList>
        </Content>
      </Container>
      <ToggleButton 
        onClick={() => setShow(!show)}
        title={show ? 'Скрыть подсказки' : 'Показать подсказки форматирования'}
      >
        {show ? '✕' : 'Aa'}
      </ToggleButton>
    </>
  );
}

export default ChatFormatHints;
