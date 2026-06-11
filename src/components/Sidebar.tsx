"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ListTodo,
  Calendar,
  Settings,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/todolist", label: "Todo List", icon: ListTodo },
  { to: "/attendance", label: "Attendance", icon: Calendar },
  { to: "/tools", label: "Tools", icon: Settings },
  { to: "/payslip", label: "Payslip", icon: FileText },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-2 p-4 bg-white border-r h-full">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to}>
            <Button
              variant={active ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};