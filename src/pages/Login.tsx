"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Lock, User } from "lucide-react";

export const Login = () => {
  const [id, setId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(id, password);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl shadow-blue-100/50">
        <CardHeader className="space-y-4 pb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
            <Lock className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="id" className="text-sm font-medium text-slate-700">
                User ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="id"
                  type="text"
                  placeholder="Enter your user ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium shadow-lg shadow-blue-200"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};