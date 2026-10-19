// src/app/(pages)/dashboard/page.jsx

"use client";

import { useAuth } from "@/context/AuthContext";

export default function Homepage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.fullName || "User"}!
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Blogs</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Messages</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Users</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
