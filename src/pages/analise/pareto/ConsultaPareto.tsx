import React, { useState } from 'react';
import { Search, Download, Filter, Eye, Printer, Edit2, Trash2, X } from 'lucide-react';
import { useParetoStore } from '../../../stores/paretoStore';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import clsx from 'clsx';
import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ConsultaPareto: React.FC = () => {
  const navigate = useNavigate();
  const { analises, deleteAnalise } = useParetoStore();
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    setor: '',
    responsavel: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const formatDate = (date: Date | undefined | null): string => {
    if (!date || !(date instanceof Date)) return '-';
    return date.toLocaleDateString('pt-BR');
  };

  const handleEdit = (id: string) => {
    navigate(`/analise/pareto/registro?id=${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta análise?')) {
      deleteAnalise(id);
      setSelectedAnalise(null);
    }
  };

  const filtrarAnalises = () => {
    let resultados = [...analises];

    if (filtros.dataInicio) {
      resultados = resultados.filter(r => 
        r.dataAnalise >= new Date(filtros.dataInicio)
      );
    }

    if (filtros.dataFim) {
      resultados = resultados.filter(r => 
        r.dataAnalise <= new Date(filtros.dataFim)
      );
    }

    if (filtros.setor) {
      resultados = resultados.filter(r => 
        r.setor.toLowerCase().includes(filtros.setor.toLowerCase())
      );
    }

    if (filtros.responsavel) {
      resultados = resultados.filter(r => 
        r.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())
      );
    }

    return resultados;
  };

  const exportarExcel = () => {
    const analisesFiltradas = filtrarAnalises();
    const dadosExportacao = analisesFiltradas.map(analise => ({
      'Título': analise.titulo,
      'Responsável': analise.responsavel,
      'Setor': analise.setor,
      'Data da Análise': formatDate(analise.dataAnalise),
      'Categorias': analise.categorias?.map(c => `${c.nome}: ${c.quantidade} (${c.percentual}%)`).join('; ') || '',
      'Observações': analise.observacoes || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExportacao);
    XLSX.utils.book_append_sheet(wb, ws, 'Análises de Pareto');
    XLSX.writeFile(wb, 'analises-pareto.xlsx');
  };

  const imprimirAnalise = (analiseId: string) => {
    const analise = analises.find(a => a.id === analiseId);
    if (!analise) return;

    const totalQuantidade = analise.categorias?.reduce((acc, curr) => acc + curr.quantidade, 0) || 0;
    let acumulado = 0;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Análise de Pareto - ${analise.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1a56db; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { color: #1e293b; margin-bottom: 15px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${analise.titulo}</h1>

          <div class="section">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Responsável:</span> ${analise.responsavel}
              </div>
              <div class="info-item">
                <span class="label">Setor:</span> ${analise.setor}
              </div>
              <div class="info-item">
                <span class="label">Data da Análise:</span> ${formatDate(analise.dataAnalise)}
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Categorias</h2>
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Quantidade</th>
                  <th>Percentual</th>
                  <th>Acumulado</th>
                </tr>
              </thead>
              <tbody>
                ${analise.categorias?.map(categoria => {
                  acumulado += categoria.percentual;
                  return `
                    <tr>
                      <td>${categoria.nome}</td>
                      <td>${categoria.quantidade}</td>
                      <td>${categoria.percentual.toFixed(2)}%</td>
                      <td>${acumulado.toFixed(2)}%</td>
                    </tr>
                  `;
                }).join('') || ''}
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${totalQuantidade}</strong></td>
                  <td><strong>100%</strong></td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          ${analise.acoes?.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Plano de Ação</h2>
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Ação</th>
                    <th>Responsável</th>
                    <th>Prazo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${analise.acoes.map(acao => `
                    <tr>
                      <td>${acao.categoria}</td>
                      <td>${acao.acao}</td>
                      <td>${acao.responsavel}</td>
                      <td>${formatDate(acao.prazo)}</td>
                      <td>${acao.status === 'pendente' ? 'Pendente' :
                           acao.status === 'em-andamento' ? 'Em Andamento' : 'Concluída'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${analise.observacoes ? `
            <div class="section">
              <h2 class="section-title">Observações</h2>
              <p>${analise.observacoes}</p>
            </div>
          ` : ''}

          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
            Imprimir
          </button>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const analisesFiltradas = filtrarAnalises();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Consulta de Análises de Pareto
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
              <label htmlFor="setor" className="form-label">Setor</label>
              <input
                type="text"
                id="setor"
                name="setor"
                value={filtros.setor}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Digite o setor"
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsavel" className="form-label">Responsável</label>
              <input
                type="text"
                id="responsavel"
                name="responsavel"
                value={filtros.responsavel}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Nome do responsável"
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
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {analisesFiltradas.map(analise => (
                <tr key={analise.id}>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {formatDate(analise.dataAnalise)}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {analise.titulo}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {analise.responsavel}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {analise.setor}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedAnalise(analise.id)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(analise.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(analise.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => imprimirAnalise(analise.id)}
                        className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300"
                        title="Imprimir"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {analisesFiltradas.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhuma análise encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Visualização */}
      {selectedAnalise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {(() => {
              const analise = analises.find(a => a.id === selectedAnalise);
              if (!analise) return null;

              const totalQuantidade = analise.categorias?.reduce((acc, curr) => acc + curr.quantidade, 0) || 0;
              let acumulado = 0;

              // Prepare data for Pareto chart
              const chartData = analise.categorias?.map(categoria => {
                acumulado += (categoria.quantidade / totalQuantidade) * 100;
                return {
                  name: categoria.nome,
                  quantidade: categoria.quantidade,
                  acumulado: acumulado
                };
              }) || [];

              return (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                      {analise.titulo}
                    </h2>
                    <button
                      onClick={() => setSelectedAnalise(null)}
                      className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          Responsável
                        </p>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {analise.responsavel}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          Setor
                        </p>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {analise.setor}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          Data da Análise
                        </p>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {formatDate(analise.dataAnalise)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                        Categorias
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                Categoria
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                Quantidade
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                Percentual
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                                Acumulado
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
                            {analise.categorias?.map((categoria, index) => {
                              acumulado += categoria.percentual;
                              return (
                                <tr key={index}>
                                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                                    {categoria.nome}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                                    {categoria.quantidade}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                                    {categoria.percentual.toFixed(2)}%
                                  </td>
                                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                                    {acumulado.toFixed(2)}%
                                  </td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td className="px-4 py-4 text-sm font-medium text-secondary-900 dark:text-secondary-200">
                                Total
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-secondary-900 dark:text-secondary-200">
                                {totalQuantidade}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-secondary-900 dark:text-secondary-200">
                                100%
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-secondary-900 dark:text-secondary-200">
                                -
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add Pareto Chart */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                        Gráfico de Pareto
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'Acumulado %', angle: 90, position: 'insideRight' }} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="quantidade" fill="#0088FE" name="Quantidade" />
                            <Line yAxisId="right" type="monotone" dataKey="acumulado" stroke="#FF8042" name="Acumulado %" />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {analise.acoes?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                          Plano de Ação
                        </h3>
                        <div className="space-y-4">
                          {analise.acoes.map((acao, index) => (
                            <div
                              key={index}
                              className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Categoria
                                  </p>
                                  <p className="font-medium text-secondary-900 dark:text-white">
                                    {acao.categoria}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Responsável
                                  </p>
                                  <p className="font-medium text-secondary-900 dark:text-white">
                                    {acao.responsavel}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                  Ação
                                </p>
                                <p className="font-medium text-secondary-900 dark:text-white">
                                  {acao.acao}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Prazo
                                  </p>
                                  <p className="font-medium text-secondary-900 dark:text-white">
                                    {formatDate(acao.prazo)}
                                  </p>
                                </div>
                                <span className={clsx(
                                  'px-2 py-1 text-xs font-medium rounded-full',
                                  acao.status === 'pendente'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : acao.status === 'em-andamento'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                )}>
                                  {acao.status === 'pendente' ? 'Pendente' :
                                   acao.status === 'em-andamento' ? 'Em Andamento' : 'Concluída'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analise.observacoes && (
                      <div>
                        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                          Observações
                        </h3>
                        <p className="text-secondary-600 dark:text-secondary-400">
                          {analise.observacoes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => imprimirAnalise(analise.id)}
                        className="btn btn-secondary"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaPareto;