export const deleteTask = async (taskId: string) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
