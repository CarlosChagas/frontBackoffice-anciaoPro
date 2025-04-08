import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { api, handleApiError } from '../services/api';
import type { LoginError } from '../types/auth';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginError>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    
    const newErrors: LoginError = {};
    
    if (!email.trim()) newErrors.email = 'O campo email não pode estar vazio';
    if (!password.trim()) newErrors.password = 'O campo senha não pode estar vazio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await api.post('/authentication', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      history.push('/academias');
      
    } catch (error) {
      if (handleApiError(error)) {
        if ((error as any).response?.status === 401) {
          setErrors({ credentials: 'Usuário ou senha inválidos' });
        } else if ((error as any).response) {
          setErrors({ general: (error as any).response?.data?.message || 'Erro ao realizar login' });
        } else if ((error as any).request) {
          setErrors({ general: 'Falha na conexão. Por favor, tente novamente.' });
        } else {
          setErrors({ general: 'Ocorreu um erro inesperado. Por favor, tente novamente.' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Login
          </span>
        </h2>
        
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{errors.general}</p>
          </div>
        )}

        {errors.credentials && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{errors.credentials}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-500 ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200 hover:border-blue-400'
              }`}
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
            />
            {errors.email && (
              <p className="mt-2 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.password 
                  ? 'border-red-500 ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200 hover:border-blue-400'
              }`}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
            />
            {errors.password && (
              <p className="mt-2 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-[1.02] ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;