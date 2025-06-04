import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter, Maximize2, Minimize2 } from 'lucide-react';
import { useNCStore } from '../../stores/ncStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const GraficosNC: React.FC = () => {
  const { ncs, getNCsByStatus, getNCsByGravidade, getNCsByClassificacao } = useNCStore();
  const [ano, setAno] = useState<string>('2025');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAno(e.target.value);
  };

  const toggleExpand = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Get NCs by month
  const getNCsPorMes = () => {
    const dados = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2025, i).toLocaleString('pt-BR', { month: 'short' }),
      quantidade: 0
    }));

    ncs
      .filter(nc => nc.dataOcorrencia.getFullYear().toString() === ano)
      .forEach(nc => {
        const mes = nc.dataOcorrencia.getMonth();
        dados[mes].quantidade += 1;
      });

    return dados;
  };

  // Transform status data for chart
  const getStatusData = () => {
    const statusData = getNCsByStatus();
    return Object.entries(statusData).map(([status, value]) => ({
      name: status === 'registro' ? 'Registro' :
            status === 'analise' ? 'Análise' :
            status === 'plano-acao' ? 'Plano de Ação' :
            status === 'verificacao' ? 'Verificação' : 'Encerrado',
      value
    }));
  };

  // Transform gravidade data for chart
  const getGravidadeData = () => {
    const gravidadeData = getNCsByGravidade();
    return Object.entries(gravidadeData).map(([gravidade, value]) => ({
      name: gravidade === 'leve' ? 'Leve' :
            gravidade === 'media' ? 'Média' : 'Crítica',
      value
    }));
  };

  // Transform classificacao data for chart
  const getClassificacaoData = () => {
    const classificacaoData = getNCsByClassificacao();
    return Object.entries(classificacaoData).map(([classificacao, value]) => ({
      name: classificacao.charAt(0).toUpperCase() + classificacao.slice(1),
      value
    }));
  };

  const GraphSection = ({ 
    id, 
    title, 
    children 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className={`card transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={() => toggleExpand(id)}
            className="btn btn-secondary"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className={isExpanded ? 'h-[calc(100%-4rem)]' : 'h-80'}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Gráficos de Não Conformidades
        </h1>
        
        <div className="flex space-x-2">
          <button
            className="btn btn-secondary"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>
      
      
      
      {filtersVisible && (
        <div className="card">
          <div className="form-group">
            <label htmlFor="ano" className="form-label">Ano</label>
            <select
              id="ano"
              value={ano}
              onChange={handleAnoChange}
              className="form-select"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NCs por Mês */}
        <GraphSection id="ncs-mes" title="NCs por Mês">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getNCsPorMes()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" name="Quantidade de NCs" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </GraphSection>

        {/* NCs por Status */}
        <GraphSection id="ncs-status" title="NCs por Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {getStatusData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GraphSection>

        {/* NCs por Gravidade */}
        <GraphSection id="ncs-gravidade" title="NCs por Gravidade">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getGravidadeData()}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Quantidade" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </GraphSection>

        {/* NCs por Classificação */}
        <GraphSection id="ncs-classificacao" title="NCs por Classificação">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getClassificacaoData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {getClassificacaoData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GraphSection>
      </div>

      {/* Resumo */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
          Resumo do Ano {ano}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total de NCs
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
              {ncs.length}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              NCs Encerradas
            </p>
            <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
              {ncs.filter(nc => nc.status === 'encerrado').length}
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              NCs em Andamento
            </p>
            <p className="mt-1 text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {ncs.filter(nc => nc.status !== 'encerrado').length}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              NCs Críticas
            </p>
            <p className="mt-1 text-2xl font-bold text-red-900 dark:text-red-100">
              {ncs.filter(nc => nc.gravidade === 'critica').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficosNC;