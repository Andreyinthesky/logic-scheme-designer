import BaseElement from "./BaseElement";
import { DIRECTION_LEFT } from "./directions";
import { isDirection } from "./utils";

const directionToAnchorPoints = (direction) => {
  if (direction == DIRECTION_LEFT) {
    return [[1, 0.5]];
  } else {
    return [[0, 0.5]];
  }
};

export default class Output extends BaseElement {
  constructor(index, position) {
    super("output" + index, position);

    this.index = index;
    this.input = [false];
    this.shape = "output";
    this.label = `ВЫХОД-${index}`;
    this.anchorPoints = directionToAnchorPoints(this.direction);
    this.size = [65, 50];
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