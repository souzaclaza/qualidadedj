import React, { useState } from 'react';
import { Search, Download, Filter, Eye, Printer } from 'lucide-react';
import { useNCStore } from '../../stores/ncStore';
import * as XLSX from 'xlsx';
import clsx from 'clsx';

const ConsultaNC: React.FC = () => {
  const { ncs, analises, acoes, verificacoes } = useNCStore();
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    status: '',
    gravidade: '',
    classificacao: '',
    areaSetor: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedNC, setSelectedNC] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarNCs = () => {
    let resultados = [...ncs];

    if (filtros.dataInicio) {
      resultados = resultados.filter(r => 
        r.dataOcorrencia >= new Date(filtros.dataInicio)
      );
    }

    if (filtros.dataFim) {
      resultados = resultados.filter(r => 
        r.dataOcorrencia <= new Date(filtros.dataFim)
      );
    }

    if (filtros.status) {
      resultados = resultados.filter(r => r.status === filtros.status);
    }

    if (filtros.gravidade) {
      resultados = resultados.filter(r => r.gravidade === filtros.gravidade);
    }

    if (filtros.classificacao) {
      resultados = resultados.filter(r => r.classificacao === filtros.classificacao);
    }

    if (filtros.areaSetor) {
      resultados = resultados.filter(r => r.areaSetor === filtros.areaSetor);
    }

    return resultados;
  };

  const exportarExcel = () => {
    const ncsExportar = filtrarNCs().map(nc => {
      const analise = analises.find(a => a.ncId === nc.id);
      const acoesNC = acoes.filter(a => a.ncId === nc.id);
      const verificacao = verificacoes.find(v => v.ncId === nc.id);

      return {
        'Número': nc.numero,
        'Título': nc.titulo,
        'Data Ocorrência': nc.dataOcorrencia.toLocaleDateString('pt-BR'),
        'Área/Setor': nc.areaSetor,
        'Classificação': nc.classificacao,
        'Gravidade': nc.gravidade,
        'Status': nc.status,
        'Identificado por': nc.identificadoPor,
        'Descrição': nc.descricao,
        'Análise - Responsável': analise?.responsavel || '',
        'Análise - Data': analise?.dataAnalise.toLocaleDateString('pt-BR') || '',
        'Ações - Quantidade': acoesNC.length,
        'Ações - Concluídas': acoesNC.filter(a => a.status === 'concluida').length,
        'Verificação - Responsável': verificacao?.responsavel || '',
        'Verificação - Data': verificacao?.dataVerificacao.toLocaleDateString('pt-BR') || '',
        'Verificação - Status Final': verificacao?.statusFinal || ''
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(ncsExportar);
    XLSX.utils.book_append_sheet(wb, ws, 'NCs');
    XLSX.writeFile(wb, 'nao-conformidades.xlsx');
  };

  const imprimirNC = (ncId: string) => {
    const nc = ncs.find(n => n.id === ncId);
    const analise = analises.find(a => a.ncId === ncId);
    const acoesNC = acoes.filter(a => a.ncId === ncId);
    const verificacao = verificacoes.find(v => v.ncId === ncId);

    if (!nc) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>NC ${nc.numero}</title>
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
          <h1>Não Conformidade - ${nc.numero}</h1>

          <div class="section">
            <h2 class="section-title">1. Registro</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Título:</span> ${nc.titulo}
              </div>
              <div class="info-item">
                <span class="label">Data:</span> ${nc.dataOcorrencia.toLocaleDateString('pt-BR')}
              </div>
              <div class="info-item">
                <span class="label">Identificado por:</span> ${nc.identificadoPor}
              </div>
              <div class="info-item">
                <span class="label">Área/Setor:</span> ${nc.areaSetor}
              </div>
              <div class="info-item">
                <span class="label">Classificação:</span> ${nc.classificacao}
              </div>
              <div class="info-item">
                <span class="label">Gravidade:</span> ${nc.gravidade}
              </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
              <span class="label">Descrição:</span>
              <p>${nc.descricao}</p>
            </div>
          </div>

          ${analise ? `
            <div class="section">
              <h2 class="section-title">2. Análise dos 5 Porquês</h2>
              <div class="info-item">
                <span class="label">Responsável:</span> ${analise.responsavel}
              </div>
              <div class="info-item">
                <span class="label">Data:</span> ${analise.dataAnalise.toLocaleDateString('pt-BR')}
              </div>
              <div style="margin-top: 15px;">
                ${analise.porques.map((porque, index) => 
                  porque ? `
                    <div class="info-item">
                      <span class="label">${index + 1}º Por quê:</span> ${porque}
                    </div>
                  ` : ''
                ).join('')}
              </div>
            </div>
          ` : ''}

          ${acoesNC.length > 0 ? `
            <div class="section">
              <h2 class="section-title">3. Plano de Ação</h2>
              <table>
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Responsável</th>
                    <th>Data Limite</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${acoesNC.map(acao => `
                    <tr>
                      <td>${acao.descricao}</td>
                      <td>${acao.responsavel}</td>
                      <td>${acao.dataLimite.toLocaleDateString('pt-BR')}</td>
                      <td>${acao.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${verificacao ? `
            <div class="section">
              <h2 class="section-title">4. Verificação e Encerramento</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Responsável:</span> ${verificacao.responsavel}
                </div>
                <div class="info-item">
                  <span class="label">Data:</span> ${verificacao.dataVerificacao.toLocaleDateString('pt-BR')}
                </div>
                <div class="info-item">
                  <span class="label">Problema Resolvido:</span> ${verificacao.resolvido ? 'Sim' : 'Não'}
                </div>
                <div class="info-item">
                  <span class="label">Status Final:</span> ${verificacao.statusFinal}
                </div>
              </div>
              ${verificacao.observacoes ? `
                <div class="info-item" style="margin-top: 15px;">
                  <span class="label">Observações:</span>
                  <p>${verificacao.observacoes}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">
            Imprimir
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const ncsFiltradas = filtrarNCs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Consulta de Não Conformidades
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
                <option value="registro">Registro</option>
                <option value="analise">Análise</option>
                <option value="plano-acao">Plano de Ação</option>
                <option value="verificacao">Verificação</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="gravidade" className="form-label">Gravidade</label>
              <select
                id="gravidade"
                name="gravidade"
                value={filtros.gravidade}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todas</option>
                <option value="leve">Leve</option>
                <option value="media">Média</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="classificacao" className="form-label">Classificação</label>
              <select
                id="classificacao"
                name="classificacao"
                value={filtros.classificacao}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todas</option>
                <option value="produto">Produto</option>
                <option value="processo">Processo</option>
                <option value="servico">Serviço</option>
                <option value="sistema">Sistema</option>
                <option value="cliente">Cliente</option>
                <option value="fornecedor">Fornecedor</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="areaSetor" className="form-label">Área/Setor</label>
              <select
                id="areaSetor"
                name="areaSetor"
                value={filtros.areaSetor}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Todos</option>
                <option value="Produção">Produção</option>
                <option value="Qualidade">Qualidade</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Logística">Logística</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Comercial">Comercial</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
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
                  Número
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Área/Setor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {ncsFiltradas.map(nc => (
                <tr key={nc.id}>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {nc.numero}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {nc.dataOcorrencia.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {nc.titulo}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {nc.areaSetor}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={clsx(
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      nc.status === 'registro' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                      nc.status === 'analise' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                      nc.status === 'plano-acao' && 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                      nc.status === 'verificacao' && 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                      nc.status === 'encerrado' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    )}>
                      {nc.status === 'registro' ? 'Registro' :
                       nc.status === 'analise' ? 'Análise' :
                       nc.status === 'plano-acao' ? 'Plano de Ação' :
                       nc.status === 'verificacao' ? 'Verificação' : 'Encerrado'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedNC(nc.id)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => imprimirNC(nc.id)}
                        className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300"
                        title="Imprimir"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ncsFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhuma não conformidade encontrada
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

export default ConsultaNC;