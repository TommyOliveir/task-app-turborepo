export type AddTaskData = {
  title: string;
  description?: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
}
