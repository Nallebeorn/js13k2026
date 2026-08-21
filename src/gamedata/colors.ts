import type { Vec4 } from "../core/math.ts";

export const colors = [
	0x000000,
	0x5F574F,
	0xC2C3C7,
	0xFFF1E8,
	0xFF004D,
	0xFFA300,
	0xFFEC27,
	0x00E436,
	0x29ADFF,
	0x294BE7,
	0x1D2B53,
	0xFF77A8,
	0xFFCCAA
].map(hex => [(hex>>16), (hex&0x00ff00)>>8, hex&0xff, 0xff].map(x=>x/0xff) as Vec4);

export const COLOR_BLACK = 0;
export const COLOR_DARKGREY = 1;
export const COLOR_LIGHTGREY = 2;
export const COLOR_WHITE = 3;
export const COLOR_RED = 4;
export const COLOR_ORANGE = 5;
export const COLOR_YELLOW = 6;
export const COLOR_GREEN = 7;
export const COLOR_CYAN = 8;
export const COLOR_BLUE = 9;
export const COLOR_VIOLET = 10;
export const COLOR_PINK = 11;
export const COLOR_PEACH = 12;

export type Color =
  | typeof COLOR_BLACK
  | typeof COLOR_DARKGREY
  | typeof COLOR_LIGHTGREY
  | typeof COLOR_WHITE
  | typeof COLOR_RED
  | typeof COLOR_ORANGE
  | typeof COLOR_YELLOW
  | typeof COLOR_GREEN
  | typeof COLOR_CYAN
  | typeof COLOR_BLUE
  | typeof COLOR_VIOLET
  | typeof COLOR_PINK
  | typeof COLOR_PEACH;
