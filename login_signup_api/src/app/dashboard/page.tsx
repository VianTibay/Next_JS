import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const user = useFetchUserData();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Welcome to your Dashboard 🎉</h1>
        <p>You are now logged in.</p>
        <Link href="/login">
          <Button variant="outline">Logout</Button>
        </Link>
      </div>

      {user ? (
        <div className="mt-6">
          <h1 className="text-xl font-semibold">User Profile</h1>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="mt-6">Loading user data...</p>
      )}
    </div>
  );
}

export function useFetchUserData() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Change this to your deployed API route if using Vercel
        const response = await fetch("/api/auth/me");  
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserData();
  }, []);

  return user;
}
