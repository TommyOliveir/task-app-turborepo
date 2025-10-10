"use client";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div
      className="rounded bg-white shadow-lg mt-20 p-8 w-1/4 h-100 text-center flex flex-col gap-4 m-auto items-content justify-center
"
    >
      <h1 className="font-bold text-2xl">Welcome to your Todo App</h1>
      <p>A pet project of Tommy Oliveir build in nest js and next js</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-95 transform transition duration-200 cursor-pointer"
        onClick={() => redirect("/login")}
      >
        Let's Start
      </button>
    </div>
  );
}
