import {UPDATE_SCALE} from "./actionTypes";


const initialState = {
  scale: 1.0
};

export const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCALE:
      return { ...state, scale: action.payload };
    default: return state;
  }
};