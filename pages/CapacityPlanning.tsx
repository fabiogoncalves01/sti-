import React, { useState, useMemo } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { Consultor, ProjetoSTI, UnidadeNegocio, Area, NivelConsultor } from '../types';
import { VALOR_HORA_NIVEL } from '../constants';
import { Users, DollarSign, Clock, Search, Filter, TrendingUp, Table as TableIcon } from 'lucide-react';

interface CapacityPlanningProps {
  consultores: Consultor[];
  projetos: ProjetoSTI[];
}

export const CapacityPlanning: React.FC<CapacityPlanningProps> = ({ consultores, projetos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeNegocio | 'TODAS'>('TODAS');

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const mesesRestantes = 12 - new Date().getMonth();

  const consultoresData = useMemo(() => {
    return consultores
      .filter(c => selectedUnidade === 'TODAS' || c.unidadeNegocio === selectedUnidade)
      .filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.area.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(consultor => {
        // Projetos em Execução (Planejado na imagem)
        const projetosExecucao = projetos.filter(p => 
          p.status === 'Em Execução' && 
          p.nome.toLowerCase().includes(consultor.nome.toLowerCase().split(' ')[0]) // Simple matching for seed data
        );
        const horasPlanejadas = projetosExecucao.reduce((acc, p) => acc + (p.horasEstimadas || 0), 0);
        const valorExecucao = projetosExecucao.reduce((acc, p) => acc + p.valorContrato, 0);

        // Projetos em Negociação
        const projetosNegociacao = projetos.filter(p => 
          p.status === 'Planejado' && 
          p.nome.toLowerCase().includes(consultor.nome.toLowerCase().split(' ')[0]) // Simple matching for seed data
        );
        const horasNegociacao = projetosNegociacao.reduce((acc, p) => acc + (p.horasEstimadas || 0), 0);
        const valorNegociacao = projetosNegociacao.reduce((acc, p) => acc + p.valorContrato, 0);

        const capacidadeMensal = consultor.cargaMensalDisponivel;
        const capacidadeTotal = capacidadeMensal * mesesRestantes; // Mês atual até Dezembro
        
        const horasDisponiveis = capacidadeTotal - horasPlanejadas - horasNegociacao;
        const valorHora = VALOR_HORA_NIVEL[consultor.nivel];
        const valorDisponivelVenda = horasDisponiveis * valorHora;

        return {
          ...consultor,
          horasPlanejadas,
          horasNegociacao,
          horasDisponiveis,
          valorHora,
          valorNegociacao,
          valorDisponivelVenda
        };
      });
  }, [consultores, projetos, searchTerm, selectedUnidade]);

  const summary = useMemo(() => {
    const meta = 2527872.00;
    const executado = 28720.14;
    const emExecucao = 182320.14; 
    const emNegociacao = 1086800.00;
    const desafioAtingirMeta = 1308751.86;

    return {
      meta,
      executado,
      emExecucao,
      emNegociacao,
      desafioAtingirMeta
    };
  }, [projetos]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-inner">
            <TableIcon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Capacidade Instalada</h2>
            <p className="text-slate-400 text-sm font-medium">Visão detalhada de alocação e disponibilidade financeira.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ESTEIRA */}
        <Card className="lg:col-span-2 p-6 rounded-[2rem] border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4">Esteira</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">Meta</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(summary.meta)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">Executado</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(summary.executado)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">Em Execução</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(summary.emExecucao)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">Em Negociação</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(summary.emNegociacao)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
              <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400">Desafio Atingir Meta</span>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">{formatCurrency(summary.desafioAtingirMeta)}</span>
            </div>
          </div>
        </Card>

        {/* NÍVEIS PARA H/h */}
        <Card className="p-6 rounded-[2rem] border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4">Níveis para H/h</h3>
          <div className="space-y-2">
            {Object.entries(VALOR_HORA_NIVEL).map(([nivel, valor]) => (
              <div key={nivel} className="flex justify-between items-center p-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">{nivel}</span>
                <span className="text-[11px] font-black text-slate-900 dark:text-white bg-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-500 px-2 py-1 rounded">
                  {formatCurrency(valor)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-0 rounded-[2rem] border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {selectedUnidade === 'TODAS' ? 'Todos os Consultores' : selectedUnidade}
          </h3>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <Button variant={selectedUnidade === 'TODAS' ? 'primary' : 'secondary'} size="sm" onClick={() => setSelectedUnidade('TODAS')}>Global</Button>
              <Button variant={selectedUnidade === UnidadeNegocio.FINDESLAB ? 'primary' : 'secondary'} size="sm" onClick={() => setSelectedUnidade(UnidadeNegocio.FINDESLAB)}>Findeslab</Button>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar consultor..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Consultor</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Área</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center" colSpan={3}>Restante do Ano ({mesesRestantes} Meses)</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">R$ Hora</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">R$ Em Negociação</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">R$ Aguardando Aceite</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">R$ Disponível Venda</th>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th colSpan={2}></th>
                <th className="p-2 text-[9px] font-bold uppercase text-slate-400 text-center border-l border-slate-200 dark:border-slate-700">H Planejada</th>
                <th className="p-2 text-[9px] font-bold uppercase text-slate-400 text-center border-l border-slate-200 dark:border-slate-700">H Negociação</th>
                <th className="p-2 text-[9px] font-bold uppercase text-slate-400 text-center border-l border-slate-200 dark:border-slate-700">H Disponíveis</th>
                <th colSpan={4}></th>
              </tr>
            </thead>
            <tbody>
              {consultoresData.map((c, idx) => (
                <tr key={c.id} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/30 dark:bg-slate-900/50'}`}>
                  <td className="p-4 text-xs font-bold text-slate-800 dark:text-slate-200">{c.nome}</td>
                  <td className="p-4 text-[10px] font-bold uppercase text-slate-500">{c.area}</td>
                  <td className="p-4 text-xs text-center border-l border-slate-100 dark:border-slate-800">{c.horasPlanejadas ? Math.round(c.horasPlanejadas) : ''}</td>
                  <td className="p-4 text-xs text-center border-l border-slate-100 dark:border-slate-800">{c.horasNegociacao ? Math.round(c.horasNegociacao) : ''}</td>
                  <td className="p-4 text-xs text-center font-bold border-l border-slate-100 dark:border-slate-800">{Math.round(c.horasDisponiveis)}</td>
                  <td className="p-4 text-xs text-right border-l border-slate-100 dark:border-slate-800">{formatCurrency(c.valorHora)}</td>
                  <td className="p-4 text-xs text-right">{c.valorNegociacao > 0 ? formatCurrency(c.valorNegociacao) : '-'}</td>
                  <td className="p-4 text-xs text-right">-</td>
                  <td className="p-4 text-xs text-right font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(c.valorDisponivelVenda)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
