import React, { useState } from 'react';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';

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
  max-width: 500px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const Input = styled.input`
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

function AddAgentModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'OpenAI + Claude',
    functions: ['Генерация контента', 'SEO-оптимизация', 'Форматирование']
  });
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация формы
    if (!formData.name.trim()) {
      toast.showWarning('Введите название агента');
      return;
    }

    if (formData.name.length < 3) {
      toast.showWarning('Название агента должно содержать минимум 3 символа');
      return;
    }

    try {
      onAdd({
        ...formData,
        status: { status: 'initialized' }
      });
    } catch (err) {
      toast.showError('Не удалось создать агента');
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Добавить агента</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Название</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите название агента"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Платформа</Label>
            <Select
              value={formData.platform}
              onChange={e => setFormData({ ...formData, platform: e.target.value })}
            >
              <option value="OpenAI + Claude">OpenAI + Claude</option>
              <option value="Perplexity AI">Perplexity AI</option>
              <option value="Gemini">Gemini</option>
              <option value="Crew AI">Crew AI</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="primary" type="submit">Добавить</Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
}

export default AddAgentModal;
