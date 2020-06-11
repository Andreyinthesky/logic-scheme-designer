import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TactCounter from "./TactCounter";


class SchemeActionsPanel extends Component {
    constructor() {
        super();
    }

    handleClickDoTactBtn = () => {
        this.props.onDoTact();
    };

    handleClickDiscardInputsBtn = () => {
        this.props.onDiscardInputs();
    };

    // handleClickDiscardDelaysBtn = () => {
    //     this.props.onDiscardInputs();
    // };

    render() {
        const { show } = this.props;

        if (!show)
            return null;

        return (
            <div className="scheme-control__wrapper">
                <TactCounter />
                <div className="scheme-control">
                    <button className="doTact-btn" onClick={this.handleClickDoTactBtn} >
                        {"Сделать такт"}
                    </button>
                    <button className="discard-inputs-btn" onClick={this.handleClickDiscardInputsBtn} >
                        {"Сбросить входы"}
                    </button>
                    {/* <button className="discard-delays-btn" >
                        {"Сбросить задержки"}
                    </button> */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    show: state.editor.showSchemeControls,
});

SchemeActionsPanel.propTypes = {
    show: PropTypes.bool.isRequired,
    onDoTact: PropTypes.func.isRequired,
    onDiscardInputs: PropTypes.func.isRequired,
    // onDiscardDelays: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null)(SchemeActionsPanel);
