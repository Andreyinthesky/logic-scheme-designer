import SchemeEditor from "../model/schemeEditor/SchemeEditor";
import createMountNode from "./utils/createMountNode";
import SchemeEditorState from "../model/schemeEditor/SchemeEditorState";


const editor = new SchemeEditor(createMountNode());

beforeEach(() => {
  editor.restart();
})

describe("SchemeEditor", () => {
  describe("constructor()", () => {
    test("after creating instance editor state should be logged", () => {
      const expectedInitialEditorState = new SchemeEditorState(
        {
          leftTopCornerPosition: { x: 0, y: 0 },
          schemeData: { nodes: [], edges: [] },
        }
      );

      const editor = new SchemeEditor(createMountNode());

      expect(editor._store.doStack.length).toBe(1);
      expect(editor._store.undoStack.length).toBe(0);
      expect(editor._store.doStack[0] instanceof SchemeEditorState).toBeTruthy();
      expect(editor._store.doStack[0].leftTopCornerPosition)
        .toMatchObject(expectedInitialEditorState.leftTopCornerPosition);
      expect(editor._store.doStack[0].schemeData)
        .toMatchObject(expectedInitialEditorState.schemeData);
    })
  })

  describe("addNode()", () => {
    test("after add node editor state should be logged", () => {
      editor.addNode("or");

      expect(editor._store.doStack.length).toBe(2);
      expect(editor._store.undoStack.length).toBe(0);
      expect(editor._store.doStack[1].schemeData.nodes.length).toBe(1);
    })
  })

  describe("deleteSelectedItems()", () => {

    test("after delete items editor state should be logged", () => {
      editor.addNode("or");
      const addedNode = editor._graph.getNodes()[0];
      editor._graph.emit("node:select", { item: addedNode });

      editor.deleteSelectedItems();

      expect(editor._store.doStack.length).toBe(3);
      expect(editor._store.undoStack.length).toBe(0);
      expect(editor._store.doStack[2].schemeData.nodes.length).toBe(0);
    });
  })

  describe("rotateSelectedItems()", () => {
    test("non-selected node should not rotate", () => {
      editor.addNode("or");
      const addedNode = editor._graph.getNodes()[0];
      const addedNodeModel = addedNode.getModel();
      const oldDirection = addedNodeModel.direction;

      editor.rotateSelectedItems();

      expect(addedNodeModel.direction).toBe(oldDirection);
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

  const generateCanvasTraslation = (from, to) => {
    const canvasNode = Array.prototype.find.call(editor._graph.get("container").childNodes, node =>
      node.tagName === "CANVAS"
    );

    canvasNode.dispatchEvent(new MouseEvent("mousedown", {
      clientX: from.x,
      clientY: from.y,
    }));

    canvasNode.dispatchEvent(new MouseEvent("mousemove", {
      clientX: to.x,
      clientY: to.y,
    }));

    canvasNode.dispatchEvent(new MouseEvent("mouseup", {
      clientX: to.x,
      clientY: to.y,
    }));
  };

  describe("undo()", () => {
    describe("after undo next editor state should be corrected", () => {
      test("undo add node", () => {
        editor.addNode("or");

        editor.undo();

        expect(editor._store.doStack.length).toBe(1);
        expect(editor._store.undoStack.length).toBe(1);
        expect(editor._store.doStack[0].schemeData).toMatchObject({ nodes: [], edges: [] });
        expect(editor._graph.getNodes().length).toBe(0);
        expect(editor._graph.getEdges().length).toBe(0);
      })

      test("undo canvas translate", () => {
        const start = { x: 99, y: 99 };
        const from = { x: 100, y: 100 };
        const to = { x: 200, y: 200 };
        generateCanvasTraslation(start, from);
        generateCanvasTraslation(from, to);

        editor.undo();

        expect(editor._store.doStack.length).toBe(2);
        expect(editor._store.undoStack.length).toBe(1);
        expect(editor._graph.getCanvasByPoint(0, 0)).toMatchObject({ x: 1, y: 1 });
      })
    })
  });

  describe("redo()", () => {
    describe("after redo next editor state should be corrected", () => {
      test("redo add node", () => {
        editor.addNode("or");
        const addedNodeModel = editor._graph.getNodes()[0].getModel();
        editor.undo();

        editor.redo();

        expect(editor._store.doStack.length).toBe(2);
        expect(editor._store.undoStack.length).toBe(0);
        expect(editor._store.doStack[1].schemeData)
          .toMatchObject({ nodes: [addedNodeModel.getData()], edges: [] });
        expect(editor._graph.getNodes().length).toBe(1);
        expect(editor._graph.getEdges().length).toBe(0);
      })

      test("redo canvas translate", () => {
        const from = { x: 100, y: 100 };
        const to = { x: 200, y: 200 };
        generateCanvasTraslation(from, to);
        editor.undo();
        
        editor.redo();

        expect(editor._store.doStack.length).toBe(2);
        expect(editor._store.undoStack.length).toBe(0);
        expect(editor._graph.getCanvasByPoint(0, 0)).toMatchObject({ x: 100, y: 100 });
      })
    })
  })
});
