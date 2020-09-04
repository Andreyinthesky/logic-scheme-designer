import SchemeElement from "./SchemeElement";

const shape = "output";

export default class Output extends SchemeElement {
  constructor(index, position) {
    super("output" + index, shape, position);

    this.index = index;
    this.input = [false];
    this.label = `ВЫХОД-${index}`;
    this.anchorPoints = [[0, 0.5]];
    this.size = [80, 50];
  }

  getInputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }
}