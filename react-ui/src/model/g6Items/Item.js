export default class Item {
  constructor(id, shape) {
    this.id = id;
    this.shape = shape;
  }

  getData() {
    throw new Error("getData() should be implemented");
  }
}