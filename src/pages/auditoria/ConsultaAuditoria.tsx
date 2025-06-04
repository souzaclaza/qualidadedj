import React, { useState } from 'react';
import { Search, Download, Filter, FileText, Calendar, User, Building, Eye, Printer, Edit2, X } from 'lucide-react';
import { useAuditoriaStore } from '../../stores/auditoriaStore';
import * as XLSX from 'xlsx';
import clsx from 'clsx';

const ConsultaAuditoria: React.FC = () => {
  const { auditorias, formularios } = useAuditoriaStore();
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    auditor: '',
    unidade: '',
    formulario: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarAuditorias = () => {
    let resultados = [...auditorias];

    if (filtros.dataInicio) {
      resultados = resultados.filter(r => 
        r.dataInicio >= new Date(filtros.dataInicio)
      );
    }

    if (filtros.dataFim) {
      resultados = resultados.filter(r => 
        r.dataFim <= new Date(filtros.dataFim)
      );
    }

    if (filtros.auditor) {
      resultados = resultados.filter(r => 
        r.auditor.toLowerCase().includes(filtros.auditor.toLowerCase())
      );
    }

    if (filtros.unidade) {
      resultados = resultados.filter(r => 
        r.unidade === filtros.unidade
      );
    }

    if (filtros.formulario) {
      resultados = resultados.filter(r => 
        r.formularioId === filtros.formulario
      );
    }

    return resultados;
  };

  const exportarExcel = () => {
    const auditoriasExportar = filtrarAuditorias().map(auditoria => {
      const formulario = formularios.find(f => f.id === auditoria.formularioId);
      return {
        'Título do Formulário': formulario?.titulo || '',
        'Auditor': auditoria.auditor,
        'Unidade': auditoria.unidade,
        'Data Início': auditoria.dataInicio.toLocaleDateString('pt-BR'),
        'Data Fim': auditoria.dataFim.toLocaleDateString('pt-BR'),
        'Processo/Área': formulario?.processoArea || '',
        'Itens Conformes': auditoria.respostas.filter(r => r.conforme === true).length,
        'Itens Não Conformes': auditoria.respostas.filter(r => r.conforme === false).length,
        'Média Percentual': auditoria.respostas
          .filter(r => r.percentual !== undefined)
          .reduce((acc, curr) => acc + (curr.percentual || 0), 0) / 
          auditoria.respostas.filter(r => r.percentual !== undefined).length || 0
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(auditoriasExportar);
    XLSX.utils.book_append_sheet(wb, ws, 'Auditorias');
    XLSX.writeFile(wb, 'auditorias.xlsx');
  };

  const imprimirRelatorio = (auditoria: typeof auditorias[0]) => {
    const formulario = formularios.find(f => f.id === auditoria.formularioId);
    if (!formulario) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Auditoria</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1a56db; margin-bottom: 20px; }
            .header { margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; }
            .footer { margin-top: 40px; }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Auditoria</h1>
          </div>

          <div class="info">
            <div class="info-item">
              <span class="label">Formulário:</span> ${formulario.titulo}
            </div>
            <div class="info-item">
              <span class="label">Processo/Área:</span> ${formulario.processoArea}
            </div>
            <div class="info-item">
              <span class="label">Auditor:</span> ${auditoria.auditor}
            </div>
            <div class="info-item">
              <span class="label">Unidade:</span> ${auditoria.unidade}
            </div>
            <div class="info-item">
              <span class="label">Período:</span> ${auditoria.dataInicio.toLocaleDateString('pt-BR')} a ${auditoria.dataFim.toLocaleDateString('pt-BR')}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Resultado</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              ${formulario.itens.map((item, index) => {
                const resposta = auditoria.respostas.find(r => r.itemId === item.id);
                let resultado = '';
                if (item.tipo === 'conforme') {
                  resultado = resposta?.conforme ? 'Conforme' : 'Não Conforme';
                } else {
                  resultado = resposta?.percentual ? `${resposta.percentual}%` : '-';
                }
                return `
                  <tr>
                    <td>${index + 1}. ${item.descricao}</td>
                    <td>${resultado}</td>
                    <td>${resposta?.observacao || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="info-item">
              <span class="label">Link de Evidências:</span> ${formulario.linkEvidencias || '-'}
            </div>
            <div class="info-item">
              <span class="label">Observações de GAP:</span> ${formulario.observacoesGap || '-'}
            </div>
            <div class="info-item">
              <span class="label">Observações de Melhoria:</span> ${formulario.observacoesMelhoria || '-'}
            </div>
            <div class="info-item">
              <span class="label">Responsável do Setor:</span> ${formulario.responsavelSetor || '-'}
            </div>
          </div>

          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
            Imprimir
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const auditoriasFiltradas = filtrarAuditorias();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Consulta de Auditorias
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="dataInicio" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Data Início
              </label>
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
              <label htmlFor="dataFim" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Data Fim
              </label>
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
              <label htmlFor="auditor" className="form-label flex items-center">
                <User className="h-4 w-4 mr-2" />
                Auditor
              </label>
              <input
                type="text"
                id="auditor"
                name="auditor"
                value={filtros.auditor}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Nome do auditor"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unidade" className="form-label flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Unidade
              </label>
              <select
                id="unidade"
                name="unidade"
                value={filtros.unidade}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todas as unidades</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="formulario" className="form-label flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Formulário
              </label>
              <select
                id="formulario"
                name="formulario"
                value={filtros.formulario}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todos os formulários</option>
                {formularios.map(formulario => (
                  <option key={formulario.id} value={formulario.id}>
                    {formulario.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setFiltros({
                  dataInicio: '',
                  dataFim: '',
                  auditor: '',
                  unidade: '',
                  formulario: ''
                })}
                className="btn btn-secondary mr-2"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => setFiltersVisible(false)}
                className="btn btn-primary"
              >
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </button>
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
                  Formulário
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Auditor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Unidade
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {auditoriasFiltradas.map(auditoria => {
                const formulario = formularios.find(f => f.id === auditoria.formularioId);

                return (
                  <tr key={auditoria.id}>
                    <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                      {auditoria.dataInicio.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                      {formulario?.titulo}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                      {auditoria.auditor}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                      {auditoria.unidade}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedAuditoria(auditoria.id)}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => imprimirRelatorio(auditoria)}
                          className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300"
                          title="Imprimir"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {/* Implementar edição */}}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {auditoriasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhuma auditoria encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Visualização */}
      {selectedAuditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {(() => {
              const auditoria = auditorias.find(a => a.id === selectedAuditoria);
              const formulario = auditoria ? formularios.find(f => f.id === auditoria.formularioId) : null;

              if (!auditoria || !formulario) return null;

              return (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                      Detalhes da Auditoria
                    </h2>
                    <button
                      onClick={() => setSelectedAuditoria(null)}
                      className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                          Formulário
                        </h3>
                        <p className="mt-1 text-secondary-900 dark:text-white">
                          {formulario.titulo}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                          Processo/Área
                        </h3>
                        <p className="mt-1 text-secondary-900 dark:text-white">
                          {formulario.processoArea}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                          Auditor
                        </h3>
                        <p className="mt-1 text-secondary-900 dark:text-white">
                          {auditoria.auditor}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                          Unidade
                        </h3>
                        <p className="mt-1 text-secondary-900 dark:text-white">
                          {auditoria.unidade}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                          Data Início
                        </h3>
                        <p className="mt-1 text-secondary-900 dark:text-white">
                          {auditoria.dataInicio.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                          Data Fim
                        </h3>
                        <p className="mt-1 text-secondary-900 dark:text-white">
                          {auditoria.dataFim.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                        Itens Auditados
                      </h3>
                      <div className="space-y-4">
                        {formulario.itens.map((item, index) => {
                          const resposta = auditoria.respostas.find(r => r.itemId === item.id);
                          return (
                            <div
                              key={item.id}
                              className="p-4 bg-gray-50 dark:bg-secondary-800/50 rounded-lg"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-secondary-900 dark:text-white">
                                    {index + 1}. {item.descricao}
                                  </h4>
                                  {item.observacao && (
                                    <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                                      {item.observacao}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {item.tipo === 'conforme' ? (
                                    <span className={clsx(
                                      "px-2 py-1 text-xs rounded-full",
                                      resposta?.conforme
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    )}>
                                      {resposta?.conforme ? 'Conforme' : 'Não Conforme'}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      {resposta?.percentual}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              {resposta?.observacao && (
                                <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  Observação: {resposta.observacao}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {formulario.linkEvidencias && (
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Link das Evidências
                          </h3>
                          <a
                            href={formulario.linkEvidencias}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {formulario.linkEvidencias}
                          </a>
                        </div>
                      )}

                      {formulario.observacoesGap && (
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Observações de GAP
                          </h3>
                          <p className="mt-1 text-secondary-900 dark:text-white">
                            {formulario.observacoesGap}
                          </p>
                        </div>
                      )}

                      {formulario.observacoesMelhoria && (
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Observações de Melhoria
                          </h3>
                          <p className="mt-1 text-secondary-900 dark:text-white">
                            {formulario.observacoesMelhoria}
                          </p>
                        </div>
                      )}

                      {formulario.responsavelSetor && (
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Responsável do Setor
                          </h3>
                          <p className="mt-1 text-secondary-900 dark:text-white">
                            {formulario.responsavelSetor}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                      <button
                        onClick={() => imprimirRelatorio(auditoria)}
                        className="btn btn-secondary"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                      </button>
                      <button
                        onClick={() => {/* Implementar edição */}}
                        className="btn btn-primary"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
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

export default ConsultaAuditoria;