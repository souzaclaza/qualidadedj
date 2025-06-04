import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useNCStore } from '../../stores/ncStore';
import { useNavigate } from 'react-router-dom';

const AnaliseNC: React.FC = () => {
  const navigate = useNavigate();
  const { ncs, addAnalise } = useNCStore();
  const [selectedNC, setSelectedNC] = useState('');
  const [formData, setFormData] = useState({
    porques: ['', '', '', '', ''],
    responsavel: '',
    dataAnalise: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePorqueChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      porques: prev.porques.map((p, i) => i === index ? value : p)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const analise = {
      id: Date.now().toString(),
      ncId: selectedNC,
      porques: formData.porques,
      responsavel: formData.responsavel,
      dataAnalise: new Date(formData.dataAnalise)
    };

    addAnalise(analise);
    navigate('/nc/plano-acao');
  };

  // Filter NCs that are in 'registro' status
  const ncsParaAnalise = ncs.filter(nc => nc.status === 'registro');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Análise de Não Conformidade
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Selecionar NC
          </h2>

          <div className="form-group">
            <label htmlFor="nc" className="form-label">Não Conformidade</label>
            <select
              id="nc"
              value={selectedNC}
              onChange={(e) => setSelectedNC(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Selecione uma NC</option>
              {ncsParaAnalise.map(nc => (
                <option key={nc.id} value={nc.id}>
                  {nc.numero} - {nc.titulo}
                </option>
              ))}
            </select>
          </div>

          {selectedNC && (
            <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                Detalhes da NC
              </h3>
              {(() => {
                const nc = ncs.find(n => n.id === selectedNC);
                if (!nc) return null;

                return (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Descrição:</span> {nc.descricao}</p>
                    <p><span className="font-medium">Área/Setor:</span> {nc.areaSetor}</p>
                    <p><span className="font-medium">Classificação:</span> {nc.classificacao}</p>
                    <p><span className="font-medium">Gravidade:</span> {nc.gravidade}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Análise dos 5 Porquês
          </h2>

          <div className="space-y-4">
            {formData.porques.map((porque, index) => (
              <div key={index} className="form-group">
                <label className="form-label">
                  {index + 1}º Por quê?
                  {index === 0 && ' (causa imediata)'}
                  {index === 4 && ' (causa raiz)'}
                </label>
                <textarea
                  value={porque}
                  onChange={(e) => handlePorqueChange(index, e.target.value)}
                  className="form-input"
                  rows={2}
                  required={index === 0} // Only first "why" is required
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Responsável pela Análise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="responsavel" className="form-label">Nome do Responsável</label>
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
              <label htmlFor="dataAnalise" className="form-label">Data da Análise</label>
              <input
                type="date"
                id="dataAnalise"
                name="dataAnalise"
                value={formData.dataAnalise}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Após concluir a análise, a NC será automaticamente enviada para a etapa de Plano de Ação.
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!selectedNC}
          >
            <Save className="h-4 w-4 mr-2" />
            Concluir Análise
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnaliseNC;