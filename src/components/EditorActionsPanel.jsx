import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "../model/constants";
import { setMode } from "../redux/actions";


class EditorActionsPanel extends Component {
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
        if (this.props.editorMode === EDITOR_SIMULATION_MODE) {
            this.props.setMode(EDITOR_EDITING_MODE);
            return;
        }

        this.props.setMode(EDITOR_SIMULATION_MODE);
    };

    handleClickDoTactBtn = () => {
        console.log("undo");
    };

    handleClickDiscardInputsBtn = () => {
        console.log("undo");
    };

    render() {
        const isSimulationMode = this.props.editorMode === EDITOR_SIMULATION_MODE;

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
                    {isSimulationMode ?
                        <button id="testMode-btn" className={"active"} onClick={this.handleClickChangeModeBtn}>
                            <i className="fas fa-pencil-alt"></i>
                            {"В режим редактирования"}
                        </button> :
                        <button id="testMode-btn" onClick={this.handleClickChangeModeBtn}>
                            <i className="fas fa-caret-square-right"></i>
                            {"В режим симуляции"}
                        </button>
                    }
                    <button id="doTact-btn" onClick={this.handleClickDoTactBtn} disabled={!isSimulationMode} >
                        {"Сделать такт"}
                    </button>
                    <button id="discard-inputs-btn" onClick={this.handleClickDiscardInputsBtn} disabled={!isSimulationMode} >
                        {"Сбросить входы"}
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    editorMode: state.editor.mode,
});

const mapDispatchToProps = {
    setMode,
};

EditorActionsPanel.propTypes = {
    editorMode: PropTypes.string.isRequired,
    setMode: PropTypes.func.isRequired,
    onUpScale: PropTypes.func,
    onDownScale: PropTypes.func,
    onGoToOrigin: PropTypes.func,
    onDeleteSelected: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorActionsPanel);