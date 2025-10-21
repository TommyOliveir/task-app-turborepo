export const deleteTask = async (
  taskId: string,
  accessToken: string | undefined | null
) => {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
