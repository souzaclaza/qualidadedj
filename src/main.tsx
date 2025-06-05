import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundaryProvider } from './components/ErrorBoundary';
import { createQueryClient } from './hooks/queries/useQueryConfig';
import { useTonerStore } from './stores/tonerStore';

// Initialize data fetching
const initializeData = async () => {
  try {
    const { fetchToners, fetchRetornados } = useTonerStore.getState();
    await Promise.all([
      fetchToners(),
      fetchRetornados()
    ]);
    console.log('Data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Initialize data
initializeData();

const queryClient = createQueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundaryProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundaryProvider>
  </StrictMode>
);