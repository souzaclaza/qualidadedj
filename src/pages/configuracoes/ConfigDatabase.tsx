import React, { useState, useEffect } from 'react';
import { Save, Database, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { testConnection, createTables } from '../../lib/db';

const ConfigDatabase: React.FC = () => {
  const [formData, setFormData] = useState({
    DB_HOST: '',
    DB_PORT: '3306',
    DB_USER: '',
    DB_PASSWORD: '',
    DB_NAME: ''
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'loading' | null;
    message: string;
  }>({ type: null, message: '' });

  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const env = import.meta.env;
    setFormData({
      DB_HOST: env.VITE_DB_HOST || '',
      DB_PORT: env.VITE_DB_PORT || '3306',
      DB_USER: env.VITE_DB_USER || '',
      DB_PASSWORD: env.VITE_DB_PASSWORD || '',
      DB_NAME: env.VITE_DB_NAME || ''
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTest = async () => {
    setIsTesting(true);
    setStatus({ type: 'loading', message: 'Testando conexão...' });

    try {
      const result = await testConnection();
      if (result.success) {
        setStatus({ type: 'success', message: result.message });
        
        // Se a conexão for bem sucedida, criar/verificar tabelas
        const tablesResult = await createTables();
        if (tablesResult.success) {
          setStatus({ type: 'success', message: 'Conexão estabelecida e tabelas verificadas com sucesso!' });
        } else {
          setStatus({ 
            type: 'error', 
            message: `Conexão estabelecida, mas houve um erro ao criar tabelas: ${tablesResult.error}` 
          });
        }
      } else {
        setStatus({ type: 'error', message: `Erro na conexão: ${result.error}` });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Erro ao testar conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTest();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Configurações do Banco de Dados
      </h1>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="DB_HOST" className="form-label">Host</label>
              <input
                type="text"
                id="DB_HOST"
                name="DB_HOST"
                value={formData.DB_HOST}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: localhost"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="DB_PORT" className="form-label">Porta</label>
              <input
                type="text"
                id="DB_PORT"
                name="DB_PORT"
                value={formData.DB_PORT}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: 3306"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="DB_USER" className="form-label">Usuário</label>
            <input
              type="text"
              id="DB_USER"
              name="DB_USER"
              value={formData.DB_USER}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="DB_PASSWORD" className="form-label">Senha</label>
            <input
              type="password"
              id="DB_PASSWORD"
              name="DB_PASSWORD"
              value={formData.DB_PASSWORD}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="DB_NAME" className="form-label">Nome do Banco</label>
            <input
              type="text"
              id="DB_NAME"
              name="DB_NAME"
              value={formData.DB_NAME}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {status.type && (
            <div className={`p-4 rounded-lg flex items-start space-x-2 ${
              status.type === 'success' ? 'bg-green-50 dark:bg-green-900/30' :
              status.type === 'error' ? 'bg-red-50 dark:bg-red-900/30' :
              'bg-blue-50 dark:bg-blue-900/30'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : status.type === 'error' ? (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              ) : (
                <Loader className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-spin" />
              )}
              <p className={`text-sm ${
                status.type === 'success' ? 'text-green-800 dark:text-green-200' :
                status.type === 'error' ? 'text-red-800 dark:text-red-200' :
                'text-blue-800 dark:text-blue-200'
              }`}>
                {status.message}
              </p>
            </div>
          )}

          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Certifique-se de que o banco de dados existe e o usuário tem as permissões necessárias.
              Após salvar, o sistema criará automaticamente todas as tabelas necessárias.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleTest}
              className="btn btn-secondary"
              disabled={isTesting}
            >
              <Database className="h-4 w-4 mr-2" />
              Testar Conexão
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isTesting}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigDatabase;