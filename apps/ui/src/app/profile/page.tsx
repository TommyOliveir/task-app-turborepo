"use client";

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import AddTask from "../components/AddTask";
import DeleteTask from "../components/DeleteTask";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks } from "../services/fetchTasks";
import { Task } from "../types/task";

const ProfilePage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
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
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div className="bg-gray-100 h-screen grid place-items-center">
      <div className="w-1/2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Hello, {user?.username} 👋</h1>
          <p className="text-gray-600 mt-1">Here’s your task list for today:</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
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
            <p className="text-gray-500 mt-3">No tasks yet. Enjoy your day!</p>
          ) : (
            <ul className="space-y-3 mt-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between p-3 rounded shadow bg-green-100"
                >
                  <div className="flex-1">
                    {!editingTaskId && (
                      <>
                        <h2 className="font-bold">{task.title}</h2>
                        <p>{task.description}</p>
                      </>
                    )}
                    {editingTaskId === task.id && (
                      <AddTask
                        taskToEdit={{
                          id: task.id,
                          title: task.title,
                          description: task.description,
                        }}
                        onTaskCreated={onTaskCreated}
                        setEditingTaskId={() => setEditingTaskId(null)}
                      />
                    )}
                  </div>

                  {!editingTaskId && (
                    <>
                      <button
                        onClick={() =>
                          setEditingTaskId((prev) =>
                            prev === task.id ? null : task.id
                          )
                        }
                        className="self-start px-4 py-2  bg-green-500 text-white  rounded hover:scale-95 transform transition duration-200  cursor-pointer"
                      >
                        Edit
                      </button>
                      <DeleteTask
                        taskId={task.id}
                        onTaskDeleted={() =>
                          queryClient.invalidateQueries({
                            queryKey: ["userTasks"],
                          })
                        }
                      />
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
