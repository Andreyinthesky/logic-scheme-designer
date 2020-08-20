const createObjectsIndex = () => ({
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
    this.index = index || createObjectsIndex();
  }

  getNextIndex(objName) {
    if (this.index[objName] === undefined) {
      throw new Error(`Unknown object with name - ${objName}`);
    }

    return ++this.index[objName];
  }
}