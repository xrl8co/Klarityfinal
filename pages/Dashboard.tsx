
import React, { useMemo } from 'react';
import { Project, Currency, ProjectStatus, TaskStatus } from '../types';
import { CURRENCY_RATES } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Briefcase, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  Wallet,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  ArrowUpRight,
  CheckSquare,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  
  const formatMZN = (val: number) => {
    return new Intl.NumberFormat('pt-MZ', { 
      style: 'currency', 
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    let totalSpentMZN = 0;
    let totalBudgetMZN = 0;
    const activeCount = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
    const completedCount = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const rateMZN = CURRENCY_RATES[Currency.MZN];

    projects.forEach(p => {
      const rateProject = CURRENCY_RATES[p.currency];
      const budget = p.budget || 0;
      const budgetInMZN = (budget / rateProject) * rateMZN;
      totalBudgetMZN += budgetInMZN;

      p.expenses.forEach(e => {
        const rateExpense = CURRENCY_RATES[e.currency];
        totalSpentMZN += (e.amount / rateExpense) * rateMZN;
      });
    });

    return {
      activeCount,
      completedCount,
      totalSpentMZN,
      totalBudgetMZN,
      percentageUsed: totalBudgetMZN > 0 ? (totalSpentMZN / totalBudgetMZN) * 100 : 0
    };
  }, [projects]);

  // --- CHART DATA ---
  const chartData = useMemo(() => {
    const rateMZN = CURRENCY_RATES[Currency.MZN];
    return projects.map(p => {
      const rateProject = CURRENCY_RATES[p.currency];
      let spentMZN = 0;
      p.expenses.forEach(e => {
         const rateExpense = CURRENCY_RATES[e.currency];
         spentMZN += (e.amount / rateExpense) * rateMZN;
      });
      const budget = p.budget || 0;
      const budgetMZN = (budget / rateProject) * rateMZN;
      return {
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        fullName: p.name,
        spent: Math.round(spentMZN),
        budget: Math.round(budgetMZN)
      };
    });
  }, [projects]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  // --- RECENT ACTIVITIES LOGIC ---
  const recentActivities = useMemo(() => {
    const activities: Array<{ type: 'expense' | 'task', date: string, title: string, subtitle: string, amount?: string }> = [];

    projects.forEach(p => {
      // Add Expenses
      p.expenses.forEach(e => {
        activities.push({
          type: 'expense',
          date: e.date,
          title: 'Nova Despesa',
          subtitle: `${e.name} em ${p.name}`,
          amount: `${e.currency} ${e.amount}`
        });
      });

      // Add Tasks (simulate creation date or update based on due date for demo)
      p.tasks?.forEach(t => {
         if (t.status === TaskStatus.DONE) {
            activities.push({
              type: 'task',
              date: t.dueDate, // Using due date as proxy for activity date
              title: 'Tarefa Concluída',
              subtitle: t.title,
            });
         }
      });
    });

    // Sort descending and take top 5
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [projects]);

  // --- UPCOMING DEADLINES LOGIC ---
  const upcomingTasks = useMemo(() => {
    const tasks: Array<{ id: string, title: string, project: string, date: string, priority: string }> = [];
    projects.forEach(p => {
      p.tasks?.forEach(t => {
        if (t.status !== TaskStatus.DONE) {
          tasks.push({
            id: t.id,
            title: t.title,
            project: p.name,
            date: t.dueDate,
            priority: t.priority
          });
        }
      });
    });
    // Sort ascending (soonest first)
    return tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
  }, [projects]);

  const COLORS = ['#16a34a', '#3b82f6', '#eab308', '#ef4444'];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Painel de Controle</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visão geral e atualizações em tempo real.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/projects" className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow hover:opacity-90 transition-all">
            <ArrowUpRight size={16} /> Ver Projetos
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Briefcase size={24} /></div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.activeCount}</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Projetos Ativos</p>
        </div>
        
        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border group hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><CheckCircle size={24} /></div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.completedCount}</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Concluídos</p>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border group hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Wallet size={24} /></div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{formatMZN(stats.totalSpentMZN)}</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gasto Total (MZN)</p>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border group hover:border-yellow-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors"><AlertTriangle size={24} /></div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stats.percentageUsed.toFixed(1)}%</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Utilização Global</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6 shadow-card min-w-0">
          <h3 className="text-base font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-400" />
            Performance Orçamentária
          </h3>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val.toLocaleString('pt-MZ', { notation: 'compact' })} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => formatMZN(value)}
                />
                <Bar dataKey="budget" name="Orçamento" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="spent" name="Gasto Real" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-6 shadow-card min-w-0">
          <h3 className="text-base font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
            <PieChartIcon size={18} className="text-gray-400" />
            Status dos Projetos
          </h3>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Activity & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Recent Activity Feed */}
         <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
            <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Atividades Recentes
              </h3>
              <span className="text-xs font-semibold text-gray-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700">Últimas atualizações</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
               {recentActivities.map((activity, idx) => (
                 <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'expense' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-green-50 text-green-600 dark:bg-green-900/20'
                    }`}>
                       {activity.type === 'expense' ? <Wallet size={18} /> : <CheckSquare size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{activity.title}</p>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatDate(activity.date)}</span>
                       </div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{activity.subtitle}</p>
                    </div>
                    {activity.amount && (
                      <div className="text-right font-bold text-sm text-slate-900 dark:text-white">
                        {activity.amount}
                      </div>
                    )}
                 </div>
               ))}
               {recentActivities.length === 0 && (
                 <div className="p-8 text-center text-gray-400 text-sm">Nenhuma atividade recente encontrada.</div>
               )}
            </div>
         </div>

         {/* Upcoming Deadlines */}
         <div className="bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
            <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-secondary" />
                Próximos Prazos
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {upcomingTasks.map((task, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                   <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === 'Alta' ? 'bg-red-500' : task.priority === 'Média' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
                         <p className="text-xs text-gray-500 truncate">{task.project}</p>
                      </div>
                   </div>
                   <div className="mt-3 flex justify-between items-center pl-5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                         <Calendar size={12} />
                         {formatDate(task.date)}
                      </div>
                      {task.priority === 'Alta' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded uppercase">Urgente</span>
                      )}
                   </div>
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                 <div className="p-8 text-center text-gray-400 text-sm">Tudo em dia! Sem tarefas pendentes.</div>
               )}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-light-border dark:border-dark-border text-center">
               <Link to="/tasks" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Ver todas as tarefas</Link>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
