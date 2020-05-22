import {
  UPDATE_SCALE,
  SET_FILENAME,
  SHOW_EXPORT_FORM,
  SHOW_LOAD_FORM,
  HIDE_EXPORT_FORM,
  HIDE_LOAD_FORM,
  SHOW_NOTIFICATION,
  SET_MODE,
  HIDE_NOTIFICATION,
  REINIT,
  UPDATE_MOUSE_COORDS,
  INCREASE_TACT_COUNT,
  SHOW_TACT_COUNTER,
  HIDE_TACT_COUNTER,
  SHOW_CONTEXT_MENU,
  HIDE_CONTEXT_MENU
} from "./actionTypes";
import { EDITOR_EDITING_MODE, EDITOR_SIMULATION_MODE } from "../model/constants";


export function reInitEditor() {
  return {
    type: REINIT,
  };
}

export function updateScale(scale) {
  return {
    type: UPDATE_SCALE,
    payload: scale
  };
}

export function updateMouseCoords(coords) {
  const roundedCoords = { x: Math.round(coords.x), y: Math.round(coords.y) };

  return {
    type: UPDATE_MOUSE_COORDS,
    payload: roundedCoords
  };
}

export function increaseTactCount() {
  return {
    type: INCREASE_TACT_COUNT,
  };
}

export function showTactCounter() {
  return {
    type: SHOW_TACT_COUNTER,
  };
}

export function hideTactCounter() {
  return {
    type: HIDE_TACT_COUNTER,
  };
}

export function showContextMenu(model) {
  return {
    type: SHOW_CONTEXT_MENU,
    payload: model
  };
}

export function hideContextMenu() {
  return {
    type: HIDE_CONTEXT_MENU,
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

export function showNotification(notification) {
  return {
    type: SHOW_NOTIFICATION,
    payload: notification,
  }
}


export function hideNotification(id) {
  return {
    type: HIDE_NOTIFICATION,
    payload: id,
  }
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