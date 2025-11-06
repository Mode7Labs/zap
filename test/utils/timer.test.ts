import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay, interval, wait, timerManager } from '../../src/utils/timer';

describe('Timer Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    timerManager.clearAll();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('delay()', () => {
    it('should execute callback after specified delay', () => {
      const callback = vi.fn();
      delay(1000, callback);

      expect(callback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(999);
      expect(callback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return a TimerHandle with cancel method', () => {
      const callback = vi.fn();
      const handle = delay(1000, callback);

      expect(handle).toHaveProperty('id');
      expect(handle).toHaveProperty('cancel');
      expect(typeof handle.cancel).toBe('function');
    });

    it('should execute callback only once', () => {
      const callback = vi.fn();
      delay(1000, callback);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should cancel timer when cancel() is called', () => {
      const callback = vi.fn();
      const handle = delay(1000, callback);

      vi.advanceTimersByTime(500);
      handle.cancel();
      vi.advanceTimersByTime(500);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle canceling already executed timer', () => {
      const callback = vi.fn();
      const handle = delay(1000, callback);

      vi.advanceTimersByTime(1000);
      expect(() => handle.cancel()).not.toThrow();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should assign unique IDs to each timer', () => {
      const callback = vi.fn();
      const handle1 = delay(1000, callback);
      const handle2 = delay(1000, callback);
      const handle3 = delay(1000, callback);

      expect(handle1.id).not.toBe(handle2.id);
      expect(handle2.id).not.toBe(handle3.id);
    });
  });

  describe('interval()', () => {
    it('should execute callback repeatedly at specified interval', () => {
      const callback = vi.fn();
      interval(1000, callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should return a TimerHandle', () => {
      const callback = vi.fn();
      const handle = interval(1000, callback);

      expect(handle).toHaveProperty('id');
      expect(handle).toHaveProperty('cancel');
      expect(typeof handle.cancel).toBe('function');
    });

    it('should cancel interval when cancel() is called', () => {
      const callback = vi.fn();
      const handle = interval(1000, callback);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);

      handle.cancel();

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should support multiple intervals', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      interval(500, callback1);
      interval(1000, callback2);

      vi.advanceTimersByTime(500);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(callback1).toHaveBeenCalledTimes(4);
      expect(callback2).toHaveBeenCalledTimes(2);
    });
  });

  describe('wait()', () => {
    it('should return a promise', () => {
      const promise = wait(1000);
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should resolve after specified time', async () => {
      const promise = wait(100);
      const timeoutPromise = vi.advanceTimersByTimeAsync(100);

      await Promise.all([promise, timeoutPromise]);
      expect(true).toBe(true); // If we get here, promise resolved
    });
  });

  describe('timerManager.clearAll()', () => {
    it('should cancel all delays', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      delay(500, callback1);
      delay(1000, callback2);
      delay(1500, callback3);

      timerManager.clearAll();

      vi.advanceTimersByTime(2000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
    });

    it('should cancel all intervals', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      interval(500, callback1);
      interval(1000, callback2);

      vi.advanceTimersByTime(1000);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);

      timerManager.clearAll();

      vi.advanceTimersByTime(2000);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle clearing when no timers exist', () => {
      expect(() => timerManager.clearAll()).not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle mixing delays and intervals', () => {
      const delayCallback = vi.fn();
      const intervalCallback = vi.fn();

      delay(1000, delayCallback);
      interval(500, intervalCallback);

      vi.advanceTimersByTime(500);
      expect(delayCallback).not.toHaveBeenCalled();
      expect(intervalCallback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(500);
      expect(delayCallback).toHaveBeenCalledTimes(1);
      expect(intervalCallback).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(500);
      expect(delayCallback).toHaveBeenCalledTimes(1);
      expect(intervalCallback).toHaveBeenCalledTimes(3);
    });

    it('should handle delays within callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      delay(1000, () => {
        callback1();
        delay(500, callback2);
      });

      vi.advanceTimersByTime(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });
});
