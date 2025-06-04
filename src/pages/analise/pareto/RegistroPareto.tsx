import React, { useState } from 'react';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useParetoStore } from '../../../stores/paretoStore';

const RegistroPareto: React.FC = () => {
  const { setores, addSetor, addAnalise } = useParetoStore();
  const [showNewSetor, setShowNewSetor] = useState(false);
  const [novoSetor, setNovoSetor] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    setor: '',
    responsavel: '',
    data: new Date().toISOString().split('T')[0],
    causas: [] as Causa[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCausa = () => {
    setFormData(prev => ({
      ...prev,
      causas: [...prev.causas, { descricao: '', frequencia: 0 }]
    }));
  };

  const handleRemoveCausa = (index: number) => {
    setFormData(prev => ({
      ...prev,
      causas: prev.causas.filter((_, i) => i !== index)
    }));
  };

  const handleCausaChange = (index: number, field: keyof Causa, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      causas: prev.causas.map((causa, i) => 
        i === index ? { ...causa, [field]: value } : causa
      )
    }));
  };

  const handleAddSetor = () => {
    if (novoSetor.trim()) {
      addSetor(novoSetor.trim());
      setFormData(prev => ({ ...prev, setor: novoSetor.trim() }));
      setNovoSetor('');
      setShowNewSetor(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAnalise = {
      id: Date.now().toString(),
      ...formData
    };

    addAnalise(newAnalise);
    alert('Análise de Pareto registrada com sucesso!');
    
    // Reset form
    setFormData({
      titulo: '',
      setor: '',
      responsavel: '',
      data: new Date().toISOString().split('T')[0],
      causas: []
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Registro de Análise de Pareto
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações Básicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">Título do Relatório</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="setor" className="form-label">Setor</label>
              {!showNewSetor ? (
                <div className="flex gap-2">
                  <select
                    id="setor"
                    name="setor"
                    value={formData.setor}
                    onChange={handleChange}
                    className="form-select flex-1"
                    required
                  >
                    <option value="">Selecione um setor</option>
                    {setores.map(setor => (
                      <option key={setor} value={setor}>{setor}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewSetor(true)}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novoSetor}
                    onChange={(e) => setNovoSetor(e.target.value)}
                    className="form-input flex-1"
                    placeholder="Digite o nome do novo setor"
                  />
                  <button
                    type="button"
                    onClick={handleAddSetor}
                    className="btn btn-primary"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewSetor(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="responsavel" className="form-label">Responsável</label>
              <input
                type="text"
                id="responsavel"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="data" className="form-label">Data</label>
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Causas e Frequências
            </h2>
            <button
              type="button"
              onClick={handleAddCausa}
              className="btn btn-secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Causa
            </button>
          </div>

          <div className="space-y-4">
            {formData.causas.map((causa, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={causa.descricao}
                    onChange={(e) => handleCausaChange(index, 'descricao', e.target.value)}
                    className="form-input"
                    placeholder="Descrição da causa"
                    required
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={causa.frequencia}
                    onChange={(e) => handleCausaChange(index, 'frequencia', parseInt(e.target.value))}
                    className="form-input"
                    placeholder="Frequência"
                    min="0"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCausa(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {formData.causas.length === 0 && (
              <p className="text-center text-secondary-500 dark:text-secondary-400 py-4">
                Nenhuma causa adicionada. Clique em "Adicionar Causa" para começar.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Adicione todas as causas relevantes e suas respectivas frequências para gerar o gráfico de Pareto.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Registrar Análise
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroPareto;