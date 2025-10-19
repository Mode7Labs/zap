import type { Game } from '../core/Game';
import type { Point, GestureEvent } from '../types';
import type { Entity } from '../entities/Entity';

interface PointerState {
  id: number;
  startPos: Point;
  currentPos: Point;
  previousPos: Point;
  startTime: number;
  isDown: boolean;
}

interface PinchState {
  startDistance: number;
  target: Entity | null;
}

/**
 * Gesture recognition and handling system
 */
export class GestureManager {
  private game: Game;
  private pointers: Map<number, PointerState> = new Map();
  private longPressTimeout: number | null = null;
  private longPressThreshold: number = 500; // ms
  private swipeThreshold: number = 30; // pixels
  private tapMaxDistance: number = 10; // pixels
  private tapMaxDuration: number = 300; // ms

  private currentDragTarget: Entity | null = null;
  private currentHoverTarget: Entity | null = null;
  private lastPointerPosition: Point | null = null;
  private pinchState: PinchState | null = null;

  constructor(game: Game) {
    this.game = game;
    this.setupListeners();
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    const canvas = this.game.canvas;

    // Mouse events
    canvas.addEventListener('mousedown', this.handlePointerDown);
    canvas.addEventListener('mousemove', this.handlePointerMove);
    canvas.addEventListener('mouseup', this.handlePointerUp);
    canvas.addEventListener('mouseleave', this.handlePointerCancel);

    // Touch events
    canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', this.handleTouchEnd);
    canvas.addEventListener('touchcancel', this.handlePointerCancel);
  }

  /**
   * Remove event listeners
   */
  destroy(): void {
    const canvas = this.game.canvas;

    canvas.removeEventListener('mousedown', this.handlePointerDown);
    canvas.removeEventListener('mousemove', this.handlePointerMove);
    canvas.removeEventListener('mouseup', this.handlePointerUp);
    canvas.removeEventListener('mouseleave', this.handlePointerCancel);

    canvas.removeEventListener('touchstart', this.handleTouchStart);
    canvas.removeEventListener('touchmove', this.handleTouchMove);
    canvas.removeEventListener('touchend', this.handleTouchEnd);
    canvas.removeEventListener('touchcancel', this.handlePointerCancel);

    if (this.longPressTimeout !== null) {
      clearTimeout(this.longPressTimeout);
    }
  }

  /**
   * Get pointer position
   */
  private getPointerPosition(event: MouseEvent | Touch): Point {
    const screenPos = this.game.canvasToGame(event.clientX, event.clientY);
    // Convert from screen to world coordinates using camera transform
    return this.game.camera.screenToWorld(screenPos.x, screenPos.y);
  }

  /**
   * Find entity at position
   */
  private findEntityAtPosition(pos: Point): Entity | null {
    const scene = this.game.getScene();
    if (!scene) return null;

    const entities = scene.getEntities().filter(e => e.interactive && e.visible);

    // Check in reverse order (top to bottom)
    for (let i = entities.length - 1; i >= 0; i--) {
      const entity = entities[i];
      if (entity.containsPoint(pos.x, pos.y)) {
        return entity;
      }
    }

    return null;
  }

  private updateHoverTarget(pos: Point, forcedTarget?: Entity | null): void {
    const target = forcedTarget !== undefined ? forcedTarget : this.findEntityAtPosition(pos);

    if (target === this.currentHoverTarget) {
      return;
    }

    if (this.currentHoverTarget) {
      const previous = this.currentHoverTarget;
      const outEvent = {
        type: 'pointerout' as const,
        position: pos,
        target: previous,
      } satisfies GestureEvent;
      previous.emit('pointerout', outEvent);
      this.game.emit('pointerout', outEvent);
    }

    if (target) {
      const overEvent = {
        type: 'pointerover' as const,
        position: pos,
        target,
      } satisfies GestureEvent;
      target.emit('pointerover', overEvent);
      this.game.emit('pointerover', overEvent);
    }

    this.currentHoverTarget = target ?? null;
  }

  private clearHover(): void {
    if (!this.currentHoverTarget) return;
    const position = this.lastPointerPosition ?? this.currentHoverTarget.getWorldPosition();
    const event = {
      type: 'pointerout' as const,
      position,
      target: this.currentHoverTarget,
    } satisfies GestureEvent;
    this.currentHoverTarget.emit('pointerout', event);
    this.game.emit('pointerout', event);
    this.currentHoverTarget = null;
  }

  private emitPinch(center: Point, distance: number, scale: number): void {
    const target = this.pinchState?.target ?? null;
    const event = {
      type: 'pinch' as const,
      position: center,
      distance,
      scale,
      target: target ?? undefined,
    } satisfies GestureEvent;

    if (target) {
      target.emit('pinch', event);
    }

    this.game.emit('pinch', event);
  }

  /**
   * Handle mouse down
   */
  private handlePointerDown = (event: MouseEvent): void => {
    event.preventDefault();
    const pos = this.getPointerPosition(event);
    this.lastPointerPosition = pos;

    const pointer: PointerState = {
      id: 0,
      startPos: pos,
      currentPos: pos,
      previousPos: pos,
      startTime: performance.now(),
      isDown: true,
    };

    this.pointers.set(0, pointer);

    // Find target entity
    const target = this.findEntityAtPosition(pos);
    this.updateHoverTarget(pos, target);
    if (target) {
      this.currentDragTarget = target;
      target.emit('dragstart', {
        type: 'dragstart',
        position: pos,
        target,
      } as GestureEvent);
    }

    // Emit canvas-level dragstart
    this.game.emit('dragstart', {
      type: 'dragstart',
      position: pos,
      target,
    } as GestureEvent);

    // Start long press timer
    this.longPressTimeout = window.setTimeout(() => {
      this.handleLongPress(0);
    }, this.longPressThreshold);
  };

  /**
   * Handle mouse move
   */
  private handlePointerMove = (event: MouseEvent): void => {
    const pointer = this.pointers.get(0);
    if (!pointer) return;

    const pos = this.getPointerPosition(event);
    this.lastPointerPosition = pos;
    pointer.previousPos = pointer.currentPos;
    pointer.currentPos = pos;

    this.updateHoverTarget(pos);

    // Cancel long press if moved too much
    const distance = this.getDistance(pointer.startPos, pos);
    if (distance > this.tapMaxDistance && this.longPressTimeout !== null) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    // Handle drag
    if (pointer.isDown) {
      const delta = {
        x: pos.x - pointer.previousPos.x,
        y: pos.y - pointer.previousPos.y,
      };

      if (this.currentDragTarget) {
        this.currentDragTarget.emit('drag', {
          type: 'drag',
          position: pos,
          delta,
          target: this.currentDragTarget,
        } as GestureEvent);
      }

      // Emit canvas-level drag
      this.game.emit('drag', {
        type: 'drag',
        position: pos,
        delta,
        target: this.currentDragTarget,
      } as GestureEvent);
    }
  };

  /**
   * Handle mouse up
   */
  private handlePointerUp = (event: MouseEvent): void => {
    const pointer = this.pointers.get(0);
    if (!pointer) return;

    const pos = this.getPointerPosition(event);
    this.lastPointerPosition = pos;
    const duration = performance.now() - pointer.startTime;
    const distance = this.getDistance(pointer.startPos, pos);

    // Clear long press timer
    if (this.longPressTimeout !== null) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    const target = this.findEntityAtPosition(pointer.startPos);

    // Check for tap
    if (distance < this.tapMaxDistance && duration < this.tapMaxDuration) {
      if (target) {
        target.emit('tap', {
          type: 'tap',
          position: pos,
          target,
        } as GestureEvent);
      }

      // Emit canvas-level tap
      this.game.emit('tap', {
        type: 'tap',
        position: pos,
        target,
      } as GestureEvent);
    }
    // Check for swipe
    else if (distance > this.swipeThreshold) {
      const direction = this.getSwipeDirection(pointer.startPos, pos);
      const velocity = {
        x: (pos.x - pointer.startPos.x) / duration,
        y: (pos.y - pointer.startPos.y) / duration,
      };

      if (target) {
        target.emit('swipe', {
          type: 'swipe',
          position: pos,
          delta: { x: pos.x - pointer.startPos.x, y: pos.y - pointer.startPos.y },
          velocity,
          direction,
          distance,
          target,
        } as GestureEvent);
      }

      // Emit canvas-level swipe
      this.game.emit('swipe', {
        type: 'swipe',
        position: pos,
        delta: { x: pos.x - pointer.startPos.x, y: pos.y - pointer.startPos.y },
        velocity,
        direction,
        distance,
        target,
      } as GestureEvent);
    }

    // Handle drag end
    if (this.currentDragTarget) {
      this.currentDragTarget.emit('dragend', {
        type: 'dragend',
        position: pos,
        target: this.currentDragTarget,
      } as GestureEvent);

      // Emit canvas-level dragend
      this.game.emit('dragend', {
        type: 'dragend',
        position: pos,
        target: this.currentDragTarget,
      } as GestureEvent);

      this.currentDragTarget = null;
    }

    this.pointers.delete(0);

    this.updateHoverTarget(pos);
  };

  /**
   * Handle touch start
   */
  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault();

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const pos = this.getPointerPosition(touch);

      const pointer: PointerState = {
        id: touch.identifier,
        startPos: pos,
        currentPos: pos,
        previousPos: pos,
        startTime: performance.now(),
        isDown: true,
      };

      this.pointers.set(touch.identifier, pointer);

      // Find target entity
      const target = this.findEntityAtPosition(pos);
      if (target && !this.currentDragTarget) {
        this.currentDragTarget = target;
        target.emit('dragstart', {
          type: 'dragstart',
          position: pos,
          target,
        } as GestureEvent);
      }
    }

    // Handle pinch
    if (event.touches.length === 2) {
      this.handlePinchStart(event);
    }

    // Start long press timer for single touch
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.longPressTimeout = window.setTimeout(() => {
        this.handleLongPress(touch.identifier);
      }, this.longPressThreshold);
    }
  };

  /**
   * Handle touch move
   */
  private handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault();

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const pointer = this.pointers.get(touch.identifier);
      if (!pointer) continue;

      const pos = this.getPointerPosition(touch);
      pointer.previousPos = pointer.currentPos;
      pointer.currentPos = pos;

      // Cancel long press if moved too much
      const distance = this.getDistance(pointer.startPos, pos);
      if (distance > this.tapMaxDistance && this.longPressTimeout !== null) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = null;
      }

      // Handle drag
      const delta = {
        x: pos.x - pointer.previousPos.x,
        y: pos.y - pointer.previousPos.y,
      };

      if (this.currentDragTarget) {
        this.currentDragTarget.emit('drag', {
          type: 'drag',
          position: pos,
          delta,
          target: this.currentDragTarget,
        } as GestureEvent);
      }
    }

    // Handle pinch
    if (event.touches.length === 2) {
      this.handlePinchMove(event);
    }
  };

  /**
   * Handle touch end
   */
  private handleTouchEnd = (event: TouchEvent): void => {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const pointer = this.pointers.get(touch.identifier);
      if (!pointer) continue;

      const pos = this.getPointerPosition(touch);
      const duration = performance.now() - pointer.startTime;
      const distance = this.getDistance(pointer.startPos, pos);

      // Clear long press timer
      if (this.longPressTimeout !== null) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = null;
      }

      const target = this.findEntityAtPosition(pointer.startPos);

      // Check for tap
      if (distance < this.tapMaxDistance && duration < this.tapMaxDuration) {
        if (target) {
          target.emit('tap', {
            type: 'tap',
            position: pos,
            target,
          } as GestureEvent);
        }
      }
      // Check for swipe
      else if (distance > this.swipeThreshold) {
        const direction = this.getSwipeDirection(pointer.startPos, pos);
        const velocity = {
          x: (pos.x - pointer.startPos.x) / duration,
          y: (pos.y - pointer.startPos.y) / duration,
        };

        if (target) {
          target.emit('swipe', {
            type: 'swipe',
            position: pos,
            delta: { x: pos.x - pointer.startPos.x, y: pos.y - pointer.startPos.y },
            velocity,
            direction,
            distance,
            target,
          } as GestureEvent);
        }
      }

      // Handle drag end
      if (this.currentDragTarget && this.pointers.size === 1) {
        this.currentDragTarget.emit('dragend', {
          type: 'dragend',
          position: pos,
          target: this.currentDragTarget,
        } as GestureEvent);
        this.currentDragTarget = null;
      }

      this.pointers.delete(touch.identifier);
    }

    if (event.touches.length < 2) {
      this.pinchState = null;
    }
  };

  /**
   * Handle pointer cancel
   */
  private handlePointerCancel = (): void => {
    if (this.longPressTimeout !== null) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    this.clearHover();
    this.lastPointerPosition = null;

    if (this.currentDragTarget) {
      this.currentDragTarget.emit('dragend', {
        type: 'dragend',
        position: this.currentDragTarget.getWorldPosition(),
        target: this.currentDragTarget,
      } as GestureEvent);
      this.currentDragTarget = null;
    }

    this.pointers.clear();
    this.pinchState = null;
  };

  /**
   * Handle long press
   */
  private handleLongPress(pointerId: number): void {
    const pointer = this.pointers.get(pointerId);
    if (!pointer) return;

    const target = this.findEntityAtPosition(pointer.startPos);
    if (target) {
      target.emit('longpress', {
        type: 'longpress',
        position: pointer.currentPos,
        target,
      } as GestureEvent);
    }

    // Emit canvas-level longpress
    this.game.emit('longpress', {
      type: 'longpress',
      position: pointer.currentPos,
      target,
    } as GestureEvent);
  }

  /**
   * Handle pinch start
   */
  private handlePinchStart(event: TouchEvent): void {
    if (event.touches.length !== 2) return;

    const pos1 = this.getPointerPosition(event.touches[0]);
    const pos2 = this.getPointerPosition(event.touches[1]);
    const distance = this.getDistance(pos1, pos2);
    const center = {
      x: (pos1.x + pos2.x) / 2,
      y: (pos1.y + pos2.y) / 2,
    };

    this.pinchState = {
      startDistance: distance,
      target: this.findEntityAtPosition(center),
    };

    this.emitPinch(center, distance, 1);
  }

  /**
   * Handle pinch move
   */
  private handlePinchMove(event: TouchEvent): void {
    if (!this.pinchState || event.touches.length !== 2) return;

    const pos1 = this.getPointerPosition(event.touches[0]);
    const pos2 = this.getPointerPosition(event.touches[1]);
    const distance = this.getDistance(pos1, pos2);
    const center = {
      x: (pos1.x + pos2.x) / 2,
      y: (pos1.y + pos2.y) / 2,
    };

    if (this.pinchState.startDistance === 0) {
      this.pinchState.startDistance = distance;
    }

    const scale = distance / this.pinchState.startDistance;
    this.emitPinch(center, distance, scale);
  }

  /**
   * Get distance between two points
   */
  private getDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get swipe direction
   */
  private getSwipeDirection(start: Point, end: Point): 'up' | 'down' | 'left' | 'right' {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }
}
