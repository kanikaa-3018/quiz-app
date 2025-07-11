import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Toaster from "./components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "./layout/AdminLayout";
import { AdminProvider } from './context/AdminContext';

// Page Imports
import AdminDashboard from "@/pages/AdminDashboard";
import StudentPortal from "@/pages/StudentPortal";
import QuizInterface from "@/pages/QuizInterface";
import QuizResults from "@/pages/QuizResults";
import NotFound from "@/pages/NotFound";
import StudentPerformancePanel from "./components/StudentPerformancePanel";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import LandingPage from "./pages/LandingPage";
import AdminProfile from "./pages/AdminProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/register" component={AdminRegister} />

      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>

      <Route path="/admin/profile">
        <AdminLayout>
          <AdminProfile />
        </AdminLayout>
      </Route>

      <Route path="/student-stats">
        <AdminLayout>
          <StudentPerformancePanel />
        </AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
        <Toaster />
        <Router />
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
