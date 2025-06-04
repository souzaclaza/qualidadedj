import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../useAxios';
import { NC, NCAnalise, NCAcao, NCVerificacao } from '../../types';

export function useNCQueries() {
  const queryClient = useQueryClient();

  const ncs = useQuery('ncs', async () => {
    const { data } = await api.get<NC[]>('/ncs');
    return data;
  });

  const analises = useQuery('nc-analises', async () => {
    const { data } = await api.get<NCAnalise[]>('/ncs/analises');
    return data;
  });

  const addNC = useMutation(
    async (nc: Omit<NC, 'id'>) => {
      const { data } = await api.post<NC>('/ncs', nc);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ncs');
      }
    }
  );

  const addAnalise = useMutation(
    async (analise: Omit<NCAnalise, 'id'>) => {
      const { data } = await api.post<NCAnalise>('/ncs/analises', analise);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('nc-analises');
      }
    }
  );

  return {
    ncs,
    analises,
    addNC,
    addAnalise
  };
}