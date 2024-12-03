import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled.section`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.h2};
`;

const Paragraph = styled.p`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.8;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const List = styled.ul`
  list-style: disc;
  padding-left: ${({ theme }) => theme.spacing.xl};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.8;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.2);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.light};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

function DocsPage() {
  return (
    <Container>
      <Title>Документация</Title>

      <Section>
        <SectionTitle>Введение</SectionTitle>
        <Paragraph>
          SWARM AI FRAMEWORK - это платформа для управления и взаимодействия с AI-агентами. 
          Эта документация поможет вам начать работу с платформой и использовать ее возможности.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Создание агента</SectionTitle>
        <Paragraph>
          Чтобы создать нового агента, нажмите кнопку "Добавить агента" на главной странице. 
          Введите название агента, выберите платформу и нажмите "Добавить".
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Настройка агента</SectionTitle>
        <Paragraph>
          Нажмите на иконку "Редактировать" на карточке агента, чтобы открыть настройки. 
          В настройках вы можете:
        </Paragraph>
        <List>
          <ListItem>Изменить название агента</ListItem>
          <ListItem>Выбрать платформу и модель AI</ListItem>
          <ListItem>Настроить системные инструкции и промпты</ListItem>
          <ListItem>Добавить и настроить инструменты агента</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>Запуск задач</SectionTitle>
        <Paragraph>
          Введите задачу в поле ввода на карточке агента и нажмите "Выполнить". 
          Результат выполнения задачи будет отображен ниже.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Просмотр логов</SectionTitle>
        <Paragraph>
          Нажмите на иконку "Логи" на карточке агента, чтобы открыть страницу с логами. 
          На этой странице вы можете просмотреть историю выполнения задач агента.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>API</SectionTitle>
        <Paragraph>
          Платформа предоставляет API для взаимодействия с агентами. 
          Вы можете использовать API для автоматизации задач и интеграции с другими системами.
        </Paragraph>
        <Paragraph>
          Пример запроса на создание задачи:
        </Paragraph>
        <CodeBlock>
{`POST /api/v1/agents/{agent_name}/tasks
{
  "type": "generate",
  "prompt": "Напишите краткое описание SWARM AI FRAMEWORK"
}`}
        </CodeBlock>
      </Section>
    </Container>
  );
}

export default DocsPage;
