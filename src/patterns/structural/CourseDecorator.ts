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

// Base decorator with priority property
export abstract class CourseDecorator implements CourseComponent {
  protected component: CourseComponent;
  // Priority property used for sorting decorators
  protected priority: number;
  
  constructor(component: CourseComponent, priority: number) {
    this.component = component;
    this.priority = priority;
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
  
  // Getter for priority to allow sorting
  getPriority(): number {
    return this.priority;
  }
}

// Concrete decorators
export class CertificateEnabledCourse extends CourseDecorator {
  private certificateTemplate: string;
  
  constructor(component: CourseComponent, certificateTemplate: string) {
    // CertificateEnabledCourse has lowest priority (3)
    super(component, 3);
    this.certificateTemplate = certificateTemplate;
  }
  
  getCertificateTemplate(): string {
    return this.certificateTemplate;
  }
  
  generateCertificate(studentName: string): string {
    return this.certificateTemplate.replace('{studentName}', studentName);
  }
  
  getTitle(): string {
    return ${this.component.getTitle()} (Certificate Available);
  }
}

export class PremiumCourse extends CourseDecorator {
  private extraMaterials: string[];
  
  constructor(component: CourseComponent, extraMaterials: string[]) {
    // PremiumCourse has middle priority (2)
    super(component, 2);
    this.extraMaterials = extraMaterials;
  }
  
  getExtraMaterials(): string[] {
    return this.extraMaterials;
  }
  
  getTitle(): string {
    return ${this.component.getTitle()} (Premium);
  }
  
  getDescription(): string {
    return ${this.component.getDescription()}\n\nThis premium course includes exclusive materials.;
  }
}

export class TimeLimitedCourse extends CourseDecorator {
  private accessEndDate: Date;
  
  constructor(component: CourseComponent, accessEndDate: Date) {
    // TimeLimitedCourse has highest priority (1)
    super(component, 1);
    this.accessEndDate = accessEndDate;
  }
  
  getAccessEndDate(): Date {
    return this.accessEndDate;
  }
  
  isAccessible(): boolean {
    return new Date() < this.accessEndDate;
  }
  
  getDescription(): string {
    return ${this.component.getDescription()}\n\nAccess until: ${this.accessEndDate.toLocaleDateString()};
  }
}

// Factory to create and apply decorators in the correct order
export class CourseDecoratorFactory {
  // Apply decorators in order of priority
  static decorateCourse(
    course: Course, 
    options?: {
      certificateTemplate?: string;
      extraMaterials?: string[];
      accessEndDate?: Date;
    }
  ): CourseComponent {
    // Start with the basic course
    let component: CourseComponent = new BasicCourse(course);
    
    // Create an array of decorators to apply
    const decorators: CourseDecorator[] = [];
    
    // Add decorators based on provided options
    if (options?.accessEndDate) {
      decorators.push(new TimeLimitedCourse(component, options.accessEndDate));
    }
    
    if (options?.extraMaterials) {
      decorators.push(new PremiumCourse(component, options.extraMaterials));
    }
    
    if (options?.certificateTemplate) {
      decorators.push(new CertificateEnabledCourse(component, options.certificateTemplate));
    }
    
    // Sort decorators by priority (lower number = higher priority)
    // TimeLimitedCourse (1) → PremiumCourse (2) → CertificateEnabledCourse (3)
    decorators.sort((a, b) => a.getPriority() - b.getPriority());
    
    // Apply decorators in order of priority
    for (const decorator of decorators) {
      // Create a new instance of the decorator with the current component
      if (decorator instanceof TimeLimitedCourse) {
        component = new TimeLimitedCourse(component, decorator.getAccessEndDate());
      } else if (decorator instanceof PremiumCourse) {
        component = new PremiumCourse(component, decorator.getExtraMaterials());
      } else if (decorator instanceof CertificateEnabledCourse) {
        component = new CertificateEnabledCourse(component, decorator.getCertificateTemplate());
      }
    }
    
    return component;
  }
}
this.course.id
