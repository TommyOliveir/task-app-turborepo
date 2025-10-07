"use client";

import React from "react";
import { deleteTask } from "../services/deleteTask";
import { useUser } from "../context/UserContext";

type deleteTaskProps = {
  taskId: string;
  onTaskDeleted: () => void;
};

const DeleteTask = ({ taskId, onTaskDeleted }: deleteTaskProps) => {
  const { user } = useUser();

  const handleDelete = async (taskId: string) => {
    console.log("Id delete", taskId);

    try {
      await deleteTask(taskId, user?.accessToken);
      onTaskDeleted();
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleDelete(taskId)}
        className="ml-2 px-4 py-2  rounded hover:scale-95 transform transition duration-200  cursor-pointer"
      >
        <img src="/delete.png" alt="Logo" width="30px" />
      </button>
    </div>
  );
};

export default DeleteTask;
