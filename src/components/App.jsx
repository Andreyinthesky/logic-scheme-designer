import React, { Component } from "react";
import PropTypes from "prop-types";
import LoadSchemeForm from "./LoadSchemeForm";
import ExportSchemeForm from "./ExportSchemeForm";
import Header from "./Header";
import EditorArea from "./EditorArea";
import { EditorContext } from "../contexts/editorContext";
import { updateScale } from "../redux/actions";
import { connect } from "react-redux";

import init from "../init";
import start from "../g6Start"
import { debounce } from "../utils";

import Input from "../model/Input";
import Output from "../model/Output";
import DelayGate from "../model/gates/DelayGate";
import AndGate from "../model/gates/AndGate";
import OrGate from "../model/gates/OrGate";
import NotGate from "../model/gates/NotGate";
import XorGate from "../model/gates/XorGate";

class App extends Component {
    constructor() {
        super();
        this.state = {
            mode: "default",
        };
    }

    componentDidMount() {
        const graph = init(document.querySelector("#mountNode"));
        this.graph = graph;
        this.bindEvents(graph);
        start(graph);
        // this.importScheme();
    }

    bindEvents = (graph) => {
        graph.on("node:mouseover", evt => {
            let item = evt.item;
            if (item.hasState("hover")) {
                return;
            }

            graph.setItemState(item, "hover", true);
        });

        graph.on("node:mouseout", evt => {
            let item = evt.item;

            graph.setItemState(item, "hover", false);
        });

        graph.on("afteradditem", evt => {
            const itemType = evt.item.get("type");

            if (itemType == "node") {
                addAnchors(evt.item);
            }
        });

        function addAnchors(node) {
            const model = node.getModel();

            if (!model.anchorPoints) return;

            const group = node.getContainer();
            const id = model.id;
            for (let i = 0; i < model.anchorPoints.length; i++) {
                let { x, y } = node.getLinkPointByAnchor(i);
                let anchor = group.addShape("marker", {
                    id: id + "_anchor_bg_" + i,
                    attrs: {
                        boxName: "anchor",
                        name: "anchor",
                        x: x - model.x,
                        y: y - model.y,
                        r: 5,
                        fill: "#f00"
                    }
                });
                anchor.hide();
            }
        }

        graph.on("wheel", evt => {
            let scale = graph.getZoom();
            const { deltaY } = evt;
            if ((deltaY > 0 && scale <= graph.get("minZoom")) || (deltaY < 0 && scale >= graph.get("maxZoom")))
                return;

            if (deltaY < 0) {
                this.upScale();
            } else {
                this.downScale();
            }
        });

        graph.on("custom:removeselected", evt => {
            this.graph.getEdges().forEach(edge => {
                edge.hasState("select") && this.graph.removeItem(edge);
            });

            this.graph.getNodes().forEach(node => {
                node.hasState("select") && this.graph.removeItem(node);
            });
        });

        graph.on("canvas:mousemove", evt => {
            // console.log(evt.x, evt.y);
        })

        const mountNode = document.querySelector("#mountNode")

        const canvasResize = debounce(() => {
            console.log("resize");
            const width = mountNode.getBoundingClientRect().width;
            const height = mountNode.getBoundingClientRect().height;

            graph.changeSize(width, height);
        });

        window.onresize = () => {
            canvasResize();
        }
    }

    addNode = (type) => {
        const graph = this.graph;

        if (this.state.mode == "test") {
            return;
        }

        const sideBarXOffset = 320;
        const position = graph.getPointByCanvas(100 + sideBarXOffset, 100);

        graph.addItem("node", this.createNode(type, graph.indexer.getNextIndex(type), position));
    }

    upScale = () => {
        const graph = this.graph;
        let scale = graph.getZoom();
        scale = parseFloat((scale + 0.1).toFixed(1));
        graph.zoomTo(scale);
        console.log("scale", scale);

        this.props.updateScale(scale);
    }

    downScale = () => {
        const graph = this.graph;
        let scale = graph.getZoom();
        scale = parseFloat((scale - 0.1).toFixed(1));
        graph.zoomTo(scale);
        console.log("scale", scale);

        this.props.updateScale(scale);
    }

    deleteSelectedItem = () => {
        this.graph.emit("custom:removeselected")
    }

    goToOrigin = () => {
        console.log("try to move to (0,0)");
        const leftTopCorner = this.graph.getPointByCanvas(0, 0);
        const scale = this.graph.getZoom();
        this.graph.translate(leftTopCorner.x * scale, leftTopCorner.y * scale);
    };

    exportSchemeToFile = () => {
        const schemeData = this.graph.save();
        schemeData.nodes = schemeData.nodes.map(({ id, index, x, y, shape, direction }) => {
            return { id, index, x, y, shape, direction };
        });
        schemeData.version = "0.1.0";
        schemeData.name = "Untitled";
        schemeData.index = this.graph.indexer.index;

        console.log(schemeData)

        // const str = JSON.stringify(schemeData);
        // const file = new File([str], schemeData.name, {type: "application/json"});
        // const link = document.createElement("a");
        // link.href = URL.createObjectURL(file);
        // link.download = schemeData.name;
        // link.click();
        // URL.revokeObjectURL(link.href)
    };

    createNode = (type, index, position) => {
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

    importScheme = () => {
        const scheme = { "nodes": [{ "id": "and1", "x": 250, "y": 100, "input": [false, false], "output": [], "size": [100, 50], "index": 1, "shape": "and", "label": "И-1", "anchorPoints": [[0, 0.685], [0, 0.315], [1, 0.5]] }, { "id": "not1", "x": 150, "y": 50, "input": [false], "output": [], "size": [100, 50], "index": 1, "shape": "not", "label": "НЕ-1", "anchorPoints": [[0, 0.5], [1, 0.5]] }, { "id": "input1", "x": 150, "y": 150, "input": [false], "output": [], "size": [75, 50], "index": 1, "shape": "input", "label": "ВХОД-1", "anchorPoints": [[1, 0.5]] }, { "id": "or1", "x": 250, "y": 200, "input": [false, false], "output": [], "size": [100, 50], "index": 1, "shape": "or", "label": "ИЛИ-1", "anchorPoints": [[0, 0.685], [0, 0.315], [1, 0.5]] }, { "id": "xor1", "x": 150, "y": 250, "input": [false, false], "output": [], "size": [100, 50], "index": 1, "shape": "xor", "label": "ИСКЛ.ИЛИ-1", "anchorPoints": [[0, 0.685], [0, 0.315], [1, 0.5]] }, { "id": "output1", "x": 250, "y": 300, "input": [false], "output": [], "size": [65, 50], "index": 1, "shape": "output", "label": "ВЫХОД-1", "anchorPoints": [[0, 0.5]] }, { "id": "delay1", "x": 150, "y": 350, "input": [false], "output": [], "size": [100, 50], "index": 1, "shape": "delay", "label": "ЗАДЕРЖ-1", "anchorPoints": [[0, 0.5], [1, 0.5]] }], "edges": [], "groups": [], "version": "0.1.0", "name": "Untitled" };
        scheme.nodes = scheme.nodes.map(node => {
            const position = {x: node.x, y: node.y};
            return this.createNode(node.shape, node.index, position);
        })

        // update
        this.graph.read(scheme);
        this.graph.moveTo(320, 70);
    };

    render() {
        return (
            <>
                <EditorContext.Provider value={{
                    addNodeCallback: this.addNode,
                    upScaleCallback: this.upScale,
                    downScaleCallback: this.downScale,
                    deleteSelectedCallback: this.deleteSelectedItem,
                    goToOriginCallback: this.goToOrigin,
                    exportSchemeCallback: this.exportSchemeToFile,
                }}>
                    <Header />
                    <EditorArea />
                </EditorContext.Provider>
                <LoadSchemeForm />
                <ExportSchemeForm />
            </>
        );
    }
}

App.propTypes = {
    scale: PropTypes.number,
    updateScale: PropTypes.func,
}

const mapStateToProps = state => ({
    scale: state.editor.scale
});

const mapDispatchToProps = {
    updateScale
};

export default connect(null, mapDispatchToProps)(App);