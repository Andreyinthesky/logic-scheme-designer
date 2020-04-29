import {
  UPDATE_SCALE,
  SET_FILENAME,
  SHOW_EXPORT_FORM,
  SHOW_LOAD_FORM,
  HIDE_EXPORT_FORM,
  HIDE_LOAD_FORM
} from "./actionTypes";

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