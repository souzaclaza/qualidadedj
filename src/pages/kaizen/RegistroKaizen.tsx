import React, { useState } from 'react';
import { Save, Upload, AlertCircle } from 'lucide-react';
import { useKaizenStore } from '../../stores/kaizenStore';
import { useNavigate } from 'react-router-dom';

const SETORES = [
  'Produção',
  'Qualidade',
  'Manutenção',
  'Logística',
  'Administrativo',
  'Comercial',
  'TI',
  'RH'
];

const RegistroKaizen: React.FC = () => {
  const navigate = useNavigate();
  const { addIdeia } = useKaizenStore();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    setor: '',
    autor: '',
    dataSugestao: new Date().toISOString().split('T')[0],
    impacto: '' as 'baixo' | 'medio' | 'alto',
    anexo: ''
  });

  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
      setFormData(prev => ({
        ...prev,
        anexo: file.name
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newIdeia = {
      id: Date.now().toString(),
      ...formData,
      dataSugestao: new Date(formData.dataSugestao),
      status: 'pendente' as const
    };

    addIdeia(newIdeia);
    navigate('/kaizen/consulta');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Registro de Ideia Kaizen
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-white">
            Informações da Ideia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="setor" className="form-label">Setor</label>
              <select
                id="setor"
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecione um setor</option>
                {SETORES.map(setor => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="autor" className="form-label">Autor da Ideia</label>
              <input
                type="text"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="impacto" className="form-label">Impacto Esperado</label>
              <select
                id="impacto"
                name="impacto"
                value={formData.impacto}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecione o impacto</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>

          <div className="form-group mt-4">
            <label htmlFor="descricao" className="form-label">Descrição da Ideia</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="form-input"
              rows={4}
              required
            />
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Anexo (opcional)</label>
            <label className="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-secondary-800 border-2 border-gray-300 dark:border-secondary-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary-500 focus:outline-none">
              <span className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400 dark:text-secondary-500" />
                <span className="text-sm text-gray-600 dark:text-secondary-400">
                  Clique para selecionar ou arraste o arquivo
                </span>
                <span className="text-xs text-gray-500 dark:text-secondary-500">
                  PDF ou Imagem (max. 10MB)
                </span>
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </label>
            {formData.anexo && (
              <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                Arquivo selecionado: {formData.anexo}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Após registrar a ideia, ela será enviada para avaliação.
            </p>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Registrar Ideia
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroKaizen;