import { Task } from "@/types";

export const initialTasks: Task[] = [
    {
        id: '1', text: "Fechar orçamento total", deadline: "2026-04-25", category: "Base", completed: true,
        subtasks: [
            { id: '1-1', text: 'Cotar salões na região', completed: true },
            { id: '1-2', text: 'Definir limite de gastos', completed: true }
        ],
        comments: [
            { id: 'c1', author: 'Emily', text: 'Acho que podemos focar em algo mais intimista.', date: '22/04/2026 10:00' }
        ]
    },
    {
        id: '2', text: "Escolher e reservar local", deadline: "2026-05-02", category: "Lugar", completed: false,
        subtasks: [
            { id: '2-1', text: 'Checar se tem cobertura em caso de chuva', completed: false },
            { id: '2-2', text: 'Verificar tomadas para o som/revelação', completed: false }
        ],
        comments: []
    },
    {
        id: '3', text: "Itens Tema Mario", deadline: "2026-05-16", category: "Tema", completed: false,
        subtasks: [
            { id: '3-1', text: 'Comprar balões vermelhos, verdes e azuis', completed: false },
            { id: '3-2', text: 'Fazer blocos de interrogação de papelão', completed: false }
        ],
        comments: []
    }
];
