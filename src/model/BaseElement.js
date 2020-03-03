export default class BaseElement {
  constructor(id, position) {
    this.id = id;
    this.x = position.x || 0;
    this.y = position.y || 0;
    this.style = {
      cursor: "move"
    };
    this.input = [];
    this.output = [];
  }

  getInputAnchors() {
    return [];
  }

  getOutputAnchors() {
    return [];
  }
}