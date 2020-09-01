import Input from "../g6Items/Input";
import Output from "../g6Items/Output";
import DelayGate from "../g6Items/gates/DelayGate";
import AndGate from "../g6Items/gates/AndGate";
import OrGate from "../g6Items/gates/OrGate";
import NotGate from "../g6Items/gates/NotGate";
import XorGate from "../g6Items/gates/XorGate";

import Wire from "../g6Items/Wire";

const nodeConstructors = {
  "delay": DelayGate,
  "and": AndGate,
  "or": OrGate,
  "xor": XorGate,
  "not": NotGate,
  "input": Input,
  "output": Output,
}

export default class ItemFactory {
  static createNodeModel(type, index, position) {
    if (!nodeConstructors[type])
      throw new Error(`Unknown node type - ${type}`);

    return new nodeConstructors[type](index, position);
  }

  static createNodeModelFromData(nodeData) {
    const { shape: type } = nodeData;
    return Object.assign(this.createNodeModel(type, null, null), nodeData);
  }

  static createEdgeModelFromData(edgeData) {
    const { shape: type } = edgeData;
    if (type !== "wire") {
      throw new Error(`Unknown edge type - ${type}`);
    }
    
    return Object.assign(new Wire({}), edgeData);
  }
}