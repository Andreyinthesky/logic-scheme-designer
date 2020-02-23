import BaseElement from "../BaseElement";

import NOT_GATE from "../../assets/svg_elements/NOT_ANSI.svg";

export default class NotGate extends BaseElement {
  constructor(id, position) {
    super(id, position);

    this.shape = "image";
    this.img = NOT_GATE;
    this.size = [100, 50];
    this.anchorPoints = [[0, 0.5], [1, 0.5]];
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 1);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(1, 2);
  }

  evaluate(in1) { return !in1; }
}