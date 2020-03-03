import BaseElement from "./BaseElement";

export default class Output extends BaseElement {
  constructor(id, position) {
    super(id, position);

    this.input = [false];
    this.shape = "output";
    this.label = "0";
    this.anchorPoints = [[0, 0.5]];
  }

  getInputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }
}