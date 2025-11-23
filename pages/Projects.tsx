
import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Project, ProjectStatus, Currency, Expense, Task, TaskStatus, Member } from '../types';
import { CURRENCY_RATES, MOCK_MEMBERS } from '../constants';
import { 
  Plus, 
  Search, 
  ArrowRight,
  Trash2,
  Edit2,
  ChevronLeft,
  Save,
  X,
  Check,
  AlertTriangle,
  FileText,
  Calendar,
  Layout,
  DollarSign,
  Clock,
  MoreHorizontal,
  Wallet,
  Download,
  Table,
  ChevronDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';

// --- Utils ---
const formatCurrency = (amount: number, currency: Currency) => {
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

const convertAmount = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) return amount;
  const rateFrom = CURRENCY_RATES[from];
  const rateTo = CURRENCY_RATES[to];
  return (amount / rateFrom) * rateTo;
};

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.ACTIVE: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800'; // Active = Green now
    case ProjectStatus.COMPLETED: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'; // Completed = Blue
    case ProjectStatus.ON_HOLD: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
    case ProjectStatus.PLANNING: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 border border-gray-200 dark:border-slate-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// --- Components ---

// 1. Modal Genérico
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 w-full max-w-lg rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-dark-surface">
          {children}
        </div>
      </div>
    </div>
  );
};

