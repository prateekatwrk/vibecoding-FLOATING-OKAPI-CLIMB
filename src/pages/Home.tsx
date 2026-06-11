"use client";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";

export const Home = () => {
  const { userId } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome{userId ? `, ${userId}` : ""}!
      </h1>
      <p className="mt-4 text-lg">
        Use the menu on the left to navigate through the application.
      </p>
    </div>
  );
};