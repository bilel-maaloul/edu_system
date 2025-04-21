
import { Course, Module, Assignment, User, UserRole, CourseStatus } from "@/types";

// GRASP Pattern: Controller
// This pattern assigns the responsibility of dealing with system events to a class
// that represents the overall system or a use case scenario.

export class CourseController {
  // This controller serves as a coordinator between the UI and the domain model
  
  // Create a new course (only teachers and admins can do this)
  createCourse(user: User, title: string, description: string): Course | null {
    // Check if user has permission
    if (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN) {
      console.error("Only teachers and administrators can create courses");
      return null;
    }
    
    // In a real application, we would persist this to a database
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      teacherId: user.id,
      status: user.role === UserRole.ADMIN ? CourseStatus.ACTIVE : CourseStatus.DRAFT, // Admins can directly create active courses
      modules: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newCourse;
  }
  
  // Add a module to a course
  addModule(user: User, course: Course, title: string, description: string): Module | null {
    // Check if user is the teacher of the course or an admin
    if (user.id !== course.teacherId && user.role !== UserRole.ADMIN) {
      console.error("Only the course teacher or an administrator can add modules");
      return null;
    }
    
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      courseId: course.id,
      materials: [],
      assignments: [],
      order: course.modules.length // Place it at the end
    };
    
    // Update the course
    course.modules.push(newModule);
    course.updatedAt = new Date();
    
    return newModule;
  }
  
  // Add an assignment to a module
  addAssignment(
    user: User,
    course: Course,
    moduleId: string,
    title: string,
    description: string,
    dueDate: Date,
    maxPoints: number
  ): Assignment | null {
    // Check if user is the teacher of the course or an admin
    if (user.id !== course.teacherId && user.role !== UserRole.ADMIN) {
      console.error("Only the course teacher or an administrator can add assignments");
      return null;
    }
    
    // Find the module
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) {
      console.error("Module not found");
      return null;
    }
    
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      dueDate,
      moduleId,
      maxPoints,
      submissions: []
    };
    
    // Add the assignment to the module
    module.assignments.push(newAssignment);
    
    // Update the course
    course.updatedAt = new Date();
    
    return newAssignment;
  }
}
