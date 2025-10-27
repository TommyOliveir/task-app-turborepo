"use client";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const LoginClient = () => {
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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="h-screen pt-20">
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded p-4 shadow-lg w-1/4  m-auto "
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
        <>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:scale-95 transform transition duration-200 cursor-pointer"
          >
            Submit
          </button>
          <p className="text-center">OR</p>
          <button
            type="button"
            className="w-full border flex gap-3 justify-center  rounded hover:scale-95 px-4 py-2 transform transition duration-200 cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </>
      </form>
    </div>
  );
};

export default LoginClient;
