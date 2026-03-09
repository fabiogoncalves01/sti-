
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  ChevronDown,
  Filter,
  Download,
  Search,
  PieChart,
  BarChart,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { 
  Entidade, 
  LancamentoReceita, 
  PlanejamentoA3, 
  Oportunidade, 
  CentroCusto,
  EstagioOportunidade
} from '../types';

interface CommercialDashboardProps {
  receitas: LancamentoReceita[];
  planejamento: PlanejamentoA3[];
  oportunidades: Oportunidade[];
  centrosCusto: CentroCusto[];
}

export const CommercialDashboard: React.FC<CommercialDashboardProps> = ({
  receitas,
  planejamento,
  oportunidades,
  centrosCusto
}) => {
  const [entidade, setEntidade] = useState<Entidade>(Entidade.STI);
  const [expandedUnidades, setExpandedUnidades] = useState<Set<string>>(new Set());

  const currentMonth = new Date().getMonth() + 1;

  // Filtragem e Cálculos
  const filteredData = useMemo(() => {
    const recs = receitas.filter(r => r.entidade === entidade);
    const plans = planejamento.filter(p => {
      const cc = centrosCusto.find(c => c.id === p.centroCustoId);
      return cc?.entidade === entidade;
    });
    const opts = oportunidades.filter(o => o.entidade === entidade);

    const totalRealizado = recs.reduce((acc, r) => acc + r.valorRealizado, 0);
    
    const totalMetaAnual = plans.reduce((acc, p) => {
      return acc + p.metas.reduce((mAcc, m) => mAcc + m.total, 0);
    }, 0);

    const totalMetaCorrente = plans.reduce((acc, p) => {
      const metaMes = p.metas.find(m => m.mes === currentMonth);
      if (!metaMes) return acc;
      return acc + metaMes.total;
    }, 0);

    const totalPipelinePonderado = opts.reduce((acc, o) => {
      if (o.estagio === EstagioOportunidade.FECHADO) return acc;
      return acc + (o.valor * (o.probabilidade / 100));
    }, 0);

    const totalGarantido = totalRealizado;
    const possibilidadeAno = totalRealizado + totalPipelinePonderado;

    return {
      totalRealizado,
      totalMetaAnual,
      totalMetaCorrente,
      totalPipelinePonderado,
      totalGarantido,
      possibilidadeAno,
      gap: Math.max(0, totalMetaAnual - possibilidadeAno),
      percentualMeta: totalMetaAnual > 0 ? (totalRealizado / totalMetaAnual) * 100 : 0
    };
  }, [receitas, planejamento, oportunidades, centrosCusto, entidade, currentMonth]);

  const toggleUnidade = (unidade: string) => {
    const newSet = new Set(expandedUnidades);
    if (newSet.has(unidade)) newSet.delete(unidade);
    else newSet.add(unidade);
    setExpandedUnidades(newSet);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const unidadesAgrupadas = useMemo(() => {
    const unidades = Array.from(new Set(centrosCusto.filter(c => c.entidade === entidade).map(c => c.unidade)));
    return unidades.map(u => {
      const ccs = centrosCusto.filter(c => c.unidade === u && c.entidade === entidade);
      const realizado = receitas.filter(r => ccs.some(cc => cc.nome === r.centroCusto)).reduce((acc, r) => acc + r.valorRealizado, 0);
      const meta = planejamento.filter(p => ccs.some(cc => cc.id === p.centroCustoId)).reduce((acc, p) => {
        return acc + p.metas.reduce((mAcc, m) => mAcc + m.total, 0);
      }, 0);
      
      return {
        nome: u,
        realizado,
        meta,
        centros: ccs.map(cc => {
          const ccRealizado = receitas.filter(r => r.centroCusto === cc.nome).reduce((acc, r) => acc + r.valorRealizado, 0);
          const ccMeta = planejamento.find(p => p.centroCustoId === cc.id)?.metas.reduce((acc, m) => acc + m.total, 0) || 0;
          return { ...cc, realizado: ccRealizado, meta: ccMeta };
        })
      };
    });
  }, [centrosCusto, receitas, planejamento, entidade]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header High-Tech */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800/20 blur-[100px] -mr-48 -mt-48 rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-800 rounded-lg border border-white/10">
                <TrendingUp size={20} className="text-slate-300" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Performance STI</h1>
            </div>
            <p className="text-slate-400 text-sm font-medium">Monitoramento estratégico de metas e faturamento</p>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <KPICard 
            label="Realizado Acumulado" 
            value={formatCurrency(filteredData.totalRealizado)} 
            icon={<DollarSign className="text-slate-300" />}
            trend={filteredData.percentualMeta}
            trendLabel="da Meta Anual"
            color="slate"
          />
          <KPICard 
            label="Meta Corrente (Mês)" 
            value={formatCurrency(filteredData.totalMetaCorrente)} 
            icon={<Target className="text-slate-300" />}
            trend={filteredData.totalMetaCorrente > 0 ? (filteredData.totalRealizado / filteredData.totalMetaCorrente) * 100 : 0}
            trendLabel="atingido este mês"
            color="slate"
          />
          <KPICard 
            label="Possibilidade Ano" 
            value={formatCurrency(filteredData.possibilidadeAno)} 
            icon={<ArrowUpRight className="text-slate-300" />}
            trend={filteredData.totalMetaAnual > 0 ? (filteredData.possibilidadeAno / filteredData.totalMetaAnual) * 100 : 0}
            trendLabel="do Objetivo A3"
            color="slate"
          />
          <KPICard 
            label="Gap Estratégico" 
            value={formatCurrency(filteredData.gap)} 
            icon={<ArrowDownRight className="text-rose-400" />}
            trend={filteredData.gap > 0 ? -1 : 0}
            trendLabel={filteredData.gap > 0 ? "Ainda necessário" : "Meta Batida!"}
            color="rose"
          />
        </div>
      </div>

      {/* Seção de Análise Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drill-down de Unidades */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black tracking-tight uppercase flex items-center gap-3">
              <Building2 size={20} className="text-indigo-500" />
              Drill-down por Unidade
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Status:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase">Estável</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] font-bold uppercase">Atenção</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {unidadesAgrupadas.map(unidade => (
              <div key={unidade.nome} className="border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleUnidade(unidade.nome)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${expandedUnidades.has(unidade.nome) ? 'bg-slate-800 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                      {expandedUnidades.has(unidade.nome) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight">{unidade.nome}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{unidade.centros.length} Centros de Custo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Realizado</p>
                      <p className="text-sm font-black">{formatCurrency(unidade.realizado)}</p>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-[9px] font-bold uppercase mb-1">
                        <span>Progresso</span>
                        <span>{Math.round((unidade.realizado / unidade.meta) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${unidade.realizado >= unidade.meta ? 'bg-slate-400' : 'bg-slate-600'}`}
                          style={{ width: `${Math.min(100, (unidade.realizado / unidade.meta) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {expandedUnidades.has(unidade.nome) && (
                  <div className="bg-slate-50/50 dark:bg-white/5 p-5 space-y-3 border-t border-slate-100 dark:border-white/5">
                    {unidade.centros.map(cc => (
                      <div key={cc.id} className="flex items-center justify-between py-2 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{cc.nome}</span>
                        <div className="flex items-center gap-6">
                          <span className="text-xs font-black">{formatCurrency(cc.realizado)}</span>
                          <div className="w-20 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                             <div 
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (cc.realizado / cc.meta) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline e Oportunidades */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm">
          <h2 className="text-lg font-black tracking-tight uppercase flex items-center gap-3 mb-8">
            <Briefcase size={20} className="text-blue-500" />
            Pipeline de Vendas
          </h2>

          <div className="space-y-6">
            <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Valor Ponderado</p>
              <p className="text-2xl font-black text-blue-500">{formatCurrency(filteredData.totalPipelinePonderado)}</p>
            </div>

            <div className="space-y-4">
              {oportunidades.filter(o => o.entidade === entidade).slice(0, 5).map(opt => (
                <div key={opt.id} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl hover:border-indigo-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-tight">{opt.cliente}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{opt.titulo}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                      opt.estagio === EstagioOportunidade.NEGOCIACAO ? 'bg-amber-500/10 text-amber-500' :
                      opt.estagio === EstagioOportunidade.PROPOSTA ? 'bg-blue-500/10 text-blue-500' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {opt.estagio}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold">{formatCurrency(opt.valor)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400">{opt.probabilidade}%</span>
                      <div className="w-12 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${opt.probabilidade}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 border border-dashed border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 hover:border-indigo-500/50 transition-all">
              Ver Todas Oportunidades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
  trendLabel: string;
  color: 'emerald' | 'indigo' | 'blue' | 'rose' | 'slate';
}

const KPICard: React.FC<KPICardProps> = ({ label, value, icon, trend, trendLabel, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-800 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]} border`}>
          {icon}
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-[10px] font-black ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend > 0 ? `${Math.round(trend)}%` : ''}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">{label}</p>
        <p className="text-xl font-black text-white tracking-tight">{value}</p>
        <p className="text-[9px] font-bold text-slate-600 uppercase mt-2">{trendLabel}</p>
      </div>
    </div>
  );
};
