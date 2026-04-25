"use client";

import { useRef } from "react";
import { Calendar, Gamepad2, Edit2 } from "lucide-react";
import { formatDisplayDate } from "@/lib/utils";

interface HeaderProps {
    currentUser: string;
    setCurrentUser: (user: string) => void;
    eventDate: string;
    setEventDate: (date: string) => void;
}

export default function Header({ currentUser, setCurrentUser, eventDate, setEventDate }: HeaderProps) {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        if (dateInputRef.current) {
            // Tenta abrir o seletor nativo de forma programática (moderno)
            if ('showPicker' in HTMLInputElement.prototype) {
                try {
                    dateInputRef.current.showPicker();
                } catch (e) {
                    dateInputRef.current.focus();
                }
            } else {
                // Fallback para navegadores mais antigos
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
                        
                        {/* Input escondido mas funcional via Ref */}
                        <input 
                            ref={dateInputRef}
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                        />
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-red-800/40 p-1.5 rounded-lg backdrop-blur-sm border border-red-500/30">
                    <span className="text-xs font-semibold px-2">Logado como:</span>
                    {['Emily', 'Daniela'].map(name => (
                        <button
                            key={name}
                            onClick={() => setCurrentUser(name)}
                            className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${currentUser === name ?
                                    'bg-white text-red-700 shadow-sm' : 'text-red-100 hover:bg-red-800/50'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}
