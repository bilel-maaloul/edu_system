
import { Course, User, Assignment, Submission } from "@/types";

// SOLID Principle: Single Responsibility Principle (SRP)
// A class should have only one reason to change

// Bad example: one class doing too many things
export class BadCourseManager {
  // Course management responsibilities
  createCourse(title: string, description: string, teacherId: string): Course {
    // Implementation...
    return {} as Course;
  }
  
  updateCourse(course: Course): void {
    // Implementation...
  }
  
  // User management responsibilities
  createUser(name: string, email: string, role: string): User {
    // Implementation...
    return {} as User;
  }
  
  updateUser(user: User): void {
    // Implementation...
  }
  
  // Assignment responsibilities
  createAssignment(title: string, description: string, dueDate: Date): Assignment {
    // Implementation...
    return {} as Assignment;
  }
  
  submitAssignment(studentId: string, assignmentId: string, content: string): void {
    // Implementation...
  }
  
  // Grading responsibilities
  gradeSubmission(submissionId: string, grade: number, feedback: string): void {
    // Implementation...
  }
}

// Good example: separate classes with single responsibilities

// Course management
export class CourseManager {
  createCourse(title: string, description: string, teacherId: string): Course {
    // Implementation...
    return {} as Course;
  }
  
  updateCourse(course: Course): void {
    // Implementation...
  }
  
  archiveCourse(courseId: string): void {
    // Implementation...
  }
}

// User management
export class UserManager {
  createUser(name: string, email: string, role: string): User {
    // Implementation...
    return {} as User;
  }
  
  updateUser(user: User): void {
    // Implementation...
  }
  
  deactivateUser(userId: string): void {
    // Implementation...
  }
}

// Assignment management
export class AssignmentManager {
  createAssignment(title: string, description: string, dueDate: Date): Assignment {
    // Implementation...
    return {} as Assignment;
  }
  
  updateAssignment(assignment: Assignment): void {
    // Implementation...
  }
  
  deleteAssignment(assignmentId: string): void {
    // Implementation...
  }
}

// Submission management
export class SubmissionManager {
  submitAssignment(studentId: string, assignmentId: string, content: string): Submission {
    // Implementation...
    return {} as Submission;
  }
  
  gradeSubmission(submissionId: string, grade: number, feedback: string): void {
    // Implementation...
  }
  
  listSubmissions(assignmentId: string): Submission[] {
    // Implementation...
    return [];
  }
}
