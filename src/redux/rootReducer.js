import {combineReducers} from "redux";
import {editorReducer} from "./editorReducer";
import { appReducer } from "./appReducer";

export const rootReducer = combineReducers({editor: editorReducer, app: appReducer});