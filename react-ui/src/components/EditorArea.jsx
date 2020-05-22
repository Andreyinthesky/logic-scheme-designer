import React, { Component } from "react";
import SideBar from "./SideBar";
import Canvas from "./Canvas";
import EditorContextMenu from "./EditorContextMenu";

export default class EditorArea extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="editor-area">
                <EditorContextMenu />
                <SideBar />
                <Canvas />
            </div>
        );
    }
}