import React from 'react';
import { BarChart3, RefreshCw, DollarSign, PieChart } from 'lucide-react';
import { useTonerStore } from '../stores/tonerStore';

const Dashboard: React.FC = () => {
  const {
    getTotalRetornados,
    getValorRecuperado,
    getTaxaReaproveitamento,
    getModelosDiferentes,
    getDestinationStats
  } = useTonerStore();

  const stats = getDestinationStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white p-6 rounded-lg shadow-md dark:bg-secondary-800 border-l-4 border-primary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Total de Retornados (Mês)
              </p>
              <p className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">
                {getTotalRetornados()}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full dark:bg-primary-900">
              <RefreshCw className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6 rounded-lg shadow-md dark:bg-secondary-800 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Valor Recuperado (Mês)
              </p>
              <p className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">
                R$ {getValorRecuperado().toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6 rounded-lg shadow-md dark:bg-secondary-800 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Taxa de Reaproveitamento
              </p>
              <p className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">
                {getTaxaReaproveitamento().toFixed(0)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6 rounded-lg shadow-md dark:bg-secondary-800 border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Modelos Diferentes
              </p>
              <p className="mt-1 text-xl font-semibold text-secondary-900 dark:text-white">
                {getModelosDiferentes()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Retornos Recentes
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Destino
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    24/06/2025
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    HP 26A
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                    ACME Corp
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Estoque
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Distribuição por Destino
          </h2>
          
          <div className="w-full max-w-lg space-y-4">
            {stats.map((stat) => (
              <div key={stat.name} className="relative w-full bg-gray-200 dark:bg-secondary-700 rounded-lg h-10">
                <div 
                  className={`absolute inset-y-0 left-0 rounded-lg flex items-center px-3 ${
                    stat.name === 'Estoque' ? 'bg-green-500' :
                    stat.name === 'Uso Interno' ? 'bg-blue-500' :
                    stat.name === 'Descarte' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${stat.value}%` }}
                >
                  <span className="text-white font-medium whitespace-nowrap">
                    {stat.name} ({stat.value.toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;