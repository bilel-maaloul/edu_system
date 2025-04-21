
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GradeSubmission from "@/components/GradeSubmission";
import { Assignment, Grade, Submission } from "@/types";
import { ConstraintValidator } from "@/patterns/ocl/OCLConstraints";

const assignmentsData = [
  {
    id: "assign1",
    title: "React Fundamentals Essay",
    description: "Write a comprehensive essay about React fundamentals including hooks, components, and state management.",
    dueDate: new Date("2025-05-01"),
    moduleId: "m1",
    maxPoints: 20,
    submissions: [
      {
        id: "sub1",
        studentId: "3", // This matches the student user ID from AuthContext
        assignmentId: "assign1",
        content: "React is a JavaScript library for building user interfaces. It uses a component-based architecture which makes code reusable and maintainable. Hooks were introduced in React 16.8 to allow functional components to use state and lifecycle features.",
        submittedAt: new Date("2025-04-15"),
      }
    ]
  },
  {
    id: "assign2",
    title: "TypeScript Project",
    description: "Create a small TypeScript project demonstrating interface and type usage.",
    dueDate: new Date("2025-05-15"),
    moduleId: "m2",
    maxPoints: 20,
    submissions: [
      {
        id: "sub2",
        studentId: "3", // This matches the student user ID from AuthContext
        assignmentId: "assign2",
        content: "I've created a TypeScript project that demonstrates interface and type usage. The project includes examples of generic types, union types, and interface extension. The code is well-documented with comments explaining each concept.",
        submittedAt: new Date("2025-04-16"),
      }
    ]
  }
];

const SubmissionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState(assignmentsData);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");

  const handleSubmit = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    
    if (!assignment || !user) {
      toast({
        title: "Error",
        description: "Assignment not found or user not logged in",
        variant: "destructive",
      });
      return;
    }
    
    if (!ConstraintValidator.validateSubmission(assignment, user.id)) {
      toast({
        title: "Submission Error",
        description: "You have already submitted work for this assignment",
        variant: "destructive",
      });
      return;
    }
    
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      studentId: user.id,
      assignmentId: assignment.id,
      content: submissionContent,
      submittedAt: new Date(),
    };
    
    const updatedAssignments = assignments.map(a => 
      a.id === assignmentId 
        ? { ...a, submissions: [...a.submissions, newSubmission] }
        : a
    );
    
    setAssignments(updatedAssignments);
    setSubmissionContent("");
    setSelectedAssignment(null);
    
    toast({
      title: "Success",
      description: "Your submission has been received",
    });
  };

  const handleGrade = (grade: Grade) => {
    if (!ConstraintValidator.validateGrade(grade, 20)) {
      toast({
        title: "Invalid grade",
        description: "Grade must be between 0 and the maximum points allowed",
        variant: "destructive",
      });
      return;
    }

    setGrades([...grades, grade]);
    toast({
      title: "Grade Submitted",
      description: "The submission has been graded successfully",
    });
  };

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  return (
    <div className="space-y-6 p-6">
      {isStudent && (
        <Card>
          <CardHeader>
            <CardTitle>Available Assignments</CardTitle>
            <CardDescription>Submit your work for grading</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Max Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  const hasSubmitted = assignment.submissions.some(
                    (s) => s.studentId === user?.id
                  );
                  
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.dueDate.toLocaleDateString()}</TableCell>
                      <TableCell>{assignment.maxPoints}</TableCell>
                      <TableCell>
                        {hasSubmitted ? (
                          <Badge variant="secondary">Submitted</Badge>
                        ) : (
                          <Badge variant="default">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={hasSubmitted}
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          Submit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {isTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
            <CardDescription>Review and grade student work</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.flatMap(assignment =>
                  assignment.submissions.map(submission => {
                    const grade = grades.find(
                      g => g.assignmentId === submission.assignmentId && 
                           g.studentId === submission.studentId
                    );
                    
                    return (
                      <TableRow key={submission.id}>
                        <TableCell>Student {submission.studentId}</TableCell>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{submission.submittedAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {grade ? (
                            <Badge variant="secondary">
                              Graded: {grade.value}/{assignment.maxPoints}
                            </Badge>
                          ) : (
                            <Badge variant="default">Pending Review</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!grade && (
                            <GradeSubmission
                              submission={submission}
                              teacherId={user.id}
                              maxPoints={assignment.maxPoints}
                              onGradeSubmit={handleGrade}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedAssignment && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Assignment: {selectedAssignment.title}</CardTitle>
            <CardDescription>Due: {selectedAssignment.dueDate.toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Assignment Description</h3>
                <p className="text-sm text-gray-600">{selectedAssignment.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Your Submission</h3>
                <Textarea
                  placeholder="Enter your submission here..."
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit(selectedAssignment.id)}
              disabled={!submissionContent.trim()}
            >
              Submit Assignment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SubmissionsPage;
