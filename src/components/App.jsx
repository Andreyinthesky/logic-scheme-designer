import React, { Component } from "react";
import PropTypes from "prop-types";
import { updateScale, setMode, setFilename, showNotification } from "../redux/actions";
import { connect } from "react-redux";

import LoadSchemeForm from "./LoadSchemeForm";
import ExportSchemeForm from "./ExportSchemeForm";
import Header from "./Header";
import EditorArea from "./EditorArea";
import { EditorContext } from "../contexts/editorContext";
import SchemeEditor from "../model/SchemeEditor";
import NotificationsArea from "./NotificationsArea";


class App extends Component {
    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    UNSAFE_componentWillUpdate() {
        console.log("I will update!");
    }

    componentDidMount() {
        const editor = new SchemeEditor(document.getElementById("mountNode"));
        this.editor = editor;
        this.bindEditorEvents(editor);
    }

    bindEditorEvents = (editor) => {
        editor.onWheel = (evt) => {
            const { deltaY } = evt;

            if (deltaY < 0) {
                this.upScale();
            } else {
                this.downScale();
            }
        };

        editor.onUpdateScale = (evt) => {
            this.props.updateScale(evt.scale);
        };

        editor.onChangeMode = (evt) => {
            this.props.setMode(evt.mode);
        }

        editor.afterImportScheme = (evt) => {
            const { schemeName } = evt;
            this.props.setFilename(schemeName);
            this.props.showNotification({
                message: `Схема "${schemeName}" успешно загружена`,
                type: "success"
            });
        }

        editor.onError = ({ error, focus }) => {
            this.props.showNotification({
                title: "Ошибка в построении схемы",
                type: "error",
                duration: 10000,
                message: error,
                focus
            });
        }
    }

    addNode = (type) => {
        this.editor.addNode(type);
    }

    deleteSelected = () => {
        this.editor.deleteSelectedItems();
    }

    setMode = (mode) => {
        this.editor.setMode(mode);
    }

    goToOrigin = () => {
        this.editor.goToOrigin();
    }

    upScale = () => {
        let scale = this.editor.getScale();
        scale = parseFloat((scale + 0.1).toFixed(1));
        this.editor.setScale(scale);
    }

    downScale = () => {
        let scale = this.editor.getScale();
        scale = parseFloat((scale - 0.1).toFixed(1));
        this.editor.setScale(scale);
    }

    evaluateScheme = () => {
        this.editor.evaluateScheme();
    };

    discardInputs = () => {
        this.editor.discardSchemeInputsState();
    };

    importScheme = (schemeData) => {
        this.editor.importScheme(schemeData);
    }

    exportSchemeToFile = (filename) => {
        const schemeData = this.editor.exportScheme(filename);
        const file = new Blob([JSON.stringify(schemeData)], { type: "application/json" });

        // MS browsers
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, `${schemeData.name}.json`);
        }
        else {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(file);
            link.download = schemeData.name;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }

        this.props.showNotification({message: "Схема успешно экспортирована", type: "success"});
    };

    render() {
        return (
            <>
                <EditorContext.Provider value={{
                    addNodeCallback: this.addNode,
                    upScaleCallback: this.upScale,
                    downScaleCallback: this.downScale,
                    deleteSelectedCallback: this.deleteSelected,
                    goToOriginCallback: this.goToOrigin,
                    setModeCallback: this.setMode,
                    doTactCallback: this.evaluateScheme,
                    discardInputsCallback: this.discardInputs,
                }}>
                    <Header />
                    <EditorArea />
                    <LoadSchemeForm onImportScheme={this.importScheme} />
                    <ExportSchemeForm onExportScheme={this.exportSchemeToFile} />
                    <NotificationsArea />
                </EditorContext.Provider>
            </>
        );
    }
}

App.propTypes = {
    updateScale: PropTypes.func,
    setMode: PropTypes.func,
    setFilename: PropTypes.func,
    showNotification: PropTypes.func
}

const mapStateToProps = state => ({
    filename: state.editor.filename
});

const mapDispatchToProps = {
    updateScale,
    setMode,
    setFilename,
    showNotification,
};

export default connect(null, mapDispatchToProps)(App);