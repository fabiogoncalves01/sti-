
import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Building2,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { 
  Oportunidade, 
  EstagioOportunidade, 
  Entidade, 
  CentroCusto 
} from '../types';

interface CommercialPipelineProps {
  oportunidades: Oportunidade[];
  setOportunidades: React.Dispatch<React.SetStateAction<Oportunidade[]>>;
  centrosCusto: CentroCusto[];
}

export const CommercialPipeline: React.FC<CommercialPipelineProps> = ({
  oportunidades,
  setOportunidades,
  centrosCusto
}) => {
  const [entidadeFilter, setEntidadeFilter] = useState<Entidade>(Entidade.STI);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newOpt, setNewOpt] = useState<Partial<Oportunidade>>({
    estagio: EstagioOportunidade.PROSPECCAO,
    probabilidade: 20,
    entidade: Entidade.STI,
    valor: 0
  });

  const filteredOpts = oportunidades.filter(o => 
    o.entidade === entidadeFilter && 
    (o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stages = Object.values(EstagioOportunidade);

  const handleAddOportunidade = () => {
    if (!newOpt.cliente || !newOpt.titulo || !newOpt.valor) return;
    
    const opportunity: Oportunidade = {
      id: Math.random().toString(36).substr(2, 9),
      cliente: newOpt.cliente!,
      titulo: newOpt.titulo!,
      valor: newOpt.valor!,
      probabilidade: newOpt.probabilidade || 20,
      estagio: newOpt.estagio || EstagioOportunidade.PROSPECCAO,
      dataFechamento: new Date().toISOString().split('T')[0],
      entidade: entidadeFilter,
      centroCustoId: newOpt.centroCustoId || centrosCusto[0].id
    };

    setOportunidades(prev => [opportunity, ...prev]);
    setIsModalOpen(false);
    setNewOpt({
      estagio: EstagioOportunidade.PROSPECCAO,
      probabilidade: 20,
      entidade: entidadeFilter,
      valor: 0
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Briefcase className="text-slate-400" size={28} />
            Pipeline de Oportunidades
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Gestão do funil de vendas e previsão de faturamento</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-slate-900 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Nova Oportunidade
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map(stage => {
          const stageOpts = filteredOpts.filter(o => o.estagio === stage);
          const stageTotal = stageOpts.reduce((acc, o) => acc + o.valor, 0);
          const stagePonderado = stageOpts.reduce((acc, o) => acc + (o.valor * (o.probabilidade / 100)), 0);

          return (
            <div key={stage} className="flex flex-col h-full min-h-[600px] bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/5">
              <div className="p-6 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{stage}</h3>
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-white/10 rounded-full text-[9px] font-black text-slate-600 dark:text-slate-400">
                    {stageOpts.length}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black tracking-tight">{formatCurrency(stageTotal)}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Ponderado: {formatCurrency(stagePonderado)}</p>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
                {stageOpts.map(opt => (
                  <div key={opt.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all group cursor-grab active:cursor-grabbing">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-xs font-black uppercase tracking-tight mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{opt.cliente}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">{opt.titulo}</p>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500">
                        <Building2 size={12} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">
                        {centrosCusto.find(c => c.id === opt.centroCustoId)?.unidade}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <span className="text-sm font-black text-slate-700 dark:text-white">{formatCurrency(opt.valor)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400">{opt.probabilidade}%</span>
                        <div className="w-12 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400" style={{ width: `${opt.probabilidade}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {stageOpts.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Vazio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Oportunidade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <h2 className="text-xl font-black uppercase tracking-tighter">Nova Oportunidade</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Cliente / Empresa</label>
                  <input 
                    type="text"
                    placeholder="Ex: Vale S.A."
                    value={newOpt.cliente || ''}
                    onChange={(e) => setNewOpt({...newOpt, cliente: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Título da Oportunidade</label>
                  <input 
                    type="text"
                    placeholder="Ex: Treinamento NR-10"
                    value={newOpt.titulo || ''}
                    onChange={(e) => setNewOpt({...newOpt, titulo: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Valor Estimado (R$)</label>
                  <input 
                    type="number"
                    value={newOpt.valor || ''}
                    onChange={(e) => setNewOpt({...newOpt, valor: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Probabilidade (%)</label>
                  <input 
                    type="number"
                    value={newOpt.probabilidade || ''}
                    onChange={(e) => setNewOpt({...newOpt, probabilidade: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Estágio</label>
                  <select 
                    value={newOpt.estagio}
                    onChange={(e) => setNewOpt({...newOpt, estagio: e.target.value as EstagioOportunidade})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  >
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Centro de Custo</label>
                  <select 
                    value={newOpt.centroCustoId}
                    onChange={(e) => setNewOpt({...newOpt, centroCustoId: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  >
                    {centrosCusto.filter(cc => cc.entidade === entidadeFilter).map(cc => (
                      <option key={cc.id} value={cc.id}>{cc.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddOportunidade}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-slate-900 active:scale-95 transition-all"
              >
                Criar Oportunidade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
