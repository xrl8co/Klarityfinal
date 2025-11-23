
import React, { useState, useEffect, useMemo } from 'react';
import { Currency } from '../types';
import { CURRENCY_RATES } from '../constants';
import { 
  ArrowRightLeft, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Search, 
  X, 
  Check,
  RefreshCw,
  GripVertical,
  Calculator,
  BellRing,
  ArrowRight,
  Landmark,
  Percent,
  Wallet,
  ArrowDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock historical data for the chart
const HISTORICAL_DATA = [
  { day: 'Seg', rate: 63.20 },
  { day: 'Ter', rate: 63.45 },
  { day: 'Qua', rate: 63.30 },
  { day: 'Qui', rate: 63.80 },
  { day: 'Sex', rate: 63.50 },
  { day: 'Sáb', rate: 63.65 },
  { day: 'Dom', rate: 63.50 },
];

const FLAGS: Record<string, string> = {
  [Currency.MZN]: '🇲🇿', [Currency.USD]: '🇺🇸', [Currency.EUR]: '🇪🇺', [Currency.BRL]: '🇧🇷',
  [Currency.ZAR]: '🇿🇦', [Currency.GBP]: '🇬🇧', [Currency.CNY]: '🇨🇳', [Currency.JPY]: '🇯🇵',
  [Currency.CAD]: '🇨🇦', [Currency.AUD]: '🇦🇺', [Currency.CHF]: '🇨🇭', [Currency.AOA]: '🇦🇴',
  [Currency.INR]: '🇮🇳', [Currency.RUB]: '🇷🇺', [Currency.NZD]: '🇳🇿', [Currency.SGD]: '🇸🇬',
  [Currency.KES]: '🇰🇪', [Currency.NGN]: '🇳🇬', [Currency.GHS]: '🇬🇭', [Currency.MXN]: '🇲🇽',
  [Currency.HKD]: '🇭🇰', [Currency.KRW]: '🇰🇷', [Currency.TRY]: '🇹🇷', [Currency.SEK]: '🇸🇪',
  [Currency.NOK]: '🇳🇴', [Currency.DKK]: '🇩🇰', [Currency.PLN]: '🇵🇱', [Currency.THB]: '🇹🇭',
  [Currency.IDR]: '🇮🇩', [Currency.MYR]: '🇲🇾', [Currency.PHP]: '🇵🇭', [Currency.VND]: '🇻🇳',
  // Novas Bandeiras e Cripto
  [Currency.ADA]: '🔵', [Currency.AED]: '🇦🇪', [Currency.AFN]: '🇦🇫', [Currency.ALL]: '🇦🇱', [Currency.AMD]: '🇦🇲',
  [Currency.ANG]: '🇳🇱', [Currency.ARS]: '🇦🇷', [Currency.AWG]: '🇦🇼', [Currency.AZN]: '🇦🇿',
  [Currency.BAM]: '🇧🇦', [Currency.BBD]: '🇧🇧', [Currency.BCH]: '🟢',
  [Currency.BDT]: '🇧🇩', [Currency.BGN]: '🇧🇬', [Currency.BHD]: '🇧🇭', [Currency.BIF]: '🇧🇮',
  [Currency.BMD]: '🇧🇲', [Currency.BND]: '🇧🇳', [Currency.BOB]: '🇧🇴', [Currency.BSD]: '🇧🇸',
  [Currency.XBT]: '₿',  
  [Currency.BTN]: '🇧🇹', [Currency.BWP]: '🇧🇼', [Currency.BYN]: '🇧🇾', [Currency.BZD]: '🇧🇿',
  [Currency.CDF]: '🇨🇩', [Currency.CLP]: '🇨🇱', [Currency.COP]: '🇨🇴', [Currency.CRC]: '🇨🇷',
  [Currency.CUC]: '🇨🇺', [Currency.CUP]: '🇨🇺', [Currency.CVE]: '🇨🇻', [Currency.CZK]: '🇨🇿',
  [Currency.DJF]: '🇩🇯', [Currency.DOGE]: '🐶', [Currency.DOP]: '🇩🇴', [Currency.DOT]: '🟣',
  [Currency.DZD]: '🇩🇿', [Currency.EGP]: '🇪🇬', [Currency.ERN]: '🇪🇷', [Currency.ETB]: '🇪🇹',
  [Currency.ETH]: '♦️', 
  [Currency.FJD]: '🇫🇯', [Currency.FKP]: '🇫🇰', [Currency.GEL]: '🇬🇪', [Currency.GGP]: '🇬🇬',
  [Currency.GIP]: '🇬🇮', [Currency.GMD]: '🇬🇲', [Currency.GNF]: '🇬🇳', [Currency.GTQ]: '🇬🇹',
  [Currency.GYD]: '🇬🇾', [Currency.HNL]: '🇭🇳', [Currency.HRK]: '🇭🇷', [Currency.HTG]: '🇭🇹',
  [Currency.HUF]: '🇭🇺', [Currency.ILS]: '🇮🇱', [Currency.IMP]: '🇮🇲', [Currency.IQD]: '🇮🇶',
  [Currency.ISK]: '🇮🇸', [Currency.JEP]: '🇯🇪', [Currency.JMD]: '🇯🇲', [Currency.JOD]: '🇯🇴',
  [Currency.KGS]: '🇰🇬', [Currency.KHR]: '🇰🇭', [Currency.KPW]: '🇰🇵', [Currency.KWD]: '🇰🇼',
  [Currency.KYD]: '🇰🇾', [Currency.KZT]: '🇰🇿', [Currency.LAK]: '🇱🇦', [Currency.LBP]: '🇱🇧',
  [Currency.LINK]: '🔗', [Currency.LKR]: '🇱🇰', [Currency.LRD]: '🇱🇷', [Currency.LSL]: '🇱🇸',
  [Currency.LTC]: 'Ł', [Currency.LUNA]: '🌖', [Currency.LYD]: '🇱🇾', [Currency.MAD]: '🇲🇦',
  [Currency.MDL]: '🇲🇩', [Currency.MGA]: '🇲🇬', [Currency.MKD]: '🇲🇰', [Currency.MMK]: '🇲🇲',
  [Currency.MNT]: '🇲🇳', [Currency.MOP]: '🇲🇴', [Currency.MRU]: '🇲🇷', [Currency.MUR]: '🇲🇺',
  [Currency.MVR]: '🇲🇻', [Currency.MWK]: '🇲🇼', [Currency.NAD]: '🇳🇦', [Currency.NIO]: '🇳🇮',
  [Currency.NPR]: '🇳🇵', [Currency.OMR]: '🇴🇲', [Currency.PAB]: '🇵🇦', [Currency.PEN]: '🇵🇪',
  [Currency.PGK]: '🇵🇬', [Currency.PKR]: '🇵🇰', [Currency.PYG]: '🇵🇾', [Currency.QAR]: '🇶🇦',
  [Currency.RSD]: '🇷🇸', [Currency.RWF]: '🇷🇼', [Currency.SAR]: '🇸🇦', [Currency.SBD]: '🇸🇧',
  [Currency.SCR]: '🇸🇨', [Currency.SDG]: '🇸🇩', [Currency.SHP]: '🇸🇭', [Currency.SLE]: '🇸🇱',
  [Currency.SLL]: '🇸🇱', [Currency.SOS]: '🇸🇴', [Currency.SPL]: '🏳️', [Currency.SRD]: '🇸🇷',
  [Currency.STN]: '🇸🇹', [Currency.SVC]: '🇸🇻', [Currency.SYP]: '🇸🇾', [Currency.SZL]: '🇸🇿',
  [Currency.TJS]: '🇹🇯', [Currency.TMT]: '🇹🇲', [Currency.TND]: '🇹🇳', [Currency.TOP]: '🇹🇴',
  [Currency.TTD]: '🇹🇹', [Currency.TVD]: '🇹🇻', [Currency.TWD]: '🇹🇼', [Currency.TZS]: '🇹🇿',
  [Currency.UAH]: '🇺🇦', [Currency.UGX]: '🇺🇬', [Currency.UNI]: '🦄', [Currency.UYU]: '🇺🇾',
  [Currency.UZS]: '🇺🇿', [Currency.VEF]: '🇻🇪', [Currency.VES]: '🇻🇪', [Currency.VUV]: '🇻🇺',
  [Currency.WST]: '🇼🇸', [Currency.XAF]: '🌍', [Currency.XAG]: '🥈', [Currency.XAU]: '🥇',
  [Currency.XCD]: '🏝️', [Currency.XDR]: '🏦', [Currency.XLM]: '🚀', [Currency.XOF]: '🌍',
  [Currency.XPD]: '⚙️', [Currency.XPF]: '🏝️', [Currency.XPT]: '💍', [Currency.XRP]: '✕',
  [Currency.YER]: '🇾🇪', [Currency.ZMW]: '🇿🇲', [Currency.ZWD]: '🇿🇼'
};

const NAMES: Record<string, string> = {
  [Currency.MZN]: 'Metical', [Currency.USD]: 'Dólar EUA', [Currency.EUR]: 'Euro',
  [Currency.BRL]: 'Real', [Currency.ZAR]: 'Rand', [Currency.GBP]: 'Libra',
  [Currency.CNY]: 'Yuan', [Currency.JPY]: 'Iene', [Currency.CAD]: 'Dólar CAD',
  [Currency.AUD]: 'Dólar AUD', [Currency.CHF]: 'Franco Suíço', [Currency.AOA]: 'Kwanza',
  [Currency.INR]: 'Rúpia', [Currency.RUB]: 'Rublo', [Currency.NZD]: 'Dólar NZD',
  [Currency.SGD]: 'Dólar SGD', [Currency.KES]: 'Xelim Queniano', [Currency.NGN]: 'Naira',
  [Currency.GHS]: 'Cedi', [Currency.MXN]: 'Peso MEX', [Currency.HKD]: 'Dólar HKD',
  [Currency.KRW]: 'Won', [Currency.TRY]: 'Lira Turca', [Currency.SEK]: 'Coroa Sueca',
  [Currency.NOK]: 'Coroa Norueguesa', [Currency.DKK]: 'Coroa Dinamarquesa', [Currency.PLN]: 'Zloty',
  [Currency.THB]: 'Baht', [Currency.IDR]: 'Rupia ID', [Currency.MYR]: 'Ringgit',
  [Currency.PHP]: 'Peso PHP', [Currency.VND]: 'Dong', [Currency.XBT]: 'Bitcoin', [Currency.ETH]: 'Ethereum'
};

const TransferSimulator = ({ rates }: { rates: Record<Currency, number> }) => {
  const [amount, setAmount] = useState(1000);
  const [sourceCurr, setSourceCurr] = useState<Currency>(Currency.USD);
  const [targetCurr, setTargetCurr] = useState<Currency>(Currency.MZN);
  const [spread, setSpread] = useState(2.0); // 2% spread bank default
  const [fee, setFee] = useState(25); // Fixed fee

  // Ensure rates exist before calculating
  const safeSourceRate = rates[sourceCurr] || 1;
  const safeTargetRate = rates[targetCurr] || 1;

  const rawRate = (1 / safeSourceRate) * safeTargetRate;
  const commercialRate = rawRate * (1 - spread / 100);
  const receivedAmount = Math.max(0, (amount - fee)) * commercialRate;

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-card border border-light-border dark:border-dark-border">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-light-border dark:border-dark-border">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
          <Calculator size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white leading-tight">Simulador de Custo</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Inclui spread e taxas bancárias.</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Input Section */}
        <div className="space-y-4">
           <div className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Você Envia</label>
             <div className="flex items-center gap-3">
               <div className="relative flex-1">
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))} 
                    className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder-gray-300" 
                  />
               </div>
               <div className="h-6 w-px bg-gray-300 dark:bg-slate-600"></div>
               <select 
                 value={sourceCurr} 
                 onChange={e => setSourceCurr(e.target.value as Currency)} 
                 className="bg-transparent font-bold text-sm text-slate-700 dark:text-gray-200 outline-none cursor-pointer"
               >
                 {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
           </div>

           <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 p-1.5 rounded-full text-gray-400 shadow-sm">
                 <ArrowDown size={14} />
              </div>
           </div>

           <div className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Beneficiário Recebe</label>
             <div className="flex items-center gap-3">
               <div className="flex-1 text-lg font-bold text-primary truncate">
                 {new Intl.NumberFormat('pt-MZ', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(receivedAmount)}
               </div>
               <div className="h-6 w-px bg-gray-300 dark:bg-slate-600"></div>
               <select 
                 value={targetCurr} 
                 onChange={e => setTargetCurr(e.target.value as Currency)} 
                 className="bg-transparent font-bold text-sm text-slate-700 dark:text-gray-200 outline-none cursor-pointer"
               >
                 {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
           </div>
        </div>

        {/* Settings Section */}
        <div className="grid grid-cols-2 gap-3">
           <div className="p-3 bg-white dark:bg-dark-bg border border-gray-100 dark:border-slate-700 rounded-lg">
             <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1"><Landmark size={10} /> Taxa Fixa</label>
             <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-white">
                <span>{sourceCurr}</span>
                <input 
                  type="number" 
                  value={fee} 
                  onChange={e => setFee(Number(e.target.value))} 
                  className="w-full ml-2 bg-transparent outline-none text-right" 
                />
             </div>
           </div>
           <div className="p-3 bg-white dark:bg-dark-bg border border-gray-100 dark:border-slate-700 rounded-lg">
             <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1"><Percent size={10} /> Spread</label>
             <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-white">
                <input 
                  type="number" 
                  step="0.1" 
                  value={spread} 
                  onChange={e => setSpread(Number(e.target.value))} 
                  className="w-full mr-1 bg-transparent outline-none" 
                />
                <span>%</span>
             </div>
           </div>
        </div>

        <div className="text-xs text-center text-gray-400 font-medium pt-2">
           Taxa Efetiva: 1 {sourceCurr} = {commercialRate.toFixed(4)} {targetCurr}
        </div>
      </div>
    </div>
  );
};

const RateAlerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, pair: 'USD/MZN', target: 62.50, condition: 'below', active: true },
    { id: 2, pair: 'EUR/MZN', target: 70.00, condition: 'above', active: false },
  ]);

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-card border border-light-border dark:border-dark-border">
       <div className="flex items-center gap-3 mb-6 pb-4 border-b border-light-border dark:border-dark-border">
        <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 rounded-xl">
          <BellRing size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white leading-tight">Alertas de Câmbio</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Monitoramento 24/7.</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-primary/30 transition-colors">
             <div>
               <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                 {alert.pair} 
                 <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${alert.condition === 'below' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                   {alert.condition === 'below' ? 'Abaixo de' : 'Acima de'}
                 </span>
               </div>
               <p className="text-xs text-gray-500 mt-1">Alvo: <span className="font-mono font-bold text-slate-700 dark:text-gray-300">{alert.target.toFixed(2)}</span></p>
             </div>
             <div className="relative inline-block w-9 align-middle select-none">
                <input type="checkbox" checked={alert.active} readOnly className={`absolute block w-4 h-4 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer transition-all ${alert.active ? 'right-0 border-primary bg-primary' : 'right-5'}`}/>
                <span className={`block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${alert.active ? 'bg-primary/20' : 'bg-gray-200 dark:bg-slate-700'}`}></span>
            </div>
          </div>
        ))}
        <button className="w-full py-3 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-xs font-bold text-gray-500 hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
          <Plus size={14} /> Criar Novo Alerta
        </button>
      </div>
    </div>
  );
};

