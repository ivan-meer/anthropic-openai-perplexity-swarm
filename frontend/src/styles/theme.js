/**
 * Тема приложения SWARM AI FRAMEWORK
 * Содержит все константы для стилизации
 */

export const theme = {
  // Цветовая палитра
  colors: {
    // Основные цвета
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    secondary: '#10b981',
    dark: '#1f2937',
    light: '#f3f4f6',

    // Статусы
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',

    // Фоны
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    badgeBg: 'rgba(37, 99, 235, 0.1)',
  },

  // Типографика
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSize: {
      h1: '2.25rem',
      h2: '1.875rem',
      h3: '1.5rem',
      h4: '1.25rem',
      base: '1rem',
      small: '0.875rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Эффекты
  effects: {
    // Тени
    shadows: {
      card: '0 4px 6px rgba(0, 0, 0, 0.1)',
      button: '0 5px 15px rgba(37, 99, 235, 0.4)',
      status: '0 0 10px var(--primary)',
    },
    // Градиенты
    gradients: {
      button: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
    },
    // Анимации
    animations: {
      fadeIn: 'fadeIn 0.5s ease-out',
      glow: 'glow 1.5s ease-in-out infinite alternate',
    },
    // Переходы
    transitions: {
      default: 'all 0.3s ease',
    },
  },

  // Размеры
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Границы
  borders: {
    radius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '3px',
    },
  },

  // Медиа-запросы
  breakpoints: {
    mobile: '768px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
  },

  // Z-индексы
  zIndices: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    tooltip: 1400,
  },

  // Размеры компонентов
  components: {
    card: {
      width: '300px',
      padding: '1.5rem',
    },
    button: {
      height: '36px',
      padding: '0 1rem',
    },
    input: {
      height: '36px',
      padding: '0 1rem',
    },
    badge: {
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
    },
    status: {
      size: '12px',
    },
  },
};

// Хелперы для работы с темой
export const getColor = (colorPath) => {
  const paths = colorPath.split('.');
  let value = theme.colors;
  for (const path of paths) {
    value = value[path];
  }
  return value;
};

export const getFontSize = (size) => theme.typography.fontSize[size];
export const getSpacing = (space) => theme.spacing[space];
export const getRadius = (radius) => theme.borders.radius[radius];
export const getShadow = (shadow) => theme.effects.shadows[shadow];
export const getBreakpoint = (point) => theme.breakpoints[point];
