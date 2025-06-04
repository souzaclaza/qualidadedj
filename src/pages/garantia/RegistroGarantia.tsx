import React, { useState } from 'react';
import { Save, Plus, Trash2, Upload, AlertCircle } from 'lucide-react';
import { useGarantiaStore } from '../../stores/garantiaStore';
import { useTonerStore } from '../../stores/tonerStore';
import { ItemGarantia } from '../../types';

const RegistroGarantia: React.FC = () => {
  const { addGarantia } = useGarantiaStore();
  const [formData, setFormData] = useState({
    solicitante: '',
    itens: [] as ItemGarantia[],
    dataSolicitacao: '',
    numeroSerie: '',
    nfCompra: {
      numero: '',
      arquivo: ''
    },
    nfRemessaSimples: {
      numero: '',
      arquivo: ''
    },
    nfDevolucao: {
      numero: '',
      arquivo: ''
    },
    dataDespacho: '',
    numeroTicket: '',
    observacao: '',
    status: 'em-aberto' as const,
    observacaoFinal: ''
  });

  const [novoItem, setNovoItem] = useState({
    modeloToner: '',
    quantidade: 1,
    valorUnitario: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNFChange = (tipo: 'compra' | 'remessaSimples' | 'devolucao', campo: 'numero' | 'arquivo', valor: string) => {
    setFormData(prev => ({
      ...prev,
      [`nf${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`]: {
        ...prev[`nf${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`],
        [campo]: valor
      }
    }));
  };

  const handleFileUpload = (tipo: 'compra' | 'remessaSimples' | 'devolucao', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleNFChange(tipo, 'arquivo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoItem(prev => ({
      ...prev,
      [name]: name === 'modeloToner' ? value : parseFloat(value) || 0
    }));
  };

  const adicionarItem = () => {
    if (!novoItem.modeloToner || novoItem.quantidade <= 0 || novoItem.valorUnitario <= 0) {
      alert('Preencha todos os campos do item corretamente');
      return;
    }

    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, { ...novoItem }]
    }));

    setNovoItem({
      modeloToner: '',
      quantidade: 1,
      valorUnitario: 0
    });
  };

  const removerItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }));
  };

  const calcularValorTotal = () => {
    return formData.itens.reduce((total, item) => 
      total + (item.quantidade * item.valorUnitario), 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.itens.length === 0) {
      alert('Adicione pelo menos um item');
      return;
    }

    if (!formData.nfCompra.arquivo) {
      alert('O upload da Nota Fiscal de Compra é obrigatório');
      return;
    }

    const garantia = {
      id: Date.now().toString(),
      ...formData,
      valorTotal: calcularValorTotal()
    };

    addGarantia(garantia);
    alert('Garantia registrada com sucesso!');
    
    // Reset form
    setFormData({
      solicitante: '',
      itens: [],
      dataSolicitacao: '',
      numeroSerie: '',
      nfCompra: { numero: '', arquivo: '' },
      nfRemessaSimples: { numero: '', arquivo: '' },
      nfDevolucao: { numero: '', arquivo: '' },
      dataDespacho: '',
      numeroTicket: '',
      observacao: '',
      status: 'em-aberto',
      observacaoFinal: ''
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Registro de Garantia
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações Básicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="solicitante" className="form-label">Solicitante</label>
              <input
                type="text"
                id="solicitante"
                name="solicitante"
                value={formData.solicitante}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Nome do colaborador"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataSolicitacao" className="form-label">Data da Solicitação</label>
              <input
                type="date"
                id="dataSolicitacao"
                name="dataSolicitacao"
                value={formData.dataSolicitacao}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Itens da Garantia */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Itens da Garantia
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-group md:col-span-2">
                <label htmlFor="modeloToner" className="form-label">Produto</label>
                <input
                  type="text"
                  id="modeloToner"
                  name="modeloToner"
                  value={novoItem.modeloToner}
                  onChange={handleItemChange}
                  className="form-input"
                  placeholder="Ex: HP 26A"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantidade" className="form-label">Quantidade</label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={novoItem.quantidade}
                  onChange={handleItemChange}
                  className="form-input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="valorUnitario" className="form-label">Valor Unitário</label>
                <input
                  type="number"
                  id="valorUnitario"
                  name="valorUnitario"
                  value={novoItem.valorUnitario}
                  onChange={handleItemChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={adicionarItem}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Valor Unitário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
                  {formData.itens.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                        {item.modeloToner}
                      </td>
                      <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                        {item.quantidade}
                      </td>
                      <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                        R$ {item.valorUnitario.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                        R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <button
                          type="button"
                          onClick={() => removerItem(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {formData.itens.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                        Nenhum item adicionado
                      </td>
                    </tr>
                  )}
                </tbody>
                {formData.itens.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-sm font-medium text-right text-secondary-900 dark:text-secondary-200">
                        Valor Total:
                      </td>
                      <td colSpan={2} className="px-4 py-4 text-sm font-bold text-secondary-900 dark:text-secondary-200">
                        R$ {calcularValorTotal().toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Informações da Garantia */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações da Garantia
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="numeroSerie" className="form-label">Número de Série</label>
                <input
                  type="text"
                  id="numeroSerie"
                  name="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">Status da Garantia</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="em-aberto">Em aberto</option>
                  <option value="em-tratativa">Em tratativa com o fornecedor</option>
                  <option value="credito">Virou crédito no fornecedor</option>
                  <option value="conserto">Será consertado</option>
                  <option value="troca">Será trocado</option>
                  <option value="devolucao">Devolveu o dinheiro</option>
                </select>
              </div>
            </div>

            {/* Notas Fiscais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Nota Fiscal de Compra</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Número da NF"
                    value={formData.nfCompra.numero}
                    onChange={(e) => handleNFChange('compra', 'numero', e.target.value)}
                    className="form-input"
                  />
                  <label className="btn btn-secondary w-full cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.nfCompra.arquivo ? 'PDF Selecionado' : 'Upload PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('compra', file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nota Fiscal de Remessa Simples</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Número da NF"
                    value={formData.nfRemessaSimples.numero}
                    onChange={(e) => handleNFChange('remessaSimples', 'numero', e.target.value)}
                    className="form-input"
                  />
                  <label className="btn btn-secondary w-full cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.nfRemessaSimples.arquivo ? 'PDF Selecionado' : 'Upload PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('remessaSimples', file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nota Fiscal de Devolução</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Número da NF"
                    value={formData.nfDevolucao.numero}
                    onChange={(e) => handleNFChange('devolucao', 'numero', e.target.value)}
                    className="form-input"
                  />
                  <label className="btn btn-secondary w-full cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.nfDevolucao.arquivo ? 'PDF Selecionado' : 'Upload PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('devolucao', file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="dataDespacho" className="form-label">Data de Despacho</label>
                <input
                  type="date"
                  id="dataDespacho"
                  name="dataDespacho"
                  value={formData.dataDespacho}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="numeroTicket" className="form-label">Número do Ticket/OS</label>
                <input
                  type="text"
                  id="numeroTicket"
                  name="numeroTicket"
                  value={formData.numeroTicket}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="observacao" className="form-label">Observações Adicionais</label>
              <textarea
                id="observacao"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                className="form-input"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="observacaoFinal" className="form-label">Observação Final</label>
              <textarea
                id="observacaoFinal"
                name="observacaoFinal"
                value={formData.observacaoFinal}
                onChange={handleChange}
                className="form-input"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Alertas e Botão de Salvar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Certifique-se de anexar a Nota Fiscal de Compra (obrigatória) e preencher todos os campos necessários.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Registrar Garantia
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroGarantia;