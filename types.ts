
export enum Turno {
  MANHA = 'Manhã',
  TARDE = 'Tarde',
  NOITE = 'Noite',
  UNMAPPED = 'Não Mapeado'
}

export enum StatusSTI {
  PLANEJADO = 'Planejado',
  EM_EXECUCAO = 'Em Execução',
  ATRASADO = 'Atrasado',
  CONCLUIDO = 'Concluído',
  SUSPENSO = 'Suspenso'
}

export enum Area {
  LOGISTICA = 'Logística',
  AUTOMACAO = 'Automação',
  MECANICA = 'Mecânica',
  TI = 'Tecnologia da Informação',
  ELETRICA = 'Elétrica',
  AUTOMOTIVA = 'Automotiva',
  COMUNIDADES = 'Comunidades',
  INTERNACIONALIZACAO = 'Internacionalização',
  LABORATORIO = 'Laboratório',
  OPERACOES = 'Operações',
  NAO_DEFINIDA = 'Não Definida'
}

export enum TipoProjeto {
  CONSULTORIA = 'Consultoria',
  PDI = 'P&D e Inovação',
  SERVICO_TECNICO = 'Serviço Técnico Especializado',
  METROLOGIA = 'Metrologia'
}

export enum UnidadeNegocio {
  FINDESLAB = 'Findeslab',
  PED = 'P&D',
  CONSULTORIA = 'Consultoria'
}

export enum NivelConsultor {
  TECNICO = 'Técnico',
  GESTOR_PROJETOS = 'Gestor de Projetos',
  CONSULTOR_I = 'Consultor I',
  CONSULTOR_II = 'Consultor II',
  ESPECIALISTA = 'Especialista',
  AVANCADO = 'Avançado'
}

export interface Consultor {
  id: string;
  nome: string;
  area: Area;
  especialidade: string;
  status: 'Ativo' | 'Inativo';
  cargaMensalDisponivel: number;
  nivel: NivelConsultor;
  unidadeNegocio: UnidadeNegocio;
}

export interface ProjetoSTI {
  id: string;
  nome: string;
  cliente: string;
  tipo: TipoProjeto;
  area: Area;
  dataInicio: string;
  dataFim: string;
  valorContrato: number;
  horasEstimadas: number;
  status: StatusSTI;
  progresso: number; // 0-100
  unidadeNegocio: UnidadeNegocio;
}

export interface AlocacaoSTI {
  id: string;
  projetoId: string;
  consultorId: string;
  data: string;
  horasAlocadas: number;
  descricaoAtividade: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'COORDINATION' | 'COMMERCIAL_MANAGER';
  activeModule?: AppModule;
}

export type AppModule = 'PCP' | 'COMMERCIAL';

export interface MatrizTurno {
  id: string;
  inicioString: string;
  turno: Turno;
}

// --- Commercial Performance Types ---

export enum Entidade {
  STI = 'STI'
}

export enum EstagioOportunidade {
  PROSPECCAO = 'Prospecção',
  PROPOSTA = 'Proposta',
  NEGOCIACAO = 'Negociação',
  FECHADO = 'Fechado'
}

export interface CentroCusto {
  id: string;
  nome: string;
  unidade: string;
  entidade: Entidade;
}

export interface MetaMensal {
  mes: number; // 1-12
  total: number;
}

export interface PlanejamentoA3 {
  centroCustoId: string;
  ano: number;
  metas: MetaMensal[];
}

export interface LancamentoReceita {
  id: string;
  data: string;
  itemContabil: string;
  centroCusto: string;
  grupoContabil: string;
  valorRealizado: number;
  cliente: string;
  documento: string; // CPF ou CNPJ
  entidade: Entidade;
}

export interface Oportunidade {
  id: string;
  cliente: string;
  titulo: string;
  valor: number;
  probabilidade: number; // 0-100
  estagio: EstagioOportunidade;
  dataFechamento: string;
  entidade: Entidade;
  centroCustoId: string;
}
