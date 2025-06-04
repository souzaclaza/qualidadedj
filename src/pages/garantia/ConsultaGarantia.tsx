import React, { useState } from 'react';
import { Search, Download, Filter, Edit2, Trash2, Save, X } from 'lucide-react';
import { useGarantiaStore } from '../../stores/garantiaStore';
import * as XLSX from 'xlsx';
import clsx from 'clsx';

const ConsultaGarantia: React.FC = () => {
  const { garantias, updateGarantia, deleteGarantia } = useGarantiaStore();
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    status: '',
    solicitante: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    observacaoFinal: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarGarantias = () => {
    let resultados = [...garantias];

    if (filtros.dataInicio) {
      resultados = resultados.filter(r => 
        new Date(r.dataSolicitacao) >= new Date(filtros.dataInicio)
      );
    }

    if (filtros.dataFim) {
      resultados = resultados.filter(r => 
        new Date(r.dataSolicitacao) <= new Date(filtros.dataFim)
      );
    }

    if (filtros.status) {
      resultados = resultados.filter(r => r.status === filtros.status);
    }

    if (filtros.solicitante) {
      resultados = resultados.filter(r => 
        r.solicitante.toLowerCase().includes(filtros.solicitante.toLowerCase())
      );
    }

    return resultados;
  };

  const handleEdit = (garantia: typeof garantias[0]) => {
    setEditingId(garantia.id);
    setEditForm({
      status: garantia.status,
      observacaoFinal: garantia.observacaoFinal || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const garantia = garantias.find(g => g.id === editingId);
    if (!garantia) return;

    updateGarantia(editingId, {
      ...garantia,
      status: editForm.status,
      observacaoFinal: editForm.observacaoFinal
    });

    setEditingId(null);
    setEditForm({ status: '', observacaoFinal: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta garantia?')) {
      deleteGarantia(id);
    }
  };

  const exportarExcel = () => {
    const garantiasExportar = filtrarGarantias().map(garantia => ({
      'Solicitante': garantia.solicitante,
      'Data Solicitação': new Date(garantia.dataSolicitacao).toLocaleDateString('pt-BR'),
      'Número Série': garantia.numeroSerie,
      'Status': garantia.status === 'em-aberto' ? 'Em Aberto' :
                garantia.status === 'em-tratativa' ? 'Em Tratativa' :
                garantia.status === 'credito' ? 'Crédito' :
                garantia.status === 'conserto' ? 'Conserto' :
                garantia.status === 'troca' ? 'Troca' : 'Devolução',
      'Valor Total': garantia.valorTotal.toFixed(2),
      'Observação Final': garantia.observacaoFinal || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(garantiasExportar);
    XLSX.utils.book_append_sheet(wb, ws, 'Garantias');
    XLSX.writeFile(wb, 'garantias.xlsx');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-aberto':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'em-tratativa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'credito':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'conserto':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'troca':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'devolucao':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const garantiasFiltradas = filtrarGarantias();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Consulta de Garantias
        </h1>

        <div className="flex space-x-2">
          <button
            className="btn btn-secondary"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>

          <button
            className="btn btn-secondary"
            onClick={exportarExcel}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {filtersVisible && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-group">
              <label htmlFor="dataInicio" className="form-label">Data Início</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={filtros.dataInicio}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFim" className="form-label">Data Fim</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={filtros.dataFim}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={filtros.status}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todos</option>
                <option value="em-aberto">Em Aberto</option>
                <option value="em-tratativa">Em Tratativa</option>
                <option value="credito">Crédito</option>
                <option value="conserto">Conserto</option>
                <option value="troca">Troca</option>
                <option value="devolucao">Devolução</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="solicitante" className="form-label">Solicitante</label>
              <input
                type="text"
                id="solicitante"
                name="solicitante"
                value={filtros.solicitante}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Nome do solicitante"
              />
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Número Série
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {garantiasFiltradas.map(garantia => (
                <tr key={garantia.id}>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {editingId === garantia.id ? (
                      <div className="space-y-4">
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="form-select"
                        >
                          <option value="em-aberto">Em Aberto</option>
                          <option value="em-tratativa">Em Tratativa</option>
                          <option value="credito">Crédito</option>
                          <option value="conserto">Conserto</option>
                          <option value="troca">Troca</option>
                          <option value="devolucao">Devolução</option>
                        </select>
                        <textarea
                          value={editForm.observacaoFinal}
                          onChange={(e) => setEditForm({ ...editForm, observacaoFinal: e.target.value })}
                          className="form-input"
                          placeholder="Observação final"
                          rows={2}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn btn-secondary"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="btn btn-primary"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      garantia.solicitante
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {new Date(garantia.dataSolicitacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {garantia.numeroSerie}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={clsx(
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      getStatusColor(garantia.status)
                    )}>
                      {garantia.status === 'em-aberto' ? 'Em Aberto' :
                       garantia.status === 'em-tratativa' ? 'Em Tratativa' :
                       garantia.status === 'credito' ? 'Crédito' :
                       garantia.status === 'conserto' ? 'Conserto' :
                       garantia.status === 'troca' ? 'Troca' : 'Devolução'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    R$ {garantia.valorTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(garantia)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(garantia.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {garantiasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhuma garantia encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultaGarantia;