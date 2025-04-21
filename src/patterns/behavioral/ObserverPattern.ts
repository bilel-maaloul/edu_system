
import { User, Notification, NotificationType } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Observer Pattern (GoF Behavioral)
// This pattern defines a one-to-many dependency between objects so that when one object changes state,
// all its dependents are notified and updated automatically

// Subject (Observable)
export interface Subject {
  register(observer: Observer): void;
  unregister(observer: Observer): void;
  notifyObservers(data: any): void;
}

// Observer
export interface Observer {
  update(data: any): void;
}

// Concrete Subject: Course
export class CourseSubject implements Subject {
  private observers: Observer[] = [];
  private courseId: string;
  
  constructor(courseId: string) {
    this.courseId = courseId;
  }
  
  register(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }
  
  unregister(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }
  
  notifyObservers(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
  
  // Methods that will trigger notifications
  addAssignment(assignmentTitle: string): void {
    // Logic to add the assignment
    const data = {
      type: 'assignment_added',
      courseId: this.courseId,
      details: {
        assignmentTitle
      }
    };
    this.notifyObservers(data);
  }
  
  publishGrade(studentId: string, assignmentTitle: string, grade: number): void {
    // Logic to publish the grade
    const data = {
      type: 'grade_published',
      courseId: this.courseId,
      details: {
        studentId,
        assignmentTitle,
        grade
      }
    };
    this.notifyObservers(data);
  }
  
  addAnnouncement(title: string, message: string): void {
    // Logic to add the announcement
    const data = {
      type: 'announcement_added',
      courseId: this.courseId,
      details: {
        title,
        message
      }
    };
    this.notifyObservers(data);
  }
}

// Concrete Observer: Student Notification
export class StudentNotificationObserver implements Observer {
  private student: User;
  
  constructor(student: User) {
    this.student = student;
  }
  
  update(data: any): void {
    let notification: Notification | null = null;
    
    switch (data.type) {
      case 'assignment_added':
        notification = {
          id: uuidv4(),
          userId: this.student.id,
          title: 'New Assignment',
          message: `A new assignment "${data.details.assignmentTitle}" has been added to your course.`,
          type: NotificationType.ASSIGNMENT,
          isRead: false,
          createdAt: new Date()
        };
        break;
      case 'grade_published':
        if (data.details.studentId === this.student.id) {
          notification = {
            id: uuidv4(),
            userId: this.student.id,
            title: 'Grade Posted',
            message: `Your grade for "${data.details.assignmentTitle}" has been posted.`,
            type: NotificationType.GRADE,
            isRead: false,
            createdAt: new Date()
          };
        }
        break;
      case 'announcement_added':
        notification = {
          id: uuidv4(),
          userId: this.student.id,
          title: data.details.title,
          message: data.details.message,
          type: NotificationType.ANNOUNCEMENT,
          isRead: false,
          createdAt: new Date()
        };
        break;
    }
    
    if (notification) {
      // In a real app, we would store this notification and inform the user
      console.log(`Notification for ${this.student.name}:`, notification);
    }
  }
}
