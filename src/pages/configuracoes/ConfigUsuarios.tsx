import React, { useState } from 'react';
import { Save, UserPlus, Edit2, Trash2, Search, ShieldCheck, Plus, X, Key } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { User } from '../../types';

interface PasswordModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ userId, userName, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updateUserPassword } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    updateUserPassword(userId, newPassword);
    alert('Senha atualizada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Alterar Senha - {userName}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PERMISSION_GROUPS = [
  {
    id: 'retornados',
    name: 'Retornados',
    permissions: [
      { id: 'cadastro-toners', name: 'Cadastro de Toners' },
      { id: 'registro-retornados', name: 'Registro de Retornados' },
      { id: 'consulta-retornados', name: 'Consulta de Retornados' }
    ]
  },
  {
    id: 'graficos',
    name: 'Gráficos',
    permissions: [
      { id: 'graficos-volumetria', name: 'Volumetria de Retornados' },
      { id: 'graficos-destino', name: 'Quantidade por Destino' },
      { id: 'graficos-valor-recuperado', name: 'Valor Recuperado' }
    ]
  },
  {
    id: 'auditoria',
    name: 'Auditoria',
    permissions: [
      { id: 'auditoria-cadastro', name: 'Cadastro de Formulários' },
      { id: 'auditoria-registro', name: 'Registro de Auditoria' },
      { id: 'auditoria-consulta', name: 'Consulta de Auditorias' }
    ]
  },
  {
    id: 'garantia',
    name: 'Garantia',
    permissions: [
      { id: 'garantia-cadastro', name: 'Cadastro de Fornecedores' },
      { id: 'garantia-registro', name: 'Registro de Garantia' },
      { id: 'garantia-consulta', name: 'Consulta de Garantias' },
      { id: 'garantia-graficos', name: 'Gráficos de Garantias' }
    ]
  },
  {
    id: 'pop-it',
    name: 'POP/IT',
    permissions: [
      { id: 'pop-it-cadastro', name: 'Cadastro de POP/IT' },
      { id: 'pop-it-upload', name: 'Upload de POP/IT' },
      { id: 'pop-it-consulta', name: 'Consulta de POP/IT' }
    ]
  },
  {
    id: 'bpmn',
    name: 'BPMN',
    permissions: [
      { id: 'bpmn-cadastro', name: 'Cadastro de BPMN' },
      { id: 'bpmn-upload', name: 'Upload de BPMN' },
      { id: 'bpmn-consulta', name: 'Consulta de BPMN' }
    ]
  },
  {
    id: 'nc',
    name: 'Não Conformidades',
    permissions: [
      { id: 'nc-registro', name: 'Registro de NC' },
      { id: 'nc-analise', name: 'Análise de NC' },
      { id: 'nc-plano-acao', name: 'Plano de Ação' },
      { id: 'nc-verificacao', name: 'Verificação' },
      { id: 'nc-consulta', name: 'Consulta de NCs' },
      { id: 'nc-graficos', name: 'Gráficos de NCs' }
    ]
  },
  {
    id: 'ishikawa',
    name: 'Análise Ishikawa',
    permissions: [
      { id: 'ishikawa-registro', name: 'Registro' },
      { id: 'ishikawa-consulta', name: 'Consulta' }
    ]
  },
  {
    id: 'pareto',
    name: 'Análise Pareto',
    permissions: [
      { id: 'pareto-registro', name: 'Registro' },
      { id: 'pareto-consulta', name: 'Consulta' }
    ]
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    permissions: [
      { id: 'configuracoes-seguranca', name: 'Configurações de Segurança' },
      { id: 'usuarios-permissoes', name: 'Usuários e Permissões' },
      { id: 'dados-empresa', name: 'Dados da Empresa' },
      { id: 'cadastro-filiais', name: 'Cadastro de Filiais' },
      { id: 'database', name: 'Banco de Dados' }
    ]
  }
];

const ConfigUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: '1',
      nome: 'Administrador',
      email: 'admin@empresa.com.br',
      perfil: 'admin'
    },
    {
      id: '2',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com.br',
      perfil: 'editor'
    },
    {
      id: '3',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com.br',
      perfil: 'visualizador'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Usuario>>({
    nome: '',
    email: '',
    perfil: 'visualizador'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewProfileModalOpen, setIsNewProfileModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [customProfiles, setCustomProfiles] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handlePermissionChange = (userId: string, permissionId: string) => {
    const user = usuarios.find(u => u.id === userId);
    if (!user) return;

    const newPermissions = user.permissions?.includes(permissionId)
      ? user.permissions.filter(p => p !== permissionId)
      : [...(user.permissions || []), permissionId];

    setUsuarios(usuarios.map(u => 
      u.id === userId 
        ? { ...u, permissions: newPermissions }
        : u
    ));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setUsuarios(usuarios.map(usuario => 
        usuario.id === editingId ? { ...usuario, ...formData } : usuario
      ));
      setEditingId(null);
    } else {
      const newUsuario: Usuario = {
        id: Date.now().toString(),
        nome: formData.nome || '',
        email: formData.email || '',
        perfil: formData.perfil as string
      };
      setUsuarios([...usuarios, newUsuario]);
    }
    
    resetForm();
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData(usuario);
    setEditingId(usuario.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsuarios(usuarios.filter(usuario => usuario.id !== id));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      perfil: 'visualizador'
    });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      setCustomProfiles([...customProfiles, newProfileName.trim()]);
      setNewProfileName('');
      setIsNewProfileModalOpen(false);
    }
  };

  const handleDeleteProfile = (profile: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o perfil "${profile}"?`)) {
      setCustomProfiles(customProfiles.filter(p => p !== profile));
      setUsuarios(usuarios.map(usuario => 
        usuario.perfil === profile 
          ? { ...usuario, perfil: 'visualizador' }
          : usuario
      ));
    }
  };

  const getPerfilLabel = (perfil: string) => {
    switch (perfil) {
      case 'admin':
        return 'Administrador';
      case 'editor':
        return 'Editor';
      case 'visualizador':
        return 'Visualizador';
      default:
        return perfil;
    }
  };

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'visualizador':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  const handleChangePassword = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Usuários e Permissões</h1>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </button>
      </div>
      
      {isFormOpen && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            {editingId ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome || ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-group mt-4">
              <label htmlFor="perfil" className="form-label">Perfil</label>
              <select
                id="perfil"
                name="perfil"
                value={formData.perfil || 'visualizador'}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
                <option value="visualizador">Visualizador</option>
                {customProfiles.map(profile => (
                  <option key={profile} value={profile}>{profile}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Lista de Usuários
          </h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 dark:text-white text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {filteredUsuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {usuario.nome}
                  </td>
                  <td className="px-4 py-4 text-sm text-secondary-900 dark:text-secondary-200">
                    {usuario.email}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPerfilColor(usuario.perfil)}`}>
                      {getPerfilLabel(usuario.perfil)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleChangePassword(usuario.id)}
                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title="Alterar Senha"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        disabled={usuario.id === '1'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-sm text-center text-secondary-500 dark:text-secondary-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShieldCheck className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Permissões por Perfil
            </h2>
          </div>
          <button
            onClick={() => setIsNewProfileModalOpen(true)}
            className="btn btn-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Perfil
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Módulo / Funcionalidade
                </th>
                {usuarios.map(usuario => (
                  <th key={usuario.id} className="px-4 py-3 text-center text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    {usuario.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {PERMISSION_GROUPS.map(group => (
                <React.Fragment key={group.id}>
                  {/* Group Header */}
                  <tr className="bg-gray-50 dark:bg-secondary-800/50">
                    <td colSpan={usuarios.length + 1} className="px-4 py-2 text-sm font-medium text-secondary-900 dark:text-white">
                      {group.name}
                    </td>
                  </tr>
                  {/* Group Permissions */}
                  {group.permissions.map(permission => (
                    <tr key={permission.id}>
                      <td className="px-4 py-2 text-sm text-secondary-900 dark:text-secondary-200">
                        {permission.name}
                      </td>
                      {usuarios.map(usuario => (
                        <td key={usuario.id} className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={usuario.perfil === 'admin' || usuario.permissions?.includes(permission.id) || false}
                            onChange={() => handlePermissionChange(usuario.id, permission.id)}
                            disabled={usuario.perfil === 'admin'} // Admin always has all permissions
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isNewProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Novo Perfil
              </h2>
              <button
                onClick={() => setIsNewProfileModalOpen(false)}
                className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="newProfileName" className="form-label">Nome do Perfil</label>
                <input
                  type="text"
                  id="newProfileName"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="form-input"
                  placeholder="Ex: Gerente"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewProfileModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateProfile}
                  className="btn btn-primary"
                  disabled={!newProfileName.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Criar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedUserId && (
        <PasswordModal
          userId={selectedUserId}
          userName={usuarios.find(u => u.id === selectedUserId)?.nome || ''}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default ConfigUsuarios;