"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Task } from "../types/task";
import AddTask from "./AddTask";
import DeleteTask from "./DeleteTask";
import { Dispatch } from "react";
import { useUpdateTaskMutation } from "../hooks/useUpdateTaskMutation";
import { useUser } from "../context/UserContext";

interface TaskProps {
  task: Task;
  editingTaskId: string | null;
  onTaskCreated: () => void;
  setEditingTaskId: Dispatch<React.SetStateAction<string | null>>;
}

export const TaskItem = ({
  task,
  editingTaskId,
  onTaskCreated,
  setEditingTaskId,
}: TaskProps) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { mutateAsync: updateTaskMutateAsync } = useUpdateTaskMutation();

  const handleCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsDone = e.target.checked;

    try {
      if (task.id) {
        await updateTaskMutateAsync({
          taskId: task.id,
          updatedData: { isDone: newIsDone },
          user,
        });
      }
    } catch (err: any) {
      console.error("Task creation or update failed:", err);
      console.log("Task update failed");
    }
  };

  return (
    <li
      key={task.id}
      className={`flex justify-between p-3 rounded shadow  ${task.isDone ? "bg-gray-200" : "bg-green-100"}`}
    >
      <div className="flex-1">
        {!editingTaskId && (
          <div className="flex items-start ">
            <input
              className="cursor-pointer w-5 h-5 mr-3 "
              type="checkbox"
              id="done"
              name="done"
              checked={task.isDone}
              onChange={handleCheck}
            />
            <div>
              <label
                htmlFor="done"
                className={`${task.isDone ? "line-through" : ""} font-bold cursor-pointer`}
              >
                {task.title}
              </label>
              <p>{task.description}</p>
            </div>
          </div>
        )}
        {editingTaskId === task.id && (
          <AddTask
            taskToEdit={{
              id: task.id,
              title: task.title,
              description: task.description,
              isDone: false,
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
              setEditingTaskId((prev) => (prev === task.id ? null : task.id))
            }
            className="self-start px-4 py-2  rounded hover:scale-95 transform transition duration-200  cursor-pointer"
          >
            <img src="/edit.png" alt="Logo" width="30px" />
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
  );
};
