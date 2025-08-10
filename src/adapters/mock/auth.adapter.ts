import { AuthPort, User, AuthCredentials, SignupData, OTPVerification } from '../../core/ports/auth.port';

const USERS_KEY = 'mera_market_users';
const CURRENT_USER_KEY = 'mera_market_current_user';
const TOKEN_KEY = 'mera_market_token';

export class MockAuthAdapter implements AuthPort {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  private loadUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      this.users = JSON.parse(stored).map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : undefined
      }));
    } else {
      // Create default admin user
      this.users = [
        {
          id: 'admin-1',
          email: 'admin@meramarket.com',
          name: 'Admin User',
          phone: '+919999999999',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
          role: 'admin' as const,
          isVerified: true,
          createdAt: new Date(),
        }
      ];
      this.saveUsers();
    }
  }

  private saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
  }

  private loadCurrentUser() {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (stored && token) {
      this.currentUser = {
        ...JSON.parse(stored),
        createdAt: new Date(JSON.parse(stored).createdAt),
        lastLoginAt: JSON.parse(stored).lastLoginAt ? new Date(JSON.parse(stored).lastLoginAt) : undefined
      };
    }
  }

  private saveCurrentUser(user: User | null, token?: string) {
    this.currentUser = user;
    if (user && token) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private generateToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async login(credentials: AuthCredentials): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const user = this.users.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, we'd verify password hash
    if (credentials.password.length < 6) {
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    this.saveUsers();
    
    const token = this.generateToken();
    this.saveCurrentUser(user, token);
    
    return { user, token };
  }

  async loginWithGoogle(): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate OAuth flow
    
    // Simulate Google login - create or find user
    const mockGoogleUser: User = {
      id: `google_${Date.now()}`,
      email: 'user@gmail.com',
      name: 'Google User',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'user',
      isVerified: true,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    let user = this.users.find(u => u.email === mockGoogleUser.email);
    if (!user) {
      user = mockGoogleUser;
      this.users.push(user);
      this.saveUsers();
    } else {
      user.lastLoginAt = new Date();
      this.saveUsers();
    }
    
    const token = this.generateToken();
    this.saveCurrentUser(user, token);
    
    return { user, token };
  }

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    this.saveUsers();
    
    const token = this.generateToken();
    this.saveCurrentUser(newUser, token);
    
    return { user: newUser, token };
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate sending OTP
    console.log(`Mock OTP sent to ${phone}: 123456`);
    
    return {
      success: true,
      message: 'OTP sent successfully'
    };
  }

  async verifyOTP(data: OTPVerification): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any OTP for demo purposes
    if (data.otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    if (this.currentUser) {
      this.currentUser.isVerified = true;
      this.currentUser.phone = data.phone;
      
      // Update in users array
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
      }
      
      const token = this.generateToken();
      this.saveCurrentUser(this.currentUser, token);
      
      return { user: this.currentUser, token };
    }
    
    throw new Error('No user session found');
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.saveCurrentUser(null);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async refreshToken(): Promise<{ token: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!this.currentUser) {
      throw new Error('No user session found');
    }
    
    const token = this.generateToken();
    this.saveCurrentUser(this.currentUser, token);
    
    return { token };
  }
}