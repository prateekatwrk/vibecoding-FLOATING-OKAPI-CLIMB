import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { TodoApp } from "./pages/TodoApp";
import BackButton from "@/components/BackButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/todolist" element={<TodoApp />} />
                    <Route
                      path="/attendance"
                      element={
                        <>
                          <BackButton className="mb-4" />
                          <div className="p-8">
                            <h1 className="text-2xl font-bold mb-4">Attendance</h1>
                            <p className="text-gray-600">Attendance page (coming soon)</p>
                          </div>
                        </>
                      }
                    />
                    <Route
                      path="/tools"
                      element={
                        <>
                          <BackButton className="mb-4" />
                          <div className="p-8">
                            <h1 className="text-2xl font-bold mb-4">Tools</h1>
                            <p className="text-gray-600">Tools page (coming soon)</p>
                          </div>
                        </>
                      }
                    />
                    <Route
                      path="/payslip"
                      element={
                        <>
                          <BackButton className="mb-4" />
                          <div className="p-8">
                            <h1 className="text-2xl font-bold mb-4">Payslip</h1>
                            <p className="text-gray-600">Payslip page (coming soon)</p>
                          </div>
                        </>
                      }
                    />
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;