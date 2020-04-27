import {UPDATE_SCALE} from "./actionTypes";

export function updateScale(scale) {
  return {
    type: UPDATE_SCALE,
    payload: scale
  };
}