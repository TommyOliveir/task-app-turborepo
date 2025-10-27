import React from "react";
import { redirect } from "next/navigation";

const Logout = () => {
  const handleLogout = async () => {
    const keysToRemove = ["user", "googleUser", "TokenGoogleUser"];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    redirect("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-teal-900 text-white rounded hover:scale-95 transform transition duration-200  cursor-pointer"
    >
      Logout
    </button>
  );
};

export default Logout;
