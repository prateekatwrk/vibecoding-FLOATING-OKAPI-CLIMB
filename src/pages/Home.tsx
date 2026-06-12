"use client";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { Menu } from "@/components/Menu";

export const Home = () => {
  const { userId } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome{userId ? `, ${userId}` : ""}!
      </h1>
      <Menu />
    </div>
  );
};