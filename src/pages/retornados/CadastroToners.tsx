import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { useTonerStore } from '../../stores/tonerStore';
import { Toner } from '../../types';

const CadastroToners: React.FC = () => {
  const { toners, addToner, updateToner, deleteToner, fetchToners } = useTonerStore();
  const [formData, setFormData] = useState<Partial<Toner>>({
    modelo: '',
    pesoCheio: 0,
    pesoVazio: 0,
    impressorasCompativeis: [],
    cor: 'black',
    areaImpressaISO: '5%',
    capacidadeFolhas: 0,
    tipo: 'original',
    precoCompra: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [compatiblePrinters, setCompatiblePrinters] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchToners();
  }, [fetchToners]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePrintersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompatiblePrinters(e.target.value);
  };

  const calculateDerivedValues = () => {
    if (formData.pesoCheio && formData.pesoVazio && formData.capacidadeFolhas && formData.precoCompra) {
      const gramatura = formData.pesoCheio - formData.pesoVazio;
      const precoFolha = formData.precoCompra / formData.capacidadeFolhas;
      
      setFormData({
        ...formData,
        gramatura,
        precoFolha
      });
      
      return {
        ...formData,
        gramatura,
        precoFolha
      };
    }
    
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedFormData = calculateDerivedValues();
      
      const impressorasCompativeis = compatiblePrinters
        .split('\n')
        .map(printer => printer.trim())
        .filter(printer => printer !== '');
      
      if (editingId) {
        await updateToner(editingId, {
          ...updatedFormData as Omit<Toner, 'id'>,
          impressorasCompativeis
        });
      } else {
        await addToner({
          ...updatedFormData as Omit<Toner, 'id'>,
          impressorasCompativeis
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving toner:', error);
      alert('Erro ao salvar o toner. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (toner: Toner) => {
    setFormData(toner);
    setCompatiblePrinters(toner.impressorasCompativeis.join('\n'));
    setEditingId(toner.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este toner?')) {
      try {
        await deleteToner(id);
      } catch (error) {
        console.error('Error deleting toner:', error);
        alert('Erro ao excluir o toner. Por favor, tente novamente.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      modelo: '',
      pesoCheio: 0,
      pesoVazio: 0,
      impressorasCompativeis: [],
      cor: 'black',
      areaImpressaISO: '5%',
      capacidadeFolhas: 0,
      tipo: 'original',
      precoCompra: 0
    });
    setCompatiblePrinters('');
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Cadastro de Toners</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
              {editingId ? 'Editar Toner' : 'Novo Toner'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="modelo" className="form-label">Modelo</label>
                <input
                  type="text"
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="pesoCheio" className="form-label">Peso Cheio (g)</label>
                  <input
                    type="number"
                    id="pesoCheio"
                    name="pesoCheio"
                    value={formData.pesoCheio || ''}
                    onChange={handleChange}
                    className="form-input"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="pesoVazio" className="form-label">Peso Vazio (g)</label>
                  <input
                    type="number"
                    id="pesoVazio"
                    name="pesoVazio"
                    value={formData.pesoVazio || ''}
                    onChange={handleChange}
                    className="form-input"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="impressorasCompativeis" className="form-label">
                  Impressoras Compatíveis (uma por linha)
                </label>
                <textarea
                  id="impressorasCompativeis"
                  value={compatiblePrinters}
                  onChange={handlePrintersChange}
                  className="form-input"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="cor" className="form-label">Cor</label>
                  <select
                    id="cor"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="black">Black</option>
                    <option value="cyan">Cyan</option>
                    <option value="magenta">Magenta</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="areaImpressaISO" className="form-label">Área Impressa ISO</label>
                  <select
                    id="areaImpressaISO"
                    name="areaImpressaISO"
                    value={formData.areaImpressaISO}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="5%">5%</option>
                    <option value="6%">6%</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="capacidadeFolhas" className="form-label">Capacidade de Folhas</label>
                  <input
                    type="number"
                    id="capacidadeFolhas"
                    name="capacidadeFolhas"
                    value={formData.capacidadeFolhas || ''}
                    onChange={handleChange}
                    className="form-input"
                    required
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tipo" className="form-label">Tipo</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="original">Original</option>
                    <option value="compatível">Compatível</option>
                    <option value="remanufaturado">Remanufaturado</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="precoCompra" className="form-label">Preço de Compra (R$)</label>
                <input
                  type="number"
                  id="precoCompra"
                  name="precoCompra"
                  value={formData.precoCompra || ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="mt-6 flex items-center justify-between">
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
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Toners Cadastrados
              </h2>
              <button 
                className="btn btn-primary"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Toner
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Modelo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Cor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Capacidade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Preço/Folha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
                  {toners.map(toner => (
                    <tr key={toner.id}>
                      <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                        {toner.modelo}
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                        {toner.cor === 'black' ? 'Preto' : 
                         toner.cor === 'cyan' ? 'Ciano' : 
                         toner.cor === 'magenta' ? 'Magenta' : 'Amarelo'}
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200 capitalize">
                        {toner.tipo}
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                        {toner.capacidadeFolhas.toLocaleString()} páginas
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-200">
                        R$ {(toner.precoCompra / toner.capacidadeFolhas).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(toner)}
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(toner.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {toners.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-sm text-center text-secondary-500 dark:text-secondary-400">
                        Nenhum toner cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroToners;