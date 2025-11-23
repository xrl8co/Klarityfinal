
import { Project, ProjectStatus, Currency, TaskStatus, Member, ProjectIdea } from './types';

// Taxas de câmbio aproximadas (Base: 1 USD)
// Nota: Em produção, estas devem vir de uma API em tempo real.
export const CURRENCY_RATES: Record<Currency, number> = {
  // Existing
  [Currency.USD]: 1,
  [Currency.EUR]: 0.92,
  [Currency.BRL]: 5.00,
  [Currency.MZN]: 63.50,
  [Currency.ZAR]: 18.50,
  [Currency.GBP]: 0.79,
  [Currency.CNY]: 7.20,
  [Currency.JPY]: 150.0,
  [Currency.CAD]: 1.35,
  [Currency.AUD]: 1.52,
  [Currency.CHF]: 0.88,
  [Currency.AOA]: 830.0,
  [Currency.INR]: 83.0,
  [Currency.RUB]: 92.0,
  [Currency.NZD]: 1.60,
  [Currency.SGD]: 1.34,
  [Currency.KES]: 145.0,
  [Currency.NGN]: 1500.0,
  [Currency.GHS]: 12.5,
  [Currency.MXN]: 17.0,
  [Currency.HKD]: 7.82,
  [Currency.KRW]: 1330.0,
  [Currency.TRY]: 31.0,
  [Currency.SEK]: 10.3,
  [Currency.NOK]: 10.5,
  [Currency.DKK]: 6.9,
  [Currency.PLN]: 4.0,
  [Currency.THB]: 36.0,
  [Currency.IDR]: 15600.0,
  [Currency.MYR]: 4.77,
  [Currency.PHP]: 56.0,
  [Currency.VND]: 24500.0,

  // Novas Adições (Estimativas Aproximadas)
  [Currency.ADA]: 1.6, // Cardano (exemplo)
  [Currency.AED]: 3.67,
  [Currency.AFN]: 71.0,
  [Currency.ALL]: 95.0,
  [Currency.AMD]: 400.0,
  [Currency.ANG]: 1.79,
  [Currency.ARS]: 850.0,
  [Currency.AWG]: 1.8,
  [Currency.AZN]: 1.7,
  [Currency.BAM]: 1.8,
  [Currency.BBD]: 2.0,
  [Currency.BCH]: 0.002, // Bitcoin Cash (inverso preço USD)
  [Currency.BDT]: 110.0,
  [Currency.BGN]: 1.8,
  [Currency.BHD]: 0.376,
  [Currency.BIF]: 2850.0,
  [Currency.BMD]: 1.0,
  [Currency.BND]: 1.34,
  [Currency.BOB]: 6.9,
  [Currency.BSD]: 1.0,
  [Currency.XBT]: 0.000015, // Bitcoin (inverso aproximado de 65k)
  [Currency.BTN]: 83.0,
  [Currency.BWP]: 13.6,
  [Currency.BYN]: 3.2,
  [Currency.BZD]: 2.0,
  [Currency.CDF]: 2750.0,
  [Currency.CLP]: 970.0,
  [Currency.COP]: 3900.0,
  [Currency.CRC]: 515.0,
  [Currency.CUC]: 1.0,
  [Currency.CUP]: 24.0,
  [Currency.CVE]: 102.0,
  [Currency.CZK]: 23.5,
  [Currency.DJF]: 177.0,
  [Currency.DOGE]: 12.0, // Doge (exemplo)
  [Currency.DOP]: 59.0,
  [Currency.DOT]: 0.15, // Polkadot
  [Currency.DZD]: 134.0,
  [Currency.EGP]: 30.9,
  [Currency.ERN]: 15.0,
  [Currency.ETB]: 56.0,
  [Currency.ETH]: 0.0003, // Ethereum (inverso aprox)
  [Currency.FJD]: 2.25,
  [Currency.FKP]: 0.79,
  [Currency.GEL]: 2.65,
  [Currency.GGP]: 0.79,
  [Currency.GIP]: 0.79,
  [Currency.GMD]: 67.0,
  [Currency.GNF]: 8600.0,
  [Currency.GTQ]: 7.8,
  [Currency.GYD]: 209.0,
  [Currency.HNL]: 24.7,
  [Currency.HRK]: 7.0,
  [Currency.HTG]: 132.0,
  [Currency.HUF]: 360.0,
  [Currency.ILS]: 3.6,
  [Currency.IMP]: 0.79,
  [Currency.IQD]: 1300.0,
  [Currency.ISK]: 138.0,
  [Currency.JEP]: 0.79,
  [Currency.JMD]: 155.0,
  [Currency.JOD]: 0.71,
  [Currency.KGS]: 89.5,
  [Currency.KHR]: 4100.0,
  [Currency.KPW]: 900.0,
  [Currency.KWD]: 0.31,
  [Currency.KYD]: 0.83,
  [Currency.KZT]: 450.0,
  [Currency.LAK]: 20800.0,
  [Currency.LBP]: 89500.0,
  [Currency.LINK]: 0.05, // Chainlink
  [Currency.LKR]: 305.0,
  [Currency.LRD]: 190.0,
  [Currency.LSL]: 18.5,
  [Currency.LTC]: 0.012, // Litecoin
  [Currency.LUNA]: 1.5,
  [Currency.LYD]: 4.8,
  [Currency.MAD]: 10.0,
  [Currency.MDL]: 17.8,
  [Currency.MGA]: 4500.0,
  [Currency.MKD]: 56.5,
  [Currency.MMK]: 2100.0,
  [Currency.MNT]: 3400.0,
  [Currency.MOP]: 8.0,
  [Currency.MRU]: 39.5,
  [Currency.MUR]: 46.0,
  [Currency.MVR]: 15.4,
  [Currency.MWK]: 1700.0,
  [Currency.NAD]: 18.5,
  [Currency.NIO]: 36.6,
  [Currency.NPR]: 133.0,
  [Currency.OMR]: 0.385,
  [Currency.PAB]: 1.0,
  [Currency.PEN]: 3.75,
  [Currency.PGK]: 3.8,
  [Currency.PKR]: 278.0,
  [Currency.PYG]: 7300.0,
  [Currency.QAR]: 3.64,
  [Currency.RSD]: 108.0,
  [Currency.RWF]: 1280.0,
  [Currency.SAR]: 3.75,
  [Currency.SBD]: 8.5,
  [Currency.SCR]: 13.5,
  [Currency.SDG]: 600.0,
  [Currency.SHP]: 0.79,
  [Currency.SLE]: 22.5,
  [Currency.SLL]: 22500.0,
  [Currency.SOS]: 570.0,
  [Currency.SPL]: 6.0,
  [Currency.SRD]: 35.0,
  [Currency.STN]: 22.5,
  [Currency.SVC]: 8.75,
  [Currency.SYP]: 13000.0,
  [Currency.SZL]: 18.5,
  [Currency.TJS]: 10.9,
  [Currency.TMT]: 3.5,
  [Currency.TND]: 3.1,
  [Currency.TOP]: 2.35,
  [Currency.TTD]: 6.75,
  [Currency.TVD]: 1.52,
  [Currency.TWD]: 31.5,
  [Currency.TZS]: 2550.0,
  [Currency.UAH]: 39.0,
  [Currency.UGX]: 3850.0,
  [Currency.UNI]: 0.1, // Uniswap
  [Currency.UYU]: 38.5,
  [Currency.UZS]: 12500.0,
  [Currency.VEF]: 3600000.0,
  [Currency.VES]: 36.0,
  [Currency.VUV]: 120.0,
  [Currency.WST]: 2.7,
  [Currency.XAF]: 605.0,
  [Currency.XAG]: 0.04, // Prata (oz)
  [Currency.XAU]: 0.0005, // Ouro (oz)
  [Currency.XCD]: 2.7,
  [Currency.XDR]: 0.75,
  [Currency.XLM]: 8.5, // Stellar
  [Currency.XOF]: 605.0,
  [Currency.XPD]: 0.001, // Paládio
  [Currency.XPF]: 110.0,
  [Currency.XPT]: 0.0011, // Platina
  [Currency.XRP]: 1.6, // Ripple
  [Currency.YER]: 250.0,
  [Currency.ZMW]: 25.5,
  [Currency.ZWD]: 361.0,
};

