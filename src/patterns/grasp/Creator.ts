
import { Course, Module, Material, Assignment, User, UserRole, CourseStatus } from "@/types";

// GRASP Pattern: Creator
// Assigns the responsibility of creating an object to the class that aggregates it,
// contains it, records it, or closely uses it.

export class CourseCreator {
  // The CourseCreator class is responsible for creating Course objects because it
  // has the necessary knowledge to do so and maintains the information about the courses.
  
  createCourse(teacher: User, title: string, description: string): Course | null {
    // Validate that only teachers or admins can create courses
    if (teacher.role !== UserRole.TEACHER && teacher.role !== UserRole.ADMIN) {
      console.error("Only teachers and administrators can create courses");
      return null;
    }
    
    // Create the course object
    const newCourse: Course = {
      id: this.generateUniqueId(),
      title,
      description,
      teacherId: teacher.id,
      status: CourseStatus.DRAFT,
      modules: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newCourse;
  }
  
  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class ModuleCreator {
  // The ModuleCreator class is responsible for creating Module objects
  // and adding them to a Course, as it contains the knowledge about the modules.
  
  createModule(course: Course, title: string, description: string): Module {
    const newModule: Module = {
      id: this.generateUniqueId(),
      title,
      description,
      courseId: course.id,
      materials: [],
      assignments: [],
      order: course.modules.length // Set the order based on the current number of modules
    };
    
    // Add the module to the course
    course.modules.push(newModule);
    course.updatedAt = new Date();
    
    return newModule;
  }
  
  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class MaterialCreator {
  // The MaterialCreator class is responsible for creating Material objects
  // and adding them to a Module, following the Creator pattern.
  
  createMaterial(module: Module, title: string, type: string, content: string): Material {
    const newMaterial: Material = {
      id: this.generateUniqueId(),
      title,
      type: type as any, // In a real application, we would validate this properly
      content,
      moduleId: module.id,
      order: module.materials.length // Set the order based on the current number of materials
    };
    
    // Add the material to the module
    module.materials.push(newMaterial);
    
    return newMaterial;
  }
  
  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class AssignmentCreator {
  // The AssignmentCreator class is responsible for creating Assignment objects
  // and adding them to a Module, following the Creator pattern.
  
  createAssignment(
    module: Module,
    title: string,
    description: string,
    dueDate: Date,
    maxPoints: number
  ): Assignment {
    const newAssignment: Assignment = {
      id: this.generateUniqueId(),
      title,
      description,
      dueDate,
      moduleId: module.id,
      maxPoints,
      submissions: []
    };
    
    // Add the assignment to the module
    module.assignments.push(newAssignment);
    
    return newAssignment;
  }
  
  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
