
import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { 
  CloudUpload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Database,
  Search,
  Filter,
  Building2,
  DollarSign
} from 'lucide-react';
import { 
  LancamentoReceita, 
  Entidade, 
  CentroCusto 
} from '../types';

interface CommercialImportProps {
  onImport: (data: LancamentoReceita[]) => void;
  centrosCusto: CentroCusto[];
  currentDataCount: number;
  onClear: () => void;
}

export const CommercialImport: React.FC<CommercialImportProps> = ({
  onImport,
  centrosCusto,
  currentDataCount,
  onClear
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errors: string[];
    preview: LancamentoReceita[];
  } | null>(null);

  const normalizeUnidade = (rawName: string): string => {
    const name = rawName.toUpperCase();
    if (name.includes('VITÓRIA') || name.includes('VITORIA')) return 'Beira Mar';
    if (name.includes('VILA VELHA') || name.includes('ARACAS')) return 'Araçás';
    if (name.includes('SERRA') || name.includes('CIVIT')) return 'Civit';
    return rawName;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Mapeamento de Centro de Custo conforme regra de negócio
        const ccMapping: Record<string, string> = {
          'Consultoria Brasil + Produtivo': 'Consultoria',
          'Consultoria em Processo Produtivo': 'Findeslab',
          'Prog Mover - Hands On': 'Consultoria',
          'Prog de Empreendedorismo - PDI Produto': 'Findeslab',
          'Pesquisa, Desenv. e Inovaçao em Processo': 'P&D',
          'Proj Smart Factory': 'P&D'
        };

        const processed: LancamentoReceita[] = jsonData
          .map((row, idx) => {
            const entidade = Entidade.STI;
            const nmCrRaw = row['nm cr'] || row['NM CR'] || row['Centro de Custo'] || '';
            const centroCustoMapeado = ccMapping[nmCrRaw] || nmCrRaw;
            
            // Tenta encontrar o valor em colunas comuns
            let rawValor = row.VlRealizado ?? row['Vl Realizado'] ?? row['Valor'] ?? row['Valor Realizado'] ?? row['Vl. Realizado'] ?? 0;
            
            // Tratamento robusto de números (converte strings "1.234,56" para number)
            let valor = 0;
            if (typeof rawValor === 'number') {
              valor = rawValor;
            } else if (typeof rawValor === 'string') {
              // Remove separadores de milhar e troca vírgula por ponto
              const normalized = rawValor.replace(/\./g, '').replace(',', '.');
              valor = parseFloat(normalized) || 0;
            }

            const itemContabil = row.NMItemContabil || row['Item Contábil'] || row['Descrição'] || 'Sem Descrição';
            const cliente = row.Cliente || row['Nome'] || row['Razão Social'] || 'Cliente Não Identificado';
            const documento = row.Documento || row['CPF/CNPJ'] || '';

            return {
              id: `import-${Date.now()}-${idx}`,
              data: new Date().toISOString(),
              itemContabil: String(itemContabil),
              centroCusto: String(centroCustoMapeado),
              grupoContabil: String(row.NMGrupoContabil || 'Serviços'),
              valorRealizado: valor,
              cliente: String(cliente),
              documento: String(documento),
              entidade
            };
          });

        if (replaceExisting) {
          onClear();
        }
        
        setImportResult({
          success: true,
          count: processed.length,
          errors: [],
          preview: processed
        });
        onImport(processed);
      } catch (err) {
        console.error('Erro ao processar arquivo:', err);
        setImportResult({
          success: false,
          count: 0,
          errors: ['Erro ao processar estrutura do arquivo. Verifique se o arquivo é um Excel válido.'],
          preview: []
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setImportResult({
        success: false,
        count: 0,
        errors: ['Erro na leitura do arquivo.'],
        preview: []
      });
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-slate-800/10 rounded-3xl border border-slate-800/20 mb-4">
          <Database className="text-slate-700" size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Inteligência de Importação</h1>
        <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto">
          Arraste suas exportações nativas do sistema contábil. O algoritmo mapeia automaticamente centros de custo com base na coluna "nm cr".
        </p>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="replace" 
              checked={replaceExisting} 
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="w-4 h-4 accent-slate-900"
            />
            <label htmlFor="replace" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">
              Substituir dados atuais
            </label>
          </div>
          {currentDataCount > 0 && (
            <button 
              onClick={onClear}
              className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
            >
              Limpar {currentDataCount} registros
            </button>
          )}
        </div>
      </div>

      {!importResult && !isProcessing && (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative h-80 border-4 border-dashed rounded-[40px] flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging ? 'border-slate-600 bg-slate-50 dark:bg-slate-800/20 scale-[0.98]' : 'border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform">
            <CloudUpload size={48} className={isDragging ? 'text-slate-600' : 'text-slate-300 dark:text-slate-700'} />
          </div>
          <p className="text-lg font-black uppercase tracking-tight text-slate-400">Arraste seu arquivo XLSX ou CSV</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Mapeamento inteligente NMItemContabil + nm cr</p>
          
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />
        </div>
      )}

      {isProcessing && (
        <div className="h-80 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center space-y-6 shadow-xl">
          <div className="relative">
            <Loader2 size={64} className="text-slate-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileSpreadsheet size={24} className="text-slate-400" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black uppercase tracking-tighter">Processando Dados...</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Normalizando unidades e filtrando escopo de serviços</p>
          </div>
        </div>
      )}

      {importResult && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className={`p-8 rounded-[40px] border flex items-center justify-between ${importResult.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-3xl ${importResult.success ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white shadow-xl shadow-rose-900/20'}`}>
                {importResult.success ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                  {importResult.success ? 'Importação Concluída' : 'Falha na Importação'}
                </h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {importResult.success ? `${importResult.count} lançamentos processados com sucesso` : 'Ocorreram erros durante o mapeamento'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setImportResult(null)}
              className="px-8 py-4 bg-white dark:bg-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Nova Importação
            </button>
          </div>

          {importResult.success && (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Preview dos Dados Processados</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5">
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Item Contábil</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Centro de Custo</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Valor Realizado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {importResult.preview.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-5">
                          <p className="text-xs font-black uppercase tracking-tight">{row.itemContabil}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{row.entidade}</p>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Building2 size={12} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{row.centroCusto}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="text-xs font-bold">{row.cliente}</p>
                          <p className="text-[9px] text-slate-500 font-medium">{row.documento}</p>
                        </td>
                        <td className="p-5 text-right">
                          <span className="text-sm font-black text-emerald-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.valorRealizado)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
