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
    <nav className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg overflow-y-auto">
      <div className="p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const to = item.path;
          return (
            <Button              key={item.path}
              type="button"
              variant="ghost"
              className="flex items-center justify-start w-full px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-50"
              onClick={() => navigate(to)}
            >
              <Icon className="mr-2 h-5 w-5 text-gray-600" />
              <span className="text-gray-800">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};