// AddTask.tsx
"use client";

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { createTask } from "../services/createTask";

interface AddTaskProps {
  onTaskCreated?: () => void; // optional callback
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskCreated }) => {
  const { user } = useUser();
  const [addTaskData, setAddTaskData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddTaskData({ ...addTaskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createTask({ addTaskData, user });
      setAddTaskData({ title: "", description: "" });

      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-6 bg-white rounded w-full"
    >
      <input
        name="title"
        placeholder="Title"
        value={addTaskData.title}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={addTaskData.description}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={!(addTaskData.title.trim() && addTaskData.description.trim())}
        className={`px-4 py-2 rounded transform transition duration-200 cursor-pointer ${
          !(addTaskData.title.trim() && addTaskData.description.trim())
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-blue-500 text-white hover:scale-95"
        }`}
      >
        Submit
      </button>
    </form>
  );
};

export default AddTask;
