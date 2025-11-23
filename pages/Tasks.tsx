import React, { useMemo, useState } from 'react';
import { Project, TaskStatus } from '../types';
import { MOCK_MEMBERS } from '../constants';
import { CheckCircle, Clock, User, Layout } from 'lucide-react';

const TasksPage = ({ projects, onTaskUpdate }: { projects: Project[], onTaskUpdate: (projectId: string, taskId: string, newStatus: TaskStatus) => void }) => {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  
  const allTasks = useMemo(() => {
    return projects.flatMap(p => (p.tasks || []).map(t => ({ ...t, projectName: p.name })));
  }, [projects]);

  const tasksByStatus = {
    [TaskStatus.TODO]: allTasks.filter(t => t.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: allTasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.DONE]: allTasks.filter(t => t.status === TaskStatus.DONE),
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, projectId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('projectId', projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('taskId');
    const projectId = e.dataTransfer.getData('projectId');
    if (taskId && projectId) onTaskUpdate(projectId, taskId, newStatus);
  };

  const getColumnStyles = (status: TaskStatus) => {
    const isOver = dragOverColumn === status;
    const base = "flex-1 min-w-[320px] rounded-xl p-6 transition-all duration-300 flex flex-col border";
    if (isOver) return `${base} bg-primary/5 border-primary border-dashed`;
    return `${base} bg-gray-100 dark:bg-slate-900 border-transparent dark:border-slate-800`;
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Minhas Tarefas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gestão visual de produtividade global.</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 flex-1">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div 
            key={status} 
            className={getColumnStyles(status as TaskStatus)}
            onDragOver={(e) => handleDragOver(e, status as TaskStatus)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status as TaskStatus)}
          >
            <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="font-bold text-base text-slate-700 dark:text-gray-200 flex items-center gap-3 uppercase tracking-wide text-sm">
                 <div className={`p-1.5 rounded ${status === TaskStatus.DONE ? 'bg-green-100 text-green-600' : status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                    <Layout size={14} />
                 </div>
                 {status}
               </h3>
               <span className="bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-md text-xs font-bold shadow-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                 {tasks.length}
               </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {tasks.map(task => {
                let assigneeDisplay = { avatar: '', name: 'N/A' };
                if (task.assigneeName) assigneeDisplay = { avatar: '', name: task.assigneeName };
                else if (task.assigneeId) {
                  const m = MOCK_MEMBERS.find(mem => mem.id === task.assigneeId);
                  if (m) assigneeDisplay = { avatar: m.avatar, name: m.name };
                }

                return (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id, task.projectId)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded truncate max-w-[150px]">
                         {task.projectName}
                       </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 leading-snug">{task.title}</h4>
                    
                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-slate-700 pt-3">
                       <div className="flex items-center gap-2">
                          {assigneeDisplay.avatar ? (
                            <img src={assigneeDisplay.avatar} className="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-600" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">{assigneeDisplay.name[0]}</div>
                          )}
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{assigneeDisplay.name.split(' ')[0]}</span>
                       </div>
                       <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${
                         task.priority === 'Alta' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                       }`}>
                         <Clock size={12} />
                         {new Date(task.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;