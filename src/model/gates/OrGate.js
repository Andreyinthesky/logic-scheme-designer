import BaseElement from "../BaseElement";

import OR_GATE from "../../assets/svg_elements/OR_ANSI.svg";

export default class OrGate extends BaseElement {
  constructor(id, position) {
    super(id, position);

    this.shape = "image";
    this.img = OR_GATE;
    this.size = [100, 50];
    this.anchorPoints = [[0, 0.685], [0, 0.315], [1, 0.5]];
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 2);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(2, 3);
  }

  evaluate(in1, in2) { return in1 || in2; }
}