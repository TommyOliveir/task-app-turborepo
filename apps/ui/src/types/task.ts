export interface ITask {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
}

export interface ICreateTask {
  title: string;
  description: string;
}
