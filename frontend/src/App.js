import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
import AgentLogsPage from './components/AgentLogsPage';
import AboutPage from './components/AboutPage';
import DocsPage from './components/DocsPage';
import { theme } from './styles/theme';
import GlobalStyles from './styles/global';
import { ToastProvider } from './contexts/ToastContext';

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.cardBg};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.nav};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.light};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  transition: ${({ theme }) => theme.effects.transitions.default};
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
    opacity: 1;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.background};
  padding: 0;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <GlobalStyles />
        <BrowserRouter>
          <Nav>
            <NavList>
              <NavItem>
                <NavLink to="/">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Главная
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/chat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Чат
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/about">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  О нас
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/docs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Документация
                </NavLink>
              </NavItem>
            </NavList>
          </Nav>
          <Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/agents/:agentId/logs" element={<AgentLogsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/docs" element={<DocsPage />} />
            </Routes>
          </Main>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
