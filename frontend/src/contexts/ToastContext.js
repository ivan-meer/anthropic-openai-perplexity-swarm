import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = toastId++;
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false,
      isClosing: false
    };

    setToasts(prevToasts => [...prevToasts, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => {
      const toast = prevToasts.find(t => t.id === id);
      if (!toast) return prevToasts;

      // Добавляем анимацию закрытия
      const updatedToasts = prevToasts.map(t => 
        t.id === id ? { ...t, isClosing: true } : t
      );

      // Удаляем тост после завершения анимации
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);

      return updatedToasts;
    });
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'success' });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'error' });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'warning' });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'info' });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
