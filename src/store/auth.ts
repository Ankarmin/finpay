import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  failedAttempts: number;
  isLocked: boolean;
  lockUntil: number | null;
  login: (pin: string) => boolean;
  verifyBiometric: () => void;
  logout: () => void;
}

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 5 * 60 * 1000;

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  failedAttempts: 0,
  isLocked: false,
  lockUntil: null,

  login: (pin: string) => {
    const state = get();
    if (state.isLocked && state.lockUntil && Date.now() < state.lockUntil) {
      return false;
    }
    if (state.isLocked && state.lockUntil && Date.now() >= state.lockUntil) {
      set({ isLocked: false, lockUntil: null, failedAttempts: 0 });
    }
    if (pin === '123456') {
      set({ isAuthenticated: true, failedAttempts: 0, isLocked: false, lockUntil: null });
      return true;
    }
    const newAttempts = get().failedAttempts + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      set({ failedAttempts: newAttempts, isLocked: true, lockUntil: Date.now() + LOCK_DURATION });
    } else {
      set({ failedAttempts: newAttempts });
    }
    return false;
  },

  verifyBiometric: () => set({ isAuthenticated: true }),

  logout: () => set({ isAuthenticated: false }),
}));
