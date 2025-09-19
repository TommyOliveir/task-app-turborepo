"use client";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

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
      setUser(data);
      redirect("/profile");
    }
    redirect("/signup");
  };

  return (
    <div className="bg-gray-100 h-screen grid place-items-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded p-4 shadow w-1/4"
      >
        <h2 className="font-bold text-2xl">Log in</h2>
        <p>
          Don't have account?{" "}
          <span className="text-blue-500 underline">
            <Link href="/signup">Create an account</Link>
          </span>
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300  p-2 rounded w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300  p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-95 transform transition duration-200 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginUser;
