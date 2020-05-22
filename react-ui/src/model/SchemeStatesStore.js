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
}

export default SchemeStatesStore;