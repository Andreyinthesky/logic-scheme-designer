import React, { Component } from "react";
import PropTypes from "prop-types";

const scales = [
    0.25,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    2,
    2.5
]

export default class EditorScaleSelector extends Component {
    constructor() {
        super();

        this.state = {
            showSelector: false,
        };
        this.btnElement = React.createRef();
    }

    addDocumentClickListener = () => {
        document.addEventListener("click", this.hideSelector);
    }

    removeDocumentClickListener = () => {
        document.removeEventListener("click", this.hideSelector);
    }

    hideSelector = () => {
        this.setState({ showSelector: false });
        this.removeDocumentClickListener();
    }

    onChooseScale = (scale) => {
        console.log(scale);
        this.props.onChooseScale(scale);
    }

    handleClickChooseScaleBtn = (evt) => {
        this.setState({ showSelector: true }, () => {
            this.addDocumentClickListener();
        });
    }

    renderScaleList = (scales) => {
        return (
            scales.map(scale => (
                <li key={`scale-${scale}`}
                    className="scale-selector__item"
                    onClick={() => this.onChooseScale(scale)}
                >
                    {`${Math.round(scale * 100)}%`}
                </li>
            ))
        );
    }

    render() {
        const { showSelector } = this.state;

        return (
            <span style={{ position: "relative" }}>
                <button title="Масштаб (Scale)"
                    onClick={this.handleClickChooseScaleBtn}
                    ref={this.btnElement}
                >
                    <i className="fas fa-search"></i>
                    <i className="fas fa-angle-down"></i>
                </button>
                {showSelector &&
                    <ul className="scale-selector">
                        {this.renderScaleList(scales)}
                    </ul>}
            </span>
        );
    }
}

EditorScaleSelector.propTypes = {
    onChooseScale: PropTypes.func.isRequired,
}