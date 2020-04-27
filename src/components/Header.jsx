import React, { Component } from "react";
import EditorActionsPanel from "./EditorActionsPanel";
import { AddNodeContext } from "../contexts/addNodeContext";

export default class Header extends Component {
    constructor() {
        super();
    }

    handleClickLoadBtn = () => {
        console.log("load");
    };

    handleClickExportBtn = () => {
        console.log("export");
    };

    render() {
        return (
            <header>
                <h1>{"Конструктор логических схем"}</h1>
                <AddNodeContext.Consumer>
                    {({ upScaleCallback, downScaleCallback }) => (
                        <EditorActionsPanel
                            onUpScale={upScaleCallback}
                            onDownScale={downScaleCallback}
                        />
                    )}
                </AddNodeContext.Consumer>

                <div className="app-control">
                    <button onClick={this.handleClickLoadBtn}>
                        <i className="fas fa-cloud-upload-alt"></i>
                        {"Загрузить" + "..."}
                    </button>
                    <button onClick={this.handleClickExportBtn}>
                        <i className="fas fa-download"></i>
                        {"Экспорт в файл" + "..."}
                    </button>
                </div>
            </header>
        );
    }
}