const CurrencyConverter = () => {
  const [baseAmount, setBaseAmount] = useState<number>(1);
  const [baseCurrency, setBaseCurrency] = useState<Currency>(Currency.MZN);
  const [activeCurrencies, setActiveCurrencies] = useState<Currency[]>([
    Currency.USD, 
    Currency.EUR, 
    Currency.ZAR, 
    Currency.BRL
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedCurrency, setDraggedCurrency] = useState<Currency | null>(null);

  // Real-time rates state
  const [rates, setRates] = useState<Record<Currency, number>>(CURRENCY_RATES);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer Effect for 30s updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          updateRates();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateRates = () => {
    // Simulate fetching real-time data
    setRates(currentRates => {
      const newRates = { ...currentRates };
      Object.keys(newRates).forEach(key => {
        const currencyKey = key as Currency;
        if (currencyKey !== Currency.USD) { // Assuming USD is base anchor
           const fluctuation = 1 + (Math.random() * 0.002 - 0.001); // Small fluctuation
           newRates[currencyKey] *= fluctuation;
        }
      });
      return newRates;
    });
    setLastUpdated(new Date());
  };

  const convert = (amount: number, from: Currency, to: Currency) => {
    const rateFrom = rates[from] || 1;
    const rateTo = rates[to] || 1;
    return (amount / rateFrom) * rateTo;
  };

  const handleSwitchBase = (newBase: Currency) => {
    if (activeCurrencies.includes(newBase)) {
      const newActive = activeCurrencies.filter(c => c !== newBase);
      newActive.unshift(baseCurrency);
      setActiveCurrencies(newActive);
    }
    setBaseCurrency(newBase);
  };

  const toggleCurrency = (currency: Currency) => {
    if (activeCurrencies.includes(currency)) {
      setActiveCurrencies(activeCurrencies.filter(c => c !== currency));
    } else {
      setActiveCurrencies([...activeCurrencies, currency]);
    }
  };

  const handleDragStart = (e: React.DragEvent, currency: Currency) => {
    setDraggedCurrency(currency);
    e.dataTransfer.setData('text/plain', currency);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCurrency: Currency) => {
    e.preventDefault();
    if (draggedCurrency && draggedCurrency !== targetCurrency) {
      const newOrder = [...activeCurrencies];
      const draggedIdx = newOrder.indexOf(draggedCurrency);
      const targetIdx = newOrder.indexOf(targetCurrency);
      
      if (draggedIdx > -1 && targetIdx > -1) {
        newOrder.splice(draggedIdx, 1);
        newOrder.splice(targetIdx, 0, draggedCurrency);
        setActiveCurrencies(newOrder);
      }
    }
    setDraggedCurrency(null);
  };

  const availableCurrencies = Object.values(Currency).filter(c => c !== baseCurrency);
  
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Câmbio e Tesouraria</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Taxas em tempo real e simulações bancárias.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-dark-surface px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-slate-800">
           <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="transform -rotate-90 w-5 h-5">
                <circle className="text-gray-100 dark:text-slate-700" strokeWidth="2" stroke="currentColor" fill="transparent" r={radius} cx="10" cy="10" />
                <circle className="text-primary transition-all duration-1000 ease-linear" strokeWidth="2" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="10" cy="10" />
              </svg>
              <span className="absolute text-[8px] font-bold text-slate-700 dark:text-white">{timeLeft}</span>
           </div>
           <div className="flex items-center gap-1.5">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Última Atualização:</span>
             <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">{lastUpdated.toLocaleTimeString()}</span>
           </div>
           <button onClick={updateRates} className="p-1.5 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 ml-1">
              <RefreshCw size={14} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Converter (7/12) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Base Currency Card */}
          <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-card border border-light-border dark:border-dark-border relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none transition-transform group-hover:scale-110 duration-700">
              <span className="text-9xl font-black text-slate-900 dark:text-white">{baseCurrency}</span>
            </div>
            
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Moeda Principal</label>
            
            <div className="flex flex-col sm:flex-row gap-6 items-stretch">
               <div className="relative flex-1">
                 <span className="absolute left-0 top-6 text-2xl font-bold text-gray-300 pointer-events-none">
                   {rates[baseCurrency] === 1 ? '$' : baseCurrency === Currency.EUR ? '€' : baseCurrency === Currency.MZN ? 'MT' : ''}
                 </span>
                 <input 
                   type="number" 
                   value={baseAmount}
                   onChange={(e) => setBaseAmount(Math.max(0, Number(e.target.value)))}
                   className="w-full bg-transparent border-b-2 border-gray-100 dark:border-slate-800 py-4 pl-10 text-5xl font-bold text-slate-900 dark:text-white focus:border-primary outline-none transition-all placeholder-gray-200"
                   placeholder="0"
                 />
                 <p className="text-sm text-gray-400 mt-2 font-medium">{NAMES[baseCurrency] || baseCurrency}</p>
               </div>
               
               <div className="relative min-w-[160px]">
                 <select 
                   value={baseCurrency}
                   onChange={(e) => handleSwitchBase(e.target.value as Currency)}
                   className="w-full appearance-none bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xl py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer outline-none"
                 >
                   {Object.values(Currency).map(c => (
                     <option key={c} value={c}>{c} - {NAMES[c]}</option>
                   ))}
                 </select>
                 <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-white dark:text-slate-900 text-xs">▼</span>
                 </div>
                 <div className="mt-3 flex justify-center">
                    <div className="text-4xl shadow-sm rounded-full bg-white dark:bg-slate-800 w-16 h-16 flex items-center justify-center border-4 border-slate-50 dark:border-slate-900">
                        {FLAGS[baseCurrency]}
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Converted Currencies List */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Conversões Ativas</h3>
            </div>
            
            {activeCurrencies.map(currency => {
              const convertedValue = convert(baseAmount, baseCurrency, currency);
              const oneUnitRate = convert(1, baseCurrency, currency);

              return (
                <div 
                  key={currency} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, currency)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, currency)}
                  className={`bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-light-border dark:border-dark-border flex items-center justify-between group hover:border-primary/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${draggedCurrency === currency ? 'opacity-50 border-dashed border-primary scale-95' : ''}`}
                >
                  <div className="flex items-center gap-5">
                     <div className="text-gray-300 dark:text-gray-600 hover:text-primary cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity -ml-2">
                        <GripVertical size={20} />
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner border border-gray-100 dark:border-slate-700">
                       {FLAGS[currency]}
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="font-bold text-xl text-slate-900 dark:text-white">{currency}</h3>
                         <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{NAMES[currency]}</span>
                       </div>
                       <p className="text-xs text-gray-500 font-medium mt-1">
                         1 {baseCurrency} = {oneUnitRate.toFixed(4)} {currency}
                       </p>
                     </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {new Intl.NumberFormat('pt-MZ', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertedValue)}
                    </p>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                      <button 
                        onClick={() => handleSwitchBase(currency)}
                        className="p-1.5 text-xs font-bold text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex items-center gap-1"
                      >
                        <ArrowRightLeft size={12} /> Base
                      </button>
                      <button 
                        onClick={() => toggleCurrency(currency)}
                        className="p-1.5 text-xs font-bold text-gray-500 hover:text-erro hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 group"
            >
              <div className="p-1 bg-gray-200 dark:bg-slate-700 rounded text-white group-hover:bg-primary transition-colors"><Plus size={16} /></div>
              Adicionar Moeda
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Tools (5/12) */}
        <div className="xl:col-span-5 space-y-6">
           
           {/* Chart Card */}
           <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-card border border-light-border dark:border-dark-border min-w-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     Histórico <span className="text-gray-400 text-sm font-normal">7 Dias</span>
                   </h3>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">USD/MZN</div>
                    <div className="text-xs text-primary font-bold flex items-center justify-end gap-1">
                     <TrendingUp size={12} /> +1.2%
                   </div>
                </div>
              </div>
              
              <div className="h-40 w-full -ml-2 min-w-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_DATA}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [value.toFixed(2), 'Taxa']}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Tool 1: Transfer Simulator */}
           <TransferSimulator rates={rates} />

           {/* Tool 2: Rate Alerts */}
           <RateAlerts />

        </div>
      </div>

      {/* Add Currency Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
           <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-3xl shadow-2xl border border-light-border dark:border-dark-border overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-light-border dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-surface z-20">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Adicionar Moeda</h3>
                 <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-dark-border sticky top-0 z-10">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Buscar por nome ou código (ex: USD)" 
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-dark-surface">
                 {(() => {
                    const filtered = availableCurrencies
                       .filter(c => c.includes(searchQuery.toUpperCase()) || NAMES[c]?.toLowerCase().includes(searchQuery.toLowerCase()))
                       .sort((a, b) => NAMES[a].localeCompare(NAMES[b]));
                    
                    const grouped: Record<string, typeof filtered> = {};
                    filtered.forEach(c => {
                       const letter = NAMES[c][0].toUpperCase();
                       const normalizedLetter = letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                       if (!grouped[normalizedLetter]) grouped[normalizedLetter] = [];
                       grouped[normalizedLetter].push(c);
                    });

                    const letters = Object.keys(grouped).sort();

                    if (filtered.length === 0) {
                        return (
                            <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <Search size={32} className="opacity-30" />
                                </div>
                                <p className="font-medium">Nenhuma moeda encontrada.</p>
                            </div>
                        );
                    }

                    return letters.map(letter => (
                        <div key={letter}>
                            <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-sm px-6 py-2 text-xs font-black text-gray-400 uppercase tracking-widest z-0 border-b border-gray-100 dark:border-slate-800">
                                {letter}
                            </div>
                            <div className="px-4 py-2 space-y-1">
                                {grouped[letter].map(c => (
                                   <button 
                                     key={c}
                                     onClick={() => toggleCurrency(c)}
                                     className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                                       activeCurrencies.includes(c) 
                                         ? 'bg-primary/5 dark:bg-primary/10 shadow-none ring-1 ring-primary' 
                                         : 'hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'
                                     }`}
                                   >
                                      <div className="flex items-center gap-4">
                                         <div className="text-3xl w-10 h-10 flex items-center justify-center shadow-sm rounded-xl bg-white dark:bg-slate-700 overflow-hidden border border-gray-100 dark:border-slate-600">
                                            {FLAGS[c]}
                                         </div>
                                         <div className="text-left">
                                            <p className="font-bold text-slate-800 dark:text-gray-100 text-sm">
                                                {NAMES[c]}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400">{c}</p>
                                         </div>
                                      </div>
                                      
                                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                          activeCurrencies.includes(c)
                                          ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
                                          : 'border-gray-300 dark:border-slate-600 bg-transparent text-transparent'
                                      }`}>
                                          <Check size={14} strokeWidth={3} />
                                      </div>
                                   </button>
                                ))}
                            </div>
                        </div>
                    ));
                 })()}
              </div>
              
              <div className="p-5 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
                 <button 
                   onClick={() => setIsAddModalOpen(false)} 
                   className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
                 >
                   <Check size={18} /> Concluir Seleção
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
