import BaseElement from "../BaseElement";

export default class NotGate extends BaseElement {
  constructor(index, position) {
    super("not" + index, position);

    this.index = index;
    this.shape = "not";
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