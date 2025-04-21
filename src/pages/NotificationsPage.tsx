
import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, Filter, MoreVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample notification data
const initialNotifications = [
  {
    id: "n1",
    title: "Assignment Reminder",
    message: "Your assignment 'Introduction to Design Patterns' is due tomorrow.",
    date: new Date("2025-04-15T08:30:00"),
    type: "assignment",
    isRead: false,
  },
  {
    id: "n2",
    title: "Course Update",
    message: "New materials have been uploaded to 'Software Architecture'.",
    date: new Date("2025-04-14T14:15:00"),
    type: "course",
    isRead: false,
  },
  {
    id: "n3",
    title: "Upcoming Event",
    message: "Faculty meeting scheduled for April 20 at 2:00 PM.",
    date: new Date("2025-04-13T10:00:00"),
    type: "event",
    isRead: true,
  },
  {
    id: "n4",
    title: "Grade Posted",
    message: "Your grade for 'Database Schema Design' has been posted.",
    date: new Date("2025-04-12T16:45:00"),
    type: "grade",
    isRead: true,
  },
  {
    id: "n5",
    title: "System Maintenance",
    message: "The system will be undergoing maintenance on Sunday from 2:00 AM to 5:00 AM.",
    date: new Date("2025-04-11T11:30:00"),
    type: "system",
    isRead: true,
  },
  {
    id: "n6",
    title: "New Course Available",
    message: "A new course 'Advanced Machine Learning' is now available for enrollment.",
    date: new Date("2025-04-10T09:20:00"),
    type: "course",
    isRead: true,
  },
  {
    id: "n7",
    title: "Message Received",
    message: "You have a new message from Admin User.",
    date: new Date("2025-04-09T13:10:00"),
    type: "message",
    isRead: true,
  },
];

const NotificationsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.isRead;
    return notification.type === activeFilter;
  });
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    toast({
      title: "Notification marked as read",
    });
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
    
    toast({
      title: "All notifications marked as read",
    });
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
    
    toast({
      title: "Notification deleted",
    });
  };
  
  // Delete all notifications
  const deleteAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "All notifications deleted",
    });
  };
  
  // Function to format notification date
  const formatNotificationDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return format(date, "MMM d, yyyy");
    }
  };
  
  // Function to get notification type badge
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "assignment":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Assignment</Badge>;
      case "course":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Course</Badge>;
      case "event":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Event</Badge>;
      case "grade":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Grade</Badge>;
      case "system":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">System</Badge>;
      case "message":
        return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">Message</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            You have {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-destructive"
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setActiveFilter("unread")}>
              Unread
            </TabsTrigger>
          </TabsList>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter by type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>All types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("assignment")}>Assignment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("course")}>Course</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("event")}>Event</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("grade")}>Grade</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("system")}>System</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("message")}>Message</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <TabsContent value="all" className="m-0">
          <Card>
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors",
                          !notification.isRead && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "font-medium",
                                !notification.isRead && "font-semibold"
                              )}>
                                {notification.title}
                              </h3>
                              {getNotificationBadge(notification.type)}
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                            <p className="text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatNotificationDate(notification.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.isRead && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    Mark as read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread" className="m-0">
          <Card>
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No unread notifications</h3>
                  <p className="text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors",
                          !notification.isRead && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                "font-medium",
                                !notification.isRead && "font-semibold"
                              )}>
                                {notification.title}
                              </h3>
                              {getNotificationBadge(notification.type)}
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                            <p className="text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatNotificationDate(notification.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.isRead && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    Mark as read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
