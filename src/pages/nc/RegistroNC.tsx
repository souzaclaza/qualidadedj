import React, { useState } from 'react';
import { Save, Plus, AlertCircle } from 'lucide-react';
import { useNCStore } from '../../stores/ncStore';

const SETORES = [
  'Produção',
  'Qualidade',
  'Manutenção',
  'Logística',
  'Administrativo',
  'Comercial',
  'TI',
  'RH',
  'Técnico'
];

const RegistroNC: React.FC = () => {
  const { addNC } = useNCStore();
  const [showNewSetor, setShowNewSetor] = useState(false);
  const [novoSetor, setNovoSetor] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    dataOcorrencia: '',
    identificadoPor: '',
    areaSetor: '',
    descricao: '',
    classificacao: '' as 'produto' | 'processo' | 'servico' | 'sistema' | 'cliente' | 'fornecedor',
    tipo: '' as 'conforme' | 'nao-conforme' | 'observacao',
    gravidade: '' as 'leve' | 'media' | 'critica',
    evidencias: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSetor = () => {
    if (novoSetor.trim()) {
      setFormData(prev => ({ ...prev, areaSetor: novoSetor.trim() }));
      setNovoSetor('');
      setShowNewSetor(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newNC = {
      id: Date.now().toString(),
      numero: `NC${new Date().getFullYear()}${String(Date.now()).slice(-4)}`,
      ...formData,
      dataOcorrencia: new Date(formData.dataOcorrencia),
      status: 'registro' as const,
      dataAtualizacao: new Date()
    };

    addNC(newNC);
    alert('NC registrada com sucesso!');
    
    // Reset form
    setFormData({
      titulo: '',
      dataOcorrencia: '',
      identificadoPor: '',
      areaSetor: '',
      descricao: '',
      classificacao: '' as 'produto' | 'processo' | 'servico' | 'sistema' | 'cliente' | 'fornecedor',
      tipo: '' as 'conforme' | 'nao-conforme' | 'observacao',
      gravidade: '' as 'leve' | 'media' | 'critica',
      evidencias: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Registro de Não Conformidade
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações Básicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">Título da NC</label>
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
              <label htmlFor="dataOcorrencia" className="form-label">Data da Ocorrência</label>
              <input
                type="date"
                id="dataOcorrencia"
                name="dataOcorrencia"
                value={formData.dataOcorrencia}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="identificadoPor" className="form-label">Identificado por</label>
              <input
                type="text"
                id="identificadoPor"
                name="identificadoPor"
                value={formData.identificadoPor}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="areaSetor" className="form-label">Área/Setor</label>
              {!showNewSetor ? (
                <div className="flex gap-2">
                  <select
                    id="areaSetor"
                    name="areaSetor"
                    value={formData.areaSetor}
                    onChange={handleChange}
                    className="form-select flex-1"
                    required
                  >
                    <option value="">Selecione um setor</option>
                    {SETORES.map(setor => (
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
          </div>

          <div className="form-group mt-4">
            <label htmlFor="descricao" className="form-label">Descrição da NC</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="form-input"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Classificação e Gravidade
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="classificacao" className="form-label">Classificação</label>
              <select
                id="classificacao"
                name="classificacao"
                value={formData.classificacao}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecione a classificação</option>
                <option value="produto">Produto</option>
                <option value="processo">Processo</option>
                <option value="servico">Serviço</option>
                <option value="sistema">Sistema</option>
                <option value="cliente">Cliente</option>
                <option value="fornecedor">Fornecedor</option>
              </select>
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
                <option value="">Selecione o tipo</option>
                <option value="conforme">Conforme</option>
                <option value="nao-conforme">Não Conforme</option>
                <option value="observacao">Observação</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="gravidade" className="form-label">Gravidade</label>
              <select
                id="gravidade"
                name="gravidade"
                value={formData.gravidade}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecione a gravidade</option>
                <option value="leve">Leve</option>
                <option value="media">Média</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Após registrar a NC, ela será automaticamente enviada para a etapa de Análise.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Registrar NC
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroNC;