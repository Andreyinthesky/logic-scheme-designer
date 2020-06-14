import BaseElement from "../BaseElement";
import { DIRECTION_LEFT } from "../../enum/directions";
import { isDirection } from "../../utils";

const directionToAnchorPoints = (direction) => {
  if (direction == DIRECTION_LEFT) {
    return [[1, 0.685], [1, 0.315], [0, 0.5]];
  } else {
    return [[0, 0.685], [0, 0.315], [1, 0.5]];
  }
};


export default class OrGate extends BaseElement {
  constructor(index, position) {
    super("or" + index, position);

    this.index = index;
    this.shape = "or";
    this.label = `ИЛИ-${index}`;
    this.anchorPoints = [[0, 0.685], [0, 0.315], [1, 0.5]];
    this.input = [false, false];
  }

  changeDirection(direction) {
    if (!isDirection(direction)) {
      throw new Error("Unknown direction - " + direction);
    }

    this.anchorPoints = directionToAnchorPoints(direction);
    this.direction = direction;
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 2);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(2, 3);
  }

  evaluate() { return this.input[0] || this.input[1]; }
}