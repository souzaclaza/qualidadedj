import React, { useState } from 'react';
import { X, Key, AlertCircle } from 'lucide-react';

interface AdminPasswordModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ 
  onConfirm, 
  onCancel,
  title = "Confirmação de Administrador"
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === '4817') {
      onConfirm();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
            <div className="flex">
              <Key className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Esta operação requer senha de administrador para continuar.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adminPassword" className="form-label">Senha de Administrador</label>
            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;