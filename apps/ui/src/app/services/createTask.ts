import { CreateTask } from "../types/task";
import { User } from "../types/user";

type CreateTaskParams = {
  addTaskData: CreateTask;
  user: User | null;
  tokenGoogle?: string | null;
};

export async function createTask({
  addTaskData,
  user,
  tokenGoogle,
}: CreateTaskParams) {
  const token = user?.accessToken || tokenGoogle;
  console.log(tokenGoogle);
  try {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addTaskData),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // Throw the actual Nest error response
      throw data || new Error(`Failed to create task: ${res.status}`);
    }

    console.log("Response:", data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
