import delay from "./delay";
import and from "./and";
import or from "./or";
import not from "./not";
import xor from "./xor";

import input from "./input";
import output from "./output";

const nodes = {
  delay,
  input,
  output,
  and,
  or,
  not,
  xor
}

export default function registerNodes(G6) {
  Object.entries(nodes)
    .forEach(([name, cfg]) => G6.registerNode(name, cfg));
}