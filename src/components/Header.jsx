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
                        exportSchemeCallback
                    }) =>
                        (
                            <>
                                <EditorActionsPanel
                                    onUpScale={upScaleCallback}
                                    onDownScale={downScaleCallback}
                                    onDeleteSelected={deleteSelectedCallback}
                                    onGoToOrigin={goToOriginCallback}
                                />
                                <AppActionsPanel
                                    onExportScheme={exportSchemeCallback}
                                />
                            </>
                        )}

                </EditorContext.Consumer>
            </header>
        );
    }
}