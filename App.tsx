
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CapacityPlanning } from './pages/CapacityPlanning';
import { AgendaProdutividade } from './pages/AgendaProdutividade';
import { FluxoFinanceiro } from './pages/FluxoFinanceiro';
import { ImportWizard } from './pages/ImportWizard';
import { AuditLog } from './pages/AuditLog';
import { Settings } from './pages/Settings';
import { ModuleSelection } from './pages/ModuleSelection';
import { CommercialDashboard } from './pages/CommercialDashboard';
import { CommercialGoals } from './pages/CommercialGoals';
import { CommercialPipeline } from './pages/CommercialPipeline';
import { CommercialImport } from './pages/CommercialImport';
import { 
  AuditLog as AuditLogType, 
  UserProfile, Area, MatrizTurno,
  LancamentoReceita, PlanejamentoA3, Oportunidade, CentroCusto, AppModule,
  ProjetoSTI, Consultor, AlocacaoSTI
} from './types';
import { INITIAL_CENTROS_CUSTO, INITIAL_PLANEJAMENTO_A3, SEED_CONSULTORES, SEED_PROJETOS } from './constants';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pcp_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Estados principais STI PCP
  const [projetos, setProjetos] = useState<ProjetoSTI[]>(SEED_PROJETOS);
  const [consultores, setConsultores] = useState<Consultor[]>(SEED_CONSULTORES);
  const [alocacoes, setAlocacoes] = useState<AlocacaoSTI[]>([]);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [matrizTurno, setMatrizTurno] = useState<MatrizTurno[]>([]);
  const [customWorkingDays, setCustomWorkingDays] = useState<Record<number, number>>({});

  // Estados Comerciais
  const [receitas, setReceitas] = useState<LancamentoReceita[]>([]);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>(INITIAL_CENTROS_CUSTO);
  const [planejamento, setPlanejamento] = useState<PlanejamentoA3[]>(INITIAL_PLANEJAMENTO_A3);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);

  const addLog = (action: string, details: string) => {
    const newLog: AuditLogType = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user: 'Coordenação',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('pcp_profile', JSON.stringify(profile));
    addLog('LOGIN', 'Acesso ao terminal de coordenação');
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('pcp_profile');
  };

  const handleModuleSelect = (module: AppModule) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, activeModule: module };
      setUserProfile(updatedProfile);
      localStorage.setItem('pcp_profile', JSON.stringify(updatedProfile));
      addLog('MÓDULO SELECIONADO', `Módulo ${module} ativado.`);
      
      // Navigate to the module's main page
      if (module === 'COMMERCIAL') {
        window.location.hash = '/comercial';
      } else {
        window.location.hash = '/dashboard';
      }
    }
  };

  const handleSwitchModule = () => {
    if (userProfile) {
      const { activeModule, ...rest } = userProfile;
      const updatedProfile = { ...rest };
      setUserProfile(updatedProfile as UserProfile);
      localStorage.setItem('pcp_profile', JSON.stringify(updatedProfile));
      window.location.hash = '/';
    }
  };

  const handleImportComplete = (newProjetos: ProjetoSTI[], newConsultores: Consultor[], fileName: string) => {
    setProjetos(prev => [...prev, ...newProjetos]);
    setConsultores(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const filteredNew = newConsultores.filter(c => !existingIds.has(c.id));
      return [...prev, ...filteredNew];
    });

    setImportHistory(prev => [{
      id: Date.now().toString(),
      name: fileName,
      date: new Date().toLocaleString(),
      count: newProjetos.length
    }, ...prev]);
    
    addLog('IMPORTAÇÃO', `Arquivo ${fileName} processado com ${newProjetos.length} projetos STI.`);
  };

  const handleCommercialImport = (newData: LancamentoReceita[]) => {
    setReceitas(prev => [...prev, ...newData]);
    addLog('IMPORTAÇÃO COMERCIAL', `${newData.length} lançamentos de receita importados.`);
  };

  if (!userProfile) return <Login onLogin={handleLogin} />;
  
  if (!userProfile.activeModule) {
    return <ModuleSelection userProfile={userProfile} onSelect={handleModuleSelect} />;
  }

  return (
    <Router>
      <Layout 
        userProfile={userProfile} 
        onLogout={handleLogout} 
        onSwitchModule={handleSwitchModule}
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard projetos={projetos} consultores={consultores} />} />
          <Route path="/capacidade" element={<CapacityPlanning projetos={projetos} consultores={consultores} />} />
          <Route path="/agenda" element={<AgendaProdutividade consultores={consultores} />} />
          <Route path="/fluxo" element={<FluxoFinanceiro projetos={projetos} />} />
          <Route path="/importar" element={<ImportWizard onComplete={handleImportComplete} history={importHistory} />} />
          <Route path="/auditoria" element={<AuditLog logs={auditLogs} />} />
          <Route path="/configuracoes" element={<Settings matrizTurno={matrizTurno} setMatrizTurno={setMatrizTurno} customWorkingDays={customWorkingDays} setCustomWorkingDays={setCustomWorkingDays} />} />
          
          {/* Commercial Routes */}
          <Route path="/comercial" element={<CommercialDashboard receitas={receitas} planejamento={planejamento} oportunidades={oportunidades} centrosCusto={centrosCusto} />} />
          <Route path="/comercial/metas" element={<CommercialGoals centrosCusto={centrosCusto} planejamento={planejamento} setPlanejamento={setPlanejamento} />} />
          <Route path="/comercial/pipeline" element={<CommercialPipeline oportunidades={oportunidades} setOportunidades={setOportunidades} centrosCusto={centrosCusto} />} />
          <Route path="/comercial/importar" element={
            <CommercialImport 
              onImport={handleCommercialImport} 
              centrosCusto={centrosCusto} 
              currentDataCount={receitas.length}
              onClear={() => setReceitas([])}
            />
          } />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
