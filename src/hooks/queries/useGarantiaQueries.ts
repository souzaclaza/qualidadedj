import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../useAxios';
import { Garantia, Fornecedor } from '../../types';

export function useGarantiaQueries() {
  const queryClient = useQueryClient();

  const garantias = useQuery('garantias', async () => {
    const { data } = await api.get<Garantia[]>('/garantias');
    return data;
  });

  const fornecedores = useQuery('fornecedores', async () => {
    const { data } = await api.get<Fornecedor[]>('/fornecedores');
    return data;
  });

  const addGarantia = useMutation(
    async (garantia: Omit<Garantia, 'id'>) => {
      const { data } = await api.post<Garantia>('/garantias', garantia);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('garantias');
      }
    }
  );

  const addFornecedor = useMutation(
    async (fornecedor: Omit<Fornecedor, 'id'>) => {
      const { data } = await api.post<Fornecedor>('/fornecedores', fornecedor);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fornecedores');
      }
    }
  );

  return {
    garantias,
    fornecedores,
    addGarantia,
    addFornecedor
  };
}