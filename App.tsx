
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  PieChart as PieChartIcon, 
  Settings, 
  Moon, 
  Sun, 
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Globe,
  ChevronRight,
  ChevronLeft,
  Filter,
  ListTodo,
  ClipboardList,
  Search,
  Wrench,
  ArrowRightLeft, 
  Printer,
  Plus,
  Trash2,
  Download,
  FileText,
  Send,
  Smartphone,
  QrCode,
  MessageSquare,
  FilePlus,
  CheckSquare,
  Link as LinkIcon,
  Zap,
  Box,
  ShieldCheck,
  CreditCard,
  Lock,
  Image as ImageIcon,
  Mail,
  Save,
  BellRing,
  Palette
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { MOCK_PROJECTS, CURRENCY_RATES } from './constants';
import { Project, Currency, TaskStatus } from './types';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import TasksPage from './pages/Tasks';
import Checklist from './pages/Checklist';
import CurrencyConverter from './pages/CurrencyConverter'; 
import ReportsPage from './pages/Reports';
import Login from './pages/Login';
import Admin from './pages/Admin'; 

// --- Components ---

// SidebarItem Atualizado para suportar estado "Collapsed"
const SidebarItem: React.FC<{ icon: any, label: string, to: string, active: boolean, count?: number, collapsed?: boolean }> = ({ icon: Icon, label, to, active, count, collapsed }) => (
  <Link
    to={to}
    title={collapsed ? label : undefined} // Tooltip nativo quando colapsado
    className={`relative group flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 mx-3 mb-1 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-[#0f172a] text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    {/* Linha de Acento (Glow) - Verde - Apenas visível se NÃO estiver colapsado */}
    {active && !collapsed && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(22,163,74,0.6)] transition-all duration-300"></span>
    )}

    <div className={`flex items-center gap-3.5 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
      <Icon 
        className={`w-5 h-5 transition-colors duration-200 flex-shrink-0 ${
          active ? 'text-primary-light' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
        }`} 
        strokeWidth={active ? 2.5 : 2} 
      />
      
      {/* Texto com transição de opacidade/largura para animar suavemente */}
      <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
        collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
      } ${active ? 'font-semibold' : 'font-medium'} tracking-wide`}>
        {label}
      </span>
    </div>

    {/* Badge/Contador - Apenas visível se NÃO estiver colapsado */}
    {count !== undefined && !collapsed && (
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded animate-fade-in ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 group-hover:text-slate-300'
      }`}>
        {count}
      </span>
    )}
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode, darkMode: boolean, toggleTheme: () => void, onLogout: () => void, isAdmin: boolean }> = ({ children, darkMode, toggleTheme, onLogout, isAdmin }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Estado para controlar o sidebar

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Updated Menu Structure
  const menuItems = [
    // Menu
    { icon: LayoutDashboard, label: 'Painel', path: '/' },
    { icon: FolderKanban, label: 'Projetos', path: '/projects' },
    
    // Gestão
    { icon: ArrowRightLeft, label: 'Câmbio', path: '/currency' }, 
    { icon: ListTodo, label: 'Tarefas', path: '/tasks' }, 
    { icon: ClipboardList, label: 'Checklist', path: '/checklist' },
    { icon: PieChartIcon, label: 'Relatórios', path: '/reports' },
    
    // Sistema
    { icon: Wrench, label: 'Ferramentas', path: '/tools' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
    { icon: ShieldCheck, label: 'Administrador', path: '/admin' }, 
  ];

  // Filter items based on admin status
  const filteredMenuItems = menuItems.filter(item => {
    if (item.path === '/admin' && !isAdmin) return false;
    return true;
  });

  // Helper to slice menu items based on section logic
  const mainItems = filteredMenuItems.filter(i => ['/', '/projects'].includes(i.path));
  const managementItems = filteredMenuItems.filter(i => ['/currency', '/tasks', '/checklist', '/reports'].includes(i.path));
  const systemItems = filteredMenuItems.filter(i => ['/tools', '/settings', '/admin'].includes(i.path));

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden font-sans print:overflow-visible print:h-auto">
      
      {/* Sidebar Desktop - Largura Dinâmica */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-[#020617] border-r border-light-border dark:border-slate-800/50 h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out print:hidden ${
          isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]'
        }`}
      >
        {/* Brand & Toggle */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-6 mb-2`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-primary flex-shrink-0 transition-transform duration-300 hover:scale-110">
               <Box strokeWidth={2.5} size={28} />
            </div>
            {/* Esconde o texto suavemente */}
            <div className={`transition-all duration-300 origin-left ${isSidebarCollapsed ? 'w-0 opacity-0 scale-0' : 'w-auto opacity-100 scale-100'}`}>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none uppercase whitespace-nowrap">Klarity</h1>
            </div>
          </div>
          
          {/* Toggle Button - Escondido se colapsado (reaparece no hover da área ou podemos deixar um botão fixo embaixo) */}
          {/* Opção B: Botão sempre visível, muda de posição */}
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
               <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Se estiver colapsado, mostrar botão de expandir centralizado no topo */}
        {isSidebarCollapsed && (
           <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="mx-auto mb-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors"
            title="Expandir Menu"
          >
             <ChevronRight size={20} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-2 px-0 overflow-x-hidden">
          {/* Grupo Superior (Menu e Gestão) */}
          <div className="flex flex-col space-y-1">
            {mainItems.map((item) => (
                <SidebarItem 
                  key={item.path} 
                  icon={item.icon} 
                  label={item.label} 
                  to={item.path} 
                  active={isActive(item.path)}
                  collapsed={isSidebarCollapsed}
                />
              ))}

            {/* Espaçador visual */}
            <div className="my-4 mx-4 border-t border-slate-100 dark:border-slate-800/50"></div>

            {managementItems.map((item) => (
                <SidebarItem 
                  key={item.path} 
                  icon={item.icon} 
                  label={item.label} 
                  to={item.path} 
                  active={isActive(item.path)} 
                  count={item.label === 'Tarefas' ? 2 : item.label === 'Checklist' ? 3 : undefined}
                  collapsed={isSidebarCollapsed}
                />
              ))}
          </div>

          {/* Grupo Inferior (Sistema) */}
          <div className="mt-auto pt-4 pb-4">
             <div className="my-2 mx-4 border-t border-slate-100 dark:border-slate-800/50"></div>
             <div className="space-y-1">
               {systemItems.map((item) => (
                 <SidebarItem 
                   key={item.path} 
                   icon={item.icon} 
                   label={item.label} 
                   to={item.path} 
                   active={isActive(item.path)} 
                   collapsed={isSidebarCollapsed}
                 />
               ))}
               {/* Botão de Sair removido do Sidebar conforme solicitado */}
             </div>
          </div>
        </nav>

        {/* User Profile Card - Adaptável */}
        <div className={`p-4 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#020617] transition-all duration-300 ${isSidebarCollapsed ? 'items-center justify-center flex' : ''}`}>
           <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
             <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700 flex-shrink-0">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
             </div>
             
             {/* Esconde detalhes se colapsado */}
             {!isSidebarCollapsed && (
               <>
                 <div className="overflow-hidden flex-1 animate-fade-in">
                   <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Carlos Mendes</p>
                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">CEO • Klarity MZ</p>
                 </div>
                 <button 
                   onClick={toggleTheme}
                   className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex-shrink-0"
                 >
                   {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
               </>
             )}
           </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 print:h-auto print:overflow-visible">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white dark:bg-dark-surface border-b border-light-border dark:border-dark-border flex items-center justify-between px-4 z-20 flex-shrink-0 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l9 4.9V17L12 22l-9-4.9V7z"/>
                </svg>
             </div>
             <span className="font-bold text-lg text-slate-900 dark:text-white">Klarity</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white dark:bg-dark-bg pt-20 px-6 md:hidden animate-fade-in overflow-y-auto">
             <nav className="space-y-6">
               <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                  <div className="space-y-2">
                    {mainItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          isActive(item.path)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
               </div>

               <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gestão</p>
                  <div className="space-y-2">
                    {managementItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          isActive(item.path)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
               </div>
               
               <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sistema</p>
                  <div className="space-y-2">
                    {systemItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          isActive(item.path)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ))}
                     <button
                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-all text-erro hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <LogOut className="w-5 h-5" />
                        Sair
                      </button>
                  </div>
               </div>
             </nav>
             <div className="mt-8 pt-8 pb-8 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Carlos Mendes</p>
                    <p className="text-xs text-gray-500">carlos@klarity.mz</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-white border border-gray-200 dark:border-slate-700"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
             </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth custom-scrollbar bg-light-bg dark:bg-dark-bg print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto w-full pb-10 print:pb-0 print:max-w-none">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Pages ---

const SettingsPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const menu = [
    { id: 'profile', label: 'Perfil e Conta', icon: User },
    { id: 'appearance', label: 'Aparência e Moeda', icon: Palette },
    { id: 'notifications', label: 'Notificações', icon: BellRing },
    { id: 'security', label: 'Segurança', icon: Lock },
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie suas preferências e dados pessoais.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         
         {/* Sidebar Navigation */}
         <aside className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-sm p-2 overflow-hidden">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {menu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="my-2 border-t border-gray-100 dark:border-slate-800 lg:block hidden"></div>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-erro hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors lg:flex hidden"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
         </aside>

         {/* Content Area */}
         <main className="flex-1 min-w-0 space-y-6">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
                   {/* Cover & Avatar */}
                   <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
                      <button className="absolute bottom-3 right-3 p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-sm transition-colors text-xs font-bold flex items-center gap-2">
                        <ImageIcon size={14} /> Alterar Capa
                      </button>
                   </div>
                   <div className="px-8 pb-8 relative">
                      <div className="relative -mt-12 mb-6 inline-block">
                         <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full rounded-xl bg-gray-100 dark:bg-slate-700" />
                         </div>
                         <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-full shadow border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                            <ImageIcon size={14} />
                         </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                            <div className="relative">
                               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                               <input type="text" defaultValue="Carlos Mendes" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white font-medium" />
                            </div>
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Cargo</label>
                            <input type="text" defaultValue="CEO & Founder" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white font-medium" />
                         </div>
                         <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                            <div className="relative">
                               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                               <input type="email" defaultValue="carlos@klarity.mz" className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white font-medium" />
                            </div>
                         </div>
                         <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
                            <textarea rows={3} defaultValue="Gestor focado em resultados e apaixonado por tecnologia." className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white font-medium" />
                         </div>
                      </div>
                   </div>
                   <div className="px-8 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-light-border dark:border-dark-border flex justify-end">
                      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow hover:bg-primary-dark transition-all">
                        {isSaved ? <CheckSquare size={16} /> : <Save size={16} />}
                        {isSaved ? 'Salvo!' : 'Salvar Alterações'}
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
               <div className="animate-fade-in space-y-6">
                 <div className="bg-white dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-card p-8">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Moeda Padrão</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {['MZN', 'USD', 'EUR'].map((curr) => (
                         <button key={curr} className="relative group p-4 rounded-xl border-2 border-gray-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all text-left">
                            <div className="flex justify-between items-start mb-2">
                               <span className="font-bold text-xl text-slate-900 dark:text-white">{curr}</span>
                               {curr === 'MZN' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                            </div>
                            <p className="text-xs text-gray-500 group-hover:text-primary transition-colors">Usar como base</p>
                         </button>
                       ))}
                    </div>
                 </div>
                 
                 <div className="bg-white dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-card p-8">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Tema do Sistema</h3>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                       <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-900 dark:text-white">
                          <Moon size={24} />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 dark:text-white">Modo Escuro / Claro</p>
                          <p className="text-xs text-gray-500">O tema atual é controlado pelo botão na barra lateral.</p>
                       </div>
                    </div>
                 </div>
               </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-card p-8">
                   <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <BellRing size={20} className="text-primary" /> Preferências de Alerta
                   </h3>
                   <div className="space-y-6">
                      {[
                        { title: 'Resumo Semanal', desc: 'Receba um email toda segunda-feira com o status dos projetos.' },
                        { title: 'Alertas de Orçamento', desc: 'Notificar quando um projeto atingir 90% do orçamento.' },
                        { title: 'Novas Tarefas', desc: 'Notificar quando uma tarefa for atribuída a mim.' },
                        { title: 'Aprovações Pendentes', desc: 'Alertas sobre despesas que precisam de revisão.' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 last:border-0 last:pb-0">
                           <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                           </label>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            
            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border shadow-card p-8">
                   <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Lock size={20} className="text-secondary" /> Senha e Autenticação
                   </h3>
                   
                   <div className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-gray-500 uppercase">Senha Atual</label>
                         <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none dark:text-white" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-gray-500 uppercase">Nova Senha</label>
                         <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none dark:text-white" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-gray-500 uppercase">Confirmar Nova Senha</label>
                         <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm outline-none dark:text-white" />
                      </div>
                      <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg shadow hover:opacity-90 transition-all">
                        Alterar Senha
                      </button>
                   </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 flex items-center justify-between">
                   <div>
                      <h3 className="font-bold text-erro mb-1">Zona de Perigo</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ações irreversíveis relacionadas à sua conta.</p>
                   </div>
                   <button 
                      onClick={onLogout}
                      className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-erro text-sm font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2"
                   >
                     <LogOut size={16} />
                     Sair da Conta
                   </button>
                </div>
              </div>
            )}

            {/* Mobile Logout Button (Visible only on mobile inside content) */}
            <div className="lg:hidden pt-4">
              <button 
                 onClick={onLogout}
                 className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 text-erro font-bold rounded-lg border border-red-100 dark:border-red-900/30"
              >
                 <LogOut size={18} /> Sair
              </button>
            </div>

         </main>
      </div>
    </div>
  );
};

// --- NEW TOOLS PAGE (AUTOMATION) ---

const ToolsPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const features = [
    { icon: MessageSquare, title: 'Aviso de Orçamento', desc: 'Receba alerta no WhatsApp quando atingir 90% do orçamento.', active: true },
    { icon: FilePlus, title: 'Nova Despesa via Msg', desc: 'Envie uma foto do recibo para adicionar despesa automaticamente.', active: true },
    { icon: CheckSquare, title: 'Checklist via Msg', desc: 'Adicione itens ao backlog enviando texto simples.', active: false },
    { icon: Bell, title: 'Resumo Diário', desc: 'Receba um resumo dos status dos projetos às 08:00.', active: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Automação Inteligente</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Conecte seu WhatsApp para automatizar tarefas e receber alertas.</p>
         </div>
       </div>

       {/* Connection Card */}
       <div className="bg-white dark:bg-dark-surface p-8 rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="flex-shrink-0">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center border-2 border-dashed ${isConnected ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800'}`}>
                   {isConnected ? (
                     <Smartphone size={48} className="text-primary" />
                   ) : (
                     <QrCode size={64} className="text-slate-900 dark:text-white" />
                   )}
                </div>
             </div>
             <div className="flex-1 text-center md:text-left space-y-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                  {isConnected ? (
                    <><span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span> Conectado ao WhatsApp</>
                  ) : (
                    'Conectar WhatsApp'
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  {isConnected 
                    ? 'Seu dispositivo está sincronizado. As automações ativas abaixo estão processando mensagens em tempo real.'
                    : 'Escaneie o QR Code para vincular sua conta. Isso permitirá que o sistema envie alertas e receba comandos.'
                  }
                </p>
                <button 
                  onClick={() => setIsConnected(!isConnected)}
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all ${
                    isConnected 
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                   {isConnected ? 'Desconectar Dispositivo' : 'Gerar QR Code'}
                </button>
             </div>
          </div>
       </div>

       {/* Features Grid */}
       <div>
         <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Funcionalidades Disponíveis</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
               <div key={idx} className={`p-5 rounded-xl border transition-all ${feature.active ? 'bg-white dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm' : 'bg-gray-50 dark:bg-slate-800/50 border-transparent opacity-75'}`}>
                  <div className="flex justify-between items-start mb-3">
                     <div className={`p-2 rounded-lg ${feature.active ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'}`}>
                        <feature.icon size={20} />
                     </div>
                     <div className="relative inline-block w-10 align-middle select-none">
                        <input type="checkbox" checked={feature.active} readOnly className={`absolute block w-5 h-5 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer transition-all ${feature.active ? 'right-0 border-primary bg-primary' : 'right-5'}`}/>
                        <span className={`block overflow-hidden h-6 rounded-full cursor-pointer ${feature.active ? 'bg-primary/20' : 'bg-gray-200 dark:bg-slate-700'}`}></span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
               </div>
            ))}
         </div>
       </div>

       {/* API Link Info */}
       <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-3 items-start">
          <LinkIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
             <h4 className="text-sm font-bold text-primary">Webhook URL</h4>
             <p className="text-xs text-blue-600/80 dark:text-blue-300/80 mt-1 break-all font-mono">https://api.klarity.mz/v1/webhook/wa/8f7d-2k9s-1p4m</p>
             <p className="text-[10px] text-gray-500 mt-2">Use este endpoint para configurações avançadas em ferramentas externas.</p>
          </div>
       </div>
    </div>
  );
};

// --- App ---

const App: React.FC = () => {
  // Authentication State with Persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('klarity_auth') === 'true';
  });

  // Admin State persistence
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('klarity_is_admin') === 'true';
  });

  // Project State with Persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('klarity_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Effects for Persistence
  useEffect(() => {
    localStorage.setItem('klarity_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('klarity_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('klarity_is_admin', String(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogin = (isUserAdmin: boolean) => {
    setIsAuthenticated(true);
    setIsAdmin(isUserAdmin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('klarity_auth');
    localStorage.removeItem('klarity_is_admin');
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleTaskStatusUpdate = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    setProjects(currentProjects => 
      currentProjects.map(project => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: (project.tasks || []).map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        };
      })
    );
  };

  return (
    <Router>
      {!isAuthenticated ? (
         <Routes>
           <Route path="*" element={<Login onLogin={handleLogin} />} />
         </Routes>
      ) : (
        <Layout darkMode={darkMode} toggleTheme={toggleTheme} onLogout={handleLogout} isAdmin={isAdmin}>
          <Routes>
            <Route path="/" element={<Dashboard projects={projects} />} />
            <Route path="/projects/*" element={
              <Projects 
                projects={projects} 
                onAdd={handleAddProject} 
                onUpdate={handleUpdateProject} 
                onDelete={handleDeleteProject} 
              />
            } />
            <Route path="/currency" element={<CurrencyConverter />} />
            <Route path="/tasks" element={
              <TasksPage 
                projects={projects} 
                onTaskUpdate={handleTaskStatusUpdate} 
              />
            } />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/reports" element={<ReportsPage projects={projects} />} />
            <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
            <Route path="/tools" element={<ToolsPage />} />
            {/* Protected Admin Route */}
            <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

export default App;