export const MOCK_MEMBERS: Member[] = [
  { id: 'm1', name: 'Carlos Mendes', role: 'Gestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 'm2', name: 'Ana Silva', role: 'Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' },
  { id: 'm3', name: 'João Paulo', role: 'Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: 'm4', name: 'Sofia Dias', role: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
];

export const MOCK_IDEAS: ProjectIdea[] = [
  {
    id: 'i1',
    title: 'App de Entregas Maputo',
    description: 'Desenvolver um MVP para logística de last-mile focado em motoboys na cidade de Maputo.',
    priority: 'Alta',
    estimatedBudget: 500000,
    createdAt: '2024-02-10'
  },
  {
    id: 'i2',
    title: 'Automação de RH',
    description: 'Implementar sistema interno para gestão de férias e folhas de pagamento.',
    priority: 'Média',
    estimatedBudget: 150000,
    createdAt: '2024-02-15'
  },
  {
    id: 'i3',
    title: 'Hackathon Universitário',
    description: 'Patrocinar evento na UEM para recrutar novos talentos de TI.',
    priority: 'Baixa',
    estimatedBudget: 50000,
    createdAt: '2024-02-20'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Redesign do Website Institucional',
    description: 'Reformulação completa do portal corporativo com nova identidade visual e integração de sistemas.',
    status: ProjectStatus.ACTIVE,
    budget: 15000,
    currency: Currency.USD,
    startDate: '2023-10-01',
    expenses: [
      { id: 'e1', projectId: '1', name: 'Licenças de Design', amount: 500, currency: Currency.USD, category: 'Design', date: '2023-10-05' },
      { id: 'e2', projectId: '1', name: 'Desenvolvimento Frontend', amount: 2000, currency: Currency.USD, category: 'Desenvolvimento', date: '2023-10-15' },
    ],
    tasks: [
      { id: 't1', projectId: '1', title: 'Criar Wireframes', description: 'Desenhar estrutura das páginas principais', status: TaskStatus.DONE, assigneeId: 'm2', dueDate: '2023-10-10', priority: 'Alta' },
      { id: 't2', projectId: '1', title: 'Aprovar Layout', description: 'Reunião com diretoria', status: TaskStatus.DONE, assigneeId: 'm1', dueDate: '2023-10-12', priority: 'Alta' },
      { id: 't3', projectId: '1', title: 'Codificar Homepage', description: 'Implementar React componentes', status: TaskStatus.IN_PROGRESS, assigneeId: 'm3', dueDate: '2023-11-01', priority: 'Média' },
      { id: 't4', projectId: '1', title: 'Integração CMS', description: 'Configurar Strapi', status: TaskStatus.TODO, assigneeId: 'm3', dueDate: '2023-11-15', priority: 'Média' },
    ]
  },
  {
    id: '2',
    name: 'Expansão Filial Maputo',
    description: 'Abertura, estruturação e logística do novo escritório central em Maputo.',
    status: ProjectStatus.PLANNING,
    budget: 2000000,
    currency: Currency.MZN,
    startDate: '2024-01-15',
    expenses: [
      { id: 'e3', projectId: '2', name: 'Honorários Arquitetura', amount: 50000, currency: Currency.MZN, category: 'Serviços', date: '2023-11-01' },
      { id: 'e4', projectId: '2', name: 'Licenças Municipais', amount: 15000, currency: Currency.MZN, category: 'Legal', date: '2023-11-05' },
      { id: 'e9', projectId: '2', name: 'Importação Mobiliário SA', amount: 120000, currency: Currency.ZAR, category: 'Mobiliário', date: '2023-11-20' }
    ],
    tasks: [
      { id: 't5', projectId: '2', title: 'Buscar Imóvel', description: 'Visitar 5 opções no centro', status: TaskStatus.IN_PROGRESS, assigneeId: 'm1', dueDate: '2023-12-01', priority: 'Alta' },
      { id: 't6', projectId: '2', title: 'Contratar Empreiteiro', description: 'Orçamentos de obra', status: TaskStatus.TODO, assigneeId: 'm1', dueDate: '2023-12-10', priority: 'Alta' },
    ]
  },
  {
    id: '3',
    name: 'Campanha Marketing Verão',
    description: 'Campanhas de mídia social, influencers e tráfego pago para a temporada.',
    status: ProjectStatus.COMPLETED,
    budget: 150000,
    currency: Currency.BRL,
    startDate: '2023-09-01',
    expenses: [
      { id: 'e5', projectId: '3', name: 'Gestão de Tráfego', amount: 25000, currency: Currency.BRL, category: 'Marketing', date: '2023-09-10' },
      { id: 'e6', projectId: '3', name: 'Produção de Vídeo', amount: 45000, currency: Currency.BRL, category: 'Produção', date: '2023-09-20' },
      { id: 'e7', projectId: '3', name: 'Influencers', amount: 30000, currency: Currency.BRL, category: 'Marketing', date: '2023-09-25' },
    ],
    tasks: []
  },
  {
    id: '4',
    name: 'Infraestrutura de Servidores',
    description: 'Migração para nuvem e renovação de equipamentos de rede física.',
    status: ProjectStatus.ON_HOLD,
    budget: 12000,
    currency: Currency.EUR,
    startDate: '2023-11-10',
    expenses: [
      { id: 'e8', projectId: '4', name: 'Consultoria Cloud', amount: 1200, currency: Currency.EUR, category: 'Consultoria', date: '2023-11-12' }
    ],
    tasks: [
      { id: 't7', projectId: '4', title: 'Audit de Segurança', description: 'Pentest nos servidores atuais', status: TaskStatus.TODO, assigneeId: 'm3', dueDate: '2023-11-25', priority: 'Alta' }
    ]
  }
];
