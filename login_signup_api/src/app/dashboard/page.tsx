"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Fetch data
  const handleFetchData = async () => {
    const res = await fetch("/api/users");
    const json = await res.json();
    if (!json || json.length === 0) {
      alert("No inputted data in database");
      setData([]);
    } else {
      setData(json);
    }
  };

  // ✅ Signup user
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (res.ok) {
      alert("User signed up successfully!");
      setEmail("");
      setPassword("");
      handleFetchData(); // refresh table after signup
    } else {
      alert(json.error || "Signup failed");
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login"); // balik sa login page
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {/* 🚀 Signup Form */}
      <form
        onSubmit={handleSignup}
        className="mb-6 p-4 border rounded-lg shadow-md max-w-md bg-gray-50"
      >
        <h2 className="text-lg font-semibold mb-2">Signup User</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Signup
        </button>
      </form>

      {/* Buttons */}
      <div className="space-x-4 mt-4">
        <button
          onClick={handleFetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch Data
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Table */}
      {data.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Password</th>
                <th className="border border-gray-300 px-4 py-2">API</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.password}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.api}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
