import Item from "./Item";

export default class Node extends Item {
  constructor(id, shape, position, size) {
    super(id, shape)
    this.x = position && position.x || 0;
    this.y = position && position.y || 0;
    this.size = size || [50, 50];
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