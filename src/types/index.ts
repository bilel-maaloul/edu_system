// Core domain types for the e-learning and school management system

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin"
}

// Course related types
export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  status: CourseStatus;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CourseStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived"
}

export interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  materials: Material[];
  assignments: Assignment[];
  order: number;
}

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  content: string;
  moduleId: string;
  order: number;
}

export enum MaterialType {
  TEXT = "text",
  VIDEO = "video",
  PDF = "pdf",
  LINK = "link"
}

// Updating the Assignment interface to include maxPoints
export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  moduleId: string;
  maxPoints: number; // Changed from totalPoints to maxPoints for consistency
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  content: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

// Enrollment
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  status: EnrollmentStatus;
  progress: number;
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped"
}

// Notification system
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  ANNOUNCEMENT = "announcement",
  ASSIGNMENT = "assignment",
  GRADE = "grade",
  SYSTEM = "system"
}

// Schedule/Calendar
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  courseId?: string;
  users: string[]; // Array of user IDs
  date: Date; // Added this for the calendar implementation
  attendees?: number; // Added for attendance tracking
}

// Adding a Grade type to enforce OCL constraints
export interface Grade {
  id: string;
  value: number;
  feedback?: string;
  assignmentId: string;
  studentId: string;
  gradedBy: string;
  gradedAt: Date;
}
