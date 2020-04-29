import { UPDATE_SCALE, SET_FILENAME, SET_MODE } from "./actionTypes";
import { DEFAULT_FILENAME, EDITOR_EDITING_MODE } from "../model/constants";


const initialState = {
  mode: EDITOR_EDITING_MODE,
  scale: 1.0,
  filename: DEFAULT_FILENAME
};

export const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCALE:
      return { ...state, scale: action.payload };
    case SET_FILENAME:
      return { ...state, filename: action.payload };
    case SET_MODE:
      return { ...state, mode: action.payload };
    default: return state;
  }
};