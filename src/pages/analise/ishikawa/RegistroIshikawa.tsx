import React, { useState } from 'react';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useIshikawaStore } from '../../../stores/ishikawaStore';

const CATEGORIAS = [
  'Método',
  'Máquina',
  'Mão de Obra',
  'Material',
  'Medição',
  'Meio Ambiente'
];

interface Causa {
  categoria: string;
  descricao: string;
}

const RegistroIshikawa: React.FC = () => {
  const { setores, addSetor, addAnalise } = useIshikawaStore();
  const [showNewSetor, setShowNewSetor] = useState(false);
  const [novoSetor, setNovoSetor] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    setor: '',
    responsavel: '',
    data: new Date().toISOString().split('T')[0],
    causas: {} as Record<string, Causa[]>
  });

  // Initialize causas object with empty arrays for each category
  useState(() => {
    const initialCausas = CATEGORIAS.reduce((acc, categoria) => {
      acc[categoria] = [];
      return acc;
    }, {} as Record<string, Causa[]>);
    setFormData(prev => ({ ...prev, causas: initialCausas }));
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCausa = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      causas: {
        ...prev.causas,
        [categoria]: [...prev.causas[categoria], { categoria, descricao: '' }]
      }
    }));
  };

  const handleRemoveCausa = (categoria: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      causas: {
        ...prev.causas,
        [categoria]: prev.causas[categoria].filter((_, i) => i !== index)
      }
    }));
  };

  const handleCausaChange = (categoria: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      causas: {
        ...prev.causas,
        [categoria]: prev.causas[categoria].map((causa, i) => 
          i === index ? { ...causa, descricao: value } : causa
        )
      }
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
    alert('Análise Ishikawa registrada com sucesso!');
    
    // Reset form
    setFormData({
      titulo: '',
      setor: '',
      responsavel: '',
      data: new Date().toISOString().split('T')[0],
      causas: CATEGORIAS.reduce((acc, categoria) => {
        acc[categoria] = [];
        return acc;
      }, {} as Record<string, { categoria: string; descricao: string; }[]>)
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Registro de Análise Ishikawa
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações Básicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">Título do Problema</label>
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
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Causas por Categoria
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIAS.map(categoria => (
              <div key={categoria} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-secondary-900 dark:text-white">
                    {categoria}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddCausa(categoria)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.causas[categoria]?.map((causa, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={causa.descricao}
                        onChange={(e) => handleCausaChange(categoria, index, e.target.value)}
                        className="form-input flex-1"
                        placeholder={`Causa de ${categoria}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCausa(categoria, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {(!formData.causas[categoria] || formData.causas[categoria].length === 0) && (
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 italic">
                      Nenhuma causa adicionada
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Adicione pelo menos uma causa em cada categoria relevante para o problema.
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

export default RegistroIshikawa;