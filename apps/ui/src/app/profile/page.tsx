"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import AddTask from "../components/AddTask";
import DeleteTask from "../components/DeleteTask";

interface Task {
  id: number;
  title: string;
  description: string;
}

const ProfilePage = () => {
  const { user } = useUser();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");

      if (!userObj || !userObj.accessToken) {
        throw new Error("No token found in localStorage");
      }

      const token = userObj.accessToken;

      const res = await fetch("http://localhost:3000/tasks/userstasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

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
              onClick={() => setIsAddTaskOpen((prevState) => !prevState)}
              className={` ${isAddTaskOpen ? "bg-red-500" : "bg-blue-500"} text-white px-4 py-2 rounded hover:scale-95 transform transition duration-200 cursor-pointer`}
            >
              {isAddTaskOpen ? "X" : "Add Task"}
            </button>
          </div>
          {isAddTaskOpen && <AddTask onTaskCreated={fetchTasks} />}

          {tasks.length === 0 ? (
            <p className="text-gray-500 mt-3">No tasks yet. Enjoy your day!</p>
          ) : (
            <ul className="space-y-3 mt-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded shadow bg-green-100"
                >
                  <div className="flex-1">
                    <h2 className="font-bold">{task.title}</h2>
                    <p>{task.description}</p>
                    <DeleteTask />
                  </div>
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
