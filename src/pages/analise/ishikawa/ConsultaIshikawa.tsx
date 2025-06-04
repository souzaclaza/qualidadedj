import React, { useState, useCallback } from 'react';
import { Search, Download, Filter, Eye, Printer, Edit2, Trash2, X } from 'lucide-react';
import { useIshikawaStore } from '../../../stores/ishikawaStore';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ReactFlow, { 
  Background, 
  Controls,
  Node,
  Edge,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

const ConsultaIshikawa: React.FC = () => {
  const navigate = useNavigate();
  const { analises, deleteAnalise } = useIshikawaStore();
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    setor: '',
    titulo: ''
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleEdit = (id: string) => {
    navigate(`/analise/ishikawa/registro?id=${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta análise?')) {
      deleteAnalise(id);
      setSelectedAnalise(null); // Close modal if open
    }
  };

  const renderIshikawaDiagram = useCallback((analise: IshikawaAnalise) => {
    const categories = Object.keys(analise.causas);
    const angleStep = (2 * Math.PI) / categories.length;
    const radius = 300;

    // Create central problem node
    const nodes: Node[] = [
      {
        id: 'problem',
        type: 'default',
        position: { x: 400, y: 300 },
        data: { 
          label: analise.titulo 
        },
        className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg shadow-lg'
      }
    ];

    // Create category nodes and cause nodes
    categories.forEach((category, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = 400 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;

      // Add category node
      const categoryId = `category-${index}`;
      nodes.push({
        id: categoryId,
        type: 'default',
        position: { x, y },
        data: { 
          label: category 
        },
        className: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg shadow-md'
      });

      // Add cause nodes
      analise.causas[category].forEach((cause, causeIndex) => {
        const causeId = `cause-${index}-${causeIndex}`;
        const causeAngle = angle + (causeIndex - (analise.causas[category].length - 1) / 2) * 0.2;
        const causeRadius = radius + 100;
        const causeX = 400 + Math.cos(causeAngle) * causeRadius;
        const causeY = 300 + Math.sin(causeAngle) * causeRadius;

        nodes.push({
          id: causeId,
          type: 'default',
          position: { x: causeX, y: causeY },
          data: { 
            label: cause.descricao 
          },
          className: 'bg-white dark:bg-secondary-700 p-2 rounded shadow-sm text-sm max-w-[200px]'
        });
      });
    });

    // Create edges
    const edges: Edge[] = [];
    
    // Connect problem to categories
    categories.forEach((_, index) => {
      edges.push({
        id: `e-problem-${index}`,
        source: 'problem',
        target: `category-${index}`,
        className: 'text-gray-300 dark:text-gray-600',
        type: 'straight'
      });
    });

    // Connect categories to causes
    categories.forEach((category, index) => {
      analise.causas[category].forEach((_, causeIndex) => {
        edges.push({
          id: `e-category-${index}-${causeIndex}`,
          source: `category-${index}`,
          target: `cause-${index}-${causeIndex}`,
          className: 'text-gray-300 dark:text-gray-600',
          type: 'straight'
        });
      });
    });

    return (
      <div style={{ height: 600 }} className="bg-white dark:bg-secondary-800 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.5}
          maxZoom={2}
          attributionPosition="bottom-right"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    );
  }, []);

  const filtrarAnalises = () => {
    let resultados = [...analises];

    if (filtros.dataInicio) {
      resultados = resultados.filter(r => r.data >= filtros.dataInicio);
    }

    if (filtros.dataFim) {
      resultados = resultados.filter(r => r.data <= filtros.dataFim);
    }

    if (filtros.setor) {
      resultados = resultados.filter(r => 
        r.setor.toLowerCase().includes(filtros.setor.toLowerCase())
      );
    }

    if (filtros.titulo) {
      resultados = resultados.filter(r => 
        r.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
      );
    }

    return resultados;
  };

  const exportarExcel = () => {
    const analisesFiltradas = filtrarAnalises();
    const dadosExportacao = analisesFiltradas.map(analise => {
      const causasPorCategoria = Object.entries(analise.causas)
        .map(([categoria, causas]) => 
          `${categoria}: ${causas.map(c => c.descricao).join('; ')}`
        )
        .join('\n');

      return {
        'Título': analise.titulo,
        'Responsável': analise.responsavel,
        'Setor': analise.setor,
        'Data': analise.data,
        'Causas': causasPorCategoria
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExportacao);
    XLSX.utils.book_append_sheet(wb, ws, 'Análises Ishikawa');
    XLSX.writeFile(wb, 'analises-ishikawa.xlsx');
  };

  const imprimirAnalise = (analiseId: string) => {
    const analise = analises.find(a => a.id === analiseId);
    if (!analise) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Análise Ishikawa - ${analise.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1a56db; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { color: #1e293b; margin-bottom: 15px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .categoria { margin-bottom: 20px; }
            .causa-item { margin: 5px 0; padding-left: 20px; }
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
                <span class="label">Data:</span> ${analise.data}
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Causas por Categoria</h2>
            ${Object.entries(analise.causas).map(([categoria, causas]) => `
              <div class="categoria">
                <h3>${categoria}</h3>
                ${causas.map(causa => `
                  <div class="causa-item">• ${causa.descricao}</div>
                `).join('')}
              </div>
            `).join('')}
          </div>

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
          Consulta de Análises Ishikawa
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
              <label htmlFor="titulo" className="form-label">Título</label>
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
                    {analise.data}
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
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {(() => {
              const analise = analises.find(a => a.id === selectedAnalise);
              if (!analise) return null;

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
                          Data
                        </p>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {analise.data}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(analise.causas).map(([categoria, causas]) => (
                        <div key={categoria} className="space-y-2">
                          <h3 className="font-medium text-secondary-900 dark:text-white">
                            {categoria}
                          </h3>
                          <ul className="space-y-1">
                            {causas.map((causa, index) => (
                              <li key={index} className="text-secondary-600 dark:text-secondary-400">
                                • {causa.descricao}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {renderIshikawaDiagram(analise)}

                    <div className="mt-6 flex justify-end space-x-2">
                      <button
                        onClick={() => imprimirAnalise(analise.id)}
                        className="btn btn-primary"
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

export default ConsultaIshikawa;