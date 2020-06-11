import React, { Component } from "react";
import EditorStatusBar from "./EditorStatusBar";
import SchemeActionsPanel from "./SchemeActionsPanel";
import { EditorContext } from "../contexts/editorContext";


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
                    }) =>
                        (
                            <SchemeActionsPanel
                                onDoTact={doTactCallback}
                                onDiscardInputs={discardInputsCallback}
                            />
                        )}
                </EditorContext.Consumer>

                <EditorStatusBar />
            </div>
        );
    }
}