// 2. Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, isIrreversible = false }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
    <div className="text-center space-y-6">
      <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-erro border border-red-100 dark:border-red-900/30">
        <AlertTriangle size={28} />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Excluir "{itemName}"?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
        {isIrreversible && (
          <p className="text-xs text-erro mt-2 font-medium bg-red-50 dark:bg-red-900/10 py-1 px-2 rounded inline-block">
            Todas as despesas associadas serão perdidas.
          </p>
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-erro text-white font-bold shadow hover:bg-red-600 transition-colors">Excluir Definitivamente</button>
      </div>
    </div>
  </Modal>
);

// 3. Project Form Modal (Create/Edit)
const ProjectFormModal = ({ isOpen, onClose, onSave, initialData }: any) => {
  const [formData, setFormData] = useState<Partial<Project>>(initialData || {
    name: '', description: '', budget: undefined, currency: Currency.MZN, status: ProjectStatus.PLANNING, startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputClass = "w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Projeto' : 'Novo Projeto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nome do Projeto</label>
          <input required type="text" className={inputClass} 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Expansão Filial" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Descrição</label>
          <textarea required className={inputClass} rows={3}
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Objetivos e escopo..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Orçamento (Opcional)</label>
            <input type="number" className={inputClass} 
              value={formData.budget || ''} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Moeda</label>
            <select className={inputClass}
              value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value as Currency})}>
              {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Data de Início</label>
            <input required type="date" className={inputClass} 
              value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
            <select className={inputClass}
              value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}>
              {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow hover:bg-primary-dark transition-all">
            {initialData ? 'Salvar Alterações' : 'Criar Projeto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// 4. Expense Form Modal
const ExpenseFormModal = ({ isOpen, onClose, onSave, projectCurrency, initialData }: any) => {
  const [formData, setFormData] = useState<Partial<Expense>>(initialData || {
    name: '', amount: 0, currency: projectCurrency, category: 'Geral', date: new Date().toISOString().split('T')[0]
  });

  const convertedValue = useMemo(() => {
    if (!formData.amount || !formData.currency) return 0;
    return convertAmount(Number(formData.amount), formData.currency as Currency, projectCurrency);
  }, [formData.amount, formData.currency, projectCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputClass = "w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Despesa' : 'Adicionar Despesa'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
            Descrição <span className="text-erro">*</span>
          </label>
          <input required type="text" className={inputClass} 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Licença de Software Anual" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Valor <span className="text-erro">*</span>
            </label>
            <input required type="number" step="0.01" className={inputClass} 
              value={formData.amount || ''} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} placeholder="Ex: 1250.00" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Moeda <span className="text-erro">*</span>
            </label>
            <select className={inputClass}
              value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value as Currency})}>
              {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        {/* Live Conversion Preview */}
        {formData.currency !== projectCurrency && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 animate-fade-in">
            <Wallet size={16} />
            <span>Aproximadamente <b>{formatCurrency(convertedValue, projectCurrency)}</b> no projeto.</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Categoria <span className="text-erro">*</span>
            </label>
            <input required type="text" list="categories" className={inputClass} 
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Marketing" />
            <datalist id="categories">
              <option value="Geral" />
              <option value="Pessoal" />
              <option value="Serviços" />
              <option value="Equipamentos" />
              <option value="Marketing" />
              <option value="Viagem" />
              <option value="Software" />
              <option value="Infraestrutura" />
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Data do Pagamento <span className="text-erro">*</span>
            </label>
            <input required type="date" className={inputClass} 
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow hover:bg-primary-dark transition-all">
            Salvar Despesa
          </button>
        </div>
      </form>
    </Modal>
  );
};

// 5. Task Form Modal (Manual Assignee)
const TaskFormModal = ({ isOpen, onClose, onSave, initialData }: any) => {
  const [formData, setFormData] = useState<Partial<Task>>(initialData || {
    title: '', description: '', status: TaskStatus.TODO, priority: 'Média', 
    dueDate: new Date().toISOString().split('T')[0],
    assigneeName: '', assigneeRole: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputClass = "w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Tarefa' : 'Nova Tarefa'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Título da Tarefa</label>
          <input required type="text" className={inputClass} 
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Criar Wireframes" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Descrição</label>
          <textarea className={inputClass} rows={3}
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes da atividade..." />
        </div>
        
        {/* Manual Assignee Section */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 space-y-3">
           <p className="text-xs font-bold text-gray-500 uppercase">Responsável</p>
           <div className="grid grid-cols-2 gap-4">
             <input type="text" className={inputClass} 
               value={formData.assigneeName || ''} onChange={e => setFormData({...formData, assigneeName: e.target.value})} placeholder="Nome (Ex: João)" />
             <input type="text" className={inputClass} 
               value={formData.assigneeRole || ''} onChange={e => setFormData({...formData, assigneeRole: e.target.value})} placeholder="Cargo (Ex: Dev)" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Prioridade</label>
            <select className={inputClass}
              value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Data Limite</label>
            <input required type="date" className={inputClass} 
              value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow hover:bg-primary-dark transition-all">
            Salvar Tarefa
          </button>
        </div>
      </form>
    </Modal>
  );
};

// 6. Project Report Modal
const ProjectReportModal = ({ isOpen, onClose, project }: { isOpen: boolean, onClose: () => void, project: Project }) => {
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    project.expenses.forEach(e => {
      const amountInProjectCurrency = convertAmount(e.amount, e.currency, project.currency);
      data[e.category] = (data[e.category] || 0) + amountInProjectCurrency;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [project]);

  const COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Relatório: ${project.name}`}>
       <div className="space-y-6">
         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Gasto</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {formatCurrency(project.expenses.reduce((acc, e) => acc + convertAmount(e.amount, e.currency, project.currency), 0), project.currency)}
              </h2>
            </div>
            <div>
              <p className="text-xs text-gray-500 text-right uppercase font-bold">Orçamento</p>
              <h2 className="text-xl font-bold text-gray-400 text-right">
                {project.budget ? formatCurrency(project.budget, project.currency) : 'N/A'}
              </h2>
            </div>
         </div>

         <div className="h-60 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Legend />
                <RechartsTooltip formatter={(val: number) => formatCurrency(val, project.currency)} />
              </PieChart>
            </ResponsiveContainer>
         </div>

         <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Detalhe por Categoria</h4>
            <div className="space-y-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                     <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{item.name}</span>
                   </div>
                   <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.value, project.currency)}</span>
                </div>
              ))}
            </div>
         </div>
       </div>
    </Modal>
  );
};

// 7. Kanban Column
const KanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  onMoveTask,
  onEditTask,
  onDeleteTask
}: { 
  title: string, 
  status: TaskStatus, 
  tasks: Task[], 
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void,
  onEditTask: (task: Task) => void,
  onDeleteTask: (taskId: string) => void
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  return (
    <div 
      className={`flex-1 min-w-[300px] rounded-xl p-4 transition-all duration-200 flex flex-col border ${
        isDragOver 
          ? 'bg-primary/5 border-primary border-dashed' 
          : 'bg-gray-100 dark:bg-dark-bg border-transparent dark:border-slate-800'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <h4 className="font-bold text-slate-700 dark:text-gray-200 flex items-center gap-2 text-sm uppercase tracking-wide">
          <div className={`w-2.5 h-2.5 rounded-full ${
            status === TaskStatus.DONE ? 'bg-green-500' : status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-gray-400'
          }`}></div>
          {title}
        </h4>
        <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3 flex-1 min-h-[200px]">
        {tasks.map(task => {
          let assigneeDisplay = { name: 'N/A', role: '', avatar: '' };
          if (task.assigneeName) {
            assigneeDisplay = { name: task.assigneeName, role: task.assigneeRole || '', avatar: '' };
          } else if (task.assigneeId) {
            const member = MOCK_MEMBERS.find(m => m.id === task.assigneeId);
            if (member) assigneeDisplay = { ...member, avatar: member.avatar };
          }

          return (
            <div 
              key={task.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group"
            >
               <div className="flex justify-between items-start mb-2">
                 <h5 className="font-bold text-sm text-slate-800 dark:text-gray-100 line-clamp-2 leading-relaxed">{task.title}</h5>
                 <div className="relative group/menu ml-2">
                    <button className="p-1 text-gray-400 hover:text-primary rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                    <div className="absolute right-0 top-6 w-40 bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-gray-200 dark:border-slate-700 hidden group-hover/menu:block z-20 p-1">
                      <div className="space-y-0.5">
                        {Object.values(TaskStatus).filter(s => s !== status).map(s => (
                          <button key={s} onClick={() => onMoveTask(task.id, s)} className="w-full text-left px-3 py-2 text-xs rounded hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-600 dark:text-gray-300 font-medium">Mover: {s}</button>
                        ))}
                        <div className="h-px bg-gray-100 dark:bg-slate-700 my-1"></div>
                        <button onClick={() => onEditTask(task)} className="w-full text-left px-3 py-2 text-xs rounded hover:bg-gray-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-gray-200 flex items-center gap-2"><Edit2 size={12} /> Editar</button>
                        <button onClick={() => onDeleteTask(task.id)} className="w-full text-left px-3 py-2 text-xs rounded hover:bg-red-50 dark:hover:bg-red-900/10 text-erro flex items-center gap-2"><Trash2 size={12} /> Excluir</button>
                      </div>
                    </div>
                 </div>
               </div>
               
               <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                 <div className="flex items-center gap-2">
                   {assigneeDisplay.avatar ? (
                     <img src={assigneeDisplay.avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-600" />
                   ) : (
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">{assigneeDisplay.name.charAt(0)}</div>
                   )}
                   <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[80px]">{assigneeDisplay.name.split(' ')[0]}</span>
                 </div>
                 
                 <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${
                   new Date(task.dueDate) < new Date() && status !== TaskStatus.DONE ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                 }`}>
                   <Clock size={10} />
                   {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Project Card Component ---
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const totalSpent = project.expenses.reduce((acc, expense) => acc + convertAmount(expense.amount, expense.currency, project.currency), 0);
  const hasBudget = project.budget !== undefined && project.budget > 0;
  const progress = hasBudget ? Math.min((totalSpent / project.budget!) * 100, 100) : 0;

  const inProgressCount = (project.tasks || []).filter(t => t.status === TaskStatus.IN_PROGRESS).length;

  return (
    <Link to={`/projects/${project.id}`} className="block group h-full">
      <div className="bg-white dark:bg-dark-surface h-full rounded-xl p-6 shadow-card border border-light-border dark:border-dark-border hover:border-primary/50 hover:shadow-glow transition-all duration-300 flex flex-col relative overflow-hidden">
        
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>{project.status}</span>
          <div className="text-gray-400 group-hover:text-primary transition-colors">
            <ArrowRight size={18} />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors leading-tight">{project.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-grow leading-relaxed">{project.description}</p>
        
        <div className="flex gap-4 mb-5 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-slate-800 px-2.5 py-1.5 rounded">
             <Layout size={14} className="text-primary"/>
             {inProgressCount} Tarefas Ativas
          </div>
        </div>
        
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Progresso</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          {hasBudget ? (
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full ${progress > 100 ? 'bg-erro' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">Orçamento não definido</div>
          )}
          <div className="flex justify-between items-center text-sm mt-1">
             <span className="text-gray-400 font-medium">Gasto:</span>
             <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalSpent, project.currency)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- Project Detail Component ---
const ProjectDetail = ({ projects, onUpdate, onDelete }: { projects: Project[], onUpdate: (p: Project) => void, onDelete: (id: string) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'financial' | 'kanban' | 'timeline'>('financial');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  // Selection State for Edit/Delete
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  if (!project) return <div className="text-center py-20">Projeto não encontrado</div>;

  // Calculations
  const totalSpent = useMemo(() => 
    project.expenses.reduce((acc, e) => acc + convertAmount(e.amount, e.currency, project.currency), 0)
  , [project.expenses, project.currency]);
  
  const hasBudget = project.budget !== undefined && project.budget > 0;
  const remaining = hasBudget ? project.budget! - totalSpent : 0;

  // --- Handlers ---

  const handleExportCSV = () => {
    if (!project.expenses.length) return;

    const headers = ["Data", "Descrição", "Categoria", "Valor Original", "Moeda", "Valor (MZN)"];
    const rows = project.expenses.map(e => {
      const amountMZN = convertAmount(e.amount, e.currency, Currency.MZN);
      return [
        `"${formatDate(e.date)}"`,
        `"${e.name.replace(/"/g, '""')}"`,
        `"${e.category}"`,
        e.amount.toFixed(2),
        e.currency,
        amountMZN.toFixed(2)
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(",") + "\n" 
      + rows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${project.name.replace(/[^a-z0-9]/gi, '_')}_despesas.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportOptions(false);
  };

  const handleExportPDF = () => {
    if (!project.expenses.length) return;
    
    const totalMZN = project.expenses.reduce((acc, e) => acc + convertAmount(e.amount, e.currency, Currency.MZN), 0);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const date = new Date().toLocaleDateString('pt-BR');
      printWindow.document.write(`
        <html>
          <head>
            <title>Despesas - ${project.name}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; font-size: 12px; }
              .header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
              h1 { margin: 0 0 5px 0; font-size: 20px; color: #0f172a; }
              p { margin: 0; color: #64748b; }
              .summary { display: flex; gap: 20px; margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; }
              .summary-item strong { display: block; font-size: 14px; color: #0f172a; }
              table { width: 100%; border-collapse: collapse; }
              th { text-align: left; padding: 10px; border-bottom: 1px solid #cbd5e1; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 10px; }
              td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
              tr:last-child td { border-bottom: none; }
              .text-right { text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${project.name}</h1>
              <p>Relatório de Despesas • Gerado em ${date} • Status: ${project.status}</p>
            </div>
            
            <div class="summary">
               <div class="summary-item">
                  <span>Orçamento Total</span>
                  <strong>${hasBudget ? formatCurrency(project.budget!, project.currency) : 'N/A'}</strong>
               </div>
               <div class="summary-item">
                  <span>Total Gasto (${project.currency})</span>
                  <strong>${formatCurrency(totalSpent, project.currency)}</strong>
               </div>
                <div class="summary-item">
                  <span>Total Gasto (MZN)</span>
                  <strong>${formatCurrency(totalMZN, Currency.MZN)}</strong>
               </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th class="text-right">Valor Original</th>
                  <th class="text-right">Valor (MZN)</th>
                </tr>
              </thead>
              <tbody>
                ${project.expenses.map(e => `
                  <tr>
                    <td>${formatDate(e.date)}</td>
                    <td>${e.name}</td>
                    <td>${e.category}</td>
                    <td class="text-right">${formatCurrency(e.amount, e.currency)}</td>
                    <td class="text-right">${formatCurrency(convertAmount(e.amount, e.currency, Currency.MZN), Currency.MZN)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <script>
              window.onload = function() { setTimeout(function() { window.print(); }, 500); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setShowExportOptions(false);
    }
  };

  // Project Operations
  const handleDeleteProjectConfirm = () => {
    onDelete(project.id);
    navigate('/projects');
  };

  const handleSaveProject = (updatedData: Partial<Project>) => {
    onUpdate({ ...project, ...updatedData });
    setIsEditModalOpen(false);
  };

  // Expense Operations
  const handleSaveExpense = (expenseData: Partial<Expense>) => {
    if (editingExpense) {
      // Update
      const updatedExpenses = project.expenses.map(e => e.id === editingExpense.id ? { ...e, ...expenseData } as Expense : e);
      onUpdate({ ...project, expenses: updatedExpenses });
    } else {
      // Create
      const newExpense: Expense = {
        ...expenseData as Expense,
        id: Date.now().toString(),
        projectId: project.id
      };
      onUpdate({ ...project, expenses: [newExpense, ...project.expenses] });
    }
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updatedExpenses = project.expenses.filter(e => e.id !== expenseId);
    onUpdate({ ...project, expenses: updatedExpenses });
  };

  const openAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const openEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  // Task Operations
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      const updatedTasks = (project.tasks || []).map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t);
      onUpdate({ ...project, tasks: updatedTasks });
    } else {
      const newTask: Task = {
        ...taskData as Task,
        id: Date.now().toString(),
        projectId: project.id,
        status: TaskStatus.TODO
      };
      onUpdate({ ...project, tasks: [...(project.tasks || []), newTask] });
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = (project.tasks || []).filter(t => t.id !== taskId);
    onUpdate({ ...project, tasks: updatedTasks });
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = (project.tasks || []).map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    onUpdate({ ...project, tasks: updatedTasks });
  };

  const openAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in relative max-w-7xl mx-auto pb-20">
      {/* Navigation */}
      <button onClick={() => navigate('/projects')} className="flex items-center text-sm font-bold text-gray-500 hover:text-primary mb-4 transition-colors group">
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform"/>
        Voltar para Projetos
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-dark-surface p-8 rounded-xl shadow-card border border-light-border dark:border-dark-border relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-6">
           <div>
             <div className="flex items-center gap-4 mb-3 flex-wrap">
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
               <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>{project.status}</span>
             </div>
             <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">{project.description}</p>
           </div>
           <div className="flex items-center gap-3 self-start">
              <div className="relative">
                <button 
                  onClick={() => setShowExportOptions(!showExportOptions)} 
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-primary text-gray-600 dark:text-gray-300 transition-all" 
                  title="Exportar Dados"
                >
                  <Download size={18} />
                  <ChevronDown size={14} />
                </button>
                {showExportOptions && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 z-20 overflow-hidden animate-fade-in">
                    <button 
                      onClick={handleExportPDF}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FileText size={14} className="text-red-500" /> Exportar PDF
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 border-t border-gray-50 dark:border-slate-700"
                    >
                      <Table size={14} className="text-primary" /> Exportar CSV
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => setIsReportModalOpen(true)} className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-all" title="Relatório"><FileText size={18} /></button>
              <button onClick={() => setIsEditModalOpen(true)} className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-secondary text-gray-600 dark:text-gray-300 transition-all" title="Editar"><Edit2 size={18} /></button>
              <button onClick={() => setIsDeleteModalOpen(true)} className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-erro text-gray-600 dark:text-gray-300 transition-all" title="Excluir"><Trash2 size={18} /></button>
           </div>
        </div>
      </div>

      {/* Solid Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-lg w-fit border border-gray-200 dark:border-slate-700">
         {[
           { id: 'financial', icon: DollarSign, label: 'Financeiro' },
           { id: 'kanban', icon: Layout, label: 'Tarefas' },
           { id: 'timeline', icon: Calendar, label: 'Cronograma' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-5 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
               activeTab === tab.id 
                 ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
             }`}
           >
             <tab.icon size={16} /> {tab.label}
           </button>
         ))}
      </div>

      {/* --- TAB: FINANCIAL --- */}
      {activeTab === 'financial' && (
        <div className="space-y-6 animate-slide-up">
           {/* KPI Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-light-border dark:border-dark-border border-l-4 border-l-secondary">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Orçamento Total</p>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white">{hasBudget ? formatCurrency(project.budget!, project.currency) : '---'}</h3>
              </div>
              <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-light-border dark:border-dark-border border-l-4 border-l-primary">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Gasto</p>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(totalSpent, project.currency)}</h3>
              </div>
              <div className={`bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-light-border dark:border-dark-border border-l-4 ${remaining < 0 ? 'border-l-erro' : 'border-l-primary'}`}>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Restante</p>
                 <h3 className={`text-2xl font-black ${remaining < 0 ? 'text-erro' : 'text-primary'}`}>{hasBudget ? formatCurrency(remaining, project.currency) : 'N/A'}</h3>
              </div>
           </div>
           
           {/* Expense Table */}
           <div className="bg-white dark:bg-dark-surface rounded-xl shadow-card border border-light-border dark:border-dark-border overflow-hidden">
             <div className="p-5 border-b border-light-border dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                   <h3 className="font-bold text-lg text-slate-900 dark:text-white">Despesas</h3>
                   <button onClick={openAddExpense} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-dark transition-all">
                     <Plus size={16} /> Adicionar
                   </button>
                </div>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                   <input type="text" placeholder="Filtrar..." className="pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white" value={expenseSearch} onChange={e => setExpenseSearch(e.target.value)} />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Descrição</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4 text-right">Valor</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {project.expenses.filter(e => e.name.toLowerCase().includes(expenseSearch.toLowerCase())).map(expense => (
                      <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(expense.date)}</td>
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{expense.name}</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-semibold text-gray-600 dark:text-gray-300">{expense.category}</span></td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(expense.amount, expense.currency)}</div>
                          {expense.currency !== project.currency && (
                             <div className="text-xs text-gray-400">≈ {formatCurrency(convertAmount(expense.amount, expense.currency, project.currency), project.currency)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => openEditExpense(expense)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-secondary rounded transition-colors"><Edit2 size={14} /></button>
                             <button onClick={() => handleDeleteExpense(expense.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-erro rounded transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {project.expenses.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Nenhuma despesa registrada.</td></tr>}
                  </tbody>
                </table>
             </div>
           </div>
        </div>
      )}

      {/* --- TAB: KANBAN --- */}
      {activeTab === 'kanban' && (
        <div className="animate-slide-up">
           <div className="flex justify-end mb-6">
             <button onClick={openAddTask} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg shadow hover:bg-slate-800 transition-all">
               <Plus size={16} /> Nova Tarefa
             </button>
           </div>
           <div className="flex gap-6 overflow-x-auto pb-6">
              <KanbanColumn 
                 title="A Fazer" status={TaskStatus.TODO} 
                 tasks={(project.tasks || []).filter(t => t.status === TaskStatus.TODO)}
                 onMoveTask={handleMoveTask} onEditTask={openEditTask} onDeleteTask={handleDeleteTask}
              />
              <KanbanColumn 
                 title="Em Progresso" status={TaskStatus.IN_PROGRESS} 
                 tasks={(project.tasks || []).filter(t => t.status === TaskStatus.IN_PROGRESS)}
                 onMoveTask={handleMoveTask} onEditTask={openEditTask} onDeleteTask={handleDeleteTask}
              />
              <KanbanColumn 
                 title="Concluído" status={TaskStatus.DONE} 
                 tasks={(project.tasks || []).filter(t => t.status === TaskStatus.DONE)}
                 onMoveTask={handleMoveTask} onEditTask={openEditTask} onDeleteTask={handleDeleteTask}
              />
           </div>
        </div>
      )}

      {/* Modals Rendered Here */}
      <ProjectFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleSaveProject} 
        initialData={project} 
      />
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteProjectConfirm} 
        itemName={project.name} 
        isIrreversible={true}
      />

      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        projectCurrency={project.currency}
        initialData={editingExpense}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <ProjectReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        project={project}
      />
    </div>
  );
};

// --- Project List Component ---
const ProjectList = ({ projects, onAdd }: { projects: Project[], onAdd: (p: Project) => void }) => {
  const [filter, setFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (newProjectData: Partial<Project>) => {
    const newProject: Project = {
      ...newProjectData as Project,
      id: Date.now().toString(),
      expenses: [],
      tasks: []
    };
    onAdd(newProject);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Projetos</h1>
             <p className="text-sm text-gray-500 dark:text-gray-400">Gestão estratégica de portfólio.</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-primary-dark hover:-translate-y-0.5 transition-all text-sm">
             <Plus size={18} /> Novo Projeto
          </button>
       </div>
       
       <div className="relative max-w-md">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <Search className="h-4 w-4 text-gray-400" />
         </div>
         <input 
           type="text" 
           className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm" 
           placeholder="Buscar projetos..." 
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
         />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase())).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
       </div>

       <ProjectFormModal
         isOpen={isCreateModalOpen}
         onClose={() => setIsCreateModalOpen(false)}
         onSave={handleCreate}
         initialData={null}
       />
    </div>
  );
};

const Projects = ({ projects, onAdd, onUpdate, onDelete }: any) => {
  return (
    <Routes>
      <Route index element={<ProjectList projects={projects} onAdd={onAdd} />} />
      <Route path=":id" element={<ProjectDetail projects={projects} onUpdate={onUpdate} onDelete={onDelete} />} />
    </Routes>
  );
};

export default Projects;
