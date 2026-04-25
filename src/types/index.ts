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
}

export interface Task {
  id: string;
  text: string;
  deadline: string;
  category: string;
  completed: boolean;
  subtasks: Subtask[];
  comments: Comment[];
}