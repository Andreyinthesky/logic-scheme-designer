import Wire from "../model/g6Items/Wire";
import OrGate from "../model/g6Items/gates/OrGate";
import g6init from "../model/g6Init";
import createMountNode from "./utils/createMountNode";
import itemsControlBehavior from "../g6/behaviors/itemsControl";

const graph = g6init(createMountNode());
graph.emit = jest.fn();

describe("completeDrivenEdge()", () => {
  beforeEach(() => {
    for (let prop in itemsControlBehavior) {
      if (typeof itemsControlBehavior[prop] !== "function") {
        itemsControlBehavior[prop] = null;
      }
    }

    graph.clear();
    itemsControlBehavior.graph = graph;
  });

  test("should emit editor:log event", () => {
    itemsControlBehavior.addingEdge = true;
    graph.addItem("node", new OrGate(1, { x: 300, y: 100 }));
    itemsControlBehavior.drivenEdge = graph.addItem("edge", new Wire({
      index: 1,
      source: "or1",
      sourceAnchor: 1,
      target: { x: 0, y: 0 }
    }));
    const node = graph.addItem("node", new OrGate(2, { x: 100, y: 100 }));

    itemsControlBehavior.completeDrivenEdge(node, 0);

    expect(graph.emit).lastCalledWith("editor:log");
  })
});