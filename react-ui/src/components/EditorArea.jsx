import React, { Component } from "react";
import SideBar from "./SideBar";
import Canvas from "./Canvas";
import EditorContextMenu from "./EditorContextMenu";
import { EditorContext } from "../contexts/editorContext";

export default class EditorArea extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="editor-area">
                <EditorContext.Consumer>
                    {({ deleteSelectedCallback, rotateSelectedCallback }) => (
                        <EditorContextMenu
                            onDeleteAction={deleteSelectedCallback}
                            onRotateAction={rotateSelectedCallback}
                        />
                    )}
                </EditorContext.Consumer>
                <SideBar />
                <Canvas />
            </div>
        );
    }
}