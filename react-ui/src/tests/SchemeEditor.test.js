import SchemeEditor from "../model/schemeEditor/SchemeEditor";

const mountNode = document.createElement("div");
mountNode.style.width = "1024px";
mountNode.style.height = "768px";
document.body.appendChild(mountNode);
const editor = new SchemeEditor(mountNode);

beforeEach(() => {
  editor.restart();
})

describe("rotateSelectedItems", () => {
  test("non-selected node should not rotate", () => {
    editor.addNode("or");
    const addedNode = editor._graph.getNodes()[0];
    const addedNodeModel = addedNode.getModel();
    const oldDirection = addedNodeModel.direction;

    editor.rotateSelectedItems();

    expect(addedNodeModel.direction).toBe(oldDirection)
  })

  test("node after rotate should have correct state", () => {
    editor.addNode("or");
    const addedNode = editor._graph.getNodes()[0];
    const addedNodeModel = addedNode.getModel();
    const oldDirection = addedNodeModel.direction;
    editor._graph.emit("node:select", { item: addedNode });

    editor.rotateSelectedItems();

    expect(addedNodeModel.direction).not.toBe(oldDirection);
  })
})

