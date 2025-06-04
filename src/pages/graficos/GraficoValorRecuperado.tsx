import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, Calculator, Maximize2, Minimize2 } from 'lucide-react';
import { useTonerStore } from '../../stores/tonerStore';

const mockFiliais = [
  { id: '0', nome: 'Todas' },
  { id: '1', nome: 'São Paulo' },
  { id: '2', nome: 'Rio de Janeiro' },
  { id: '3', nome: 'Belo Horizonte' }
];

const GraficoValorRecuperado: React.FC = () => {
  const { retornados } = useTonerStore();
  const [ano, setAno] = useState<string>('2025');
  const [filial, setFilial] = useState<string>('0');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAno(e.target.value);
  };

  const handleFilialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilial(e.target.value);
  };

  const toggleExpand = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getFilteredData = () => {
    let filteredRetornados = [...retornados];

    // Filter by year
    filteredRetornados = filteredRetornados.filter(r => 
      r.dataRegistro.getFullYear().toString() === ano
    );

    // Filter by branch
    if (filial !== '0') {
      const filialNome = mockFiliais.find(f => f.id === filial)?.nome;
      filteredRetornados = filteredRetornados.filter(r => r.unidade === filialNome);
    }

    // Group by month
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2025, i).toLocaleString('pt-BR', { month: 'short' }),
      valor: 0
    }));

    filteredRetornados.forEach(r => {
      const month = r.dataRegistro.getMonth();
      monthlyData[month].valor += r.valorResgatado;
    });

    return monthlyData;
  };

  const data = getFilteredData();
  const totalValorRecuperado = data.reduce((acc, curr) => acc + curr.valor, 0);
  const mesesComValor = data.filter(m => m.valor > 0).length;
  const mediaValorRecuperado = mesesComValor > 0 ? totalValorRecuperado / mesesComValor : 0;
  const maiorValorMes = data.reduce((max, curr) => curr.valor > max.valor ? curr : max, data[0]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Valor Recuperado por Mês</h1>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="form-group">
              <label htmlFor="filial" className="form-label">Filial</label>
              <select
                id="filial"
                value={filial}
                onChange={handleFilialChange}
                className="form-select"
              >
                {mockFiliais.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <GraphSection id="valor-recuperado" title="Valor Recuperado por Mês">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="mes" stroke="#64748b" />
            <YAxis 
              stroke="#64748b" 
              tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), 'Valor Recuperado']}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="valor" 
              name="Valor Recuperado" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraphSection>
      
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-primary-600" />
          Resumo Financeiro
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
            <p className="text-sm font-medium text-primary-800 dark:text-primary-200">Total Recuperado</p>
            <p className="text-2xl font-bold text-primary-900 dark:text-primary-100 mt-1">
              {formatCurrency(totalValorRecuperado)}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Média Mensal</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
              {formatCurrency(mediaValorRecuperado)}
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Mês com Maior Valor</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {maiorValorMes.mes} - {formatCurrency(maiorValorMes.valor)}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3 text-secondary-900 dark:text-white">
            Projeção Anual
          </h3>
          
          <div className="bg-secondary-50 dark:bg-secondary-800 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Baseada na média mensal atual
                </p>
                <p className="text-xl font-bold text-secondary-900 dark:text-white mt-1">
                  {formatCurrency(mediaValorRecuperado * 12)}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Economia de Custo Aproximada
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(mediaValorRecuperado * 12 * 0.8)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficoValorRecuperado;