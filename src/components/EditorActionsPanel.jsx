import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { EDITOR_SIMULATION_MODE, EDITOR_EDITING_MODE } from "../model/constants";
import EditorScaleSelector from "./EditorScaleSelector";
import { EditorContext } from "../contexts/editorContext";


class EditorActionsPanel extends Component {
    constructor() {
        super();
    }

    handleClickUndoBtn = () => {
        this.props.onUndo();
    };

    handleClickRedoBtn = () => {
        this.props.onRedo();
    };

    handleClickDeleteBtn = () => {
        this.props.onDeleteSelected();
    };

    handleClickGoToOriginBtn = () => {
        this.props.onGoToOrigin();
    };

    handleClickUpScaleBtn = () => {
        this.props.onUpScale();
    };

    handleClickDownScaleBtn = () => {
        this.props.onDownScale();
    };

    handleClickChangeModeBtn = () => {
        if (this.props.editorMode === EDITOR_SIMULATION_MODE) {
            this.props.onSetMode(EDITOR_EDITING_MODE);
            return;
        }

        this.props.onSetMode(EDITOR_SIMULATION_MODE);
    };

    handleClickDoTactBtn = () => {
        this.props.onDoTact();
    };

    handleClickDiscardInputsBtn = () => {
        this.props.onDiscardInputs();
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
                    <button title="В начало координат (Go to origin)"
                        onClick={this.handleClickGoToOriginBtn}
                    >
                        <i className="fas fa-compress"></i>
                    </button>
                    <EditorContext.Consumer>
                        {({ setScaleCallback }) => (
                            <EditorScaleSelector onChooseScale={setScaleCallback} />
                        )}
                    </EditorContext.Consumer>
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
                        <button className={"testMode-btn active"} onClick={this.handleClickChangeModeBtn}>
                            <i className="fas fa-pencil-alt"></i>
                            {"В режим редактирования"}
                        </button> :
                        <button className="testMode-btn" onClick={this.handleClickChangeModeBtn}>
                            <i className="fas fa-caret-square-right"></i>
                            {"В режим симуляции"}
                        </button>
                    }
                    <button className="doTact-btn" onClick={this.handleClickDoTactBtn} disabled={!isSimulationMode} >
                        {"Сделать такт"}
                    </button>
                    <button className="discard-inputs-btn" onClick={this.handleClickDiscardInputsBtn} disabled={!isSimulationMode} >
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

EditorActionsPanel.propTypes = {
    editorMode: PropTypes.string.isRequired,
    onSetMode: PropTypes.func.isRequired,
    onUpScale: PropTypes.func,
    onDownScale: PropTypes.func,
    onGoToOrigin: PropTypes.func,
    onDeleteSelected: PropTypes.func,
    onDoTact: PropTypes.func,
    onDiscardInputs: PropTypes.func,
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
};

export default connect(mapStateToProps, null)(EditorActionsPanel);
