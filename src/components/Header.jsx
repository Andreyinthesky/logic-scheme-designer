import React, { Component } from "react";
import EditorActionsPanel from "./EditorActionsPanel";
import { EditorContext } from "../contexts/editorContext";
import AppActionsPanel from "./AppActionsPanel";

export default class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <header>
                <h1>{"Конструктор логических схем"}</h1>
                <EditorContext.Consumer>
                    {({
                        upScaleCallback,
                        downScaleCallback,
                        deleteSelectedCallback,
                        goToOriginCallback,
                        setModeCallback,
                        doTactCallback,
                        discardInputsCallback,
                        undoEditorActionCallback,
                        redoEditorActionCallback,
                    }) =>
                        (
                            <EditorActionsPanel
                                onUndo={undoEditorActionCallback}
                                onRedo={redoEditorActionCallback}
                                onUpScale={upScaleCallback}
                                onDownScale={downScaleCallback}
                                onDeleteSelected={deleteSelectedCallback}
                                onGoToOrigin={goToOriginCallback}
                                onSetMode={setModeCallback}
                                onDoTact={doTactCallback}
                                onDiscardInputs={discardInputsCallback}
                            />
                        )}
                </EditorContext.Consumer>
                <AppActionsPanel />
            </header>
        );
    }
}