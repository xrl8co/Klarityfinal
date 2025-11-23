import React, { useState } from 'react';
import { ProjectIdea } from '../types';
import { MOCK_IDEAS } from '../constants';
import { Plus, Lightbulb, Trash2, Edit2, DollarSign, GripVertical, X } from 'lucide-react';

const Checklist = () => {
  const [ideas, setIdeas] = useState<ProjectIdea[]>(MOCK_IDEAS);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ProjectIdea | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectIdea>>({
    title: '', description: '', priority: 'Média', estimatedBudget: 0
  });

  const priorities: Array<'Alta' | 'Média' | 'Baixa'> = ['Alta', 'Média', 'Baixa'];

  // Handlers
  const handleOpenModal = (idea?: ProjectIdea) => {
    if (idea) {
      setEditingIdea(idea);
      setFormData(idea);
    } else {
      setEditingIdea(null);
      setFormData({ title: '', description: '', priority: 'Média', estimatedBudget: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdea) {
      setIdeas(ideas.map(i => i.id === editingIdea.id ? { ...i, ...formData } as ProjectIdea : i));
    } else {
      const newIdea: ProjectIdea = {
        ...formData as ProjectIdea,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setIdeas([...ideas, newIdea]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('ideaId', id); };
  const handleDragOver = (e: React.DragEvent, p: string) => { e.preventDefault(); setDragOverColumn(p); };
  const handleDrop = (e: React.DragEvent, p: any) => {
     e.preventDefault();
     setDragOverColumn(null);
     const id = e.dataTransfer.getData('ideaId');
     if(id) setIdeas(prev => prev.map(i => i.id === id ? {...i, priority: p} : i));
  };

  const getColumnStyles = (priority: string) => {
    const isOver = dragOverColumn === priority;
    const base = "flex-1 min-w-[320px] rounded-xl p-6 flex flex-col transition-all duration-300 border";
    
    if (priority === 'Alta') return `${base} bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 ${isOver ? 'ring-2 ring-red-400' : ''}`;
    if (priority === 'Média') return `${base} bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/20 ${isOver ? 'ring-2 ring-yellow-400' : ''}`;
    return `${base} bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 ${isOver ? 'ring-2 ring-green-400' : ''}`;
  };

  const inputClass = "w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Backlog de Ideias</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Incubadora de novos projetos e iniciativas.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-blue-600 transition-transform text-sm">
          <Plus size={18} /> Nova Ideia
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 flex-1">
        {priorities.map(priority => {
          const columnIdeas = ideas.filter(i => i.priority === priority);
          return (
            <div 
              key={priority}
              className={getColumnStyles(priority)}
              onDragOver={(e) => handleDragOver(e, priority)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, priority)}
            >
              <div className="flex justify-between items-center mb-6 px-1">
                <h3 className={`font-black text-sm uppercase tracking-wider ${
                  priority === 'Alta' ? 'text-red-600' : priority === 'Média' ? 'text-yellow-600' : 'text-green-600'
                }`}>{priority}</h3>
                <span className="bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-gray-100 dark:border-slate-700">{columnIdeas.length}</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {columnIdeas.map(idea => (
                  <div 
                    key={idea.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, idea.id)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing group relative"
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-300 transition-opacity">
                      <GripVertical size={16} />
                    </div>
                    <div className="pl-4">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 dark:text-white leading-tight text-sm">{idea.title}</h4>
                          <button onClick={() => handleOpenModal(idea)} className="p-1 text-gray-400 hover:text-primary transition-colors"><Edit2 size={14} /></button>
                       </div>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">{idea.description}</p>
                       <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100 dark:border-slate-700">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-gray-300">
                             <DollarSign size={14} className="text-secondary" />
                             {idea.estimatedBudget ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(idea.estimatedBudget) : '---'}
                          </div>
                          <button onClick={() => handleDelete(idea.id)} className="text-gray-400 hover:text-erro transition-colors"><Trash2 size={14} /></button>
                       </div>
                    </div>
                  </div>
                ))}
                {columnIdeas.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-400/50 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                    <Lightbulb size={24} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium">Arraste ideias aqui</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
             <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingIdea ? 'Editar Ideia' : 'Nova Ideia'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><X size={20} className="text-gray-500" /></button>
             </div>
             <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Título</label>
                  <input required type="text" className={inputClass} 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Descrição</label>
                  <textarea required className={inputClass} rows={3}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Orçamento Est.</label>
                      <input type="number" className={inputClass} 
                        value={formData.estimatedBudget} onChange={e => setFormData({...formData, estimatedBudget: Number(e.target.value)})} />
                   </div>
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow hover:bg-blue-600 transition-all mt-4">
                  Salvar
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;