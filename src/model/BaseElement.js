const DIRECTION_LEFT = "L";
const DIRECTION_RIGHT = "R";
const DIRECTION_TOP = "T";
const DIRECTION_BOTTOM = "B";

export default class BaseElement {
  constructor(id, position) {
    this.id = id;
    this.x = position.x || 0;
    this.y = position.y || 0;
    this.input = [];
    this.output = [];
    this.size = [100, 50];
    this.direction = DIRECTION_LEFT;
  }

  getInputAnchors() {
    return [];
  }

  getOutputAnchors() {
    return [];
  }
}