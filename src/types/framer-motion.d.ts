declare module 'framer-motion' {
  import { FC, ReactNode, ComponentType, HTMLAttributes, CSSProperties } from 'react';

  // Animation controls
  export interface AnimationControls {
    start(definition: Variants | TargetAndTransition): Promise<any>;
    stop(): void;
    set(definition: Variants | TargetAndTransition): void;
  }

  export interface TargetAndTransition {
    [key: string]: any;
  }

  export type Variants = {
    [key: string]: TargetAndTransition;
  };

  // Motion components
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: Variants;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileInView?: any;
    layout?: boolean | string;
    layoutId?: string;
    style?: CSSProperties;
    className?: string;
    id?: string;
    onAnimationStart?: () => void;
    onAnimationComplete?: () => void;
    children?: ReactNode;
    ref?: any;
    key?: string | number;
  }

  export type MotionComponent<T = any> = FC<T & MotionProps & HTMLAttributes<HTMLElement>>;

  export const motion: {
    div: MotionComponent<HTMLAttributes<HTMLDivElement>>;
    span: MotionComponent<HTMLAttributes<HTMLSpanElement>>;
    p: MotionComponent<HTMLAttributes<HTMLParagraphElement>>;
    button: MotionComponent<HTMLAttributes<HTMLButtonElement>>;
    h1: MotionComponent<HTMLAttributes<HTMLHeadingElement>>;
    h2: MotionComponent<HTMLAttributes<HTMLHeadingElement>>;
    h3: MotionComponent<HTMLAttributes<HTMLHeadingElement>>;
    img: MotionComponent<HTMLAttributes<HTMLImageElement>>;
    section: MotionComponent<HTMLAttributes<HTMLElement>>;
    [key: string]: any;
  };

  export const m: typeof motion;

  // AnimatePresence
  export interface AnimatePresenceProps {
    children?: ReactNode;
    mode?: 'sync' | 'wait' | 'popLayout';
    initial?: boolean;
    onExitComplete?: () => void;
  }

  export const AnimatePresence: FC<AnimatePresenceProps>;

  // Layout utilities
  export function useAnimation(): AnimationControls;
  export function useMotionValue(value: number): { get: () => number; set: (v: number) => void; onChange: (cb: (v: number) => void) => () => void };
  export function useTransform(value: any, input: number[], output: any[]): any;
  export function useScroll(): { scrollY: any; scrollX: any };
  export function useInView(ref: any, options?: any): boolean;
  export function useSpring(value: any, config?: any): any;
  export function animate(definition: any): Promise<any>;
  export function stagger(duration: number): any;
  export function delayChildren(duration: number): any;

  // LayoutGroup
  export interface LayoutGroupProps {
    id?: string;
    children?: ReactNode;
  }
  export const LayoutGroup: FC<LayoutGroupProps>;

  // Reorder
  export namespace Reorder {
    const Group: FC<{ children?: ReactNode; values: any[]; onReorder: (values: any[]) => void; as?: string; className?: string; style?: CSSProperties }>;
    const Item: FC<{ children?: ReactNode; value: any; as?: string; className?: string; style?: CSSProperties; id?: string }>;
  }
}