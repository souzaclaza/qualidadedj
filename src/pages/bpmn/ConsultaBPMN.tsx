import React, { useState } from 'react';
import { Search, Download, Filter, FileText, Calendar, Building2 } from 'lucide-react';
import { useBPMNStore } from '../../stores/bpmnStore';

const ConsultaBPMN: React.FC = () => {
  const { bpmns, setores, getUltimaVersao } = useBPMNStore();
  const [filtros, setFiltros] = useState({
    titulo: '',
    setor: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarBPMNs = () => {
    let resultados = [...bpmns];
    
    if (filtros.titulo) {
      resultados = resultados.filter(p => 
        p.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
      );
    }
    
    if (filtros.setor) {
      resultados = resultados.filter(p => p.setor === filtros.setor);
    }
    
    return resultados;
  };

  const handleDownload = (bpmnId: string) => {
    const arquivo = getUltimaVersao(bpmnId);
    if (arquivo?.url) {
      window.open(arquivo.url, '_blank');
    }
  };

  const bpmnsFiltrados = filtrarBPMNs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Consulta de BPMN
        </h1>
        
        <button
          className="btn btn-secondary"
          onClick={() => setFiltersVisible(!filtersVisible)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>
      
      {filtersVisible && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Título
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={filtros.titulo}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Buscar por título..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="setor" className="form-label flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Setor
              </label>
              <select
                id="setor"
                name="setor"
                value={filtros.setor}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todos os setores</option>
                {setores.map(setor => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </select>
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
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Versão
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {bpmnsFiltrados.map(bpmn => {
                const ultimaVersao = getUltimaVersao(bpmn.id);
                
                return (
                  <tr key={bpmn.id}>
                    <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-primary-500 mr-2" />
                        {bpmn.titulo}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                      {bpmn.setor}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        v{bpmn.versaoAtual}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                      {bpmn.dataEnvio.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      {ultimaVersao && (
                        <button
                          onClick={() => handleDownload(bpmn.id)}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          title="Baixar arquivo"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {bpmnsFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhum BPMN encontrado
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

export default ConsultaBPMN;