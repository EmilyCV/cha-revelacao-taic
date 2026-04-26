"use client";

import { useRef } from "react";
import { Calendar, Gamepad2, Edit2, LogOut } from "lucide-react";
import { formatDisplayDate } from "@/lib/utils";

interface HeaderProps {
    currentUser: string;
    eventDate: string;
    setEventDate: (date: string) => void;
    onLogout?: () => void;
}

export default function Header({ currentUser, eventDate, setEventDate, onLogout }: HeaderProps) {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        if (dateInputRef.current) {
            if ('showPicker' in HTMLInputElement.prototype) {
                try {
                    dateInputRef.current.showPicker();
                } catch (e) {
                    dateInputRef.current.focus();
                }
            } else {
                dateInputRef.current.click();
            }
        }
    };

    return (
        <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md relative z-10">
            <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                        <Gamepad2 className="w-8 h-8" /> Super Chá Revelação
                    </h1>
                    
                    <button 
                        onClick={handleEditClick}
                        className="relative mt-2 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition-all cursor-pointer group"
                    >
                        <Calendar className="w-4 h-4 text-red-100" />
                        <span className="text-white text-sm font-bold tracking-wide">
                            {formatDisplayDate(eventDate)}
                        </span>
                        <Edit2 className="w-3.5 h-3.5 text-red-200 group-hover:scale-110 transition-transform" />
                        
                        <input 
                            ref={dateInputRef}
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                        />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-red-800/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-red-500/30">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-red-200 leading-none mb-1">Organizador(a)</span>
                            <span className="text-sm font-black text-white leading-none">{currentUser}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs border border-white/10">
                            {currentUser.charAt(0)}
                        </div>
                    </div>

                    {onLogout && (
                        <button 
                            onClick={onLogout}
                            className="p-2.5 bg-white/10 hover:bg-red-500 text-white rounded-xl border border-white/20 transition-all group shadow-lg"
                            title="Sair do Sistema"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
