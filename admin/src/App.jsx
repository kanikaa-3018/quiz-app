import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import  Toaster  from "./components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Page Imports
import AdminDashboard from "@/pages/AdminDashboard";
import StudentPortal from "@/pages/StudentPortal";
import QuizInterface from "@/pages/QuizInterface";
import QuizResults from "@/pages/QuizResults";
import NotFound from "@/pages/NotFound";
import StudentPerformancePanel from "./components/StudentPerformancePanel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AdminDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/student" component={StudentPortal} />
      <Route path="/quiz" component={QuizInterface} />
      <Route path="/results" component={QuizResults} />
      <Route path="/student-stats" component={StudentPerformancePanel} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
