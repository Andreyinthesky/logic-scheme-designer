import React, { Component } from "react";



export default class Canvas extends Component {
    constructor() {
        super();
        this.mountNode = React.createRef();
    }

    componentDidMount() {

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