import SchemeElement from "./SchemeElement";
import { DIRECTION_LEFT } from "../enum/directions";
import { isDirection } from "../utils";

const directionToAnchorPoints = (direction) => {
  if (direction == DIRECTION_LEFT) {
    return [[1, 0.5]];
  } else {
    return [[0, 0.5]];
  }
};

const shape = "output";

export default class Output extends SchemeElement {
  constructor(index, position) {
    super("output" + index, shape, position);

    this.index = index;
    this.input = [false];
    this.label = `ВЫХОД-${index}`;
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

  getInputAnchors() {
    return this.anchorPoints.slice(0, 1).map((_, i) => i);
  }
}