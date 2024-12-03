import React from 'react';
import styled from 'styled-components';

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
  max-width: 400px;
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

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.light};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.light};
  opacity: 0.8;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  background: ${({ variant, theme }) => 
    variant === 'danger' 
      ? `linear-gradient(135deg, ${theme.colors.danger} 0%, ${theme.colors.warning} 100%)`
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

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <Modal onClick={onCancel}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onCancel}>Отмена</Button>
          <Button variant="danger" onClick={onConfirm}>Удалить</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmDialog;
