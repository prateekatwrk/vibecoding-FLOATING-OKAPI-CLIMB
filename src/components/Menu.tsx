"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ListTodo,
  Calendar,
  Settings,
  FileText,
} from "lucide-react";

const items = [
  { path: "/todolist", label: "Todo List", icon: ListTodo },
  { path: "/attendance", label: "Attendance", icon: Calendar },
  { path: "/tools", label: "Tools", icon: Settings },
  { path: "/payslip", label: "Payslip", icon: FileText },
];

export const Menu = () => {
  const navigate = useNavigate();

  return (
    <nav className="space-y-2 p-4 bg-white border-r h-full w-64 md:w-80">
      {items.map((item) => {
        const Icon = item.icon;
        const to = item.path;
        return (
          <Button
            key={item.path}
            type="button"
            variant="ghost"
            className="w-full flex items-center justify-start"
            onClick={() => navigate(to)}
          >
            <Icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};