import { DIRECTION_RIGHT } from "../enum/directions";

export default class BaseElement {
  constructor(id, position) {
    this.id = id;
    this.x = position.x || 0;
    this.y = position.y || 0;
    this.input = [];
    this.output = [];
    this.size = [100, 50];
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
}