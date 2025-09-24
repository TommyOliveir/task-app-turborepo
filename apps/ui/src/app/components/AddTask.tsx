"use client";

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { createTask } from "../services/createTask";
import { Task } from "../types/task";
import { updateTask } from "../services/updateTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddTaskProps {
  onTaskCreated?: () => void;
  taskToEdit?: Task;
  setEditingTaskId?: () => void;
}

const AddTask = ({
  onTaskCreated,
  taskToEdit,
  setEditingTaskId,
}: AddTaskProps) => {
  const { user } = useUser();
  const [addTaskData, setAddTaskData] = useState({
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
  });

  const queryClient = useQueryClient();

  const { mutate: createTaskMutate } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userTasks"],
      });
    },
  });

  const { mutate: updateTaskMutate } = useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["userTasks"], (oldData: Task[]) => {
        if (!oldData) return [];

        return oldData.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      });
    },
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
      if (taskToEdit?.id) {
        updateTaskMutate({
          taskId: taskToEdit.id,
          updatedData: addTaskData,
          user,
        });
      } else {
        createTaskMutate({ addTaskData, user });
      }
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
            : "bg-blue-500 text-white hover:bg-blue-400"
        }`}
      >
        Submit
      </button>
      {setEditingTaskId && (
        <button
          onClick={setEditingTaskId}
          type="button"
          className={`ml-2 text-white px-4 py-2 bg-red-500 hover:bg-red-400 rounded transform transition duration-200 cursor-pointer`}
        >
          cancel
        </button>
      )}
    </form>
  );
};

export default AddTask;
