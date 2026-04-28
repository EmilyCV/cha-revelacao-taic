"use client";

import { useState } from "react";
import { Task } from "@/types";
import { getDeadlineColor, formatDisplayDate } from "@/lib/utils";
import {
    CheckCircle2, Circle, Clock, MessageSquare,
    ChevronRight, Plus, Star, CheckSquare, DollarSign,
    Filter
} from 'lucide-react';

interface TaskBoardProps {
    tasks: Task[];
    newTask: string;
    setNewTask: (val: string) => void;
    addTask: (e: React.FormEvent) => void;
    toggleTask: (id: string) => void;
    selectedTask: Task | null;
    setSelectedTask: (task: Task) => void;
}

type FilterType = 'all' | 'open' | 'closed';

export default function TaskBoard({
    tasks,
    newTask,
    setNewTask,
    addTask,
    toggleTask,
    selectedTask,
    setSelectedTask
}: TaskBoardProps) {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredTasks = tasks.filter(task => {
        if (filter === 'open') return !task.completed;
        if (filter === 'closed') return task.completed;
        return true;
    });

    const openCount = tasks.filter(t => !t.completed).length;
    const closedCount = tasks.filter(t => t.completed).length;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[calc(100vh-280px)] md:max-h-[700px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4 shrink-0">
                <form onSubmit={addTask} className="flex gap-2">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Adicionar nova macro-tarefa..."
                        className="flex-1 text-sm border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm"
                    />
                    <button type="submit" className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 font-bold shadow-sm transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Adicionar
                    </button>
                </form>

                <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl w-full">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all ${
                            filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Todas <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{tasks.length}</span>
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all ${
                            filter === 'open' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Em Aberto <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px]">{openCount}</span>
                    </button>
                    <button
                        onClick={() => setFilter('closed')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all ${
                            filter === 'closed' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Concluídas <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px]">{closedCount}</span>
                    </button>
                </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredTasks.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        <Star className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                        <p>
                            {filter === 'open' ? 'Nenhuma missão em aberto no momento!' : 
                             filter === 'closed' ? 'Nenhuma missão foi concluída ainda.' :
                             'O reino está vazio. Adicione sua primeira missão!'}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const isSelected = selectedTask?.id === task.id;
                        const totalSubs = task.subtasks?.length || 0;
                        const completedSubs = task.subtasks?.filter(s => s.completed).length || 0;
                        const hasComments = task.comments?.length > 0;

                        return (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                className={`group flex items-start gap-4 p-4 cursor-pointer transition-all border-l-4 ${isSelected ? 'bg-blue-50/50 border-blue-500' :
                                        task.completed ? 'hover:bg-slate-50 border-transparent opacity-60' : 'hover:bg-slate-50 border-transparent'
                                    }`}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                    className="mt-0.5 shrink-0"
                                >
                                    {task.completed
                                        ? <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                                        : <Circle className="w-5 h-5 text-slate-300 group-hover:text-red-400 transition-colors" />
                                    }
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                        {task.text}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {task.category}
                                        </span>

                                        {totalSubs > 0 && (
                                            <span className={`text-[10px] flex items-center gap-1 font-bold px-2 py-0.5 rounded ${completedSubs === totalSubs ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                <CheckSquare className="w-3 h-3" /> {completedSubs}/{totalSubs}
                                            </span>
                                        )}

                                        {hasComments && (
                                            <span className="text-[10px] flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                                <MessageSquare className="w-3 h-3" /> {task.comments.length}
                                            </span>
                                        )}

                                        {(task.spent || 0) > 0 && (
                                            <span className="text-[10px] flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                                                <DollarSign className="w-3 h-3" /> R$ {task.spent?.toFixed(2)}
                                            </span>
                                        )}

                                        <span className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded ${getDeadlineColor(task.deadline)}`}>
                                            <Clock className="w-3 h-3" />
                                            {formatDisplayDate(task.deadline)}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${isSelected ? 'translate-x-1 text-blue-500' : ''}`} />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
