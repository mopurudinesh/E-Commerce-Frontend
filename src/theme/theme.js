import { createTheme } from '@mui/material/styles';

const lightTokens = {
  primary: '#2874f0',
  background: '#f5f7fa',
  card: '#ffffff',
  textPrimary: '#172337',
  textSecondary: '#526174',
  border: '#e2e8f0',
  success: '#16a34a',
  error: '#dc2626',
};

export const createAppTheme = () => {
  const tokens = lightTokens;

  return createTheme({
    palette: {
      mode: 'light',
      primary: { main: tokens.primary },
      background: { default: tokens.background, paper: tokens.card },
      text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
      divider: tokens.border,
      success: { main: tokens.success },
      error: { main: tokens.error },
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${tokens.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiButton: { styleOverrides: { root: { height: '44px', borderRadius: '8px' } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: '8px' } } },
    },
  });
};
