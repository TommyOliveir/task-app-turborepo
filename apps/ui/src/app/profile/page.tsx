"use client";

import { TaskItem } from "../components/TaskItem";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import AddTask from "../components/AddTask";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../services/fetchTasks";
import { Task } from "../types/task";
import Logout from "../components/Logout";
import { redirect } from "next/navigation";

const ProfilePage = () => {
  const { user } = useUser();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ["userTasks"],
    queryFn: fetchTasks,
  });

  const onTaskCreated = () => {
    setIsAddTaskOpen(false);
    setEditingTaskId(null);
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (!user?.accessToken) {
    return redirect("/login");
  }
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <>
      <div className="mb-6 flex p-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user?.username} 👋</h1>
          <p className="text-gray-600 mt-1">Here’s your task list for today:</p>
        </div>
        <Logout />
      </div>
      <div className="bg-gray-100 h-screen flex justify-center">
        <div className="w-1/2 m-10">
          <div className="bg-white shadow rounded-lg p-6 ">
            <div className="flex justify-between rounded-lg p-6 mb-8">
              <h2 className="font-bold my-3">Tasks</h2>
              <button
                onClick={() => setIsAddTaskOpen((prev) => !prev)}
                className={` ${
                  isAddTaskOpen ? "bg-red-500" : "bg-blue-500"
                } text-white px-4 py-2 rounded hover:bg-blue-400 transform transition duration-200 cursor-pointer`}
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

export default ProfilePage;
