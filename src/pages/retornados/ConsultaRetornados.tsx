import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, Filter, X, Trash2 } from 'lucide-react';
import { TonerRetornado, FiltrosConsulta } from '../../types';
import * as XLSX from 'xlsx';
import { useTonerStore } from '../../stores/tonerStore';
import AdminPasswordModal from '../../components/AdminPasswordModal';

const mockFiliais = [
  { id: '1', nome: 'São Paulo' },
  { id: '2', nome: 'Rio de Janeiro' },
  { id: '3', nome: 'Belo Horizonte' }
];

const ConsultaRetornados: React.FC = () => {
  const { retornados, fetchRetornados, addRetornados, deleteRetornado } = useTonerStore();
  const [filteredRetornados, setFilteredRetornados] = useState<TonerRetornado[]>([]);
  const [filtros, setFiltros] = useState<FiltrosConsulta>({});
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRetornadoId, setSelectedRetornadoId] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchRetornados();
      } catch (error) {
        console.error('Error fetching retornados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchRetornados]);

  useEffect(() => {
    setFilteredRetornados(retornados);
  }, [retornados]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value) {
      setFiltros({ ...filtros, [name]: new Date(value) });
    } else {
      const newFiltros = { ...filtros };
      delete newFiltros[name as keyof FiltrosConsulta];
      setFiltros(newFiltros);
    }
  };

  const filtrarRetornados = () => {
    let resultados = [...retornados];
    
    if (filtros.dataInicio) {
      resultados = resultados.filter(r => r.dataRegistro >= filtros.dataInicio!);
    }
    
    if (filtros.dataFim) {
      resultados = resultados.filter(r => r.dataRegistro <= filtros.dataFim!);
    }
    
    if (filtros.filial) {
      resultados = resultados.filter(r => r.unidade === filtros.filial);
    }
    
    if (filtros.idCliente) {
      resultados = resultados.filter(r => r.idCliente.includes(filtros.idCliente!));
    }
    
    if (filtros.modelo) {
      resultados = resultados.filter(r => r.modeloToner.toLowerCase().includes(filtros.modelo!.toLowerCase()));
    }
    
    if (filtros.destinoFinal) {
      resultados = resultados.filter(r => r.destinoFinal === filtros.destinoFinal);
    }
    
    setFilteredRetornados(resultados);
    setFiltersVisible(false);
  };

  const resetarFiltros = () => {
    setFiltros({});
    setFilteredRetornados(retornados);
    setFiltersVisible(false);
  };

  const exportarExcel = () => {
    const dadosExportacao = filteredRetornados.map(r => ({
      'ID Cliente': r.idCliente,
      'Unidade': r.unidade,
      'Modelo Toner': r.modeloToner,
      'Destino Final': r.destinoFinal === 'estoque' ? 'Estoque' : 
                      r.destinoFinal === 'uso-interno' ? 'Uso Interno' : 
                      r.destinoFinal === 'descarte' ? 'Descarte' : 'Garantia',
      'Data Registro': r.dataRegistro.toLocaleDateString('pt-BR'),
      'Valor Resgatado (R$)': r.valorResgatado.toFixed(2)
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExportacao);
    
    const colWidths = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Retornados');
    XLSX.writeFile(wb, 'retornados.xlsx');
  };

  const downloadTemplate = () => {
    const template = [
      {
        'ID Cliente': 'C001',
        'Unidade': 'São Paulo',
        'Modelo Toner': 'HP 26A',
        'Destino Final': 'Estoque',
        'Data Registro': '22/06/2025',
        'Valor Resgatado (R$)': '200.50'
      }
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    
    const colWidths = [
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_retornados.xlsx');
  };

  const importarExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = event.target?.result;
          if (data) {
            const wb = XLSX.read(data, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws);
            
            const novosRetornados: TonerRetornado[] = jsonData.map((item: any, index) => ({
              id: (Date.now() + index).toString(),
              idCliente: item['ID Cliente'],
              unidade: item['Unidade'],
              modeloToner: item['Modelo Toner'],
              pesoRetornado: 0,
              gramaturaRestante: 0,
              porcentagemRestante: 0,
              destinoFinal: item['Destino Final'].toLowerCase().replace(' ', '-') as TonerRetornado['destinoFinal'],
              dataRegistro: new Date(item['Data Registro'].split('/').reverse().join('-')),
              valorResgatado: Number(item['Valor Resgatado (R$)']) || 0
            }));

            await addRetornados(novosRetornados);
            setIsImportModalOpen(false);
            alert(`Importados ${novosRetornados.length} registros com sucesso!`);
          }
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Erro ao importar os dados. Verifique o formato do arquivo.');
        }
      };
      
      reader.readAsBinaryString(file);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedRetornadoId(id);
    setIsPasswordModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRetornadoId) {
      try {
        await deleteRetornado(selectedRetornadoId);
        setIsPasswordModalOpen(false);
        setSelectedRetornadoId(null);
      } catch (error) {
        console.error('Error deleting retornado:', error);
        alert('Erro ao excluir o registro. Por favor, tente novamente.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Consulta de Toners Retornados</h1>
        
        <div className="flex flex-wrap gap-2">
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
          
          <button
            className="btn btn-secondary"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
        </div>
      </div>
      
      {filtersVisible && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="dataInicio" className="form-label">Data Início</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={filtros.dataInicio ? filtros.dataInicio.toISOString().substring(0, 10) : ''}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dataFim" className="form-label">Data Fim</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={filtros.dataFim ? filtros.dataFim.toISOString().substring(0, 10) : ''}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="filial" className="form-label">Filial</label>
              <select
                id="filial"
                name="filial"
                value={filtros.filial || ''}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todas as filiais</option>
                {mockFiliais.map(filial => (
                  <option key={filial.id} value={filial.nome}>
                    {filial.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="idCliente" className="form-label">ID do Cliente</label>
              <input
                type="text"
                id="idCliente"
                name="idCliente"
                value={filtros.idCliente || ''}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="modelo" className="form-label">Modelo</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={filtros.modelo || ''}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="destinoFinal" className="form-label">Destino Final</label>
              <select
                id="destinoFinal"
                name="destinoFinal"
                value={filtros.destinoFinal || ''}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todos os destinos</option>
                <option value="estoque">Estoque</option>
                <option value="uso-interno">Uso Interno</option>
                <option value="descarte">Descarte</option>
                <option value="garantia">Garantia</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2 justify-end">
            <button
              type="button"
              onClick={resetarFiltros}
              className="btn btn-secondary"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={filtrarRetornados}
              className="btn btn-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>
      )}
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Filial
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Valor Resgatado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {filteredRetornados.map(retornado => (
                <tr key={retornado.id}>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    {retornado.dataRegistro.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    {retornado.unidade}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    {retornado.idCliente}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    {retornado.modeloToner}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        retornado.destinoFinal === 'estoque'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : retornado.destinoFinal === 'uso-interno'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : retornado.destinoFinal === 'descarte'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {retornado.destinoFinal === 'estoque'
                        ? 'Estoque'
                        : retornado.destinoFinal === 'uso-interno'
                        ? 'Uso Interno'
                        : retornado.destinoFinal === 'descarte'
                        ? 'Descarte'
                        : 'Garantia'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    {retornado.destinoFinal === 'estoque' && retornado.valorResgatado > 0
                      ? `R$ ${retornado.valorResgatado.toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => handleDeleteClick(retornado.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRetornados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Importação */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Importar Dados
              </h2>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary-50 dark:bg-secondary-900/50 p-4 rounded-lg">
                <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                  Instruções
                </h3>
                <ol className="list-decimal list-inside text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                  <li>Baixe o template de exemplo</li>
                  <li>Preencha os dados conforme o modelo</li>
                  <li>Salve o arquivo e importe</li>
                </ol>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={downloadTemplate}
                  className="btn btn-secondary w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </button>

                <label className="btn btn-primary w-full cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivo
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={importarExcel}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Senha */}
      {isPasswordModalOpen && (
        <AdminPasswordModal
          title="Excluir Registro"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsPasswordModalOpen(false);
            setSelectedRetornadoId(null);
          }}
        />
      )}
    </div>
  );
};

export default ConsultaRetornados;