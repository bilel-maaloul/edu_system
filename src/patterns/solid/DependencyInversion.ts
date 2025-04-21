
import { Assignment, Submission } from "@/types";

// SOLID Principle: Dependency Inversion Principle (DIP)
// High-level modules should not depend on low-level modules. 
// Both should depend on abstractions.

// Bad example: Violating DIP
export class BadSubmissionService {
  // This directly depends on a concrete database implementation
  private database: MySQLDatabase;
  
  constructor() {
    this.database = new MySQLDatabase();
  }
  
  saveSubmission(submission: Submission): void {
    // Direct dependency on MySQL specifics
    this.database.query(
      "INSERT INTO submissions (id, student_id, assignment_id, content, submitted_at) VALUES (?, ?, ?, ?, ?)",
      [submission.id, submission.studentId, submission.assignmentId, submission.content, submission.submittedAt]
    );
  }
  
  getSubmission(submissionId: string): Submission | null {
    const result = this.database.query(
      "SELECT * FROM submissions WHERE id = ?", 
      [submissionId]
    );
    
    if (result.length === 0) {
      return null;
    }
    
    // Convert from database row to domain object
    return {
      id: result[0].id,
      studentId: result[0].student_id,
      assignmentId: result[0].assignment_id,
      content: result[0].content,
      submittedAt: new Date(result[0].submitted_at),
      grade: result[0].grade,
      feedback: result[0].feedback
    };
  }
}

// Low-level module (specific implementation)
class MySQLDatabase {
  query(sql: string, params: any[]): any[] {
    // This would be actual MySQL database logic
    console.log(`Executing MySQL query: ${sql} with params:`, params);
    return [];
  }
}

// Good example: Following DIP

// Define abstractions (interfaces)
export interface DatabaseRepository {
  save(collection: string, data: any): Promise<void>;
  findById(collection: string, id: string): Promise<any | null>;
  findAll(collection: string, query?: any): Promise<any[]>;
}

export interface SubmissionRepository {
  save(submission: Submission): Promise<void>;
  findById(id: string): Promise<Submission | null>;
  findByAssignment(assignmentId: string): Promise<Submission[]>;
  findByStudent(studentId: string): Promise<Submission[]>;
}

// High-level module depends on abstraction
export class SubmissionService {
  private submissionRepository: SubmissionRepository;
  
  // Dependency is injected
  constructor(submissionRepository: SubmissionRepository) {
    this.submissionRepository = submissionRepository;
  }
  
  async saveSubmission(submission: Submission): Promise<void> {
    await this.submissionRepository.save(submission);
  }
  
  async getSubmission(submissionId: string): Promise<Submission | null> {
    return await this.submissionRepository.findById(submissionId);
  }
  
  async getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
    return await this.submissionRepository.findByAssignment(assignmentId);
  }
  
  async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    return await this.submissionRepository.findByStudent(studentId);
  }
}

// Low-level module implements the abstraction
export class MySQLSubmissionRepository implements SubmissionRepository {
  private database: DatabaseRepository;
  
  constructor(database: DatabaseRepository) {
    this.database = database;
  }
  
  async save(submission: Submission): Promise<void> {
    await this.database.save('submissions', submission);
  }
  
  async findById(id: string): Promise<Submission | null> {
    return await this.database.findById('submissions', id);
  }
  
  async findByAssignment(assignmentId: string): Promise<Submission[]> {
    return await this.database.findAll('submissions', { assignmentId });
  }
  
  async findByStudent(studentId: string): Promise<Submission[]> {
    return await this.database.findAll('submissions', { studentId });
  }
}

// Concrete database implementation
export class MySQLDatabaseRepository implements DatabaseRepository {
  async save(collection: string, data: any): Promise<void> {
    console.log(`Saving to MySQL ${collection}:`, data);
    // Actual MySQL implementation
  }
  
  async findById(collection: string, id: string): Promise<any | null> {
    console.log(`Finding in MySQL ${collection} by id: ${id}`);
    // Actual MySQL implementation
    return null;
  }
  
  async findAll(collection: string, query?: any): Promise<any[]> {
    console.log(`Finding all in MySQL ${collection} with query:`, query);
    // Actual MySQL implementation
    return [];
  }
}

// With DIP, we can easily swap database implementations
export class MongoDBDatabaseRepository implements DatabaseRepository {
  async save(collection: string, data: any): Promise<void> {
    console.log(`Saving to MongoDB ${collection}:`, data);
    // Actual MongoDB implementation
  }
  
  async findById(collection: string, id: string): Promise<any | null> {
    console.log(`Finding in MongoDB ${collection} by id: ${id}`);
    // Actual MongoDB implementation
    return null;
  }
  
  async findAll(collection: string, query?: any): Promise<any[]> {
    console.log(`Finding all in MongoDB ${collection} with query:`, query);
    // Actual MongoDB implementation
    return [];
  }
}
