import React, { Component } from "react";
import SideBar from "./SideBar";
import Canvas from "./Canvas";

export default class EditorArea extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="editor-area">
                <SideBar />
                <Canvas />
            </div>
        );
    }
}