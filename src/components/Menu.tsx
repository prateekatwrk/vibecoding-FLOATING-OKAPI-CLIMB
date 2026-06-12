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
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Navigation
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const to = item.path;
          return (
            <Button
              key={item.path}
              type="button"
              variant="ghost"
              className="w-full flex items-center justify-start px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-lg"
              onClick={() => navigate(to)}
            >
              <Icon className="mr-3 h-5 w-5 text-gray-600" />
              <span className="font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};