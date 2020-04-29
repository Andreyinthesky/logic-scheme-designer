import { SHOW_EXPORT_FORM, SHOW_LOAD_FORM, HIDE_EXPORT_FORM, HIDE_LOAD_FORM } from "./actionTypes";


const initialState = {
  showExportForm: false,
  showLoadForm: false,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_EXPORT_FORM:
      return { ...state, showExportForm: true };
    case SHOW_LOAD_FORM:
      return { ...state, showLoadForm: true };
    case HIDE_EXPORT_FORM:
      return { ...state, showExportForm: false };
    case HIDE_LOAD_FORM:
      return { ...state, showLoadForm: false };
    default: return state;
  }
};