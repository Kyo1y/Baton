declare module "vanta/dist/vanta.dots.min" {
  interface VantaOptions {
    el: HTMLElement | string;
    THREE?: any;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    backgroundAlpha?: number;
    color1?: number;
    color2?: number;
    quantity?: number;
    [key: string]: any;
  }

  type VantaEffect = {
    destroy: () => void;

  };

  export default function DOTS(options: VantaOptions): VantaEffect;
}
