
import { Course, Assignment, Module } from "@/types";

// SOLID Principle: Open/Closed Principle (OCP)
// Software entities should be open for extension, but closed for modification

// Bad example: Violating OCP
export class BadCourseEvaluator {
  evaluateCourse(course: Course): string {
    // This violates OCP because whenever we add a new course type,
    // we have to modify this method
    
    if (course.modules.length > 10) {
      return "Advanced Course";
    } else if (course.modules.length > 5) {
      return "Intermediate Course";
    } else {
      return "Beginner Course";
    }
    
    // If we want to add a new evaluation criterion, we need to modify this method
    // e.g., if we want to evaluate based on assignment count or difficulty
  }
}

// Good example: Following OCP

// Define an interface for course evaluation strategies
export interface CourseEvaluationStrategy {
  evaluate(course: Course): string;
}

// Concrete evaluation strategies
export class ModuleCountEvaluationStrategy implements CourseEvaluationStrategy {
  evaluate(course: Course): string {
    if (course.modules.length > 10) {
      return "Advanced Course";
    } else if (course.modules.length > 5) {
      return "Intermediate Course";
    } else {
      return "Beginner Course";
    }
  }
}

export class AssignmentDifficultyEvaluationStrategy implements CourseEvaluationStrategy {
  evaluate(course: Course): string {
    let totalPoints = 0;
    let assignmentCount = 0;
    
    course.modules.forEach(module => {
      module.assignments.forEach(assignment => {
        totalPoints += assignment.maxPoints;
        assignmentCount++;
      });
    });
    
    const averageDifficulty = assignmentCount > 0 ? totalPoints / assignmentCount : 0;
    
    if (averageDifficulty > 80) {
      return "Hard Course";
    } else if (averageDifficulty > 50) {
      return "Medium Course";
    } else {
      return "Easy Course";
    }
  }
}

export class TimeRequirementEvaluationStrategy implements CourseEvaluationStrategy {
  evaluate(course: Course): string {
    // Calculate estimated time based on materials and assignments
    let estimatedHours = course.modules.length * 2; // Base hours per module
    
    course.modules.forEach(module => {
      estimatedHours += module.materials.length * 0.5; // Hours per material
      estimatedHours += module.assignments.length * 3; // Hours per assignment
    });
    
    if (estimatedHours > 100) {
      return "Full Semester Course";
    } else if (estimatedHours > 50) {
      return "Half Semester Course";
    } else if (estimatedHours > 20) {
      return "Short Course";
    } else {
      return "Mini Course";
    }
  }
}

// Class that uses the strategies (follows OCP)
export class CourseEvaluator {
  private evaluationStrategy: CourseEvaluationStrategy;
  
  constructor(evaluationStrategy: CourseEvaluationStrategy) {
    this.evaluationStrategy = evaluationStrategy;
  }
  
  setEvaluationStrategy(evaluationStrategy: CourseEvaluationStrategy): void {
    this.evaluationStrategy = evaluationStrategy;
  }
  
  evaluateCourse(course: Course): string {
    // This method does not need to change when we add new evaluation strategies
    return this.evaluationStrategy.evaluate(course);
  }
}
