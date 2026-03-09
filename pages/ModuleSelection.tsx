
import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Briefcase, 
  Settings,
  Target,
  Users
} from 'lucide-react';
import { AppModule, UserProfile } from '../types';

interface ModuleSelectionProps {
  userProfile: UserProfile;
  onSelect: (module: AppModule) => void;
}

export const ModuleSelection: React.FC<ModuleSelectionProps> = ({ userProfile, onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-800/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-900/20 rounded-full blur-[120px]" />

      <div className="max-w-4xl w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            <ShieldCheck size={14} /> Terminal de Acesso Seguro
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Olá, <span className="text-slate-400">{userProfile.name}</span>
          </h1>
          <p className="text-slate-500 mt-4 font-bold text-xs uppercase tracking-[0.3em]">Selecione o módulo de trabalho para iniciar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PCP Module */}
          <button 
            onClick={() => onSelect('PCP')}
            className="group relative bg-white rounded-[3rem] p-10 text-left transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-200 hover:border-slate-400 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <LayoutDashboard size={120} />
            </div>
            
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-105 transition-transform duration-500">
              <LayoutDashboard size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">STI PCP</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Gestão de grade horária, alocação de docentes, controle de ambientes e matriz de produtividade.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400"><Users size={14} /></div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400"><Settings size={14} /></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coordenação Ativa</span>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">Acessar Terminal</span>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:translate-x-2 transition-transform">
                <ChevronRight size={20} />
              </div>
            </div>
          </button>

          {/* Commercial Module */}
          <button 
            onClick={() => onSelect('COMMERCIAL')}
            className="group relative bg-slate-900 rounded-[3rem] p-10 text-left transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/5 hover:border-white/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity text-white">
              <TrendingUp size={120} />
            </div>
            
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500">
              <TrendingUp size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">STI Comercial</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              Análise de faturamento STI, metas A3, pipeline de vendas e inteligência de mercado.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-500"><Target size={14} /></div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-500"><Briefcase size={14} /></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gestão Estratégica</span>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Acessar Dashboard</span>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:translate-x-2 transition-transform">
                <ChevronRight size={20} />
              </div>
            </div>
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">STI PCP & Comercial © 2026</p>
        </div>
      </div>
    </div>
  );
};
