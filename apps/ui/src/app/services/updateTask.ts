import { Task } from "../types/task";
import { User } from "../types/user";

type UpdateTaskParams = {
  taskId: string | undefined;
  updatedData: Partial<Task>;
  user: User | null;
};

export const updateTask = async ({
  taskId,
  updatedData,
  user,
}: UpdateTaskParams) => {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
