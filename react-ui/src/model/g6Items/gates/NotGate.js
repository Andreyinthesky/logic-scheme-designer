import SchemeElement from "../SchemeElement";

const shape = "not";

export default class NotGate extends SchemeElement {
  constructor(index, position) {
    super("not" + index, shape, position);

    this.index = index;
    this.label = `НЕ-${index}`;
    this.anchorPoints = [[0, 0.5], [1, 0.5]];
    this.input = [false];
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 1);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(1, 2);
  }

  evaluate() { return !this.input[0]; }
}