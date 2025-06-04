import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useNCStore } from '../../stores/ncStore';
import { useNavigate } from 'react-router-dom';

const VerificacaoNC: React.FC = () => {
  const navigate = useNavigate();
  const { ncs, acoes, addVerificacao } = useNCStore();
  const [selectedNC, setSelectedNC] = useState('');
  const [formData, setFormData] = useState({
    dataVerificacao: '',
    responsavel: '',
    resolvido: false,
    observacoes: '',
    statusFinal: '' as 'encerrado' | 'reaberto'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const verificacao = {
      id: Date.now().toString(),
      ncId: selectedNC,
      dataVerificacao: new Date(formData.dataVerificacao),
      responsavel: formData.responsavel,
      resolvido: formData.resolvido,
      observacoes: formData.observacoes,
      statusFinal: formData.statusFinal
    };

    addVerificacao(verificacao);
    navigate('/nc/consulta');
  };

  // Filter NCs that are in 'verificacao' status
  const ncsParaVerificacao = ncs.filter(nc => nc.status === 'verificacao');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Verificação e Encerramento
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
              {ncsParaVerificacao.map(nc => (
                <option key={nc.id} value={nc.id}>
                  
                  {nc.numero} - {nc.titulo}
                </option>
              ))}
            </select>
          </div>

          {selectedNC && (
            <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
              <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                Ações Implementadas
              </h3>
              {(() => {
                const acoesNC = acoes.filter(a => a.ncId === selectedNC);
                return (
                  <div className="space-y-4">
                    {acoesNC.map((acao, index) => (
                      <div key={index} className="p-3 bg-white dark:bg-secondary-800 rounded-lg">
                        <p className="font-medium text-secondary-900 dark:text-white">
                          Ação #{index + 1}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                          {acao.descricao}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-secondary-500 dark:text-secondary-400">
                            Responsável: {acao.responsavel}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            acao.status === 'concluida'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : acao.status === 'em-andamento'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {acao.status === 'concluida' ? 'Concluída' :
                             acao.status === 'em-andamento' ? 'Em Andamento' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Verificação da Efetividade
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="dataVerificacao" className="form-label">Data da Verificação</label>
              <input
                type="date"
                id="dataVerificacao"
                name="dataVerificacao"
                value={formData.dataVerificacao}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsavel" className="form-label">Responsável pela Verificação</label>
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
          </div>

          <div className="form-group mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="resolvido"
                checked={formData.resolvido}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-secondary-900 dark:text-white">
                A ação resolveu o problema?
              </span>
            </label>
          </div>

          <div className="form-group mt-4">
            <label htmlFor="observacoes" className="form-label">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="form-input"
              rows={4}
            />
          </div>

          <div className="form-group mt-4">
            <label htmlFor="statusFinal" className="form-label">Status Final</label>
            <select
              id="statusFinal"
              name="statusFinal"
              value={formData.statusFinal}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecione o status</option>
              <option value="encerrado">Encerrado</option>
              <option value="reaberto">Reaberto</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Após a verificação, a NC será encerrada ou reaberta para novo ciclo de tratamento.
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!selectedNC}
          >
            <Save className="h-4 w-4 mr-2" />
            Finalizar Verificação
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificacaoNC;