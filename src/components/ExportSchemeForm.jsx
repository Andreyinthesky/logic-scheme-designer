import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { hideExportForm, setFilename } from "../redux/actions";

const forbiddenSymbols = ["/", "\\", ":", "*", "?", "\"", "<", ">"];

class ExportSchemeForm extends Component {
    constructor() {
        super();
        this.filenameInputElement = React.createRef();
        this.state = {
            hasError: false,
        }
    }

    handleClickForeground = (evt) => {
        if (evt.target !== evt.currentTarget)
            return;
        console.log("foreg", "close");
        this.closeForm();
    };

    handleClickOkBtn = () => {
        const filename = this.filenameInputElement.current.value.trim();
        if (this.validateFilename(filename)) {
            console.log("Ok");
            this.closeForm();
            this.props.setFilename(filename);
            this.props.onExportScheme(filename);
            return;
        }

        this.setState({ hasError: true });
    };

    handleClickCancelBtn = () => {
        console.log("cancel", "close");
        this.closeForm();
    };

    validateFilename = (filename) => {
        const filenameRegExpr = /(^[^/\\:*?"<>|]{1,150})$/;
        return filenameRegExpr.test(filename);
    }

    closeForm = () => {
        this.setState({ hasError: false }, () => {
            this.props.hideExportForm();
        });
    }

    render() {
        const { show, filename } = this.props;
        const { hasError } = this.state;

        if (!show) {
            return null;
        }

        return (
            <div className={"form-wrapper"} onClick={this.handleClickForeground}>
                <div className={"export-form"}>
                    <div className="export-form-body">
                        <label htmlFor="filename">Имя файла</label>
                        <input name="filename"
                            type="text"
                            defaultValue={filename}
                            ref={this.filenameInputElement}>
                        </input>
                        <span className="validation-error">
                            {hasError &&
                                `Имя файла не может быть пустым 
                             и содержать следующие символы: ${forbiddenSymbols.join(", ")}`}
                        </span>
                    </div>
                    <div className="export-form-actions">
                        <button onClick={this.handleClickOkBtn}>ОК</button>
                        <button onClick={this.handleClickCancelBtn}>Отмена</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    show: state.app.showExportForm,
    filename: state.editor.filename,
});

const mapDispatchToProps = {
    hideExportForm,
    setFilename
};

ExportSchemeForm.propTypes = {
    hideExportForm: PropTypes.func.isRequired,
    setFilename: PropTypes.func,
    onExportScheme: PropTypes.func.isRequired,
    show: PropTypes.bool,
    filename: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportSchemeForm);