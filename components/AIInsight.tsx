import React, { useState } from 'react';
import { analyzeFinances } from '../services/geminiService';
import { Project } from '../types';
import { Sparkles, RefreshCw, Zap, X, Download, ChevronDown, FileText, Table } from 'lucide-react';

interface AIInsightProps {
  projects: Project[];
}

const AIInsight: React.FC<AIInsightProps> = ({ projects }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeFinances(projects);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Falha ao gerar insights. Verifique sua conexão ou chave de API.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnalysis(null);
    setShowDownloadOptions(false);
  };

  const handleDownloadPDF = () => {
    if (!analysis) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const date = new Date().toLocaleDateString('pt-BR');
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatório Financeiro Klarity AI - ${date}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
              .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
              .logo span { color: #2563EB; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-left: 5px; }
              h1 { color: #2563EB; font-size: 22px; margin-bottom: 20px; }
              .content { background: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; }
              ul { padding-left: 20px; margin-bottom: 15px; }
              li { margin-bottom: 8px; }
              b { color: #0f172a; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              @media print {
                body { padding: 0; }
                .content { border: none; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Klarity <span>PRO</span></div>
              <div style="color: #64748b; font-size: 14px;">${date}</div>
            </div>
            <h1>Análise Financeira Inteligente</h1>
            <div class="content">
              ${analysis}
            </div>
            <div class="footer">
              Relatório gerado automaticamente pela Inteligência Artificial do Klarity PRO • Powered by Gemini
            </div>
            <script>
              window.onload = function() { setTimeout(function() { window.print(); }, 500); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadCSV = () => {
    if (!analysis) return;
    
    // Clean HTML tags to get plain text, preserving basic structure
    const tempDiv = document.createElement("div");
    // Replace list items and paragraphs with newlines for better CSV readability
    const formattedHtml = analysis
      .replace(/<li>/g, '\n• ')
      .replace(/<\/li>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<br\s*\/?>/g, '\n');
      
    tempDiv.innerHTML = formattedHtml;
    const text = tempDiv.textContent || tempDiv.innerText || "";

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(text);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Klarity_AI_Analise_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-dark-surface border border-blue-100 dark:border-blue-900/30 rounded-xl shadow-card overflow-hidden animate-fade-in mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Klarity AI Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Análise financeira inteligente Powered by Gemini</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             {analysis ? (
                <>
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Regenerar Análise"
                  >
                     <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                     <span className="hidden sm:inline">Regenerar</span>
                  </button>
                  <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
                  
                  {/* Download Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-primary hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Download size={14} />
                      <span className="hidden sm:inline">Baixar</span>
                      <ChevronDown size={12} />
                    </button>
                    
                    {showDownloadOptions && (
                      <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 z-20 overflow-hidden animate-fade-in">
                        <button 
                          onClick={() => { handleDownloadPDF(); setShowDownloadOptions(false); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <FileText size={14} className="text-red-500" /> PDF
                        </button>
                        <button 
                          onClick={() => { handleDownloadCSV(); setShowDownloadOptions(false); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 border-t border-gray-50 dark:border-slate-700"
                        >
                          <Table size={14} className="text-green-500" /> CSV
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-erro hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Fechar Análise"
                  >
                    <X size={18} />
                  </button>
                </>
             ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  Gerar Análise
                </button>
             )}
          </div>
        </div>

        {!analysis && !loading && (
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-100 dark:border-slate-700/50">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Clique em "Gerar Análise" para que a IA identifique padrões ocultos, riscos de orçamento e oportunidades de economia em seus projetos.
            </p>
          </div>
        )}

        {loading && (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-5/6"></div>
          </div>
        )}

        {analysis && !loading && (
          <div className="mt-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 animate-fade-in">
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-gray-200 font-medium"
              dangerouslySetInnerHTML={{ __html: analysis }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsight;