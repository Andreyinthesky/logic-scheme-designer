export default class BaseElement {
  constructor(id, position) {
    this.id = id;
    this.x = position.x || 0;
    this.y = position.y || 0;
    this.input = [];
    this.output = [];
    this.size = [100, 50];
  }

  getInputAnchors() {
    return [];
  }

  getOutputAnchors() {
    return [];
  }
}