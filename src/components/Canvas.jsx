import React, { Component } from "react";
import EditorStatusBar from "./EditorStatusBar";


export default class Canvas extends Component {
    constructor() {
        super();
        this.mountNode = React.createRef();
    }

    render() {
        return (
            <div id="mountNode" ref={this.mountNode}>
                <EditorStatusBar />
            </div>
        );
    }
}