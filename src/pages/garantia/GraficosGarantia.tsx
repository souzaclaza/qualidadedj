import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter, Maximize2, Minimize2 } from 'lucide-react';
import { useGarantiaStore } from '../../stores/garantiaStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const GraficosGarantia: React.FC = () => {
  const { garantias } = useGarantiaStore();
  const [ano, setAno] = useState<string>('2025');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAno(e.target.value);
  };

  const toggleExpand = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Dados por mês
  const getDadosPorMes = () => {
    const dados = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2025, i).toLocaleString('pt-BR', { month: 'short' }),
      quantidade: 0,
      valor: 0
    }));

    garantias
      .filter(g => new Date(g.dataSolicitacao).getFullYear().toString() === ano)
      .forEach(garantia => {
        const mes = new Date(garantia.dataSolicitacao).getMonth();
        dados[mes].quantidade += 1;
        dados[mes].valor += garantia.valorTotal;
      });

    return dados;
  };

  // Dados por fornecedor
  const getDadosPorFornecedor = () => {
    const dados = garantias
      .filter(g => new Date(g.dataSolicitacao).getFullYear().toString() === ano)
      .reduce((acc, curr) => {
        curr.itens.forEach(item => {
          if (!acc[item.modeloToner]) {
            acc[item.modeloToner] = {
              modelo: item.modeloToner,
              quantidade: 0,
              valor: 0
            };
          }
          acc[item.modeloToner].quantidade += item.quantidade;
          acc[item.modeloToner].valor += item.quantidade * item.valorUnitario;
        });
        return acc;
      }, {} as Record<string, { modelo: string; quantidade: number; valor: number }>);

    return Object.values(dados);
  };

  // Dados por status
  const getDadosPorStatus = () => {
    const dados = garantias
      .filter(g => new Date(g.dataSolicitacao).getFullYear().toString() === ano)
      .reduce((acc, curr) => {
        const status = curr.status === 'em-aberto' ? 'Em Aberto' :
                      curr.status === 'em-tratativa' ? 'Em Tratativa' :
                      curr.status === 'credito' ? 'Crédito' :
                      curr.status === 'conserto' ? 'Conserto' :
                      curr.status === 'troca' ? 'Troca' : 'Devolução';

        if (!acc[status]) {
          acc[status] = { name: status, value: 0 };
        }
        acc[status].value += 1;
        return acc;
      }, {} as Record<string, { name: string; value: number }>);

    return Object.values(dados);
  };

  const dadosPorMes = getDadosPorMes();
  const dadosPorFornecedor = getDadosPorFornecedor();
  const dadosPorStatus = getDadosPorStatus();

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
          Gráficos de Garantia
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
        {/* Garantias por Mês */}
        <GraphSection id="garantias-mes" title="Garantias por Mês">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" name="Quantidade" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </GraphSection>

        {/* Valor Total por Mês */}
        <GraphSection id="valor-mes" title="Valor Total por Mês">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="valor" name="Valor Total" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </GraphSection>

        {/* Garantias por Modelo */}
        <GraphSection id="garantias-modelo" title="Garantias por Modelo">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosPorFornecedor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="modelo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" name="Quantidade" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </GraphSection>

        {/* Status das Garantias */}
        <GraphSection id="status-garantias" title="Status das Garantias">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosPorStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {dadosPorStatus.map((entry, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total de Garantias
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
              {dadosPorStatus.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Valor Total
            </p>
            <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
              R$ {dadosPorMes.reduce((acc, curr) => acc + curr.valor, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Modelos Diferentes
            </p>
            <p className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
              {dadosPorFornecedor.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficosGarantia;