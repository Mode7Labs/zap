# Test Suite Documentation

## Overview

Comprehensive test suite for the Axia game engine using Vitest with full coverage reporting.

## Current Status

✅ **320 tests passing** (100% pass rate)
⚡ **Fast execution**: Tests run in <70ms
🐛 **3 critical bugs found and fixed**

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with UI
npm run test:ui
```

## Test Coverage

### ✅ Fully Tested (100% Coverage)

| Module | Tests | Coverage | Status |
|--------|-------|----------|--------|
| EventEmitter | 27 | 100% | ✅ Complete |
| Math utilities | 41 | 100% | ✅ Complete |
| Easing functions | 166 | 100% | ✅ Complete |
| Timer utilities | 17 | 100% | ✅ Complete |
| Tween animations | 41 | 100% | ✅ Complete |
| TweenManager | 28 | 100% | ✅ Complete |

**Total: 320 tests**

### ⏳ Not Yet Tested (0% Coverage)

| Module | Priority | Complexity | Notes |
|--------|----------|-----------|-------|
| Entity | High | Very High | Physics, collision, hierarchy - critical |
| Scene | High | High | Entity management, collision loops |
| Camera | Medium | Medium | Transformations, following, shake |
| Game | High | High | Core loop, FPS, lifecycle |
| GestureManager | Medium | Very High | Multi-touch, gesture recognition |
| Sprite | Medium | Medium | Animations, rendering |
| Text | Low | Low | Text rendering |
| Particle | Low | Medium | Particle system |
| Button | Low | Low | UI component |
| AudioManager | Low | Medium | Sound management |

## Bugs Found During Testing

See [BUGS_FOUND.md](../BUGS_FOUND.md) for detailed information.

### Critical Bugs Fixed

1. **Division by Zero in Tween** - Zero duration tweens returned NaN
2. **Delay Overflow Bug** - Delayed tweens applied wrong deltaTime
3. **Delay State Management** - Subsequent frames after delay used wrong time

### Test Environment Issues Fixed

4. **Memory Exhaustion** - Async timer tests with fake timers
5. **Floating-Point Precision** - Easing function sampling errors

## Test Structure

```
test/
├── setup.ts                      # Canvas/Image mocks, test environment
├── core/
│   └── EventEmitter.test.ts     # Pub/sub system tests
├── effects/
│   ├── Tween.test.ts            # Animation interpolation tests
│   └── TweenManager.test.ts     # Multi-tween management tests
└── utils/
    ├── math.test.ts             # Math utility tests
    ├── easing.test.ts           # All 21 easing function tests
    └── timer.test.ts            # Delay/interval/promise tests
```

## Test Patterns

### Testing Canvas Code

Tests use mocked Canvas and CanvasRenderingContext2D:

```typescript
it('should render on canvas', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // ctx is automatically mocked with vi.fn() spies
});
```

### Testing Timers

Use fake timers for deterministic testing:

```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

it('should delay callback', () => {
  const callback = vi.fn();
  delay(1000, callback);

  vi.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
});
```

### Testing Animations

Test tweens with precise time steps:

```typescript
it('should interpolate values', () => {
  const target = { x: 0 };
  const tween = new Tween(target, { x: 100 }, { duration: 1000 });

  tween.update(0.5); // 500ms
  expect(target.x).toBe(50);
});
```

## Next Steps

### Priority 1: Entity System (High Priority)

The Entity system is the most complex and critical component:

- **Physics simulation** - Velocity, acceleration, gravity, friction
- **Collision detection** - 5 collision types (circle-circle, circle-rect, rect-rect, etc.)
- **Transform hierarchy** - Parent-child relationships
- **Boundary checking** - Edge cases for collision
- **Sub-stepping** - Fast-moving object tunneling

### Priority 2: Scene & Game (High Priority)

Core game loop and scene management:

- **Game loop** - FPS targeting, delta time clamping
- **Scene lifecycle** - onEnter, onExit, transitions
- **Entity management** - Adding, removing, sorting
- **Collision loops** - All entities checking against each other

### Priority 3: Camera & GestureManager (Medium Priority)

- **Camera transforms** - Screen to world, world to screen
- **Gesture recognition** - Tap, swipe, drag, pinch thresholds
- **Multi-touch handling** - Concurrent touches

## Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  }
}
```

**Current overall coverage**: 10.5% (only utilities tested so far)
**Target**: 80%+ coverage

## Contributing Tests

When adding new tests:

1. **Follow existing patterns** - See examples above
2. **Test edge cases** - Zero values, overflow, negative numbers
3. **Use descriptive test names** - "should do X when Y happens"
4. **Mock canvas operations** - Use provided setup.ts mocks
5. **Clean up after tests** - Use beforeEach/afterEach properly
6. **Test error conditions** - Not just happy paths

## Performance

Tests are optimized for speed:

- Fast execution: <70ms for 320 tests
- Minimal setup overhead
- Efficient mocking
- Parallel execution

## Known Issues

None! All tests passing. 🎉

---

For bug reports and detailed analysis, see [BUGS_FOUND.md](../BUGS_FOUND.md)
