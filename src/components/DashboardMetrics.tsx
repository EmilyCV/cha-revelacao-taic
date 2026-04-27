"use client";

import { Task } from "@/types";
import { daysUntil } from "@/lib/utils";
import { Calendar, Wallet, CheckCircle2 } from "lucide-react";

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

    const totalSpent = tasks.reduce((acc, t) => acc + (t.spent || 0), 0);

    return (
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 md:relative z-20">
            <div className="max-w-6xl mx-auto px-4 py-3 flex md:grid md:grid-cols-3 gap-4 overflow-x-auto no-scrollbar md:divide-x md:divide-slate-100">
                
                {/* Progresso - Compacto no Mobile */}
                <div className="min-w-[140px] md:min-w-0 md:px-4 shrink-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Progresso
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-slate-800">{calculateProgress()}%</span>
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
                            <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
                        </div>
                    </div>
                </div>

                {/* Countdown */}
                <div className="min-w-[120px] md:min-w-0 md:px-4 shrink-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-500" /> Faltam
                    </p>
                    <p className="text-xl font-black text-blue-600 flex items-baseline gap-1">
                        {daysUntil(eventDate)} <span className="text-[10px] font-bold text-slate-400 uppercase">dias</span>
                    </p>
                </div>

                {/* Financeiro */}
                <div className="min-w-[150px] md:min-w-0 md:px-4 shrink-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-amber-500" /> Investido
                    </p>
                    <p className="text-xl font-black text-slate-800 flex items-baseline gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">R$</span> 
                        {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

            </div>
        </div>
    );
}
