"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function SignupClient() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Signup successful! You can now login, Go to login page");
        setFormData({ username: "", email: "", password: "" });
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="mt-20">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded p-4 shadow w-1/4 m-auto "
      >
        <h2 className="font-bold text-2xl">Sign up</h2>
        <p>
          Already have account?{" "}
          <span className="text-blue-500 underline">
            <Link href="/login">Log in</Link>
          </span>
        </p>
        <input
          className="border border-gray-300  p-2 rounded w-full"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />

        <input
          className="border border-gray-300  p-2 rounded w-full"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          className="border border-gray-300  p-2 rounded w-full"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-95 transform transition duration-200 cursor-pointer"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
