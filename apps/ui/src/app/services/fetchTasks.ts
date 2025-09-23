import { Task } from "../types/task";

export const fetchTasks = async (): Promise<Task[]> => {
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  if (!userObj?.accessToken) {
    throw new Error("No token found in localStorage");
  }
  const token = userObj.accessToken;

  const res = await fetch("http://localhost:3000/tasks/userstasks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
};
