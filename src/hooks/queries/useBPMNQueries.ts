import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../useAxios';
import { BPMN, BPMNArquivo } from '../../types';

export function useBPMNQueries() {
  const queryClient = useQueryClient();

  const bpmns = useQuery('bpmns', async () => {
    const { data } = await api.get<BPMN[]>('/bpmns');
    return data;
  });

  const arquivos = useQuery('bpmn-arquivos', async () => {
    const { data } = await api.get<BPMNArquivo[]>('/bpmns/arquivos');
    return data;
  });

  const addBPMN = useMutation(
    async (bpmn: Omit<BPMN, 'id'>) => {
      const { data } = await api.post<BPMN>('/bpmns', bpmn);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bpmns');
      }
    }
  );

  const addArquivo = useMutation(
    async (arquivo: FormData) => {
      const { data } = await api.post<BPMNArquivo>('/bpmns/arquivos', arquivo, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bpmn-arquivos');
      }
    }
  );

  // Prefetch BPMN details
  const prefetchBPMNDetails = async (id: string) => {
    await queryClient.prefetchQuery(['bpmn', id], async () => {
      const { data } = await api.get<BPMN>(`/bpmns/${id}`);
      return data;
    });
  };

  return {
    bpmns,
    arquivos,
    addBPMN,
    addArquivo,
    prefetchBPMNDetails
  };
}