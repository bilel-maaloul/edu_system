
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { UserRole } from "@/types";
import { MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const initialUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: UserRole.STUDENT,
    courses: 3,
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Jane Wilson",
    email: "jane.wilson@example.com",
    role: UserRole.TEACHER,
    courses: 2,
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: UserRole.STUDENT,
    courses: 5,
    lastActive: "2 days ago",
  },
  {
    id: "4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    role: UserRole.STUDENT,
    courses: 4,
    lastActive: "Yesterday",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: UserRole.ADMIN,
    courses: 0,
    lastActive: "1 week ago",
  },
  {
    id: "6",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: UserRole.TEACHER,
    courses: 3,
    lastActive: "3 hours ago",
  },
  {
    id: "7",
    name: "David Lee",
    email: "david.lee@example.com",
    role: UserRole.STUDENT,
    courses: 2,
    lastActive: "5 days ago",
  },
];

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: UserRole.STUDENT,
    },
  });
  
  const onSubmit = (data: any) => {
    const newUser = {
      id: Math.random().toString(36).substring(2, 11),
      name: data.name,
      email: data.email,
      role: data.role,
      courses: 0,
      lastActive: "Just now",
    };
    
    setUsers([...users, newUser]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "User Created",
      description: `${data.name} has been added as a ${data.role}`,
    });
  };
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case UserRole.TEACHER:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage students, teachers, and administrators.
          </p>
        </div>
        
        {user?.role === "admin" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to your educational platform.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john.smith@example.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                            <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Create User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    className={getRoleBadgeColor(user.role)} 
                    variant="outline"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.courses}</TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;
