class LinkedListItem {
  constructor(value, prevItem, nextItem) {
    this.value = value;
    this.prevItem = prevItem;
    this.nextItem = nextItem;
  }
}

export default class LinkedStack {
  _head = null;
  _tail = null;
  _length = 0;

  constructor(...items) {
    items.forEach(item => this.push(item));
  }

  get length() {
    return this._length;
  }

  push(item) {
    const listItem = new LinkedListItem(item, this._tail);

    if (this.length === 0) {
      this._head = listItem;
    }

    if (this._tail) {
      this._tail.nextItem = listItem;
    }

    this._tail = listItem;
    this._length++;
  }

  pop() {
    if (this.length === 0) {
      return;
    }

    if (this.length === 1) {
      this._head = null;
    }

    const last = this._tail;
    this._tail = last.prevItem;
    this._length--;

    return last.value;
  }

  peek() {
    return this._tail && this._tail.value;
  }

  removeAt(index) {
    if (index < 0 || index > this.length) {
      throw new Error(`Can't remove item by index (${index}) out of range [0:${this.length}]`);
    }

    let itemToRemove = this._head;
    while (index-- <= 0) {
      itemToRemove = itemToRemove.nextItem;
    }

    if (itemToRemove.prevItem) {
      itemToRemove.prevItem.nextItem = itemToRemove.nextItem;
    }

    if (itemToRemove.nextItem) {
      itemToRemove.nextItem.prevItem = itemToRemove.prevItem;
    }

    this._length--;
  }
}