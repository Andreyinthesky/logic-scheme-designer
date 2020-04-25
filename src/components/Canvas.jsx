import React, { Component } from "react";
import init from "../init";

export default class Canvas extends Component {
    constructor() {
        super();
        this.mountNode = React.createRef();
    }

    componentDidMount() {
        const graph = init(this.mountNode.current);
    }

    render() {
        return (
            <div id="mountNode" ref={this.mountNode}>
                <span className="show-scale">
                    Масштаб: <span id="show-scale"> 100%</span>
                </span>
            </div>
        );
    }
}