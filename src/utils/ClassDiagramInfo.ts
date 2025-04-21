
// Information about the class diagram model for the E-Learning System
// This would typically be visualized with a UML tool, but we describe it here for reference

export const classDiagramDescription = `
# EduArch System Class Diagram

## Core Domain Classes

### User
- Attributes:
  - id: string
  - name: string
  - email: string
  - role: UserRole
- Relationships:
  - A User can be enrolled in many Courses (if Student)
  - A User can teach many Courses (if Teacher)
  - A User can submit many Assignments (if Student)
  - A User can receive many Notifications

### Course
- Attributes:
  - id: string
  - title: string
  - description: string
  - teacherId: string
  - status: CourseStatus
  - createdAt: Date
  - updatedAt: Date
- Relationships:
  - A Course is taught by one User (Teacher)
  - A Course has many Modules
  - A Course can have many Students enrolled

### Module
- Attributes:
  - id: string
  - title: string
  - description: string
  - courseId: string
  - order: number
- Relationships:
  - A Module belongs to one Course
  - A Module has many Materials
  - A Module has many Assignments

### Material
- Attributes:
  - id: string
  - title: string
  - type: MaterialType
  - content: string
  - moduleId: string
  - order: number
- Relationships:
  - A Material belongs to one Module

### Assignment
- Attributes:
  - id: string
  - title: string
  - description: string
  - dueDate: Date
  - moduleId: string
  - totalPoints: number
- Relationships:
  - An Assignment belongs to one Module
  - An Assignment has many Submissions

### Submission
- Attributes:
  - id: string
  - studentId: string
  - assignmentId: string
  - content: string
  - submittedAt: Date
  - grade?: number
  - feedback?: string
- Relationships:
  - A Submission is made by one User (Student)
  - A Submission belongs to one Assignment

### Enrollment
- Attributes:
  - id: string
  - studentId: string
  - courseId: string
  - enrolledAt: Date
  - status: EnrollmentStatus
  - progress: number
- Relationships:
  - An Enrollment connects one User (Student) to one Course

### Notification
- Attributes:
  - id: string
  - userId: string
  - title: string
  - message: string
  - type: NotificationType
  - isRead: boolean
  - createdAt: Date
- Relationships:
  - A Notification belongs to one User

### Event
- Attributes:
  - id: string
  - title: string
  - description?: string
  - startTime: Date
  - endTime: Date
  - location?: string
  - courseId?: string
  - users: string[] // Array of user IDs
- Relationships:
  - An Event can be associated with one Course
  - An Event can involve many Users

## Enumerations

### UserRole
- STUDENT
- TEACHER
- ADMIN

### CourseStatus
- DRAFT
- ACTIVE
- ARCHIVED

### MaterialType
- TEXT
- VIDEO
- PDF
- LINK

### EnrollmentStatus
- ACTIVE
- COMPLETED
- DROPPED

### NotificationType
- ANNOUNCEMENT
- ASSIGNMENT
- GRADE
- SYSTEM

## Design Patterns

### Creational Patterns
- Factory Method: UserFactory creates different types of users
- Builder: CourseBuilder for constructing complex course objects

### Structural Patterns
- Adapter: NotificationAdapter integrates external notification services
- Decorator: CourseDecorator adds additional features to courses
- Facade: EducationSystemFacade provides a simplified interface

### Behavioral Patterns
- Observer: Notification system for course events
- Strategy: GradingStrategy for different grading methods
- Command: AssignmentSubmissionCommand for handling submissions

## GRASP Patterns
- Controller: CourseController coordinates actions
- Information Expert: Classes handle responsibilities they have information for
- Creator: Classes create objects they contain
- High Cohesion: Classes have focused, related responsibilities

## SOLID Principles
- Single Responsibility: Each class has one reason to change
- Open/Closed: Classes can be extended without modification
- Liskov Substitution: Subtypes can be used in place of their base types
- Interface Segregation: Clients only depend on methods they use
- Dependency Inversion: High-level modules depend on abstractions

## OCL Constraints
- User Role Constraint: Users must have exactly one valid role
- Course Status Constraint: Courses must have a valid status
- Submission Constraint: Students can only submit once per assignment
- Grade Range Constraint: Grades must be within valid range
`;

