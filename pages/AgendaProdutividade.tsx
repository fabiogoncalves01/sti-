import React, { useState, useMemo } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { Consultor, UnidadeNegocio } from '../types';
import { Calendar, Search, TrendingUp, Clock, Activity, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AgendaProdutividadeProps {
  consultores: Consultor[];
}

const MESES = [
  'Março', 'Abril', 'Maio', 'Junho', 'Julho', 
  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Helper para gerar dados mockados consistentes baseados no ID do consultor
const generateMockMonthData = (consultorId: string, mesIndex: number) => {
  const baseDisponibilidade = [176, 152, 160, 168, 184, 168, 160, 168, 152, 176][mesIndex];
  
  // Usar o ID e o mês para gerar um valor pseudo-aleatório determinístico
  const seed = consultorId.charCodeAt(consultorId.length - 1) + mesIndex;
  
  let remunerada = 0;
  let naoRemunerada = 0;

  // Simular alguns consultores com mais carga que outros
  if (seed % 3 === 0) {
    remunerada = Math.floor(baseDisponibilidade * 0.6); // 60%
    naoRemunerada = Math.floor(baseDisponibilidade * 0.1); // 10%
  } else if (seed % 3 === 1) {
    remunerada = Math.floor(baseDisponibilidade * 0.3); // 30%
    naoRemunerada = Math.floor(baseDisponibilidade * 0.2); // 20%
  } else {
    remunerada = Math.floor(baseDisponibilidade * 0.8); // 80%
    naoRemunerada = Math.floor(baseDisponibilidade * 0.05); // 5%
  }

  // Adicionar alguma variação
  remunerada += (seed % 10);
  naoRemunerada += (seed % 5);

  // Garantir que não ultrapasse a disponibilidade
  if (remunerada + naoRemunerada > baseDisponibilidade) {
    remunerada = baseDisponibilidade - naoRemunerada;
  }

  const capOciosa = baseDisponibilidade - remunerada - naoRemunerada;
  const produtividade = baseDisponibilidade > 0 ? (remunerada / baseDisponibilidade) * 100 : 0;

  return {
    disponibilidade: baseDisponibilidade,
    remunerada,
    naoRemunerada,
    capOciosa,
    produtividade
  };
};

export const AgendaProdutividade: React.FC<AgendaProdutividadeProps> = ({ consultores }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeNegocio | 'TODAS'>('TODAS');
  const [selectedChartConsultor, setSelectedChartConsultor] = useState<string | null>(null);

  const filteredConsultores = useMemo(() => {
    return consultores
      .filter(c => selectedUnidade === 'TODAS' || c.unidadeNegocio === selectedUnidade)
      .filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.area.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [consultores, searchTerm, selectedUnidade]);

  const chartConsultorId = selectedChartConsultor || 'GERAL';
  const chartConsultor = consultores.find(c => c.id === chartConsultorId);

  const chartData = useMemo(() => {
    if (chartConsultorId === 'GERAL') {
      return MESES.map((mes, index) => {
        let remunerada = 0;
        let naoRemunerada = 0;
        let capOciosa = 0;
        let disponibilidade = 0;

        filteredConsultores.forEach(c => {
          const data = generateMockMonthData(c.id, index);
          remunerada += data.remunerada;
          naoRemunerada += data.naoRemunerada;
          capOciosa += data.capOciosa;
          disponibilidade += data.disponibilidade;
        });

        return {
          name: mes.substring(0, 3),
          Remunerada: remunerada,
          'Não Remunerada': naoRemunerada,
          'Cap. Ociosa': capOciosa,
          Disponível: disponibilidade,
        };
      });
    }

    if (!chartConsultorId) return [];
    
    return MESES.map((mes, index) => {
      const data = generateMockMonthData(chartConsultorId, index);
      return {
        name: mes.substring(0, 3),
        Remunerada: data.remunerada,
        'Não Remunerada': data.naoRemunerada,
        'Cap. Ociosa': data.capOciosa,
        Disponível: data.disponibilidade,
      };
    });
  }, [chartConsultorId, filteredConsultores]);

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner">
            <Calendar size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Agenda & Produtividade</h2>
            <p className="text-slate-400 text-sm font-medium">Linha do tempo de alocação e produtividade mensal por consultor.</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-4">
           <div className="relative min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar consultor ou área..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </header>

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

      {(chartConsultor || chartConsultorId === 'GERAL') && (
        <Card className="p-6 rounded-[2rem] border-slate-200 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Análise de Produtividade</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Visualização mensal de alocação</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Consultor:</span>
              <select 
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={chartConsultorId || 'GERAL'}
                onChange={(e) => setSelectedChartConsultor(e.target.value)}
              >
                <option value="GERAL">GERAL (Todos)</option>
                {filteredConsultores.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.area})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px', color: '#94a3b8' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="Remunerada" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Não Remunerada" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Cap. Ociosa" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card className="p-0 rounded-[2rem] border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest sticky left-0 z-20 bg-slate-900 border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  Mês
                </th>
                {filteredConsultores.map(c => (
                  <th key={c.id} className="p-4 border-r border-white/10 text-center" colSpan={5}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{c.nome}</div>
                    <div className="text-[8px] font-bold uppercase text-slate-400 mt-1">{c.area}</div>
                  </th>
                ))}
              </tr>
              <tr className="bg-slate-800 text-slate-300">
                <th className="p-2 sticky left-0 z-20 bg-slate-800 border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"></th>
                {filteredConsultores.map(c => (
                  <React.Fragment key={`cols-${c.id}`}>
                    <th className="p-2 text-[9px] font-bold uppercase text-center border-r border-white/5">Disponível</th>
                    <th className="p-2 text-[9px] font-bold uppercase text-center border-r border-white/5 text-emerald-400">Remunerada</th>
                    <th className="p-2 text-[9px] font-bold uppercase text-center border-r border-white/5 text-amber-400">Não Remun.</th>
                    <th className="p-2 text-[9px] font-bold uppercase text-center border-r border-white/5 text-rose-400">Cap. Ociosa</th>
                    <th className="p-2 text-[9px] font-black uppercase text-center border-r border-white/10 text-indigo-400">Produtividade</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {MESES.map((mes, mesIndex) => (
                <tr key={mes} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-xs font-black uppercase text-slate-800 dark:text-slate-200 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[4px_0_12px_rgba(0,0,0,0.05)]">
                    {mes}
                  </td>
                  {filteredConsultores.map(c => {
                    const data = generateMockMonthData(c.id, mesIndex);
                    return (
                      <React.Fragment key={`${c.id}-${mes}`}>
                        <td className="p-3 text-xs text-center border-r border-slate-100 dark:border-slate-800/50 font-medium text-slate-600 dark:text-slate-400">
                          {formatHours(data.disponibilidade)}
                        </td>
                        <td className="p-3 text-xs text-center border-r border-slate-100 dark:border-slate-800/50 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10">
                          {formatHours(data.remunerada)}
                        </td>
                        <td className="p-3 text-xs text-center border-r border-slate-100 dark:border-slate-800/50 font-medium text-amber-600 dark:text-amber-400">
                          {formatHours(data.naoRemunerada)}
                        </td>
                        <td className="p-3 text-xs text-center border-r border-slate-100 dark:border-slate-800/50 font-medium text-rose-600 dark:text-rose-400">
                          {formatHours(data.capOciosa)}
                        </td>
                        <td className="p-3 text-xs text-center border-r border-slate-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-indigo-900/10">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-black text-indigo-600 dark:text-indigo-400 w-8 text-right">
                              {Math.round(data.produtividade)}%
                            </span>
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${data.produtividade >= 70 ? 'bg-emerald-500' : data.produtividade >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${data.produtividade}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
              {/* Linha de Total */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-black">
                <td className="p-4 text-xs uppercase text-slate-900 dark:text-white sticky left-0 z-10 bg-slate-200 dark:bg-slate-700 border-r border-slate-300 dark:border-slate-600 shadow-[4px_0_12px_rgba(0,0,0,0.05)]">
                  TOTAL
                </td>
                {filteredConsultores.map(c => {
                  // Calcular totais
                  let totalDisp = 0, totalRem = 0, totalNaoRem = 0, totalOciosa = 0;
                  MESES.forEach((_, idx) => {
                    const d = generateMockMonthData(c.id, idx);
                    totalDisp += d.disponibilidade;
                    totalRem += d.remunerada;
                    totalNaoRem += d.naoRemunerada;
                    totalOciosa += d.capOciosa;
                  });
                  const prodTotal = totalDisp > 0 ? (totalRem / totalDisp) * 100 : 0;

                  return (
                    <React.Fragment key={`total-${c.id}`}>
                      <td className="p-3 text-xs text-center border-r border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                        {formatHours(totalDisp)}
                      </td>
                      <td className="p-3 text-xs text-center border-r border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30">
                        {formatHours(totalRem)}
                      </td>
                      <td className="p-3 text-xs text-center border-r border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400">
                        {formatHours(totalNaoRem)}
                      </td>
                      <td className="p-3 text-xs text-center border-r border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400">
                        {formatHours(totalOciosa)}
                      </td>
                      <td className="p-3 text-xs text-center border-r border-slate-300 dark:border-slate-600 bg-indigo-100/50 dark:bg-indigo-900/30">
                        <span className="text-indigo-700 dark:text-indigo-400">
                          {Math.round(prodTotal)}%
                        </span>
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
