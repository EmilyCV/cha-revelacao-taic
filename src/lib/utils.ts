import { Task } from "@/types";

/**
 * Converte uma string YYYY-MM-DD para um objeto Date local
 * sem sofrer interferência de fuso horário (UTC).
 */
export const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const daysUntil = (dateStr: string) => {
    const target = parseLocalDate(dateStr);
    target.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};

export const getDeadlineColor = (dateStr: string) => {
    const days = daysUntil(dateStr);
    
    // Lógica de cores baseada na proximidade (em dias)
    if (days < 0) {
        return 'bg-red-500 text-white font-black shadow-sm'; // Atrasado (Vermelho forte)
    }
    if (days === 0) {
        return 'bg-red-600 text-white font-black animate-pulse'; // É HOJE!
    }
    if (days <= 3) {
        return 'bg-orange-500 text-white font-bold shadow-sm'; // Urgente (Laranja)
    }
    if (days <= 7) {
        return 'bg-amber-400 text-amber-950 font-bold'; // Atenção (Amarelo/Âmbar)
    }
    if (days <= 15) {
        return 'bg-blue-100 text-blue-700 font-semibold border border-blue-200'; // Planejado (Azul claro)
    }
    
    return 'bg-slate-100 text-slate-600 font-medium border border-slate-200'; // Tranquilo (Cinza)
};

export const formatDisplayDate = (dateStr: string) => {
    try {
        const date = parseLocalDate(dateStr);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateStr;
    }
};
