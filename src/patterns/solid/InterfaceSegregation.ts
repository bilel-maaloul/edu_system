
import { Assignment, Submission } from "@/types";

// SOLID Principle: Interface Segregation Principle (ISP)
// No client should be forced to depend on methods it does not use

// Bad example: Violation of ISP
interface BadUserInterface {
  // Student methods
  viewCourse(courseId: string): void;
  submitAssignment(assignmentId: string, content: string): Submission;
  viewGrades(courseId: string): any[];
  
  // Teacher methods
  createCourse(title: string, description: string): void;
  createAssignment(courseId: string, title: string, description: string): Assignment;
  gradeSubmission(submissionId: string, grade: number, feedback: string): void;
  
  // Admin methods
  manageUsers(): void;
  viewSystemStats(): any;
  configurePlatform(settings: any): void;
}

// Good example: Following ISP - Breaking down into smaller, specific interfaces

// Base user interface
interface UserInterface {
  getUserId(): string;
  getUserName(): string;
  getUserEmail(): string;
}

// Student-specific interface
export interface StudentInterface extends UserInterface {
  viewCourse(courseId: string): void;
  submitAssignment(assignmentId: string, content: string): Submission;
  viewGrades(courseId: string): any[];
  viewEnrolledCourses(): string[];
}

// Teacher-specific interface
export interface TeacherInterface extends UserInterface {
  createCourse(title: string, description: string): void;
  updateCourse(courseId: string, data: any): void;
  createAssignment(courseId: string, title: string, description: string): Assignment;
  updateAssignment(assignmentId: string, data: any): void;
  gradeSubmission(submissionId: string, grade: number, feedback: string): void;
  viewTeachingCourses(): string[];
}

// Admin-specific interface
export interface AdminInterface extends UserInterface {
  manageUsers(): void;
  createUser(data: any): void;
  updateUser(userId: string, data: any): void;
  deleteUser(userId: string): void;
  viewSystemStats(): any;
  configurePlatform(settings: any): void;
}

// Now classes can implement only the interfaces they need

// Student class implements only student functionality
export class StudentUser implements StudentInterface {
  private id: string;
  private name: string;
  private email: string;
  private enrolledCourseIds: string[];
  
  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.enrolledCourseIds = [];
  }
  
  getUserId(): string {
    return this.id;
  }
  
  getUserName(): string {
    return this.name;
  }
  
  getUserEmail(): string {
    return this.email;
  }
  
  viewCourse(courseId: string): void {
    console.log(`Student ${this.name} viewing course ${courseId}`);
  }
  
  submitAssignment(assignmentId: string, content: string): Submission {
    console.log(`Student ${this.name} submitting assignment ${assignmentId}`);
    return {
      id: `submission-${Date.now()}`,
      studentId: this.id,
      assignmentId,
      content,
      submittedAt: new Date()
    };
  }
  
  viewGrades(courseId: string): any[] {
    console.log(`Student ${this.name} viewing grades for course ${courseId}`);
    return []; // Would return actual grades in a real implementation
  }
  
  viewEnrolledCourses(): string[] {
    return this.enrolledCourseIds;
  }
}

// Similarly for TeacherUser and AdminUser
export class TeacherUser implements TeacherInterface {
  private id: string;
  private name: string;
  private email: string;
  private courseIds: string[];
  
  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.courseIds = [];
  }
  
  getUserId(): string {
    return this.id;
  }
  
  getUserName(): string {
    return this.name;
  }
  
  getUserEmail(): string {
    return this.email;
  }
  
  createCourse(title: string, description: string): void {
    console.log(`Teacher ${this.name} creating course: ${title}`);
    // Implementation...
  }
  
  updateCourse(courseId: string, data: any): void {
    console.log(`Teacher ${this.name} updating course: ${courseId}`);
    // Implementation...
  }
  
  createAssignment(courseId: string, title: string, description: string): Assignment {
    console.log(`Teacher ${this.name} creating assignment: ${title} for course ${courseId}`);
    return {
      id: `assignment-${Date.now()}`,
      title,
      description,
      dueDate: new Date(),
      moduleId: "", // This would be set in a real implementation
      maxPoints: 100,
      submissions: []
    };
  }
  
  updateAssignment(assignmentId: string, data: any): void {
    console.log(`Teacher ${this.name} updating assignment: ${assignmentId}`);
    // Implementation...
  }
  
  gradeSubmission(submissionId: string, grade: number, feedback: string): void {
    console.log(`Teacher ${this.name} grading submission: ${submissionId}`);
    // Implementation...
  }
  
  viewTeachingCourses(): string[] {
    return this.courseIds;
  }
}
