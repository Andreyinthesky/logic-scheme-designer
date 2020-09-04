import SchemeElement from "./SchemeElement";

const shape = "input";

export default class Input extends SchemeElement {
  constructor(index, position) {
    super("input" + index, shape, position);

    this.index = index;
    this.input = [false];
    this.label = `ВХОД-${index}`;
    this.anchorPoints = [[1, 0.5]];
    this.size = [80, 50];
  }

  getOutputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }

  evaluate() {
    return this.input[0];
  }
}