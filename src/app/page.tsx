"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DashboardMetrics from '@/components/DashboardMetrics';
import TaskBoard from '@/components/TaskBoard';
import TaskDetails from '@/components/TaskDetails';
import GuestList from '@/components/GuestList';
import { Task, Guest } from '@/types';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth, googleProvider } from '@/lib/firebase';
import { Gamepad2, AlertCircle, LogIn, Users, LayoutDashboard } from 'lucide-react';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [authError, setAuthError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const [activeTab, setActiveTab] = useState<'tasks' | 'guests'>('tasks');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [eventDate, setEventDate] = useState('2026-06-20');
    const [newTask, setNewTask] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [currentUser, setCurrentUser] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setIsMounted(true);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const email = currentUser.email?.toLowerCase();
                if (email) {
                    // Verifica no banco se o usuário existe na coleção de autorizados
                    try {
                        const userDoc = await getDoc(doc(db, 'allowed_users', email));
                        if (userDoc.exists()) {
                            setUser(currentUser);
                            setCurrentUser(userDoc.data().name || 'Organizador');
                            setAuthError('');
                        } else {
                            await signOut(auth);
                            setAuthError('Este e-mail não está na lista de organizadores autorizados.');
                            setUser(null);
                        }
                    } catch (e: unknown) {
                        console.error("Erro detalhado do Firebase:", e);
                        await signOut(auth);
                        const error = e as { code?: string; message?: string };
                        if (error.code === 'permission-denied') {
                            setAuthError('O banco de dados do Firebase recusou seu acesso. Verifique se as "Rules" foram publicadas.');
                        } else {
                            setAuthError(`Erro técnico: ${error.message || 'Desconhecido'}`);
                        }
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
                setIsLoggingOut(false);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        setAuthError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Erro no login:", error);
            setAuthError('Falha ao tentar fazer login com o Google.');
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro no logout:", error);
            setIsLoggingOut(false);
        }
    };

    // --- Firebase: Leitura em Tempo Real ---
    useEffect(() => {
        if (!user) return;

        const qTasks = query(collection(db, 'tasks'));
        const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
            setTasks(tasksData);
        });

        const qGuests = query(collection(db, 'guests'));
        const unsubscribeGuests = onSnapshot(qGuests, (snapshot) => {
            const guestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Guest[];
            setGuests(guestsData);
        });

        const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
            if (docSnap.exists() && docSnap.data().eventDate) {
                setEventDate(docSnap.data().eventDate);
            }
        });

        return () => {
            unsubscribeTasks();
            unsubscribeGuests();
            unsubSettings();
        };
    }, [user]);

    // ... (restante das funções addTask, toggleTask, etc permanecem iguais)

    useEffect(() => {
        if (selectedTask) {
            const updated = tasks.find(t => t.id === selectedTask.id);
            if (updated) setSelectedTask(updated);
            else setSelectedTask(null);
        }
    }, [tasks, selectedTask?.id]);

    const handleSetEventDate = async (newDate: string) => {
        await setDoc(doc(db, 'settings', 'general'), { eventDate: newDate }, { merge: true });
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const taskData = { text: newTask, deadline: eventDate, category: "Geral", completed: false, subtasks: [], comments: [] };
        await addDoc(collection(db, 'tasks'), taskData);
        setNewTask('');
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) await updateDoc(doc(db, 'tasks', id), { completed: !task.completed });
    };

    const deleteTask = async (id: string) => {
        await deleteDoc(doc(db, 'tasks', id));
        if (selectedTask?.id === id) setSelectedTask(null);
    };

    const updateTaskSpent = async (taskId: string, newSpent: number) => {
        await updateDoc(doc(db, 'tasks', taskId), { spent: newSpent });
    };

    const updateSubtaskSpent = async (taskId: string, subId: string, newSpent: number) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const updatedSubs = task.subtasks.map(s => s.id === subId ? { ...s, spent: newSpent } : s);
            const totalSpent = updatedSubs.reduce((acc, curr) => acc + (curr.spent || 0), 0);
            await updateDoc(doc(db, 'tasks', taskId), {
                subtasks: updatedSubs,
                spent: totalSpent
            });
        }
    };

    const addSubtask = async (taskId: string) => {
        if (!newSubtask.trim()) return;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const newSub = { id: Date.now().toString(), text: newSubtask, completed: false, spent: 0 };
            const updatedSubs = [...task.subtasks, newSub];
            await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubs });
            setNewSubtask('');
        }
    };

    const toggleSubtask = async (taskId: string, subId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const updatedSubs = task.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
            await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubs });
        }
    };

    const updateSubtaskText = async (taskId: string, subId: string, newText: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const updatedSubs = task.subtasks.map(s => s.id === subId ? { ...s, text: newText } : s);
            await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubs });
        }
    };

    const deleteSubtask = async (taskId: string, subId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const updatedSubs = task.subtasks.filter(s => s.id !== subId);
            // Recalcula o total ao deletar
            const totalSpent = updatedSubs.reduce((acc, curr) => acc + (curr.spent || 0), 0);
            await updateDoc(doc(db, 'tasks', taskId), {
                subtasks: updatedSubs,
                spent: totalSpent
            });
        }
    };

    const addComment = async (taskId: string) => {
        if (!newComment.trim()) return;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const comment = { id: Date.now().toString(), author: currentUser, text: newComment, date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) };
            await updateDoc(doc(db, 'tasks', taskId), { comments: [...task.comments, comment] });
            setNewComment('');
        }
    };

    const deleteComment = async (taskId: string, commentId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const updatedComments = task.comments.filter(c => c.id !== commentId);
            await updateDoc(doc(db, 'tasks', taskId), { comments: updatedComments });
        }
    };

    const updateTaskDeadline = async (taskId: string, newDate: string) => {
        await updateDoc(doc(db, 'tasks', taskId), { deadline: newDate });
    };

    const updateTaskCategory = async (taskId: string, newCategory: string) => {
        await updateDoc(doc(db, 'tasks', taskId), { category: newCategory });
    };

    const updateTaskText = async (taskId: string, newText: string) => {
        await updateDoc(doc(db, 'tasks', taskId), { text: newText });
    };

    // --- Guest List Actions ---
    const addGuest = async (name: string) => {
        await addDoc(collection(db, 'guests'), { name });
    };

    const updateGuestName = async (id: string, newName: string) => {
        await updateDoc(doc(db, 'guests', id), { name: newName });
    };

    const deleteGuest = async (id: string) => {
        await deleteDoc(doc(db, 'guests', id));
    };

    const deleteMultipleGuests = async (ids: string[]) => {
        const batch = writeBatch(db);
        ids.forEach(id => {
            batch.delete(doc(db, 'guests', id));
        });
        await batch.commit();
    };

    if (!isMounted) return <div className="min-h-screen bg-slate-50" />;

    if (authLoading || isLoggingOut) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Validando credenciais...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-white">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                        <Gamepad2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Acesso Restrito</h1>
                    <p className="text-slate-500 mb-8 text-sm px-4">Utilize um e-mail autorizado para gerenciar o Chá Revelação.</p>

                    {authError && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-start gap-3 text-left">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="font-medium">{authError}</p>
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02]"
                    >
                        <LogIn className="w-6 h-6" />
                        Acessar com Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            <Header
                currentUser={currentUser}
                eventDate={eventDate}
                setEventDate={handleSetEventDate}
                onLogout={handleLogout}
            />
            <DashboardMetrics tasks={tasks} eventDate={eventDate} />

            <div className="w-full max-w-6xl mx-auto px-4 mt-6">
                <div className="flex bg-slate-200/50 p-1 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'tasks'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" /> Missões
                    </button>
                    <button
                        onClick={() => setActiveTab('guests')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'guests'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Users className="w-4 h-4" /> Convidados
                    </button>
                </div>
            </div>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
                {activeTab === 'tasks' ? (
                    <div className="flex flex-col md:flex-row gap-6 h-full relative">
                        {/* No mobile, esconde a lista se houver uma tarefa selecionada para dar foco total ao detalhe */}
                        <div className={`flex-1 flex flex-col gap-4 ${selectedTask ? 'hidden md:flex' : 'flex'}`}>
                            <TaskBoard tasks={tasks} newTask={newTask} setNewTask={setNewTask} addTask={addTask} toggleTask={toggleTask} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                        </div>

                        {/* Detalhes da Missão - Agora se comporta como um Drawer/Modal no mobile */}
                        <div className={`
                            ${selectedTask ? 'fixed inset-0 z-50 bg-white' : 'hidden md:block opacity-50 pointer-events-none'} 
                            md:relative md:inset-auto md:z-0 md:bg-transparent
                            md:w-[400px] lg:w-[450px] shrink-0 transition-all duration-300 ease-in-out
                        `}>
                            <TaskDetails 
                                selectedTask={selectedTask} 
                                setSelectedTask={setSelectedTask} 
                                deleteTask={deleteTask} 
                                updateTaskText={updateTaskText}
                                updateTaskDeadline={updateTaskDeadline} 
                                updateTaskCategory={updateTaskCategory} 
                                updateTaskSpent={updateTaskSpent}
                                updateSubtaskSpent={updateSubtaskSpent}
                                updateSubtaskText={updateSubtaskText}
                                newSubtask={newSubtask} 
                                setNewSubtask={setNewSubtask} 
                                addSubtask={addSubtask} 
                                toggleSubtask={toggleSubtask} 
                                deleteSubtask={deleteSubtask} 
                                newComment={newComment} 
                                setNewComment={setNewComment} 
                                addComment={addComment} 
                                deleteComment={deleteComment} 
                                currentUser={currentUser} 
                            />
                        </div>
                    </div>
                ) : (                    <GuestList
                        guests={guests}
                        addGuest={addGuest}
                        updateGuestName={updateGuestName}
                        deleteGuest={deleteGuest}
                        deleteMultipleGuests={deleteMultipleGuests}
                    />
                )}
            </main>
        </div>
    );
}
