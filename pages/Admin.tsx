
import React, { useState } from 'react';
import { ShieldCheck, Users, Activity, Server, Search, MoreHorizontal, UserPlus, Lock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_MEMBERS } from '../constants';

const Admin = () => {
  const [users, setUsers] = useState(MOCK_MEMBERS);
  const [filter, setFilter] = useState('');

  // Mock Logs
  const logs = [
    { id: 1, action: 'Login realizado', user: 'Carlos Mendes', time: '10:42', status: 'success' },
    { id: 2, action: 'Projeto criado: Expansão', user: 'Ana Silva', time: '09:15', status: 'success' },
    { id: 3, action: 'Falha no backup', user: 'System', time: '03:00', status: 'error' },
    { id: 4, action: 'Permissão alterada', user: 'Admin', time: 'Ontem', status: 'warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Painel Administrativo
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestão global de usuários e sistema.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow hover:opacity-90 transition-all">
           <UserPlus size={16} /> Novo Usuário
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><Users size={24} /></div>
             <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+12%</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{users.length}</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Usuários Ativos</p>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400"><Activity size={24} /></div>
             <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Normal</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">99.9%</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uptime do Sistema</p>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-card border border-light-border dark:border-dark-border">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400"><Server size={24} /></div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">2.4 GB</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uso de Banco de Dados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Management Table */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
           <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30 flex justify-between items-center">
             <h3 className="font-bold text-base text-slate-900 dark:text-white">Usuários do Sistema</h3>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white" 
                />
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100 dark:border-slate-700">
                 <tr>
                   <th className="px-6 py-4">Usuário</th>
                   <th className="px-6 py-4">Função</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                 {users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase())).map((user) => (
                   <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600" />
                         <div>
                           <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                           <p className="text-xs text-gray-500">{user.name.split(' ')[0].toLowerCase()}@klarity.mz</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
                         {user.role}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400">
                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Ativo
                       </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-primary transition-colors">
                         <MoreHorizontal size={18} />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border shadow-card overflow-hidden">
           <div className="p-6 border-b border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/30">
             <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
               <FileText size={18} className="text-gray-500" /> Logs de Auditoria
             </h3>
           </div>
           <div className="divide-y divide-gray-100 dark:divide-slate-800">
             {logs.map((log) => (
               <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors flex gap-3">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    log.status === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 
                    log.status === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 
                    'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'
                  }`}>
                    {log.status === 'success' ? <CheckCircle size={14} /> : log.status === 'error' ? <XCircle size={14} /> : <Lock size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
               </div>
             ))}
           </div>
           <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-light-border dark:border-dark-border text-center">
              <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Ver todos os logs</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
