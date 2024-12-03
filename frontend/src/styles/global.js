import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Custom properties */
  :root {
    --primary: ${theme.colors.primary};
    --primary-light: ${theme.colors.primaryLight};
    --secondary: ${theme.colors.secondary};
    --dark: ${theme.colors.dark};
    --light: ${theme.colors.light};
    --danger: ${theme.colors.danger};
    --warning: ${theme.colors.warning};
    --success: ${theme.colors.success};
  }

  /* Base styles */
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${theme.typography.fontFamily.base};
    background: ${theme.colors.background};
    color: ${theme.colors.light};
    line-height: 1.5;
    min-height: 100vh;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.bold};
    line-height: 1.2;
  }

  h1 { font-size: ${theme.typography.fontSize.h1}; }
  h2 { font-size: ${theme.typography.fontSize.h2}; }
  h3 { font-size: ${theme.typography.fontSize.h3}; }
  h4 { font-size: ${theme.typography.fontSize.h4}; }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 5px var(--primary),
                  0 0 10px var(--primary),
                  0 0 15px var(--primary);
    }
    to {
      box-shadow: 0 0 10px var(--primary),
                  0 0 20px var(--primary),
                  0 0 30px var(--primary);
    }
  }

  /* Media queries */
  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: ${theme.borders.radius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${theme.borders.radius.full};
    transition: ${theme.effects.transitions.default};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Selection */
  ::selection {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.light};
  }

  /* Focus outline */
  :focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  /* Disable focus outline for mouse users */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Focus visible outline */
  :focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export default GlobalStyles;
