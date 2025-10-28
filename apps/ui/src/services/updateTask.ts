import { ITask } from "@/types/task";
import { IUser } from "@/types/user";

type UpdateTaskParams = {
  taskId: string | undefined;
  updatedData: Partial<ITask>;
  user: IUser | null;
  tokenGoogle: String | null;
};

export const updateTask = async ({
  taskId,
  updatedData,
  user,
  tokenGoogle,
}: UpdateTaskParams) => {
  const token = user?.accessToken || tokenGoogle;

  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
