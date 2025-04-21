
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import UsersPage from "./pages/UsersPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import CalendarPage from "./pages/CalendarPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { SearchProvider } from "./contexts/SearchContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SearchProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <MainLayout>
                    <CoursesPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <MainLayout>
                    <UsersPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/assignments" 
                element={
                  <MainLayout>
                    <AssignmentsPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/submissions" 
                element={
                  <MainLayout>
                    <SubmissionsPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <MainLayout>
                    <CalendarPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <MainLayout>
                    <MessagesPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <MainLayout>
                    <NotificationsPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
