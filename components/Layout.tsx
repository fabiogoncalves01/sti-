
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  DoorOpen, 
  AlertCircle, 
  LogOut,
  Tags,
  Briefcase,
  BarChart3,
  BookOpen,
  Grid3X3,
  TrendingUp,
  CloudUpload,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  Target,
  ArrowLeftRight,
  Settings as SettingsIcon,
  Calendar,
  DollarSign
} from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onSwitchModule: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all mb-1 relative group/item ${
      active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span className="font-bold text-[13px] whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 uppercase tracking-tight">
      {label}
    </span>
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full group-hover/sidebar:block hidden" />
    )}
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children, userProfile, onLogout, onSwitchModule, isDarkMode, toggleDarkMode }) => {
  const location = useLocation();

  if (!userProfile) return <>{children}</>;

  const isPCP = userProfile.activeModule === 'PCP';

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <aside className="w-20 hover:w-72 bg-slate-900 text-white hidden md:flex flex-col fixed inset-y-0 left-0 z-[100] transition-all duration-300 ease-in-out group/sidebar overflow-hidden shadow-2xl border-r border-white/5">
        <div className="p-6 flex items-center gap-4 h-24 shrink-0">
          <div className={`w-10 h-10 ${isPCP ? 'bg-slate-700' : 'bg-slate-700'} rounded-xl flex items-center justify-center text-xs font-black shadow-sm shrink-0`}>
            {isPCP ? 'PCP' : 'COM'}
          </div>
          <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
            <h1 className="text-sm font-black tracking-tight uppercase leading-none">
              {isPCP ? 'STI PCP' : 'STI Comercial'}
            </h1>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">
              {isPCP ? 'Coordenação' : 'Gestão Estratégica'}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-2 mt-4 overflow-y-auto no-scrollbar overflow-x-hidden">
          {isPCP ? (
            <>
              <SidebarItem to="/dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard STI" active={location.pathname === '/dashboard'} />
              <SidebarItem to="/capacidade" icon={<TrendingUp size={22} />} label="Capacidade & Financeiro" active={location.pathname === '/capacidade'} />
              <SidebarItem to="/agenda" icon={<Calendar size={22} />} label="Agenda & Produtividade" active={location.pathname === '/agenda'} />
              <SidebarItem to="/fluxo" icon={<DollarSign size={22} />} label="Fluxo de Receita" active={location.pathname === '/fluxo'} />
              <SidebarItem to="/importar" icon={<CloudUpload size={22} />} label="Importar Projetos" active={location.pathname === '/importar'} />
              
              <div className="mt-8 mb-4 border-t border-white/5 mx-4" />
              <SidebarItem to="/auditoria" icon={<ShieldCheck size={22} />} label="Auditoria" active={location.pathname === '/auditoria'} />
              <SidebarItem to="/configuracoes" icon={<SettingsIcon size={22} />} label="Configurações" active={location.pathname === '/configuracoes'} />
            </>
          ) : (
            <>
              <SidebarItem to="/comercial" icon={<TrendingUp size={22} />} label="Performance" active={location.pathname === '/comercial'} />
              <SidebarItem to="/comercial/importar" icon={<CloudUpload size={22} />} label="Importar Vendas" active={location.pathname === '/comercial/importar'} />
              <SidebarItem to="/comercial/metas" icon={<Target size={22} />} label="Metas A3" active={location.pathname === '/comercial/metas'} />
              <SidebarItem to="/comercial/pipeline" icon={<Briefcase size={22} />} label="Pipeline" active={location.pathname === '/comercial/pipeline'} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <button 
            onClick={onSwitchModule}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all mb-2"
          >
            <ArrowLeftRight size={20} className="shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-widest opacity-0 group-hover/sidebar:opacity-100 transition-opacity">Trocar Módulo</span>
          </button>
          
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
            <LogOut size={20} className="shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-widest opacity-0 group-hover/sidebar:opacity-100 transition-opacity">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-20 flex flex-col min-w-0 transition-all duration-300">
        <header className={`h-20 border-b flex items-center justify-between px-10 sticky top-0 z-[60] transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}>
          <div className="flex items-center gap-4 flex-1">
            <div className={`h-10 w-px mx-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {isPCP ? 'Painel Operacional STI' : 'Dashboard Performance STI'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleDarkMode}
              className={`p-3 rounded-2xl transition-all shadow-sm active:scale-90 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
              title={isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isDarkMode ? 'bg-slate-800 text-slate-300 border border-white/5' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
               COMPETÊNCIA 2026
            </div>
          </div>
        </header>

        <div className={`p-10 flex-1 overflow-auto transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50/30 text-slate-900'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
