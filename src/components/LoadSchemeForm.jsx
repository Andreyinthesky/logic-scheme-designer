import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { hideLoadForm, showNotification } from "../redux/actions";

class LoadSchemeForm extends Component {
    constructor() {
        super();
    }

    handleClickForeground = (evt) => {
        if (evt.target !== evt.currentTarget)
            return;
        this.closeForm();
    };

    handleClickNewSchemeArea = () => {
        this.props.onNewScheme();
        this.closeForm();
    }

    handleClickLoadSchemeArea = () => {
        this.createNativeFileInputElement().click();
    };

    validateSchemeData = (schemeData) => {
        return schemeData.nodes
            && schemeData.edges
            && schemeData.name
            && schemeData.index;
    }

    showFileLoadError = () => {
        this.props.showNotification({
            title: "Ошибка",
            type: "error",
            message: "Схему загрузить не удалось. Произошла ошибка при загрузке файла"
        });
    }

    loadInputFile = (fileInput) => {
        if (!fileInput || fileInput.files.length <= 0)
            return;

        const fileReader = new FileReader();

        fileReader.onload = () => {
            try {
                const schemeData = JSON.parse(fileReader.result);
                this.validateSchemeData(schemeData) && this.props.onImportScheme(schemeData);
                this.closeForm();
            } catch (error) {
                console.error(error.message);
                this.showFileLoadError();
            }
        }

        fileReader.onerror = () => {
            console.error(fileReader.error);
            this.showFileLoadError();
        }

        fileReader.readAsText(fileInput.files[0]);
    }

    createNativeFileInputElement = () => {
        const input = document.createElement("input");
        input.onchange = () => { this.loadInputFile(input) };
        input.type = "file";
        input.accept = ".json";

        return input;
    };

    closeForm = () => {
        this.props.hideLoadForm();
    }

    render() {
        const { show } = this.props;

        if (!show) {
            return null;
        }

        return (
            <div className={"form-wrapper"} onClick={this.handleClickForeground}>
                <div className={"load-form"}>
                    <div className="choise" onClick={this.handleClickNewSchemeArea}>
                        <div>
                            <i className="fas fa-file"></i>
                            <span>Новая схема</span>
                        </div>
                    </div>
                    <div className="choise" onClick={this.handleClickLoadSchemeArea}>
                        <div>
                            <i className="fas fa-cloud-upload-alt"></i>
                            <span>Загрузить cхему</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    show: state.app.showLoadForm,
});

const mapDispatchToProps = {
    hideLoadForm,
    showNotification,
};

LoadSchemeForm.propTypes = {
    hideLoadForm: PropTypes.func.isRequired,
    onImportScheme: PropTypes.func.isRequired,
    onNewScheme: PropTypes.func.isRequired,
    showNotification: PropTypes.func,
    show: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadSchemeForm);