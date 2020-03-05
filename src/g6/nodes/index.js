import delay from "./delay";
import input from "./input";
import output from "./output";

const nodes = {
  delay,
  input,
  output
}

export default function registerNodes(G6) {
  Object.entries(nodes)
    .forEach(([name, cfg]) => G6.registerNode(name, cfg));
}