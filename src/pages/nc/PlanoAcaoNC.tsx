import React, { useState } from 'react';
import { Save, Plus, Trash2, Upload, AlertCircle } from 'lucide-react';
import { useNCStore } from '../../stores/ncStore';
import { useNavigate } from 'react-router-dom';
import { NCAcao } from '../../types';

const PlanoAcaoNC: React.FC = () => {
  const navigate = useNavigate();
  const { ncs, analises, addAcao } = useNCStore();
  const [selectedNC, setSelectedNC] = useState('');
  const [acoes, setAcoes] = useState<Omit<NCAcao, 'id' | 'ncId'>[]>([]);
  
  const handleAddAcao = () => {
    setAcoes([...acoes, {
      descricao: '',
      responsavel: '',
      dataLimite: '',
      recursos: '',
      status: 'pendente',
      evidencia: ''
    }]);
  };

  const handleRemoveAcao = (index: number) => {
    setAcoes(acoes.filter((_, i) => i !== index));
  };

  const handleAcaoChange = (index: number, field: keyof Omit<NCAcao, 'id' | 'ncId'>, value: string) => {
    setAcoes(acoes.map((acao, i) => 
      i === index ? { ...acao, [field]: value } : acao
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add all actions
    acoes.forEach(acao => {
      addAcao({
        id: Date.now().toString(),
        ncId: selectedNC,
        ...acao,
        dataLimite: new Date(acao.dataLimite)
      });
    });

    navigate('/nc/verificacao');
  };

  // Filter NCs that are in 'plano-acao' status
  const ncsParaPlanoAcao = ncs.filter(nc => nc.status === 'plano-acao');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Plano de Ação - Não Conformidade
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
              {ncsParaPlanoAcao.map(nc => (
                <option key={nc.id} value={nc.id}>
                  {nc.numero} - {nc.titulo}
                </option>
              ))}
            </select>
          </div>

          {selectedNC && (
            <>
              <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                  Detalhes da NC
                </h3>
                {(() => {
                  const nc = ncs.find(n => n.id === selectedNC);
                  const analise = analises.find(a => a.ncId === selectedNC);
                  if (!nc || !analise) return null;

                  return (
                    <div className="space-y-4 text-sm">
                      <div>
                        <p><span className="font-medium">Descrição:</span> {nc.descricao}</p>
                        <p><span className="font-medium">Área/Setor:</span> {nc.areaSetor}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Análise dos 5 Porquês:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {analise.porques.map((porque, index) => 
                            porque && (
                              <li key={index}>
                                {index + 1}º Por quê: {porque}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                  Ações Corretivas
                </h3>
                <button
                  type="button"
                  onClick={handleAddAcao}
                  className="btn btn-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ação
                </button>
              </div>

              <div className="mt-4 space-y-6">
                {acoes.map((acao, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 dark:border-secondary-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-secondary-900 dark:text-white">
                        Ação #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveAcao(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Descrição da Ação</label>
                        <textarea
                          value={acao.descricao}
                          onChange={(e) => handleAcaoChange(index, 'descricao', e.target.value)}
                          className="form-input"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Recursos Necessários</label>
                        <textarea
                          value={acao.recursos}
                          onChange={(e) => handleAcaoChange(index, 'recursos', e.target.value)}
                          className="form-input"
                          rows={2}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Responsável</label>
                        <input
                          type="text"
                          value={acao.responsavel}
                          onChange={(e) => handleAcaoChange(index, 'responsavel', e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Data Limite</label>
                        <input
                          type="date"
                          value={acao.dataLimite}
                          onChange={(e) => handleAcaoChange(index, 'dataLimite', e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          value={acao.status}
                          onChange={(e) => handleAcaoChange(index, 'status', e.target.value as NCAcao['status'])}
                          className="form-select"
                          required
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em-andamento">Em Andamento</option>
                          <option value="concluida">Concluída</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Evidência</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={acao.evidencia}
                            onChange={(e) => handleAcaoChange(index, 'evidencia', e.target.value)}
                            className="form-input"
                            placeholder="Link ou referência do documento"
                          />
                          <label className="btn btn-secondary cursor-pointer">
                            <Upload className="h-4 w-4" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleAcaoChange(index, 'evidencia', file.name);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {acoes.length === 0 && (
                  <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
                    Nenhuma ação cadastrada. Clique em "Adicionar Ação" para começar.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Após concluir todas as ações, a NC será automaticamente enviada para a etapa de Verificação.
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!selectedNC || acoes.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Plano de Ação
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanoAcaoNC;