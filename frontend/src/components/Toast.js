import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const Container = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  z-index: ${({ theme }) => theme.zIndices.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  pointer-events: none;
`;

const ToastItem = styled.div`
  background: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.primary;
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  box-shadow: ${({ theme }) => theme.effects.shadows.toast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 300px;
  max-width: 500px;
  pointer-events: auto;
  animation: ${({ isClosing }) => isClosing ? slideOut : slideIn} 0.3s ease-in-out;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Message = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  margin: -${({ theme }) => theme.spacing.sm};
  opacity: 0.7;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const icons = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
};

function Toast({ toasts = [], onClose }) {
  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.autoClose !== false) {
        const timer = setTimeout(() => {
          onClose(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, onClose]);

  return (
    <Container>
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          type={toast.type}
          isClosing={toast.isClosing}
        >
          {icons[toast.type || 'info']}
          <Message>{toast.message}</Message>
          <CloseButton onClick={() => onClose(toast.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </ToastItem>
      ))}
    </Container>
  );
}

export default Toast;
