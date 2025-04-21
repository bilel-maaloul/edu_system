import { Course, Assignment, Submission, User, UserRole, CourseStatus, Grade } from "@/types";

// Object Constraint Language (OCL) Constraints
// This file implements OCL-style constraints for the domain model

export class ConstraintValidator {
  // Grade constraint validation
  static validateGrade(grade: Pick<Grade, 'value'>, maxPoints: number): boolean {
    // OCL: context Grade inv: self.value >= 0 and self.value <= self.assignment.maxPoints
    return grade.value >= 0 && grade.value <= maxPoints;
  }
  
  // Constraint for submission validation
  static validateSubmission(assignment: Assignment, studentId: string): boolean {
    // OCL: context Submission inv: self.assignment.submissions->select(s | s.student = self.student)->size() = 1
    const studentSubmissions = assignment.submissions.filter(
      submission => submission.studentId === studentId
    );
    
    // Return true if the student has not submitted yet (size = 0)
    return studentSubmissions.length === 0;
  }
}

// Course constraints
export class CourseConstraint {
  static isValidStatus(status: CourseStatus): boolean {
    // OCL: context Course inv: status = CourseStatus::DRAFT or status = CourseStatus::ACTIVE or status = CourseStatus::ARCHIVED
    return Object.values(CourseStatus).includes(status);
  }

  static isTitleValid(title: string): boolean {
    // OCL: context Course inv: title.size() > 3 and title.size() < 100
    return title.length > 3 && title.length < 100;
  }

  static getDescriptionConstraint(): string {
    return "Course description must be between 10 and 500 characters.";
  }

  static isDescriptionValid(description: string): boolean {
    // OCL: context Course inv: description.size() > 10 and description.size() < 500
    return description.length > 10 && description.length < 500;
  }

  static getStatusConstraint(): string {
    return "Course status must be one of: DRAFT, ACTIVE, ARCHIVED.";
  }

  static getTitleConstraint(): string {
    return "Course title must be between 3 and 100 characters.";
  }

  static getFormalOCL(): string {
    return `
      context Course
      inv validStatus: status = CourseStatus::DRAFT or status = CourseStatus::ACTIVE or status = CourseStatus::ARCHIVED
      inv validTitle: title.size() > 3 and title.size() < 100
      inv validDescription: description.size() > 10 and description.size() < 500
    `;
  }
}

// Assignment constraints
export class AssignmentConstraint {
  static isValidDueDate(dueDate: Date): boolean {
    // OCL: context Assignment inv: dueDate > Date.now()
    return dueDate > new Date();
  }

  static isTitleValid(title: string): boolean {
    // OCL: context Assignment inv: title.size() > 3 and title.size() < 100
    return title.length > 3 && title.length < 100;
  }

  static isDescriptionValid(description: string): boolean {
    // OCL: context Assignment inv: description.size() > 10 and description.size() < 500
    return description.length > 10 && description.length < 500;
  }

  static getDueDateConstraint(): string {
    return "Due date must be in the future.";
  }

  static getTitleConstraint(): string {
    return "Assignment title must be between 3 and 100 characters.";
  }

  static getDescriptionConstraint(): string {
    return "Assignment description must be between 10 and 500 characters.";
  }

  static getFormalOCL(): string {
    return `
      context Assignment
      inv validDueDate: dueDate > Date.now()
      inv validTitle: title.size() > 3 and title.size() < 100
      inv validDescription: description.size() > 10 and description.size() < 500
    `;
  }
}

// Submission constraints
export class SubmissionConstraint {
  static validate(assignment: Assignment, studentId: string): boolean {
    // Check if the student already has a submission for this assignment
    const existingSubmissions = assignment.submissions.filter(
      submission => submission.studentId === studentId
    );
    
    // OCL: context Submission inv: self.assignment.submissions->select(s | s.student = self.student)->size() = 1
    return existingSubmissions.length === 0; // Return true only if no submission exists
  }
  
  static getConstraintDescription(): string {
    return "A student can only submit once for each assignment.";
  }
  
  static getFormalOCL(): string {
    return `
      context Submission
      inv uniqueSubmissionPerStudent: 
        self.assignment.submissions->select(s | s.studentId = self.studentId)->size() = 1
    `;
  }
}

// User constraints
export class UserConstraint {
  static isValidRole(role: UserRole): boolean {
    // OCL: context User inv: role = UserRole::STUDENT or role = UserRole::TEACHER or role = UserRole::ADMIN
    return Object.values(UserRole).includes(role);
  }

  static isEmailValid(email: string): boolean {
    // OCL: context User inv: email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    return emailRegex.test(email);
  }

  static getRoleConstraint(): string {
    return "User role must be one of: STUDENT, TEACHER, ADMIN.";
  }

  static getEmailConstraint(): string {
    return "Email must be a valid email address.";
  }

  static getFormalOCL(): string {
    return `
      context User
      inv validRole: role = UserRole::STUDENT or role = UserRole::TEACHER or role = UserRole::ADMIN
      inv validEmail: email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    `;
  }
}

// Role-based access control constraints
export class RoleConstraint {
  static canAccessCourse(user: User, course: Course): boolean {
    // OCL: context User inv: role = UserRole::ADMIN or self.courses->includes(course)
    return user.role === UserRole.ADMIN || course.teacherId === user.id;
  }

  static canModifyCourse(user: User, course: Course): boolean {
    // OCL: context User inv: role = UserRole::ADMIN or self = course.teacher
    return user.role === UserRole.ADMIN || course.teacherId === user.id;
  }

  static getAccessCourseConstraint(): string {
    return "User must be an admin or the teacher of the course to access it.";
  }

  static getModifyCourseConstraint(): string {
    return "User must be an admin or the teacher of the course to modify it.";
  }

  static getFormalOCL(): string {
    return `
      context User
      inv canAccessCourse: role = UserRole::ADMIN or self.courses->includes(course)
      inv canModifyCourse: role = UserRole::ADMIN or self = course.teacher
    `;
  }
}

// Grade constraints
export class GradeConstraint {
  static validate(grade: Grade, assignment: Assignment): boolean {
    // OCL: context Grade inv: self.value >= 0 and self.value <= self.assignment.maxPoints
    return grade.value >= 0 && grade.value <= assignment.maxPoints;
  }
  
  static getConstraintDescription(): string {
    return "A grade must be between 0 and the maximum points for the assignment.";
  }
  
  static getFormalOCL(): string {
    return `
      context Grade
      inv validGradeRange: 
        self.value >= 0 and self.value <= self.assignment.maxPoints
    `;
  }
}
