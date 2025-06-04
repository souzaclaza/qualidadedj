import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../useAxios';
import { PopIt, PopItArquivo } from '../../types';

export function usePopItQueries() {
  const queryClient = useQueryClient();

  const popIts = useQuery('pop-its', async () => {
    const { data } = await api.get<PopIt[]>('/pop-its');
    return data;
  });

  const arquivos = useQuery('pop-it-arquivos', async () => {
    const { data } = await api.get<PopItArquivo[]>('/pop-its/arquivos');
    return data;
  });

  const addPopIt = useMutation(
    async (popIt: Omit<PopIt, 'id'>) => {
      const { data } = await api.post<PopIt>('/pop-its', popIt);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pop-its');
      }
    }
  );

  const addArquivo = useMutation(
    async (arquivo: FormData) => {
      const { data } = await api.post<PopItArquivo>('/pop-its/arquivos', arquivo, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pop-it-arquivos');
      }
    }
  );

  // Prefetch POP/IT details
  const prefetchPopItDetails = async (id: string) => {
    await queryClient.prefetchQuery(['pop-it', id], async () => {
      const { data } = await api.get<PopIt>(`/pop-its/${id}`);
      return data;
    });
  };

  return {
    popIts,
    arquivos,
    addPopIt,
    addArquivo,
    prefetchPopItDetails
  };
}