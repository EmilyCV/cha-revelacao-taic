"use client";

import { AlertCircle } from "lucide-react";
import { Task } from "@/types";
import { daysUntil } from "@/lib/utils";

interface DashboardProps {
    tasks: Task[];
    eventDate: string;
}

export default function DashboardMetrics({ tasks, eventDate }: DashboardProps) {
    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed).length;
        return Math.round((completed / tasks.length) * 100);
    };

    const urgentTasksCount = tasks.filter(t => !t.completed && daysUntil(t.deadline) < 5).length;

    return (
        <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-slate-100">
                <div className="px-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status do Evento</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-800">{calculateProgress()}%</span>
                        <span className="text-sm text-slate-400 mb-1">concluído</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
                    </div>
                </div>
                <div className="px-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Contagem Regressiva</p>
                    <p className="text-2xl font-black text-blue-600 flex items-center gap-2">
                        {daysUntil(eventDate)} <span className="text-sm font-medium text-slate-400">dias</span>
                    </p>
                </div>
                <div className="px-4 hidden md:block">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tarefas Ativas</p>
                    <p className="text-2xl font-black text-slate-800">{tasks.filter(t => !t.completed).length}</p>
                </div>
                <div className="px-4 hidden md:block">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Avisos</p>
                    {urgentTasksCount > 0 ? (
                        <p className="text-sm font-medium text-red-600 flex items-center gap-1 mt-2">
                            <AlertCircle className="w-4 h-4" /> {urgentTasksCount} tarefa(s) urgente(s)!
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-green-600 flex items-center gap-1 mt-2">
                            Sem avisos no momento.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
