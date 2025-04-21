import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Filter, 
  Plus, 
  Search,
  User,
  Crown,
  Award
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { CourseStatus } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const initialCourses = [
  {
    id: "1",
    title: "Software Architecture",
    description: "Learn about software architecture patterns and best practices.",
    teacherName: "Dr. Robert Smith",
    status: CourseStatus.ACTIVE,
    enrolledStudents: 42,
    modules: 8,
    lastUpdated: "2 days ago",
    isPremium: false,
    hasCertificate: true,
  },
  {
    id: "2",
    title: "Database Systems",
    description: "Understand relational database concepts and SQL programming.",
    teacherName: "Prof. Jane Wilson",
    status: CourseStatus.ACTIVE,
    enrolledStudents: 37,
    modules: 10,
    lastUpdated: "5 days ago",
    isPremium: true,
    hasCertificate: false,
  },
  {
    id: "3",
    title: "Frontend Development",
    description: "Master modern frontend frameworks like React and Vue.",
    teacherName: "Alan Johnson",
    status: CourseStatus.ACTIVE,
    enrolledStudents: 56,
    modules: 12,
    lastUpdated: "1 week ago",
    isPremium: true,
    hasCertificate: true,
  },
  {
    id: "4",
    title: "Design Patterns in OOP",
    description: "Explore common design patterns in object-oriented programming.",
    teacherName: "Dr. Robert Smith",
    status: CourseStatus.DRAFT,
    enrolledStudents: 0,
    modules: 6,
    lastUpdated: "1 day ago",
    isPremium: false,
    hasCertificate: false,
  },
  {
    id: "5",
    title: "Mobile App Development",
    description: "Learn to build cross-platform mobile applications.",
    teacherName: "Sarah Miller",
    status: CourseStatus.ARCHIVED,
    enrolledStudents: 28,
    modules: 9,
    lastUpdated: "3 months ago",
    isPremium: false,
    hasCertificate: true,
  },
];

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: CourseStatus.DRAFT,
      teacherName: "",
      isPremium: false,
      hasCertificate: false,
    },
  });
  
  const onSubmit = (data: any) => {
    const newCourse = {
      id: Math.random().toString(36).substring(2, 11),
      title: data.title,
      description: data.description,
      teacherName: data.teacherName,
      status: data.status,
      enrolledStudents: 0,
      modules: 0,
      lastUpdated: "Just now",
      isPremium: data.isPremium,
      hasCertificate: data.hasCertificate,
    };
    
    setCourses([...courses, newCourse]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Course Created",
      description: `${data.title} has been added as a ${data.status} course`,
    });
  };
  
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getBadgeColor = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.ACTIVE:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case CourseStatus.DRAFT:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case CourseStatus.ARCHIVED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "";
    }
  };
  
  const canCreateCourse = user?.role === 'teacher' || user?.role === 'admin';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">
            Manage your educational courses and modules.
          </p>
        </div>
        
        {canCreateCourse && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to your educational platform.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Course title" {...field} />
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
                            placeholder="Brief description of the course"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="teacherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher</FormLabel>
                        <FormControl>
                          <Input placeholder="Teacher name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={CourseStatus.DRAFT}>Draft</SelectItem>
                            <SelectItem value={CourseStatus.ACTIVE}>Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Draft courses are not visible to students.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isPremium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Premium Course</FormLabel>
                            <FormDescription>
                              Exclusive content for premium users
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasCertificate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Certificate</FormLabel>
                            <FormDescription>
                              Offers completion certificate
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Create Course</Button>
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
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      {course.isPremium && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                      {course.hasCertificate && (
                        <Award className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <Badge 
                      className={getBadgeColor(course.status)}
                      variant="outline"
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 mt-1">
                    {course.description}
                    {course.isPremium && (
                      <span className="block text-yellow-600 font-medium mt-1">
                        Premium course with exclusive content
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1 h-4 w-4" />
                    <span>{course.teacherName}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{course.modules} modules</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{course.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {course.enrolledStudents} students
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses
              .filter((course) => course.status === CourseStatus.ACTIVE)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <Badge 
                        className={getBadgeColor(course.status)}
                        variant="outline"
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-4 w-4" />
                      <span>{course.teacherName}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {course.enrolledStudents} students
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses
              .filter((course) => course.status === CourseStatus.DRAFT)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <Badge 
                        className={getBadgeColor(course.status)}
                        variant="outline"
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-4 w-4" />
                      <span>{course.teacherName}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {course.enrolledStudents} students
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses
              .filter((course) => course.status === CourseStatus.ARCHIVED)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <Badge 
                        className={getBadgeColor(course.status)}
                        variant="outline"
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-4 w-4" />
                      <span>{course.teacherName}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {course.enrolledStudents} students
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses
              .filter((course) => course.isPremium)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden relative">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded-bl-md">
                    PREMIUM
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <Crown className="h-4 w-4 text-yellow-500" />
                        {course.hasCertificate && (
                          <Award className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <Badge 
                        className={getBadgeColor(course.status)}
                        variant="outline"
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                      <span className="block text-yellow-600 font-medium mt-1">
                        Premium course with exclusive content
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-4 w-4" />
                      <span>{course.teacherName}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{course.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {course.enrolledStudents} students
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursesPage;
