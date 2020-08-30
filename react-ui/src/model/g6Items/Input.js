import SchemeElement from "./SchemeElement";
import { DIRECTION_LEFT } from "../enum/directions";
import { isDirection } from "../utils";

const directionToAnchorPoints = (direction) => {
  if (direction == DIRECTION_LEFT) {
    return [[0, 0.5]];
  } else {
    return [[1, 0.5]];
  }
};

const shape = "input";

export default class Input extends SchemeElement {
  constructor(index, position) {
    super("input" + index, shape, position);

    this.index = index;
    this.input = [false];
    this.label = `ВХОД-${index}`;
    this.anchorPoints = directionToAnchorPoints(this.direction);
    this.size = [80, 50];
  }

  changeDirection(direction) {
    if (!isDirection(direction)) {
      throw new Error("Unknown direction - " + direction);
    }

    this.anchorPoints = directionToAnchorPoints(direction);
    this.direction = direction;
  }

  getOutputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }

  evaluate() {
    return this.input[0];
  }
}