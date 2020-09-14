import SchemeElement from "../SchemeElement";

const shape = "xor";

export default class XorGate extends SchemeElement {
  constructor(index, position) {
    super("xor" + index, shape, position);

    this.index = index;
    this.label = `ИСКЛ.ИЛИ-${index}`;
    this.anchorPoints = [[0, 0.7], [0, 0.3], [1, 0.5]];
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