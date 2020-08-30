import { DIRECTION_LEFT, DIRECTION_RIGHT } from "./enum/directions";

export const isDirection = (value) => {
  return value === DIRECTION_RIGHT
    || value === DIRECTION_LEFT;
};

export const isPoint = (point) => (
  typeof point === "object" 
    && point.x != undefined
    && point.y != undefined
)