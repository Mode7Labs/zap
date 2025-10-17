import { Sprite } from '../entities/Sprite';
import { Text } from '../entities/Text';
import type { EntityOptions } from '../types';

export interface ButtonOptions extends EntityOptions {
  text: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  hoverColor?: string;
  pressColor?: string;
  textColor?: string;
  fontSize?: number;
  radius?: number;
  onClick?: () => void;
}

/**
 * Button UI component
 */
export class Button extends Sprite {
  private defaultColor: string;
  private hoverColor: string;
  private pressColor: string;
  private isHovered: boolean = false;
  private isPressed: boolean = false;
  private label: Text;
  private onClickCallback?: () => void;

  constructor(options: ButtonOptions) {
    const width = options.width ?? 120;
    const height = options.height ?? 50;

    super({
      ...options,
      width,
      height,
      color: options.backgroundColor ?? '#e94560',
      radius: options.radius ?? 8,
      interactive: true
    });

    this.defaultColor = options.backgroundColor ?? '#e94560';
    this.hoverColor = options.hoverColor ?? '#ff547c';
    this.pressColor = options.pressColor ?? '#d13650';
    this.onClickCallback = options.onClick;

    // Create label
    this.label = new Text({
      text: options.text,
      fontSize: options.fontSize ?? 16,
      color: options.textColor ?? '#ffffff',
      align: 'center',
      baseline: 'middle'
    });
    this.addChild(this.label);

    // Setup interactions
    this.on('tap', () => {
      if (this.onClickCallback) {
        this.onClickCallback();
      }
    });

    this.on('dragstart', () => {
      this.isPressed = true;
      this.updateColor();
    });

    this.on('dragend', () => {
      this.isPressed = false;
      this.updateColor();
    });
  }

  /**
   * Update button text
   */
  setText(text: string): void {
    this.label.text = text;
  }

  /**
   * Enable button
   */
  enable(): void {
    this.interactive = true;
    this.alpha = 1;
  }

  /**
   * Disable button
   */
  disable(): void {
    this.interactive = false;
    this.alpha = 0.5;
  }

  /**
   * Update button color based on state
   */
  private updateColor(): void {
    if (this.isPressed) {
      this.color = this.pressColor;
    } else if (this.isHovered) {
      this.color = this.hoverColor;
    } else {
      this.color = this.defaultColor;
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    // Simple hover detection (would need mouse position from game)
    // For now, we use drag start/end as press indicators
  }
}
