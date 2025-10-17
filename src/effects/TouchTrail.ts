interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export interface TouchTrailOptions {
  color?: string;
  width?: number;
  fadeTime?: number;
  maxPoints?: number;
}

/**
 * Touch trail effect for visual feedback
 */
export class TouchTrail {
  private points: TrailPoint[] = [];
  private color: string;
  private width: number;
  private fadeTime: number;
  private maxPoints: number;
  private enabled: boolean = true;

  constructor(options: TouchTrailOptions = {}) {
    this.color = options.color ?? '#ffffff';
    this.width = options.width ?? 3;
    this.fadeTime = options.fadeTime ?? 500;
    this.maxPoints = options.maxPoints ?? 50;
  }

  /**
   * Add a point to the trail
   */
  addPoint(x: number, y: number): void {
    if (!this.enabled) return;

    this.points.push({
      x,
      y,
      age: 0,
      maxAge: this.fadeTime
    });

    // Remove excess points
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }
  }

  /**
   * Update trail
   */
  update(deltaTime: number): void {
    // Update ages and remove old points
    this.points = this.points.filter(point => {
      point.age += deltaTime * 1000;
      return point.age < point.maxAge;
    });
  }

  /**
   * Render trail
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (this.points.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw trail as connected line segments
    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1];
      const curr = this.points[i];

      const alpha = 1 - (curr.age / curr.maxAge);
      const width = this.width * alpha;

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = width;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Clear all trail points
   */
  clear(): void {
    this.points = [];
  }

  /**
   * Enable trail
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable trail
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Set trail color
   */
  setColor(color: string): void {
    this.color = color;
  }
}
