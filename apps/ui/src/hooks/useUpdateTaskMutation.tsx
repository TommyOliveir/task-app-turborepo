import { updateTask } from "@/services/updateTask";
import { ITask } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask: ITask) => {
      console.log("Updated task from mutation:", updatedTask);
      queryClient.setQueryData(
        ["userTasks"],
        (oldData: ITask[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );
    },
  });
}
