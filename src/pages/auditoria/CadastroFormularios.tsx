import React, { useState } from 'react';
import { Plus, Save, Trash2, AlertCircle } from 'lucide-react';
import { useAuditoriaStore } from '../../stores/auditoriaStore';
import { FormularioAuditoria, ItemAuditavel } from '../../types';
import clsx from 'clsx';

const CadastroFormularios: React.FC = () => {
  const { addFormulario } = useAuditoriaStore();
  const [titulo, setTitulo] = useState('');
  const [processoArea, setProcessoArea] = useState('');
  const [itens, setItens] = useState<ItemAuditavel[]>([]);
  const [linkEvidencias, setLinkEvidencias] = useState('');
  const [observacoesGap, setObservacoesGap] = useState('');
  const [observacoesMelhoria, setObservacoesMelhoria] = useState('');
  const [responsavelSetor, setResponsavelSetor] = useState('');

  const [novoItem, setNovoItem] = useState({
    descricao: '',
    tipo: 'conforme' as const,
    observacao: ''
  });

  const handleAddItem = () => {
    if (novoItem.descricao.trim()) {
      setItens([
        ...itens,
        {
          id: Date.now().toString(),
          ...novoItem
        }
      ]);
      setNovoItem({
        descricao: '',
        tipo: 'conforme',
        observacao: ''
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !processoArea || itens.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um item auditável.');
      return;
    }

    const formulario: FormularioAuditoria = {
      id: Date.now().toString(),
      titulo,
      processoArea,
      itens,
      linkEvidencias,
      observacoesGap,
      observacoesMelhoria,
      responsavelSetor
    };

    addFormulario(formulario);
    
    // Reset form
    setTitulo('');
    setProcessoArea('');
    setItens([]);
    setLinkEvidencias('');
    setObservacoesGap('');
    setObservacoesMelhoria('');
    setResponsavelSetor('');

    alert('Formulário cadastrado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Cadastro de Formulários de Auditoria
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações da Auditoria */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações do Formulário
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">Título do Formulário</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="processoArea" className="form-label">Processo ou Área a Ser Auditada</label>
              <input
                type="text"
                id="processoArea"
                value={processoArea}
                onChange={(e) => setProcessoArea(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Itens Auditáveis */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Itens Auditáveis
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="itemDescricao" className="form-label">Item a Ser Auditado</label>
                <input
                  type="text"
                  id="itemDescricao"
                  value={novoItem.descricao}
                  onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemTipo" className="form-label">Tipo do Item</label>
                <select
                  id="itemTipo"
                  value={novoItem.tipo}
                  onChange={(e) => setNovoItem({ ...novoItem, tipo: e.target.value as 'conforme' | 'percentual' })}
                  className="form-select"
                >
                  <option value="conforme">Conforme / Não Conforme</option>
                  <option value="percentual">Percentual</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="itemObservacao" className="form-label">Observação do Item</label>
              <textarea
                id="itemObservacao"
                value={novoItem.observacao}
                onChange={(e) => setNovoItem({ ...novoItem, observacao: e.target.value })}
                className="form-input"
                rows={2}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2 text-secondary-900 dark:text-white">
                Itens Adicionados
              </h3>

              <div className="space-y-2">
                {itens.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-secondary-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-secondary-900 dark:text-white">
                          {index + 1}. {item.descricao}
                        </span>
                        <span className={clsx(
                          "ml-2 px-2 py-1 text-xs rounded-full",
                          item.tipo === 'conforme'
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        )}>
                          {item.tipo === 'conforme' ? 'Conforme/Não Conforme' : 'Percentual'}
                        </span>
                      </div>
                      {item.observacao && (
                        <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                          {item.observacao}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {itens.length === 0 && (
                  <div className="text-center py-4 text-secondary-500 dark:text-secondary-400">
                    Nenhum item adicionado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações Adicionais
          </h2>

          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="linkEvidencias" className="form-label">Link das Evidências</label>
              <input
                type="url"
                id="linkEvidencias"
                value={linkEvidencias}
                onChange={(e) => setLinkEvidencias(e.target.value)}
                className="form-input"
                placeholder="https://"
              />
            </div>

            <div className="form-group">
              <label htmlFor="observacoesGap" className="form-label">Observações de GAP</label>
              <textarea
                id="observacoesGap"
                value={observacoesGap}
                onChange={(e) => setObservacoesGap(e.target.value)}
                className="form-input"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="observacoesMelhoria" className="form-label">Observações de Melhoria</label>
              <textarea
                id="observacoesMelhoria"
                value={observacoesMelhoria}
                onChange={(e) => setObservacoesMelhoria(e.target.value)}
                className="form-input"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsavelSetor" className="form-label">Responsável do Setor</label>
              <input
                type="text"
                id="responsavelSetor"
                value={responsavelSetor}
                onChange={(e) => setResponsavelSetor(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Alertas e Botão de Salvar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Certifique-se de adicionar todos os itens necessários antes de salvar o formulário.
              Uma vez criado, o formulário estará disponível para realização de auditorias.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Salvar Formulário
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFormularios;