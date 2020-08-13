import Input from "../g6Items/Input";
import Output from "../g6Items/Output";
import DelayGate from "../g6Items/gates/DelayGate";
import AndGate from "../g6Items/gates/AndGate";
import OrGate from "../g6Items/gates/OrGate";
import NotGate from "../g6Items/gates/NotGate";
import XorGate from "../g6Items/gates/XorGate";

const createNodeModel = (type, index, position) => {
  const constructors = {
    "delay": DelayGate,
    "and": AndGate,
    "or": OrGate,
    "xor": XorGate,
    "not": NotGate,
    "input": Input,
    "output": Output,
  }

  if (!constructors[type])
    throw new Error(`Unknown node type - ${type}`);

  return new constructors[type](index, position);
}

export default createNodeModel;