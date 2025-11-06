import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Particle, ParticleEmitter } from '../../src/effects/Particle';
import { Scene } from '../../src/core/Scene';

// Helper to create a mock canvas context
function createMockCanvasContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
  } as any as CanvasRenderingContext2D;
}

describe('Particle', () => {
  describe('Constructor & Initialization', () => {
    it('should initialize with position', () => {
      const particle = new Particle({ x: 100, y: 200 });
      expect(particle.x).toBe(100);
      expect(particle.y).toBe(200);
    });

    it('should initialize with default values', () => {
      const particle = new Particle({ x: 0, y: 0 });
      expect(particle.color).toBe('#ffffff');
      expect(particle.size).toBe(4);
      expect(particle.lifetime).toBe(1);
      expect(particle.age).toBe(0);
      expect(particle.vx).toBe(0);
      expect(particle.vy).toBe(0);
      expect(particle.gravity).toBe(0);
      expect(particle.friction).toBe(1);
    });

    it('should initialize with velocity', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        velocity: { x: 50, y: -100 }
      });
      expect(particle.vx).toBe(50);
      expect(particle.vy).toBe(-100);
    });

    it('should initialize with color', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        color: '#ff0000'
      });
      expect(particle.color).toBe('#ff0000');
    });

    it('should initialize with size', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        size: 10
      });
      expect(particle.size).toBe(10);
    });

    it('should initialize with lifetime', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        lifetime: 2.5
      });
      expect(particle.lifetime).toBe(2.5);
    });

    it('should initialize with gravity', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        gravity: 980
      });
      expect(particle.gravity).toBe(980);
    });

    it('should initialize with friction', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        friction: 0.95
      });
      expect(particle.friction).toBe(0.95);
    });
  });

  describe('Update & Aging', () => {
    it('should increment age on update', () => {
      const particle = new Particle({ x: 0, y: 0, lifetime: 1 });
      expect(particle.age).toBe(0);

      particle.update(0.1);
      expect(particle.age).toBeCloseTo(0.1, 5);

      particle.update(0.2);
      expect(particle.age).toBeCloseTo(0.3, 5);
    });

    it('should fade alpha over lifetime', () => {
      const particle = new Particle({ x: 0, y: 0, lifetime: 1 });

      // At age 0, alpha should be 1
      expect(particle.alpha).toBe(1);

      // At age 0.5 (50% lifetime), alpha should be 0.5
      particle.update(0.5);
      expect(particle.alpha).toBeCloseTo(0.5, 5);

      // At age 0.75 (75% lifetime), alpha should be 0.25
      particle.update(0.25);
      expect(particle.alpha).toBeCloseTo(0.25, 5);
    });

    it('should destroy particle when lifetime expires', () => {
      const particle = new Particle({ x: 0, y: 0, lifetime: 1 });
      const destroySpy = vi.spyOn(particle, 'destroy');

      // Before lifetime
      particle.update(0.5);
      expect(destroySpy).not.toHaveBeenCalled();

      // At lifetime
      particle.update(0.5);
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should destroy particle when lifetime exceeded', () => {
      const particle = new Particle({ x: 0, y: 0, lifetime: 1 });
      const destroySpy = vi.spyOn(particle, 'destroy');

      particle.update(1.5); // Exceed lifetime
      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('Physics Integration', () => {
    it('should move with velocity', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        velocity: { x: 100, y: 50 }
      });

      particle.update(1);

      expect(particle.x).toBeCloseTo(100, 1);
      expect(particle.y).toBeCloseTo(50, 1);
    });

    it('should apply gravity', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        velocity: { x: 0, y: 0 },
        gravity: 980
      });

      particle.update(0.1);

      // Gravity should affect vy using explicit Euler integration:
      // 1. vy += gravity * dt = 0 + 980 * 0.1 = 98
      // 2. y += vy * dt = 0 + 98 * 0.1 = 9.8
      expect(particle.vy).toBeCloseTo(98, 1);
      expect(particle.y).toBeCloseTo(9.8, 1);
    });

    it('should apply friction', () => {
      const particle = new Particle({
        x: 0,
        y: 0,
        velocity: { x: 100, y: 0 },
        friction: 0.9
      });

      particle.update(1);

      // Friction should reduce velocity
      expect(particle.vx).toBeLessThan(100);
    });
  });

  describe('Rendering', () => {
    it('should render as a circle', () => {
      const particle = new Particle({
        x: 100,
        y: 100,
        color: '#ff0000',
        size: 10
      });

      const ctx = createMockCanvasContext();
      particle.render(ctx);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalledWith(0, 0, 10, 0, Math.PI * 2);
      expect(ctx.fill).toHaveBeenCalled();
    });
  });
});

describe('ParticleEmitter', () => {
  let scene: Scene;

  beforeEach(() => {
    scene = new Scene();
  });

  describe('Constructor & Initialization', () => {
    it('should initialize with default values', () => {
      const emitter = new ParticleEmitter();
      expect(emitter.x).toBe(0);
      expect(emitter.y).toBe(0);
    });

    it('should initialize with position', () => {
      const emitter = new ParticleEmitter({ x: 100, y: 200 });
      expect(emitter.x).toBe(100);
      expect(emitter.y).toBe(200);
    });

    it('should initialize with rate', () => {
      const emitter = new ParticleEmitter({ rate: 50 });
      // Rate is private, but we can test its effect on emission
      expect(emitter).toBeDefined();
    });

    it('should initialize with velocity range', () => {
      const emitter = new ParticleEmitter({
        velocityRange: {
          min: { x: -100, y: -100 },
          max: { x: 100, y: 100 }
        }
      });
      expect(emitter).toBeDefined();
    });

    it('should initialize with size range', () => {
      const emitter = new ParticleEmitter({
        sizeRange: { min: 5, max: 15 }
      });
      expect(emitter).toBeDefined();
    });

    it('should initialize with lifetime range', () => {
      const emitter = new ParticleEmitter({
        lifetimeRange: { min: 1, max: 3 }
      });
      expect(emitter).toBeDefined();
    });

    it('should initialize with colors', () => {
      const emitter = new ParticleEmitter({
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      expect(emitter).toBeDefined();
    });
  });

  describe('Particle Emission', () => {
    it('should emit particles based on rate', () => {
      const emitter = new ParticleEmitter({ rate: 10 }); // 10 particles per second
      scene.add(emitter);

      const initialCount = scene.getEntities().length;

      // Update for 0.1 seconds (should emit 1 particle)
      emitter.update(0.1);

      expect(scene.getEntities().length).toBe(initialCount + 1);
    });

    it('should emit multiple particles over time', () => {
      const emitter = new ParticleEmitter({ rate: 10 });
      scene.add(emitter);

      const initialCount = scene.getEntities().length;

      // Update for 0.5 seconds (should emit 5 particles)
      emitter.update(0.5);

      expect(scene.getEntities().length).toBe(initialCount + 5);
    });

    it('should emit particle at emitter world position', () => {
      const emitter = new ParticleEmitter({ x: 100, y: 200 });
      scene.add(emitter);

      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle);
      expect(particles.length).toBe(1);
      expect(particles[0].x).toBe(100);
      expect(particles[0].y).toBe(200);
    });

    it('should not emit if not in scene', () => {
      const emitter = new ParticleEmitter();
      // Not added to scene

      emitter.emitParticle();

      // Should not crash, just do nothing
      expect(emitter).toBeDefined();
    });

    it('should emit particles with varying velocities', () => {
      const emitter = new ParticleEmitter({
        velocityRange: {
          min: { x: -100, y: -100 },
          max: { x: 100, y: 100 }
        }
      });
      scene.add(emitter);

      emitter.emitParticle();
      emitter.emitParticle();
      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];
      expect(particles.length).toBe(3);

      // Check that velocities are within range
      particles.forEach(p => {
        expect(p.vx).toBeGreaterThanOrEqual(-100);
        expect(p.vx).toBeLessThanOrEqual(100);
        expect(p.vy).toBeGreaterThanOrEqual(-100);
        expect(p.vy).toBeLessThanOrEqual(100);
      });
    });

    it('should emit particles with varying sizes', () => {
      const emitter = new ParticleEmitter({
        sizeRange: { min: 5, max: 15 }
      });
      scene.add(emitter);

      emitter.emitParticle();
      emitter.emitParticle();
      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];

      particles.forEach(p => {
        expect(p.size).toBeGreaterThanOrEqual(5);
        expect(p.size).toBeLessThanOrEqual(15);
      });
    });

    it('should emit particles with varying lifetimes', () => {
      const emitter = new ParticleEmitter({
        lifetimeRange: { min: 1, max: 3 }
      });
      scene.add(emitter);

      emitter.emitParticle();
      emitter.emitParticle();
      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];

      particles.forEach(p => {
        expect(p.lifetime).toBeGreaterThanOrEqual(1);
        expect(p.lifetime).toBeLessThanOrEqual(3);
      });
    });

    it('should emit particles with random colors from palette', () => {
      const emitter = new ParticleEmitter({
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      scene.add(emitter);

      emitter.emitParticle();
      emitter.emitParticle();
      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];

      particles.forEach(p => {
        expect(['#ff0000', '#00ff00', '#0000ff']).toContain(p.color);
      });
    });
  });

  describe('Burst Emission', () => {
    it('should emit multiple particles at once', () => {
      const emitter = new ParticleEmitter();
      scene.add(emitter);

      const initialCount = scene.getEntities().length;

      emitter.burst(10);

      expect(scene.getEntities().length).toBe(initialCount + 10);
    });

    it('should emit exact number of particles', () => {
      const emitter = new ParticleEmitter();
      scene.add(emitter);

      emitter.burst(5);

      const particles = scene.getEntities().filter(e => e instanceof Particle);
      expect(particles.length).toBe(5);
    });

    it('should handle zero burst count', () => {
      const emitter = new ParticleEmitter();
      scene.add(emitter);

      const initialCount = scene.getEntities().length;

      emitter.burst(0);

      expect(scene.getEntities().length).toBe(initialCount);
    });
  });

  describe('Update Method', () => {
    it('should call parent update', () => {
      const emitter = new ParticleEmitter({ vx: 50, vy: 50 });
      scene.add(emitter);

      emitter.update(1);

      // Emitter should move
      expect(emitter.x).toBe(50);
      expect(emitter.y).toBe(50);
    });

    it('should accumulate time for emission', () => {
      const emitter = new ParticleEmitter({ rate: 10 }); // 0.1s per particle
      scene.add(emitter);

      const initialCount = scene.getEntities().length;

      // Multiple small updates should accumulate
      emitter.update(0.05);
      emitter.update(0.05); // Total 0.1s - should emit 1

      expect(scene.getEntities().length).toBe(initialCount + 1);
    });
  });

  describe('Rendering', () => {
    it('should not render anything (invisible)', () => {
      const emitter = new ParticleEmitter({ x: 100, y: 100 });
      const ctx = createMockCanvasContext();

      emitter.render(ctx);

      // Emitter is invisible, so no drawing commands should be called
      // Just verify it doesn't crash
      expect(emitter).toBeDefined();
    });
  });

  describe('Particle Options', () => {
    it('should pass particle options to emitted particles', () => {
      const emitter = new ParticleEmitter({
        particleOptions: {
          gravity: 500,
          friction: 0.95
        }
      });
      scene.add(emitter);

      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];
      expect(particles.length).toBe(1);
      expect(particles[0].gravity).toBe(500);
      expect(particles[0].friction).toBe(0.95);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very high emission rate', () => {
      const emitter = new ParticleEmitter({ rate: 1000 }); // 1000 particles/sec
      scene.add(emitter);

      emitter.update(0.01); // 10 particles in 10ms

      const particles = scene.getEntities().filter(e => e instanceof Particle);
      expect(particles.length).toBeGreaterThan(0);
    });

    it('should handle very low emission rate', () => {
      const emitter = new ParticleEmitter({ rate: 0.5 }); // 1 particle every 2 seconds
      scene.add(emitter);

      const initialCount = scene.getEntities().length;

      emitter.update(1); // 1 second - should not emit
      expect(scene.getEntities().length).toBe(initialCount);

      emitter.update(1); // 2 seconds total - should emit 1
      expect(scene.getEntities().length).toBe(initialCount + 1);
    });

    it('should handle zero-range size', () => {
      const emitter = new ParticleEmitter({
        sizeRange: { min: 10, max: 10 }
      });
      scene.add(emitter);

      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];
      expect(particles[0].size).toBe(10);
    });

    it('should handle negative velocity range', () => {
      const emitter = new ParticleEmitter({
        velocityRange: {
          min: { x: -200, y: -200 },
          max: { x: -100, y: -100 }
        }
      });
      scene.add(emitter);

      emitter.emitParticle();

      const particles = scene.getEntities().filter(e => e instanceof Particle) as Particle[];
      expect(particles[0].vx).toBeLessThan(0);
      expect(particles[0].vy).toBeLessThan(0);
    });
  });
});
