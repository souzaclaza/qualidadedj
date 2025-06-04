import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../useAxios';
import { FormularioAuditoria, Auditoria } from '../../types';

export function useAuditoriaQueries() {
  const queryClient = useQueryClient();

  const formularios = useQuery('formularios-auditoria', async () => {
    const { data } = await api.get<FormularioAuditoria[]>('/auditorias/formularios');
    return data;
  });

  const auditorias = useQuery('auditorias', async () => {
    const { data } = await api.get<Auditoria[]>('/auditorias');
    return data;
  });

  const addFormulario = useMutation(
    async (formulario: Omit<FormularioAuditoria, 'id'>) => {
      const { data } = await api.post<FormularioAuditoria>('/auditorias/formularios', formulario);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('formularios-auditoria');
      }
    }
  );

  const addAuditoria = useMutation(
    async (auditoria: Omit<Auditoria, 'id'>) => {
      const { data } = await api.post<Auditoria>('/auditorias', auditoria);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('auditorias');
      }
    }
  );

  // Prefetch next page of auditorias
  const prefetchNextPage = async (page: number) => {
    await queryClient.prefetchQuery(['auditorias', page + 1], async () => {
      const { data } = await api.get<Auditoria[]>(`/auditorias?page=${page + 1}`);
      return data;
    });
  };

  return {
    formularios,
    auditorias,
    addFormulario,
    addAuditoria,
    prefetchNextPage
  };
}