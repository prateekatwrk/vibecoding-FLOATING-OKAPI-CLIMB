import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

const queryClient = new QueryClient();

const Layout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todolist" element={<Index />} />
        {/* placeholder routes for future pages */}
        <Route path="/attendance" element={<div className="p-8">Attendance page (coming soon)</div>} />
        <Route path="/tools" element={<div className="p-8">Tools page (coming soon)</div>} />
        <Route path="/payslip" element={<div className="p-8">Payslip page (coming soon)</div>} />
      </Routes>
    </div>
  </div>
);

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
                  <Layout />
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