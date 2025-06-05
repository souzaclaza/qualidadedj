import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CadastroToners from './pages/retornados/CadastroToners';
import RegistroRetornados from './pages/retornados/RegistroRetornados';
import ConsultaRetornados from './pages/retornados/ConsultaRetornados';
import GraficoVolumetria from './pages/graficos/GraficoVolumetria';
import GraficoDestino from './pages/graficos/GraficoDestino';
import GraficoValorRecuperado from './pages/graficos/GraficoValorRecuperado';
import CadastroFormularios from './pages/auditoria/CadastroFormularios';
import RegistroAuditoria from './pages/auditoria/RegistroAuditoria';
import ConsultaAuditoria from './pages/auditoria/ConsultaAuditoria';
import CadastroFornecedores from './pages/garantia/CadastroFornecedores';
import RegistroGarantia from './pages/garantia/RegistroGarantia';
import ConsultaGarantia from './pages/garantia/ConsultaGarantia';
import GraficosGarantia from './pages/garantia/GraficosGarantia';
import CadastroPopIt from './pages/pop-it/CadastroPopIt';
import UploadPopIt from './pages/pop-it/UploadPopIt';
import ConsultaPopIt from './pages/pop-it/ConsultaPopIt';
import CadastroBPMN from './pages/bpmn/CadastroBPMN';
import UploadBPMN from './pages/bpmn/UploadBPMN';
import ConsultaBPMN from './pages/bpmn/ConsultaBPMN';
import ConfigEmpresa from './pages/configuracoes/ConfigEmpresa';
import ConfigFiliais from './pages/configuracoes/ConfigFiliais';
import ConfigSeguranca from './pages/configuracoes/ConfigSeguranca';
import ConfigUsuarios from './pages/configuracoes/ConfigUsuarios';
import ConfigDatabase from './pages/configuracoes/ConfigDatabase';
import RegistroNC from './pages/nc/RegistroNC';
import AnaliseNC from './pages/nc/AnaliseNC';
import PlanoAcaoNC from './pages/nc/PlanoAcaoNC';
import VerificacaoNC from './pages/nc/VerificacaoNC';
import ConsultaNC from './pages/nc/ConsultaNC';
import GraficosNC from './pages/nc/GraficosNC';
import RegistroIshikawa from './pages/analise/ishikawa/RegistroIshikawa';
import ConsultaIshikawa from './pages/analise/ishikawa/ConsultaIshikawa';
import RegistroPareto from './pages/analise/pareto/RegistroPareto';
import ConsultaPareto from './pages/analise/pareto/ConsultaPareto';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      
      {/* Retornados */}
      <Route path="/retornados/cadastro" element={<Layout><CadastroToners /></Layout>} />
      <Route path="/retornados/registro" element={<Layout><RegistroRetornados /></Layout>} />
      <Route path="/retornados/consulta" element={<Layout><ConsultaRetornados /></Layout>} />

      {/* Gráficos */}
      <Route path="/graficos/volumetria" element={<Layout><GraficoVolumetria /></Layout>} />
      <Route path="/graficos/destino" element={<Layout><GraficoDestino /></Layout>} />
      <Route path="/graficos/valor-recuperado" element={<Layout><GraficoValorRecuperado /></Layout>} />

      {/* Auditoria */}
      <Route path="/auditoria/cadastro" element={<Layout><CadastroFormularios /></Layout>} />
      <Route path="/auditoria/registro" element={<Layout><RegistroAuditoria /></Layout>} />
      <Route path="/auditoria/consulta" element={<Layout><ConsultaAuditoria /></Layout>} />

      {/* Garantia */}
      <Route path="/garantia/cadastro" element={<Layout><CadastroFornecedores /></Layout>} />
      <Route path="/garantia/registro" element={<Layout><RegistroGarantia /></Layout>} />
      <Route path="/garantia/consulta" element={<Layout><ConsultaGarantia /></Layout>} />
      <Route path="/garantia/graficos" element={<Layout><GraficosGarantia /></Layout>} />

      {/* POP/IT */}
      <Route path="/pop-it/cadastro" element={<Layout><CadastroPopIt /></Layout>} />
      <Route path="/pop-it/upload" element={<Layout><UploadPopIt /></Layout>} />
      <Route path="/pop-it/consulta" element={<Layout><ConsultaPopIt /></Layout>} />

      {/* BPMN */}
      <Route path="/bpmn/cadastro" element={<Layout><CadastroBPMN /></Layout>} />
      <Route path="/bpmn/upload" element={<Layout><UploadBPMN /></Layout>} />
      <Route path="/bpmn/consulta" element={<Layout><ConsultaBPMN /></Layout>} />

      {/* Não Conformidades */}
      <Route path="/nc/registro" element={<Layout><RegistroNC /></Layout>} />
      <Route path="/nc/analise" element={<Layout><AnaliseNC /></Layout>} />
      <Route path="/nc/plano-acao" element={<Layout><PlanoAcaoNC /></Layout>} />
      <Route path="/nc/verificacao" element={<Layout><VerificacaoNC /></Layout>} />
      <Route path="/nc/consulta" element={<Layout><ConsultaNC /></Layout>} />
      <Route path="/nc/graficos" element={<Layout><GraficosNC /></Layout>} />

      {/* Análise Ishikawa */}
      <Route path="/analise/ishikawa/registro" element={<Layout><RegistroIshikawa /></Layout>} />
      <Route path="/analise/ishikawa/consulta" element={<Layout><ConsultaIshikawa /></Layout>} />

      {/* Análise Pareto */}
      <Route path="/analise/pareto/registro" element={<Layout><RegistroPareto /></Layout>} />
      <Route path="/analise/pareto/consulta" element={<Layout><ConsultaPareto /></Layout>} />

      {/* Configurações */}
      <Route path="/configuracoes/empresa" element={<Layout><ConfigEmpresa /></Layout>} />
      <Route path="/configuracoes/filiais" element={<Layout><ConfigFiliais /></Layout>} />
      <Route path="/configuracoes/seguranca" element={<Layout><ConfigSeguranca /></Layout>} />
      <Route path="/configuracoes/usuarios" element={<Layout><ConfigUsuarios /></Layout>} />
      <Route path="/configuracoes/database" element={<Layout><ConfigDatabase /></Layout>} />
    </Routes>
  );
}

export default App;