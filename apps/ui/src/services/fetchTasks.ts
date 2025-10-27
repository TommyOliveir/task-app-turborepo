import { ITask } from "@/types/task";

export const fetchTasks = async (): Promise<ITask[]> => {
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const tokenGoogleUser = localStorage.getItem("TokenGoogleUser");

  if (!userObj?.accessToken && !tokenGoogleUser) {
    throw new Error("No token found in localStorage");
  }
  const token = userObj.accessToken || tokenGoogleUser;

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
