import BaseElement from "./BaseElement";

export default class Input extends BaseElement {
  constructor(id, position) {
    super(id, position);

    this.input = [false];
    this.shape = "input";
    this.label = "0";
    this.anchorPoints = [[1, 0.5]];
  }

  getOutputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }

  evaluate() {
    return this.input[0];
  }
};