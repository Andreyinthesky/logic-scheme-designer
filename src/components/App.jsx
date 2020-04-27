import React, { Component } from "react";
import LoadSchemeForm from "./LoadSchemeForm";
import ExportSchemeForm from "./ExportSchemeForm";
import Header from "./Header";
import EditorArea from "./EditorArea";
import {AddNodeContext} from "../contexts/addNodeContext";

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


export default class App extends Component {
    constructor() {
        super();
        this.state = {
            mode: "default",
            scale: 1.0,
        };
    }

    componentDidMount() {
        const graph = init(document.querySelector("#mountNode"));
        this.graph = graph;
        this.bindEvents(graph);
        start(graph);
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
            let {scale} = this.state;
            const { deltaY } = evt;
            if ((deltaY > 0 && scale <= graph.get("minZoom")) || (deltaY < 0 && scale >= graph.get("maxZoom")))
                return;
            scale = parseFloat((scale + (deltaY < 0 ? 0.1 : -0.1)).toFixed(2));
            console.log("scale", scale);
            graph.zoomTo(scale);
            // this.setState({scale});
        });

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

        let nodeData = null;
        const nodePosition = graph.getPointByCanvas(100, 100);

        switch (type) {
            case "delay":
                nodeData = new DelayGate(graph.indexer.getNextIndex("delay"), nodePosition);
                break;
            case "and":
                nodeData = new AndGate(graph.indexer.getNextIndex("and"), nodePosition);
                break;
            case "or":
                nodeData = new OrGate(graph.indexer.getNextIndex("or"), nodePosition);
                break;
            case "xor":
                nodeData = new XorGate(graph.indexer.getNextIndex("xor"), nodePosition);
                break;
            case "not":
                nodeData = new NotGate(graph.indexer.getNextIndex("not"), nodePosition);
                break;
            case "input":
                nodeData = new Input(graph.indexer.getNextIndex("input"), nodePosition);
                break;
            case "output":
                nodeData = new Output(graph.indexer.getNextIndex("output"), nodePosition);
                break;
            default:
                return;
        }

        const newNode = graph.addItem("node", nodeData);
    }

    render() {
        return (
            <>
                <Header />
                <AddNodeContext.Provider value={{ callback: this.addNode }}>
                    <EditorArea />
                </AddNodeContext.Provider>
                {/* <LoadSchemeForm /> */}
                {/* <ExportSchemeForm /> */}
            </>
        );
    }
}