export const databaseModelDescription = `
# Database Conceptual Model

## Tables

### Users
- id (PK)
- name
- email
- role
- created_at
- updated_at

### Courses
- id (PK)
- title
- description
- teacher_id (FK -> Users.id)
- status
- created_at
- updated_at

### Modules
- id (PK)
- course_id (FK -> Courses.id)
- title
- description
- order
- created_at
- updated_at

### Materials
- id (PK)
- module_id (FK -> Modules.id)
- title
- type
- content
- order
- created_at
- updated_at

### Assignments
- id (PK)
- module_id (FK -> Modules.id)
- title
- description
- due_date
- total_points
- created_at
- updated_at

### Submissions
- id (PK)
- assignment_id (FK -> Assignments.id)
- student_id (FK -> Users.id)
- content
- submitted_at
- grade
- feedback
- created_at
- updated_at

### Enrollments
- id (PK)
- course_id (FK -> Courses.id)
- student_id (FK -> Users.id)
- status
- progress
- enrolled_at
- updated_at

### Notifications
- id (PK)
- user_id (FK -> Users.id)
- title
- message
- type
- is_read
- created_at

### Events
- id (PK)
- title
- description
- start_time
- end_time
- location
- course_id (FK -> Courses.id, nullable)
- created_at
- updated_at

### EventUsers (Junction table)
- event_id (FK -> Events.id)
- user_id (FK -> Users.id)

## Relationships
- One-to-Many: Users -> Courses (A teacher can teach multiple courses)
- One-to-Many: Courses -> Modules
- One-to-Many: Modules -> Materials
- One-to-Many: Modules -> Assignments
- One-to-Many: Assignments -> Submissions
- One-to-Many: Users -> Notifications
- Many-to-Many: Users <-> Courses (through Enrollments)
- Many-to-Many: Users <-> Events (through EventUsers)
`;

// Adding a simplified rookie version of the class diagram
export const rookieClassDiagramDescription = `
# EduArch System - Rookie Design

## Main Classes

### User
- id: string
- name: string
- email: string
- role: string (student/teacher/admin)

### Course
- id: string
- title: string
- description: string
- teacherId: string

### Module
- id: string
- title: string
- description: string
- courseId: string

### Material
- id: string
- title: string
- type: string 
- content: string
- moduleId: string

### Assignment
- id: string
- title: string
- description: string
- dueDate: Date
- moduleId: string
- points: number

### Submission
- id: string
- studentId: string
- assignmentId: string
- content: string
- submittedDate: Date
- grade: number

## Simple Relationships
User -- Course : teaches
User -- Course : enrolls in
Course -- Module : contains
Module -- Material : contains
Module -- Assignment : has
Assignment -- Submission : receives
User -- Submission : submits

## Basic Functions
- createUser(name, email, role)
- createCourse(title, description, teacherId)
- addModuleToCourse(courseId, title, description)
- addMaterialToModule(moduleId, title, type, content)
- createAssignment(moduleId, title, description, dueDate, points)
- submitAssignment(assignmentId, studentId, content)
- gradeSubmission(submissionId, grade)
- enrollStudentInCourse(courseId, studentId)
`;

