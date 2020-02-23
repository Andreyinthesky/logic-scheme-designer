import BaseElement from "./BaseElement";

export default class Input extends BaseElement {
  constructor(id, position, value) {
    super(id, position);

    this.value = value || 0;
    this.shape = "input";
    this.label = this.value.toString();
    this.anchorPoints = [[1, 0.5]];
  }

  getOutputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }
};