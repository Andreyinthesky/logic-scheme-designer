import { DIRECTION_RIGHT } from "../enum/directions";
import Node from "./Node";

const defaultSize = [100, 50];

export default class SchemeElement extends Node {
  constructor(id, shape, position, size = defaultSize) {
    super(id, shape, position, size);

    this.input = [];
    this.output = [];
    this.direction = DIRECTION_RIGHT;
  }

  changeDirection() {
    return null;
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