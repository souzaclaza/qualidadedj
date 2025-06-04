import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../useAxios';
import { Toner, TonerRetornado } from '../../types';

export function useTonerQueries() {
  const queryClient = useQueryClient();

  const toners = useQuery('toners', async () => {
    const { data } = await api.get<Toner[]>('/toners');
    return data;
  });

  const retornados = useQuery('retornados', async () => {
    const { data } = await api.get<TonerRetornado[]>('/retornados');
    return data;
  });

  const addToner = useMutation(
    async (toner: Omit<Toner, 'id'>) => {
      const { data } = await api.post<Toner>('/toners', toner);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('toners');
      }
    }
  );

  const addRetornado = useMutation(
    async (retornado: Omit<TonerRetornado, 'id'>) => {
      const { data } = await api.post<TonerRetornado>('/retornados', retornado);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('retornados');
      }
    }
  );

  return {
    toners,
    retornados,
    addToner,
    addRetornado
  };
}