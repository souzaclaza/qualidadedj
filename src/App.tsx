import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
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
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <PrivateRoute permission="dashboard">
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />

      {/* Retornados */}
      <Route path="/retornados/cadastro" element={
        <PrivateRoute permission="cadastro-toners">
          <Layout>
            <CadastroToners />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/retornados/registro" element={
        <PrivateRoute permission="registro-retornados">
          <Layout>
            <RegistroRetornados />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/retornados/consulta" element={
        <PrivateRoute permission="consulta-retornados">
          <Layout>
            <ConsultaRetornados />
          </Layout>
        </PrivateRoute>
      } />

      {/* Gráficos */}
      <Route path="/graficos/volumetria" element={
        <PrivateRoute permission="graficos-volumetria">
          <Layout>
            <GraficoVolumetria />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/graficos/destino" element={
        <PrivateRoute permission="graficos-destino">
          <Layout>
            <GraficoDestino />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/graficos/valor-recuperado" element={
        <PrivateRoute permission="graficos-valor-recuperado">
          <Layout>
            <GraficoValorRecuperado />
          </Layout>
        </PrivateRoute>
      } />

      {/* Auditoria */}
      <Route path="/auditoria/cadastro" element={
        <PrivateRoute permission="auditoria-cadastro">
          <Layout>
            <CadastroFormularios />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/auditoria/registro" element={
        <PrivateRoute permission="auditoria-registro">
          <Layout>
            <RegistroAuditoria />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/auditoria/consulta" element={
        <PrivateRoute permission="auditoria-consulta">
          <Layout>
            <ConsultaAuditoria />
          </Layout>
        </PrivateRoute>
      } />

      {/* Garantia */}
      <Route path="/garantia/cadastro" element={
        <PrivateRoute permission="garantia-cadastro">
          <Layout>
            <CadastroFornecedores />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/garantia/registro" element={
        <PrivateRoute permission="garantia-registro">
          <Layout>
            <RegistroGarantia />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/garantia/consulta" element={
        <PrivateRoute permission="garantia-consulta">
          <Layout>
            <ConsultaGarantia />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/garantia/graficos" element={
        <PrivateRoute permission="garantia-graficos">
          <Layout>
            <GraficosGarantia />
          </Layout>
        </PrivateRoute>
      } />

      {/* POP/IT */}
      <Route path="/pop-it/cadastro" element={
        <PrivateRoute permission="pop-it-cadastro">
          <Layout>
            <CadastroPopIt />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/pop-it/upload" element={
        <PrivateRoute permission="pop-it-upload">
          <Layout>
            <UploadPopIt />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/pop-it/consulta" element={
        <PrivateRoute permission="pop-it-consulta">
          <Layout>
            <ConsultaPopIt />
          </Layout>
        </PrivateRoute>
      } />

      {/* BPMN */}
      <Route path="/bpmn/cadastro" element={
        <PrivateRoute permission="bpmn-cadastro">
          <Layout>
            <CadastroBPMN />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/bpmn/upload" element={
        <PrivateRoute permission="bpmn-upload">
          <Layout>
            <UploadBPMN />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/bpmn/consulta" element={
        <PrivateRoute permission="bpmn-consulta">
          <Layout>
            <ConsultaBPMN />
          </Layout>
        </PrivateRoute>
      } />

      {/* Não Conformidades */}
      <Route path="/nc/registro" element={
        <PrivateRoute permission="nc-registro">
          <Layout>
            <RegistroNC />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/nc/analise" element={
        <PrivateRoute permission="nc-analise">
          <Layout>
            <AnaliseNC />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/nc/plano-acao" element={
        <PrivateRoute permission="nc-plano-acao">
          <Layout>
            <PlanoAcaoNC />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/nc/verificacao" element={
        <PrivateRoute permission="nc-verificacao">
          <Layout>
            <VerificacaoNC />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/nc/consulta" element={
        <PrivateRoute permission="nc-consulta">
          <Layout>
            <ConsultaNC />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/nc/graficos" element={
        <PrivateRoute permission="nc-graficos">
          <Layout>
            <GraficosNC />
          </Layout>
        </PrivateRoute>
      } />

      {/* Análise Ishikawa */}
      <Route path="/analise/ishikawa/registro" element={
        <PrivateRoute permission="ishikawa-registro">
          <Layout>
            <RegistroIshikawa />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/analise/ishikawa/consulta" element={
        <PrivateRoute permission="ishikawa-consulta">
          <Layout>
            <ConsultaIshikawa />
          </Layout>
        </PrivateRoute>
      } />

      {/* Análise Pareto */}
      <Route path="/analise/pareto/registro" element={
        <PrivateRoute permission="pareto-registro">
          <Layout>
            <RegistroPareto />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/analise/pareto/consulta" element={
        <PrivateRoute permission="pareto-consulta">
          <Layout>
            <ConsultaPareto />
          </Layout>
        </PrivateRoute>
      } />

      {/* Configurações */}
      <Route path="/configuracoes/empresa" element={
        <PrivateRoute permission="dados-empresa">
          <Layout>
            <ConfigEmpresa />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/configuracoes/filiais" element={
        <PrivateRoute permission="cadastro-filiais">
          <Layout>
            <ConfigFiliais />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/configuracoes/seguranca" element={
        <PrivateRoute permission="configuracoes-seguranca">
          <Layout>
            <ConfigSeguranca />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/configuracoes/usuarios" element={
        <PrivateRoute permission="usuarios-permissoes">
          <Layout>
            <ConfigUsuarios />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/configuracoes/database" element={
        <PrivateRoute permission="database">
          <Layout>
            <ConfigDatabase />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;