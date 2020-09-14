import React, { Component } from "react";
import EditorStatusBar from "./EditorStatusBar";
import SchemeActionsPanel from "./SchemeActionsPanel";
import { EditorContext } from "../contexts/editorContext";
import EditorContextMenu from "./EditorContextMenu";


export default class Canvas extends Component {
    constructor() {
        super();
        this.mountNode = React.createRef();
    }

    render() {
        return (
            <div id="mountNode" ref={this.mountNode}>
                <EditorContext.Consumer>
                    {({
                        doTactCallback,
                        discardInputsCallback,
                        discardDelaysCallback,
                    }) => (
                        <SchemeActionsPanel
                            onDoTact={doTactCallback}
                            onDiscardInputs={discardInputsCallback}
                            onDiscardDelays={discardDelaysCallback}
                        />
                    )}
                </EditorContext.Consumer>
                <EditorContext.Consumer>
                    {({ deleteSelectedCallback, rotateSelectedCallback }) => (
                        <EditorContextMenu
                            onDeleteAction={deleteSelectedCallback}
                            onRotateAction={rotateSelectedCallback}
                        />
                    )}
                </EditorContext.Consumer>
                <EditorStatusBar />
            </div>
        );
    }
}