import Node from "./Node";
import { isDirection } from "../utils";
import { DIRECTION_RIGHT, DIRECTION_LEFT } from "../enum/directions";

const defaultSize = [100, 50];

export default class SchemeElement extends Node {
  constructor(id, shape, position, size = defaultSize) {
    super(id, shape, position, size);

    this.input = [];
    this.output = [];
    this._direction = DIRECTION_RIGHT;
  }

  get direction() {
    return this._direction;
  }

  set direction(direction) {
    if (!isDirection(direction)) {
      throw new Error("Unknown direction - " + direction);
    }

    this._changeAnchorPointsByDirection(direction);
    this._direction = direction;
  }

  _changeAnchorPointsByDirection = (direction) => {
    if (direction === this.direction || !this.anchorPoints) return;

    if (direction === DIRECTION_RIGHT || direction === DIRECTION_LEFT) {
      this.anchorPoints = this.anchorPoints.map(point => [1 - point[0], point[1]]);
    }
  }

  getInputAnchors() {
    return [];
  }

  getOutputAnchors() {
    return [];
  }

  getData() {
    return {
      id: this.id,
      shape: this.shape,
      x: this.x,
      y: this.y,
      direction: this.direction,
      label: this.label,
    }
  }
}