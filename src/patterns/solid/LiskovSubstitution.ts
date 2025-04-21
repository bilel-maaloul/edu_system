
import { User, UserRole } from "@/types";

// SOLID Principle: Liskov Substitution Principle (LSP)
// Objects of a superclass should be replaceable with objects of a subclass
// without affecting the correctness of the program

// Base User class
abstract class BaseUser {
  protected id: string;
  protected name: string;
  protected email: string;
  
  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  
  getId(): string {
    return this.id;
  }
  
  getName(): string {
    return this.name;
  }
  
  getEmail(): string {
    return this.email;
  }
  
  // Common methods for all user types
  abstract getRole(): UserRole;
  abstract getPermissions(): string[];
}

// Student subclass
export class Student extends BaseUser {
  private enrolledCourseIds: string[];
  
  constructor(id: string, name: string, email: string) {
    super(id, name, email);
    this.enrolledCourseIds = [];
  }
  
  getRole(): UserRole {
    return UserRole.STUDENT;
  }
  
  getPermissions(): string[] {
    return ['view_course', 'submit_assignment', 'view_grades'];
  }
  
  enrollInCourse(courseId: string): void {
    if (!this.enrolledCourseIds.includes(courseId)) {
      this.enrolledCourseIds.push(courseId);
    }
  }
  
  getEnrolledCourseIds(): string[] {
    return [...this.enrolledCourseIds];
  }
}

// Teacher subclass
export class Teacher extends BaseUser {
  private teachingCourseIds: string[];
  
  constructor(id: string, name: string, email: string) {
    super(id, name, email);
    this.teachingCourseIds = [];
  }
  
  getRole(): UserRole {
    return UserRole.TEACHER;
  }
  
  getPermissions(): string[] {
    return [
      'view_course',
      'create_course',
      'edit_course',
      'create_assignment',
      'grade_assignment',
      'view_student_progress'
    ];
  }
  
  assignToCourse(courseId: string): void {
    if (!this.teachingCourseIds.includes(courseId)) {
      this.teachingCourseIds.push(courseId);
    }
  }
  
  getTeachingCourseIds(): string[] {
    return [...this.teachingCourseIds];
  }
}

// Admin subclass
export class Admin extends BaseUser {
  constructor(id: string, name: string, email: string) {
    super(id, name, email);
  }
  
  getRole(): UserRole {
    return UserRole.ADMIN;
  }
  
  getPermissions(): string[] {
    return [
      'view_course',
      'create_course',
      'edit_course',
      'delete_course',
      'create_assignment',
      'edit_assignment',
      'delete_assignment',
      'grade_assignment',
      'view_student_progress',
      'manage_users',
      'system_settings'
    ];
  }
}

// Client code that uses the LSP
export class UserManager {
  private users: BaseUser[] = [];
  
  addUser(user: BaseUser): void {
    this.users.push(user);
  }
  
  getUserById(id: string): BaseUser | undefined {
    return this.users.find(user => user.getId() === id);
  }
  
  getUsersWithPermission(permission: string): BaseUser[] {
    // This code works with any subclass of BaseUser
    return this.users.filter(user => user.getPermissions().includes(permission));
  }
  
  getTeachers(): BaseUser[] {
    // This code works with any subclass of BaseUser
    return this.users.filter(user => user.getRole() === UserRole.TEACHER);
  }
}
