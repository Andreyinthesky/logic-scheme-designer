class SchemeStatesStore {
  constructor() {
    this.doStack = [];
    this.undoStack = [];
  }

  log(state) {
    while (this.undoStack.length > 0) {
      this.undoStack.pop();
    }
    this.doStack.push(state);
  }

  getCurrent() {
    return this.doStack[this.doStack.length - 1];
  }
}

export default SchemeStatesStore;