import BaseElement from "./BaseElement";

export default class Output extends BaseElement {
  constructor(index, position) {
    super("output" + index, position);

    this.index = index;
    this.input = [false];
    this.shape = "output";
    this.label = `ВЫХОД-${index}`;
    this.anchorPoints = [[0, 0.5]];
    this.size = [65, 50];
  }

  getInputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }
}