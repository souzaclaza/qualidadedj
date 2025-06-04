import React, { useState } from 'react';
import { Save, Lock, Shield, Clock } from 'lucide-react';

const ConfigSeguranca: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true
  });
  
  const [sessionTimeout, setSessionTimeout] = useState(30);
  
  const handlePasswordPolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    
    setPasswordPolicy({
      ...passwordPolicy,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    
    // Verificar política de senha
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (
      (passwordPolicy.requireUppercase && !hasUppercase) ||
      (passwordPolicy.requireLowercase && !hasLowercase) ||
      (passwordPolicy.requireNumbers && !hasNumbers) ||
      (passwordPolicy.requireSpecial && !hasSpecial) ||
      newPassword.length < passwordPolicy.minLength
    ) {
      alert('A nova senha não atende aos requisitos de segurança.');
      return;
    }
    
    alert('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionTimeout(parseInt(e.target.value));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Configurações de Segurança</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Alterar Senha
            </h2>
          </div>
          
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="mt-4">
              <button type="submit" className="btn btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Salvar Nova Senha
              </button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Política de Senhas
            </h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="minLength" className="form-label">Tamanho Mínimo</label>
            <div className="flex items-center">
              <input
                type="range"
                id="minLength"
                name="minLength"
                min="6"
                max="16"
                value={passwordPolicy.minLength}
                onChange={handlePasswordPolicyChange}
                className="w-full mr-2"
              />
              <span className="text-secondary-900 dark:text-white font-medium">
                {passwordPolicy.minLength} caracteres
              </span>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireUppercase"
                name="requireUppercase"
                checked={passwordPolicy.requireUppercase}
                onChange={handlePasswordPolicyChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="requireUppercase" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                Exigir letra maiúscula
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireLowercase"
                name="requireLowercase"
                checked={passwordPolicy.requireLowercase}
                onChange={handlePasswordPolicyChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="requireLowercase" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                Exigir letra minúscula
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNumbers"
                name="requireNumbers"
                checked={passwordPolicy.requireNumbers}
                onChange={handlePasswordPolicyChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="requireNumbers" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                Exigir números
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireSpecial"
                name="requireSpecial"
                checked={passwordPolicy.requireSpecial}
                onChange={handlePasswordPolicyChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="requireSpecial" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                Exigir caracteres especiais
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="btn btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Salvar Política
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Tempo de Sessão
            </h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="sessionTimeout" className="form-label">
              Encerrar sessão após inatividade
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="sessionTimeout"
                min="5"
                max="60"
                step="5"
                value={sessionTimeout}
                onChange={handleSessionTimeoutChange}
                className="w-full"
              />
              <span className="text-secondary-900 dark:text-white font-medium whitespace-nowrap">
                {sessionTimeout} minutos
              </span>
            </div>
          </div>
          
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
            O sistema encerrará automaticamente a sessão após o período de inatividade selecionado.
          </p>
          
          <div className="mt-6">
            <button className="btn btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configuração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigSeguranca;