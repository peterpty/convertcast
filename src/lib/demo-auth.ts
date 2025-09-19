// Demo authentication for testing without Supabase
export interface DemoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  timezone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEMO_USERS: Record<string, { user: DemoUser; password: string }> = {
  'demo@convertcast.ai': {
    password: 'demo123',
    user: {
      id: 'demo-user-1',
      email: 'demo@convertcast.ai',
      firstName: 'Demo',
      lastName: 'User',
      avatar: null,
      role: 'host',
      timezone: 'America/New_York',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  'peter@convertcast.ai': {
    password: 'password',
    user: {
      id: 'demo-user-2',
      email: 'peter@convertcast.ai',
      firstName: 'Peter',
      lastName: 'Tillman',
      avatar: null,
      role: 'host',
      timezone: 'America/New_York',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  'petertillmanyoung@gmail.com': {
    password: 'Titan93!',
    user: {
      id: 'demo-user-3',
      email: 'petertillmanyoung@gmail.com',
      firstName: 'Peter',
      lastName: 'Young',
      avatar: null,
      role: 'host',
      timezone: 'America/New_York',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
};

export class DemoAuth {
  private currentUser: DemoUser | null = null;

  constructor() {
    // Check if user is stored in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('demo-user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch (e) {
          localStorage.removeItem('demo-user');
        }
      }
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: DemoUser }> {
    await this.delay(800); // Simulate network delay

    const userRecord = DEMO_USERS[email.toLowerCase()];

    if (!userRecord || userRecord.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    this.currentUser = userRecord.user;

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-user', JSON.stringify(userRecord.user));
    }

    return {
      success: true,
      user: userRecord.user
    };
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ success: boolean; error?: string }> {
    await this.delay(1000);

    if (DEMO_USERS[email.toLowerCase()]) {
      return {
        success: false,
        error: 'User already exists'
      };
    }

    // In demo mode, just return success
    return {
      success: true
    };
  }

  async signOut(): Promise<void> {
    await this.delay(300);
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo-user');
    }
  }

  getCurrentUser(): DemoUser | null {
    return this.currentUser;
  }

  async getSession(): Promise<{ user: DemoUser | null }> {
    await this.delay(200);
    return { user: this.currentUser };
  }

  onAuthStateChange(callback: (user: DemoUser | null) => void): () => void {
    // In demo mode, just call once with current user
    setTimeout(() => callback(this.currentUser), 100);

    // Return unsubscribe function
    return () => {};
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const demoAuth = new DemoAuth();