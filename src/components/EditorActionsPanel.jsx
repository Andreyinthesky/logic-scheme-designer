import React, { Component } from "react";
import PropTypes from "prop-types";


export default class EditorActionsPanel extends Component {
    constructor() {
        super();
    }

    handleClickUndoBtn = () => {
        console.log("undo");
    };

    handleClickRedoBtn = () => {
        console.log("redo");
    };

    handleClickDeleteBtn = () => {
        this.props.onDeleteSelected();
    };

    handleClickGoToOriginBtn = () => {
        this.props.onGoToOrigin();
    };

    handleClickChooseScaleBtn = () => {
        console.log("undo");
    };

    handleClickUpScaleBtn = () => {
        this.props.onUpScale();
    };

    handleClickDownScaleBtn = () => {
        this.props.onDownScale();
    };

    handleClickChangeModeBtn = () => {
        console.log("undo");
    };

    handleClickDoTactBtn = () => {
        console.log("undo");
    };

    handleClickDiscardInputsBtn = () => {
        console.log("undo");
    };

    render() {
        return (
            <div className="tools-panel">
                <div className="canvas-actions">
                    <button title="Отменить (Undo)" onClick={this.handleClickUndoBtn}>
                        <i className="fas fa-reply"></i>
                    </button>
                    <button title="Повторить (Redo)" onClick={this.handleClickRedoBtn}>
                        <i className="fas fa-share"></i>
                    </button>
                    <button title="Удалить (Delete)" onClick={this.handleClickDeleteBtn}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    <button id="fit-btn"
                        title="В начало координат (Go to origin)"
                        onClick={this.handleClickGoToOriginBtn}
                    >
                        <i className="fas fa-compress"></i>
                    </button>
                    <button title="Масштаб (Scale)" onClick={this.handleClickChooseScaleBtn}>
                        <i className="fas fa-search"></i>
                        <i className="fas fa-angle-down"></i>
                    </button>
                    <button className="down-scale"
                        title="Уменьшить масштаб (Down scale)"
                        onClick={this.handleClickDownScaleBtn}
                    >
                        <i className="fas fa-search-minus"></i>
                    </button>
                    <button className="up-scale"
                        title="Увеличить масштаб (Up scale)"
                        onClick={this.handleClickUpScaleBtn}
                    >
                        <i className="fas fa-search-plus"></i>
                    </button>
                </div>

                <div className="scheme-control">
                    <button id="testMode-btn"
                        onClick={this.handleClickChangeModeBtn}
                    >
                        <i className="fas fa-caret-square-right"></i>
                        {"В режим симуляции"}
                    </button>
                    <button id="doTact-btn" onClick={this.handleClickDoTactBtn} disabled >
                        {"Сделать такт"}
                    </button>
                    <button id="discard-inputs-btn" onClick={this.handleClickDiscardInputsBtn} disabled >
                        {"Сбросить входы"}
                    </button>
                </div>
            </div>
        );
    }
}

EditorActionsPanel.propTypes = {
    onUpScale: PropTypes.func,
    onDownScale: PropTypes.func,
    onGoToOrigin: PropTypes.func,
    onDeleteSelected: PropTypes.func,
}