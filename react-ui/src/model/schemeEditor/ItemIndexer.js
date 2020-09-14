const createItemIndex = () => ({
  "wire": 0,
  "and" : 0,
  "or" : 0,
  "xor" : 0,
  "not" : 0,
  "delay" : 0,
  "input" : 0,
  "output" : 0,
});

export default class ItemIndexer {
  constructor(index) {
    this.index = index || createItemIndex();
  }

  getNextIndex(itemName) {
    if (this.index[itemName] === undefined) {
      throw new Error(`Unknown item with name - ${itemName}`);
    }

    return ++this.index[itemName];
  }
}