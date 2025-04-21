
import { Notification, NotificationType } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Adapter Pattern (GoF Structural)
// This pattern allows objects with incompatible interfaces to collaborate

// External notification services (third-party interfaces)
export interface EmailService {
  sendEmail(recipient: string, subject: string, body: string): Promise<boolean>;
}

export interface SMSService {
  sendTextMessage(phoneNumber: string, message: string): Promise<boolean>;
}

export interface PushNotificationService {
  sendPush(userId: string, title: string, body: string): Promise<boolean>;
}

// Target interface for our system
export interface NotificationSender {
  send(userId: string, title: string, message: string, type: NotificationType): Promise<Notification>;
}

// Adapters for each external service
export class EmailNotificationAdapter implements NotificationSender {
  private emailService: EmailService;
  
  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }
  
  async send(userId: string, title: string, message: string, type: NotificationType): Promise<Notification> {
    // Use the adapted service
    await this.emailService.sendEmail(userId, title, message);
    
    // Return a notification object for our system
    return {
      id: uuidv4(),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date()
    };
  }
}

export class SMSNotificationAdapter implements NotificationSender {
  private smsService: SMSService;
  
  constructor(smsService: SMSService) {
    this.smsService = smsService;
  }
  
  async send(userId: string, title: string, message: string, type: NotificationType): Promise<Notification> {
    // Use the adapted service
    await this.smsService.sendTextMessage(userId, `${title}: ${message}`);
    
    // Return a notification object for our system
    return {
      id: uuidv4(),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date()
    };
  }
}

export class PushNotificationAdapter implements NotificationSender {
  private pushService: PushNotificationService;
  
  constructor(pushService: PushNotificationService) {
    this.pushService = pushService;
  }
  
  async send(userId: string, title: string, message: string, type: NotificationType): Promise<Notification> {
    // Use the adapted service
    await this.pushService.sendPush(userId, title, message);
    
    // Return a notification object for our system
    return {
      id: uuidv4(),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date()
    };
  }
}

// Client code using the adapter
export class NotificationService {
  private sender: NotificationSender;
  
  constructor(sender: NotificationSender) {
    this.sender = sender;
  }
  
  async notify(userId: string, title: string, message: string, type: NotificationType): Promise<Notification> {
    return this.sender.send(userId, title, message, type);
  }
}
