import { Switch, Route } from "wouter";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import TakeQuiz from "./pages/TakeQuiz";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import QuizInterface from "./components/QuizInterface";
import QuizResults from "./pages/QuizResults";


import { UserProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Toaster from "./components/ui/toaster";

const queryClient = new QueryClient();

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/take-quiz" component={TakeQuiz} />
      <Route path="/reports" component={Reports} />
      <Route path="/profile" component={Profile} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/quiz" component={QuizInterface} />
      <Route path="/results" component={QuizResults} />
      
   
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <AppRouter />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
