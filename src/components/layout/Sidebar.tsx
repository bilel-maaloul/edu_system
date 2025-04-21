
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Book, GraduationCap, Users, Calendar, FileText, 
  MessageSquare, Bell, Settings, Menu, X, Send, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const routes = [
    {
      name: "Dashboard",
      href: "/",
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      name: "Courses",
      href: "/courses",
      icon: <Book className="h-5 w-5" />
    },
    {
      name: "Users",
      href: "/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "Submissions",
      href: "/submissions",
      icon: <Send className="h-5 w-5" />
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Messages",
      href: "/messages",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell className="h-5 w-5" />
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  // On mobile, render a collapse button
  if (isMobile && !isOpen) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button size="icon" variant="outline" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  
  return (
    <ShadcnSidebar 
      className={cn(
        "h-screen transition-all duration-300",
        isOpen ? "w-64" : "w-20",
        isMobile && isOpen ? "fixed inset-y-0 left-0 z-50" : ""
      )}
      data-state={isOpen ? "expanded" : "collapsed"}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 flex items-center justify-between">
        <div className={cn("font-bold text-xl", !isOpen && "hidden")}>
          EduArch
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === route.href}
                tooltip={!isOpen ? route.name : undefined}
              >
                <Link to={route.href} className="flex items-center">
                  {route.icon}
                  {isOpen && <span className="ml-3">{route.name}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarSeparator />
        <div className="flex items-center justify-center p-2 text-xs text-sidebar-foreground/70">
          {isOpen ? `EduArch © 2025 | ${user?.role || 'User'}` : "©"}
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
