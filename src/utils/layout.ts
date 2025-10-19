import type { Entity } from '../entities/Entity';

/**
 * Layout utilities for positioning entities
 */

// Re-export math utilities for backwards compatibility
export { clamp, lerp, map, randomInt, randomFloat, randomItem } from './math';

export interface GridOptions {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  spacing?: number;
  startX?: number;
  startY?: number;
}

/**
 * Position entities in a grid layout
 */
export function layoutGrid(entities: Entity[], options: GridOptions): void {
  const { columns, rows, cellWidth, cellHeight, spacing = 0, startX = 0, startY = 0 } = options;

  let index = 0;
  for (let row = 0; row < rows && index < entities.length; row++) {
    for (let col = 0; col < columns && index < entities.length; col++) {
      const entity = entities[index];
      entity.x = startX + col * (cellWidth + spacing) + cellWidth / 2;
      entity.y = startY + row * (cellHeight + spacing) + cellHeight / 2;
      index++;
    }
  }
}

/**
 * Position entities in a circle
 */
export function layoutCircle(
  entities: Entity[],
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number = 0
): void {
  const angleStep = (Math.PI * 2) / entities.length;

  entities.forEach((entity, index) => {
    const angle = startAngle + index * angleStep;
    entity.x = centerX + Math.cos(angle) * radius;
    entity.y = centerY + Math.sin(angle) * radius;
  });
}

/**
 * Position entities in a row
 */
export function layoutRow(
  entities: Entity[],
  startX: number,
  y: number,
  spacing: number
): void {
  entities.forEach((entity, index) => {
    entity.x = startX + index * spacing;
    entity.y = y;
  });
}

/**
 * Position entities in a column
 */
export function layoutColumn(
  entities: Entity[],
  x: number,
  startY: number,
  spacing: number
): void {
  entities.forEach((entity, index) => {
    entity.x = x;
    entity.y = startY + index * spacing;
  });
}

/**
 * Center an entity on the screen
 */
export function center(entity: Entity, width: number, height: number): void {
  entity.x = width / 2;
  entity.y = height / 2;
}
