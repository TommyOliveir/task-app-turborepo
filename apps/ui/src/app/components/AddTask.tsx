"use client";

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { createTask } from "../services/createTask";
import { Task } from "../types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { useUpdateTaskMutation } from "../hooks/useUpdateTaskMutation";

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

  const tokenGoogle = localStorage.getItem("TokenGoogleUser");
  const queryClient = useQueryClient();

  const { mutateAsync: updateTaskMutateAsync } = useUpdateTaskMutation();
  const { mutateAsync: createTaskMutateAsync } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userTasks"],
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

    try {
      if (taskToEdit?.id) {
        await updateTaskMutateAsync({
          taskId: taskToEdit.id,
          updatedData: addTaskData,
          user,
          tokenGoogle,
        });
      } else {
        await createTaskMutateAsync({ addTaskData, user, tokenGoogle });
      }

      setAddTaskData({ title: "", description: "" });

      if (onTaskCreated) onTaskCreated();
    } catch (err: any) {
      console.error("Task creation or update failed:", err);
      // Show error to user when submitting task is empty (e.g. with toast)
      const ErrorMessage =
        err.message.length > 0 ? err.message.join(" and ") : err.message;
      console.log("Task creation or update failed:", ErrorMessage);
      toast.error(ErrorMessage);
    }
  };

  return (
    <>
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
          className="px-4 py-2 rounded transform transition duration-200 cursor-pointer 
             bg-blue-500 text-white hover:bg-blue-600 hover:bg-blue-400
        "
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
      <ToastContainer />
    </>
  );
};

export default AddTask;
