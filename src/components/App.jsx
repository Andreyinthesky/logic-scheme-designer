import React, { Component } from "react";
import LoadSchemeForm from "./LoadSchemeForm";
import ExportSchemeForm from "./ExportSchemeForm";
import Header from "./Header";
import EditorArea from "./EditorArea";

export default class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                <Header />
                <EditorArea />
                {/* <LoadSchemeForm /> */}
                {/* <ExportSchemeForm /> */}
            </>
        );
    }
}