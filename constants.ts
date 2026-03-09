
import { Entidade, CentroCusto, PlanejamentoA3, ProjetoSTI, StatusSTI, TipoProjeto, Area, Consultor, UnidadeNegocio, NivelConsultor } from './types';

export const INITIAL_CENTROS_CUSTO: CentroCusto[] = [
  { id: 'cc-1', nome: 'Consultoria', unidade: 'STI', entidade: Entidade.STI },
  { id: 'cc-2', nome: 'P&D', unidade: 'STI', entidade: Entidade.STI },
  { id: 'cc-3', nome: 'Findeslab', unidade: 'STI', entidade: Entidade.STI },
];

export const INITIAL_PLANEJAMENTO_A3: PlanejamentoA3[] = INITIAL_CENTROS_CUSTO.map(cc => ({
  centroCustoId: cc.id,
  ano: 2026,
  metas: Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    total: 100000 + Math.random() * 50000,
  }))
}));

export const VALOR_HORA_NIVEL: Record<NivelConsultor, number> = {
  [NivelConsultor.TECNICO]: 200,
  [NivelConsultor.GESTOR_PROJETOS]: 200,
  [NivelConsultor.CONSULTOR_I]: 220,
  [NivelConsultor.CONSULTOR_II]: 250,
  [NivelConsultor.ESPECIALISTA]: 275,
  [NivelConsultor.AVANCADO]: 300,
};

export const SEED_CONSULTORES: Consultor[] = [
  { id: 'c-1', nome: 'BEATRIZ', area: Area.COMUNIDADES, especialidade: 'Comunidades', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-2', nome: 'MELINA', area: Area.COMUNIDADES, especialidade: 'Comunidades', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-3', nome: 'ARTHUR', area: Area.INTERNACIONALIZACAO, especialidade: 'Internacionalização', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-4', nome: 'ISADORA', area: Area.INTERNACIONALIZACAO, especialidade: 'Internacionalização', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-5', nome: 'NICOLE', area: Area.INTERNACIONALIZACAO, especialidade: 'Internacionalização', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-6', nome: 'FERNANDA', area: Area.LABORATORIO, especialidade: 'Laboratório', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-7', nome: 'JOÃO PAULO', area: Area.LABORATORIO, especialidade: 'Laboratório', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-8', nome: 'JULIA LAUERS', area: Area.OPERACOES, especialidade: 'Operações', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
  { id: 'c-9', nome: 'MARIANA', area: Area.OPERACOES, especialidade: 'Operações', status: 'Ativo', cargaMensalDisponivel: 166.4, nivel: NivelConsultor.CONSULTOR_I, unidadeNegocio: UnidadeNegocio.FINDESLAB },
];

export const SEED_PROJETOS: ProjetoSTI[] = [
  { 
    id: 'p-1', 
    nome: 'Projeto Beatriz', 
    cliente: 'Cliente A', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.COMUNIDADES, 
    dataInicio: '2026-03-01', 
    dataFim: '2026-12-31', 
    valorContrato: 34 * VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I], 
    horasEstimadas: 34,
    status: StatusSTI.EM_EXECUCAO, 
    progresso: 10,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-2', 
    nome: 'Projeto Melina', 
    cliente: 'Cliente B', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.COMUNIDADES, 
    dataInicio: '2026-03-01', 
    dataFim: '2026-12-31', 
    valorContrato: 27 * VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I], 
    horasEstimadas: 27,
    status: StatusSTI.EM_EXECUCAO, 
    progresso: 10,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-3', 
    nome: 'Projeto Fernanda', 
    cliente: 'Cliente C', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.LABORATORIO, 
    dataInicio: '2026-03-01', 
    dataFim: '2026-12-31', 
    valorContrato: 40 * VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I], 
    horasEstimadas: 40,
    status: StatusSTI.EM_EXECUCAO, 
    progresso: 10,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-4', 
    nome: 'Projeto João Paulo', 
    cliente: 'Cliente D', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.LABORATORIO, 
    dataInicio: '2026-03-01', 
    dataFim: '2026-12-31', 
    valorContrato: 175 * VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I], 
    horasEstimadas: 175,
    status: StatusSTI.EM_EXECUCAO, 
    progresso: 10,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-5', 
    nome: 'Projeto Julia Lauers', 
    cliente: 'Cliente E', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.OPERACOES, 
    dataInicio: '2026-03-01', 
    dataFim: '2026-12-31', 
    valorContrato: 271 * VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I], 
    horasEstimadas: 271,
    status: StatusSTI.EM_EXECUCAO, 
    progresso: 10,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-6', 
    nome: 'Projeto Mariana', 
    cliente: 'Cliente F', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.OPERACOES, 
    dataInicio: '2026-03-01', 
    dataFim: '2026-12-31', 
    valorContrato: 834 * VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I], 
    horasEstimadas: 834,
    status: StatusSTI.EM_EXECUCAO, 
    progresso: 10,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  // Negociações (Planejado)
  { 
    id: 'p-7', 
    nome: 'Negociação Arthur', 
    cliente: 'Prospect G', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.INTERNACIONALIZACAO, 
    dataInicio: '2026-05-01', 
    dataFim: '2026-12-31', 
    valorContrato: 226800, 
    horasEstimadas: 226800 / VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I],
    status: StatusSTI.PLANEJADO, 
    progresso: 0,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-8', 
    nome: 'Negociação Julia', 
    cliente: 'Prospect H', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.OPERACOES, 
    dataInicio: '2026-05-01', 
    dataFim: '2026-12-31', 
    valorContrato: 300000, 
    horasEstimadas: 300000 / VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I],
    status: StatusSTI.PLANEJADO, 
    progresso: 0,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
  { 
    id: 'p-9', 
    nome: 'Negociação Mariana', 
    cliente: 'Prospect I', 
    tipo: TipoProjeto.CONSULTORIA, 
    area: Area.OPERACOES, 
    dataInicio: '2026-05-01', 
    dataFim: '2026-12-31', 
    valorContrato: 560000, 
    horasEstimadas: 560000 / VALOR_HORA_NIVEL[NivelConsultor.CONSULTOR_I],
    status: StatusSTI.PLANEJADO, 
    progresso: 0,
    unidadeNegocio: UnidadeNegocio.FINDESLAB
  },
];
