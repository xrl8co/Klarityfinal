
export enum Currency {
  // Moedas Principais / Existentes
  MZN = 'MZN', USD = 'USD', EUR = 'EUR', BRL = 'BRL', ZAR = 'ZAR', GBP = 'GBP', CNY = 'CNY',
  JPY = 'JPY', CAD = 'CAD', AUD = 'AUD', CHF = 'CHF', AOA = 'AOA', INR = 'INR', RUB = 'RUB',
  NZD = 'NZD', SGD = 'SGD', KES = 'KES', NGN = 'NGN', GHS = 'GHS', MXN = 'MXN', HKD = 'HKD',
  KRW = 'KRW', TRY = 'TRY', SEK = 'SEK', NOK = 'NOK', DKK = 'DKK', PLN = 'PLN', THB = 'THB',
  IDR = 'IDR', MYR = 'MYR', PHP = 'PHP', VND = 'VND',

  // Novas Moedas (A-Z, Cripto, Metais)
  ADA = 'ADA', AED = 'AED', AFN = 'AFN', ALL = 'ALL', AMD = 'AMD', ANG = 'ANG', ARS = 'ARS', 
  AWG = 'AWG', AZN = 'AZN', BAM = 'BAM', BBD = 'BBD', BCH = 'BCH', BDT = 'BDT', BGN = 'BGN', 
  BHD = 'BHD', BIF = 'BIF', BMD = 'BMD', BND = 'BND', BOB = 'BOB', BSD = 'BSD', XBT = 'XBT', // Bitcoin
  BTN = 'BTN', BWP = 'BWP', BYN = 'BYN', BZD = 'BZD', CDF = 'CDF', CLP = 'CLP', COP = 'COP', 
  CRC = 'CRC', CUC = 'CUC', CUP = 'CUP', CVE = 'CVE', CZK = 'CZK', DJF = 'DJF', DOGE = 'DOGE', 
  DOP = 'DOP', DOT = 'DOT', DZD = 'DZD', EGP = 'EGP', ERN = 'ERN', ETB = 'ETB', ETH = 'ETH', 
  FJD = 'FJD', FKP = 'FKP', GEL = 'GEL', GGP = 'GGP', GIP = 'GIP', GMD = 'GMD', GNF = 'GNF', 
  GTQ = 'GTQ', GYD = 'GYD', HNL = 'HNL', HRK = 'HRK', HTG = 'HTG', HUF = 'HUF', ILS = 'ILS', 
  IMP = 'IMP', IQD = 'IQD', ISK = 'ISK', JEP = 'JEP', JMD = 'JMD', JOD = 'JOD', KGS = 'KGS', 
  KHR = 'KHR', KPW = 'KPW', KWD = 'KWD', KYD = 'KYD', KZT = 'KZT', LAK = 'LAK', LBP = 'LBP', 
  LINK = 'LINK', LKR = 'LKR', LRD = 'LRD', LSL = 'LSL', LTC = 'LTC', LUNA = 'LUNA', LYD = 'LYD', 
  MAD = 'MAD', MDL = 'MDL', MGA = 'MGA', MKD = 'MKD', MMK = 'MMK', MNT = 'MNT', MOP = 'MOP', 
  MRU = 'MRU', MUR = 'MUR', MVR = 'MVR', MWK = 'MWK', NAD = 'NAD', NIO = 'NIO', NPR = 'NPR', 
  OMR = 'OMR', PAB = 'PAB', PEN = 'PEN', PGK = 'PGK', PKR = 'PKR', PYG = 'PYG', QAR = 'QAR', 
  RSD = 'RSD', RWF = 'RWF', SAR = 'SAR', SBD = 'SBD', SCR = 'SCR', SDG = 'SDG', SHP = 'SHP', 
  SLE = 'SLE', SLL = 'SLL', SOS = 'SOS', SPL = 'SPL', SRD = 'SRD', STN = 'STN', SVC = 'SVC', 
  SYP = 'SYP', SZL = 'SZL', TJS = 'TJS', TMT = 'TMT', TND = 'TND', TOP = 'TOP', TTD = 'TTD', 
  TVD = 'TVD', TWD = 'TWD', TZS = 'TZS', UAH = 'UAH', UGX = 'UGX', UNI = 'UNI', UYU = 'UYU', 
  UZS = 'UZS', VEF = 'VEF', VES = 'VES', VUV = 'VUV', WST = 'WST', XAF = 'XAF', XAG = 'XAG', 
  XAU = 'XAU', XCD = 'XCD', XDR = 'XDR', XLM = 'XLM', XOF = 'XOF', XPD = 'XPD', XPF = 'XPF', 
  XPT = 'XPT', XRP = 'XRP', YER = 'YER', ZMW = 'ZMW', ZWD = 'ZWD'
}

export enum ProjectStatus {
  ACTIVE = 'Em Andamento',
  COMPLETED = 'Concluído',
  ON_HOLD = 'Pausado',
  PLANNING = 'Planejamento'
}

export enum TaskStatus {
  TODO = 'A Fazer',
  IN_PROGRESS = 'Em Progresso',
  DONE = 'Concluído'
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;     
  assigneeName?: string;   
  assigneeRole?: string;   
  dueDate: string;
  priority: 'Alta' | 'Média' | 'Baixa';
}

export interface Expense {
  id: string;
  projectId: string;
  name: string;
  amount: number;
  currency: Currency;
  category: string;
  date: string;
  recurring?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  budget?: number;
  currency: Currency;
  startDate: string;
  expenses: Expense[];
  tasks: Task[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  estimatedBudget?: number;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalSpentGlobalMZN: number;
  budgetUtilization: number;
}
