import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme, darkTheme } from './core/ui/theme';
import { AppRouter } from './core/router/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const currentTheme = isDarkMode ? darkTheme : theme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            '*': {
              scrollbarWidth: 'thin',
              scrollbarColor: `${currentTheme.palette.primary.light} ${currentTheme.palette.background.paper}`,
            },
            '*::-webkit-scrollbar': {
              width: '8px',
            },
            '*::-webkit-scrollbar-track': {
              backgroundColor: currentTheme.palette.background.paper,
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: currentTheme.palette.primary.light,
              borderRadius: '4px',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              backgroundColor: currentTheme.palette.primary.main,
            },
          }}
        />
        <AppRouter isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;