import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Tag 
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Event } from "@/types";

const initialEvents = [
  {
    id: "1",
    title: "Advanced Algorithms Lecture",
    description: "Weekly lecture on graph algorithms and dynamic programming",
    date: new Date("2025-04-16T10:00:00"),
    endTime: new Date("2025-04-16T12:00:00"),
    location: "Lecture Hall A",
    courseId: "CS401",
    attendees: 35,
  },
  {
    id: "2",
    title: "Database Design Workshop",
    description: "Hands-on session designing relational databases",
    date: new Date("2025-04-17T14:00:00"),
    endTime: new Date("2025-04-17T16:00:00"),
    location: "Computer Lab 3",
    courseId: "DB201",
    attendees: 22,
  },
  {
    id: "3",
    title: "Project Management Review",
    description: "Team progress presentations and feedback",
    date: new Date("2025-04-18T13:00:00"),
    endTime: new Date("2025-04-18T15:00:00"),
    location: "Seminar Room B",
    courseId: "PM301",
    attendees: 18,
  },
  {
    id: "4",
    title: "Final Exam Preparation",
    description: "Review session for upcoming exams",
    date: new Date("2025-04-20T09:00:00"),
    endTime: new Date("2025-04-20T11:00:00"),
    location: "Study Hall 2",
    courseId: "GEN001",
    attendees: 45,
  },
  {
    id: "5",
    title: "Web Development Workshop",
    description: "Frontend development techniques and best practices",
    date: new Date("2025-04-22T15:00:00"),
    endTime: new Date("2025-04-22T17:00:00"),
    location: "Computer Lab 1",
    courseId: "WEB301",
    attendees: 28,
  },
];

const CalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<typeof initialEvents[0] | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      location: "",
      courseId: "",
    },
  });

  const eventsForSelectedDate = date
    ? events.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      )
    : [];

  const hasEventsOnDate = (date: Date) => {
    return events.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const markAttendance = (eventId: string) => {
    toast({
      title: "Attendance Marked",
      description: "You have been marked as present for this event",
    });
  };

  const onSubmit = (data: any) => {
    try {
      const startDateTime = new Date(data.date);
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      startDateTime.setHours(startHour, startMinute);

      const endDateTime = new Date(data.date);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      endDateTime.setHours(endHour, endMinute);

      const newEvent = {
        id: Math.random().toString(36).substring(2, 11),
        title: data.title,
        description: data.description,
        date: startDateTime,
        endTime: endDateTime,
        location: data.location || "Virtual",
        courseId: data.courseId || "GEN001",
        attendees: 0,
      };

      setEvents([...events, newEvent]);
      setIsAddEventOpen(false);
      form.reset();
      toast({
        title: "Event Added Successfully",
        description: `Your event "${data.title}" has been added to the calendar`,
      });
      setDate(startDateTime);
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error Adding Event",
        description: "There was a problem adding your event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 to-white min-h-screen p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-purple-800 flex items-center gap-3">
          <CalendarIcon className="h-10 w-10 text-purple-600" />
          Academic Calendar
        </h1>
        {user?.role !== "student" && (
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for your academic calendar.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time*</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time*</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course ID (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course ID" {...field} />
                        </FormControl>
                        <FormDescription>
                          Associate this event with a specific course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 shadow-lg border-purple-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-xl text-purple-800 flex items-center justify-between">
              Academic Calendar
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </CardTitle>
            <CardDescription>
              {date ? format(date, "MMMM yyyy") : "Select a date"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border-2 border-purple-100"
              modifiers={{
                hasEvent: (date) => hasEventsOnDate(date),
              }}
              modifiersClassNames={{
                hasEvent: "bg-purple-100 font-bold text-purple-800",
              }}
              components={{
                DayContent: ({ date, displayMonth }) => {
                  const isHasEvent = hasEventsOnDate(date);
                  return (
                    <div className="relative">
                      {date.getDate()}
                      {isHasEvent && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 shadow-lg border-purple-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-xl text-purple-800 flex items-center justify-between">
              {date ? format(date, "EEEE, MMMM d, yyyy") : "No date selected"}
              <Clock className="h-6 w-6 text-purple-600" />
            </CardTitle>
            <CardDescription>
              {eventsForSelectedDate.length} events scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {eventsForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-purple-50 rounded-lg">
                <CalendarIcon className="h-12 w-12 text-purple-300 mb-4" />
                <h3 className="text-lg font-medium text-purple-800">No events scheduled</h3>
                <p className="text-sm text-purple-600 mt-1">
                  {user?.role !== "student"
                    ? "Click 'Add Event' to create a new calendar entry"
                    : "There are no events scheduled for this date"}
                </p>
              </div>
            ) : (
              eventsForSelectedDate.map(event => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-200 border-l-4"
                  style={{
                    borderLeftColor: 
                      event.courseId === "CS401" ? "#3B82F6" :
                      event.courseId === "DB201" ? "#10B981" :
                      event.courseId === "PM301" ? "#6366F1" :
                      event.courseId === "WEB301" ? "#F97316" :
                      "#6B7280"
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base text-purple-800 flex items-center gap-2">
                          {event.title}
                          {event.courseId === "CS401" && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          {format(event.date, "h:mm a")} - {format(event.endTime, "h:mm a")}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="sr-only">View details</div>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-purple-500" />
                      <span>{event.location}</span>
                    </div>
                    {user?.role !== "student" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Users className="h-3.5 w-3.5 text-purple-500" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    )}
                  </CardContent>
                  {user?.role === "student" && (
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-purple-700 border-purple-200 hover:bg-purple-50"
                        onClick={() => markAttendance(event.id)}
                      >
                        Mark Attendance
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedEvent && (
        <Card className="mt-6 shadow-lg border-purple-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                  {selectedEvent.title}
                  {selectedEvent.courseId === "CS401" && (
                    <Star className="h-5 w-5 text-yellow-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  Course ID: {selectedEvent.courseId}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setSelectedEvent(null)}
              >
                <div className="sr-only">Close</div>
                <span className="text-lg text-purple-600">×</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="font-semibold text-sm">Description</h3>
              <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm">Date & Time</h3>
                <p className="text-sm text-muted-foreground">
                  {format(selectedEvent.date, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(selectedEvent.date, "h:mm a")} - {format(selectedEvent.endTime, "h:mm a")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Location</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
              </div>
            </div>
            {user?.role !== "student" && (
              <div>
                <h3 className="font-semibold text-sm">Attendees</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.attendees} expected</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-purple-50 border-t border-purple-100 p-4">
            {user?.role === "student" ? (
              <Button onClick={() => markAttendance(selectedEvent.id)}>
                Mark Attendance
              </Button>
            ) : (
              <>
                <Button variant="outline">Edit Event</Button>
                <Button variant="default">Manage Attendees</Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
