"use client";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";

const LoginUser = () => {
  const { setUser } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data);
      redirect("/profile");
    }
    redirect("/signup");
  };

  return (
    <div>
      LoginUser
      <form onSubmit={handleSubmit} className="p-4 space-y-2">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginUser;
