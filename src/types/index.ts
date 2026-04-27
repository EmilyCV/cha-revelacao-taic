export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
  spent?: number; // Valor gasto nesta sub-etapa
}

export interface Task {
  id: string;
  text: string;
  deadline: string;
  category: string;
  completed: boolean;
  subtasks: Subtask[];
  comments: Comment[];
  budget?: number; // Orçamento total planejado para a missão
  spent?: number;  // Valor gasto total (pode ser a soma das subtasks)
}

export interface Guest {
  id: string;
  name: string;
}