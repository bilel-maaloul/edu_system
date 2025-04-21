
import { Submission, Assignment } from "@/types";

// GRASP Pattern: Information Expert
// Assign a responsibility to the class that has the information needed to fulfill it

// Each class is responsible for the data it knows best

// Assignment class is the information expert for tasks related to assignments
export class AssignmentExpert {
  private assignment: Assignment;
  
  constructor(assignment: Assignment) {
    this.assignment = assignment;
  }
  
  // The AssignmentExpert knows about all submissions for this assignment
  getSubmissionCount(): number {
    return this.assignment.submissions.length;
  }
  
  // It knows which submissions have been graded
  getGradedSubmissionsCount(): number {
    return this.assignment.submissions.filter(submission => 
      submission.grade !== undefined
    ).length;
  }
  
  // It can calculate the average grade
  getAverageGrade(): number {
    const gradedSubmissions = this.assignment.submissions.filter(
      submission => submission.grade !== undefined
    );
    
    if (gradedSubmissions.length === 0) {
      return 0;
    }
    
    const totalGrade = gradedSubmissions.reduce(
      (sum, submission) => sum + (submission.grade || 0), 
      0
    );
    
    return totalGrade / gradedSubmissions.length;
  }
  
  // It can check if a submission is late
  isSubmissionLate(submission: Submission): boolean {
    return submission.submittedAt > this.assignment.dueDate;
  }
  
  // It knows how many submissions were submitted after the due date
  getLateSubmissionsCount(): number {
    return this.assignment.submissions.filter(submission => 
      this.isSubmissionLate(submission)
    ).length;
  }
  
  // It can check if a student has submitted
  hasStudentSubmitted(studentId: string): boolean {
    return this.assignment.submissions.some(
      submission => submission.studentId === studentId
    );
  }
  
  // It can get a specific student's submission
  getStudentSubmission(studentId: string): Submission | undefined {
    return this.assignment.submissions.find(
      submission => submission.studentId === studentId
    );
  }
  
  // It can tell if all submissions have been graded
  areAllSubmissionsGraded(): boolean {
    if (this.assignment.submissions.length === 0) {
      return false;
    }
    
    return this.assignment.submissions.every(
      submission => submission.grade !== undefined
    );
  }
}

// Submission class is the information expert for tasks related to submissions
export class SubmissionExpert {
  private submission: Submission;
  private assignment: Assignment;
  
  constructor(submission: Submission, assignment: Assignment) {
    this.submission = submission;
    this.assignment = assignment;
  }
  
  // The SubmissionExpert can determine its own grade status
  isGraded(): boolean {
    return this.submission.grade !== undefined;
  }
  
  // It knows how many points were achieved
  getPointsAchieved(): number {
    return this.submission.grade || 0;
  }
  
  // It can calculate percentage score
  getPercentageScore(): number {
    if (!this.isGraded()) {
      return 0;
    }
    
    return ((this.submission.grade || 0) / this.assignment.maxPoints) * 100;
  }
  
  // It knows if it was submitted on time
  isSubmittedOnTime(): boolean {
    return this.submission.submittedAt <= this.assignment.dueDate;
  }
  
  // It knows how many days late it was (or 0 if on time)
  getDaysLate(): number {
    if (this.isSubmittedOnTime()) {
      return 0;
    }
    
    const difference = this.submission.submittedAt.getTime() - this.assignment.dueDate.getTime();
    const daysDifference = Math.ceil(difference / (1000 * 3600 * 24));
    
    return daysDifference;
  }
  
  // It can determine if it passed
  isPassing(): boolean {
    if (!this.isGraded()) {
      return false;
    }
    
    // Assuming 60% is passing
    return this.getPercentageScore() >= 60;
  }
  
  // It knows if feedback has been provided
  hasFeedback(): boolean {
    return this.submission.feedback !== undefined && 
           this.submission.feedback.trim() !== '';
  }
}
