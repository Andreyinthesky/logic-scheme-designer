import Edge from "./Edge";

const shape = "wire";

export default class Wire extends Edge {
  constructor({ index, source, sourceAnchor, target, targetAnchor }) {
    super("wire" + index, shape, source, sourceAnchor, target, targetAnchor);
  }

}