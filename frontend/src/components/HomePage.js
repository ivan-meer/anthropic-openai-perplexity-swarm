import React, { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import AddAgentModal from './AddAgentModal';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import { useToast } from '../contexts/ToastContext';
import { mockAgents } from '../mocks/agents';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

import {
  Header,
  Logo,
  Title,
  Subtitle,
  Main,
  Section,
  SectionHeader,
  SectionTitle,
  AddButton,
  AgentsGrid,
} from './styledComponents';

function HomePage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Имитация загрузки данных с API с прогрессом
    const loadData = async () => {
      try {
        // Имитация поэтапной загрузки
        setLoadingProgress(20);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoadingProgress(50);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoadingProgress(80);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAgents(mockAgents);
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load agents');
        setLoading(false);
        toast.showError('Не удалось загрузить список агентов');
      }
    };

    loadData();
  }, [toast]);

  const handleAddAgent = (newAgent) => {
    try {
      setAgents([...agents, newAgent]);
      setShowAddModal(false);
      toast.showSuccess('Агент успешно добавлен');
    } catch (err) {
      toast.showError('Не удалось добавить агента');
    }
  };

  const handleRemoveAgent = (agentName) => {
    setAgentToDelete(agentName);
  };

  const confirmRemoveAgent = () => {
    try {
      setAgents(agents.filter(agent => agent.name !== agentToDelete));
      setAgentToDelete(null);
      toast.showSuccess('Агент успешно удален');
    } catch (err) {
      toast.showError('Не удалось удалить агента');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner 
        text="Загрузка агентов..." 
        fullScreen 
        progress={loadingProgress}
      />
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <Header>
        <Logo src="/static/assets/img/logo-bw.png" alt="Логотип Phuket.guru" />
        <Title>SWARM AI FRAMEWORK</Title>
        <Subtitle>Интеллектуальная система управления туристическим контентом</Subtitle>
      </Header>

      <Main>
        <Section>
          <SectionHeader>
            <SectionTitle>AI-агенты</SectionTitle>
            <AddButton onClick={() => setShowAddModal(true)}>
              {/* Иконка и текст кнопки */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Добавить агента
            </AddButton>
          </SectionHeader>

          {agents.length === 0 ? (
            <EmptyState
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              title="Нет активных агентов"
              description="Создайте своего первого AI-агента для начала работы"
              actionLabel="Добавить агента"
              onAction={() => setShowAddModal(true)}
            />
          ) : (
            <AgentsGrid>
              {agents.map((agent) => (
                <AgentCard
                  key={agent.name}
                  agent={agent}
                  onRemove={() => handleRemoveAgent(agent.name)}
                />
              ))}
            </AgentsGrid>
          )}
        </Section>
      </Main>

      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAgent}
        />
      )}

      {agentToDelete && (
        <ConfirmDialog
          title="Удаление агента"
          message={`Вы уверены, что хотите удалить агента "${agentToDelete}"?`}
          onConfirm={confirmRemoveAgent}
          onCancel={() => setAgentToDelete(null)}
        />
      )}
    </>
  );
}

export default HomePage;
