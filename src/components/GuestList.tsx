"use client";

import { useState } from "react";
import { Guest } from "@/types";
import {
    Users, Plus, Search, Trash2,
    SortAsc, UserPlus, Edit2, Check, X,
    CheckSquare, Square
} from "lucide-react";

interface GuestListProps {
    guests: Guest[];
    addGuest: (name: string) => void;
    updateGuestName: (id: string, newName: string) => void;
    deleteGuest: (id: string) => void;
    deleteMultipleGuests: (ids: string[]) => void;
}

export default function GuestList({ guests, addGuest, updateGuestName, deleteGuest, deleteMultipleGuests }: GuestListProps) {
    const [newName, setNewName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingIdValue] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredGuests = guests
        .filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        addGuest(newName.trim());
        setNewName("");
    };

    const startEditing = (id: string, currentName: string) => {
        setEditingId(id);
        setEditingIdValue(currentName);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingIdValue("");
    };

    const saveEditing = (id: string) => {
        if (!editingValue.trim()) return;
        updateGuestName(id, editingValue.trim());
        setEditingId(null);
    };

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredGuests.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredGuests.map(g => g.id)));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;
        if (confirm(`Deseja excluir ${selectedIds.size} convidado(s)?`)) {
            deleteMultipleGuests(Array.from(selectedIds));
            setSelectedIds(new Set());
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-1 duration-400">

            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Coluna Esquerda: Cadastro e Filtro */}
                <div className="w-full md:w-[320px] lg:w-[350px] flex flex-col gap-4 shrink-0">

                    {/* Card de Resumo Neutro */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Convidados</p>
                            <p className="text-2xl font-black text-slate-800 leading-none">{guests.length}</p>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-blue-500" /> Adicionar Nome
                        </h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Nome do convidado..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:border-blue-400 focus:bg-white transition-all outline-none"
                            />
                            <button type="submit" className="w-full bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm">
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </form>
                    </div>

                    {/* Busca */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Pesquisar na lista..."
                                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Lista Limpa */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col self-stretch min-h-[500px]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleAll}
                                className="p-1 rounded hover:bg-slate-200 transition-colors"
                                title="Selecionar todos"
                            >
                                {selectedIds.size === filteredGuests.length && filteredGuests.length > 0
                                    ? <CheckSquare className="w-5 h-5 text-blue-600" />
                                    : <Square className="w-5 h-5 text-slate-300" />
                                }
                            </button>
                            <div className="flex items-center gap-2">
                                <SortAsc className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordem Alfabética</span>
                            </div>
                        </div>

                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Excluir {selectedIds.size} selecionados
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[70vh]">
                        {filteredGuests.length === 0 ? (
                            <div className="py-20 text-center text-slate-400">
                                <p className="text-sm font-bold">Nenhum convidado encontrado.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filteredGuests.map(guest => (
                                    <div key={guest.id} className={`flex items-center justify-between p-4 transition-all group ${selectedIds.has(guest.id) ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-4 flex-1">
                                            <button
                                                onClick={() => toggleSelection(guest.id)}
                                                className="shrink-0"
                                            >
                                                {selectedIds.has(guest.id)
                                                    ? <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    : <Square className="w-5 h-5 text-slate-200 group-hover:text-slate-300" />
                                                }
                                            </button>

                                            {editingId === guest.id ? (
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={editingValue}
                                                        onChange={(e) => setEditingIdValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveEditing(guest.id);
                                                            if (e.key === 'Escape') cancelEditing();
                                                        }}
                                                        className="flex-1 bg-white border border-blue-400 rounded-lg px-3 py-1 text-sm font-bold outline-none"
                                                    />
                                                    <button onClick={() => saveEditing(guest.id)} className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={cancelEditing} className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className={`text-sm font-bold transition-colors ${selectedIds.has(guest.id) ? 'text-blue-700' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                                    {guest.name}
                                                </p>
                                            )}
                                        </div>

                                        {editingId !== guest.id && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => startEditing(guest.id, guest.name)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Editar nome"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteGuest(guest.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Excluir convidado"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
