"use client";

import { Task } from "@/types";
import { getDeadlineColor, formatCurrency, parseCurrencyInput } from "@/lib/utils";
import {
    Clock, Trash2, X, ListTodo, CheckSquare,
    MessageSquare, SendHorizontal, Gamepad2, Tag,
    Wallet, ArrowLeft
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

const CATEGORY_SUGGESTIONS = ["Geral", "Lugar", "Tema", "Decoração", "Comida"];


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
                <p className="text-slate-500 font-medium text-sm">Selecione uma missão na lista para ver detalhes e gerenciar sub-etapas.</p>
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
        <div className="bg-white md:rounded-xl shadow-lg border-x md:border border-blue-100 h-full flex flex-col overflow-hidden md:sticky md:top-6 animate-in slide-in-from-right md:slide-in-from-transparent duration-300">
            {/* Cabeçalho do Detalhe */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-blue-50/50 to-white flex justify-between items-start sticky top-0 z-10 backdrop-blur-md">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Botão de Voltar Visível Apenas no Mobile */}
                        <button
                            onClick={() => setSelectedTask(null)}
                            className="md:hidden p-2 -ml-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Gestão da Missão</span>
                    </div>

                    <h3 className="font-black text-slate-800 leading-tight break-words text-lg">{selectedTask.text}</h3>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                            <Clock className={`w-3.5 h-3.5 ${getDeadlineColor(selectedTask.deadline, 'text')}`} />
                            <input
                                type="date"
                                value={selectedTask.deadline}
                                onChange={(e) => updateTaskDeadline(selectedTask.id, e.target.value)}
                                className={`text-xs bg-transparent border-none focus:ring-0 p-0 cursor-pointer font-bold ${getDeadlineColor(selectedTask.deadline, 'text')}`}
                            />
                        </div>

                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm group">
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

                    {/* Sugestões de Categoria - Novo UI de Toque Rápido */}
                    <div className="flex gap-1.5 mt-4 overflow-x-auto no-scrollbar pb-1">
                        {CATEGORY_SUGGESTIONS.map(cat => (
                            <button
                                key={cat}
                                onClick={() => updateTaskCategory(selectedTask.id, cat)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                                    selectedTask.category === cat
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => { if (confirm('Excluir esta missão permanentemente?')) deleteTask(selectedTask.id) }}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-slate-50/20 pb-20 md:pb-4">

                {/* Seção Financeira */}
                <section className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Gasto Total</h4>
                        </div>
                        {hasSubtaskCosts && (
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-100">
                                <span className="text-[9px] font-black uppercase tracking-tighter">Automático</span>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">R$</div>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatCurrency(selectedTask.spent)}
                            readOnly={hasSubtaskCosts}
                            onChange={handleMainSpentChange}
                            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 text-3xl font-black transition-all outline-none ${hasSubtaskCosts
                                    ? 'border-blue-50 text-blue-600 cursor-not-allowed'
                                    : 'border-slate-50 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50'
                                }`}
                        />
                    </div>
                </section>

                {/* Sub-etapas */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                            <ListTodo className="w-4 h-4 text-blue-500" /> Sub-etapas
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {selectedTask.subtasks?.length || 0} itens
                        </span>
                    </div>

                    <div className="space-y-3 mb-6">
                        {selectedTask.subtasks?.map(sub => (
                            <div key={sub.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <button onClick={() => toggleSubtask(selectedTask.id, sub.id)} className="mt-0.5 transition-transform active:scale-90">
                                            {sub.completed
                                                ? <CheckSquare className="w-5 h-5 text-green-500" />
                                                : <div className="w-5 h-5 border-2 border-slate-200 rounded-lg group-hover:border-blue-400 transition-colors" />
                                            }
                                        </button>
                                        <span className={`text-sm font-bold break-words leading-tight ${sub.completed ? 'line-through text-slate-300' : 'text-slate-600'}`}>
                                            {sub.text}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteSubtask(selectedTask.id, sub.id)}
                                        className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 ml-8 bg-slate-50 px-3 py-2 rounded-xl border border-slate-50 w-fit focus-within:border-blue-200 transition-all">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">R$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatCurrency(sub.spent)}
                                        onChange={(e) => handleSubtaskSpentChange(sub.id, e.target.value)}
                                        className="text-sm font-black text-blue-600 bg-transparent border-none p-0 w-24 focus:ring-0"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <input
                            type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSubtask(selectedTask.id)}
                            placeholder="Nova sub-etapa..."
                            className="flex-1 text-sm border-none bg-transparent px-4 py-3 focus:outline-none"
                        />
                        <button onClick={() => addSubtask(selectedTask.id)} className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-black font-black text-xs transition-all active:scale-95">
                            Add
                        </button>
                    </div>
                </section>

                {/* Comentários */}
                <section>
                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-amber-500" /> Notas
                    </h4>

                    <div className="space-y-3 mb-6">
                        {selectedTask.comments?.map(comment => (
                            <div key={comment.id} className={`group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden ${comment.author === currentUser ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-pink-500'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{comment.author}</span>
                                    <button
                                        onClick={() => deleteComment(selectedTask.id, comment.id)}
                                        className="p-1 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">{comment.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 items-end bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-blue-50/50 transition-all">
                        <textarea
                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escrever nota..."
                            className="flex-1 text-sm px-3 py-2 focus:outline-none resize-none h-14 bg-transparent font-medium"
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(selectedTask.id); } }}
                        />
                        <button onClick={() => addComment(selectedTask.id)} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-90">
                            <SendHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
