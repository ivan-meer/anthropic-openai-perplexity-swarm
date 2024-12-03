import React, { forwardRef } from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';
import { ChatCommands } from './ChatCommands';
import ChatFormatHints from './ChatFormatHints';

const InputContainer = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  box-shadow: ${({ theme }) => theme.effects.shadows.card};
  position: relative;
`;

const Input = styled.textarea`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.light};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: none;
  min-height: 40px;
  max-height: 120px;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.shadows.input};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.light};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.effects.shadows.button};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const ChatInput = forwardRef(({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  onCommandSelect,
  isLoading,
  showCommands,
  placeholder = "Введите сообщение... (/ для команд)"
}, ref) => {
  return (
    <InputContainer onSubmit={onSubmit}>
      <InputWrapper>
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
        />
        <ChatCommands
          show={showCommands}
          inputValue={value}
          onCommandSelect={onCommandSelect}
        />
        <ChatFormatHints />
      </InputWrapper>
      <SendButton type="submit" disabled={isLoading || !value.trim()}>
        {isLoading ? <LoadingSpinner size={20} /> : 'Отправить'}
      </SendButton>
    </InputContainer>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
