import LinkedStack from "../../infrastracture/LinkedStack";

const MAX_STORED_STATES_COUNT = 42;

export default class SchemeEditorStatesStore {
  constructor(initialState) {
    if (initialState == null) {
      throw new Error("Before StatesStore initiation initial state should taken");
    }

    this._doStack = new LinkedStack(initialState);
    this._undoStack = [];
  }

  push(state) {
    while (this._undoStack.length > 0) {
      this._undoStack.pop();
    }

    if (this._doStack.length === MAX_STORED_STATES_COUNT) {
      this._doStack.removeAt(0);
    }

    this._doStack.push(state);
  }

  pop() {
    if (this._doStack.length <= 1)
      return;

    const lastState = this._doStack.pop();
    this._undoStack.push(lastState);

    return lastState;
  }

  restore() {
    if (this._undoStack.length <= 0)
      return;

    const stateToRestore = this._undoStack.pop();
    this._doStack.push(stateToRestore);

    return stateToRestore;
  }

  getLast() {
    return this._doStack.peek();
  }
}