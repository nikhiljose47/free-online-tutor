import { SvgSlide } from "./svg-slide.model";

export type Channel = {
  id: number;
  name: string;
  tag: string;
  slides: SvgSlide[]; // 1 slide = 1 SVG
};