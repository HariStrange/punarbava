import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, _password: string, name?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fakeToken = 'fake-jwt-token-' + Date.now();
    const user: User = {
      id: '1',
      name: name || email.split('@')[0],
      email,
    };

    localStorage.setItem('auth-token', fakeToken);
    localStorage.setItem('user', JSON.stringify(user));

    set({ user, token: fakeToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
      }
    }
  },
}));
