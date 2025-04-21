import { Notification, NotificationType } from "@/types";

// GRASP Pattern: Polymorphism
// Assign responsibility for different behaviors to different variants
// of the same type using polymorphic operations.

// GRASP Pattern: Protected Variation
// Identify points of predicted variation and create a stable interface around them.

// Abstract base class for notifications
export abstract class NotificationHandler {
  // Common properties for all notification types
  protected notification: Notification;
  
  constructor(notification: Notification) {
    this.notification = notification;
  }
  
  // Common method to get notification details
  getNotificationDetails(): Notification {
    return this.notification;
  }
  
  // Polymorphic method - different implementations based on notification type
  abstract formatMessage(): string;
  
  // Polymorphic method - different implementations based on notification type
  abstract getActionUrl(): string;
  
  // Polymorphic method - different implementations based on notification type
  abstract getPriority(): number;
  
  // Template method - defines skeleton of an algorithm
  sendNotification(): void {
    const formattedMessage = this.formatMessage();
    const actionUrl = this.getActionUrl();
    const priority = this.getPriority();
    
    console.log(`Sending notification with priority ${priority}`);
    console.log(`Message: ${formattedMessage}`);
    console.log(`Action URL: ${actionUrl}`);
    
    // Mark as read in the database would happen here
  }
}

// Concrete implementation for assignment notifications
export class AssignmentNotificationHandler extends NotificationHandler {
  formatMessage(): string {
    return `Assignment Notification: ${this.notification.title}\n${this.notification.message}`;
  }
  
  getActionUrl(): string {
    // In a real app, we would extract the assignment ID from the notification data
    // and construct the URL accordingly
    return `/assignments/view`;
  }
  
  getPriority(): number {
    // Assignment notifications have medium priority
    return 2;
  }
}

// Concrete implementation for grade notifications
export class GradeNotificationHandler extends NotificationHandler {
  formatMessage(): string {
    return `Grade Update: ${this.notification.title}\n${this.notification.message}`;
  }
  
  getActionUrl(): string {
    // In a real app, we would extract the course and assignment IDs from the notification data
    // and construct the URL accordingly
    return `/grades/view`;
  }
  
  getPriority(): number {
    // Grade notifications have high priority
    return 1;
  }
}

// Concrete implementation for announcement notifications
export class AnnouncementNotificationHandler extends NotificationHandler {
  formatMessage(): string {
    return `Announcement: ${this.notification.title}\n${this.notification.message}`;
  }
  
  getActionUrl(): string {
    // In a real app, we would extract the course ID from the notification data
    // and construct the URL accordingly
    return `/announcements/view`;
  }
  
  getPriority(): number {
    // Announcement notifications have medium-high priority
    return 2;
  }
}

// Concrete implementation for system notifications
export class SystemNotificationHandler extends NotificationHandler {
  formatMessage(): string {
    return `System Notification: ${this.notification.title}\n${this.notification.message}`;
  }
  
  getActionUrl(): string {
    // System notifications might not have actions
    return `/dashboard`;
  }
  
  getPriority(): number {
    // System notifications have variable priority, defaulting to medium
    return 3;
  }
}

// Factory to create the appropriate notification handler (Protected Variation)
export class NotificationHandlerFactory {
  static createHandler(notification: Notification): NotificationHandler {
    // This factory creates different handlers based on the notification type
    // This is an example of Protected Variation - isolating the decision logic
    switch (notification.type) {
      case NotificationType.ASSIGNMENT:
        return new AssignmentNotificationHandler(notification);
      case NotificationType.GRADE:
        return new GradeNotificationHandler(notification);
      case NotificationType.ANNOUNCEMENT:
        return new AnnouncementNotificationHandler(notification);
      case NotificationType.SYSTEM:
        return new SystemNotificationHandler(notification);
      default:
        // Default to system notification handler
        return new SystemNotificationHandler(notification);
    }
  }
}

// Client code showing Polymorphism in action
export class NotificationService {
  sendNotification(notification: Notification): void {
    // The client doesn't need to know which concrete handler is used
    const handler = NotificationHandlerFactory.createHandler(notification);
    handler.sendNotification();
  }
  
  // Other methods...
}
