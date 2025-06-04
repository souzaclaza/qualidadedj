import React, { useState } from 'react';
import { Save, Plus, AlertCircle } from 'lucide-react';
import { usePopItStore } from '../../stores/popItStore';

const CadastroPopIt: React.FC = () => {
  const { addPopIt, setores, addSetor } = usePopItStore();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [setor, setSetor] = useState('');
  const [novoSetor, setNovoSetor] = useState('');
  const [showSetorInput, setShowSetorInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo || !setor) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    const popIt = {
      id: Date.now().toString(),
      titulo,
      descricao: descricao || undefined,
      setor,
      versaoAtual: 0,
      dataEnvio: new Date()
    };
    
    addPopIt(popIt);
    
    setTitulo('');
    setDescricao('');
    setSetor('');
    
    alert('POP/IT cadastrado com sucesso!');
  };

  const handleAddSetor = () => {
    if (novoSetor.trim()) {
      addSetor(novoSetor.trim());
      setSetor(novoSetor.trim());
      setNovoSetor('');
      setShowSetorInput(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Cadastro de POP/IT
      </h1>
      
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="titulo" className="form-label">Título do POP/IT</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="form-input"
              placeholder="Ex: Instruções de Armazenamento"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="descricao" className="form-label">Descrição (opcional)</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="form-input"
              rows={3}
              placeholder="Descreva o objetivo ou conteúdo do documento"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="setor" className="form-label">Setor Responsável</label>
            {!showSetorInput ? (
              <div className="flex gap-2">
                <select
                  id="setor"
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  className="form-select flex-1"
                  required
                >
                  <option value="">Selecione um setor</option>
                  {setores.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowSetorInput(true)}
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
                  onClick={() => setShowSetorInput(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Após cadastrar o título do POP/IT, você poderá fazer upload do arquivo correspondente.
            </p>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroPopIt;