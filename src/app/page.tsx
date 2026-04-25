"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DashboardMetrics from '@/components/DashboardMetrics';
import TaskBoard from '@/components/TaskBoard';
import TaskDetails from '@/components/TaskDetails';
import { Task } from '@/types';
import { initialTasks } from '@/lib/mock-data';

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [eventDate, setEventDate] = useState('2026-06-20');
    const [newTask, setNewTask] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [currentUser, setCurrentUser] = useState('Emily');
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedTasks = localStorage.getItem('@superChaRevelacao:tasks');
        const savedDate = localStorage.getItem('@superChaRevelacao:eventDate');
        
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks));
            } catch (e) {
                setTasks(initialTasks);
            }
        } else {
            setTasks(initialTasks);
        }

        if (savedDate) {
            setEventDate(savedDate);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('@superChaRevelacao:tasks', JSON.stringify(tasks));
            localStorage.setItem('@superChaRevelacao:eventDate', eventDate);
        }
    }, [tasks, eventDate, isMounted]);

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task: Task = {
            id: Date.now().toString(),
            text: newTask,
            deadline: eventDate,
            category: "Geral",
            completed: false,
            subtasks: [],
            comments: []
        };
        setTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setTasks(updatedTasks);
        if (selectedTask?.id === id) {
            setSelectedTask({ ...selectedTask, completed: !selectedTask.completed });
        }
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
        if (selectedTask?.id === id) setSelectedTask(null);
    };

    const addSubtask = (taskId: string) => {
        if (!newSubtask.trim()) return;
        const subtask = { id: Date.now().toString(), text: newSubtask, completed: false };
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                const updated = { ...t, subtasks: [...t.subtasks, subtask] };
                setSelectedTask(updated);
                return updated;
            }
            return t;
        });
        setTasks(updatedTasks);
        setNewSubtask('');
    };

    const toggleSubtask = (taskId: string, subId: string) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                const updatedSubs = t.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
                const updated = { ...t, subtasks: updatedSubs };
                setSelectedTask(updated);
                return updated;
            }
            return t;
        });
        setTasks(updatedTasks);
    };

    const addComment = (taskId: string) => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now().toString(),
            author: currentUser,
            text: newComment,
            date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        };
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                const updated = { ...t, comments: [...t.comments, comment] };
                setSelectedTask(updated);
                return updated;
            }
            return t;
        });
        setTasks(updatedTasks);
        setNewComment('');
    };

    const updateTaskDeadline = (taskId: string, newDate: string) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                const updated = { ...t, deadline: newDate };
                setSelectedTask(updated);
                return updated;
            }
            return t;
        });
        setTasks(updatedTasks);
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            <Header 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
                eventDate={eventDate}
                setEventDate={setEventDate}
            />
            <DashboardMetrics tasks={tasks} eventDate={eventDate} />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-4">
                    <TaskBoard
                        tasks={tasks}
                        newTask={newTask}
                        setNewTask={setNewTask}
                        addTask={addTask}
                        toggleTask={toggleTask}
                        selectedTask={selectedTask}
                        setSelectedTask={setSelectedTask}
                    />
                </div>

                <div className={`md:w-[400px] lg:w-[450px] shrink-0 transition-all duration-300 ease-in-out ${selectedTask ? 'block' : 'hidden md:block opacity-50 pointer-events-none'}`}>
                    <TaskDetails
                        selectedTask={selectedTask}
                        setSelectedTask={setSelectedTask}
                        deleteTask={deleteTask}
                        updateTaskDeadline={updateTaskDeadline}
                        newSubtask={newSubtask}
                        setNewSubtask={setNewSubtask}
                        addSubtask={addSubtask}
                        toggleSubtask={toggleSubtask}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        addComment={addComment}
                        currentUser={currentUser}
                    />
                </div>
            </main>
        </div>
    );
}
