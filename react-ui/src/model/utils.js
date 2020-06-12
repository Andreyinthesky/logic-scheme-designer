import { DIRECTION_LEFT, DIRECTION_RIGHT } from "./enum/directions";

export const isDirection = (value) => {
  return value === DIRECTION_RIGHT
    || value === DIRECTION_LEFT;
};