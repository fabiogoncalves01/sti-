
import React, { useMemo, useState, useEffect } from 'react';
import { 
  Users, Briefcase, Calendar, Sparkles, Loader2, 
  CheckCircle2, CircleDashed, Zap, Activity, Search,
  TrendingUp, ArrowUpRight, ChevronRight, PlayCircle, History,
  Sunrise, Sun, Moon, PieChart, FileText, Clock, DollarSign, BarChart3
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { ProjetoSTI, Consultor, StatusSTI, TipoProjeto, Area, UnidadeNegocio } from '../types';
import { VALOR_HORA_NIVEL } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  projetos: ProjetoSTI[];
  consultores: Consultor[];
}

export const Dashboard: React.FC<DashboardProps> = ({ projetos, consultores }) => {
  const [aiBriefing, setAiBriefing] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeNegocio | 'TODAS'>('TODAS');

  const stats = useMemo(() => {
    const filteredProjetos = selectedUnidade === 'TODAS' 
      ? projetos 
      : projetos.filter(p => p.unidadeNegocio === selectedUnidade);
      
    const filteredConsultores = selectedUnidade === 'TODAS'
      ? consultores
      : consultores.filter(c => c.unidadeNegocio === selectedUnidade);

    const totalProjetos = filteredProjetos.length;
    
    const statusCounts = {
      [StatusSTI.PLANEJADO]: filteredProjetos.filter(p => p.status === StatusSTI.PLANEJADO).length,
      [StatusSTI.EM_EXECUCAO]: filteredProjetos.filter(p => p.status === StatusSTI.EM_EXECUCAO).length,
      [StatusSTI.ATRASADO]: filteredProjetos.filter(p => p.status === StatusSTI.ATRASADO).length,
      [StatusSTI.CONCLUIDO]: filteredProjetos.filter(p => p.status === StatusSTI.CONCLUIDO).length,
    };

    const avgProgresso = totalProjetos > 0 
      ? filteredProjetos.reduce((acc, p) => acc + p.progresso, 0) / totalProjetos 
      : 0;

    // Valores baseados na solicitação
    const totalValorVendido = 1219120.14;
    const totalHorasVendidas = 5541; // 1.219.120,14 / 220 (valor hora médio)

    const activeConsultores = filteredConsultores.filter(c => c.status === 'Ativo');
    const mesesRestantes = 12 - new Date().getMonth(); // Mês atual para frente
    const capacidadeInstaladaHoras = activeConsultores.reduce((acc, c) => acc + c.cargaMensalDisponivel, 0) * mesesRestantes;
    const receitaPotencial = activeConsultores.reduce((acc, c) => acc + (c.cargaMensalDisponivel * VALOR_HORA_NIVEL[c.nivel]), 0) * mesesRestantes;

    const ocupacaoPercentual = capacidadeInstaladaHoras > 0 
      ? (totalHorasVendidas / capacidadeInstaladaHoras) * 100 
      : 0;

    return {
      totalProjetos,
      statusCounts,
      avgProgresso,
      totalValorVendido,
      totalHorasVendidas,
      capacidadeInstaladaHoras,
      receitaPotencial,
      ocupacaoPercentual,
      activeConsultoresCount: activeConsultores.length
    };
  }, [projetos, consultores, selectedUnidade]);

  useEffect(() => {
    const generateBriefing = async () => {
      if (projetos.length === 0) return;
      setIsAiLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Analise o portfólio de projetos STI (Unidade: ${selectedUnidade}):
        - Total de Projetos: ${stats.totalProjetos}
        - Valor Vendido: R$ ${stats.totalValorVendido}
        - Receita Potencial: R$ ${stats.receitaPotencial}
        - Ocupação da Equipe: ${Math.round(stats.ocupacaoPercentual)}%
        Forneça um insight estratégico financeiro e de capacidade sobre onde podemos ganhar mais receita e produtividade. Seja direto e profissional.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
        });
        setAiBriefing(response.text || "");
      } catch (e) {
        setAiBriefing("IA: Ocupação atual indica margem para novos projetos. Focar em alocação eficiente para maximizar a receita potencial.");
      } finally {
        setIsAiLoading(false);
      }
    };
    generateBriefing();
  }, [stats.totalProjetos, selectedUnidade]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Filtro de Unidade de Negócio */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Button 
          variant={selectedUnidade === 'TODAS' ? 'primary' : 'secondary'} 
          size="sm" 
          onClick={() => setSelectedUnidade('TODAS')}
          className="rounded-full"
        >
          Visão Global
        </Button>
        {Object.values(UnidadeNegocio).map(unidade => (
          <Button 
            key={unidade}
            variant={selectedUnidade === unidade ? 'primary' : 'secondary'} 
            size="sm" 
            onClick={() => setSelectedUnidade(unidade)}
            className="rounded-full"
          >
            {unidade}
          </Button>
        ))}
      </div>

      <Card className="p-0 border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-10 lg:col-span-2 bg-slate-900 text-white relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-indigo-400" size={20} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Capacidade & Financeiro {selectedUnidade !== 'TODAS' ? `- ${selectedUnidade}` : ''}
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Receita Vendida (Contratos)</p>
                  <h4 className="text-5xl font-black tracking-tighter leading-none text-emerald-400">
                    {formatCurrency(stats.totalValorVendido)}
                  </h4>
                  <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">
                    vs Potencial {formatCurrency(stats.receitaPotencial)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Ocupação da Equipe</p>
                  <h4 className="text-5xl font-black tracking-tighter leading-none text-indigo-400 flex items-center gap-4">
                    {Math.round(stats.ocupacaoPercentual)}%
                  </h4>
                  <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">
                    {Math.round(stats.totalHorasVendidas)}h vendidas / {Math.round(stats.capacidadeInstaladaHoras)}h cap.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">
                  <span>Status do Portfólio ({stats.totalProjetos} Projetos)</span>
                  <span>Progresso Médio: {Math.round(stats.avgProgresso)}%</span>
                </div>
                <div className="h-4 w-full bg-slate-800 rounded-full flex overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500" style={{ width: `${(stats.statusCounts[StatusSTI.CONCLUIDO] / stats.totalProjetos) * 100 || 0}%` }} />
                  <div className="h-full bg-blue-500" style={{ width: `${(stats.statusCounts[StatusSTI.EM_EXECUCAO] / stats.totalProjetos) * 100 || 0}%` }} />
                  <div className="h-full bg-amber-500" style={{ width: `${(stats.statusCounts[StatusSTI.PLANEJADO] / stats.totalProjetos) * 100 || 0}%` }} />
                  <div className="h-full bg-rose-500" style={{ width: `${(stats.statusCounts[StatusSTI.ATRASADO] / stats.totalProjetos) * 100 || 0}%` }} />
                </div>
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black uppercase text-slate-400">Concluídos</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[9px] font-black uppercase text-slate-400">Em Execução</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[9px] font-black uppercase text-slate-400">Planejados</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[9px] font-black uppercase text-slate-400">Atrasados</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 flex flex-col justify-between border-l border-slate-100 dark:border-slate-800 bg-slate-50/30">
             <div className="space-y-6">
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase opacity-60 tracking-[0.2em] mb-2 text-indigo-100 flex items-center gap-2">
                        <Sparkles size={12} /> Insight Estratégico IA
                      </p>
                      <p className="text-[11px] font-medium leading-relaxed italic">
                        {isAiLoading ? "Analisando capacidade e financeiro..." : `"${aiBriefing.substring(0, 250)}..."`}
                      </p>
                   </div>
                   <Zap className="absolute -right-4 -bottom-4 text-white/10 w-20 h-20" />
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <Users className="text-indigo-500" size={18} />
                        <span className="text-[10px] font-black uppercase text-slate-500">Equipe Alocada</span>
                      </div>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{stats.activeConsultoresCount}</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <DollarSign className="text-emerald-500" size={18} />
                        <span className="text-[10px] font-black uppercase text-slate-500">Ticket Médio</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {stats.totalProjetos > 0 ? formatCurrency(stats.totalValorVendido / stats.totalProjetos) : 'R$ 0'}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500">
                 <Briefcase size={24} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Projetos em Negociação</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline (Planejados)</p>
              </div>
           </div>
           <div className="space-y-3">
              {projetos.filter(p => p.status === StatusSTI.PLANEJADO && (selectedUnidade === 'TODAS' || p.unidadeNegocio === selectedUnidade)).slice(0, 3).map(p => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between group">
                   <div>
                     <span className="text-[10px] font-bold truncate block max-w-[150px]">{p.nome}</span>
                     <span className="text-[8px] font-black text-slate-400 uppercase">{p.cliente}</span>
                   </div>
                   <Badge color="amber">{formatCurrency(p.valorContrato)}</Badge>
                </div>
              ))}
              {projetos.filter(p => p.status === StatusSTI.PLANEJADO && (selectedUnidade === 'TODAS' || p.unidadeNegocio === selectedUnidade)).length === 0 && (
                <p className="text-[10px] text-slate-500 italic">Nenhum projeto em planejamento.</p>
              )}
           </div>
        </Card>

        <Card className="p-8 rounded-[3rem] bg-indigo-600 text-white border-none shadow-xl relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Gap Financeiro</p>
                <TrendingUp size={24} className="opacity-40" />
             </div>
             <h4 className="text-4xl font-black tracking-tighter mb-2">
               {formatCurrency(stats.receitaPotencial - stats.totalValorVendido)}
             </h4>
             <p className="text-[10px] font-bold uppercase opacity-80 leading-relaxed">
               Receita que ainda pode ser capturada com a capacidade ociosa da equipe atual.
             </p>
           </div>
           <Activity className="absolute -right-10 -bottom-10 text-white/10 w-48 h-48" />
        </Card>

        <Card className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500">
                 <Users size={24} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Top Consultores</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maior Valor/Hora</p>
              </div>
           </div>
           <div className="space-y-3">
              {consultores
                .filter(c => selectedUnidade === 'TODAS' || c.unidadeNegocio === selectedUnidade)
                .sort((a, b) => VALOR_HORA_NIVEL[b.nivel] - VALOR_HORA_NIVEL[a.nivel])
                .slice(0, 3)
                .map(c => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between">
                   <div>
                     <span className="text-[10px] font-bold truncate block max-w-[150px]">{c.nome}</span>
                     <span className="text-[8px] font-black text-slate-400 uppercase">{c.especialidade}</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                     {formatCurrency(VALOR_HORA_NIVEL[c.nivel])}/h
                   </span>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
};