// Adding a comprehensive "perfect architecture" version with methods
export const perfectClassDiagramDescription = `
# EduArch System - Perfect Architecture

## Core Domain Classes with Methods

### User
- **Attributes:**
  - id: string
  - name: string
  - email: string
  - role: UserRole
  - passwordHash: string
  - lastLogin: Date
  - isActive: boolean
  - profileImage: string
  - preferences: UserPreferences
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - login(email: string, password: string): AuthToken
  - logout(): void
  - updateProfile(profileData: UserProfileDTO): User
  - resetPassword(token: string, newPassword: string): boolean
  - getEnrollments(): Enrollment[]
  - getCourses(): Course[]
  - getNotifications(filter: NotificationFilter): Notification[]
  - markNotificationAsRead(notificationId: string): void
  - getSubmissions(filter: SubmissionFilter): Submission[]
  - createSubmission(assignmentId: string, content: string): Submission
  - requestRoleChange(newRole: UserRole): RoleChangeRequest

### Course
- **Attributes:**
  - id: string
  - title: string
  - description: string
  - teacherId: string
  - status: CourseStatus
  - thumbnail: string
  - category: string
  - tags: string[]
  - startDate: Date
  - endDate: Date
  - modules: Module[]
  - enrollments: Enrollment[]
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - publish(): boolean
  - archive(): boolean
  - addModule(moduleData: ModuleDTO): Module
  - updateModule(moduleId: string, moduleData: ModuleDTO): Module
  - removeModule(moduleId: string): boolean
  - reorderModules(newOrder: string[]): boolean
  - getEnrollments(filter: EnrollmentFilter): Enrollment[]
  - enrollStudent(studentId: string): Enrollment
  - unenrollStudent(studentId: string): boolean
  - getCompletionRate(): number
  - getAverageGrade(): number
  - notifyStudents(notification: NotificationDTO): void
  - createEvent(eventData: EventDTO): Event

### Module
- **Attributes:**
  - id: string
  - title: string
  - description: string
  - courseId: string
  - order: number
  - isPublished: boolean
  - completionRequirements: CompletionRequirement[]
  - materials: Material[]
  - assignments: Assignment[]
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - addMaterial(materialData: MaterialDTO): Material
  - removeMaterial(materialId: string): boolean
  - updateMaterial(materialId: string, materialData: MaterialDTO): Material
  - reorderMaterials(newOrder: string[]): boolean
  - addAssignment(assignmentData: AssignmentDTO): Assignment
  - removeAssignment(assignmentId: string): boolean
  - updateAssignment(assignmentId: string, assignmentData: AssignmentDTO): Assignment
  - getCompletionStatus(studentId: string): CompletionStatus
  - publish(): boolean
  - unpublish(): boolean

### Material
- **Attributes:**
  - id: string
  - title: string
  - type: MaterialType
  - content: string
  - moduleId: string
  - order: number
  - duration: number
  - isRequired: boolean
  - accessCondition: AccessCondition
  - viewCount: number
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - updateContent(newContent: string): void
  - incrementViewCount(userId: string): void
  - getViewStats(): ViewStatistics
  - recordProgress(userId: string, progress: number): void
  - getStudentProgress(studentId: string): number
  - setRequired(required: boolean): void
  - setAccessCondition(condition: AccessCondition): void

### Assignment
- **Attributes:**
  - id: string
  - title: string
  - description: string
  - dueDate: Date
  - moduleId: string
  - maxPoints: number
  - passingScore: number
  - allowLateSubmissions: boolean
  - latePenalty: number
  - submissionType: SubmissionType
  - rubric: RubricItem[]
  - submissions: Submission[]
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - getSubmissions(filter: SubmissionFilter): Submission[]
  - getSubmissionByStudent(studentId: string): Submission
  - isOverdue(): boolean
  - calculateLatePenalty(submissionDate: Date): number
  - getAverageScore(): number
  - getCompletionRate(): number
  - setRubric(rubricItems: RubricItem[]): void
  - extendDeadline(newDate: Date): void
  - allowResubmission(studentId: string): void
  - validateSubmissionConstraints(studentId: string): boolean
  - notifyStudentsOfDeadline(): void

### Submission
- **Attributes:**
  - id: string
  - studentId: string
  - assignmentId: string
  - content: string
  - submittedAt: Date
  - isLate: boolean
  - grade: number
  - adjustedGrade: number
  - feedback: string
  - rubricScores: RubricScore[]
  - status: SubmissionStatus
  - graderNotes: string
  - gradedAt: Date
  - gradedBy: string
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - grade(gradeData: GradeDTO): void
  - calculateAdjustedGrade(): number
  - addFeedback(feedback: string): void
  - isGraded(): boolean
  - getTimeToDeadline(): number
  - getAssignment(): Assignment
  - getStudent(): User
  - getPercentageScore(): number
  - validateGradeConstraints(value: number): boolean

### Enrollment
- **Attributes:**
  - id: string
  - studentId: string
  - courseId: string
  - enrolledAt: Date
  - status: EnrollmentStatus
  - completedModules: string[]
  - progress: number
  - lastAccessedAt: Date
  - certificateIssued: boolean
  - grade: number
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - updateProgress(moduleId: string, completed: boolean): void
  - calculateOverallProgress(): number
  - markAsCompleted(): void
  - issueCertificate(): Certificate
  - drop(): void
  - reactivate(): void
  - getCompletedModules(): Module[]
  - getRemainingModules(): Module[]
  - trackModuleAccess(moduleId: string): void
  - getLastAccessedModule(): Module

### Notification
- **Attributes:**
  - id: string
  - userId: string
  - title: string
  - message: string
  - type: NotificationType
  - isRead: boolean
  - relatedItemId: string
  - relatedItemType: string
  - validUntil: Date
  - priority: NotificationPriority
  - createdAt: Date
- **Methods:**
  - markAsRead(): void
  - dismiss(): void
  - isExpired(): boolean
  - getRelatedItem(): any
  - deliver(): void

### Event
- **Attributes:**
  - id: string
  - title: string
  - description: string
  - startTime: Date
  - endTime: Date
  - timezone: string
  - location: string
  - isVirtual: boolean
  - meetingLink: string
  - courseId: string
  - users: string[]
  - organizer: string
  - maxAttendees: number
  - attendees: number
  - recurrence: RecurrencePattern
  - reminders: ReminderSetting[]
  - createdAt: Date
  - updatedAt: Date
- **Methods:**
  - addAttendee(userId: string): boolean
  - removeAttendee(userId: string): boolean
  - checkAvailability(): boolean
  - sendReminders(): void
  - reschedule(newStartTime: Date, newEndTime: Date): boolean
  - cancel(): void
  - getDuration(): number
  - isOngoing(): boolean
  - generateRecurrences(until: Date): Event[]
  - getCalendarEntry(): CalendarEntry

## Service Layer

### AuthService
- **Methods:**
  - login(email: string, password: string): AuthToken
  - logout(token: string): void
  - validateToken(token: string): boolean
  - refreshToken(refreshToken: string): AuthToken
  - resetPassword(email: string): void
  - changePassword(userId: string, oldPassword: string, newPassword: string): boolean
  - registerUser(userData: UserRegistrationDTO): User

### CourseService
- **Methods:**
  - createCourse(courseData: CourseDTO): Course
  - updateCourse(courseId: string, courseData: CourseDTO): Course
  - deleteCourse(courseId: string): boolean
  - getCourseById(courseId: string): Course
  - getCourses(filter: CourseFilter): Course[]
  - assignTeacher(courseId: string, teacherId: string): boolean
  - publishCourse(courseId: string): boolean
  - archiveCourse(courseId: string): boolean

### AssignmentService
- **Methods:**
  - createAssignment(assignmentData: AssignmentDTO): Assignment
  - updateAssignment(assignmentId: string, assignmentData: AssignmentDTO): Assignment
  - deleteAssignment(assignmentId: string): boolean
  - getAssignmentById(assignmentId: string): Assignment
  - getAssignmentsByModule(moduleId: string): Assignment[]
  - getUpcomingAssignments(studentId: string): Assignment[]
  - extendDeadline(assignmentId: string, newDeadline: Date): boolean

### SubmissionService
- **Methods:**
  - createSubmission(submissionData: SubmissionDTO): Submission
  - gradeSubmission(submissionId: string, gradeData: GradeDTO): Submission
  - getSubmissionById(submissionId: string): Submission
  - getSubmissionsByAssignment(assignmentId: string): Submission[]
  - getSubmissionsByStudent(studentId: string): Submission[]
  - allowResubmission(submissionId: string): boolean
  - validateSubmission(assignmentId: string, studentId: string): boolean

### EnrollmentService
- **Methods:**
  - enrollStudent(courseId: string, studentId: string): Enrollment
  - unenrollStudent(courseId: string, studentId: string): boolean
  - getEnrollment(courseId: string, studentId: string): Enrollment
  - getEnrollmentsByCourse(courseId: string): Enrollment[]
  - getEnrollmentsByStudent(studentId: string): Enrollment[]
  - updateEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus): boolean
  - trackProgress(enrollmentId: string, moduleId: string, completed: boolean): void

### NotificationService
- **Methods:**
  - createNotification(notificationData: NotificationDTO): Notification
  - markAsRead(notificationId: string): boolean
  - dismissNotification(notificationId: string): boolean
  - getNotifications(userId: string, filter: NotificationFilter): Notification[]
  - sendBulkNotifications(userIds: string[], notificationData: NotificationDTO): void
  - createCourseNotification(courseId: string, notificationData: NotificationDTO): void

### EventService
- **Methods:**
  - createEvent(eventData: EventDTO): Event
  - updateEvent(eventId: string, eventData: EventDTO): Event
  - deleteEvent(eventId: string): boolean
  - getEventById(eventId: string): Event
  - getEventsByCourse(courseId: string): Event[]
  - getEventsByUser(userId: string): Event[]
  - addAttendee(eventId: string, userId: string): boolean
  - removeAttendee(eventId: string, userId: string): boolean
  - createRecurringEvents(baseEvent: Event, recurrencePattern: RecurrencePattern): Event[]

## OCL Constraints
1. **User Role Constraint:** 
   - context User inv: self.role = UserRole::STUDENT or self.role = UserRole::TEACHER or self.role = UserRole::ADMIN

2. **Course Status Constraint:** 
   - context Course inv: self.status = CourseStatus::DRAFT or self.status = CourseStatus::ACTIVE or self.status = CourseStatus::ARCHIVED

3. **Submission Uniqueness Constraint:** 
   - context Submission inv: Assignment.allInstances()->select(a | a = self.assignment)->forAll(a | a.submissions->select(s | s.student = self.student)->size() <= 1)

4. **Grade Range Constraint:** 
   - context Submission inv: self.grade.isDefined() implies (self.grade >= 0 and self.grade <= self.assignment.maxPoints)

5. **Module Order Constraint:** 
   - context Module inv: self.order >= 0 and Course.allInstances()->select(c | c = self.course)->forAll(c | c.modules->select(m | m.order = self.order and m <> self)->isEmpty())

6. **Assignment Due Date Constraint:** 
   - context Assignment inv: self.dueDate.isDefined() implies self.dueDate >= self.createdAt

7. **Enrollment Constraint:** 
   - context Enrollment inv: self.status = EnrollmentStatus::ACTIVE or self.status = EnrollmentStatus::COMPLETED or self.status = EnrollmentStatus::DROPPED

8. **Progress Range Constraint:** 
   - context Enrollment inv: self.progress >= 0 and self.progress <= 100

9. **Teacher Assignment Constraint:** 
   - context Course inv: User.allInstances()->select(u | u.id = self.teacherId)->forAll(u | u.role = UserRole::TEACHER or u.role = UserRole::ADMIN)

10. **Material Order Constraint:** 
    - context Material inv: self.order >= 0 and Module.allInstances()->select(m | m = self.module)->forAll(m | m.materials->select(mat | mat.order = self.order and mat <> self)->isEmpty())

## Design Patterns Implementation

### Creational Patterns
- **Factory Method:** UserFactory creates different user types with appropriate permissions
- **Builder:** CourseBuilder allows step-by-step construction of complex course structures
- **Abstract Factory:** ContentFactory creates different types of learning content
- **Singleton:** AuthenticationService ensures a single authentication point

### Structural Patterns
- **Adapter:** LegacySystemAdapter connects to older school management systems
- **Composite:** CourseStructureComposite treats individual materials and groups uniformly
- **Decorator:** CourseFeatureDecorator adds premium features to courses
- **Facade:** LearningSystemFacade simplifies the complex subsystem of learning components
- **Proxy:** ContentAccessProxy controls access to protected learning materials

### Behavioral Patterns
- **Observer:** NotificationObserver keeps users updated on relevant events
- **Strategy:** GradingStrategy allows different grading algorithms per assignment
- **Command:** UserActionCommand encapsulates and logs user operations
- **Chain of Responsibility:** ApprovalChain for course publishing process
- **State:** CourseState manages different states of a course lifecycle
- **Template Method:** AssessmentTemplate defines skeleton for different assessment types
- **Visitor:** AnalyticsVisitor gathers statistics across different elements
- **Mediator:** CourseCoordinator coordinates interactions between modules
- **Memento:** SystemStateMemento creates save points of system state

## GRASP Patterns
- **Controller:** CourseController coordinates system events
- **Creator:** CourseCreator handles course instantiation
- **Information Expert:** AssignmentTracker manages assignment data
- **Low Coupling:** Independent service modules minimize dependencies
- **High Cohesion:** Focused responsibilities in each service
- **Polymorphism:** Different notification types share interface but implement differently
- **Pure Fabrication:** EnrollmentManager handles enrollment logic
- **Indirection:** EventMediator reduces coupling between components
- **Protected Variations:** DataAccessInterface protects against database changes

## SOLID Principles Implementation
- **Single Responsibility:** Each class has one focused purpose
- **Open/Closed:** ExtensibleGradingSystem allows new grading strategies without modification
- **Liskov Substitution:** AdminUser can be used anywhere a User is expected
- **Interface Segregation:** Focused interfaces like Gradable, Enrollable
- **Dependency Inversion:** High-level modules depend on abstractions, not details
`;
