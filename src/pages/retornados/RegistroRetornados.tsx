import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useTonerStore } from '../../stores/tonerStore';
import { Toner } from '../../types';

const mockFiliais = [
  { id: '1', nome: 'São Paulo' },
  { id: '2', nome: 'Rio de Janeiro' },
  { id: '3', nome: 'Belo Horizonte' }
];

const RegistroRetornados: React.FC = () => {
  const { toners, addRetornados } = useTonerStore();
  const [formData, setFormData] = useState({
    idCliente: '',
    unidade: '',
    modeloToner: '',
    pesoRetornado: 0
  });
  
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [gramaturaRestante, setGramaturaRestante] = useState(0);
  const [porcentagemRestante, setPorcentagemRestante] = useState(0);
  const [sugestao, setSugestao] = useState('');
  const [destinoFinal, setDestinoFinal] = useState('');
  const [valorResgatado, setValorResgatado] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset selected toner when modeloToner changes
  useEffect(() => {
    const toner = toners.find(t => t.id === formData.modeloToner);
    setSelectedToner(toner || null);
  }, [formData.modeloToner, toners]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (selectedToner && formData.pesoRetornado > 0) {
      const gramaturaOriginal = selectedToner.gramatura;
      const gramaturaAtual = selectedToner.pesoCheio - formData.pesoRetornado;
      setGramaturaRestante(gramaturaAtual);
      
      const porcentagem = (gramaturaAtual / gramaturaOriginal) * 100;
      setPorcentagemRestante(parseFloat(porcentagem.toFixed(2)));
      
      if (porcentagem <= 30) {
        setSugestao('Recomendado para descarte devido à baixa gramatura.');
      } else if (porcentagem > 30 && porcentagem <= 50) {
        setSugestao('Testar o toner. Se funcionar bem, enviar para uso interno, caso contrário, solicitar garantia.');
      } else if (porcentagem > 50 && porcentagem < 90) {
        setSugestao('Testar o toner. Se funcionar bem, enviar para estoque como seminovo, caso contrário, solicitar garantia.');
      } else {
        setSugestao('Testar o toner. Se funcionar bem, enviar para estoque como novo, caso contrário, solicitar garantia.');
      }
      
      if (selectedToner.precoCompra && selectedToner.capacidadeFolhas) {
        const folhasRestantes = selectedToner.capacidadeFolhas * (porcentagem / 100);
        const precoFolha = selectedToner.precoCompra / selectedToner.capacidadeFolhas;
        const valor = precoFolha * folhasRestantes;
        setValorResgatado(parseFloat(valor.toFixed(2)));
      }
    } else {
      setGramaturaRestante(0);
      setPorcentagemRestante(0);
      setSugestao('');
      setValorResgatado(0);
    }
  }, [selectedToner, formData.pesoRetornado]);

  const handleDestinoChange = (destino: string) => {
    setDestinoFinal(destino);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinoFinal || !selectedToner) {
      alert('Selecione um destino final para o toner');
      return;
    }
    
    setIsLoading(true);
    
    const novoRetornado = {
      id: Date.now().toString(),
      idCliente: formData.idCliente,
      unidade: formData.unidade,
      modeloToner: selectedToner.modelo,
      pesoRetornado: formData.pesoRetornado,
      gramaturaRestante,
      porcentagemRestante,
      destinoFinal: destinoFinal as 'estoque' | 'uso-interno' | 'descarte' | 'garantia',
      dataRegistro: new Date(),
      valorResgatado: destinoFinal === 'estoque' ? valorResgatado : 0
    };

    addRetornados([novoRetornado]);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setFormData({
          idCliente: '',
          unidade: '',
          modeloToner: '',
          pesoRetornado: 0
        });
        setSelectedToner(null);
        setGramaturaRestante(0);
        setPorcentagemRestante(0);
        setSugestao('');
        setDestinoFinal('');
        setValorResgatado(0);
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  const getColorClass = () => {
    if (porcentagemRestante <= 30) {
      return 'text-red-600 dark:text-red-400';
    } else if (porcentagemRestante <= 50) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else if (porcentagemRestante < 90) {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Registro de Toners Retornados</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
              Dados do Retorno
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="idCliente" className="form-label">ID do Cliente</label>
                <input
                  type="text"
                  id="idCliente"
                  name="idCliente"
                  value={formData.idCliente}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="unidade" className="form-label">Unidade/Filial</label>
                <select
                  id="unidade"
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecione uma filial</option>
                  {mockFiliais.map(filial => (
                    <option key={filial.id} value={filial.nome}>
                      {filial.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="modeloToner" className="form-label">Modelo do Toner</label>
                <select
                  id="modeloToner"
                  name="modeloToner"
                  value={formData.modeloToner}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecione um modelo</option>
                  {toners.map(toner => (
                    <option key={toner.id} value={toner.id}>
                      {toner.modelo} ({toner.tipo})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="pesoRetornado" className="form-label">Peso do Toner Retornado (g)</label>
                <input
                  type="number"
                  id="pesoRetornado"
                  name="pesoRetornado"
                  value={formData.pesoRetornado || ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.1"
                  disabled={!selectedToner}
                />
              </div>
              
              {isSuccess ? (
                <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-green-800 dark:text-green-200">
                    Registro salvo com sucesso!
                  </span>
                </div>
              ) : (
                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isLoading || !selectedToner || !destinoFinal}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Registrar
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedToner ? (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
                  Detalhes do Toner
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Modelo:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{selectedToner.modelo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Tipo:</p>
                    <p className="font-medium text-secondary-900 dark:text-white capitalize">{selectedToner.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Peso Cheio:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{selectedToner.pesoCheio}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Peso Vazio:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{selectedToner.pesoVazio}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Gramatura Original:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">{selectedToner.gramatura}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Capacidade:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {selectedToner.capacidadeFolhas.toLocaleString()} páginas
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Preço de Compra:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      R$ {selectedToner.precoCompra.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Preço por Folha:</p>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      R$ {(selectedToner.precoCompra / selectedToner.capacidadeFolhas).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              {formData.pesoRetornado > 0 && (
                <div className="card">
                  <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
                    Análise do Retornado
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Gramatura Restante:</p>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {gramaturaRestante.toFixed(1)}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Porcentagem Restante:</p>
                        <p className={`font-medium ${getColorClass()}`}>
                          {porcentagemRestante}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Valor Estimado:</p>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          R$ {valorResgatado.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          <span className="font-medium">Sugestão: </span>
                          {sugestao}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2 text-secondary-900 dark:text-white">
                        Selecione o destino final:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDestinoChange('estoque')}
                          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            destinoFinal === 'estoque'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900'
                          }`}
                        >
                          Estoque
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDestinoChange('uso-interno')}
                          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            destinoFinal === 'uso-interno'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900'
                          }`}
                        >
                          Uso Interno
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDestinoChange('descarte')}
                          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            destinoFinal === 'descarte'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900'
                          }`}
                        >
                          Descarte
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDestinoChange('garantia')}
                          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            destinoFinal === 'garantia'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900'
                          }`}
                        >
                          Garantia
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-secondary-500 dark:text-secondary-400">
                  Selecione um modelo de toner para visualizar os detalhes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistroRetornados;