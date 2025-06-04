import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle, File, X } from 'lucide-react';
import { useBPMNStore } from '../../stores/bpmnStore';

const UploadBPMN: React.FC = () => {
  const { bpmns, addArquivo, updateBPMN, getArquivosByBPMN } = useBPMNStore();
  const [selectedBPMN, setSelectedBPMN] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.ms-powerpoint' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        setFile(selectedFile);
      } else {
        alert('Por favor, selecione um arquivo PDF ou PowerPoint (.pdf, .ppt, .pptx)');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedBPMN || !file) {
      alert('Selecione um BPMN e um arquivo');
      return;
    }

    const bpmn = bpmns.find(p => p.id === selectedBPMN);
    if (!bpmn) return;

    const arquivosExistentes = getArquivosByBPMN(selectedBPMN);
    const novaVersao = arquivosExistentes.length + 1;

    // Gerar nome do arquivo com versão
    const extensao = file.name.split('.').pop();
    const nomeBase = bpmn.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const nomeArquivo = `${nomeBase}_v${novaVersao}.${extensao}`;

    const novoArquivo = {
      id: Date.now().toString(),
      bpmnId: selectedBPMN,
      versao: novaVersao,
      nomeArquivo,
      dataUpload: new Date(),
      url: URL.createObjectURL(file) // Em produção, isso seria a URL do servidor
    };

    addArquivo(novoArquivo);
    updateBPMN(selectedBPMN, {
      ...bpmn,
      versaoAtual: novaVersao,
      dataEnvio: new Date()
    });

    setFile(null);
    setSelectedBPMN('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    alert('Arquivo enviado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        Upload de BPMN
      </h1>
      
      <div className="card max-w-2xl">
        <div className="space-y-6">
          <div className="form-group">
            <label htmlFor="bpmn" className="form-label">Selecione o BPMN</label>
            <select
              id="bpmn"
              value={selectedBPMN}
              onChange={(e) => setSelectedBPMN(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Selecione um BPMN</option>
              {bpmns.map((bpmn) => (
                <option key={bpmn.id} value={bpmn.id}>
                  {bpmn.titulo} - {bpmn.setor}
                </option>
              ))}
            </select>
          </div>

          {selectedBPMN && (
            <>
              <div className="form-group">
                <label className="form-label">Upload do Arquivo</label>
                <div className="mt-2">
                  {!file ? (
                    <label className="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-secondary-800 border-2 border-gray-300 dark:border-secondary-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary-500 focus:outline-none">
                      <span className="flex flex-col items-center justify-center space-y-2">
                        <FileUp className="w-8 h-8 text-gray-400 dark:text-secondary-500" />
                        <span className="text-sm text-gray-600 dark:text-secondary-400">
                          Clique para selecionar ou arraste o arquivo
                        </span>
                        <span className="text-xs text-gray-500 dark:text-secondary-500">
                          PDF, PPT ou PPTX (max. 10MB)
                        </span>
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.ppt,.pptx"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-800 rounded-md">
                      <div className="flex items-center space-x-3">
                        <File className="h-8 w-8 text-primary-500" />
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-secondary-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectedBPMN && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Informações sobre Versionamento
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>O sistema gerencia automaticamente as versões dos arquivos</li>
                          <li>Uma nova versão será criada a cada upload</li>
                          <li>O nome do arquivo será padronizado com o título e número da versão</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="btn btn-primary"
                  disabled={!file}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Arquivo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadBPMN;