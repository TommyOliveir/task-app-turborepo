export type Task = {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
};

export interface CreateTask {
  title: string;
  description: string;
}
