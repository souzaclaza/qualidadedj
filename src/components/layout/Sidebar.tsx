import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Repeat2,
  BarChart3,
  ClipboardCheck,
  ShieldCheck,
  FileText,
  FileCode2,
  AlertTriangle,
  Settings,
  Network,
  BarChart2
} from 'lucide-react';
import clsx from 'clsx';

interface MenuItem {
  id: string;
  title: string;
  path: string;
}

interface MenuSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface SidebarProps {
  onCloseSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCloseSidebar }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const menuSections: MenuSection[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { id: 'dashboard', title: 'Visão Geral', path: '/' }
      ]
    },
    {
      id: 'retornados',
      title: 'Retornados',
      icon: <Repeat2 className="h-5 w-5" />,
      items: [
        { id: 'cadastro-toners', title: 'Cadastro de Toners', path: '/retornados/cadastro' },
        { id: 'registro-retornados', title: 'Registro de Retornados', path: '/retornados/registro' },
        { id: 'consulta-retornados', title: 'Consulta de Retornados', path: '/retornados/consulta' }
      ]
    },
    {
      id: 'graficos',
      title: 'Gráficos',
      icon: <BarChart3 className="h-5 w-5" />,
      items: [
        { id: 'graficos-volumetria', title: 'Volumetria', path: '/graficos/volumetria' },
        { id: 'graficos-destino', title: 'Quantidade por Destino', path: '/graficos/destino' },
        { id: 'graficos-valor-recuperado', title: 'Valor Recuperado', path: '/graficos/valor-recuperado' }
      ]
    },
    {
      id: 'auditoria',
      title: 'Auditoria',
      icon: <ClipboardCheck className="h-5 w-5" />,
      items: [
        { id: 'auditoria-cadastro', title: 'Cadastro de Formulários', path: '/auditoria/cadastro' },
        { id: 'auditoria-registro', title: 'Registro de Auditoria', path: '/auditoria/registro' },
        { id: 'auditoria-consulta', title: 'Consulta de Auditorias', path: '/auditoria/consulta' }
      ]
    },
    {
      id: 'garantia',
      title: 'Garantia',
      icon: <ShieldCheck className="h-5 w-5" />,
      items: [
        { id: 'garantia-cadastro', title: 'Cadastro de Fornecedores', path: '/garantia/cadastro' },
        { id: 'garantia-registro', title: 'Registro de Garantia', path: '/garantia/registro' },
        { id: 'garantia-consulta', title: 'Consulta de Garantias', path: '/garantia/consulta' },
        { id: 'garantia-graficos', title: 'Gráficos de Garantias', path: '/garantia/graficos' }
      ]
    },
    {
      id: 'pop-it',
      title: 'POP/IT',
      icon: <FileText className="h-5 w-5" />,
      items: [
        { id: 'pop-it-cadastro', title: 'Cadastro de POP/IT', path: '/pop-it/cadastro' },
        { id: 'pop-it-upload', title: 'Upload de POP/IT', path: '/pop-it/upload' },
        { id: 'pop-it-consulta', title: 'Consulta de POP/IT', path: '/pop-it/consulta' }
      ]
    },
    {
      id: 'bpmn',
      title: 'BPMN',
      icon: <FileCode2 className="h-5 w-5" />,
      items: [
        { id: 'bpmn-cadastro', title: 'Cadastro de BPMN', path: '/bpmn/cadastro' },
        { id: 'bpmn-upload', title: 'Upload de BPMN', path: '/bpmn/upload' },
        { id: 'bpmn-consulta', title: 'Consulta de BPMN', path: '/bpmn/consulta' }
      ]
    },
    {
      id: 'nc',
      title: 'Não Conformidades',
      icon: <AlertTriangle className="h-5 w-5" />,
      items: [
        { id: 'nc-registro', title: 'Registro de NC', path: '/nc/registro' },
        { id: 'nc-analise', title: 'Análise de NC', path: '/nc/analise' },
        { id: 'nc-plano-acao', title: 'Plano de Ação', path: '/nc/plano-acao' },
        { id: 'nc-verificacao', title: 'Verificação', path: '/nc/verificacao' },
        { id: 'nc-consulta', title: 'Consulta de NCs', path: '/nc/consulta' },
        { id: 'nc-graficos', title: 'Gráficos de NCs', path: '/nc/graficos' }
      ]
    },
    {
      id: 'ishikawa',
      title: 'Análise Ishikawa',
      icon: <Network className="h-5 w-5" />,
      items: [
        { id: 'ishikawa-registro', title: 'Registro', path: '/analise/ishikawa/registro' },
        { id: 'ishikawa-consulta', title: 'Consulta', path: '/analise/ishikawa/consulta' }
      ]
    },
    {
      id: 'pareto',
      title: 'Análise Pareto',
      icon: <BarChart2 className="h-5 w-5" />,
      items: [
        { id: 'pareto-registro', title: 'Registro', path: '/analise/pareto/registro' },
        { id: 'pareto-consulta', title: 'Consulta', path: '/analise/pareto/consulta' }
      ]
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
      items: [
        { id: 'dados-empresa', title: 'Dados da Empresa', path: '/configuracoes/empresa' },
        { id: 'cadastro-filiais', title: 'Cadastro de Filiais', path: '/configuracoes/filiais' }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      onCloseSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-secondary-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          SGQ PRO
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuSections.map(section => {
            const isOpen = openSections.includes(section.id);
            const hasActiveItem = section.items.some(item => isCurrentPath(item.path));

            return (
              <li key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={clsx(
                    'w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-colors',
                    hasActiveItem
                      ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-gray-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700'
                  )}
                >
                  <div className="flex items-center">
                    {section.icon}
                    <span className="ml-3">{section.title}</span>
                  </div>
                  <svg
                    className={clsx(
                      'h-5 w-5 transition-transform',
                      isOpen && 'transform rotate-180'
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                
                {isOpen && (
                  <ul className="mt-1 pl-4 space-y-1">
                    {section.items.map(item => {
                      const isActive = isCurrentPath(item.path);

                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onClick={handleItemClick}
                            className={clsx(
                              'block py-2 px-4 rounded-lg text-sm transition-colors',
                              isActive
                                ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-gray-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700'
                            )}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;