
import React, { useState, useMemo } from 'react';
import { Project, Currency } from '../types';
import { CURRENCY_RATES } from '../constants';
import AIInsight from '../components/AIInsight';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Filter, 
  Printer, 
  Plus, 
  Trash2, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieIcon,
  Download,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

// --- Types & Interfaces for Report Components ---

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

// --- Document Generator Component ---

const DocumentGenerator = ({ projects }: { projects: Project[] }) => {
  const [clientName, setClientName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-001`);
  const [currency, setCurrency] = useState<Currency>(Currency.MZN);
  
  // Company Info State
  const [companyName, setCompanyName] = useState('Sua Empresa');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyAddress, setCompanyAddress] = useState('Maputo, Moçambique');
  const [companyEmail, setCompanyEmail] = useState('contact@empresa.mz');
  const [companyPhone, setCompanyPhone] = useState('+258 84 123 4567');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Desenvolvimento Web', qty: 1, price: 50000 }
  ]);
  
  // Import State
  const [showImportDropdown, setShowImportDropdown] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', qty: 1, price: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleImportProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Convert expenses to invoice items
    const newItems: InvoiceItem[] = project.expenses.map((exp, index) => {
       // Simple rate conversion to selected document currency
       const rateDoc = CURRENCY_RATES[currency];
       const rateExp = CURRENCY_RATES[exp.currency];
       const convertedPrice = (exp.amount / rateExp) * rateDoc;

       return {
         id: `imp-${Date.now()}-${index}`,
         description: `${exp.name} (${exp.category})`,
         qty: 1,
         price: parseFloat(convertedPrice.toFixed(2))
       };
    });

    setItems(newItems);
    setClientName(project.name); // Suggest project name as client/reference
    setShowImportDropdown(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCompanyLogo(imageUrl);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.16; // 16% IVA example
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: currency }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in print:animate-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Editor de Documento</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Preencha os dados ou importe de um projeto.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-all">
             <Printer size={16} /> Imprimir / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
        {/* Editor Form */}
        <div className="space-y-6 print:hidden">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-light-border dark:border-dark-border shadow-card">
             <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Dados do Documento</h3>
                
                {/* Import Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowImportDropdown(!showImportDropdown)}
                    className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download size={14} /> Importar Projeto
                  </button>
                  {showImportDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-20 overflow-hidden animate-fade-in">
                      <div className="p-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                        <p className="text-xs font-bold text-gray-500">Selecione um projeto para importar despesas como itens.</p>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {projects.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleImportProject(p.id)}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-200 border-b border-gray-50 dark:border-slate-700/50 last:border-0"
                          >
                            <p className="font-bold truncate">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.expenses.length} despesas</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Cliente / Referência</label>
                  <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome da Empresa/Cliente" className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Número</label>
                  <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
             </div>

             {/* Company Info Inputs */}
             <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Dados da Sua Empresa</label>
                
                {/* Name and Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input 
                       type="text" 
                       value={companyName} 
                       onChange={e => setCompanyName(e.target.value)} 
                       placeholder="Nome da Empresa" 
                       className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white font-bold placeholder:font-normal" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                     <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-gray-500 hover:text-primary">
                        <Upload size={16} />
                        <span className="truncate">{companyLogo ? 'Alterar Logo' : 'Upload Logo'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                     </label>
                     {companyLogo && (
                       <button onClick={() => setCompanyLogo(null)} className="p-2.5 text-gray-400 hover:text-erro hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remover Logo">
                          <Trash2 size={16} />
                       </button>
                     )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input type="text" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} placeholder="Endereço" className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                    </div>
                    <div>
                      <input type="text" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} placeholder="Email" className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                    </div>
                    <div>
                      <input type="text" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} placeholder="Telefone" className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                    </div>
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Moeda do Documento</label>
                <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white">
                   {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">* A importação converterá os valores para esta moeda.</p>
             </div>
          </div>

          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-light-border dark:border-dark-border shadow-card">
             <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Itens do Serviço</h3>
                <button onClick={addItem} className="text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded transition-colors"><Plus size={20} /></button>
             </div>
             <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-start">
                     <div className="flex-1">
                        <input type="text" placeholder="Descrição" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:border-primary dark:text-white" />
                     </div>
                     <div className="w-20">
                        <input type="number" placeholder="Qtd" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:border-primary text-center dark:text-white" />
                     </div>
                     <div className="w-28">
                        <input type="number" placeholder="Preço" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none focus:border-primary text-right dark:text-white" />
                     </div>
                     <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-erro"><Trash2 size={16} /></button>
                  </div>
                ))}
                {items.length === 0 && (
                   <div className="text-center py-4 text-gray-400 text-sm italic">
                      Nenhum item adicionado. Adicione manualmente ou importe de um projeto.
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Live Preview (This part prints) */}
        <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-gray-200 min-h-[600px] relative print:shadow-none print:border-none print:w-full print:m-0">
           {/* Header */}
           <div className="flex justify-between items-start mb-12">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    {companyLogo ? (
                       <img src={companyLogo} alt="Logo" className="h-12 w-auto max-w-[150px] object-contain rounded-lg" />
                    ) : (
                       <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={24} />
                       </div>
                    )}
                    <span className="font-bold text-2xl text-slate-900">{companyName}</span>
                 </div>
                 <div className="text-sm text-gray-500">
                    <p>{companyAddress}</p>
                    <p>{companyEmail}</p>
                    <p>{companyPhone}</p>
                 </div>
              </div>
              <div className="text-right">
                 <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest mb-2">Fatura</h2>
                 <p className="font-bold text-slate-900">#{invoiceNumber}</p>
                 <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
           </div>

           {/* Client Info */}
           <div className="mb-12">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Faturado Para</p>
              <h3 className="text-xl font-bold text-slate-900">{clientName || 'Nome do Cliente'}</h3>
           </div>

           {/* Table */}
           <table className="w-full mb-8">
              <thead>
                 <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Item</th>
                    <th className="text-center py-3 text-xs font-bold text-gray-500 uppercase">Qtd</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase">Preço Unit.</th>
                    <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
                 </tr>
              </thead>
              <tbody className="text-sm">
                 {items.map(item => (
                    <tr key={item.id} className="border-b border-gray-50">
                       <td className="py-4 text-slate-900 font-medium">{item.description || 'Item sem descrição'}</td>
                       <td className="py-4 text-center text-gray-600">{item.qty}</td>
                       <td className="py-4 text-right text-gray-600">{formatMoney(item.price)}</td>
                       <td className="py-4 text-right text-slate-900 font-bold">{formatMoney(item.price * item.qty)}</td>
                    </tr>
                 ))}
              </tbody>
           </table>

           {/* Totals */}
           <div className="flex justify-end">
              <div className="w-64 space-y-3">
                 <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatMoney(subtotal)}</span>
                 </div>
                 <div className="flex justify-between text-sm text-gray-600">
                    <span>IVA (16%):</span>
                    <span>{formatMoney(tax)}</span>
                 </div>
                 <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-primary">{formatMoney(total)}</span>
                 </div>
              </div>
           </div>

           {/* Footer */}
           <div className="mt-16 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm font-bold text-slate-900 mb-1">Obrigado pela preferência!</p>
              <p className="text-xs text-gray-500">Este documento foi gerado digitalmente.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Reports Page ---

const ReportsPage: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'documents'>('analytics');
  const [selectedCurrency, setSelectedCurrency] = useState<'MZN' | Currency>('MZN');

  const formatVal = (val: number) => {
     return new Intl.NumberFormat('pt-MZ', { 
       style: 'currency', 
       currency: selectedCurrency === 'MZN' ? 'MZN' : selectedCurrency,
       notation: "compact",
       compactDisplay: "short"
     }).format(val);
  };

  // --- Calculations ---

  // 1. Consolidated KPIs
  const kpis = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    const rateMZN = CURRENCY_RATES[Currency.MZN];

    projects.forEach(p => {
        // Budget
        let budgetVal = p.budget || 0;
        if (selectedCurrency === 'MZN') {
           budgetVal = (budgetVal / CURRENCY_RATES[p.currency]) * rateMZN;
        } else if (p.currency !== selectedCurrency) {
           return; 
        }
        
        // Expenses
        let spentVal = 0;
        p.expenses.forEach(e => {
            let amount = e.amount;
            if (selectedCurrency === 'MZN') {
                amount = (amount / CURRENCY_RATES[e.currency]) * rateMZN;
            } else if (e.currency !== selectedCurrency) {
                amount = (amount / CURRENCY_RATES[e.currency]) * CURRENCY_RATES[selectedCurrency];
            }
            spentVal += amount;
        });

        if (selectedCurrency !== 'MZN') {
             budgetVal = ((p.budget || 0) / CURRENCY_RATES[p.currency]) * CURRENCY_RATES[selectedCurrency];
        }

        totalBudget += budgetVal;
        totalSpent += spentVal;
    });

    const variance = totalBudget - totalSpent;
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return { totalBudget, totalSpent, variance, percentage };
  }, [projects, selectedCurrency]);


  // 2. Monthly Data
  const monthlyData = useMemo(() => {
    const data: Record<string, any> = {};
    const rateTarget = selectedCurrency === 'MZN' ? CURRENCY_RATES[Currency.MZN] : CURRENCY_RATES[selectedCurrency];

    projects.forEach(project => {
      project.expenses.forEach(expense => {
        const date = new Date(expense.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

        if (!data[key]) {
          data[key] = { name: monthLabel, sortKey: key };
        }

        let amount = (expense.amount / CURRENCY_RATES[expense.currency]) * rateTarget;

        if (!data[key][project.name]) data[key][project.name] = 0;
        data[key][project.name] += amount;
      });
    });

    return Object.values(data).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [projects, selectedCurrency]);

  const projectNames = useMemo(() => projects.map(p => p.name), [projects]);
  const COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

  // 3. Category Data
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    const rateTarget = selectedCurrency === 'MZN' ? CURRENCY_RATES[Currency.MZN] : CURRENCY_RATES[selectedCurrency];

    projects.forEach(p => {
      p.expenses.forEach(e => {
        let amount = (e.amount / CURRENCY_RATES[e.currency]) * rateTarget;
        categories[e.category] = (categories[e.category] || 0) + amount;
      });
    });

    return Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [projects, selectedCurrency]);

  // 4. Top Expenses List (New Feature)
  const topExpenses = useMemo(() => {
    const allExpenses = projects.flatMap(p => p.expenses.map(e => {
      const rateTarget = selectedCurrency === 'MZN' ? CURRENCY_RATES[Currency.MZN] : CURRENCY_RATES[selectedCurrency];
      const amount = (e.amount / CURRENCY_RATES[e.currency]) * rateTarget;
      return { ...e, projectName: p.name, normalizedAmount: amount };
    }));
    
    // Sort descending by normalized amount and take top 5
    return allExpenses.sort((a, b) => b.normalizedAmount - a.normalizedAmount).slice(0, 5);
  }, [projects, selectedCurrency]);

  return (
    <div className="space-y-6 animate-fade-in print:animate-none">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Relatórios & Documentos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Análise financeira avançada e emissão de documentos.</p>
        </div>
        
        {/* Actions Area */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 self-start sm:self-auto">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Análise Financeira
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'documents' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Gerador de Documentos
            </button>
          </div>

          {/* Currency Filter (Only for Analytics) */}
          {activeTab === 'analytics' && (
             <div className="flex items-center gap-3 bg-white dark:bg-dark-surface p-2 pr-4 rounded-lg border border-light-border dark:border-dark-border shadow-sm h-[42px]">
               <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                 <Filter size={16} />
               </div>
               <select 
                 value={selectedCurrency}
                 onChange={(e) => setSelectedCurrency(e.target.value as any)}
                 className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-gray-200 focus:ring-0 cursor-pointer outline-none min-w-[140px]"
               >
                 <option value="MZN">Consolidado (MZN)</option>
                 <option value="USD">Dólar (USD)</option>
                 <option value="EUR">Euro (EUR)</option>
                 <option value="BRL">Real (BRL)</option>
                 <option value="ZAR">Rand (ZAR)</option>
                 <option value="GBP">Libra (GBP)</option>
               </select>
             </div>
          )}
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-6 animate-fade-in print:animate-none">
           {/* Section Title */}
           <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} className="text-primary"/>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                 Visão Geral Financeira
              </h2>
           </div>

          {/* KPI Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
             <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-light-border dark:border-dark-border shadow-card">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Orçamento Total</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatVal(kpis.totalBudget)}</h3>
                <div className="mt-2 text-xs text-gray-400">Soma de todos os projetos</div>
             </div>
             <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-light-border dark:border-dark-border shadow-card">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Executado</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatVal(kpis.totalSpent)}</h3>
                <div className="mt-2 text-xs flex items-center gap-1">
                   <span className="font-bold text-primary">{kpis.percentage.toFixed(1)}%</span> do orçamento
                </div>
             </div>
             <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-light-border dark:border-dark-border shadow-card">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Saldo Restante</p>
                <h3 className={`text-2xl font-black ${kpis.variance >= 0 ? 'text-primary' : 'text-erro'}`}>{formatVal(kpis.variance)}</h3>
                <div className="mt-2 text-xs flex items-center gap-1 text-gray-400">
                   {kpis.variance >= 0 ? <TrendingUp size={12} className="text-primary"/> : <TrendingDown size={12} className="text-erro"/>}
                   {kpis.variance >= 0 ? 'Dentro do previsto' : 'Acima do orçamento'}
                </div>
             </div>
             <div className="bg-white dark:bg-dark-surface p-5 rounded-xl border border-light-border dark:border-dark-border shadow-card">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Projetos Ativos</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{projects.filter(p => p.status === 'Em Andamento').length}</h3>
                <div className="mt-2 text-xs text-gray-400">Total de {projects.length} projetos</div>
             </div>
          </div>

          {/* AI Assistant */}
          <div className="mb-2">
             <AIInsight projects={projects} />
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Bar Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6 shadow-card min-w-0">
               <h3 className="text-base font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                 <span className="w-1 h-5 bg-primary rounded-full"></span>
                 Fluxo de Caixa Mensal
               </h3>
               <div className="h-80 w-full min-w-0">
                 {monthlyData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={monthlyData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} vertical={false} />
                       <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                       <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                         formatter={(val: number) => formatVal(val)}
                         cursor={{fill: 'rgba(22, 163, 74, 0.05)'}}
                       />
                       <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                       {projectNames.map((projName, index) => (
                         <Bar 
                           key={projName} 
                           dataKey={projName} 
                           stackId="a" 
                           fill={COLORS[index % COLORS.length]} 
                           barSize={32}
                         />
                       ))}
                     </BarChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                     <div className="p-4 rounded-full bg-gray-100 dark:bg-slate-800"><DollarSign className="w-8 h-8 opacity-50" /></div>
                     <p>Sem dados para exibir.</p>
                   </div>
                 )}
               </div>
            </div>
    
            {/* Category Pie Chart */}
            <div className="bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6 shadow-card min-w-0">
              <h3 className="text-base font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                 <span className="w-1 h-5 bg-secondary rounded-full"></span>
                 Gastos por Categoria
              </h3>
              <div className="h-80 w-full min-w-0">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         formatter={(val: number) => formatVal(val)}
                         contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                     <PieIcon className="w-12 h-12 opacity-20" />
                     <p>Sem dados.</p>
                   </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detailed Project Performance Table */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
               <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30">
                 <h3 className="text-base font-bold text-slate-900 dark:text-white">Desempenho por Projeto</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Projeto</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Orçamento</th>
                        <th className="px-6 py-4 text-right">Gasto Real</th>
                        <th className="px-6 py-4 w-1/4">Utilização</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                      {projects.map(p => {
                         const rateTarget = selectedCurrency === 'MZN' ? CURRENCY_RATES[Currency.MZN] : CURRENCY_RATES[selectedCurrency];
                         
                         const budget = p.budget 
                           ? (p.budget / CURRENCY_RATES[p.currency]) * rateTarget
                           : 0;

                         const spent = p.expenses.reduce((acc, e) => {
                            return acc + ((e.amount / CURRENCY_RATES[e.currency]) * rateTarget);
                         }, 0);

                         const percent = budget > 0 ? (spent / budget) * 100 : 0;

                         return (
                           <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                 {p.name}
                              </td>
                              <td className="px-6 py-4">
                                 <span className="px-2.5 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                                   {p.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                 {budget > 0 ? formatVal(budget) : '-'}
                              </td>
                              <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                                 {formatVal(spent)}
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                       <div 
                                         className={`h-full rounded-full ${percent > 100 ? 'bg-erro' : percent > 80 ? 'bg-yellow-400' : 'bg-primary'}`} 
                                         style={{ width: `${Math.min(percent, 100)}%` }}
                                       ></div>
                                    </div>
                                    <span className="text-xs font-bold w-10 text-right">{percent.toFixed(0)}%</span>
                                 </div>
                              </td>
                           </tr>
                         );
                      })}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Top Expenses List (New Feature) */}
            <div className="bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
               <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                 <h3 className="text-base font-bold text-slate-900 dark:text-white">Maiores Despesas</h3>
                 <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">Top 5</span>
               </div>
               <div className="divide-y divide-gray-100 dark:divide-slate-800">
                 {topExpenses.length > 0 ? topExpenses.map((exp, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-erro flex items-center justify-center font-bold text-xs">
                             {idx + 1}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{exp.name}</p>
                             <p className="text-xs text-gray-500">{exp.projectName}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{formatVal(exp.normalizedAmount)}</p>
                          <p className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                 )) : (
                    <div className="p-8 text-center text-gray-400 text-sm">Sem despesas registradas.</div>
                 )}
               </div>
            </div>
          </div>
        </div>
      ) : (
        <DocumentGenerator projects={projects} />
      )}
    </div>
  );
};

export default ReportsPage;
