import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';
import { Filial } from '../../types';

const mockFiliais: Filial[] = [
  { id: '1', nome: 'São Paulo' },
  { id: '2', nome: 'Rio de Janeiro' },
  { id: '3', nome: 'Belo Horizonte' }
];

const ConfigFiliais: React.FC = () => {
  const [filiais, setFiliais] = useState<Filial[]>(mockFiliais);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Filial>>({
    nome: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFiliais = filiais.filter(filial => 
    filial.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome?.trim()) {
      alert('O nome da filial é obrigatório!');
      return;
    }
    
    if (editingId) {
      setFiliais(filiais.map(filial => 
        filial.id === editingId ? { ...filial, ...formData } : filial
      ));
      setEditingId(null);
    } else {
      const newFilial: Filial = {
        id: Date.now().toString(),
        nome: formData.nome
      };
      setFiliais([...filiais, newFilial]);
    }
    
    resetForm();
  };

  const handleEdit = (filial: Filial) => {
    setFormData(filial);
    setEditingId(filial.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta filial?')) {
      setFiliais(filiais.filter(filial => filial.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      nome: ''
    });
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Cadastro de Filiais</h1>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Filial
        </button>
      </div>
      
      {isFormOpen && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            {editingId ? 'Editar Filial' : 'Nova Filial'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome" className="form-label flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Nome da Filial
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ex: São Paulo"
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Lista de Filiais
          </h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar filiais..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 dark:text-white text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Nome da Filial
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {filteredFiliais.map(filial => (
                <tr key={filial.id}>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200 w-1/6">
                    {filial.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-primary-500 mr-2" />
                      {filial.nome}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(filial)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(filial.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFiliais.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhuma filial encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card bg-blue-50 dark:bg-blue-900/30 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Observações</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc pl-5 space-y-1">
                <li>Cada filial cadastrada ficará disponível para seleção no registro de toners retornados.</li>
                <li>Os relatórios e gráficos podem ser filtrados por filial.</li>
                <li>Ao excluir uma filial, os registros associados a ela permanecerão no sistema.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigFiliais;