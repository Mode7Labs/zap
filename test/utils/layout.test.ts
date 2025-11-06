import { describe, it, expect } from 'vitest';
import { layoutGrid, layoutCircle, layoutRow, layoutColumn, center } from '../../src/utils/layout';
import { Entity } from '../../src/entities/Entity';

describe('Layout', () => {
  describe('layoutGrid()', () => {
    it('should position entities in a grid', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity(),
        new Entity()
      ];

      layoutGrid(entities, {
        columns: 2,
        rows: 2,
        cellWidth: 100,
        cellHeight: 100
      });

      // First row
      expect(entities[0].x).toBe(50);  // cellWidth/2
      expect(entities[0].y).toBe(50);  // cellHeight/2
      expect(entities[1].x).toBe(150); // 100 + cellWidth/2
      expect(entities[1].y).toBe(50);

      // Second row
      expect(entities[2].x).toBe(50);
      expect(entities[2].y).toBe(150);
      expect(entities[3].x).toBe(150);
      expect(entities[3].y).toBe(150);
    });

    it('should handle spacing between cells', () => {
      const entities = [new Entity(), new Entity()];

      layoutGrid(entities, {
        columns: 2,
        rows: 1,
        cellWidth: 100,
        cellHeight: 100,
        spacing: 20
      });

      expect(entities[0].x).toBe(50);
      expect(entities[1].x).toBe(170); // 100 + 20 (spacing) + 50
    });

    it('should respect startX and startY', () => {
      const entities = [new Entity()];

      layoutGrid(entities, {
        columns: 1,
        rows: 1,
        cellWidth: 100,
        cellHeight: 100,
        startX: 200,
        startY: 300
      });

      expect(entities[0].x).toBe(250); // 200 + cellWidth/2
      expect(entities[0].y).toBe(350); // 300 + cellHeight/2
    });

    it('should handle more entities than grid cells', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity(),
        new Entity(),
        new Entity()
      ];

      layoutGrid(entities, {
        columns: 2,
        rows: 2,
        cellWidth: 100,
        cellHeight: 100
      });

      // Only first 4 should be positioned
      expect(entities[0].x).toBe(50);
      expect(entities[1].x).toBe(150);
      expect(entities[2].x).toBe(50);
      expect(entities[3].x).toBe(150);

      // Fifth entity should remain at origin (not positioned)
      expect(entities[4].x).toBe(0);
      expect(entities[4].y).toBe(0);
    });

    it('should handle fewer entities than grid cells', () => {
      const entities = [new Entity(), new Entity()];

      layoutGrid(entities, {
        columns: 3,
        rows: 3,
        cellWidth: 100,
        cellHeight: 100
      });

      // Both entities should be positioned in first row
      expect(entities[0].x).toBe(50);
      expect(entities[0].y).toBe(50);
      expect(entities[1].x).toBe(150);
      expect(entities[1].y).toBe(50);
    });

    it('should handle empty entity array', () => {
      const entities: Entity[] = [];

      expect(() => {
        layoutGrid(entities, {
          columns: 2,
          rows: 2,
          cellWidth: 100,
          cellHeight: 100
        });
      }).not.toThrow();
    });

    it('should handle single entity', () => {
      const entities = [new Entity()];

      layoutGrid(entities, {
        columns: 1,
        rows: 1,
        cellWidth: 50,
        cellHeight: 50
      });

      expect(entities[0].x).toBe(25);
      expect(entities[0].y).toBe(25);
    });

    it('should handle non-square cells', () => {
      const entities = [new Entity(), new Entity()];

      layoutGrid(entities, {
        columns: 2,
        rows: 1,
        cellWidth: 200,
        cellHeight: 50
      });

      expect(entities[0].x).toBe(100); // cellWidth/2
      expect(entities[0].y).toBe(25);  // cellHeight/2
      expect(entities[1].x).toBe(300); // 200 + cellWidth/2
      expect(entities[1].y).toBe(25);
    });
  });

  describe('layoutCircle()', () => {
    it('should position entities in a circle', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity(),
        new Entity()
      ];

      layoutCircle(entities, 0, 0, 100);

      // First entity at angle 0
      expect(entities[0].x).toBeCloseTo(100, 1);
      expect(entities[0].y).toBeCloseTo(0, 1);

      // Second entity at angle PI/2 (90 degrees)
      expect(entities[1].x).toBeCloseTo(0, 1);
      expect(entities[1].y).toBeCloseTo(100, 1);

      // Third entity at angle PI (180 degrees)
      expect(entities[2].x).toBeCloseTo(-100, 1);
      expect(entities[2].y).toBeCloseTo(0, 1);

      // Fourth entity at angle 3*PI/2 (270 degrees)
      expect(entities[3].x).toBeCloseTo(0, 1);
      expect(entities[3].y).toBeCloseTo(-100, 1);
    });

    it('should handle custom start angle', () => {
      const entities = [new Entity()];

      layoutCircle(entities, 0, 0, 100, Math.PI / 2); // Start at 90 degrees

      expect(entities[0].x).toBeCloseTo(0, 1);
      expect(entities[0].y).toBeCloseTo(100, 1);
    });

    it('should position around custom center', () => {
      const entities = [new Entity()];

      layoutCircle(entities, 200, 300, 50);

      expect(entities[0].x).toBeCloseTo(250, 1);
      expect(entities[0].y).toBeCloseTo(300, 1);
    });

    it('should handle single entity', () => {
      const entities = [new Entity()];

      layoutCircle(entities, 0, 0, 100);

      // Single entity at 0 radians
      expect(entities[0].x).toBeCloseTo(100, 1);
      expect(entities[0].y).toBeCloseTo(0, 1);
    });

    it('should evenly distribute entities', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity()
      ];

      layoutCircle(entities, 0, 0, 100);

      // Three entities, 120 degrees apart
      const angleStep = (Math.PI * 2) / 3;

      expect(entities[0].x).toBeCloseTo(100, 1);
      expect(entities[0].y).toBeCloseTo(0, 1);

      expect(entities[1].x).toBeCloseTo(100 * Math.cos(angleStep), 1);
      expect(entities[1].y).toBeCloseTo(100 * Math.sin(angleStep), 1);

      expect(entities[2].x).toBeCloseTo(100 * Math.cos(2 * angleStep), 1);
      expect(entities[2].y).toBeCloseTo(100 * Math.sin(2 * angleStep), 1);
    });

    it('should handle zero radius', () => {
      const entities = [new Entity(), new Entity()];

      layoutCircle(entities, 50, 50, 0);

      // All entities at center
      expect(entities[0].x).toBeCloseTo(50, 1);
      expect(entities[0].y).toBeCloseTo(50, 1);
      expect(entities[1].x).toBeCloseTo(50, 1);
      expect(entities[1].y).toBeCloseTo(50, 1);
    });

    it('should handle negative radius', () => {
      const entities = [new Entity()];

      layoutCircle(entities, 0, 0, -100);

      // Negative radius inverts position
      expect(entities[0].x).toBeCloseTo(-100, 1);
      expect(entities[0].y).toBeCloseTo(0, 1);
    });

    it('should handle empty entity array', () => {
      expect(() => layoutCircle([], 0, 0, 100)).not.toThrow();
    });
  });

  describe('layoutRow()', () => {
    it('should position entities in a horizontal row', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity()
      ];

      layoutRow(entities, 0, 100, 50);

      expect(entities[0].x).toBe(0);
      expect(entities[0].y).toBe(100);

      expect(entities[1].x).toBe(50);
      expect(entities[1].y).toBe(100);

      expect(entities[2].x).toBe(100);
      expect(entities[2].y).toBe(100);
    });

    it('should respect start position', () => {
      const entities = [new Entity(), new Entity()];

      layoutRow(entities, 200, 300, 100);

      expect(entities[0].x).toBe(200);
      expect(entities[0].y).toBe(300);

      expect(entities[1].x).toBe(300);
      expect(entities[1].y).toBe(300);
    });

    it('should handle negative spacing', () => {
      const entities = [new Entity(), new Entity(), new Entity()];

      layoutRow(entities, 100, 50, -25);

      expect(entities[0].x).toBe(100);
      expect(entities[1].x).toBe(75);  // 100 - 25
      expect(entities[2].x).toBe(50);  // 75 - 25
    });

    it('should handle zero spacing', () => {
      const entities = [new Entity(), new Entity()];

      layoutRow(entities, 50, 50, 0);

      expect(entities[0].x).toBe(50);
      expect(entities[1].x).toBe(50); // Same position
    });

    it('should handle single entity', () => {
      const entities = [new Entity()];

      layoutRow(entities, 100, 200, 50);

      expect(entities[0].x).toBe(100);
      expect(entities[0].y).toBe(200);
    });

    it('should handle empty entity array', () => {
      expect(() => layoutRow([], 0, 0, 10)).not.toThrow();
    });
  });

  describe('layoutColumn()', () => {
    it('should position entities in a vertical column', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity()
      ];

      layoutColumn(entities, 100, 0, 50);

      expect(entities[0].x).toBe(100);
      expect(entities[0].y).toBe(0);

      expect(entities[1].x).toBe(100);
      expect(entities[1].y).toBe(50);

      expect(entities[2].x).toBe(100);
      expect(entities[2].y).toBe(100);
    });

    it('should respect start position', () => {
      const entities = [new Entity(), new Entity()];

      layoutColumn(entities, 200, 300, 100);

      expect(entities[0].x).toBe(200);
      expect(entities[0].y).toBe(300);

      expect(entities[1].x).toBe(200);
      expect(entities[1].y).toBe(400);
    });

    it('should handle negative spacing', () => {
      const entities = [new Entity(), new Entity(), new Entity()];

      layoutColumn(entities, 50, 100, -25);

      expect(entities[0].y).toBe(100);
      expect(entities[1].y).toBe(75);  // 100 - 25
      expect(entities[2].y).toBe(50);  // 75 - 25
    });

    it('should handle zero spacing', () => {
      const entities = [new Entity(), new Entity()];

      layoutColumn(entities, 50, 50, 0);

      expect(entities[0].y).toBe(50);
      expect(entities[1].y).toBe(50); // Same position
    });

    it('should handle single entity', () => {
      const entities = [new Entity()];

      layoutColumn(entities, 100, 200, 50);

      expect(entities[0].x).toBe(100);
      expect(entities[0].y).toBe(200);
    });

    it('should handle empty entity array', () => {
      expect(() => layoutColumn([], 0, 0, 10)).not.toThrow();
    });
  });

  describe('center()', () => {
    it('should center entity on screen', () => {
      const entity = new Entity();

      center(entity, 800, 600);

      expect(entity.x).toBe(400);
      expect(entity.y).toBe(300);
    });

    it('should handle non-standard dimensions', () => {
      const entity = new Entity();

      center(entity, 1920, 1080);

      expect(entity.x).toBe(960);
      expect(entity.y).toBe(540);
    });

    it('should handle small dimensions', () => {
      const entity = new Entity();

      center(entity, 100, 100);

      expect(entity.x).toBe(50);
      expect(entity.y).toBe(50);
    });

    it('should handle zero dimensions', () => {
      const entity = new Entity();

      center(entity, 0, 0);

      expect(entity.x).toBe(0);
      expect(entity.y).toBe(0);
    });

    it('should handle negative dimensions', () => {
      const entity = new Entity();

      center(entity, -100, -100);

      expect(entity.x).toBe(-50);
      expect(entity.y).toBe(-50);
    });

    it('should override existing position', () => {
      const entity = new Entity({ x: 100, y: 200 });

      center(entity, 400, 400);

      expect(entity.x).toBe(200);
      expect(entity.y).toBe(200);
    });
  });

  describe('Integration', () => {
    it('should handle mixed layout operations', () => {
      const entities = [
        new Entity(),
        new Entity(),
        new Entity(),
        new Entity()
      ];

      // First, grid layout
      layoutGrid(entities, {
        columns: 2,
        rows: 2,
        cellWidth: 100,
        cellHeight: 100
      });

      // Then center the first entity
      center(entities[0], 800, 600);

      expect(entities[0].x).toBe(400);
      expect(entities[0].y).toBe(300);

      // Others should still be in grid
      expect(entities[1].x).toBe(150);
      expect(entities[2].x).toBe(50);
    });

    it('should handle repositioning from row to column', () => {
      const entities = [new Entity(), new Entity(), new Entity()];

      // Initial row layout
      layoutRow(entities, 0, 100, 50);

      expect(entities[0].x).toBe(0);
      expect(entities[1].x).toBe(50);
      expect(entities[2].x).toBe(100);

      // Reposition to column
      layoutColumn(entities, 200, 0, 50);

      expect(entities[0].x).toBe(200);
      expect(entities[0].y).toBe(0);
      expect(entities[1].x).toBe(200);
      expect(entities[1].y).toBe(50);
      expect(entities[2].x).toBe(200);
      expect(entities[2].y).toBe(100);
    });
  });
});
