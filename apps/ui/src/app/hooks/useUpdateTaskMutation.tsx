import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../services/updateTask";
import { Task } from "../types/task";

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask: Task) => {
      queryClient.setQueryData(["userTasks"], (oldData: Task[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      });
    },
  });
}
