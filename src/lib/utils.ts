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

export const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value || 0);
};

export const parseCurrencyInput = (input: string): number => {
    // Remove tudo que não for número
    const digits = input.replace(/\D/g, '');
    // Converte para decimal (centavos)
    return Number(digits) / 100;
};

export const getDeadlineColor = (dateStr: string, type: 'badge' | 'text' = 'badge') => {
    const days = daysUntil(dateStr);
    
    if (type === 'text') {
        if (days < 5) return 'text-red-600';
        if (days <= 10) return 'text-orange-600';
        return 'text-slate-500';
    }

    // < 5 dias: Vermelho
    if (days < 5) {
        return 'bg-red-500 text-white font-bold shadow-sm';
    }
    
    // 5 a 10 dias: Laranja
    if (days <= 10) {
        return 'bg-orange-500 text-white font-bold shadow-sm';
    }
    
    // > 10 dias: Cinza
    return 'bg-slate-100 text-slate-600 font-medium border border-slate-200';
};

export const formatDisplayDate = (dateStr: string) => {
    try {
        const date = parseLocalDate(dateStr);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateStr;
    }
};
