import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from '../../src/core/EventEmitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('on()', () => {
    it('should subscribe to an event', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      emitter.emit('test', 'data');

      expect(callback).toHaveBeenCalledWith('data');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should support multiple callbacks for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.emit('test', 'data');

      expect(callback1).toHaveBeenCalledWith('data');
      expect(callback2).toHaveBeenCalledWith('data');
    });

    it('should support chaining', () => {
      const callback = vi.fn();
      const result = emitter.on('test', callback);

      expect(result).toBe(emitter);
    });

    it('should handle multiple different events', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('event1', callback1);
      emitter.on('event2', callback2);

      emitter.emit('event1', 'data1');
      expect(callback1).toHaveBeenCalledWith('data1');
      expect(callback2).not.toHaveBeenCalled();

      emitter.emit('event2', 'data2');
      expect(callback2).toHaveBeenCalledWith('data2');
    });

    it('should not call callback for unsubscribed event', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      emitter.emit('different-event');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('once()', () => {
    it('should subscribe to event only once', () => {
      const callback = vi.fn();
      emitter.once('test', callback);

      emitter.emit('test', 'data1');
      emitter.emit('test', 'data2');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('data1');
    });

    it('should support chaining', () => {
      const callback = vi.fn();
      const result = emitter.once('test', callback);

      expect(result).toBe(emitter);
    });

    it('should work with multiple once subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.once('test', callback1);
      emitter.once('test', callback2);

      emitter.emit('test', 'data');
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      emitter.emit('test', 'data2');
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should work alongside regular on() subscriptions', () => {
      const onceCallback = vi.fn();
      const onCallback = vi.fn();

      emitter.once('test', onceCallback);
      emitter.on('test', onCallback);

      emitter.emit('test', 'data1');
      expect(onceCallback).toHaveBeenCalledTimes(1);
      expect(onCallback).toHaveBeenCalledTimes(1);

      emitter.emit('test', 'data2');
      expect(onceCallback).toHaveBeenCalledTimes(1);
      expect(onCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('off()', () => {
    it('should unsubscribe specific callback', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      emitter.off('test', callback);
      emitter.emit('test', 'data');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should unsubscribe only the specified callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.off('test', callback1);
      emitter.emit('test', 'data');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith('data');
    });

    it('should unsubscribe all callbacks when no callback specified', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.off('test');
      emitter.emit('test', 'data');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it('should support chaining', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      const result = emitter.off('test', callback);

      expect(result).toBe(emitter);
    });

    it('should handle unsubscribing from non-existent event', () => {
      const callback = vi.fn();
      expect(() => emitter.off('nonexistent', callback)).not.toThrow();
    });

    it('should handle unsubscribing non-existent callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      expect(() => emitter.off('test', callback2)).not.toThrow();

      emitter.emit('test', 'data');
      expect(callback1).toHaveBeenCalledWith('data');
    });
  });

  describe('emit()', () => {
    it('should emit event with data', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      emitter.emit('test', { key: 'value' });

      expect(callback).toHaveBeenCalledWith({ key: 'value' });
    });

    it('should emit event without data', () => {
      const callback = vi.fn();
      emitter.on('test', callback);
      emitter.emit('test');

      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('should support chaining', () => {
      const result = emitter.emit('test', 'data');
      expect(result).toBe(emitter);
    });

    it('should handle emitting event with no subscribers', () => {
      expect(() => emitter.emit('nonexistent', 'data')).not.toThrow();
    });

    it('should call callbacks in order of registration', () => {
      const order: number[] = [];
      const callback1 = vi.fn(() => order.push(1));
      const callback2 = vi.fn(() => order.push(2));
      const callback3 = vi.fn(() => order.push(3));

      emitter.on('test', callback1);
      emitter.on('test', callback2);
      emitter.on('test', callback3);
      emitter.emit('test');

      expect(order).toEqual([1, 2, 3]);
    });

    it('should handle errors in callbacks gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });
      const normalCallback = vi.fn();

      emitter.on('test', errorCallback);
      emitter.on('test', normalCallback);

      // The error will propagate but shouldn't prevent other callbacks
      expect(() => emitter.emit('test')).toThrow('Callback error');
      expect(errorCallback).toHaveBeenCalled();
    });
  });

  describe('clearEvents()', () => {
    it('should remove all event listeners', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('event1', callback1);
      emitter.on('event2', callback2);
      emitter.clearEvents();

      emitter.emit('event1', 'data1');
      emitter.emit('event2', 'data2');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it('should allow new subscriptions after clearing', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on('test', callback1);
      emitter.clearEvents();
      emitter.on('test', callback2);
      emitter.emit('test', 'data');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith('data');
    });

    it('should handle clearing empty event emitter', () => {
      expect(() => emitter.clearEvents()).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should support complex event flow', () => {
      const results: string[] = [];

      emitter.on('start', () => results.push('started'));
      emitter.once('update', () => results.push('first update'));
      emitter.on('update', () => results.push('update'));
      emitter.on('end', () => results.push('ended'));

      emitter.emit('start');
      emitter.emit('update');
      emitter.emit('update');
      emitter.emit('end');

      expect(results).toEqual(['started', 'first update', 'update', 'update', 'ended']);
    });

    it('should handle method chaining', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      emitter
        .on('event1', callback1)
        .on('event2', callback2)
        .once('event3', callback3)
        .emit('event1', 'data1')
        .emit('event2', 'data2')
        .emit('event3', 'data3');

      expect(callback1).toHaveBeenCalledWith('data1');
      expect(callback2).toHaveBeenCalledWith('data2');
      expect(callback3).toHaveBeenCalledWith('data3');
    });

    it('should support unsubscribing within callback', () => {
      const callback = vi.fn(() => {
        emitter.off('test', callback);
      });

      emitter.on('test', callback);
      emitter.emit('test', 'data1');
      emitter.emit('test', 'data2');

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
