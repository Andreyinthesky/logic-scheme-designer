
class AbstractComponent {
  constructor() {
    if (new.target !== AbstractComponent) {
      throw new Error("Can't init abstract component. Only concrete one.");
    }

    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    throw new Error("Not implemented abstract method: getTemplate");
  }
}