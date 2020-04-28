import React, { Component } from "react";
import PropTypes from "prop-types";


export default class AppActionsPanel extends Component {
    constructor() {
        super();
    }

    handleClickLoadBtn = () => {
        console.log("load");
    };

    handleClickExportBtn = () => {
        this.props.onExportScheme();
    };

    render() {
        return (
            <div className="app-control">
                <button onClick={this.handleClickLoadBtn}>
                    <i className="fas fa-cloud-upload-alt"></i>
                    {"Загрузить" + "..."}
                </button>
                <button onClick={this.handleClickExportBtn}>
                    <i className="fas fa-download"></i>
                    {"Экспорт в файл" + "..."}
                </button>
            </div>
        );
    }
}

AppActionsPanel.propTypes = {
    onExportScheme: PropTypes.func,
}