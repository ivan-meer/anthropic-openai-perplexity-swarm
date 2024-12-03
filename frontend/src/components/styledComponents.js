import styled from 'styled-components';

export const Header = styled.header`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.colors.cardBg};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

export const Logo = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border: ${({ theme }) => theme.borders.width.thick} solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.05);
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.effects.shadows.status};
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.h1};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Subtitle = styled.h2`
  color: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.typography.fontSize.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  opacity: 0.8;
`;

export const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.light};
  margin: 0;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.effects.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.effects.shadows.button};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;