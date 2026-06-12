"use client";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ListTodo, Calendar, Settings, FileText } from "lucide-react";

export const Home = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/todolist", label: "Todo List", icon: ListTodo },
    { path: "/attendance", label: "Attendance", icon: Calendar },
    { path: "/tools", label: "Tools", icon: Settings },
    { path: "/payslip", label: "Payslip", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <Card className="w-full max-w-4xl shadow-2xl shadow-blue-100/50 bg-white rounded-lg overflow-hidden">
        <CardHeader className="p-6 mb-4">
          <CardTitle className="text-2xl font-bold text-center text-slate-900">
            Dashboard
          </CardTitle>
          <p className="text-center text-sm text-slate-500">
            Welcome{userId ? `, ${userId}` : ""}! Select an application to get started.
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="outline"
                size="lg"
                className="shadow-md hover:shadow-lg h-24 flex-col gap-2"
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-8 w-8 text-blue-600" />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};