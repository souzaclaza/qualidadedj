import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          filter: 'brightness(0.3)'
        }}
      />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            SGQ PRO
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Faça login para acessar o sistema
          </p>
        </div>

        <div className="card backdrop-blur-sm bg-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input bg-white/20 text-white placeholder-gray-400"
                placeholder="seu.email@empresa.com.br"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label text-white">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input bg-white/20 text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/30 p-4 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full bg-primary-600 hover:bg-primary-700"
                disabled={isLoading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="text-sm text-center text-gray-300 space-y-4">
              <div>
                <p className="font-medium mb-1">Administrador:</p>
                <p>Email: admin@empresa.com.br</p>
                <p>Senha: Admin@123</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Editor:</p>
                <p>Email: editor@empresa.com.br</p>
                <p>Senha: Editor@123</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Visualizador:</p>
                <p>Email: viewer@empresa.com.br</p>
                <p>Senha: Viewer@123</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;