
import React, { useState } from 'react';
import { 
  Target, 
  Save, 
  Plus, 
  Trash2, 
  Building2, 
  ChevronRight, 
  ChevronDown,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  CentroCusto, 
  PlanejamentoA3, 
  Entidade, 
  MetaMensal 
} from '../types';

interface CommercialGoalsProps {
  centrosCusto: CentroCusto[];
  planejamento: PlanejamentoA3[];
  setPlanejamento: React.Dispatch<React.SetStateAction<PlanejamentoA3[]>>;
}

export const CommercialGoals: React.FC<CommercialGoalsProps> = ({
  centrosCusto,
  planejamento,
  setPlanejamento
}) => {
  const [selectedCC, setSelectedCC] = useState<string | null>(null);
  const [entidadeFilter, setEntidadeFilter] = useState<Entidade>(Entidade.STI);

  const currentYear = 2026;

  const handleUpdateMeta = (ccId: string, mes: number, field: keyof MetaMensal, value: number) => {
    setPlanejamento(prev => prev.map(p => {
      if (p.centroCustoId === ccId && p.ano === currentYear) {
        const newMetas = p.metas.map(m => {
          if (m.mes === mes) {
            return { ...m, [field]: value };
          }
          return m;
        });
        return { ...p, metas: newMetas };
      }
      return p;
    }));
  };

  const getCCPlanejamento = (ccId: string) => {
    return planejamento.find(p => p.centroCustoId === ccId && p.ano === currentYear);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Target className="text-slate-400" size={28} />
            Gestão de Metas A3
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Planejamento anual detalhado por Centro de Custo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lista de Centros de Custo */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Centros de Custo</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[600px] overflow-y-auto">
              {centrosCusto.filter(cc => cc.entidade === entidadeFilter).map(cc => (
                <button
                  key={cc.id}
                  onClick={() => setSelectedCC(cc.id)}
                  className={`w-full text-left p-4 transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${selectedCC === cc.id ? 'bg-slate-100 dark:bg-white/10 border-l-4 border-slate-600' : ''}`}
                >
                  <p className="text-xs font-black uppercase tracking-tight mb-1">{cc.nome}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{cc.unidade}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor de Metas */}
        <div className="lg:col-span-3">
          {selectedCC ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">
                      {centrosCusto.find(c => c.id === selectedCC)?.nome}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Configuração de Metas Mensais - {currentYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Anual Planejado</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                      {formatCurrency(getCCPlanejamento(selectedCC)?.metas.reduce((acc, m) => acc + m.total, 0) || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {meses.map((mesNome, index) => {
                    const mesNum = index + 1;
                    const meta = getCCPlanejamento(selectedCC)?.metas.find(m => m.mes === mesNum);
                    
                    return (
                      <div key={mesNome} className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm border border-slate-200 dark:border-white/5">
                            {mesNum}
                          </div>
                          <h3 className="text-sm font-black uppercase tracking-tight">{mesNome}</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Meta Total (R$)</label>
                            <div className="relative">
                              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                type="number"
                                value={meta?.total || 0}
                                onChange={(e) => handleUpdateMeta(selectedCC, mesNum, 'total', parseFloat(e.target.value) || 0)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-400 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-end">
                  <button className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-900 active:scale-95 transition-all">
                    <Save size={18} />
                    Salvar Planejamento
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/5">
              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-full mb-6">
                <Building2 size={48} className="text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-400">Selecione um Centro de Custo</h3>
              <p className="text-sm text-slate-500 font-medium mt-2">Escolha uma unidade na lista lateral para editar as metas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
