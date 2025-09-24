export type Task = {
  id: string;
  title: string;
  description?: string;
};

export interface CreateTask {
  title: string;
  description: string;
}
