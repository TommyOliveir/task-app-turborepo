"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ITask } from "../../types/task";
import { useSearchParams } from "next/navigation";
import { TaskItem } from "@/components/TaskItem";
import { useUser } from "@/context/UserContext";
import Logout from "@/components/Logout";
import { fetchTasks } from "@/services/fetchTasks";
import AddTask from "@/components/AddTask";

const ProfileClient = () => {
  const { user, setUser } = useUser();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const userDataFromUrl = searchParams.get("userGoogle");
  const parsedUser = userDataFromUrl ? JSON.parse(userDataFromUrl) : null;

  const [googleUser, setGoogleUser] = useState<string | null>(null);
  const [tokenGoogleUser, setTokenGoogleUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Handle saving token from URL - for educational purpose
      if (tokenFromUrl) {
        localStorage.setItem("TokenGoogleUser", String(tokenFromUrl));
        localStorage.setItem("googleUser", JSON.stringify(parsedUser));
      }

      // Retrieve token and user from localStorage
      const storedUser = localStorage.getItem("googleUser");
      const storedUserObj = storedUser ? JSON.parse(storedUser) : null;

      const TokenGoogleUser = localStorage.getItem("TokenGoogleUser");
      setGoogleUser(storedUserObj);
      setTokenGoogleUser(TokenGoogleUser);
    }
  }, [tokenFromUrl, parsedUser]);

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery<ITask[], Error>({
    queryKey: ["userTasks"],
    queryFn: fetchTasks,
  });

  const onTaskCreated = () => {
    setIsAddTaskOpen(false);
    setEditingTaskId(null);
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <>
      <div className="mb-6 flex p-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Hello, {user?.username || googleUser} 👋
          </h1>
          <p className="text-gray-600 mt-1">Here’s your task list for today:</p>
        </div>
        <Logout />
      </div>
      <div className="h-screen flex justify-center">
        <div className="w-1/2 m-10">
          <div className="bg-white shadow rounded-lg p-6 ">
            <div className="flex justify-between rounded-lg p-6 mb-8">
              <h2 className="font-bold my-3">Tasks</h2>
              <button
                onClick={() => setIsAddTaskOpen((prev) => !prev)}
                className={` ${
                  isAddTaskOpen ? "bg-red-500 hover:bg-red-600 " : "bg-blue-500"
                }  text-white px-4 py-2 rounded transform transition-transform duration-300 hover:bg-blue-600 cursor-pointer`}
              >
                {isAddTaskOpen ? "X" : "Add Task"}
              </button>
            </div>
            {isAddTaskOpen && !editingTaskId && (
              <AddTask onTaskCreated={onTaskCreated} />
            )}

            {tasks.length === 0 ? (
              <p className="text-gray-500 mt-3">
                No tasks yet. Enjoy your day!
              </p>
            ) : (
              <ul className="space-y-3 mt-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    editingTaskId={editingTaskId}
                    onTaskCreated={onTaskCreated}
                    setEditingTaskId={setEditingTaskId}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileClient;
