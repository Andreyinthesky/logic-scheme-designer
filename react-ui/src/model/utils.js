import { DIRECTION_LEFT, DIRECTION_RIGHT } from "./directions";

export const isDirection = (value) => {
  return value === DIRECTION_RIGHT
    || value === DIRECTION_LEFT;
};