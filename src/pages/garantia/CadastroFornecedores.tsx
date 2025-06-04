import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2, Search, Phone, Mail, Link2, Building2 } from 'lucide-react';
import { useGarantiaStore } from '../../stores/garantiaStore';
import { Fornecedor } from '../../types';

const CadastroFornecedores: React.FC = () => {
  const { fornecedores, addFornecedor, updateFornecedor, deleteFornecedor } = useGarantiaStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Fornecedor>>({
    nome: '',
    telefone: '',
    email: '',
    linkGarantia: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFornecedores = fornecedores.filter(fornecedor => 
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome?.trim()) {
      alert('O nome do fornecedor é obrigatório!');
      return;
    }
    
    if (editingId) {
      updateFornecedor(editingId, { 
        id: editingId,
        nome: formData.nome || '',
        telefone: formData.telefone || '',
        email: formData.email || '',
        linkGarantia: formData.linkGarantia || ''
      });
      setEditingId(null);
    } else {
      const newFornecedor: Fornecedor = {
        id: Date.now().toString(),
        nome: formData.nome || '',
        telefone: formData.telefone || '',
        email: formData.email || '',
        linkGarantia: formData.linkGarantia || ''
      };
      addFornecedor(newFornecedor);
    }
    
    resetForm();
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setFormData(fornecedor);
    setEditingId(fornecedor.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      deleteFornecedor(id);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      linkGarantia: ''
    });
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Cadastro de Fornecedores</h1>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </button>
      </div>
      
      {isFormOpen && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            {editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="nome" className="form-label flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Nome do Fornecedor
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome || ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Ex: HP Brasil"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telefone" className="form-label flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="(00) 0000-0000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="contato@fornecedor.com.br"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="linkGarantia" className="form-label flex items-center">
                  <Link2 className="h-4 w-4 mr-2" />
                  Link da Garantia
                </label>
                <input
                  type="url"
                  id="linkGarantia"
                  name="linkGarantia"
                  value={formData.linkGarantia || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://"
                />
              </div>
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
            Lista de Fornecedores
          </h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar fornecedores..."
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
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Link da Garantia
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {filteredFornecedores.map(fornecedor => (
                <tr key={fornecedor.id}>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-primary-500 mr-2" />
                      {fornecedor.nome}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {fornecedor.telefone || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {fornecedor.email || '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {fornecedor.linkGarantia ? (
                      <a
                        href={fornecedor.linkGarantia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Acessar
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(fornecedor)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fornecedor.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFornecedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhum fornecedor encontrado
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
                <li>O cadastro de fornecedores é essencial para o registro e acompanhamento de garantias.</li>
                <li>Mantenha os dados de contato sempre atualizados para facilitar a comunicação.</li>
                <li>O link da garantia deve ser a URL oficial do fabricante para consulta de garantias.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroFornecedores;