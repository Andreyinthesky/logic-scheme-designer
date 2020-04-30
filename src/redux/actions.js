import {
  UPDATE_SCALE,
  SET_FILENAME,
  SHOW_EXPORT_FORM,
  SHOW_LOAD_FORM,
  HIDE_EXPORT_FORM,
  HIDE_LOAD_FORM,
  SET_MODE
} from "./actionTypes";
import {EDITOR_EDITING_MODE, EDITOR_SIMULATION_MODE} from "../model/constants";

export function updateScale(scale) {
  return {
    type: UPDATE_SCALE,
    payload: scale
  };
}

export function setFilename(filename) {
  return {
    type: SET_FILENAME,
    payload: filename
  };
}

export function setMode(mode) {
  if (![EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE].includes(mode)) {
    throw new Error(`Unknown editor mode - ${mode}`);
  }

  return {
    type: SET_MODE,
    payload: mode
  };
}

export function showLoadForm() {
  return {
    type: SHOW_LOAD_FORM,
  };
}

export function showExportForm() {
  return {
    type: SHOW_EXPORT_FORM,
  };
}

export function hideLoadForm() {
  return {
    type: HIDE_LOAD_FORM,
  };
}

export function hideExportForm() {
  return {
    type: HIDE_EXPORT_FORM,
  };
}