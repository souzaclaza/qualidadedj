import React, { useState } from 'react';
import { Save, AlertCircle, Check, X } from 'lucide-react';
import { useAuditoriaStore } from '../../stores/auditoriaStore';
import { Auditoria } from '../../types';
import clsx from 'clsx';

const mockFiliais = [
  { id: '1', nome: 'São Paulo' },
  { id: '2', nome: 'Rio de Janeiro' },
  { id: '3', nome: 'Belo Horizonte' }
];

const RegistroAuditoria: React.FC = () => {
  const { formularios, addAuditoria } = useAuditoriaStore();
  const [selectedFormulario, setSelectedFormulario] = useState('');
  const [auditor, setAuditor] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidade, setUnidade] = useState('');
  const [respostas, setRespostas] = useState<Auditoria['respostas']>([]);

  const handleFormularioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formularioId = e.target.value;
    setSelectedFormulario(formularioId);

    if (formularioId) {
      const formulario = formularios.find(f => f.id === formularioId);
      if (formulario) {
        setRespostas(
          formulario.itens.map(item => ({
            itemId: item.id,
            conforme: undefined,
            percentual: undefined,
            observacao: ''
          }))
        );
      }
    } else {
      setRespostas([]);
    }
  };

  const handleRespostaChange = (itemId: string, campo: string, valor: any) => {
    setRespostas(prev =>
      prev.map(resposta =>
        resposta.itemId === itemId
          ? { ...resposta, [campo]: valor }
          : resposta
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFormulario || !auditor || !dataInicio || !dataFim || !unidade) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const auditoria: Auditoria = {
      id: Date.now().toString(),
      formularioId: selectedFormulario,
      auditor,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      unidade,
      respostas
    };

    addAuditoria(auditoria);
    
    // Reset form
    setSelectedFormulario('');
    setAuditor('');
    setDataInicio('');
    setDataFim('');
    setUnidade('');
    setRespostas([]);

    alert('Auditoria registrada com sucesso!');
  };

  const formularioSelecionado = formularios.find(f => f.id === selectedFormulario);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Registro de Auditoria
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações da Auditoria */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações da Auditoria
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="auditor" className="form-label">Nome do Auditor</label>
              <input
                type="text"
                id="auditor"
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="unidade" className="form-label">Unidade a Ser Auditada</label>
              <select
                id="unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Selecione uma unidade</option>
                {mockFiliais.map(filial => (
                  <option key={filial.id} value={filial.nome}>
                    {filial.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dataInicio" className="form-label">Data de Início</label>
              <input
                type="date"
                id="dataInicio"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFim" className="form-label">Data de Fim</label>
              <input
                type="date"
                id="dataFim"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="form-input"
                required
                min={dataInicio}
              />
            </div>
          </div>
        </div>

        {/* Seleção do Formulário */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Formulário de Auditoria
          </h2>

          <div className="form-group">
            <label htmlFor="formulario" className="form-label">Selecione o Formulário</label>
            <select
              id="formulario"
              value={selectedFormulario}
              onChange={handleFormularioChange}
              className="form-select"
              required
            >
              <option value="">Selecione um formulário</option>
              {formularios.map(formulario => (
                <option key={formulario.id} value={formulario.id}>
                  {formulario.titulo}
                </option>
              ))}
            </select>
          </div>

          {formularioSelecionado && (
            <div className="mt-4">
              <div className="bg-secondary-50 dark:bg-secondary-800/50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-secondary-900 dark:text-white">
                  {formularioSelecionado.titulo}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Processo/Área: {formularioSelecionado.processoArea}
                </p>
              </div>

              <div className="space-y-4">
                {formularioSelecionado.itens.map((item, index) => {
                  const resposta = respostas.find(r => r.itemId === item.id);

                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-900 dark:text-white">
                            {index + 1}. {item.descricao}
                          </h4>
                          {item.observacao && (
                            <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                              {item.observacao}
                            </p>
                          )}
                        </div>
                        <span className={clsx(
                          "ml-2 px-2 py-1 text-xs rounded-full",
                          item.tipo === 'conforme'
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        )}>
                          {item.tipo === 'conforme' ? 'Conforme/Não Conforme' : 'Percentual'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {item.tipo === 'conforme' ? (
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleRespostaChange(item.id, 'conforme', true)}
                              className={clsx(
                                "flex items-center px-3 py-2 rounded-lg border transition-colors",
                                resposta?.conforme === true
                                  ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200"
                                  : "border-gray-300 hover:bg-gray-50 dark:border-secondary-600 dark:hover:bg-secondary-700"
                              )}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Conforme
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRespostaChange(item.id, 'conforme', false)}
                              className={clsx(
                                "flex items-center px-3 py-2 rounded-lg border transition-colors",
                                resposta?.conforme === false
                                  ? "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200"
                                  : "border-gray-300 hover:bg-gray-50 dark:border-secondary-600 dark:hover:bg-secondary-700"
                              )}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Não Conforme
                            </button>
                          </div>
                        ) : (
                          <div className="form-group">
                            <label className="form-label">Percentual de Acuracidade</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={resposta?.percentual || ''}
                              onChange={(e) => handleRespostaChange(item.id, 'percentual', parseFloat(e.target.value))}
                              className="form-input"
                              placeholder="0-100"
                            />
                          </div>
                        )}

                        <div className="form-group">
                          <label className="form-label">Observação</label>
                          <textarea
                            value={resposta?.observacao || ''}
                            onChange={(e) => handleRespostaChange(item.id, 'observacao', e.target.value)}
                            className="form-input"
                            rows={2}
                            placeholder="Adicione uma observação (opcional)"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Alertas e Botão de Salvar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Certifique-se de responder todos os itens antes de finalizar a auditoria.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Finalizar Auditoria
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroAuditoria;