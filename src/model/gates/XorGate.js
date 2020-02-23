import BaseElement from "../BaseElement";

import XOR_GATE from "../../assets/svg_elements/XOR_ANSI.svg";

export default class XorGate extends BaseElement {
  constructor(id, position) {
    super(id, position);

    this.shape = "image";
    this.img = XOR_GATE;
    this.size = [100, 50];
    this.anchorPoints = [[0, 0.685], [0, 0.315], [1, 0.5]];
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 2);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(2, 3);
  }

  evaluate(in1, in2) { !in1 && in2 || in1 && !in2 };
}