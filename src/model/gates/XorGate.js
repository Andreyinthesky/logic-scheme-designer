import BaseElement from "../BaseElement";

export default class XorGate extends BaseElement {
  constructor(index, position) {
    super("xor" + index, position);

    this.index = index;
    this.shape = "xor";
    this.label = `ИСКЛ.ИЛИ-${index}`;
    this.anchorPoints = [[0, 0.685], [0, 0.315], [1, 0.5]];
    this.input = [false, false];
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 2);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(2, 3);
  }

  evaluate() { return !this.input[0] && this.input[1] || this.input[0] && !this.input[1] }
}