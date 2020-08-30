import Item from "./Item";
import { isPoint } from "../utils";

export default class Edge extends Item {
  constructor(id, shape, source, sourceAnchor, target, targetAnchor) {
    super(id, shape);
    this.source = source;
    this.sourceAnchor = sourceAnchor;
    this.target = target;
    this.targetAnchor = targetAnchor;
  }

  isCompleted() {
    return !isPoint(this.target) && !isPoint(this.source);
  }

  getData() {
    return {
      id: this.id,
      shape: this.shape,
      source: this.source,
      sourceAnchor: this.sourceAnchor,
      target: this.target,
      targetAnchor: this.targetAnchor,
    }
  }
};
