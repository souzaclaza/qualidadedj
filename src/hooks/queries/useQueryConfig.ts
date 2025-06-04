import { QueryClient } from 'react-query';

export const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
};

export function createQueryClient() {
  return new QueryClient(queryConfig);
}