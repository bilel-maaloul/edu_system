
import { User, UserRole } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Factory Method Pattern (GoF Creational)
// This pattern provides an interface for creating objects but allows subclasses to alter the type of objects that will be created

export interface UserCreator {
  createUser(name: string, email: string): User;
}

export class StudentCreator implements UserCreator {
  createUser(name: string, email: string): User {
    return {
      id: uuidv4(),
      name,
      email,
      role: UserRole.STUDENT
    };
  }
}

export class TeacherCreator implements UserCreator {
  createUser(name: string, email: string): User {
    return {
      id: uuidv4(),
      name,
      email,
      role: UserRole.TEACHER
    };
  }
}

export class AdminCreator implements UserCreator {
  createUser(name: string, email: string): User {
    return {
      id: uuidv4(),
      name,
      email,
      role: UserRole.ADMIN
    };
  }
}

// Client code
export class UserService {
  createUser(name: string, email: string, role: UserRole): User {
    let creator: UserCreator;
    
    switch (role) {
      case UserRole.STUDENT:
        creator = new StudentCreator();
        break;
      case UserRole.TEACHER:
        creator = new TeacherCreator();
        break;
      case UserRole.ADMIN:
        creator = new AdminCreator();
        break;
      default:
        throw new Error("Invalid user role");
    }
    
    return creator.createUser(name, email);
  }
}
