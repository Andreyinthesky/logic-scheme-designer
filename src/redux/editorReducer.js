import {
  UPDATE_SCALE,
  SET_FILENAME,
  SET_MODE,
  REINIT,
  UPDATE_MOUSE_COORDS,
  INCREASE_TACT_COUNT,
  SHOW_TACT_COUNTER,
  HIDE_TACT_COUNTER
} from "./actionTypes";
import { DEFAULT_FILENAME, EDITOR_EDITING_MODE } from "../model/constants";


const initialState = {
  mode: EDITOR_EDITING_MODE,
  scale: 1.0,
  filename: DEFAULT_FILENAME,
  mouseCoords: { x: 0, y: 0 },
  tactCount: 0,
  showTactCounter: false,
};

export const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCALE:
      return { ...state, scale: action.payload };
    case UPDATE_MOUSE_COORDS:
      return { ...state, mouseCoords: action.payload };
    case INCREASE_TACT_COUNT:
      return { ...state, tactCount: state.tactCount + 1 };
    case SHOW_TACT_COUNTER:
      return { ...state, showTactCounter: true, tactCount: 0 };
    case HIDE_TACT_COUNTER:
      return { ...state, showTactCounter: false };
    case SET_FILENAME:
      return { ...state, filename: action.payload };
    case SET_MODE:
      return { ...state, mode: action.payload };
    case REINIT:
      return initialState;
    default: return state;
  }
};