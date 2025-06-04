import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Filter, Maximize2, Minimize2 } from 'lucide-react';
import { useTonerStore } from '../../stores/tonerStore';

const mockFiliais = [
  { id: '0', nome: 'Todas' },
  { id: '1', nome: 'São Paulo' },
  { id: '2', nome: 'Rio de Janeiro' },
  { id: '3', nome: 'Belo Horizonte' }
];

const GraficoDestino: React.FC = () => {
  const { retornados } = useTonerStore();
  const [ano, setAno] = useState<string>('2025');
  const [filial, setFilial] = useState<string>('0');
  const [periodo, setPeriodo] = useState<string>('ano');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAno(e.target.value);
  };

  const handleFilialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilial(e.target.value);
  };

  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodo(e.target.value);
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

    // Filter by period
    if (periodo !== 'ano') {
      const trimestre = parseInt(periodo[0]);
      filteredRetornados = filteredRetornados.filter(r => {
        const mes = r.dataRegistro.getMonth();
        return Math.floor(mes / 3) + 1 === trimestre;
      });
    }

    // Filter by branch
    if (filial !== '0') {
      const filialNome = mockFiliais.find(f => f.id === filial)?.nome;
      filteredRetornados = filteredRetornados.filter(r => r.unidade === filialNome);
    }

    // Calculate percentages
    const total = filteredRetornados.length;
    const counts = filteredRetornados.reduce((acc, curr) => {
      acc[curr.destinoFinal] = (acc[curr.destinoFinal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Estoque', value: ((counts['estoque'] || 0) / total) * 100, color: '#22c55e' },
      { name: 'Uso Interno', value: ((counts['uso-interno'] || 0) / total) * 100, color: '#3b82f6' },
      { name: 'Descarte', value: ((counts['descarte'] || 0) / total) * 100, color: '#ef4444' },
      { name: 'Garantia', value: ((counts['garantia'] || 0) / total) * 100, color: '#eab308' }
    ].filter(item => !isNaN(item.value));
  };

  const data = getFilteredData();

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
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Quantidade por Destino Final</h1>
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label htmlFor="periodo" className="form-label">Período</label>
              <select
                id="periodo"
                value={periodo}
                onChange={handlePeriodoChange}
                className="form-select"
              >
                <option value="ano">Ano Todo</option>
                <option value="1trim">1º Trimestre</option>
                <option value="2trim">2º Trimestre</option>
                <option value="3trim">3º Trimestre</option>
                <option value="4trim">4º Trimestre</option>
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

      <GraphSection id="destino" title="Distribuição por Destino Final">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name} (${value.toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Porcentagem']}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </GraphSection>
      
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
          Detalhamento
        </h2>
        
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-secondary-900 dark:text-white">{item.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-secondary-900 dark:text-white font-medium">
                  {Math.round((item.value / 100) * retornados.length)} un.
                </span>
                <span className="text-secondary-500 dark:text-secondary-400">
                  {item.value.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          
          <div className="border-t border-gray-200 dark:border-secondary-700 pt-4 mt-4">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-secondary-900 dark:text-white">Total</span>
              <span className="text-secondary-900 dark:text-white">
                {retornados.length} un.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficoDestino;