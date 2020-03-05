import wire from "./wire";

const edges = {
  wire,
}

export default function registerEdges(G6) {
  Object.entries(edges)
    .forEach(([name, cfg]) => G6.registerEdge(name, cfg));
}