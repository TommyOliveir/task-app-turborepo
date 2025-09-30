import React from "react";
import { useUser } from "../context/UserContext";
import { redirect } from "next/navigation";

const Logout = () => {
  const { user } = useUser();

  const handleLogout = async (e: React.FormEvent) => {
    console.log("logout");
    localStorage.removeItem("user");
    redirect("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2  bg-teal-900 text-white  rounded hover:scale-95 transform transition duration-200  cursor-pointer"
    >
      Logout
    </button>
  );
};

export default Logout;
