import React, { Component } from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {showExportForm, showLoadForm } from "../redux/actions";


class AppActionsPanel extends Component {
    constructor() {
        super();
    }

    handleClickLoadBtn = () => {
        this.props.showLoadForm();
    };

    handleClickExportBtn = () => {
        this.props.showExportForm();
    };

    render() {
        return (
            <div className="app-control">
                <button onClick={this.handleClickLoadBtn}>
                    <i className="fas fa-plus"></i>
                    {"Новая схема" + "..."}
                </button>
                <button onClick={this.handleClickExportBtn}>
                    <i className="fas fa-download"></i>
                    {"Экспорт" + "..."}
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = {
    showExportForm,
    showLoadForm,
};

AppActionsPanel.propTypes = {
    showExportForm: PropTypes.func,
    showLoadForm: PropTypes.func,
}

export default connect(null, mapDispatchToProps)(AppActionsPanel);