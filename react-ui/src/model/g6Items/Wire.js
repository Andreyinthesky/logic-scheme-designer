import Edge from "./Edge";

const shape = "wire";

export default class Wire extends Edge {
  constructor(id, source, sourceAnchor, target, targetAnchor) {
    super(id, shape, source, sourceAnchor, target, targetAnchor);
  }

}