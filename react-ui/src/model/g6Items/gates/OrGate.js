import SchemeElement from "../SchemeElement";
import { DIRECTION_LEFT } from "../../enum/directions";
import { isDirection } from "../../utils";

const directionToAnchorPoints = (direction) => {
  if (direction == DIRECTION_LEFT) {
    return [[1, 0.7], [1, 0.3], [0, 0.5]];
  } else {
    return [[0, 0.7], [0, 0.3], [1, 0.5]];
  }
};

const shape = "or";


export default class OrGate extends SchemeElement {
  constructor(index, position) {
    super("or" + index, shape, position);

    this.index = index;
    this.label = `ИЛИ-${index}`;
    this.anchorPoints = directionToAnchorPoints(this.direction);
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