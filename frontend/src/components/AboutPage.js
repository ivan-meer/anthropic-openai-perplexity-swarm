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

const TeamSection = styled(Section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TeamMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MemberName = styled.h4`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const MemberRole = styled.p`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.7;
  margin: 0;
`;

function AboutPage() {
  return (
    <Container>
      <Title>О проекте</Title>

      <Section>
        <SectionTitle>SWARM AI FRAMEWORK</SectionTitle>
        <Paragraph>
          SWARM AI FRAMEWORK - это инновационная платформа, 
          предназначенная для управления и взаимодействия с 
          интеллектуальными AI-агентами. 
        </Paragraph>
        <Paragraph>
          Наша миссия - предоставить пользователям простой и 
          интуитивно понятный интерфейс для создания, настройки 
          и управления AI-агентами, которые могут выполнять 
          разнообразные задачи.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>Возможности платформы</SectionTitle>
        <List>
          <ListItem>Создание и настройка AI-агентов</ListItem>
          <ListItem>Управление системными инструкциями и промптами</ListItem>
          <ListItem>Настройка инструментов и функций агентов</ListItem>
          <ListItem>Мониторинг производительности и логов агентов</ListItem>
          <ListItem>Интеграция с различными AI-платформами</ListItem>
        </List>
      </Section>

      <TeamSection>
        <SectionTitle>Наша команда</SectionTitle>
        <TeamMember>
          <Avatar src="/static/assets/img/team/member1.jpg" alt="Имя Фамилия" />
          <MemberName>Имя Фамилия</MemberName>
          <MemberRole>Разработчик</MemberRole>
        </TeamMember>
        <TeamMember>
          <Avatar src="/static/assets/img/team/member2.jpg" alt="Имя Фамилия" />
          <MemberName>Имя Фамилия</MemberName>
          <MemberRole>Дизайнер</MemberRole>
        </TeamMember>
        <TeamMember>
          <Avatar src="/static/assets/img/team/member3.jpg" alt="Имя Фамилия" />
          <MemberName>Имя Фамилия</MemberName>
          <MemberRole>AI-специалист</MemberRole>
        </TeamMember>
      </TeamSection>
    </Container>
  );
}

export default AboutPage;
