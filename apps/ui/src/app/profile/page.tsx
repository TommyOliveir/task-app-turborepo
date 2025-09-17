"use client";
import React from "react";
import { useUser } from "../context/UserContext";

const ProfilePage = () => {
  const { user } = useUser();

  const tasks = [
    { id: 1, title: "Finish Next.js project", completed: false },
    { id: 2, title: "Read Tailwind docs", completed: true },
    { id: 3, title: "Buy groceries", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hello, {user?.username} 👋</h1>
        <p className="text-gray-600 mt-1">Here’s your task list for today:</p>
      </div>
      <h1 className="p-3">TASK</h1>
      <div className="bg-white shadow rounded-lg p-6 max-w-xl">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Enjoy your day!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-3 rounded border ${
                  task.completed
                    ? "bg-green-100 border-green-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span
                  className={`flex-1 ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`ml-4 px-2 py-1 text-sm rounded ${
                    task.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {task.completed ? "Done" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
