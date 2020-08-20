import G6 from "../g6";
import g6init from "../model/g6Init";
import createMountNode from "./utils/createMountNode";
import OrGate from "../model/g6Items/gates/OrGate";

const Event = G6.G.Event;
const graph = g6init(createMountNode());

const nodes = [
  new OrGate(1, { x: 100, y: 100 }),
  new OrGate(2, { x: 100, y: 100 })
];

const graphItems = {
  nodes,
  edges: [
    {
      id: "wire1",
      shape: "wire",
      source: nodes[0].id,
      sourceAnchor: nodes[0].getOutputAnchors()[0],
      target: nodes[1].id,
      targetAnchor: nodes[1].getInputAnchors()[0],
    }
  ]
};

beforeEach(() => {
  graph.clear();
  graph.read(graphItems);
})

describe("context-menu behaviour", () => {
  const generateClickCoordsOnNode = (node, near = false) => {
    const { x, y, size } = node.getModel();
    const [width, height] = size;
    if (near) {
      return { x: x + width / 2 + 3, y: y + height / 2 + 3 };
    }

    return { x, y };
  };

  const createEvent = (name, args) => {
    const event = new Event(name, {});

    return Object.assign(event, args);
  };

  test("node:contextmenu event should call preventDefault() and stopPropagation()", () => {
    const node = graph.getNodes()[0];
    const clickCoords = generateClickCoordsOnNode(node);
    const preventDefaultMock = jest.fn();
    const stopPropagationMock = jest.fn();
    const event = createEvent("node:contextmenu", {
      item: node,
      x: clickCoords.x,
      y: clickCoords.y,
      canvasX: clickCoords.x,
      canvasY: clickCoords.y,
      preventDefault: preventDefaultMock,
      stopPropagation: stopPropagationMock
    });

    graph.emit("node:contextmenu", event);

    expect(preventDefaultMock).toBeCalledTimes(1);
    expect(stopPropagationMock).toBeCalledTimes(1);
  })

  test("node:contextmenu event should set select state on node", () => {
    const node = graph.getNodes()[0];
    const clickCoords = generateClickCoordsOnNode(node);
    const event = createEvent("node:contextmenu", {
      item: node,
      x: clickCoords.x,
      y: clickCoords.y,
      canvasX: clickCoords.x,
      canvasY: clickCoords.y,
    });

    graph.emit("node:contextmenu", event);

    expect(node.hasState("select")).toBeTruthy();
  })

  test("node:contextmenu event when click near node should not set select state on node", () => {
    const node = graph.getNodes()[0];
    const clickCoords = generateClickCoordsOnNode(node, true);
    const event = createEvent("node:contextmenu", {
      item: node,
      x: clickCoords.x,
      y: clickCoords.y,
      canvasX: clickCoords.x,
      canvasY: clickCoords.y,
    });

    graph.emit("node:contextmenu", event);

    expect(node.hasState("select")).toBeFalsy();
  })

  test("node:contextmenu event should call editor:contextmenu event once with correct arguments", (done) => {
    const node = graph.getNodes()[0];
    const clickCoords = generateClickCoordsOnNode(node);
    const contextMenuPosition = { x: 200, y: 300 }
    const event = createEvent("node:contextmenu", {
      item: node,
      x: clickCoords.x,
      y: clickCoords.y,
      canvasX: contextMenuPosition.x,
      canvasY: contextMenuPosition.y,
    });
    graph.on("editor:contextmenu", (evt) => {
      expect(evt).toMatchObject(contextMenuPosition);
      done();
    });

    graph.emit("node:contextmenu", event);
  })
})