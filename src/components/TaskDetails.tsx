"use client";

import { Task } from "@/types";
import { getDeadlineColor, formatCurrency, parseCurrencyInput } from "@/lib/utils";
import {
    Clock, Trash2, X, ListTodo, CheckSquare,
    MessageSquare, SendHorizontal, Gamepad2, Tag,
    Wallet, ArrowRight
} from 'lucide-react';

interface TaskDetailsProps {
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    deleteTask: (id: string) => void;
    updateTaskDeadline: (taskId: string, newDate: string) => void;
    updateTaskCategory: (taskId: string, newCategory: string) => void;
    updateTaskSpent: (taskId: string, newSpent: number) => void;
    updateSubtaskSpent: (taskId: string, subId: string, newSpent: number) => void;
    newSubtask: string;
    setNewSubtask: (val: string) => void;
    addSubtask: (taskId: string) => void;
    toggleSubtask: (taskId: string, subId: string) => void;
    deleteSubtask: (taskId: string, subId: string) => void;
    newComment: string;
    setNewComment: (val: string) => void;
    addComment: (taskId: string) => void;
    deleteComment: (taskId: string, commentId: string) => void;
    currentUser: string;
}

const CATEGORY_SUGGESTIONS = ["Geral", "Base", "Lugar", "Tema", "RSVP", "Comida", "Decoração"];

export default function TaskDetails({
    selectedTask,
    setSelectedTask,
    deleteTask,
    updateTaskDeadline,
    updateTaskCategory,
    updateTaskSpent,
    updateSubtaskSpent,
    newSubtask,
    setNewSubtask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    newComment,
    setNewComment,
    addComment,
    deleteComment,
    currentUser
}: TaskDetailsProps) {
    if (!selectedTask) {
        return (
            <div className="bg-slate-100/50 rounded-xl border border-slate-200 border-dashed h-full flex flex-col items-center justify-center p-8 text-center">
                <Gamepad2 className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Selecione uma missão na lista para ver os detalhes, adicionar sub-etapas e deixar notas.</p>
            </div>
        );
    }

    const hasSubtaskCosts = selectedTask.subtasks?.some(s => (s.spent || 0) > 0);

    const handleMainSpentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseCurrencyInput(e.target.value);
        updateTaskSpent(selectedTask.id, val);
    };

    const handleSubtaskSpentChange = (subId: string, value: string) => {
        const val = parseCurrencyInput(value);
        updateSubtaskSpent(selectedTask.id, subId, val);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 h-[70vh] flex flex-col overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-white flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">Detalhes da Missão</span>
                    <h3 className="font-bold text-slate-800 leading-tight break-words">{selectedTask.text}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded border border-slate-200 shadow-sm">
                            <Clock className={`w-3.5 h-3.5 ${getDeadlineColor(selectedTask.deadline, 'text')}`} />
                            <input
                                type="date"
                                value={selectedTask.deadline}
                                onChange={(e) => updateTaskDeadline(selectedTask.id, e.target.value)}
                                className={`text-xs bg-transparent border-none focus:ring-0 p-0 cursor-pointer font-bold ${getDeadlineColor(selectedTask.deadline, 'text')}`}
                            />
                        </div>

                        <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded border border-slate-200 shadow-sm group">
                            <Tag className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                value={selectedTask.category}
                                onChange={(e) => updateTaskCategory(selectedTask.id, e.target.value)}
                                placeholder="Categoria..."
                                className="text-xs bg-transparent border-none focus:ring-0 p-0 w-20 font-bold text-slate-600 placeholder:text-slate-300 placeholder:font-normal"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-1 ml-2">
                    <button onClick={() => deleteTask(selectedTask.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Deletar Missão">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSelectedTask(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md md:hidden transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
                {/* Seção de Gasto da Missão */}
                <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Gasto da Missão
                            </h4>
                        </div>
                        {hasSubtaskCosts && (
                            <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full shadow-md shadow-blue-200">
                                <span className="text-[9px] font-black uppercase tracking-tighter">Soma Automática</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</div>
                        <input 
                            type="text"
                            inputMode="numeric"
                            value={formatCurrency(selectedTask.spent)}
                            readOnly={hasSubtaskCosts}
                            onChange={handleMainSpentChange}
                            className={`w-full bg-slate-50 border-2 rounded-xl py-3 pl-11 pr-4 text-2xl font-black transition-all outline-none ${
                                hasSubtaskCosts 
                                ? 'border-blue-100 text-blue-600 cursor-not-allowed' 
                                : 'border-slate-100 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100'
                            }`}
                            placeholder="0,00"
                        />
                    </div>
                    {hasSubtaskCosts && (
                        <p className="text-[10px] text-blue-400 mt-2.5 font-bold flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> Valor consolidado das sub-etapas
                        </p>
                    )}
                </section>

                <section>
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <ListTodo className="w-4 h-4 text-blue-500" /> Sub-etapas
                    </h4>

                    <div className="space-y-3 mb-4">
                        {selectedTask.subtasks?.map(sub => (
                            <div key={sub.id} className="bg-white p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <button onClick={() => toggleSubtask(selectedTask.id, sub.id)} className="mt-0.5">
                                            {sub.completed
                                                ? <CheckSquare className="w-4 h-4 text-green-500" />
                                                : <div className="w-4 h-4 border-2 border-slate-300 rounded-[3px] group-hover:border-blue-400 transition-colors" />
                                            }
                                        </button>
                                        <span className={`text-sm font-medium break-words ${sub.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                                            {sub.text}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => deleteSubtask(selectedTask.id, sub.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-2 ml-7 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit focus-within:border-blue-300 transition-all">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">R$</span>
                                    <input 
                                        type="text"
                                        inputMode="numeric"
                                        value={formatCurrency(sub.spent)}
                                        onChange={(e) => handleSubtaskSpentChange(sub.id, e.target.value)}
                                        className="text-[12px] font-black text-blue-600 bg-transparent border-none p-0 w-24 focus:ring-0"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSubtask(selectedTask.id)}
                            placeholder="Adicionar sub-etapa..."
                            className="flex-1 text-xs border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <button onClick={() => addSubtask(selectedTask.id)} className="px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-black text-xs font-bold transition-all active:scale-95">
                            Add
                        </button>
                    </div>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-amber-500" /> Notas & Comentários
                    </h4>

                    <div className="space-y-3 mb-4">
                        {selectedTask.comments?.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Nenhum comentário ainda.</p>
                        ) : (
                            selectedTask.comments?.map(comment => (
                                <div key={comment.id} className={`group bg-white p-3 rounded-lg border border-slate-100 shadow-sm relative ${comment.author === currentUser ? 'border-l-2 border-l-blue-400' : 'border-l-2 border-l-pink-400'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-700">{comment.author}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400">{comment.date}</span>
                                            <button 
                                                onClick={() => deleteComment(selectedTask.id, comment.id)}
                                                className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600">{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex gap-2 items-start bg-white p-1 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm transition-all">
                        <textarea
                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                            placeholder={`Escreva algo como ${currentUser}...`}
                            className="flex-1 text-xs px-2 py-2 focus:outline-none resize-none h-12 bg-transparent"
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(selectedTask.id); } }}
                        />
                        <button onClick={() => addComment(selectedTask.id)} className="mt-1 mr-1 p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                            <SendHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
