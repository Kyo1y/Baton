declare module "vanta/dist/vanta.birds.min" {
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

  export default function BIRDS(options: VantaOptions): VantaEffect;
}

declare module "vanta/dist/vanta.fog.min" {
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
    highlightColor: number,
    midtoneColor: number
    lowlightColor: number, 
    baseColor: number,
    quantity?: number;
    zoom: float;
    blurFactor: float;
    [key: string]: any;
  }

  type VantaEffect = {
    destroy: () => void;

  };

  export default function FOG(options: VantaOptions): VantaEffect;
}

declare module "vanta/dist/vanta.trunk.min" {
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

  export default function TRUNK(options: VantaOptions): VantaEffect;
}

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

declare module "vanta/dist/vanta.topology.min" {
  interface VantaOptions {
    el: HTMLElement | string;
    p5?: any;
    color: string;
    backgroundColor: string;
    [key: string]: any;
  }

  type VantaEffect = {
    destroy: () => void;

  };

  export default function TOPOLOGY(options: VantaOptions): VantaEffect;
}