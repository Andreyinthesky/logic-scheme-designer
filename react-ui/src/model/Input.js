import BaseElement from "./BaseElement";

export default class Input extends BaseElement {
  constructor(index, position) {
    super("input" + index, position);

    this.index = index;
    this.input = [false];
    this.shape = "input";
    this.label = `ВХОД-${index}`;
    this.anchorPoints = [[1, 0.5]];
    this.size = [75, 50];
  }

  getOutputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }

  evaluate() {
    return this.input[0];
  }
}