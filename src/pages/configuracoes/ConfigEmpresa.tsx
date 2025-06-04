import React, { useState } from 'react';
import { Save, Upload, Building, Mail, Phone, MapPin } from 'lucide-react';
import { DadosEmpresa } from '../../types';

const ConfigEmpresa: React.FC = () => {
  const [dadosEmpresa, setDadosEmpresa] = useState<DadosEmpresa>({
    nome: 'Empresa de Tecnologia LTDA',
    cnpj: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000, São Paulo - SP',
    telefone: '(11) 3456-7890',
    email: 'contato@empresa.com.br',
    logo: '/sgq-logo.png'
  });
  
  const [logoPreview, setLogoPreview] = useState<string>(dadosEmpresa.logo || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosEmpresa({ ...dadosEmpresa, [name]: value });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Atualizar os dados com o logo
    setDadosEmpresa({
      ...dadosEmpresa,
      logo: logoPreview
    });
    alert('Dados da empresa atualizados com sucesso!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Dados da Empresa</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
                Logo da Empresa
              </h2>
              
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-secondary-700">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo da empresa"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-400">
                      <Building className="h-12 w-12" />
                    </div>
                  )}
                </div>
                
                <label className="btn btn-secondary cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
                
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                  Formatos suportados: JPG, PNG. Tamanho máximo: 2MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
                Informações da Empresa
              </h2>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="nome" className="form-label flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={dadosEmpresa.nome}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cnpj" className="form-label">CNPJ</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={dadosEmpresa.cnpj}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endereco" className="form-label flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={dadosEmpresa.endereco}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="telefone" className="form-label flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Telefone
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      value={dadosEmpresa.telefone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={dadosEmpresa.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </form>
      
      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
          Visualização dos Dados
        </h2>
        
        <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {logoPreview && (
              <div className="w-24 h-24 overflow-hidden rounded-lg bg-white dark:bg-secondary-700 flex-shrink-0">
                <img
                  src={logoPreview}
                  alt="Logo da empresa"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                {dadosEmpresa.nome}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 mt-1">
                CNPJ: {dadosEmpresa.cnpj}
              </p>
              
              <div className="mt-4 space-y-1">
                <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{dadosEmpresa.endereco}</span>
                </div>
                
                <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{dadosEmpresa.telefone}</span>
                </div>
                
                <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{dadosEmpresa.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigEmpresa;