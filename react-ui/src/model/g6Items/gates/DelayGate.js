import BaseElement from "../BaseElement";
import { DIRECTION_LEFT } from "../../enum/directions";
import { isDirection } from "../../utils";

const directionToAnchorPoints = (direction) => {
  if (direction == DIRECTION_LEFT) {
    return [[1, 0.5], [0, 0.5]];
  } else {
    return [[0, 0.5], [1, 0.5]];
  }
};

export default class DelayGate extends BaseElement {
  constructor(index, position) {
    super("delay" + index, position);

    this.index = index;
    this.shape = "delay";
    this.label = `ЗАДЕРЖ-${index}`;
    this.anchorPoints = directionToAnchorPoints(this.direction);
    this.input = [false];
  }

  changeDirection(direction) {
    if (!isDirection(direction)) {
      throw new Error("Unknown direction - " + direction);
    }

    this.anchorPoints = directionToAnchorPoints(direction);
    this.direction = direction;
  }

  getInputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(0, 1);
  }

  getOutputAnchors() {
    return this.anchorPoints.map((_, i) => i).slice(1, 2);
  }

  evaluate() { 
    return this.input[0];
   }
}