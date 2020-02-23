import BaseElement from "./BaseElement";

export default class Output extends BaseElement {
  constructor(id, position, value) {
    super(id, position);

    this.value = value || 0;
    this.shape = "output";
    this.label = this.value.toString();
    this.anchorPoints = [[0, 0.5]];
  }

  getInputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }
}