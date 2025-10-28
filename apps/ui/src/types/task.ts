export interface ITask {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
}

export type CreateTask = Pick<ITask, "title" | "description">;
