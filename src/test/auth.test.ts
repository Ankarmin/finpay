import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/store/auth';

const resetAuthStore = () => {
  useAuthStore.setState({
    isAuthenticated: false,
    isBiometricVerified: false,
    failedAttempts: 0,
    isLocked: false,
    lockUntil: null,
  });
};

describe('auth store', () => {
  beforeEach(() => {
    resetAuthStore();
    vi.restoreAllMocks();
  });

  it('authenticates with the valid pin', () => {
    const result = useAuthStore.getState().login('123456');

    expect(result).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().failedAttempts).toBe(0);
  });

  it('locks the account after five failed attempts', () => {
    const { login } = useAuthStore.getState();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(login('000000')).toBe(false);
    }

    const state = useAuthStore.getState();
    expect(state.failedAttempts).toBe(5);
    expect(state.isLocked).toBe(true);
    expect(state.lockUntil).not.toBeNull();
  });

  it('unlocks and authenticates once the lock duration has expired', () => {
    useAuthStore.setState({
      failedAttempts: 5,
      isLocked: true,
      lockUntil: Date.now() - 1,
    });

    const result = useAuthStore.getState().login('123456');
    const state = useAuthStore.getState();

    expect(result).toBe(true);
    expect(state.isLocked).toBe(false);
    expect(state.lockUntil).toBeNull();
    expect(state.isAuthenticated).toBe(true);
  });
});
