"use client";

import { Task } from "@/types";
import { getDeadlineColor } from "@/lib/utils";
import {
    Clock, Trash2, X, ListTodo, CheckSquare,
    MessageSquare, Sparkles, Gamepad2
} from 'lucide-react';

interface TaskDetailsProps {
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    deleteTask: (id: string) => void;
    updateTaskDeadline: (taskId: string, newDate: string) => void;
    newSubtask: string;
    setNewSubtask: (val: string) => void;
    addSubtask: (taskId: string) => void;
    toggleSubtask: (taskId: string, subId: string) => void;
    newComment: string;
    setNewComment: (val: string) => void;
    addComment: (taskId: string) => void;
    currentUser: string;
}

export default function TaskDetails({
    selectedTask,
    setSelectedTask,
    deleteTask,
    updateTaskDeadline,
    newSubtask,
    setNewSubtask,
    addSubtask,
    toggleSubtask,
    newComment,
    setNewComment,
    addComment,
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

    return (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 h-[70vh] flex flex-col overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-white flex justify-between items-start">
                <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">Detalhes da Missão</span>
                    <h3 className="font-bold text-slate-800 leading-tight">{selectedTask.text}</h3>
                    <div className="flex items-center gap-1 mt-2">
                        <Clock className={`w-3 h-3 ${getDeadlineColor(selectedTask.deadline)}`} />
                        <input
                            type="date"
                            value={selectedTask.deadline}
                            onChange={(e) => updateTaskDeadline(selectedTask.id, e.target.value)}
                            className={`text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer transition-colors ${getDeadlineColor(selectedTask.deadline)}`}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => deleteTask(selectedTask.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Deletar">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSelectedTask(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md md:hidden transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
                <section>
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <ListTodo className="w-4 h-4 text-blue-500" /> Sub-etapas
                    </h4>

                    <div className="space-y-2 mb-3">
                        {selectedTask.subtasks?.map(sub => (
                            <div key={sub.id} className="flex items-start gap-3 group">
                                <button onClick={() => toggleSubtask(selectedTask.id, sub.id)} className="mt-0.5">
                                    {sub.completed
                                        ? <CheckSquare className="w-4 h-4 text-green-500" />
                                        : <div className="w-4 h-4 border-2 border-slate-300 rounded-[3px] group-hover:border-blue-400 transition-colors" />
                                    }
                                </button>
                                <span className={`text-sm ${sub.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                                    {sub.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSubtask(selectedTask.id)}
                            placeholder="Adicionar sub-etapa..."
                            className="flex-1 text-xs border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button onClick={() => addSubtask(selectedTask.id)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 text-xs font-bold">
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
                                <div key={comment.id} className={`bg-white p-3 rounded-lg border border-slate-100 shadow-sm ${comment.author === currentUser ? 'border-l-2 border-l-blue-400' : 'border-l-2 border-l-pink-400'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-700">{comment.author}</span>
                                        <span className="text-[10px] text-slate-400">{comment.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600">{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex gap-2 items-start bg-white p-1 rounded-lg border border-slate-200 focus-within:ring-1 focus-within:ring-blue-500">
                        <textarea
                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                            placeholder={`Escreva algo como ${currentUser}...`}
                            className="flex-1 text-xs px-2 py-2 focus:outline-none resize-none h-12 bg-transparent"
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(selectedTask.id); } }}
                        />
                        <button onClick={() => addComment(selectedTask.id)} className="mt-1 mr-1 p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
