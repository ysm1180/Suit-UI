import { toColorFormats } from '../utilities/color/color';

export type ChangeEventData =
    | {
          h: number;
          s: number;
          v: number;
          a: number;
          source: string;
      }
    | {
          h: number;
          s: number;
          l: number;
          a: number;
          source: string;
      };

export type ChangeColorEvent = (change: ChangeEventData, e: MouseEvent) => void;

export type ColorValues = ReturnType<typeof toColorFormats>;
