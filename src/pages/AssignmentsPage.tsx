
import { useState } from "react";
import { FileText, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

// Sample assignment data
const assignmentData = [
  {
    id: "a1",
    title: "Introduction to Design Patterns",
    course: "Software Architecture",
    dueDate: "2025-04-20",
    status: "pending",
    description: "Write a 1500-word essay on design patterns in software architecture.",
  },
  {
    id: "a2",
    title: "Database Schema Design",
    course: "Database Systems",
    dueDate: "2025-04-25",
    status: "completed",
    description: "Design a normalized database schema for an e-commerce application.",
  },
  {
    id: "a3",
    title: "React Component Implementation",
    course: "Frontend Development",
    dueDate: "2025-04-30",
    status: "pending",
    description: "Implement a reusable form component with validation in React.",
  },
  {
    id: "a4",
    title: "API Security Analysis",
    course: "Web Security",
    dueDate: "2025-05-05",
    status: "pending",
    description: "Analyze common security vulnerabilities in REST APIs and propose solutions.",
  },
  {
    id: "a5",
    title: "Machine Learning Model Evaluation",
    course: "AI Fundamentals",
    dueDate: "2025-05-10",
    status: "overdue",
    description: "Evaluate the performance of different machine learning models on a given dataset.",
  },
];

// New assignment form type
interface NewAssignmentForm {
  title: string;
  course: string;
  dueDate: string;
  description: string;
}

const AssignmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState(assignmentData);
  const [selectedAssignment, setSelectedAssignment] = useState<typeof assignmentData[0] | null>(null);
  const [newAssignmentDialogOpen, setNewAssignmentDialogOpen] = useState(false);

  // Setup form
  const form = useForm<NewAssignmentForm>({
    defaultValues: {
      title: "",
      course: "",
      dueDate: "",
      description: ""
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, status: newStatus } : assignment
    ));
    
    toast({
      title: "Assignment updated",
      description: `Assignment status changed to ${newStatus}`,
    });
  };

  const handleCreateAssignment = (data: NewAssignmentForm) => {
    // Create a new assignment with the form data
    const newAssignment = {
      id: `a${assignments.length + 1}`,
      title: data.title,
      course: data.course,
      dueDate: data.dueDate,
      status: "pending",
      description: data.description,
    };

    // Add to assignments list
    setAssignments([...assignments, newAssignment]);
    
    // Close dialog and reset form
    setNewAssignmentDialogOpen(false);
    form.reset();

    // Show success toast
    toast({
      title: "Assignment created",
      description: "New assignment has been added successfully",
    });
  };

  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const completedAssignments = assignments.filter(a => a.status === "completed");
  const overdueAssignments = assignments.filter(a => a.status === "overdue");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <Button 
          className="flex items-center gap-1"
          onClick={() => setNewAssignmentDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </div>
      
      {/* Dialog for creating new assignment */}
      <Dialog open={newAssignmentDialogOpen} onOpenChange={setNewAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new assignment.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAssignment)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Assignment title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Course name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                        placeholder="Provide a detailed description of the assignment" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewAssignmentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Assignment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueAssignments.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {assignments.map(assignment => (
            <Card key={assignment.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedAssignment(assignment)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{assignment.title}</CardTitle>
                  <StatusBadge status={assignment.status} />
                </div>
                <CardDescription>{assignment.course}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{assignment.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {user?.role === "student" && assignment.status === "pending" && (
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(assignment.id, "completed");
                    }}>
                      Mark Complete
                    </Button>
                  )}
                  {user?.role !== "student" && (
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssignment(assignment);
                    }}>
                      View Details
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.map(assignment => (
            <Card key={assignment.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedAssignment(assignment)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{assignment.title}</CardTitle>
                  <StatusBadge status={assignment.status} />
                </div>
                <CardDescription>{assignment.course}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{assignment.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                {user?.role === "student" && (
                  <Button size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(assignment.id, "completed");
                  }}>
                    Mark Complete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedAssignments.map(assignment => (
            <Card key={assignment.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedAssignment(assignment)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{assignment.title}</CardTitle>
                  <StatusBadge status={assignment.status} />
                </div>
                <CardDescription>{assignment.course}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{assignment.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Completed on: {new Date().toLocaleDateString()}
                </div>
                {user?.role !== "student" && (
                  <Button size="sm" variant="outline">View Details</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-4">
          {overdueAssignments.map(assignment => (
            <Card key={assignment.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedAssignment(assignment)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{assignment.title}</CardTitle>
                  <StatusBadge status={assignment.status} />
                </div>
                <CardDescription>{assignment.course}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{assignment.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                {user?.role === "student" && (
                  <Button size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(assignment.id, "completed");
                  }}>
                    Submit Late
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      {selectedAssignment && (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{selectedAssignment.title}</CardTitle>
              <StatusBadge status={selectedAssignment.status} />
            </div>
            <CardDescription>{selectedAssignment.course}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{selectedAssignment.description}</p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Due Date</h3>
              <p>{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {user?.role === "student" && selectedAssignment.status === "pending" && (
              <Button onClick={() => handleStatusChange(selectedAssignment.id, "completed")}>
                Submit Assignment
              </Button>
            )}
            {user?.role !== "student" && (
              <Button variant="outline">Edit Assignment</Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

// Helper component for status badges
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case "overdue":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default AssignmentsPage;
