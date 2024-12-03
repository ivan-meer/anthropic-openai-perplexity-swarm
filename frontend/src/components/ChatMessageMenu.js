import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translate(100%, -50%);
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  box-shadow: ${({ theme }) => theme.effects.shadows.card};
  padding: ${({ theme }) => theme.spacing.xs};
  display: ${({ show }) => show ? 'flex' : 'none'};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  cursor: pointer;
  white-space: nowrap;
  transition: ${({ theme }) => theme.effects.transitions.default};
  border-radius: ${({ theme }) => theme.borders.radius.sm};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MenuIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const defaultMenuItems = [
  { icon: '📋', label: 'Копировать', action: 'copy' },
  { icon: '🔄', label: 'Повторить', action: 'retry' },
  { icon: '📝', label: 'Редактировать', action: 'edit' },
  { icon: '🗑️', label: 'Удалить', action: 'delete' }
];

function ChatMessageMenu({ 
  show, 
  message,
  menuItems = defaultMenuItems,
  onAction 
}) {
  const handleAction = (action) => {
    if (onAction) {
      onAction(action, message);
    }
  };

  const isActionAvailable = (action) => {
    switch (action) {
      case 'retry':
      case 'edit':
        return message.sender === 'user';
      case 'copy':
        return true;
      case 'delete':
        return true;
      default:
        return false;
    }
  };

  return (
    <MenuContainer show={show}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => handleAction(item.action)}
          disabled={!isActionAvailable(item.action)}
        >
          <MenuIcon>{item.icon}</MenuIcon>
          {item.label}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default ChatMessageMenu;
