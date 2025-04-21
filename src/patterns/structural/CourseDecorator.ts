
import { Course, Module } from "@/types";

// Decorator Pattern (GoF Structural)
// This pattern allows behavior to be added to individual objects, dynamically, without affecting the behavior of other objects from the same class

// Component interface
export interface CourseComponent {
  getId(): string;
  getTitle(): string;
  getDescription(): string;
  getModules(): Module[];
}

// Concrete component
export class BasicCourse implements CourseComponent {
  private course: Course;
  
  constructor(course: Course) {
    this.course = course;
  }
  
  getId(): string {
    return this.course.id;
  }
  
  getTitle(): string {
    return this.course.title;
  }
  
  getDescription(): string {
    return this.course.description;
  }
  
  getModules(): Module[] {
    return this.course.modules;
  }
}

// Base decorator
export abstract class CourseDecorator implements CourseComponent {
  protected component: CourseComponent;
  
  constructor(component: CourseComponent) {
    this.component = component;
  }
  
  getId(): string {
    return this.component.getId();
  }
  
  getTitle(): string {
    return this.component.getTitle();
  }
  
  getDescription(): string {
    return this.component.getDescription();
  }
  
  getModules(): Module[] {
    return this.component.getModules();
  }
}

// Concrete decorators
export class CertificateEnabledCourse extends CourseDecorator {
  private certificateTemplate: string;
  
  constructor(component: CourseComponent, certificateTemplate: string) {
    super(component);
    this.certificateTemplate = certificateTemplate;
  }
  
  getCertificateTemplate(): string {
    return this.certificateTemplate;
  }
  
  generateCertificate(studentName: string): string {
    return this.certificateTemplate.replace('{studentName}', studentName);
  }
  
  getTitle(): string {
    return `${this.component.getTitle()} (Certificate Available)`;
  }
}

export class PremiumCourse extends CourseDecorator {
  private extraMaterials: string[];
  
  constructor(component: CourseComponent, extraMaterials: string[]) {
    super(component);
    this.extraMaterials = extraMaterials;
  }
  
  getExtraMaterials(): string[] {
    return this.extraMaterials;
  }
  
  getTitle(): string {
    return `${this.component.getTitle()} (Premium)`;
  }
  
  getDescription(): string {
    return `${this.component.getDescription()}\n\nThis premium course includes exclusive materials.`;
  }
}

export class TimeLimitedCourse extends CourseDecorator {
  private accessEndDate: Date;
  
  constructor(component: CourseComponent, accessEndDate: Date) {
    super(component);
    this.accessEndDate = accessEndDate;
  }
  
  getAccessEndDate(): Date {
    return this.accessEndDate;
  }
  
  isAccessible(): boolean {
    return new Date() < this.accessEndDate;
  }
  
  getDescription(): string {
    return `${this.component.getDescription()}\n\nAccess until: ${this.accessEndDate.toLocaleDateString()}`;
  }
}
