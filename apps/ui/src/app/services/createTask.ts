import { CreateTask } from "../types/task";
import { User } from "../types/user";

type CreateTaskParams = {
  addTaskData: CreateTask;
  user: User | null;
};

export async function createTask({ addTaskData, user }: CreateTaskParams) {
  if (!user) {
    throw new Error("User is not logged in");
  }

  try {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify(addTaskData),
    });

    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.status}`);
    }

    const data = await res.json();
    console.log("Response:", data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
